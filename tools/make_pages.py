"""Stamp plans/<slug>.html for every plan listed below from tools/page-template.html.

Usage: python3 tools/make_pages.py
Add a plan here once its data file (data/plans/<slug>.js) exists, and mark it
live in data/catalog.js.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = {
    "is-there-any": ("Is there any?", "The 'Is there any?' programming plan (existence check): walk a collection and answer yes at the first match."),
    "input-process-output": ("Input → process → output", "The input-process-output programming plan: name the inputs, convert units, apply the formula, return the result."),
    "multi-way-classification": ("Multi-way classification", "The multi-way classification programming plan: sort a value into one of several ranges with an if / else-if chain."),
    "rows-and-columns": ("Rows and columns", "The rows-and-columns programming plan: an outer loop for rows and an inner loop for columns to print 2D patterns."),
    "counting": ("Counting", "The counting programming plan: start a counter at zero and add one for every item that passes a test."),
    "accumulate": ("Accumulate", "The accumulate programming plan: fold every item into a running total, starting from a neutral value."),
    "average": ("Average", "The average programming plan: total and count in one loop, guarded against an empty list, then divide."),
    "largest-smallest": ("Largest / smallest", "The largest/smallest programming plan: start with the first item as the best so far and let every item challenge it."),
    "find-the-first": ("Find the first", "The find-the-first programming plan (linear search): return the position of the first match, or -1."),
    "are-all": ("Are all?", "The 'Are all?' programming plan (universal check): stop with no at the first item that fails."),
    "filter": ("Filter", "The filter programming plan: build a new list of only the items that pass a test."),
    "build-a-string": ("Build a string", "The build-a-string programming plan: walk the text and add one piece to the end of a new string for each character."),
    "guard": ("Guard", "The guard programming plan: handle the inputs that would break a calculation first, and return early."),
    "choose-one-of-two": ("Choose one of two", "The choose-one-of-two programming plan: an if / else that picks one of exactly two outcomes."),
    "repeat-n-times": ("Repeat n times", "The repeat-n-times programming plan: a counted loop that does the same work a known number of times."),
    "read-until-stop-value": ("Read until a stop value", "The read-until-a-stop-value programming plan (sentinel loop): read, test, process, read again."),
    "tidy-and-extract-text": ("Tidy and extract text", "The tidy-and-extract-text programming plan: trim, find the marker, check it, and slice out the part you need."),
}
SUFFIX = " Animated trace and code in Python, Java, Rust, C and C++."

template = (ROOT / "tools" / "page-template.html").read_text(encoding="utf-8")
for slug, (title, desc) in PAGES.items():
    html = (template.replace("__TITLE__", title)
            .replace("__DESC__", (desc + SUFFIX).replace('"', "&quot;"))
            .replace("__SLUG__", slug))
    (ROOT / "plans" / f"{slug}.html").write_text(html, encoding="utf-8")
    print("wrote plans/%s.html" % slug)
