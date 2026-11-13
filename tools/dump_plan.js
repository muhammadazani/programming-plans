// Load a plan data file (it assigns window.PLAN) and print it as JSON.
// Also dry-runs the trace for every preset, so a broken trace fails the check.
// Usage: node tools/dump_plan.js data/plans/<slug>.js
"use strict";
const fs = require("fs");
const vm = require("vm");

const file = process.argv[2];
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
const plan = ctx.window.PLAN;
if (!plan) throw new Error(`${file} did not define window.PLAN`);

const traceErrors = [];
for (const p of plan.trace.presets) {
  try {
    const events = plan.trace.run(p.input);
    if (!Array.isArray(events) || events.length < 2) traceErrors.push(`${p.label}: fewer than 2 events`);
    events.forEach((e, i) => {
      if (!e.view || typeof e.msg !== "string") traceErrors.push(`${p.label}: event ${i} lacks view or msg`);
      if (e.step != null && !plan.steps.some((s) => s.n === e.step)) traceErrors.push(`${p.label}: event ${i} uses unknown step ${e.step}`);
    });
  } catch (err) {
    traceErrors.push(`${p.label}: ${err.message}`);
  }
}
plan.__traceErrors = traceErrors;
process.stdout.write(JSON.stringify(plan));
