/* Plan data: D4 · Largest / smallest
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "D4",
    slug: "largest-smallest",
    title: "Largest / smallest",
    highlight: "Largest",
    aka: ["maximum / minimum", "best so far", "extreme value"],
    group: "D",
    level: "Foundations",
    core: true,
    fn: { python: "largest", java: "largest", rust: "largest", c: "largest", cpp: "largest" },

    hero: {
      type: "tiles",
      values: [4, 9, 2, 9, 7],
      colors: ["pale", "amber", "pale", "pale", "pale"],
      highlight: 1,
      tag: "best = 9",
      alt: "Five cubes, 4, 9, 2, 9 and 7; the first 9 is amber as the best so far"
    },
    planCard: { name: "largest", lines: ["best = first item", "for each other item", "bigger? new best"], foot: "→ return best" },

    intent: "Find the most extreme value: take the first item as the best so far, then let every later item challenge it.",

    analogy: {
      icon: "🏆",
      title: "King of the hill",
      text: "The first player stands on the hill. Each new player challenges whoever is up there, and takes the hill only if they're stronger. When the last challenger is done, whoever stands on the hill is the strongest of all."
    },

    cues: ["largest / biggest / highest", "smallest / lowest", "maximum / minimum", "most / least", "record", "best"],
    cueSummary: "The answer is <b>one of the items</b>: the one that beats all the others. Every item must be compared.",
    cueExamples: [
      "What was the highest temperature this week?",
      "What's the cheapest price in the list?",
      "What is the longest word in a sentence?"
    ],

    steps: [
      { n: 1, title: "Start with the first item as the best so far", text: "Not with 0: if every value is negative, 0 would wrongly win." },
      { n: 2, title: "Visit each of the other items", text: "The first one is already the best so far." },
      { n: 3, title: "Compare it with the best so far", text: "For the largest, is it bigger? For the smallest, is it smaller?" },
      { n: 4, title: "Better? It becomes the new best", text: "Otherwise the best so far stays." },
      { n: 5, title: "Return the best", text: "After the loop, the best so far is the best of all." }
    ],

    impl: {
      python: {
        file: "largest.py",
        plain: { lines: [
          [0, "def largest(numbers):"],
          [1, "    best = numbers[0]"],
          [2, "    for x in numbers[1:]:"],
          [3, "        if x > best:"],
          [4, "            best = x"],
          [5, "    return best"]
        ], note: "The list must have at least one item: <code>numbers[0]</code> fails on an empty list. Guard first (B1) if it can be empty." },
        idiomatic: { lines: [
          [0, "def largest(numbers):"],
          [[1, 2, 3, 4, 5], "    return max(numbers)"]
        ], note: "<code>max()</code> raises <code>ValueError</code> for an empty list; <code>max(numbers, default=None)</code> avoids that." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static int largest(int[] numbers) {"],
          [1, "    int best = numbers[0];"],
          [2, "    for (int i = 1; i < numbers.length; i++) {"],
          [3, "        if (numbers[i] > best) {"],
          [4, "            best = numbers[i];"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return best;"],
          [0, "}"]
        ], note: "The loop starts at index 1, because item 0 is already the best so far." },
        idiomatic: { lines: [
          [0, "static int largest(int[] numbers) {"],
          [[1, 2, 3, 4, 5], "    return Arrays.stream(numbers).max().getAsInt();"],
          [0, "}"]
        ], note: "<code>max()</code> returns an <code>OptionalInt</code>, which is empty for an empty array." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn largest(numbers: &[i32]) -> i32 {"],
          [1, "    let mut best = numbers[0];"],
          [2, "    for &x in &numbers[1..] {"],
          [3, "        if x > best {"],
          [4, "            best = x;"],
          [0, "        }"],
          [0, "    }"],
          [5, "    best"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "fn largest(numbers: &[i32]) -> i32 {"],
          [[1, 2, 3, 4, 5], "    *numbers.iter().max().unwrap()"],
          [0, "}"]
        ], note: "<code>max()</code> returns an <code>Option</code>: <code>None</code> for an empty slice, which <code>unwrap</code> turns into a panic." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "int largest(const int numbers[], size_t n) {"],
          [1, "    int best = numbers[0];"],
          [2, "    for (size_t i = 1; i < n; i++) {"],
          [3, "        if (numbers[i] > best) {"],
          [4, "            best = numbers[i];"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return best;"],
          [0, "}"]
        ] },
        idiomatic: null,
        idiomaticNote: "C has no built-in maximum for arrays, so the loop is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "#include <vector>"],
          [0, ""],
          [0, "int largest(const std::vector<int>& numbers) {"],
          [1, "    int best = numbers[0];"],
          [2, "    for (size_t i = 1; i < numbers.size(); i++) {"],
          [3, "        if (numbers[i] > best) {"],
          [4, "            best = numbers[i];"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return best;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "#include <algorithm>"],
          [0, "#include <vector>"],
          [0, ""],
          [0, "int largest(const std::vector<int>& numbers) {"],
          [[1, 2, 3, 4, 5], "    return std::ranges::max(numbers);"],
          [0, "}"]
        ], note: "<code>std::ranges::max</code> (C++20) must not be called on an empty range." }
      }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>What is the largest number in the list?</b> The list has at least one item.",
      input: { kind: "list", max: 10, placeholder: "your list: 4, 9, 2" },
      presets: [
        { label: "Mixed", input: [4, 9, 2, 9, 7] },
        { label: "All negative", input: [-5, -2, -9] },
        { label: "Rising", input: [1, 2, 3, 4] },
        { label: "One item", input: [42] }
      ],
      run(raw) {
        const list = raw.length ? raw : [0];
        const n = list.length, ev = [], states = list.map(() => "");
        let best = list[0], bestAt = 0;
        const snap = (step, msg, cur = -1, tone = "") => {
          const st = states.slice(); st[bestAt] = st[bestAt] === "current" ? "current" : "best";
          const badges = list.map((_, i) => (i === bestAt ? "best" : ""));
          ev.push({ step, msg, tone, view: { values: list, states: st, ptr: cur, badges },
            vars: [{ k: "x", role: "walker", v: cur > 0 ? list[cur] : "—" }, { k: "best", role: "best", v: best }] });
        };
        ev.push({ step: null, msg: raw.length ? "Ready. Which number is the largest?" : "The list must not be empty, so this trace uses [0].", view: { values: list, states: states.slice(), ptr: -1 }, vars: [{ k: "x", role: "walker", v: "—" }, { k: "best", role: "best", v: "?" }] });
        snap(1, `Start with the first item: best = ${best}.`, 0);
        for (let i = 1; i < n; i++) {
          states[i] = "current";
          snap(2, `Visit item [${i}]: x = ${list[i]}`, i);
          const better = list[i] > best;
          states[i] = "miss";
          if (better) {
            snap(3, `Is ${list[i]} > ${best}? Yes, it beats the best so far.`, i);
            best = list[i]; bestAt = i;
            snap(4, `New best: best = ${best}.`, i);
          } else {
            snap(3, `Is ${list[i]} > ${best}? No${list[i] === best ? " (equal isn't bigger)" : ""}, so the best stays ${best}.`, i);
          }
        }
        snap(5, (n === 1 ? `There's only one item, so it's the largest. Return ${best}.` : `All ${n} items compared. Return ${best}.`), -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"],
      returns: "int",
      cases: [
        { args: [[4, 9, 2, 9, 7]], expect: 9 },
        { args: [[-5, -2, -9]], expect: -2 },
        { args: [[42]], expect: 42 },
        { args: [[1, 2, 3]], expect: 3 }
      ],
      snippets: {
        bugZero: [{ args: [[-5, -2, -9]], expect: 0 }, { args: [[4, 9, 2]], expect: 9 }],
        bugSign: [{ args: [[3, 9, 4]], expect: 3 }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "Starting the best at 0", wide: true, code: "bugZero",
        text: "It works on positive numbers, so it passes casual testing. But with [-5, -2, -9], nothing beats 0, and the function returns 0, a number that isn't even in the list.",
        take: "Start with the first item. It is always a real candidate." },
      { kind: "dont", title: "Comparing the wrong way round",
        text: "<code>x &lt; best</code> finds the smallest, not the largest. The code looks almost the same, so the mistake is easy to miss.",
        take: "Read the comparison aloud: “is it bigger than the best so far?”" },
      { kind: "dont", title: "Forgetting the empty list",
        text: "An empty list has no largest value. <code>numbers[0]</code> crashes (or reads garbage in C).",
        take: "If the list can be empty, guard first (B1) and decide what to return." },
      { kind: "do", title: "Decide what happens on a tie",
        text: "With <code>&gt;</code>, the first of two equal values stays the best. With <code>&gt;=</code>, the last one wins. It matters when you need the position (D5)." },
      { kind: "do", title: "Use the built-in once you understand it",
        text: "<code>max()</code>, <code>stream().max()</code>, <code>.iter().max()</code> and <code>std::ranges::max</code> are this plan." }
    ],

    snippets: {
      bugZero: {
        python: ["def largest(numbers):", "    best = 0           # ✗ 0 may not be in the list", "    for x in numbers:", "        if x > best:", "            best = x", "    return best"],
        java: ["static int largest(int[] numbers) {", "    int best = 0;      // ✗ 0 may not be in the list", "    for (int x : numbers) {", "        if (x > best) {", "            best = x;", "        }", "    }", "    return best;", "}"],
        rust: ["fn largest(numbers: &[i32]) -> i32 {", "    let mut best = 0;  // ✗ 0 may not be in the list", "    for &x in numbers {", "        if x > best {", "            best = x;", "        }", "    }", "    best", "}"],
        c: ["int largest(const int numbers[], size_t n) {", "    int best = 0;      // ✗ 0 may not be in the list", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] > best) {", "            best = numbers[i];", "        }", "    }", "    return best;", "}"],
        cpp: ["int largest(const std::vector<int>& numbers) {", "    int best = 0;      // ✗ 0 may not be in the list", "    for (int x : numbers) {", "        if (x > best) {", "            best = x;", "        }", "    }", "    return best;", "}"]
      },
      bugSign: {
        python: ["def largest(numbers):", "    best = numbers[0]", "    for x in numbers[1:]:", "        if x < best:", "            best = x", "    return best"],
        java: ["static int largest(int[] numbers) {", "    int best = numbers[0];", "    for (int i = 1; i < numbers.length; i++) {", "        if (numbers[i] < best) {", "            best = numbers[i];", "        }", "    }", "    return best;", "}"],
        rust: ["fn largest(numbers: &[i32]) -> i32 {", "    let mut best = numbers[0];", "    for &x in &numbers[1..] {", "        if x < best {", "            best = x;", "        }", "    }", "    best", "}"],
        c: ["int largest(const int numbers[], size_t n) {", "    int best = numbers[0];", "    for (size_t i = 1; i < n; i++) {", "        if (numbers[i] < best) {", "            best = numbers[i];", "        }", "    }", "    return best;", "}"],
        cpp: ["int largest(const std::vector<int>& numbers) {", "    int best = numbers[0];", "    for (size_t i = 1; i < numbers.size(); i++) {", "        if (numbers[i] < best) {", "            best = numbers[i];", "        }", "    }", "    return best;", "}"]
      }
    },

    quiz: [
      { q: "In {fn}([3, 8, 5, 10, 1]), how many times does best change after it starts at 3?", options: ["1", "2", "3", "4"], answer: 1,
        explain: "8 beats 3 (first change), 5 doesn't beat 8, 10 beats 8 (second change), 1 doesn't beat 10. Two changes." },
      { q: "This version has a bug. What does it return for [3, 9, 4]?", code: "bugSign", options: ["9", "3", "4"], answer: 1,
        explain: "The comparison is x < best, so it keeps the smallest value: 3. Flip it to x > best for the largest." },
      { q: "Why not start with best = 0?", options: ["It's slower", "Every item might be negative", "0 is not an integer"], answer: 1,
        explain: "For [-5, -2, -9], no item beats 0, so the answer would be 0, which isn't in the list. The first item is always a real candidate." }
    ],

    exercise: {
      title: "Your turn: find the smallest",
      task: "Write <code>smallest(numbers)</code> that returns the smallest number in a non-empty list.",
      plan: ["Start with the first number as the best so far", "Visit each of the other numbers", "Is it smaller than the best so far?", "If so, it becomes the new best", "Return the best"],
      fn: { python: "smallest", java: "smallest", rust: "smallest", c: "smallest", cpp: "smallest" },
      params: ["int[]"],
      returns: "int",
      tests: [
        { args: [[4, 9, 2]], expect: 2 },
        { args: [[-1, -7, 3]], expect: -7 },
        { args: [[5]], expect: 5 },
        { args: [[8, 8]], expect: 8 }
      ],
      solutions: {
        python: ["def smallest(numbers):", "    best = numbers[0]", "    for x in numbers[1:]:", "        if x < best:", "            best = x", "    return best"],
        java: ["static int smallest(int[] numbers) {", "    int best = numbers[0];", "    for (int i = 1; i < numbers.length; i++) {", "        if (numbers[i] < best) {", "            best = numbers[i];", "        }", "    }", "    return best;", "}"],
        rust: ["fn smallest(numbers: &[i32]) -> i32 {", "    let mut best = numbers[0];", "    for &x in &numbers[1..] {", "        if x < best {", "            best = x;", "        }", "    }", "    best", "}"],
        c: ["int smallest(const int numbers[], size_t n) {", "    int best = numbers[0];", "    for (size_t i = 1; i < n; i++) {", "        if (numbers[i] < best) {", "            best = numbers[i];", "        }", "    }", "    return best;", "}"],
        cpp: ["#include <vector>", "", "int smallest(const std::vector<int>& numbers) {", "    int best = numbers[0];", "    for (size_t i = 1; i < numbers.size(); i++) {", "        if (numbers[i] < best) {", "            best = numbers[i];", "        }", "    }", "    return best;", "}"]
      }
    },

    compare: {
      intro: "Three plans that summarise <code>[4, 9, 2, 9, 7]</code> by visiting every item.",
      data: [4, 9, 2, 9, 7],
      rows: [
        { id: "D4", name: "Largest / smallest", question: "What is the largest value?", result: "9", self: true },
        { id: "D5", name: "Position of the largest", question: "Where is the largest value?", result: "index 1" },
        { id: "D2", name: "Accumulate", question: "What is the total?", result: "31" }
      ],
      table: {
        head: ["Plan", "Remembers", "Starts with", "Returns"],
        rows: [
          ["Largest / smallest", "the best value so far", "the first item", "a value from the list"],
          ["Position of the largest", "the index of the best so far", "index 0", "an index"],
          ["Accumulate", "a running total", "0", "a combined value"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "C1", why: "a loop over the items" }, { id: "B2", why: "the “is it better?” comparison" }],
      leadsTo: [{ id: "D5", why: "remember where the best is, not just its value" }, { id: "F3", why: "selection sort repeats this plan" }]
    }
  };
})();
