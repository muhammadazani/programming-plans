# Programming Plans: Release 1 spec

**Product:** buatkode · Programming Plans, a free, static, interactive catalogue of programming plans
**Status:** Draft v0.1 · 2026-11-13
**Source material:** the BBK1AAB4 *Katalog Skema Pemrograman* (40 cards, groups A–G), rewritten for a general audience
**Prototype:** [`is-there-any.html`](../is-there-any.html) (D7), which serves as the reference implementation for every card

---

## 1. Problem statement

Beginners learn syntax (`for`, `if`, lists), but they still freeze in front of a problem like *"is any score below 50?"* because they don't recognise which **plan** solves it. Experienced programmers solve these problems by recalling a small set of reusable plans: counting, accumulating, searching, "is there any?" (Soloway & Ehrlich, 1984). Those plans are rarely taught by name. Existing resources either teach one language's syntax (tutorials) or teach object-oriented *design* patterns (e.g. Refactoring.guru), which are aimed at a different, more advanced level.

Without a resource like this, self-taught beginners and CS students rely on trial and error. They copy solutions they don't understand, and they keep making the same handful of bugs (giving up inside the loop, starting `max` at 0, dividing by zero on an empty list).

## 2. Goals

1. **Recognition:** a beginner can name the right plan for a new problem. *Measure:* in a moderated test, at least 4 of 5 beginners pick the correct plan for 3 unseen problems after using the site.
2. **Transfer across languages:** readers see that a plan stays the same across languages. *Measure:* at least 30% of card sessions switch language or style at least once.
3. **Active learning, not just reading:** visitors interact rather than scroll past. *Measure:* at least 40% of card sessions step through the trace or answer at least one quiz question.
4. **Findability:** students land on a card from search. *Measure:* organic search makes up at least 50% of entries by month 3.
5. **Trustworthy code:** every snippet is correct. *Measure:* 100% of snippets compile and pass tests in CI, and zero confirmed code bugs are reported in the first month.

## 3. Non-goals (release 1)

| Not doing | Why |
|---|---|
| **Accounts, logins, saved progress on a server** | Keeps the site static and free to host. Browser storage covers "where was I". |
| **Running learners' code in the browser** (any language) | Decided 2026-11-14: the site stays a plain static site with no code execution. The trace, the quiz and test-case tables teach the plan; readers run their code in their own editor. |
| **All 40 plans** | 40 plans × 5 languages × 2 styles is about 400 snippets. Release 1 ships the 17 core plans fully and lists the rest as "coming soon". |
| **Bahasa Indonesia edition** | English first for the international audience. The data model keeps text separate so a translation can follow. |
| **Object-oriented design patterns** | A different level and audience. Refactoring.guru already covers them well. |
| **Teacher features** (printable cards, slide mode, class dashboards) | The target audience is learners. Revisit if teachers ask for it. |
| **Comments or community features** | They need moderation and a backend. A single feedback link is enough for now. |

## 4. Audience and user stories

**Personas**
- **Sam, a self-taught beginner.** Learns from free tutorials, has no teacher, and doesn't know what an "accumulator" is.
- **Rina, a CS student.** Mid-assignment or revising for an exam, arrives from a search like *"find largest value in list java"*, and lands deep on a single card.

**Self-taught beginner (Sam)**, in priority order
1. As a beginner stuck on a problem, I want to answer a few questions about it and be pointed to the right plan, so that I know where to start.
2. As a beginner, I want to watch the plan run on real data step by step, so that I understand *why* it works, not just what to type.
3. As a beginner, I want to know the common mistakes for a plan before I make them, so that I don't lose an hour to a bug.
4. As a beginner, I want to check my understanding with quick questions and a small exercise, so that I know I've actually got it.
5. As a beginner, I want a suggested order to learn the plans in, so that I don't hit a plan before I'm ready for it.
6. As a beginner whose browser blocks storage or who is offline after the first load, I still want the page to work fully.

**CS student (Rina)**
1. As a student arriving from search, I want the card to make sense on its own and show code in *my* language immediately, so that I get my answer without reading other pages.
2. As a student revising for an exam, I want to compare look-alike plans side by side (count vs sum, any vs all), so that I stop mixing them up.
3. As a student who knows the plan, I want to see my language's idiomatic shortcut (`any()`, `anyMatch`, `std::ranges::any_of`), so that I can write it the professional way.
4. As a student, I want my language choice remembered across cards, so that I don't have to re-select it every time.

## 5. Requirements

### P0: must ship

**R1. Plan card template.** Every live card follows the D7 prototype's section order: header (code, name, also-known-as, one-sentence intent, level) → everyday analogy → when to use it (cue words and example problems) → animated trace → steps ↔ code → same plan in all languages → pitfalls (do / don't) → try it (quiz and exercise) → don't confuse it with… → where it fits.
- [ ] Each section renders from the card's data file. No card-specific HTML or JavaScript.
- [ ] Each card has its own URL (`/plans/<slug>`), `<title>` and meta description.
- [ ] Each card has a short analogy, at least 4 cue words, at least 3 example problems, 3 to 4 numbered steps, at least 3 pitfalls and at least 3 quiz questions.

