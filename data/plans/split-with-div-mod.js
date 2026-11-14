/* Plan data: A3 · Split with div and mod
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "A3",
    slug: "split-with-div-mod",
    title: "Split with div and mod",
    highlight: "div and mod",
    aka: ["unit conversion", "quotient and remainder", "divmod"],
    group: "A",
    level: "Foundations",
    core: false,
    fn: { python: "to_hms", java: "toHms", rust: "to_hms", c: "to_hms", cpp: "to_hms" },

    hero: { type: "pipeline", inputs: ["3725 s", "÷ 3600"], output: "1:02:05", tag: "// and %", alt: "3725 seconds flows through integer division and remainder into 1 hour, 2 minutes, 5 seconds" },
    planCard: { name: "split", lines: ["big = total // size", "rest = total % size", "repeat for next unit"], foot: "→ return the parts" },

    intent: "Break an amount into big and small units: integer division counts how many big units fit, the remainder is what's left for the smaller ones.",

    analogy: { icon: "📦", title: "Packing eggs into boxes", text: "You have 27 eggs and boxes of 12. Two boxes fill up (27 ÷ 12 = 2, ignoring the fraction), and 3 eggs are left over (the remainder). Integer division tells you how many boxes; the remainder tells you what's left loose." },

    cues: ["hours, minutes and seconds", "how many full …", "left over", "in boxes / packs of", "make change", "weeks and days"],
    cueSummary: "One amount must become <b>several units</b> (hours and minutes, boxes and leftovers), with no fractions.",
    cueExamples: ["Turn 3725 seconds into hours, minutes and seconds.", "How many full boxes of 12, and how many eggs left over?", "Make change for an amount using 5s, 2s and 1s."],

    steps: [
      { n: 1, title: "Count the big units", text: "hours = seconds // 3600: integer division throws away the fraction." },
      { n: 2, title: "Keep what's left", text: "rest = seconds % 3600: the remainder that didn't make a whole hour." },
      { n: 3, title: "Repeat for the next unit", text: "minutes = rest // 60, and the seconds are rest % 60." },
      { n: 4, title: "Return the parts", text: "Here [hours, minutes, seconds]." }
    ],

    impl: {
      python: { file: "time.py",
        plain: { lines: [[0, "def to_hms(seconds):"], [1, "    hours = seconds // 3600"], [2, "    rest = seconds % 3600"], [3, "    minutes = rest // 60"], [3, "    secs = rest % 60"], [4, "    return [hours, minutes, secs]"]], note: "In Python, <code>//</code> is integer division and <code>%</code> is the remainder. A single <code>/</code> would give a fraction." },
        idiomatic: { lines: [[0, "def to_hms(seconds):"], [[1, 2], "    hours, rest = divmod(seconds, 3600)"], [3, "    minutes, secs = divmod(rest, 60)"], [4, "    return [hours, minutes, secs]"]], note: "<code>divmod</code> returns the quotient and the remainder together." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static List<Integer> toHms(int seconds) {"], [1, "    int hours = seconds / 3600;"], [2, "    int rest = seconds % 3600;"], [3, "    int minutes = rest / 60;"], [3, "    int secs = rest % 60;"], [4, "    return List.of(hours, minutes, secs);"], [0, "}"]], note: "With two <code>int</code>s, Java's <code>/</code> is already integer division." },
        idiomatic: null, idiomaticNote: "<code>/</code> and <code>%</code> on <code>int</code>s are the idiomatic Java tools here." },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn to_hms(seconds: i32) -> Vec<i32> {"], [1, "    let hours = seconds / 3600;"], [2, "    let rest = seconds % 3600;"], [3, "    let minutes = rest / 60;"], [3, "    let secs = rest % 60;"], [4, "    vec![hours, minutes, secs]"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "Integer <code>/</code> and <code>%</code> are the idiomatic Rust tools here." },
      c: { file: "plans.c",
        plain: { lines: [[0, "size_t to_hms(int seconds, int out[]) {"], [1, "    int hours = seconds / 3600;"], [2, "    int rest = seconds % 3600;"], [3, "    int minutes = rest / 60;"], [3, "    int secs = rest % 60;"], [4, "    out[0] = hours;"], [4, "    out[1] = minutes;"], [4, "    out[2] = secs;"], [4, "    return 3;"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <stdlib.h>"], [0, ""], [0, "size_t to_hms(int seconds, int out[]) {"], [[1, 2], "    div_t h = div(seconds, 3600);"], [3, "    div_t m = div(h.rem, 60);"], [4, "    out[0] = h.quot;"], [4, "    out[1] = m.quot;"], [4, "    out[2] = m.rem;"], [4, "    return 3;"], [0, "}"]], note: "<code>div</code> returns the quotient (<code>.quot</code>) and remainder (<code>.rem</code>) together." } },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "std::vector<int> to_hms(int seconds) {"], [1, "    int hours = seconds / 3600;"], [2, "    int rest = seconds % 3600;"], [3, "    int minutes = rest / 60;"], [3, "    int secs = rest % 60;"], [4, "    return {hours, minutes, secs};"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <cstdlib>"], [0, "#include <vector>"], [0, ""], [0, "std::vector<int> to_hms(int seconds) {"], [[1, 2], "    std::div_t h = std::div(seconds, 3600);"], [3, "    std::div_t m = std::div(h.rem, 60);"], [4, "    return {h.quot, m.quot, m.rem};"], [0, "}"]], note: "<code>std::div</code> gives quotient and remainder in one call." } }
    },

    trace: {
      type: "pipeline",
      intro: "Running example: <b>Turn a number of seconds into hours, minutes and seconds.</b>",
      input: { kind: "fields", fields: [{ name: "seconds", label: "seconds", min: 0, max: 359999 }] },
      presets: [{ label: "3725 s", input: { seconds: 3725 } }, { label: "59 s", input: { seconds: 59 } }, { label: "One day minus a second", input: { seconds: 86399 } }],
      run({ seconds: t }) {
        const ev = [], v = { seconds: t };
        const push = (step, msg, active, fresh = [], done = [], tone = "") => {
          const st = (label, n, keys) => ({ label, step: n, state: active === n ? "active" : done.includes(n) ? "done" : "", vars: keys.map((k) => ({ k, v: v[k], fresh: fresh.includes(k) })) });
          const stages = [st("Hours", 1, ["seconds", "hours"]), st("Left over", 2, ["rest"]), st("Min & sec", 3, ["minutes", "secs"]), st("Result", 4, ["result"])];
          if (step === 4) stages[3].state = "result";
          ev.push({ step, msg, tone, view: { stages }, vars: [] });
        };
        push(null, `Ready. ${t} seconds to split.`, 0);
        v.hours = Math.floor(t / 3600); push(1, `How many whole hours fit? ${t} // 3600 = ${v.hours}`, 1, ["hours"]);
        v.rest = t % 3600; push(2, `What's left over? ${t} % 3600 = ${v.rest} seconds`, 2, ["rest"], [1]);
        v.minutes = Math.floor(v.rest / 60); v.secs = v.rest % 60;
        push(3, `Same again with minutes: ${v.rest} // 60 = ${v.minutes}, and ${v.rest} % 60 = ${v.secs}`, 3, ["minutes", "secs"], [1, 2]);
        v.result = `[${v.hours}, ${v.minutes}, ${v.secs}]`;
        push(4, `Return ${v.result}: ${v.hours} h ${v.minutes} min ${v.secs} s.`, 4, ["result"], [1, 2, 3], "yes");
        return ev;
      }
    },

    checks: {
      params: ["int"], returns: "int[]",
      cases: [{ args: [3725], expect: [1, 2, 5] }, { args: [59], expect: [0, 0, 59] }, { args: [3600], expect: [1, 0, 0] }, { args: [0], expect: [0, 0, 0] }, { args: [86399], expect: [23, 59, 59] }],
      snippets: { bugNoRest: [{ args: [3725], expect: [1, 62, 5] }], bugUnit: [{ args: [3725], expect: [62, 2, 5] }] }
    },

    pitfalls: [
      { kind: "dont", title: "Forgetting the remainder", wide: true, code: "bugNoRest", text: "Computing the minutes from the original total (<code>seconds // 60</code>) counts the minutes inside the hours again: 3725 seconds becomes 1 hour and 62 minutes.", take: "Each smaller unit comes from what's left over, not from the total." },
      { kind: "dont", title: "Using the wrong unit size", text: "Dividing by 60 for hours gives minutes. Write the sizes as named constants (SECONDS_PER_HOUR = 3600) so the numbers explain themselves.", take: "Check the sizes: 60 per minute, 3600 per hour, 86 400 per day." },
      { kind: "dont", title: "Forgetting negative numbers behave differently", text: "For -7, Python's <code>//</code> rounds down (-7 // 2 is -4), while Java, C, C++ and Rust round towards zero (-7 / 2 is -3). The remainders differ too.", take: "Keep amounts non-negative, or test negatives in your language." },
      { kind: "do", title: "Check by putting it back together", text: "hours × 3600 + minutes × 60 + seconds must give the original total. If it doesn't, a step is wrong." },
      { kind: "do", title: "Use divmod or div when you need both", text: "Python's <code>divmod</code> and C/C++'s <code>div</code> return the quotient and remainder in one go." }
    ],

    snippets: {
      bugNoRest: {
        python: ["def to_hms(seconds):", "    hours = seconds // 3600", "    minutes = seconds // 60 % 3600   # ✗ from the total, not the rest", "    secs = seconds % 60", "    return [hours, minutes, secs]"],
        java: ["static List<Integer> toHms(int seconds) {", "    int hours = seconds / 3600;", "    int minutes = seconds / 60 % 3600;   // ✗ from the total, not the rest", "    int secs = seconds % 60;", "    return List.of(hours, minutes, secs);", "}"],
        rust: ["fn to_hms(seconds: i32) -> Vec<i32> {", "    let hours = seconds / 3600;", "    let minutes = seconds / 60 % 3600;   // ✗ from the total, not the rest", "    let secs = seconds % 60;", "    vec![hours, minutes, secs]", "}"],
        c: ["size_t to_hms(int seconds, int out[]) {", "    out[0] = seconds / 3600;", "    out[1] = seconds / 60 % 3600;        // ✗ from the total, not the rest", "    out[2] = seconds % 60;", "    return 3;", "}"],
        cpp: ["std::vector<int> to_hms(int seconds) {", "    int hours = seconds / 3600;", "    int minutes = seconds / 60 % 3600;   // ✗ from the total, not the rest", "    int secs = seconds % 60;", "    return {hours, minutes, secs};", "}"]
      },
      bugUnit: {
        python: ["def to_hms(seconds):", "    hours = seconds // 60", "    rest = seconds % 3600", "    minutes = rest // 60", "    secs = rest % 60", "    return [hours, minutes, secs]"],
        java: ["static List<Integer> toHms(int seconds) {", "    int hours = seconds / 60;", "    int rest = seconds % 3600;", "    int minutes = rest / 60;", "    int secs = rest % 60;", "    return List.of(hours, minutes, secs);", "}"],
        rust: ["fn to_hms(seconds: i32) -> Vec<i32> {", "    let hours = seconds / 60;", "    let rest = seconds % 3600;", "    let minutes = rest / 60;", "    let secs = rest % 60;", "    vec![hours, minutes, secs]", "}"],
        c: ["size_t to_hms(int seconds, int out[]) {", "    int hours = seconds / 60;", "    int rest = seconds % 3600;", "    out[0] = hours;", "    out[1] = rest / 60;", "    out[2] = rest % 60;", "    return 3;", "}"],
        cpp: ["std::vector<int> to_hms(int seconds) {", "    int hours = seconds / 60;", "    int rest = seconds % 3600;", "    int minutes = rest / 60;", "    int secs = rest % 60;", "    return {hours, minutes, secs};", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(7322) return?", options: ["[2, 2, 2]", "[2, 122, 2]", "[1, 62, 2]"], answer: 0, explain: "7322 // 3600 = 2 hours, leaving 122 seconds; 122 // 60 = 2 minutes and 122 % 60 = 2 seconds." },
      { q: "What is 27 % 12?", options: ["2", "3", "2.25"], answer: 1, explain: "12 fits into 27 twice (24), and 3 is left over. % gives the leftover." },
      { q: "This version has a bug. What does it return for 3725?", code: "bugUnit", options: ["[1, 2, 5]", "[62, 2, 5]", "[1, 62, 5]"], answer: 1, explain: "It divides by 60 for the hours, which counts minutes: 3725 // 60 = 62. Hours need 3600." }
    ],

    exercise: {
      title: "Your turn: make change",
      task: "Write <code>make_change(amount)</code> that splits a whole amount into coins of 5, 2 and 1, using as many big coins as possible. Return [fives, twos, ones].",
      plan: ["fives = amount // 5", "rest = amount % 5", "twos = rest // 2 and ones = rest % 2", "Return [fives, twos, ones]"],
      fn: { python: "make_change", java: "makeChange", rust: "make_change", c: "make_change", cpp: "make_change" },
      params: ["int"], returns: "int[]",
      tests: [{ args: [13], expect: [2, 1, 1] }, { args: [4], expect: [0, 2, 0] }, { args: [0], expect: [0, 0, 0] }, { args: [5], expect: [1, 0, 0] }],
      solutions: {
        python: ["def make_change(amount):", "    fives = amount // 5", "    rest = amount % 5", "    twos = rest // 2", "    ones = rest % 2", "    return [fives, twos, ones]"],
        java: ["static List<Integer> makeChange(int amount) {", "    int fives = amount / 5;", "    int rest = amount % 5;", "    return List.of(fives, rest / 2, rest % 2);", "}"],
        rust: ["fn make_change(amount: i32) -> Vec<i32> {", "    let fives = amount / 5;", "    let rest = amount % 5;", "    vec![fives, rest / 2, rest % 2]", "}"],
        c: ["size_t make_change(int amount, int out[]) {", "    int rest = amount % 5;", "    out[0] = amount / 5;", "    out[1] = rest / 2;", "    out[2] = rest % 2;", "    return 3;", "}"],
        cpp: ["#include <vector>", "", "std::vector<int> make_change(int amount) {", "    int fives = amount / 5;", "    int rest = amount % 5;", "    return {fives, rest / 2, rest % 2};", "}"]
      }
    },

    compare: {
      intro: "Two plans that both use // and %, for different jobs.",
      rows: [
        { id: "A3", name: "Split with div and mod", question: "3725 s → 1 h 2 min 5 s", shape: "a fixed number of steps, one per unit", result: "a few parts", self: true },
        { id: "D16", name: "Peel off digits", question: "Sum the digits of 3725", shape: "a loop: % 10 for the last digit, // 10 to drop it", result: "one value per digit" },
        { id: "A1", name: "Input → process → output", question: "Compute a speed", shape: "one formula", result: "one value" }
      ],
      table: { head: ["Plan", "Loop?", "Divides by", "Typical use"], rows: [["Split with div and mod", "no", "unit sizes (3600, 60)", "time, boxes, change"], ["Peel off digits", "yes", "always 10", "digit sums, reversing numbers"], ["Input → process → output", "no", "—", "formulas"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "A1", why: "the same straight-line calculation" }],
      leadsTo: [{ id: "D16", why: "repeat % 10 and // 10 to peel off every digit" }]
    }
  };
})();
