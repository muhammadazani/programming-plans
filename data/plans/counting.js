/* Plan data: D1 · Counting
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const PASS = 50;

  window.PLAN = {
    id: "D1",
    slug: "counting",
    title: "Counting",
    highlight: "Counting",
    aka: ["counter", "tally", "count if"],
    group: "D",
    level: "Foundations",
    core: true,
    fn: { python: "count_passed", java: "countPassed", rust: "count_passed", c: "count_passed", cpp: "count_passed" },

    hero: {
      type: "tiles",
      values: [72, 45, 90, 50, 38],
      colors: ["amber", "pale", "amber", "amber", "pale"],
      tagAt: 4,
      tag: "count = 3",
      alt: "Five cubes: 72, 90 and 50 are amber because they pass, 45 and 38 are pale; the tag says count = 3"
    },
    planCard: { name: "count", lines: ["count = 0", "for each item", "match? count + 1"], foot: "→ return count" },

    intent: "Find out how many items pass a test: start a counter at zero, visit every item, and add one each time an item passes.",

    analogy: {
      icon: "🚗",
      title: "A traffic survey with a clicker",
      text: "You stand at the roadside with a hand clicker that starts at 0. Every red car that passes gets one click; every other car gets none. At the end of the hour, the number on the clicker is the answer."
    },

    cues: ["how many …", "count …", "number of …", "how often …", "tally"],
    cueSummary: "The answer is a <b>whole number</b>: how many items pass a test. Every item has to be checked.",
    cueExamples: [
      "How many students scored at least 50?",
      "How many words in a sentence start with a capital letter?",
      "How many days this month were warmer than 30 °C?"
    ],

    steps: [
      { n: 1, title: "Start the counter at zero", text: "Nothing has been counted yet." },
      { n: 2, title: "Visit each item", text: "Every item, from first to last. Counting can't stop early." },
      { n: 3, title: "Test it", text: "Does this item count? Here: is the score at least 50?" },
      { n: 4, title: "Match? Add one", text: "Only items that pass the test change the counter." },
      { n: 5, title: "Return the count", text: "After the loop, once every item has been seen." }
    ],

    impl: {
      python: {
        file: "count.py",
        plain: { lines: [
          [0, "def count_passed(scores):"],
          [1, "    count = 0"],
          [2, "    for s in scores:"],
          [3, "        if s >= 50:"],
          [4, "            count += 1"],
          [5, "    return count"]
        ] },
        idiomatic: { lines: [
          [0, "def count_passed(scores):"],
          [[1, 2, 3, 4, 5], "    return sum(1 for s in scores if s >= 50)"]
        ], note: "Adds up a 1 for every score that passes. Same plan, written as one expression." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static int countPassed(int[] scores) {"],
          [1, "    int count = 0;"],
          [2, "    for (int s : scores) {"],
          [3, "        if (s >= 50) {"],
          [4, "            count++;"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return count;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "static int countPassed(int[] scores) {"],
          [[1, 2, 3, 4, 5], "    return (int) Arrays.stream(scores).filter(s -> s >= 50).count();"],
          [0, "}"]
        ], note: "<code>count()</code> returns a <code>long</code>, hence the cast." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn count_passed(scores: &[i32]) -> i32 {"],
          [1, "    let mut count = 0;"],
          [2, "    for &s in scores {"],
          [3, "        if s >= 50 {"],
          [4, "            count += 1;"],
          [0, "        }"],
          [0, "    }"],
          [5, "    count"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "fn count_passed(scores: &[i32]) -> i32 {"],
          [[1, 2, 3, 4, 5], "    scores.iter().filter(|&&s| s >= 50).count() as i32"],
          [0, "}"]
        ], note: "<code>count()</code> gives a <code>usize</code>; <code>as i32</code> converts it." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "int count_passed(const int scores[], size_t n) {"],
          [1, "    int count = 0;"],
          [2, "    for (size_t i = 0; i < n; i++) {"],
          [3, "        if (scores[i] >= 50) {"],
          [4, "            count++;"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return count;"],
          [0, "}"]
        ] },
        idiomatic: null,
        idiomaticNote: "C has no built-in “count if”, so the loop is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "#include <vector>"],
          [0, ""],
          [0, "int count_passed(const std::vector<int>& scores) {"],
          [1, "    int count = 0;"],
          [2, "    for (int s : scores) {"],
          [3, "        if (s >= 50) {"],
          [4, "            count++;"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return count;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "#include <algorithm>"],
          [0, "#include <vector>"],
          [0, ""],
          [0, "int count_passed(const std::vector<int>& scores) {"],
          [[1, 2, 3, 4, 5], "    return static_cast<int>(std::ranges::count_if(scores, [](int s) { return s >= 50; }));"],
          [0, "}"]
        ], note: "<code>std::ranges::count_if</code> (C++20) is this exact plan." }
      }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>How many students passed?</b> A score passes if it is at least 50.",
      input: { kind: "list", max: 10, placeholder: "your scores: 72, 45, 90" },
      presets: [
        { label: "Mixed scores", input: [72, 45, 90, 50, 38] },
        { label: "Nobody passes", input: [10, 20, 30] },
        { label: "Everyone passes", input: [50, 50, 50] },
        { label: "Empty list", input: [] }
      ],
      run(list) {
        const n = list.length, ev = [], states = list.map(() => "");
        let count = 0;
        const snap = (step, msg, cur = -1, tone = "") => ev.push({
          step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur },
          vars: [{ k: "s", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "count", role: "count", v: count }]
        });
        snap(null, n ? "Ready. Nothing counted yet." : "Ready. The list is empty.");
        snap(1, "Start the counter: count = 0.");
        for (let i = 0; i < n; i++) {
          states[i] = "current";
          snap(2, `Visit item [${i}]: s = ${list[i]}`, i);
          const ok = list[i] >= PASS;
          states[i] = ok ? "hit" : "miss";
          snap(3, ok ? `Is ${list[i]} >= ${PASS}? Yes, it counts.` : `Is ${list[i]} >= ${PASS}? No, the counter stays at ${count}.`, i);
          if (ok) { count++; snap(4, `Add one: count is now ${count}.`, i); }
        }
        snap(5, n ? `${n === 1 ? "The only item is" : `All ${n} items are`} checked. Return ${count}.` : "No items to check. Return 0.", -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"],
      returns: "int",
      cases: [
        { args: [[72, 45, 90, 50, 38]], expect: 3 },
        { args: [[10, 20, 30]], expect: 0 },
        { args: [[]], expect: 0 },
        { args: [[50, 50, 50]], expect: 3 }
      ],
      snippets: {
        bugReturn: [{ args: [[45, 72, 90]], expect: 0 }],
        bugBoundary: [{ args: [[50, 70, 40]], expect: 1 }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "Returning inside the loop", wide: true, code: "bugReturn",
        text: "One indent too far, and the function returns after the first item: it counts at most one.",
        take: "The return goes after the loop, once every item has been checked." },
      { kind: "dont", title: "> instead of >=",
        text: "“At least 50” means 50 counts. Writing <code>&gt; 50</code> silently skips every score of exactly 50.",
        take: "Test the boundary value on purpose." },
      { kind: "dont", title: "Forgetting to reset the counter",
        text: "If the counter lives outside the function, or isn't reset between runs, the second call adds to the first call's total.",
        take: "Start the counter at 0 inside the function, every time." },
      { kind: "do", title: "Check the empty list",
        text: "With no items the loop never runs and the answer is 0. That's correct, so no special case is needed." },
      { kind: "do", title: "Use the built-in once you understand it",
        text: "Python's <code>sum(1 for …)</code>, Java's <code>filter().count()</code>, Rust's <code>.filter().count()</code> and C++'s <code>count_if</code> are this plan." }
    ],

    snippets: {
      bugReturn: {
        python: ["def count_passed(scores):", "    count = 0", "    for s in scores:", "        if s >= 50:", "            count += 1", "        return count     # ✗ inside the loop", "    return count"],
        java: ["static int countPassed(int[] scores) {", "    int count = 0;", "    for (int s : scores) {", "        if (s >= 50) {", "            count++;", "        }", "        return count;   // ✗ inside the loop", "    }", "    return count;", "}"],
        rust: ["fn count_passed(scores: &[i32]) -> i32 {", "    let mut count = 0;", "    for &s in scores {", "        if s >= 50 {", "            count += 1;", "        }", "        return count;  // ✗ inside the loop", "    }", "    count", "}"],
        c: ["int count_passed(const int scores[], size_t n) {", "    int count = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (scores[i] >= 50) {", "            count++;", "        }", "        return count;   // ✗ inside the loop", "    }", "    return count;", "}"],
        cpp: ["int count_passed(const std::vector<int>& scores) {", "    int count = 0;", "    for (int s : scores) {", "        if (s >= 50) {", "            count++;", "        }", "        return count;   // ✗ inside the loop", "    }", "    return count;", "}"]
      },
      bugBoundary: {
        python: ["def count_passed(scores):", "    count = 0", "    for s in scores:", "        if s > 50:", "            count += 1", "    return count"],
        java: ["static int countPassed(int[] scores) {", "    int count = 0;", "    for (int s : scores) {", "        if (s > 50) {", "            count++;", "        }", "    }", "    return count;", "}"],
        rust: ["fn count_passed(scores: &[i32]) -> i32 {", "    let mut count = 0;", "    for &s in scores {", "        if s > 50 {", "            count += 1;", "        }", "    }", "    count", "}"],
        c: ["int count_passed(const int scores[], size_t n) {", "    int count = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (scores[i] > 50) {", "            count++;", "        }", "    }", "    return count;", "}"],
        cpp: ["int count_passed(const std::vector<int>& scores) {", "    int count = 0;", "    for (int s : scores) {", "        if (s > 50) {", "            count++;", "        }", "    }", "    return count;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn} return for [50, 49, 100, 0]?", options: ["1", "2", "3", "4"], answer: 1,
        explain: "50 and 100 are at least 50; 49 and 0 aren't. Two scores pass." },
      { q: "Can a counting loop stop as soon as it finds a match?", options: ["Yes", "No"], answer: 1,
        explain: "Every item might count, so every item must be checked. Plans like “Is there any?” can stop early; counting can't." },
      { q: "This version has a bug. What does it return for [50, 70, 40]?", code: "bugBoundary", options: ["0", "1", "2", "3"], answer: 1,
        explain: "With > instead of >=, the score of exactly 50 doesn't count. Only 70 does, so it returns 1 instead of 2." }
    ],

    exercise: {
      title: "Your turn: count the even numbers",
      task: "Write <code>count_even(numbers)</code> that returns how many of the numbers are even. Remember that 0 and negative numbers like -2 can be even too.",
      plan: ["Start the counter at 0", "Visit each number", "Test it: is it divisible by 2?", "If so, add one to the counter", "Return the counter"],
      fn: { python: "count_even", java: "countEven", rust: "count_even", c: "count_even", cpp: "count_even" },
      params: ["int[]"],
      returns: "int",
      tests: [
        { args: [[1, 2, 3, 4]], expect: 2 },
        { args: [[]], expect: 0 },
        { args: [[7, 9]], expect: 0 },
        { args: [[0, -2, 5]], expect: 2 }
      ],
      solutions: {
        python: ["def count_even(numbers):", "    count = 0", "    for x in numbers:", "        if x % 2 == 0:", "            count += 1", "    return count"],
        java: ["static int countEven(int[] numbers) {", "    int count = 0;", "    for (int x : numbers) {", "        if (x % 2 == 0) {", "            count++;", "        }", "    }", "    return count;", "}"],
        rust: ["fn count_even(numbers: &[i32]) -> i32 {", "    let mut count = 0;", "    for &x in numbers {", "        if x % 2 == 0 {", "            count += 1;", "        }", "    }", "    count", "}"],
        c: ["int count_even(const int numbers[], size_t n) {", "    int count = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] % 2 == 0) {", "            count++;", "        }", "    }", "    return count;", "}"],
        cpp: ["#include <vector>", "", "int count_even(const std::vector<int>& numbers) {", "    int count = 0;", "    for (int x : numbers) {", "        if (x % 2 == 0) {", "            count++;", "        }", "    }", "    return count;", "}"]
      }
    },

    compare: {
      intro: "Three plans on the same scores <code>[72, 45, 90, 50, 38]</code>. Counting and accumulating visit every item; “Is there any?” stops at the first pass.",
      data: [72, 45, 90, 50, 38],
      rows: [
        { id: "D1", name: "Counting", question: "How many passed?", result: "3", self: true },
        { id: "D2", name: "Accumulate", question: "What's the total?", result: "295" },
        { id: "D7", name: "Is there any?", question: "Did anyone pass?", stop: 0, result: "True" }
      ],
      table: {
        head: ["Plan", "Answers", "Visits", "Starts at"],
        rows: [
          ["Counting", "how many (a whole number)", "every item", "0"],
          ["Accumulate", "a total or product", "every item", "0 for +, 1 for ×"],
          ["Is there any?", "yes / no", "until the first match", "—"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "C1", why: "a loop that visits every item" }, { id: "B2", why: "the yes/no test for each item" }],
      leadsTo: [{ id: "D3", why: "average = total ÷ count" }, { id: "D9", why: "keep the matching items, not just how many" }, { id: "D14", why: "one counter per category" }]
    }
  };
})();
