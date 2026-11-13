/* Plan data: D3 · Average
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const f = (x) => (Number.isInteger(x) ? x.toFixed(1) : String(+x.toFixed(6)));

  window.PLAN = {
    id: "D3",
    slug: "average",
    title: "Average",
    highlight: "Average",
    aka: ["mean", "arithmetic mean", "total ÷ count"],
    group: "D",
    level: "Foundations",
    core: true,
    fn: { python: "average", java: "average", rust: "average", c: "average", cpp: "average" },

    hero: {
      type: "tiles",
      values: [70, 80, 90],
      colors: ["pale", "pale", "amber"],
      tagAt: 2,
      tag: "240 ÷ 3 = 80.0",
      alt: "Three cubes, 70, 80 and 90, with the tag 240 divided by 3 is 80.0"
    },
    planCard: { name: "average", lines: ["empty? → 0.0", "total and count", "total ÷ count"], foot: "→ as a decimal" },

    intent: "Find the typical value of a collection: add the items up, count them, and divide, but only if there is at least one item.",

    analogy: {
      icon: "🍕",
      title: "Sharing pizza slices fairly",
      text: "Pile all the slices together and share them out evenly: the slices each person gets is the total divided by the number of people. With nobody at the table, the question doesn't make sense."
    },

    cues: ["average", "mean", "on average", "typical", "per item"],
    cueSummary: "The answer is <b>total ÷ count</b>, usually with decimals. Ask what should happen when there are no items.",
    cueExamples: [
      "What is the class's average score?",
      "What was the average temperature this week?",
      "On average, how many steps did I walk per day?"
    ],

    steps: [
      { n: 1, title: "Guard: no items, no average", text: "Dividing by a count of 0 would crash or give nonsense, so decide what an empty list returns (here 0.0)." },
      { n: 2, title: "Keep a running total", text: "This is the Accumulate plan (D2)." },
      { n: 3, title: "Count the items", text: "This is the Counting plan (D1), counting every item. Both run in the same loop." },
      { n: 4, title: "Divide, keeping the decimals", text: "total ÷ count as a floating-point division, so 3 ÷ 2 gives 1.5, not 1." }
    ],

    impl: {
      python: {
        file: "average.py",
        plain: { lines: [
          [0, "def average(scores):"],
          [1, "    if len(scores) == 0:"],
          [1, "        return 0.0"],
          [2, "    total = 0"],
          [3, "    count = 0"],
          [[2, 3], "    for s in scores:"],
          [2, "        total += s"],
          [3, "        count += 1"],
          [4, "    return total / count"]
        ], note: "Python's <code>len(scores)</code> already knows the count; the loop counts by hand to show the plan." },
        idiomatic: { lines: [
          [0, "def average(scores):"],
          [[1, 2, 3, 4], "    return sum(scores) / len(scores) if scores else 0.0"]
        ], note: "An empty list is false in Python, so <code>if scores</code> is the guard." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static double average(int[] scores) {"],
          [1, "    if (scores.length == 0) {"],
          [1, "        return 0.0;"],
          [0, "    }"],
          [2, "    int total = 0;"],
          [3, "    int count = 0;"],
          [[2, 3], "    for (int s : scores) {"],
          [2, "        total += s;"],
          [3, "        count++;"],
          [0, "    }"],
          [4, "    return (double) total / count;"],
          [0, "}"]
        ], note: "<code>(double) total</code> converts first, so the division keeps its decimals." },
        idiomatic: { lines: [
          [0, "static double average(int[] scores) {"],
          [[1, 2, 3, 4], "    return Arrays.stream(scores).average().orElse(0.0);"],
          [0, "}"]
        ], note: "<code>average()</code> returns an empty <code>OptionalDouble</code> for no items; <code>orElse</code> is the guard." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn average(scores: &[i32]) -> f64 {"],
          [1, "    if scores.is_empty() {"],
          [1, "        return 0.0;"],
          [0, "    }"],
          [2, "    let mut total = 0;"],
          [3, "    let mut count = 0;"],
          [[2, 3], "    for &s in scores {"],
          [2, "        total += s;"],
          [3, "        count += 1;"],
          [0, "    }"],
          [4, "    total as f64 / count as f64"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "fn average(scores: &[i32]) -> f64 {"],
          [1, "    if scores.is_empty() {"],
          [1, "        return 0.0;"],
          [0, "    }"],
          [[2, 3, 4], "    scores.iter().sum::<i32>() as f64 / scores.len() as f64"],
          [0, "}"]
        ], note: "Rust has no built-in mean; <code>sum</code> and <code>len</code> do the work." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "double average(const int scores[], size_t n) {"],
          [1, "    if (n == 0) {"],
          [1, "        return 0.0;"],
          [0, "    }"],
          [2, "    int total = 0;"],
          [3, "    int count = 0;"],
          [[2, 3], "    for (size_t i = 0; i < n; i++) {"],
          [2, "        total += scores[i];"],
          [3, "        count++;"],
          [0, "    }"],
          [4, "    return (double) total / count;"],
          [0, "}"]
        ] },
        idiomatic: null,
        idiomaticNote: "C has no built-in average, so the loop is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "#include <vector>"],
          [0, ""],
          [0, "double average(const std::vector<int>& scores) {"],
          [1, "    if (scores.empty()) {"],
          [1, "        return 0.0;"],
          [0, "    }"],
          [2, "    int total = 0;"],
          [3, "    int count = 0;"],
          [[2, 3], "    for (int s : scores) {"],
          [2, "        total += s;"],
          [3, "        count++;"],
          [0, "    }"],
          [4, "    return static_cast<double>(total) / count;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "#include <numeric>"],
          [0, "#include <vector>"],
          [0, ""],
          [0, "double average(const std::vector<int>& scores) {"],
          [1, "    if (scores.empty()) {"],
          [1, "        return 0.0;"],
          [0, "    }"],
          [[2, 3, 4], "    return static_cast<double>(std::accumulate(scores.begin(), scores.end(), 0)) / scores.size();"],
          [0, "}"]
        ] }
      }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>What is the average score?</b> An empty list gives 0.0.",
      input: { kind: "list", max: 10, placeholder: "your scores: 70, 80, 90" },
      presets: [
        { label: "Three scores", input: [70, 80, 90] },
        { label: "Not a whole number", input: [1, 2] },
        { label: "One score", input: [65] },
        { label: "Empty list", input: [] }
      ],
      run(list) {
        const n = list.length, ev = [], states = list.map(() => "");
        let total = 0, count = 0, avg = "?";
        const snap = (step, msg, cur = -1, tone = "") => ev.push({
          step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur },
          vars: [{ k: "total", role: "gatherer", v: total }, { k: "count", role: "count", v: count }, { k: "average", role: "result", v: avg }]
        });
        snap(null, n ? `Ready. ${n} scores to average.` : "Ready. The list is empty.");
        if (n === 0) {
          avg = "0.0";
          snap(1, "Guard: there are no items, so there is no average. Return 0.0 without dividing.", -1, "no");
          return ev;
        }
        snap(1, `Guard: the list has ${n} item${n > 1 ? "s" : ""}, so dividing is safe. Carry on.`);
        for (let i = 0; i < n; i++) {
          states[i] = "current";
          total += list[i];
          snap(2, `Visit item [${i}] and add it: total = ${total}`, i);
          count++;
          states[i] = "added";
          snap(3, `Count it: count = ${count}`, i);
        }
        avg = f(total / count);
        snap(4, `Divide: ${total} / ${count} = ${avg}`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"],
      returns: "double",
      cases: [
        { args: [[70, 80, 90]], expect: 80.0 },
        { args: [[1, 2]], expect: 1.5 },
        { args: [[]], expect: 0.0 },
        { args: [[5]], expect: 5.0 }
      ],
      snippets: {
        bugIntDiv: [{ args: [[1, 2]], expect: 1.0 }],
        bugCountStart: [{ args: [[2, 4]], expect: 2.0 }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "Integer division", wide: true, code: "bugIntDiv",
        text: "In Java, C and C++, an <code>int</code> divided by an <code>int</code> drops the fraction: the average of 1 and 2 comes out as 1.0 instead of 1.5. Python's <code>//</code> does the same.",
        take: "Convert to a floating-point type before dividing." },
      { kind: "dont", title: "No guard for an empty list",
        text: "With no items the count is 0. Python raises <code>ZeroDivisionError</code>, Java throws for integers, and C gives undefined behaviour.",
        take: "Decide what “no items” should return, and check it first." },
      { kind: "dont", title: "Counting from 1",
        text: "Starting the count at 1 divides by one too many, so every average comes out too small.",
        take: "Counters start at 0." },
      { kind: "do", title: "Do it in one pass",
        text: "Total and count can share one loop. Two separate loops over the same data also work, but do twice the walking." },
      { kind: "do", title: "Test a case with decimals",
        text: "[1, 2] → 1.5 catches integer division at once. Averages like [70, 80, 90] → 80.0 hide it." }
    ],

    snippets: {
      bugIntDiv: {
        python: ["def average(scores):", "    if len(scores) == 0:", "        return 0.0", "    total = 0", "    count = 0", "    for s in scores:", "        total += s", "        count += 1", "    return float(total // count)   # ✗ floor division"],
        java: ["static double average(int[] scores) {", "    if (scores.length == 0) {", "        return 0.0;", "    }", "    int total = 0;", "    int count = 0;", "    for (int s : scores) {", "        total += s;", "        count++;", "    }", "    return total / count;   // ✗ int / int", "}"],
        rust: ["fn average(scores: &[i32]) -> f64 {", "    if scores.is_empty() {", "        return 0.0;", "    }", "    let mut total = 0;", "    let mut count = 0;", "    for &s in scores {", "        total += s;", "        count += 1;", "    }", "    (total / count) as f64  // ✗ divides before converting", "}"],
        c: ["double average(const int scores[], size_t n) {", "    if (n == 0) {", "        return 0.0;", "    }", "    int total = 0;", "    int count = 0;", "    for (size_t i = 0; i < n; i++) {", "        total += scores[i];", "        count++;", "    }", "    return total / count;   // ✗ int / int", "}"],
        cpp: ["double average(const std::vector<int>& scores) {", "    if (scores.empty()) {", "        return 0.0;", "    }", "    int total = 0;", "    int count = 0;", "    for (int s : scores) {", "        total += s;", "        count++;", "    }", "    return total / count;   // ✗ int / int", "}"]
      },
      bugCountStart: {
        python: ["def average(scores):", "    if len(scores) == 0:", "        return 0.0", "    total = 0", "    count = 1", "    for s in scores:", "        total += s", "        count += 1", "    return total / count"],
        java: ["static double average(int[] scores) {", "    if (scores.length == 0) {", "        return 0.0;", "    }", "    int total = 0;", "    int count = 1;", "    for (int s : scores) {", "        total += s;", "        count++;", "    }", "    return (double) total / count;", "}"],
        rust: ["fn average(scores: &[i32]) -> f64 {", "    if scores.is_empty() {", "        return 0.0;", "    }", "    let mut total = 0;", "    let mut count = 1;", "    for &s in scores {", "        total += s;", "        count += 1;", "    }", "    total as f64 / count as f64", "}"],
        c: ["double average(const int scores[], size_t n) {", "    if (n == 0) {", "        return 0.0;", "    }", "    int total = 0;", "    int count = 1;", "    for (size_t i = 0; i < n; i++) {", "        total += scores[i];", "        count++;", "    }", "    return (double) total / count;", "}"],
        cpp: ["double average(const std::vector<int>& scores) {", "    if (scores.empty()) {", "        return 0.0;", "    }", "    int total = 0;", "    int count = 1;", "    for (int s : scores) {", "        total += s;", "        count++;", "    }", "    return static_cast<double>(total) / count;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([1, 2, 3, 4]) return?", options: ["2", "2.5", "10", "4"], answer: 1,
        explain: "The total is 10 and the count is 4, so the average is 10 ÷ 4 = 2.5." },
      { q: "Why does the guard come before the loop?", options: ["It makes the loop faster", "So we never divide by a count of 0", "Because the list might be sorted"], answer: 1,
        explain: "An empty list has a count of 0, and dividing by 0 fails. The guard answers that case before any division happens." },
      { q: "This version has a bug. What does it return for [2, 4]?", code: "bugCountStart", options: ["3.0", "2.0", "6.0"], answer: 1,
        explain: "count starts at 1 and becomes 3 after two items, so it computes 6 ÷ 3 = 2.0 instead of 6 ÷ 2 = 3.0." }
    ],

    exercise: {
      title: "Your turn: average of the positive numbers",
      task: "Write <code>average_positive(numbers)</code> that returns the average of only the numbers greater than 0. If there are none, return 0.0.",
      plan: ["Keep a total and a count, both starting at 0", "Visit each number", "If it's positive, add it to the total and count it", "If the count is 0, return 0.0; otherwise return total ÷ count as a decimal"],
      fn: { python: "average_positive", java: "averagePositive", rust: "average_positive", c: "average_positive", cpp: "average_positive" },
      params: ["int[]"],
      returns: "double",
      tests: [
        { args: [[3, -1, 5]], expect: 4.0 },
        { args: [[-2, -3]], expect: 0.0 },
        { args: [[]], expect: 0.0 },
        { args: [[1, 2]], expect: 1.5 }
      ],
      solutions: {
        python: ["def average_positive(numbers):", "    total = 0", "    count = 0", "    for x in numbers:", "        if x > 0:", "            total += x", "            count += 1", "    if count == 0:", "        return 0.0", "    return total / count"],
        java: ["static double averagePositive(int[] numbers) {", "    int total = 0;", "    int count = 0;", "    for (int x : numbers) {", "        if (x > 0) {", "            total += x;", "            count++;", "        }", "    }", "    if (count == 0) {", "        return 0.0;", "    }", "    return (double) total / count;", "}"],
        rust: ["fn average_positive(numbers: &[i32]) -> f64 {", "    let mut total = 0;", "    let mut count = 0;", "    for &x in numbers {", "        if x > 0 {", "            total += x;", "            count += 1;", "        }", "    }", "    if count == 0 {", "        return 0.0;", "    }", "    total as f64 / count as f64", "}"],
        c: ["double average_positive(const int numbers[], size_t n) {", "    int total = 0;", "    int count = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] > 0) {", "            total += numbers[i];", "            count++;", "        }", "    }", "    if (count == 0) {", "        return 0.0;", "    }", "    return (double) total / count;", "}"],
        cpp: ["#include <vector>", "", "double average_positive(const std::vector<int>& numbers) {", "    int total = 0;", "    int count = 0;", "    for (int x : numbers) {", "        if (x > 0) {", "            total += x;", "            count++;", "        }", "    }", "    if (count == 0) {", "        return 0.0;", "    }", "    return static_cast<double>(total) / count;", "}"]
      }
    },

    compare: {
      intro: "Average is two plans in one loop. Here is how it relates to its parts, on <code>[70, 80, 90]</code>.",
      data: [70, 80, 90],
      rows: [
        { id: "D3", name: "Average", question: "What's the average?", result: "80.0", self: true },
        { id: "D2", name: "Accumulate", question: "What's the total?", result: "240" },
        { id: "D1", name: "Counting", question: "How many are there?", result: "3" }
      ],
      table: {
        head: ["Plan", "Needs a guard?", "Result type", "Combines"],
        rows: [
          ["Average", "yes, for an empty list", "decimal", "Accumulate + Counting"],
          ["Accumulate", "no (empty gives 0)", "same as the items", "—"],
          ["Counting", "no (empty gives 0)", "whole number", "—"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "D2", why: "the running total" }, { id: "D1", why: "the count" }, { id: "B1", why: "the guard against an empty list" }],
      leadsTo: [{ id: "D4", why: "another one-number summary of a list" }, { id: "D9", why: "average only the items that pass a filter" }]
    }
  };
})();
