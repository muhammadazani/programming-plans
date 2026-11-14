"""Stamp the plan card pages, in English and Bahasa Indonesia, from tools/page-template.html.

Usage: python3 tools/make_pages.py

  plans/<slug>.html     English  (data/plans/<slug>.js)
  id/plans/<slug>.html  Indonesian (the same data, plus data/id/plans/<slug>.js)

Titles and descriptions come from the data files, so adding a plan needs no
change here. Remember to set `live: true` for it in data/catalog.js.
"""
import html
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://muhammadazani.github.io/programming-plans/"

UI = {
    "en": {
        "siteName": "Programming Plans", "skip": "Skip to the animated trace", "navMain": "Main",
        "navPlans": "Plans", "navFinder": "Plan finder", "navRefs": "References", "navLicence": "Licence",
        "altLabel": "ID", "altTitle": "Baca dalam Bahasa Indonesia", "codeSettings": "Code settings",
        "codeIn": "Code in", "progLang": "Programming language", "style": "Style", "codeStyle": "Code style",
        "onPage": "On this page", "tocWatch": "Watch", "tocSteps": "Steps", "tocCode": "Code",
        "tocPitfalls": "Pitfalls", "tocTry": "Try it", "tocCompare": "Compare", "siteInfo": "Site information",
        "source": "Source on GitHub", "textWord": "Text", "codeWord": "code",
        "footerNote": "Programming plans after Soloway &amp; Ehrlich (1984); variable roles after Sajaniemi (2002).",
        "descTail": "Animated trace and code in Python, Java, Rust, C and C++.", "descPlan": "programming plan",
    },
    "id": {
        "siteName": "Skema Pemrograman", "skip": "Langsung ke animasi penelusuran", "navMain": "Utama",
        "navPlans": "Skema", "navFinder": "Pencari skema", "navRefs": "Referensi", "navLicence": "Lisensi",
        "altLabel": "EN", "altTitle": "Read in English", "codeSettings": "Pengaturan kode",
        "codeIn": "Kode", "progLang": "Bahasa pemrograman", "style": "Gaya", "codeStyle": "Gaya kode",
        "onPage": "Di halaman ini", "tocWatch": "Lihat", "tocSteps": "Langkah", "tocCode": "Kode",
        "tocPitfalls": "Jebakan", "tocTry": "Coba", "tocCompare": "Bandingkan", "siteInfo": "Informasi situs",
        "source": "Kode sumber di GitHub", "textWord": "Teks", "codeWord": "kode",
        "footerNote": "Skema pemrograman mengikuti Soloway &amp; Ehrlich (1984); peran variabel mengikuti Sajaniemi (2002).",
        "descTail": "Animasi penelusuran dan kode dalam Python, Java, Rust, C dan C++.", "descPlan": "skema pemrograman",
    },
}


# Loads a plan (and, for Indonesian, its overlay plus i18n.js, which merges them)
# the same way the browser does, and prints the result as JSON.
# With `node -e`, the extra arguments start at process.argv[1].
NODE_SCRIPT = """
const fs = require('fs'), vm = require('vm');
const ctx = { window: {}, document: { documentElement: { lang: process.argv[1] } } };
vm.createContext(ctx);
for (const f of process.argv.slice(2)) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
process.stdout.write(JSON.stringify(ctx.window.PLAN));
"""


template = (ROOT / "tools" / "page-template.html").read_text(encoding="utf-8")
count = 0
for data in sorted((ROOT / "data" / "plans").glob("*.js")):
    slug = data.stem
    for lang in ("en", "id"):
        files = [str(data)]
        overlay = ROOT / "data" / "id" / "plans" / f"{slug}.js"
        if lang == "id":
            if not overlay.exists():
                continue  # no translation yet: no Indonesian page
            files += [str(overlay), str(ROOT / "assets" / "js" / "i18n.js")]
        out = subprocess.run(["node", "-e", NODE_SCRIPT, lang, *files], capture_output=True, text=True, check=True)
        plan = json.loads(out.stdout)
        ui = UI[lang]
        desc = f"{plan['title']} ({plan['id']}), {ui['descPlan']}: {plan['intent']} {ui['descTail']}"
        root = "../" if lang == "en" else "../../"
        values = dict(ui)
        values.update({
            "lang": lang, "title": html.escape(plan["title"], quote=False), "desc": html.escape(desc), "slug": slug, "root": root,
            "urlEn": f"{SITE}plans/{slug}.html", "urlId": f"{SITE}id/plans/{slug}.html",
            "altHref": f"../id/plans/{slug}.html" if lang == "en" else f"../../plans/{slug}.html",
            "altLang": "id" if lang == "en" else "en",
            "catalogOverlay": f'  <script src="{root}data/id/catalog.js"></script>\n' if lang == "id" else "",
            "planOverlay": f'  <script src="{root}data/id/plans/{slug}.js"></script>\n' if lang == "id" else "",
        })
        page = template
        for k, v in values.items():
            page = page.replace("{{" + k + "}}", v)
        assert "{{" not in page, f"unfilled placeholder in {lang}/{slug}"
        target = ROOT / ("plans" if lang == "en" else "id/plans") / f"{slug}.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(page, encoding="utf-8")
        count += 1
print(f"wrote {count} pages")
