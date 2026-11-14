#!/usr/bin/env python3
"""Compile and run every code snippet on every plan card, in every language.

For each data/plans/<slug>.js this checks:
  * the plain and idiomatic implementations against `checks.cases`
  * each buggy snippet against `checks.snippets[<name>]` (the bug must behave as
    the quiz and pitfalls say it does)
  * the exercise solution against `exercise.tests`
  * the data's structure: every language present, step tags valid, the trace
    runs for every preset

A test program is generated per (snippet, language): the snippet itself, plus a
small `main` that calls it with each case and compares the result (or the
printed output) with the expected value.

Usage:
  python3 tools/check_snippets.py                 # everything
  python3 tools/check_snippets.py --plan rows-and-columns --lang rust
  python3 tools/check_snippets.py -j 4 --keep     # keep generated sources

Needs: node, python3, java (11+), rustc, a C compiler and a C++20 compiler.
Override the compilers with CC / CXX environment variables (default clang / clang++).
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import json
import os
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANGS = ["python", "java", "rust", "c", "cpp"]
END = "@@END@@"
CC = os.environ.get("CC", "clang")
CXX = os.environ.get("CXX", "clang++")
OK, BAD = "\u2713", "\u2717"


# ---------------------------------------------------------------- literals
def lit(lang: str, typ: str, v) -> str:
    if typ == "int":
        return str(int(v))
    if typ == "string":
        return json.dumps(v)
    if typ == "bool":
        return ("True" if v else "False") if lang == "python" else ("true" if v else "false")
    if typ == "int[][]":
        rows = [", ".join(str(int(x)) for x in r) for r in v]
        if lang == "c":  # C convention: a flattened rectangular grid plus its row and column counts
            flat = ", ".join(", ".join(str(int(x)) for x in r) for r in v)
            return f"(int[]){{{flat}}}, {len(v)}, {len(v[0])}" if v and v[0] else "NULL, 0, 0"
        return {
            "python": "[" + ", ".join(f"[{r}]" for r in rows) + "]",
            "java": "new int[][]{" + ", ".join(f"{{{r}}}" for r in rows) + "}",
            "rust": "&[" + ", ".join(f"vec![{r}]" for r in rows) + "]",
            "cpp": "std::vector<std::vector<int>>{" + ", ".join(f"{{{r}}}" for r in rows) + "}",
        }[lang]
    if typ == "int[]":
        items = ", ".join(str(int(x)) for x in v)
        return {
            "python": f"[{items}]",
            "java": f"new int[]{{{items}}}",
            "rust": f"&[{items}]",
            "c": f"(int[]){{{items}}}, {len(v)}" if v else "NULL, 0",
            "cpp": f"std::vector<int>{{{items}}}",
        }[lang]
    raise ValueError(f"unsupported parameter type {typ!r}")


def args_src(lang: str, params: list[str], args: list) -> str:
    return ", ".join(lit(lang, t, a) for t, a in zip(params, args))


def call(lang: str, fn: str, params: list[str], args: list) -> str:
    return f"{fn}({args_src(lang, params, args)})"


def expect_lit(lang: str, typ: str, v) -> str:
    if typ == "bool":
        return ("True" if v else "False") if lang == "python" else ("true" if v else "false")
    if typ == "int":
        return str(int(v))
    if typ == "double":
        return repr(float(v))
    if typ == "string":
        return json.dumps(v)
    raise ValueError(f"unsupported return type {typ!r}")


def check_expr(lang: str, typ: str, got: str, exp_v) -> str:
    if typ == "int[]":
        items = ", ".join(str(int(x)) for x in exp_v)
        return {
            "python": f"{got} == [{items}]",
            "java": f"{got}.equals(List.of({items}))",
            "rust": f"{got} == vec![{items}] as Vec<i32>",
            "cpp": f"{got} == std::vector<int>{{{items}}}",
        }[lang]
    if typ == "text":  # a newly built string (C writes it into a caller-provided buffer)
        typ = "string"
    e = expect_lit(lang, typ, exp_v)
    if typ == "double":
        return f"approx_eq({got}, {e})"
    if typ == "string":
        return {
            "python": f"{got} == {e}",
            "java": f"{got}.equals({e})",
            "rust": f"{got} == {e}",
            "c": f"strcmp({got}, {e}) == 0",
            "cpp": f"{got} == std::string({e})",
        }[lang]
    if lang == "python" and typ == "bool":
        return f"{got} is {e}"
    return f"{got} == {e}"


# ---------------------------------------------------------------- programs
def build_program(lang: str, code: str, fn: str, params: list[str], returns: str, cases: list[dict]) -> tuple[str, str]:
    """Return (source, expected_stdout)."""
    stdout_mode = returns == "void"
    expected = "".join(c["stdout"] + END + "\n" for c in cases) if stdout_mode else ""
    body: list[str] = []
    for i, c in enumerate(cases):
        cl = call(lang, fn, params, c["args"])
        desc = json.dumps(f"case {i + 1}: {cl}")
        if stdout_mode:
            body.append({
                "python": f'{cl}\nprint("{END}")',
                "java": f'{cl};\nSystem.out.println("{END}");',
                "rust": f'{cl};\nprintln!("{END}");',
                "c": f'{cl};\nprintf("{END}\\n");',
                "cpp": f'{cl};\nstd::cout << "{END}\\n";',
            }[lang])
        elif lang == "c" and returns == "int[]":
            # C convention: size_t f(<inputs>, int out[]) returns how many items it wrote
            want = [int(x) for x in c["expect"]]
            items = ", ".join(map(str, want)) or "0"
            body.append(
                f"{{ int out[64]; size_t k = {fn}({args_src(lang, params, c['args'])}, out); int want[] = {{{items}}}; (void)want;\n"
                f"  if (!(k == {len(want)} && memcmp(out, want, {len(want)} * sizeof(int)) == 0)) {{ fprintf(stderr, \"FAIL %s\\n\", {desc}); fails++; }} }}")
            continue
        elif lang == "c" and returns == "text":
            # C convention: void f(<inputs>, char out[]) writes a terminated string into out
            body.append(
                f"{{ char out[256]; {fn}({args_src(lang, params, c['args'])}, out);\n"
                f"  if (strcmp(out, {json.dumps(c['expect'])}) != 0) {{ fprintf(stderr, \"FAIL %s (got \\\"%s\\\")\\n\", {desc}, out); fails++; }} }}")
            continue
        else:
            cond = check_expr(lang, returns, cl, c["expect"])
            body.append({
                "python": f"_check({cond}, {desc})",
                "java": f"check({cond}, {desc});",
                "rust": f"if !({cond}) {{ eprintln!(\"FAIL {{}}\", {desc}); fails += 1; }}",
                "c": f'if (!({cond})) {{ fprintf(stderr, "FAIL %s\\n", {desc}); fails++; }}',
                "cpp": f'if (!({cond})) {{ std::cerr << "FAIL " << {desc} << "\\n"; fails++; }}',
            }[lang])

    ind = lambda lines, n: "\n".join(" " * n + l for b in lines for l in b.split("\n"))
    if lang == "python":
        src = f"""{code}

