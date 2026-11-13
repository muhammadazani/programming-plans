// Check the plan finder's decision tree (data/finder.js) against the catalogue:
//  * every `next` points to an existing question, every `result`/`alt` to a real plan
//  * an `alt` is given whenever the result isn't live, and the alt itself is live
//  * every result is reachable within 4 questions from the start (spec R7)
//  * every live plan can be found
// Usage: node tools/check_finder.js
"use strict";
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const root = path.resolve(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["data/catalog.js", "data/finder.js"]) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
const { CATALOG, FINDER } = ctx.window;
const plans = new Map(CATALOG.plans.map((p) => [p.id, p]));
const errors = [];
const found = new Set();
let deepest = 0;

function walk(id, depth, trail) {
  const node = FINDER.nodes[id];
  if (!node) { errors.push(`${trail.join(" → ")}: unknown question "${id}"`); return; }
  if (trail.includes(id)) return; // a loop back (e.g. text → list) is fine; don't recurse forever
  node.options.forEach((o) => {
    const here = [...trail, id];
    if (o.next) return walk(o.next, depth + 1, here);
    if (!o.result) return errors.push(`${here.join(" → ")}: option "${o.label}" has neither next nor result`);
    const p = plans.get(o.result);
    if (!p) return errors.push(`${here.join(" → ")}: unknown plan ${o.result}`);
    if (!o.why) errors.push(`${here.join(" → ")}: ${o.result} has no "why"`);
    if (!p.live) {
      if (!o.alt) errors.push(`${here.join(" → ")}: ${o.result} is not live and has no alt`);
      else if (!plans.get(o.alt) || !plans.get(o.alt).live) errors.push(`${here.join(" → ")}: alt ${o.alt} for ${o.result} is not a live plan`);
    }
    found.add(o.result);
    deepest = Math.max(deepest, depth);
    if (depth > 4) errors.push(`${here.join(" → ")}: ${o.result} needs ${depth} questions (max 4)`);
  });
}
walk(FINDER.start, 1, []);

for (const p of CATALOG.plans) if (p.live && !found.has(p.id)) errors.push(`live plan ${p.id} (${p.title}) can't be reached by the finder`);

if (errors.length) {
  console.log(`✗ finder: ${errors.length} problem(s)`);
  errors.forEach((e) => console.log("    - " + e));
  process.exit(1);
}
console.log(`✓ finder: ${found.size} plans reachable, at most ${deepest} questions deep, all live plans covered`);
