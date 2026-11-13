#!/usr/bin/env python3
"""Check WCAG contrast for the text/background colour pairs the site uses.
Normal text needs 4.5:1 (AA); large or bold-large text and UI parts need 3:1.
Usage: python3 tools/check_contrast.py"""
import re, sys
from pathlib import Path

css = (Path(__file__).resolve().parent.parent / "assets/css/site.css").read_text()
tok = dict(re.findall(r"--([\w-]+):\s*(#[0-9a-fA-F]{6})", css.split("}")[0]))

def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)

v = lambda x: tok[x[2:]] if x.startswith("--") else x
PAIRS = [  # (text, background, needed, where)
    ("--ink", "--bg", 4.5, "body text on the page"),
    ("--ink-2", "--bg", 4.5, "secondary text on the page"),
    ("--ink-3", "--bg", 4.5, "muted text on the page"),
    ("--ink-3", "#ffffff", 4.5, "muted text on cards"),
    ("--ink-3", "#f3f6fc", 4.5, "checked tiles"),
    ("--blue", "#ffffff", 4.5, "links and kickers"),
    ("#ffffff", "--blue", 4.5, "primary buttons"),
    ("--blue-dark", "--blue-soft", 4.5, "selected chips"),
    ("#8a5a00", "--amber-soft", 4.5, "core chip"),
    ("#7a4f00", "--amber-soft", 4.5, "coming-soon labels"),
    ("#9a6700", "#ffffff", 4.5, "nav 'soon' label"),
    ("--green", "--green-soft", 4.5, "passing results"),
    ("--red", "--red-soft", 4.5, "failing results"),
    ("--code-ink", "--code-bg", 4.5, "code"),
    ("#8b9bc4", "--code-bg", 4.5, "code comments"),
    ("#b9c7ea", "--code-bg", 4.5, "code notes"),
    ("#b3c2e6", "#17254d", 4.5, "code header"),
    ("--ink", "--amber", 4.5, "matched tile"),
    ("#ffd166", "--ink", 4.5, "stop tile and tags"),
]
bad = 0
for fg, bg, need, where in PAIRS:
    r = ratio(v(fg), v(bg))
    ok = r >= need
    bad += not ok
    print(f"{'ok ' if ok else 'LOW'} {r:5.2f}:1 (needs {need})  {where:26} {v(fg)} on {v(bg)}")
sys.exit(1 if bad else 0)