_fails = 0
def approx_eq(g, e):
    return isinstance(g, (int, float)) and not isinstance(g, bool) and abs(g - e) <= 1e-6 * max(1.0, abs(e))
def _check(ok, desc):
    global _fails
    if not ok:
        import sys
        print("FAIL " + desc, file=sys.stderr)
        _fails += 1

{ind(body, 0)}
raise SystemExit(1 if _fails else 0)
"""
    elif lang == "java":
        src = f"""import java.util.*;
import java.util.stream.*;
import java.io.*;

public class Main {{
    static int fails = 0;
    static boolean approx_eq(double g, double e) {{ return Math.abs(g - e) <= 1e-6 * Math.max(1.0, Math.abs(e)); }}
    static void check(boolean ok, String desc) {{ if (!ok) {{ System.err.println("FAIL " + desc); fails++; }} }}

{ind([code], 4)}

    public static void main(String[] args) {{
{ind(body, 8)}
        System.out.flush();
        if (fails > 0) System.exit(1);
    }}
}}
"""
    elif lang == "rust":
        src = f"""#![allow(dead_code, unused)]
fn approx_eq(g: f64, e: f64) -> bool {{ (g - e).abs() <= 1e-6 * e.abs().max(1.0) }}

{code}

fn main() {{
    let mut fails = 0;
{ind(body, 4)}
    if fails > 0 {{ std::process::exit(1); }}
}}
"""
    elif lang == "c":
        src = f"""#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <ctype.h>
