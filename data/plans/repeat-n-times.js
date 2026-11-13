/* Plan data: C1 · Repeat n times
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const money = (x) => x.toFixed(2);

  window.PLAN = {
    id: "C1",
    slug: "repeat-n-times",
    title: "Repeat n times",
    highlight: "n times",
    aka: ["counted loop", "for loop", "definite iteration"],
    group: "C",
    level: "Foundations",
    core: true,
    fn: { python: "balance_after", java: "balanceAfter", rust: "balance_after", c: "balance_after", cpp: "balance_after" },

    hero: {
      type: "tiles",
      values: ["Y1", "Y2", "Y3", "Y4", "Y5"],
      colors: ["pale", "pale", "pale", "pale", "amber"],
      tagAt: 4,
      tag: "× 1.05 each year",
      alt: "Five cubes labelled year 1 to year 5, the last one amber, with the tag times 1.05 each year"
    },
    planCard: { name: "repeat", lines: ["set up before the loop", "loop exactly n times", "do one round"], foot: "→ use the result" },

    intent: "Do the same piece of work a number of times that is known before the loop starts.",

    analogy: {
      icon: "🏊",
      title: "Swimming 10 lengths",
      text: "Before you get in, you know the number: 10 lengths. You count each one as you finish it, and stop when the count reaches 10. Each length is the same work; only the counter changes."
    },

    cues: ["n times", "for each of the n …", "every day for a week", "repeat …", "from 1 to n", "after n years"],
    cueSummary: "You know <b>how many times</b> before the loop starts: a given n, or the length of a list.",
    cueExamples: [
      "What's the balance after n years at 5% interest per year?",
      "Print the first n multiples of 7.",
      "Roll a die 100 times and record the results."
    ],

    steps: [
      { n: 1, title: "Set up before the loop", text: "Whatever the rounds will update: here the balance starts at the starting amount." },
      { n: 2, title: "Loop exactly n times", text: "A counter goes through n values (0 to n − 1, or 1 to n). The loop knows when to stop before it starts." },
      { n: 3, title: "Do one round of work", text: "The same step every time: add a year's interest." },
      { n: 4, title: "Use the result after the loop", text: "When the counter has done all n rounds, the work is finished." }
    ],

    impl: {
      python: {
        file: "interest.py",
        plain: { lines: [
          [0, "def balance_after(start, years):"],
          [1, "    balance = start"],
          [2, "    for year in range(years):"],
          [3, "        balance = balance * 1.05"],
          [4, "    return balance"]
        ], note: "<code>range(years)</code> gives 0, 1, …, years − 1: exactly <code>years</code> rounds." },
        idiomatic: { lines: [
          [0, "def balance_after(start, years):"],
          [[1, 2, 3, 4], "    return start * 1.05 ** years"]
        ], note: "No loop at all: compound interest has a formula. The loop works for any repeated step, even ones with no formula." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static double balanceAfter(int start, int years) {"],
          [1, "    double balance = start;"],
          [2, "    for (int year = 0; year < years; year++) {"],
          [3, "        balance = balance * 1.05;"],
          [0, "    }"],
          [4, "    return balance;"],
          [0, "}"]
        ], note: "<code>year &lt; years</code>, starting at 0, runs exactly <code>years</code> times." },
        idiomatic: { lines: [
          [0, "static double balanceAfter(int start, int years) {"],
          [[1, 2, 3, 4], "    return start * Math.pow(1.05, years);"],
          [0, "}"]
        ], note: "The closed formula, for comparison." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn balance_after(start: i32, years: i32) -> f64 {"],
          [1, "    let mut balance = start as f64;"],
          [2, "    for _year in 0..years {"],
          [3, "        balance = balance * 1.05;"],
          [0, "    }"],
          [4, "    balance"],
          [0, "}"]
        ], note: "<code>0..years</code> stops before <code>years</code>; <code>0..=years</code> would include it and run once too often." },
        idiomatic: { lines: [
          [0, "fn balance_after(start: i32, years: i32) -> f64 {"],
          [[1, 2, 3, 4], "    start as f64 * 1.05_f64.powi(years)"],
          [0, "}"]
        ], note: "The closed formula, for comparison." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "double balance_after(int start, int years) {"],
          [1, "    double balance = start;"],
          [2, "    for (int year = 0; year < years; year++) {"],
          [3, "        balance = balance * 1.05;"],
          [0, "    }"],
          [4, "    return balance;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "#include <math.h>"],
          [0, ""],
          [0, "double balance_after(int start, int years) {"],
          [[1, 2, 3, 4], "    return start * pow(1.05, years);"],
          [0, "}"]
        ], note: "The closed formula, for comparison (link with <code>-lm</code>)." }
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "double balance_after(int start, int years) {"],
          [1, "    double balance = start;"],
          [2, "    for (int year = 0; year < years; year++) {"],
          [3, "        balance = balance * 1.05;"],
          [0, "    }"],
          [4, "    return balance;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "#include <cmath>"],
          [0, ""],
          [0, "double balance_after(int start, int years) {"],
          [[1, 2, 3, 4], "    return start * std::pow(1.05, years);"],
          [0, "}"]
        ], note: "The closed formula, for comparison." }
      }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>A savings account pays 5% interest per year. What is the balance after n years?</b>",
      input: { kind: "fields", fields: [{ name: "start", label: "start", min: 0, max: 100000 }, { name: "years", label: "years", min: 0, max: 8 }] },
      presets: [
        { label: "1000 for 3 years", input: { start: 1000, years: 3 } },
        { label: "200 for 5 years", input: { start: 200, years: 5 } },
        { label: "Zero years", input: { start: 1000, years: 0 } }
      ],
      run({ start, years }) {
        const rounds = Array.from({ length: years }, (_, i) => `Y${i + 1}`);
        const ev = [], states = rounds.map(() => "");
        let balance = start;
        const snap = (step, msg, cur = -1, tone = "", yr = "—") => ev.push({
          step, msg, tone,
          view: { values: rounds, states: states.slice(), ptr: cur, emptyNote: "no rounds: years = 0" },
          vars: [{ k: "year", role: "stepper", v: yr, of: yr === "—" ? undefined : years }, { k: "balance", role: "gatherer", v: money(balance) }]
        });
        snap(null, `Ready. ${years} round${years === 1 ? "" : "s"} to do.`);
        snap(1, `Set up before the loop: balance = ${start}.`);
        for (let y = 0; y < years; y++) {
          states[y] = "current";
          snap(2, `Round ${y + 1} of ${years} (year = ${y}).`, y, "", y + 1);
          const before = balance;
          balance = balance * 1.05;
          states[y] = "added";
          snap(3, `Add a year's interest: ${money(before)} × 1.05 = ${money(balance)}`, y, "", y + 1);
        }
        snap(4, years ? `${years === 1 ? "The only round is" : `All ${years} rounds are`} done. Return ${money(balance)}.` : "Zero rounds: the loop body never runs. Return the starting balance.", -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int", "int"],
      returns: "double",
      cases: [
        { args: [1000, 3], expect: 1157.625 },
        { args: [1000, 0], expect: 1000.0 },
        { args: [200, 1], expect: 210.0 },
        { args: [100, 2], expect: 110.25 }
      ],
      snippets: {
        bugOffByOne: [{ args: [1000, 1], expect: 1102.5 }],
        bugReset: [{ args: [1000, 3], expect: 1050.0 }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "One round too many", wide: true, code: "bugOffByOne",
        text: "Counting from 0 <em>up to and including</em> n runs n + 1 times. One year of interest becomes two.",
        take: "From 0, stop before n (<code>&lt; n</code>, <code>range(n)</code>, <code>0..n</code>). From 1, go up to and including n." },
      { kind: "dont", title: "Setting up inside the loop",
        text: "If <code>balance = start</code> sits inside the loop, every round starts over, and you only ever get one year of interest.",
        take: "Set up once, before the loop." },
      { kind: "dont", title: "Changing n or the counter inside the loop",
        text: "Changing the loop counter by hand (or the n it's compared with) breaks the “exactly n times” promise.",
        take: "If you don't know the count in advance, use a different loop plan (C2 or C4)." },
      { kind: "do", title: "Check the zero case",
        text: "With n = 0 the body never runs, so the result is whatever the set-up made it. Here: the starting balance, which is right." },
      { kind: "do", title: "Test with n = 1",
        text: "One round is easy to work out by hand (1000 → 1050) and catches off-by-one errors immediately." }
    ],

    snippets: {
      bugOffByOne: {
        python: ["def balance_after(start, years):", "    balance = start", "    for year in range(years + 1):   # ✗ one round too many", "        balance = balance * 1.05", "    return balance"],
        java: ["static double balanceAfter(int start, int years) {", "    double balance = start;", "    for (int year = 0; year <= years; year++) {   // ✗ <= runs once more", "        balance = balance * 1.05;", "    }", "    return balance;", "}"],
        rust: ["fn balance_after(start: i32, years: i32) -> f64 {", "    let mut balance = start as f64;", "    for _year in 0..=years {        // ✗ ..= includes years", "        balance = balance * 1.05;", "    }", "    balance", "}"],
        c: ["double balance_after(int start, int years) {", "    double balance = start;", "    for (int year = 0; year <= years; year++) {   // ✗ <= runs once more", "        balance = balance * 1.05;", "    }", "    return balance;", "}"],
        cpp: ["double balance_after(int start, int years) {", "    double balance = start;", "    for (int year = 0; year <= years; year++) {   // ✗ <= runs once more", "        balance = balance * 1.05;", "    }", "    return balance;", "}"]
      },
      bugReset: {
        python: ["def balance_after(start, years):", "    balance = start", "    for year in range(years):", "        balance = start", "        balance = balance * 1.05", "    return balance"],
        java: ["static double balanceAfter(int start, int years) {", "    double balance = start;", "    for (int year = 0; year < years; year++) {", "        balance = start;", "        balance = balance * 1.05;", "    }", "    return balance;", "}"],
        rust: ["fn balance_after(start: i32, years: i32) -> f64 {", "    let mut balance = start as f64;", "    for _year in 0..years {", "        balance = start as f64;", "        balance = balance * 1.05;", "    }", "    balance", "}"],
        c: ["double balance_after(int start, int years) {", "    double balance = start;", "    for (int year = 0; year < years; year++) {", "        balance = start;", "        balance = balance * 1.05;", "    }", "    return balance;", "}"],
        cpp: ["double balance_after(int start, int years) {", "    double balance = start;", "    for (int year = 0; year < years; year++) {", "        balance = start;", "        balance = balance * 1.05;", "    }", "    return balance;", "}"]
      }
    },

    quiz: [
      { q: "How many times does the loop body run in {fn}(1000, 4)?", options: ["3", "4", "5"], answer: 1,
        explain: "years is 4, and the loop runs for year = 0, 1, 2, 3: four rounds." },
      { q: "This version has a bug. What does it return for (1000, 3)?", code: "bugReset", options: ["1157.625", "1050.0", "1000.0"], answer: 1,
        explain: "Each round resets balance to 1000 before adding interest, so after any number of rounds it's 1000 × 1.05 = 1050.0." },
      { q: "When is “repeat n times” the right plan?", options: ["When n is known before the loop starts", "When the loop stops at a special input", "When you stop as soon as a goal is reached"], answer: 0,
        explain: "A counted loop needs the count up front. Stopping on a special input is C2; stopping when a goal is reached is C4." }
    ],

    exercise: {
      title: "Your turn: power by repeated multiplication",
      task: "Write <code>power(base, exponent)</code> that returns base multiplied by itself <code>exponent</code> times, using a loop. Any number to the power 0 is 1.",
      plan: ["Set up: result = 1", "Loop exactly exponent times", "Each round: result = result × base", "Return result"],
      fn: { python: "power", java: "power", rust: "power", c: "power", cpp: "power" },
      params: ["int", "int"],
      returns: "int",
      tests: [
        { args: [2, 10], expect: 1024 },
        { args: [5, 0], expect: 1 },
        { args: [3, 3], expect: 27 },
        { args: [-2, 3], expect: -8 }
      ],
      solutions: {
        python: ["def power(base, exponent):", "    result = 1", "    for i in range(exponent):", "        result = result * base", "    return result"],
        java: ["static int power(int base, int exponent) {", "    int result = 1;", "    for (int i = 0; i < exponent; i++) {", "        result = result * base;", "    }", "    return result;", "}"],
        rust: ["fn power(base: i32, exponent: i32) -> i32 {", "    let mut result = 1;", "    for _i in 0..exponent {", "        result = result * base;", "    }", "    result", "}"],
        c: ["int power(int base, int exponent) {", "    int result = 1;", "    for (int i = 0; i < exponent; i++) {", "        result = result * base;", "    }", "    return result;", "}"],
        cpp: ["int power(int base, int exponent) {", "    int result = 1;", "    for (int i = 0; i < exponent; i++) {", "        result = result * base;", "    }", "    return result;", "}"]
      }
    },

    compare: {
      intro: "Three loop-control plans. The difference is <b>what tells the loop to stop</b>.",
      rows: [
        { id: "C1", name: "Repeat n times", question: "Add interest for 3 years", shape: "the count is known up front: for i in 0..n", result: "exactly n rounds", self: true },
        { id: "C2", name: "Read until a stop value", question: "Add numbers until the user types -1", shape: "read first; while not the stop value: process, read next", result: "unknown in advance" },
        { id: "C4", name: "Repeat until a target", question: "How many years until the balance doubles?", shape: "while the goal isn't reached: one more round", result: "counts the rounds" }
      ],
      table: {
        head: ["Plan", "Stops when", "Rounds known in advance?", "Typical loop"],
        rows: [
          ["Repeat n times", "the counter reaches n", "yes", "for"],
          ["Read until a stop value", "a special value is read", "no", "while"],
          ["Repeat until a target", "a goal is reached", "no", "while"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "A1", why: "each round is a small calculation" }],
      leadsTo: [{ id: "D2", why: "repeat over the items of a list, adding each one" }, { id: "C4", why: "when you don't know how many rounds" }, { id: "E1", why: "a counted loop inside another" }]
    }
  };
})();