**R2. Five languages: Python, Java, Rust, C, C++.**
- [ ] The "same plan in every language" section has a language picker (checkboxes plus "All"). By default it shows only the toolbar language; at least one stays selected; the choice is remembered.
- [ ] Every live card has a plain-loop implementation in all five languages.
- [ ] Every code line is tagged with its step number(s), so the step highlighting and the trace work in any language.
- [ ] An idiomatic version is shown where the language has one. Where it doesn't (e.g. C `any`), a note explains why, and the plain loop is shown instead.
- [ ] The language and style apply site-wide, are saved in browser storage (with a safe fallback when storage is blocked), and can be set in the URL (`?lang=rust`).
- [ ] Adding a language later needs only (a) one entry in the language registry and (b) data. No changes to the template.

**R3. Animated trace.**
- [ ] Step forward and back, play/pause and reset, with preset inputs including an edge case (empty input, or no match).
- [ ] The current code line is highlighted in the selected language, in sync with the step.
- [ ] Variables are shown with their role label (walker, best-so-far, counter, one-way flag…).
- [ ] Readers can enter their own input, with validation and a capped length.
- [ ] Three visual types cover the 17 core plans: **tiles** (collections: D, E), **branches** (decisions: B), **pipeline** (formula: A). Loop plans (C) use tiles over the iterations.

**R4. Try it.**
- [ ] Predict-the-output and spot-the-bug questions with instant feedback and an explanation. Answers survive a language switch.
- [ ] One "write the plan yourself" exercise per card: the task, the plan's steps, a table of test cases (call → expected result or printed output) shown in the reader's language, and a solution in every language behind a "Show solution" button. No code runs in the browser.

**R5. Compare view.** Each card compares itself with 2 to 3 confusable siblings on the same data, showing where each one stops, plus a summary table.

**R6. Catalogue index (home).**
- [ ] Shows all 40 plans grouped A–G, with counts. The 17 live plans are clickable; the 23 others are marked "Coming soon".
- [ ] Filter by level (Foundations / Core / Advanced) and by group.
- [ ] Each card tile shows the code, name, one-line intent and a small animated or static thumbnail in the cube style.

**R7. Plan finder.** A guided question flow built from the original decision table. It ends on a live card, or on a coming-soon card with a suggested live alternative.
- [ ] At most 4 questions to any result. Every question has a "not sure" path.
- [ ] Driven by a data file, so new plans can be added to the tree without code changes.

**R8. Tested code.**
- [ ] A script extracts every snippet (implementations, solutions and the expected outputs of buggy snippets) and compiles and runs it against test cases in all five languages.
- [ ] It runs in CI on every push. A failing snippet blocks deployment.

**R9. Quality bar.**
- [ ] Usable with only a keyboard (trace controls, tabs, quiz), with visible focus.
- [ ] Respects `prefers-reduced-motion`.
- [ ] Colour contrast meets WCAG AA.
- [ ] No horizontal scrolling at 360 px wide.
- [ ] Static hosting (GitHub Pages) with no server and no build step needed to *view* the site.

### P1: fast follow

- **Cue-word highlighter:** paste a problem statement, its cue words are highlighted and matching plans are suggested.
- **Learning path:** Foundations → Core → Advanced, following "builds on" links, with progress saved in the browser ("4 of 17 done").
- **Pre-rendered HTML** for each card (a small build step), so search engines and link previews see the content without running JavaScript.
- **Trace condition picker:** switch the condition (negative / even / > 100) and watch the code update.
- **Dark mode** using the same navy and amber palette.
- **Feedback link** on each card ("Was this useful? / Report a bug").

### P2: future (design for it, don't build it)

- **More languages** (JavaScript, Go, Kotlin…). The language registry and the per-line step tags already make this a data-only change.
- **The remaining 23 plans.** The index, finder and related links already reference them by ID.
- **Translations** (Bahasa Indonesia first). Keep all user-facing text in data, never in the template.
- **Composer** for combining plans (sequential, nested, merged), using the original *Menggabungkan skema* section.
- **Running code in the browser**, if it's reconsidered later (Pyodide for Python, WebAssembly toolchains for the others). The exercise data (tests per case) already supports automated checking.

## 6. Release 1 plan list

**Live (17 core plans).** The code shows the original card ID.

| Group | Plans |
|---|---|
| A · Sequence | A1 Input → process → output · A4 Tidy and extract text |
| B · Selection | B1 Guard · B2 Choose one of two · B3 Multi-way classification |
| C · Loop control | C1 Repeat n times · C2 Read until a stop value |
| D · Single pass over data | D1 Counting · D2 Accumulate · D3 Average · D4 Largest / smallest · D6 Find the first · **D7 Is there any?** ✅ prototype · D8 Are all? · D9 Filter · D11 Build a string |
| E · Nested loops | E1 Rows and columns |

