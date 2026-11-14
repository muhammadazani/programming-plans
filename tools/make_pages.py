"""Stamp plans/<slug>.html for every plan data file, from tools/page-template.html.

Usage: python3 tools/make_pages.py

Each page's title and meta description come from the plan's data file
(data/plans/<slug>.js: `title` and `intent`), so adding a plan needs no change
here. Remember to set `live: true` for it in data/catalog.js.
"""
import html
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SUFFIX = " Animated trace and code in Python, Java, Rust, C and C++."

template = (ROOT / "tools" / "page-template.html").read_text(encoding="utf-8")
for data in sorted((ROOT / "data" / "plans").glob("*.js")):
    out = subprocess.run(["node", str(ROOT / "tools" / "dump_plan.js"), str(data)], capture_output=True, text=True, check=True)
    plan = json.loads(out.stdout)
    desc = f"The {plan['title']} programming plan ({plan['id']}): {plan['intent']}{SUFFIX}"
    page = (template.replace("__TITLE__", html.escape(plan["title"], quote=False))
            .replace("__DESC__", html.escape(desc))
            .replace("__SLUG__", data.stem))
    (ROOT / "plans" / f"{data.stem}.html").write_text(page, encoding="utf-8")
    print(f"wrote plans/{data.stem}.html")
