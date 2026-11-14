# buatkode · Programming Plans

A static, interactive catalogue of programming plans (counting, searching, classifying, nested loops…). Each plan has an animated trace and code in Python, Java, Rust, C and C++. The site is in English, with a Bahasa Indonesia edition under `/id/`. See [docs/SPEC-release-1.md](docs/SPEC-release-1.md) for the release 1 spec.

## Run it locally

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765/>. Any static host works (GitHub Pages, Netlify…): there is no server code, and no code is run in the browser.

## How it's organised

| Path | What it is |
|---|---|
| `data/catalog.js` | All 40 plans: ID, slug, title, one-line summary, level, and `live: true` once the card exists |
| `data/finder.js` | The plan finder's decision tree (questions → plans) |
| `index.html`, `assets/js/home.js` | Home page: the plan finder and the filterable catalogue |
| `references.html`, `license.html` | The References page (research, design inspiration, docs, fonts) and the Licence page |
| `data/plans/<slug>.js` | Everything on one card: text, code with step tags, trace logic, quiz, exercise, test cases |
| `assets/js/plan-card.js` | Draws any card from its data file. No plan-specific code lives here |
| `plans/<slug>.html` | Generated pages, made by `tools/make_pages.py` from `tools/page-template.html` |
| `tools/check_snippets.py` | Compiles and runs every snippet in every language |
| `tools/check_finder.js` | Checks the finder: every path ends at a real plan within 4 questions, every live plan is reachable |
| `tools/check_contrast.py` | Checks the colour pairs against WCAG AA |
| `assets/js/i18n.js` | Interface strings in English and Indonesian, and the merge of the Indonesian overlays |
| `data/id/` | Bahasa Indonesia overlays: `catalog.js`, `finder.js` and one `plans/<slug>.js` per card (text only; the code is shared) |
| `id/` | The Indonesian pages: home, references, licence, and the generated `id/plans/<slug>.html` |
| `tools/check_i18n.js` | Checks the Indonesian edition is complete and its traces match the English ones step for step |

## Check the code snippets

```bash
python3 tools/check_snippets.py
```

This needs `node`, `python3`, `java` (11+), `rustc`, `clang` and `clang++` (override with `CC` / `CXX`). For each plan it tests the plain and idiomatic code, every buggy snippet (it must fail the way the card says it does), and the exercise solution. It also checks the data's structure and dry-runs the trace for every preset. CI runs the same script, and a failure blocks the GitHub Pages deploy (`.github/workflows/site.yml`).

Useful flags: `--plan <slug>`, `--lang rust`, `--keep` (keeps the generated test programs in `build/snippets/`).

## Add a plan

1. Copy the data file of the most similar card in `data/plans/`. The trace types are `tiles` (D7), `pipeline` (A1), `branches` (B3) and `grid` (E1).
2. Fill in the text, the code for all five languages (tag each line with its step number), the trace `run()` function, and the `checks` test cases.
3. Write the Indonesian overlay in `data/id/plans/<slug>.js` and check it with `node tools/check_i18n.js <slug>`.
4. Run `python3 tools/make_pages.py` (it reads the title and summary from the data file) and set `live: true` in `data/catalog.js`.
5. Run `node tools/check_finder.js`; every live plan must be reachable from the finder.
6. Run `python3 tools/check_snippets.py --plan <slug>` until it's green.

## The Bahasa Indonesia edition

Each overlay in `data/id/plans/` repeats only the text of an English card (title, steps, pitfalls, quiz, exercise, and a copy of `trace.run()` with Indonesian messages). Objects are merged key by key and lists item by item, so the overlay keeps the same order and lengths as the English file. Code, snippets and test cases are never translated. After changing an English card, update its overlay and run:

```bash
node tools/check_i18n.js <slug>
python3 tools/make_pages.py
```

## Add a language

Add it to `LANGS` (and the keyword lists) in `assets/js/plan-card.js` and to `LANGS` plus the literal and program templates in `tools/check_snippets.py`. Then add that language's code to each plan's data file.

## Licence

- **Lesson content** (explanations, analogies, steps, pitfalls, quizzes, exercise tasks, finder questions, docs): [CC BY-SA 4.0](LICENSE-CONTENT.md).
- **Code** (the site, the tools, and the code snippets on the cards): [MIT](LICENSE).