**Coming soon (23):** A2 Swap · A3 Split with div and mod · B4 Two-factor decision · B5 Lookup table · C3 Ask again until valid · C4 Repeat until a target · C5 Menu loop · D5 Position of the largest · D10 Transform each item · D12 Compare with the previous item · D13 Longest run · D14 Count per category · D15 Count occurrences · D16 Peel off digits · E2 Every pair · E3 Walk a 2D table · F1 Two pointers · F2 Binary search · F3 Selection sort · F4 Remember what you've seen · G1 Predicate function · G2 Generate and test · G3 Recursion

**Rewrite rules for the content** (from the course version to the general version)
- Remove week tags, course codes, institution names and currency-specific examples.
- Every example uses everyday, culture-neutral data (scores, temperatures, words, transactions).
- English throughout, at a beginner's reading level: short sentences, every term defined the first time it appears.
- The variable-role names (Sajaniemi) become plain English labels: walker, counter, best-so-far, gatherer, one-way flag, follower, temporary, container, fixed value, stepper.

## 7. Success metrics

Analytics must be privacy-friendly and cookie-less (see Q3).

| Type | Metric | Success | Stretch | When |
|---|---|---|---|---|
| Leading | Card sessions with ≥ 1 trace step or quiz answer | 40% | 60% | weeks 1–4 |
| Leading | Card sessions that switch language or style | 30% | 50% | weeks 1–4 |
| Leading | Finder runs that end on a card | 70% | 85% | weeks 1–4 |
| Leading | Exercise runs that end with all tests passing | 50% | 70% | weeks 1–4 |
| Lagging | Share of entries from organic search | 50% | 70% | month 3 |
| Lagging | Returning visitors (30-day) | 15% | 25% | month 3 |
| Lagging | Confirmed code bugs reported | 0 | 0 | month 1 |
| Qualitative | Beginners who name the right plan for 3 unseen problems | 4 / 5 | 5 / 5 | before launch |

## 8. Open questions

| # | Question | Owner | Blocking? |
|---|---|---|---|
| Q1 | Should the public site keep the **buatkode** name (an Indonesian word) for an international audience, or have an English sub-brand? | Stakeholder | Before launch |
| Q2 | Keep the original card IDs (A1…G3) visible, or renumber or drop them for the public? Keeping them helps your own students cross-reference. | Stakeholder | Before the index is built |
| Q3 | Which analytics, if any: GoatCounter, Plausible, or none? This decides whether section 7 can be measured. | Stakeholder | Before launch |
| Q4 | Licence: e.g. CC BY-SA 4.0 for the text and MIT for the code? | Stakeholder / legal | Before launch |
| Q5 | Do the three trace visual types (tiles, branches, pipeline) work for A1, A4 and B3? Prototype them before writing more cards. | Design | **Yes**: phase 1 |
| Q6 | Custom domain, or `github.io`? | Stakeholder | No |
| Q7 | Which minimum language versions do we target (C++20 for `ranges`, Java 17, Rust 2021, C11)? This affects the idiomatic snippets. | Engineering | Before writing snippets |
| Q8 | Is there a launch date to aim for, e.g. the start of a semester? | Stakeholder | No |

## 9. Timeline and phasing

There is no hard deadline yet (Q8). The phases are ordered to reduce risk early.

| Phase | Scope | Exit criterion |
|---|---|---|
| **0. Prototype** ✅ | D7 card in 5 languages, the full template | Done (2026-11-13) |
| **1. Prove the template** ✅ (build done, design sign-off pending) | Snippet test harness (R8) and CI. Three more cards that cover the other visual types: **A1** (pipeline), **B3** (branches), **E1** (2D tiles). (The in-browser runner was removed on 2026-11-14.) | All 4 cards pass the harness (94/94 snippets, 2026-11-13). The 3 visual types still need design sign-off (Q5) |
| **2. Content** ✅ | The remaining 13 core cards, written in batches by group (D first, then B and C, then A4) | Done 2026-11-14: 17 cards live, 396/396 snippets green. The harness gained list and built-string return types (C uses output parameters) |
| **3. Front doors** ✅ (build done, beginner test pending) | Catalogue index (R6), plan finder (R7), accessibility pass (R9), beginner test (5 people) | Built 2026-11-14: home page with finder (≤ 4 questions, checked by `tools/check_finder.js`) and filterable catalogue of all 40 plans; contrast fixed to AA (`tools/check_contrast.py`), focus rings, skip links, keyboard step highlight. **Still to do:** the moderated test with 5 beginners (Goal 1) |
| **4. Launch** | Deploy to GitHub Pages, set up analytics, write the announcement | The site is public |
| **Fast follow** | The P1 list | — |

**Main risks**
- **Content volume:** 17 cards × 5 languages × 2 styles is about 170 snippets, plus solutions and buggy variants. Mitigation: the test harness (R8) arrives before the content, and cards are written in batches by group.
- **The trace metaphor might not fit A, B and C plans.** Mitigation: Q5 is answered in phase 1, before the remaining cards are written.
