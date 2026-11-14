/* Plan data: G2 · Generate and test
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const SHOW = 10; // the trace shows the last few candidates only

  window.PLAN = {
    id: "G2",
    slug: "generate-and-test",
    title: "Generate and test",
    highlight: "Generate",
    aka: ["brute force", "trial and error", "try every candidate"],
    group: "G",
    level: "Advanced",
    core: false,
    fn: { python: "smallest_divisor", java: "smallestDivisor", rust: "smallest_divisor", c: "smallest_divisor", cpp: "smallest_divisor" },

    hero: { type: "tiles", values: [2, 3, 4, 5, 6, 7], colors: ["pale", "pale", "pale", "pale", "pale", "amber"], highlight: 5, tag: "91 % 7 = 0", alt: "Candidates 2 to 7 tried in order; 7 is amber as the first that divides 91" },
    planCard: { name: "generate & test", lines: ["first candidate", "while it fails the test", "try the next one"], foot: "→ the first that passes" },

    intent: "When there's no formula for the answer but you can check a candidate, try the candidates in order and stop at the first one that passes.",

    analogy: { icon: "🔑", title: "A ring of unlabelled keys", text: "You don't know which key opens the door, but you can tell instantly when one does. So you try them one after another and stop at the first that turns. No formula, just a reliable test and a list of candidates." },

    cues: ["the smallest … such that", "the first number that …", "find a value that satisfies …", "no formula", "try every possibility"],
    cueSummary: "You can't compute the answer directly, but you can <b>check</b> whether a candidate is right.",
    cueExamples: ["What is the smallest number above 1 that divides 91?", "What is the first square number greater than 50?", "Which is the smallest PIN that matches the rules?"],

    steps: [
      { n: 1, title: "Start with the first candidate", text: "Here: 2, the smallest possible divisor." },
      { n: 2, title: "While the candidate fails the test", text: "Here: while it doesn't divide n evenly." },
      { n: 3, title: "Move on to the next candidate", text: "In order, so the first one that passes is also the smallest." },
      { n: 4, title: "Return the first candidate that passes", text: "The loop is guaranteed to stop: n always divides itself." }
    ],

    impl: {
      python: { file: "divisor.py",
        plain: { lines: [[0, "def smallest_divisor(n):"], [1, "    d = 2"], [2, "    while n % d != 0:"], [3, "        d += 1"], [4, "    return d"]], note: "Works for n ≥ 2. Because d = n always passes, the loop can't run forever." },
        idiomatic: { lines: [[0, "def smallest_divisor(n):"], [[1, 2, 3, 4], "    return next(d for d in range(2, n + 1) if n % d == 0)"]] } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int smallestDivisor(int n) {"], [1, "    int d = 2;"], [2, "    while (n % d != 0) {"], [3, "        d++;"], [0, "    }"], [4, "    return d;"], [0, "}"]] },
        idiomatic: { lines: [[0, "static int smallestDivisor(int n) {"], [[1, 2, 3, 4], "    return IntStream.rangeClosed(2, n).filter(d -> n % d == 0).findFirst().getAsInt();"], [0, "}"]] } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn smallest_divisor(n: i32) -> i32 {"], [1, "    let mut d = 2;"], [2, "    while n % d != 0 {"], [3, "        d += 1;"], [0, "    }"], [4, "    d"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn smallest_divisor(n: i32) -> i32 {"], [[1, 2, 3, 4], "    (2..=n).find(|d| n % d == 0).unwrap()"], [0, "}"]], note: "<code>find</code> stops at the first candidate that passes the test." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "int smallest_divisor(int n) {"], [1, "    int d = 2;"], [2, "    while (n % d != 0) {"], [3, "        d++;"], [0, "    }"], [4, "    return d;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "The candidate loop is the idiomatic C." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "int smallest_divisor(int n) {"], [1, "    int d = 2;"], [2, "    while (n % d != 0) {"], [3, "        d++;"], [0, "    }"], [4, "    return d;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "The candidate loop is the idiomatic C++." }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>What is the smallest number above 1 that divides n?</b> Each tile is a candidate. (Only the last few are shown.)",
      input: { kind: "fields", fields: [{ name: "n", label: "n", min: 2, max: 10000 }] },
      presets: [{ label: "91", input: { n: 91 } }, { label: "15", input: { n: 15 } }, { label: "13 (prime)", input: { n: 13 } }],
      run({ n }) {
        const ev = [], tried = [];
        const snap = (step, msg, tone = "", hit = false) => {
          const shown = tried.slice(-SHOW);
          ev.push({ step, msg, tone,
            view: { values: shown, states: shown.map((_, i) => (i === shown.length - 1 ? (hit ? "hit" : "current") : "miss")), ptr: shown.length - 1, noIdx: true, emptyNote: "no candidates yet" },
            vars: [{ k: "n", role: "fixed", v: n }, { k: "d", role: "stepper", v: tried.length ? tried[tried.length - 1] : "—" }, { k: "tried", role: "count", v: tried.length }] });
        };
        snap(null, `Ready. Find the smallest divisor of ${n} above 1.`);
        let d = 2; tried.push(d);
        snap(1, "Start with the first candidate: d = 2.");
        while (n % d !== 0) {
          snap(2, `${n} % ${d} = ${n % d}: ${d} fails the test.`);
          d++; tried.push(d);
          snap(3, `Try the next candidate: d = ${d}.`);
        }
        snap(2, `${n} % ${d} = 0: ${d} passes.`, "", true);
        snap(4, `Return ${d}${d === n ? `: ${n} has no smaller divisor, so it's prime` : ""}.`, "yes", true);
        return ev;
      }
    },

    checks: {
      params: ["int"], returns: "int",
      cases: [{ args: [91], expect: 7 }, { args: [2], expect: 2 }, { args: [15], expect: 3 }, { args: [49], expect: 7 }, { args: [97], expect: 97 }],
      snippets: { bugStartOne: [{ args: [91], expect: 1 }], bugInverted: [{ args: [91], expect: 2 }] }
    },

    pitfalls: [
      { kind: "dont", title: "Starting at the wrong candidate", wide: true, code: "bugStartOne", text: "Starting at 1 makes the answer always 1, because 1 divides every number. The first candidate has to be the first <em>sensible</em> one.", take: "Decide where the candidates really start." },
      { kind: "dont", title: "Testing the opposite condition", text: "<code>while n % d == 0</code> keeps going while d <em>divides</em> n, so it returns the first number that doesn't.", take: "Loop while the candidate fails; stop when it passes." },
      { kind: "dont", title: "A search that may never end", text: "If no candidate is guaranteed to pass, the loop can run forever.", take: "Make sure some candidate passes (here, n itself), or put an upper limit on the candidates." },
      { kind: "do", title: "Order the candidates for the question", text: "Trying from smallest to largest makes the first match the smallest. To find the largest, try from the top down." },
      { kind: "do", title: "Cut down the candidates when you can", text: "Here, if nothing up to √n divides n, the answer is n itself. Fewer candidates means a faster search." }
    ],

    snippets: {
      bugStartOne: {
        python: ["def smallest_divisor(n):", "    d = 1            # ✗ 1 divides everything", "    while n % d != 0:", "        d += 1", "    return d"],
        java: ["static int smallestDivisor(int n) {", "    int d = 1;       // ✗ 1 divides everything", "    while (n % d != 0) d++;", "    return d;", "}"],
        rust: ["fn smallest_divisor(n: i32) -> i32 {", "    let mut d = 1;   // ✗ 1 divides everything", "    while n % d != 0 { d += 1; }", "    d", "}"],
        c: ["int smallest_divisor(int n) {", "    int d = 1;       // ✗ 1 divides everything", "    while (n % d != 0) d++;", "    return d;", "}"],
        cpp: ["int smallest_divisor(int n) {", "    int d = 1;       // ✗ 1 divides everything", "    while (n % d != 0) d++;", "    return d;", "}"]
      },
      bugInverted: {
        python: ["def smallest_divisor(n):", "    d = 2", "    while n % d == 0:", "        d += 1", "    return d"],
        java: ["static int smallestDivisor(int n) {", "    int d = 2;", "    while (n % d == 0) d++;", "    return d;", "}"],
        rust: ["fn smallest_divisor(n: i32) -> i32 {", "    let mut d = 2;", "    while n % d == 0 { d += 1; }", "    d", "}"],
        c: ["int smallest_divisor(int n) {", "    int d = 2;", "    while (n % d == 0) d++;", "    return d;", "}"],
        cpp: ["int smallest_divisor(int n) {", "    int d = 2;", "    while (n % d == 0) d++;", "    return d;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(35) return?", options: ["5", "7", "35"], answer: 0, explain: "2, 3 and 4 don't divide 35; 5 does. It's the first candidate that passes." },
      { q: "This version has a bug. What does it return for 91?", code: "bugInverted", options: ["7", "2", "91"], answer: 1, explain: "The test is inverted: it stops at the first number that does not divide 91, which is 2." },
      { q: "Why does the loop always stop for n ≥ 2?", options: ["Because d eventually reaches n, and n divides itself", "Because loops always stop", "Because d starts at 2"], answer: 0, explain: "Some candidate is guaranteed to pass, so the search can't run forever." }
    ],

    exercise: {
      title: "Your turn: the first square above n",
      task: "Write <code>first_square_above(n)</code> that returns the smallest square number (1, 4, 9, 16, …) that is greater than <code>n</code>.",
      plan: ["Start with the candidate k = 1", "While k × k is not greater than n", "Try the next k", "Return k × k"],
      fn: { python: "first_square_above", java: "firstSquareAbove", rust: "first_square_above", c: "first_square_above", cpp: "first_square_above" },
      params: ["int"], returns: "int",
      tests: [{ args: [10], expect: 16 }, { args: [0], expect: 1 }, { args: [16], expect: 25 }, { args: [24], expect: 25 }],
      solutions: {
        python: ["def first_square_above(n):", "    k = 1", "    while k * k <= n:", "        k += 1", "    return k * k"],
        java: ["static int firstSquareAbove(int n) {", "    int k = 1;", "    while (k * k <= n) k++;", "    return k * k;", "}"],
        rust: ["fn first_square_above(n: i32) -> i32 {", "    let mut k = 1;", "    while k * k <= n { k += 1; }", "    k * k", "}"],
        c: ["int first_square_above(int n) {", "    int k = 1;", "    while (k * k <= n) k++;", "    return k * k;", "}"],
        cpp: ["int first_square_above(int n) {", "    int k = 1;", "    while (k * k <= n) k++;", "    return k * k;", "}"]
      }
    },

    compare: {
      intro: "Three plans that stop at the first success.",
      rows: [
        { id: "G2", name: "Generate and test", question: "Smallest divisor of 91?", shape: "make candidates one by one; stop at the first that passes", result: "the candidate", self: true },
        { id: "D6", name: "Find the first", question: "First negative in a list?", shape: "walk existing items; stop at the first match", result: "its position" },
        { id: "C4", name: "Repeat until a target", question: "Years until savings double?", shape: "one round at a time until the goal", result: "the number of rounds" }
      ],
      table: { head: ["Plan", "Candidates come from", "Stops at", "Returns"], rows: [["Generate and test", "made up as you go (2, 3, 4, …)", "the first that passes the test", "that candidate"], ["Find the first", "an existing list", "the first match", "its position"], ["Repeat until a target", "repeated rounds", "the goal", "how many rounds"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "G1", why: "the test for each candidate" }, { id: "C4", why: "loop until something succeeds" }],
      leadsTo: [{ id: "F2", why: "when candidates are ordered, halving finds the answer faster" }]
    }
  };
})();
