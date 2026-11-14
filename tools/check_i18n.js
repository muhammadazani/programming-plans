// Check the Bahasa Indonesia edition against the English one.
//  * every plan has a translation overlay (data/id/plans/<slug>.js) that changes
//    only text: no code lines, no checks, same numbers of steps, pitfalls,
//    quiz questions, options and presets
//  * the translated trace takes exactly the same steps as the English one for
//    every preset, and its messages really are translated
//  * the catalogue overlay covers all 40 plans in order, card titles match it
//  * the Indonesian finder has the same shape and results as the English one
//  * every interface string exists in Indonesian
// Usage: node tools/check_i18n.js [slug ...]
"use strict";
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
function load(lang, files, key) {
  const ctx = { window: {}, document: { documentElement: { lang } } };
  vm.createContext(ctx);
  files.forEach((f) => vm.runInContext(read(f), ctx, { filename: f }));
  return key ? ctx.window[key] : ctx.window;
}
const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

// interface strings
const W = load("en", ["assets/js/i18n.js"]);
const S = W.I18N.strings;
Object.keys(S.en).forEach((k) => { if (!(k in S.id)) err("i18n.js", `missing Indonesian string "${k}"`); });

// catalogue
const catEn = load("en", ["data/catalog.js"], "CATALOG");
let catId = null;
if (!fs.existsSync(path.join(root, "data/id/catalog.js"))) err("data/id/catalog.js", "missing");
else {
  catId = load("id", ["data/catalog.js", "data/id/catalog.js", "assets/js/i18n.js"], "CATALOG");
  const raw = load("id", ["data/id/catalog.js"], "CATALOG_ID");
  if (raw.plans.length !== catEn.plans.length) err("catalog", `overlay has ${raw.plans.length} plans, English has ${catEn.plans.length}`);
  raw.plans.forEach((p, i) => { if (p.id !== catEn.plans[i].id) err("catalog", `overlay item ${i} is ${p.id}, expected ${catEn.plans[i].id}`); });
  Object.keys(catEn.groups).forEach((g) => { if (catId.groups[g] === catEn.groups[g]) err("catalog", `group ${g} not translated`); });
}

// finder
if (!fs.existsSync(path.join(root, "data/id/finder.js"))) err("data/id/finder.js", "missing");
else {
  const fEn = load("en", ["data/finder.js"], "FINDER");
  const fId = load("id", ["data/id/finder.js"], "FINDER_ID");
  if (fId.start !== fEn.start) err("finder", "different start node");
  Object.entries(fEn.nodes).forEach(([id, n]) => {
    const m = fId.nodes[id];
    if (!m) return err("finder", `node "${id}" missing`);
    if (m.q === n.q) err("finder", `node "${id}" question not translated`);
    if (m.options.length !== n.options.length) return err("finder", `node "${id}" has ${m.options.length} options, English has ${n.options.length}`);
    n.options.forEach((o, i) => {
      const t = m.options[i];
      ["next", "result", "alt"].forEach((k) => { if (o[k] !== t[k]) err("finder", `node "${id}" option ${i}: ${k} is ${t[k]}, expected ${o[k]}`); });
    });
  });
}