__attribute__((unused)) static int approx_eq(double g, double e) {{ return fabs(g - e) <= 1e-6 * fmax(1.0, fabs(e)); }}

{code}

int main(void) {{
    int fails = 0;
{ind(body, 4)}
    fflush(stdout);
    return fails ? 1 : 0;
}}
"""
    else:  # cpp
        src = f"""#include <algorithm>
#include <cctype>
#include <cmath>
#include <iterator>
#include <map>
#include <numeric>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <cstdio>
#include <iostream>
#include <string>
#include <vector>
[[maybe_unused]] static bool approx_eq(double g, double e) {{ return std::fabs(g - e) <= 1e-6 * std::fmax(1.0, std::fabs(e)); }}

{code}

int main() {{
    int fails = 0;
{ind(body, 4)}
    std::cout.flush();
    return fails ? 1 : 0;
}}
"""
    return src, expected


def run(cmd: list[str], cwd: Path, timeout: int) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout)


def compile_and_run(lang: str, src: str, work: Path, strict: bool) -> tuple[bool, str, str]:
    """Return (ok, stdout, diagnostics)."""
    try:
        if lang == "python":
            (work / "main.py").write_text(src)
            p = run([sys.executable, "-I", "main.py"], work, 20)
        elif lang == "java":
            (work / "Main.java").write_text(src)
            p = run(["java", "Main.java"], work, 120)
        else:
            ext, cmd = {
                "rust": ("rs", ["rustc", "--edition", "2021", "-o", "main", "main.rs"]),
                "c": ("c", [CC, "-std=c11", "-Wall", "-Wextra", *(["-Werror"] if strict else []), "-o", "main", "main.c", "-lm"]),
                "cpp": ("cpp", [CXX, "-std=c++20", "-Wall", "-Wextra", *(["-Werror"] if strict else []), "-o", "main", "main.cpp"]),
            }[lang]
            (work / f"main.{ext}").write_text(src)
            c = run(cmd, work, 180)
            if c.returncode != 0:
                return False, "", "compile error:\n" + (c.stderr or c.stdout)
            p = run(["./main"], work, 20)
        return p.returncode == 0, p.stdout, p.stderr
    except subprocess.TimeoutExpired:
        return False, "", "timed out"
    except FileNotFoundError as e:
        return False, "", f"tool not found: {e.filename}"


# ---------------------------------------------------------------- units
@dataclass
class Unit:
    plan: str
    lang: str
    label: str
    code: str
    fn: str
    params: list
    returns: str
    cases: list
    strict: bool = True
    result: str = ""
    ok: bool = False
    detail: str = field(default="", repr=False)


def code_text(lines) -> str:
    return "\n".join(l if isinstance(l, str) else l[1] for l in lines)


def load_plan(path: Path) -> dict:
    out = subprocess.run(["node", str(ROOT / "tools" / "dump_plan.js"), str(path)], capture_output=True, text=True)
    if out.returncode != 0:
        raise RuntimeError(f"{path.name}: could not load data\n{out.stderr}")
    return json.loads(out.stdout)


def structure_errors(P: dict) -> list[str]:
    errs = list(P.get("__traceErrors", []))
    step_ids = {s["n"] for s in P["steps"]}
    for lang in LANGS:
        L = P["impl"].get(lang)
        if not L:
            errs.append(f"impl.{lang} missing")
            continue
        variants = [("plain", L.get("plain"))]
        if L.get("idiomatic"):
            variants.append(("idiomatic", L["idiomatic"]))
        elif not L.get("idiomaticNote"):
            errs.append(f"impl.{lang}: no idiomatic version and no idiomaticNote")
        for name, v in variants:
            if not v or not v.get("lines"):
                errs.append(f"impl.{lang}.{name}: no lines")
                continue
            used = set()
            for s, _ in v["lines"]:
                for n in (s if isinstance(s, list) else [s] if s else []):
                    if n not in step_ids:
                        errs.append(f"impl.{lang}.{name}: unknown step {n}")
                    used.add(n)
            if name == "plain" and used != step_ids:
                errs.append(f"impl.{lang}.plain: steps {sorted(step_ids - used)} never tagged")
        if lang not in P["exercise"]["solutions"]:
            errs.append(f"exercise.solutions.{lang} missing")
        if lang not in P.get("fn", {}):
            errs.append(f"fn.{lang} missing")
        if lang not in P["exercise"].get("fn", {}):
            errs.append(f"exercise.fn.{lang} missing")
    for name, snip in P.get("snippets", {}).items():
        missing = [l for l in LANGS if l not in snip]
        if missing:
            errs.append(f"snippets.{name}: missing {missing}")
        if name not in P["checks"].get("snippets", {}):
            errs.append(f"snippets.{name}: no test cases in checks.snippets")
    for q in P["quiz"]:
        if q.get("code") and q["code"] not in P.get("snippets", {}):
            errs.append(f"quiz refers to unknown snippet {q['code']!r}")
    return errs


def units_for(P: dict, langs: list[str]) -> list[Unit]:
    ch, ex, slug = P["checks"], P["exercise"], P["slug"]
    units = []
    for lang in langs:
        L = P["impl"][lang]
        units.append(Unit(slug, lang, "plain", code_text(L["plain"]["lines"]), P["fn"][lang], ch["params"], ch["returns"], ch["cases"]))
        if L.get("idiomatic"):
            units.append(Unit(slug, lang, "idiomatic", code_text(L["idiomatic"]["lines"]), P["fn"][lang], ch["params"], ch["returns"], ch["cases"]))
        for name, cases in ch.get("snippets", {}).items():
            units.append(Unit(slug, lang, f"bug:{name}", code_text(P["snippets"][name][lang]), P["fn"][lang], ch["params"], ch["returns"], cases, strict=False))
        units.append(Unit(slug, lang, "exercise", code_text(ex["solutions"][lang]), ex["fn"][lang], ex["params"], ex["returns"], ex["tests"]))
    return units


def execute(u: Unit, keep_dir: Path | None) -> Unit:
    src, expected = build_program(u.lang, u.code, u.fn, u.params, u.returns, u.cases)
    work = Path(tempfile.mkdtemp(prefix=f"plan-{u.lang}-"))
    try:
        ok, out, diag = compile_and_run(u.lang, src, work, u.strict)
        if ok and u.returns == "void" and out != expected:
            ok, diag = False, f"printed output differs\nexpected: {expected!r}\ngot:      {out!r}"
        u.ok, u.detail = ok, diag.strip()
        if keep_dir:
            d = keep_dir / u.plan / u.lang
            d.mkdir(parents=True, exist_ok=True)
            (d / f"{u.label.replace(':', '_')}.{ {'python': 'py', 'java': 'java', 'rust': 'rs', 'c': 'c', 'cpp': 'cpp'}[u.lang] }").write_text(src)
    finally:
        shutil.rmtree(work, ignore_errors=True)
    return u


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--plan", action="append", help="only this plan slug (repeatable)")
    ap.add_argument("--lang", action="append", choices=LANGS, help="only this language (repeatable)")
    ap.add_argument("-j", "--jobs", type=int, default=os.cpu_count() or 4)
    ap.add_argument("--keep", action="store_true", help="keep generated programs in build/snippets/")
    a = ap.parse_args()

    langs = a.lang or LANGS
    files = sorted((ROOT / "data" / "plans").glob("*.js"))
    if a.plan:
        files = [f for f in files if f.stem in a.plan]
    keep_dir = ROOT / "build" / "snippets" if a.keep else None

    failed = 0
    units: list[Unit] = []
    for f in files:
        P = load_plan(f)
        errs = structure_errors(P)
        if errs:
            failed += len(errs)
            print(f"✗ {f.stem}: data problems")
            for e in errs:
                print(f"    - {e}")
        units += units_for(P, langs)

    with cf.ThreadPoolExecutor(max_workers=a.jobs) as pool:
        done = list(pool.map(lambda u: execute(u, keep_dir), units))

    by_plan: dict[str, list[Unit]] = {}
    for u in done:
        by_plan.setdefault(u.plan, []).append(u)
    for plan, us in by_plan.items():
        bad = [u for u in us if not u.ok]
        print(f"{'✓' if not bad else '✗'} {plan}: {len(us) - len(bad)}/{len(us)} snippets pass")
        for u in bad:
            print(f"    ✗ {u.lang:<6} {u.label}")
            for line in u.detail.splitlines()[:15]:
                print(f"        {line}")
        failed += len(bad)

    total = len(done)
    print(f"\n{total - sum(1 for u in done if not u.ok)}/{total} snippets pass across {len(by_plan)} plans and {len(langs)} languages.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