// plans
const only = process.argv.slice(2);
const files = fs.readdirSync(path.join(root, "data/plans")).filter((f) => f.endsWith(".js")).map((f) => f.replace(/\.js$/, ""));
let translated = 0;
for (const slug of files) {
  if (only.length && !only.includes(slug)) continue;
  const where = `id/${slug}`;
  const ovFile = `data/id/plans/${slug}.js`;
  if (!fs.existsSync(path.join(root, ovFile))) { err(where, "no translation overlay"); continue; }
  translated++;
  const en = load("en", [`data/plans/${slug}.js`], "PLAN");
  let raw, id;
  try {
    raw = load("id", [ovFile], "PLAN_ID");
    id = load("id", [`data/plans/${slug}.js`, ovFile, "assets/js/i18n.js"], "PLAN");
  } catch (e) { err(where, `could not load: ${e.message}`); continue; }
  if (!raw) { err(where, "overlay does not define window.PLAN_ID"); continue; }

  // the overlay may only change text
  ["checks", "snippets", "fn"].forEach((k) => { if (k in raw) err(where, `overlay must not contain "${k}"`); });
  if (raw.impl && JSON.stringify(raw.impl).includes("\"lines\"")) err(where, "overlay must not change code lines");
  if (raw.exercise) ["solutions", "tests", "fn", "params", "returns"].forEach((k) => { if (k in raw.exercise) err(where, `overlay must not contain exercise.${k}`); });
  Object.entries(en.impl).forEach(([lang, L]) => {
    if (!L.idiomatic && id.impl[lang].idiomatic) err(where, `impl.${lang}: English has no idiomatic version, so the overlay must not add one`);
    if (L.idiomaticNote && raw.impl && raw.impl[lang] && raw.impl[lang].idiomatic) err(where, `impl.${lang}: put the note in idiomaticNote`);
  });
  const sameLen = (name, a, b) => { if ((a || []).length !== (b || []).length) err(where, `${name}: ${(b || []).length} items, English has ${(a || []).length}`); };
  sameLen("steps", en.steps, id.steps);
  sameLen("pitfalls", en.pitfalls, id.pitfalls);
  sameLen("quiz", en.quiz, id.quiz);
  en.quiz.forEach((q, i) => id.quiz[i] && sameLen(`quiz[${i}].options`, q.options, id.quiz[i].options));
  sameLen("presets", en.trace.presets, id.trace.presets);
  sameLen("exercise.plan", en.exercise.plan, id.exercise.plan);
  sameLen("cues", en.cues, id.cues);
  sameLen("compare.rows", en.compare.rows, id.compare.rows);
  sameLen("compare.table.rows", en.compare.table.rows, id.compare.table.rows);
  sameLen("planCard.lines", en.planCard.lines, id.planCard.lines);
  if (!id.title.includes(id.highlight)) err(where, `highlight "${id.highlight}" is not part of the title "${id.title}"`);
  if (catId) {
    const c = catId.plans.find((p) => p.id === en.id);
    if (c && c.title !== id.title) err(where, `title "${id.title}" differs from the catalogue's "${c.title}"`);
  }
  const textFields = ["title", "intent", "cueSummary"].concat(["analogy.text", "trace.intro", "exercise.title"]);
  textFields.forEach((f) => {
    const get = (o) => f.split(".").reduce((x, k) => (x ? x[k] : undefined), o);
    if (get(en) === get(id)) err(where, `${f} not translated`);
  });
  en.steps.forEach((s, i) => { if (id.steps[i] && id.steps[i].text === s.text) err(where, `steps[${i}] not translated`); });
  en.pitfalls.forEach((p, i) => { if (id.pitfalls[i] && id.pitfalls[i].text === p.text) err(where, `pitfalls[${i}] not translated`); });
  en.quiz.forEach((q, i) => { if (id.quiz[i] && id.quiz[i].explain === q.explain) err(where, `quiz[${i}] not translated`); });

  // the translated trace must walk the same steps
  en.trace.presets.forEach((p, pi) => {
    let a, b;
    try { a = en.trace.run(p.input); b = id.trace.run(id.trace.presets[pi].input); } catch (e) { return err(where, `preset ${pi}: ${e.message}`); }
    const sig = (evs) => evs.map((e) => `${e.step}/${e.tone || ""}`).join(" ");
    if (sig(a) !== sig(b)) return err(where, `preset ${pi} ("${p.label}"): the translated trace takes different steps\n      en: ${sig(a)}\n      id: ${sig(b)}`);
    const same = a.filter((e, i) => e.msg === b[i].msg).length;
    if (same > a.length / 4) err(where, `preset ${pi}: ${same} of ${a.length} trace messages are still in English`);
  });
}

if (errors.length) {
  console.log(`✗ Indonesian edition: ${errors.length} problem(s)`);
  errors.forEach((e) => console.log("    - " + e));
  process.exit(1);
}
console.log(`✓ Indonesian edition: ${translated} plans translated; catalogue, finder and interface complete`);
