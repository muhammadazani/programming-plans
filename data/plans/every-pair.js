/* Plan data: E2 · Every pair
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const TARGET = 10;

  window.PLAN = {
    id: "E2",
    slug: "every-pair",
    title: "Every pair",
    highlight: "pair",
    aka: ["all pairs", "i < j nested loop", "pairwise comparison"],
    group: "E",
    level: "Core",
    core: false,
    fn: { python: "has_pair_sum", java: "hasPairSum", rust: "has_pair_sum", c: "has_pair_sum", cpp: "has_pair_sum" },

    hero: { type: "grid", rows: 4, tag: "j starts at i + 1", alt: "A staircase of cubes: each row has one cube fewer, the pairs above the diagonal" },
    planCard: { name: "every pair", lines: ["for each item i", "for each later item j", "test the pair (i, j)"], foot: "→ each pair exactly once" },

    intent: "Look at every pair of items exactly once: the inner loop starts just after the outer item, so no item is paired with itself and no pair is seen twice.",

    analogy: { icon: "🤝", title: "Everyone shakes hands once", text: "At a party, each guest shakes hands with every other guest exactly once. The first guest shakes hands with everyone after them; the second with everyone after them (they've already met the first); and so on. Nobody shakes their own hand." },

    cues: ["any two …", "every pair", "two items that …", "each combination of two", "compare everything with everything"],
    cueSummary: "The question is about <b>two items at a time</b>, and every combination of two must be considered.",
    cueExamples: ["Do any two numbers add up to 10?", "Are any two people in the class the same height?", "Which two cities are closest together?"],

    steps: [
      { n: 1, title: "Outer loop: each item i", text: "The first item of the pair." },
      { n: 2, title: "Inner loop: each later item j", text: "j starts at i + 1, so (i, i) and repeats like (j, i) are skipped." },
      { n: 3, title: "Test the pair", text: "Here: do numbers[i] and numbers[j] add up to 10?" },
      { n: 4, title: "Match? Answer yes and stop", text: "One pair is enough, as in “Is there any?” (D7)." },
      { n: 5, title: "No pair at all? Answer no", text: "Only after both loops have finished." }
    ],

    impl: {
      python: { file: "pairs.py",
        plain: { lines: [[0, "def has_pair_sum(numbers, target):"], [1, "    for i in range(len(numbers)):"], [2, "        for j in range(i + 1, len(numbers)):"], [3, "            if numbers[i] + numbers[j] == target:"], [4, "                return True"], [5, "    return False"]] },
        idiomatic: { lines: [[0, "from itertools import combinations"], [0, ""], [0, "def has_pair_sum(numbers, target):"], [[1, 2, 3, 4, 5], "    return any(a + b == target for a, b in combinations(numbers, 2))"]], note: "<code>combinations(numbers, 2)</code> produces exactly the pairs with i &lt; j." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static boolean hasPairSum(int[] numbers, int target) {"], [1, "    for (int i = 0; i < numbers.length; i++) {"], [2, "        for (int j = i + 1; j < numbers.length; j++) {"], [3, "            if (numbers[i] + numbers[j] == target) {"], [4, "                return true;"], [0, "            }"], [0, "        }"], [0, "    }"], [5, "    return false;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "The two index loops are the idiomatic Java; a stream version is harder to read." },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn has_pair_sum(numbers: &[i32], target: i32) -> bool {"], [1, "    for i in 0..numbers.len() {"], [2, "        for j in i + 1..numbers.len() {"], [3, "            if numbers[i] + numbers[j] == target {"], [4, "                return true;"], [0, "            }"], [0, "        }"], [0, "    }"], [5, "    false"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn has_pair_sum(numbers: &[i32], target: i32) -> bool {"], [[1, 2, 3, 4, 5], "    numbers.iter().enumerate().any(|(i, &a)| numbers[i + 1..].iter().any(|&b| a + b == target))"], [0, "}"]], note: "<code>numbers[i + 1..]</code> is “the items after i”: the inner loop as a slice." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "bool has_pair_sum(const int numbers[], size_t n, int target) {"], [1, "    for (size_t i = 0; i < n; i++) {"], [2, "        for (size_t j = i + 1; j < n; j++) {"], [3, "            if (numbers[i] + numbers[j] == target) {"], [4, "                return true;"], [0, "            }"], [0, "        }"], [0, "    }"], [5, "    return false;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "The two index loops are the idiomatic C." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "bool has_pair_sum(const std::vector<int>& numbers, int target) {"], [1, "    for (size_t i = 0; i < numbers.size(); i++) {"], [2, "        for (size_t j = i + 1; j < numbers.size(); j++) {"], [3, "            if (numbers[i] + numbers[j] == target) {"], [4, "                return true;"], [0, "            }"], [0, "        }"], [0, "    }"], [5, "    return false;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "The two index loops are the idiomatic C++." }
    },

    trace: {
      type: "grid",
      speed: 700,
      intro: `Running example: <b>Do any two numbers in the list add up to ${TARGET}?</b> Row i, column j is the pair (numbers[i], numbers[j]); only cells right of the diagonal are visited.`,
      input: { kind: "list", max: 6, placeholder: "numbers: 3, 8, 1, 7" },
      presets: [{ label: "Pair at the end", input: [3, 8, 1, 7] }, { label: "No pair", input: [5, 1, 4] }, { label: "Equal numbers", input: [2, 8, 2] }],
      run(list) {
        const n = list.length, ev = [];
        const cells = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (c > r ? "used" : "")));
        const values = Array.from({ length: n }, () => Array.from({ length: n }, () => ""));
        let log = "", rowsDone = 0;
        const push = (step, msg, i = -1, j = -1, tone = "") => ev.push({ step, msg, tone,
          view: { cells: cells.map((r) => r.slice()), values: values.map((r) => r.slice()), output: log, row: i, newlines: rowsDone },
          vars: [{ k: "i", role: "stepper", v: i >= 0 ? i : "—" }, { k: "j", role: "stepper", v: j >= 0 ? j : "—" }, { k: "sum", role: "temp", v: i >= 0 && j >= 0 ? list[i] + list[j] : "—" }] });
        push(null, n > 1 ? `Ready. ${n} numbers make ${(n * (n - 1)) / 2} pairs.` : "Ready. Fewer than two numbers: there are no pairs.");
        for (let i = 0; i < n; i++) {
          push(1, `Outer loop: i = ${i} (the number ${list[i]}).`, i);
          for (let j = i + 1; j < n; j++) {
            cells[i][j] = "current";
            push(2, `Inner loop: j = ${j}, starting after i.`, i, j);
            const s = list[i] + list[j]; values[i][j] = s;
            log += `${list[i]} + ${list[j]} = ${s}${s === TARGET ? " ✓" : ""}\n`;
            if (s === TARGET) {
              cells[i][j] = "current";
              push(3, `${list[i]} + ${list[j]} = ${s}. That's the target.`, i, j);
              push(4, "Found a pair: answer True and stop. The remaining pairs are never checked.", i, j, "yes");
              return ev;
            }
            cells[i][j] = "filled";
            push(3, `${list[i]} + ${list[j]} = ${s}, not ${TARGET}.`, i, j);
          }
          rowsDone = i + 1;
        }
        push(5, n > 1 ? "Every pair checked, none adds up to the target. Answer False." : "No pairs to check. Answer False.", -1, -1, "no");
        return ev;
      }
    },

    checks: {
      params: ["int[]", "int"], returns: "bool",
      cases: [{ args: [[3, 8, 1, 7], 10], expect: true }, { args: [[5, 1], 10], expect: false }, { args: [[], 4], expect: false }, { args: [[2, 2], 4], expect: true }, { args: [[1, 2, 7], 9], expect: true }],
      snippets: { bugSelf: [{ args: [[5, 1], 10], expect: true }], bugGiveUp: [{ args: [[1, 2, 7], 9], expect: false }] }
    },

    pitfalls: [
      { kind: "dont", title: "Pairing an item with itself", wide: true, code: "bugSelf", text: "If j starts at 0, the inner loop also visits j = i. Then [5, 1] “has” a pair adding up to 10: the 5 with itself.", take: "Start the inner loop at i + 1." },
      { kind: "dont", title: "Giving up inside the loops", text: "An <code>else: return False</code> inside the inner loop answers after the first pair.", take: "“No” belongs after both loops." },
      { kind: "dont", title: "Checking each pair twice", text: "Starting j at 0 (and skipping j == i) still checks (i, j) and (j, i): twice the work, and double counts if you're counting pairs.", take: "j from i + 1 sees each pair exactly once." },
      { kind: "do", title: "Know the cost", text: "n items have n(n − 1)/2 pairs: 45 for 10 items, but about 5 million for 3 200 items. For big lists, smarter plans (sorting, or remembering what you've seen) do better." },
      { kind: "do", title: "Reuse single-item plans inside", text: "The inner test can count pairs (D1), find the best pair (D4), or stop at the first (D7), just as with single items." }
    ],

    snippets: {
      bugSelf: {
        python: ["def has_pair_sum(numbers, target):", "    for i in range(len(numbers)):", "        for j in range(len(numbers)):   # ✗ j can equal i", "            if numbers[i] + numbers[j] == target:", "                return True", "    return False"],
        java: ["static boolean hasPairSum(int[] numbers, int target) {", "    for (int i = 0; i < numbers.length; i++) {", "        for (int j = 0; j < numbers.length; j++) {   // ✗ j can equal i", "            if (numbers[i] + numbers[j] == target) return true;", "        }", "    }", "    return false;", "}"],
        rust: ["fn has_pair_sum(numbers: &[i32], target: i32) -> bool {", "    for i in 0..numbers.len() {", "        for j in 0..numbers.len() {   // ✗ j can equal i", "            if numbers[i] + numbers[j] == target { return true; }", "        }", "    }", "    false", "}"],
        c: ["bool has_pair_sum(const int numbers[], size_t n, int target) {", "    for (size_t i = 0; i < n; i++) {", "        for (size_t j = 0; j < n; j++) {   // ✗ j can equal i", "            if (numbers[i] + numbers[j] == target) return true;", "        }", "    }", "    return false;", "}"],
        cpp: ["bool has_pair_sum(const std::vector<int>& numbers, int target) {", "    for (size_t i = 0; i < numbers.size(); i++) {", "        for (size_t j = 0; j < numbers.size(); j++) {   // ✗ j can equal i", "            if (numbers[i] + numbers[j] == target) return true;", "        }", "    }", "    return false;", "}"]
      },
      bugGiveUp: {
        python: ["def has_pair_sum(numbers, target):", "    for i in range(len(numbers)):", "        for j in range(i + 1, len(numbers)):", "            if numbers[i] + numbers[j] == target:", "                return True", "            else:", "                return False", "    return False"],
        java: ["static boolean hasPairSum(int[] numbers, int target) {", "    for (int i = 0; i < numbers.length; i++) {", "        for (int j = i + 1; j < numbers.length; j++) {", "            if (numbers[i] + numbers[j] == target) return true;", "            else return false;", "        }", "    }", "    return false;", "}"],
        rust: ["fn has_pair_sum(numbers: &[i32], target: i32) -> bool {", "    for i in 0..numbers.len() {", "        for j in i + 1..numbers.len() {", "            if numbers[i] + numbers[j] == target { return true; } else { return false; }", "        }", "    }", "    false", "}"],
        c: ["bool has_pair_sum(const int numbers[], size_t n, int target) {", "    for (size_t i = 0; i < n; i++) {", "        for (size_t j = i + 1; j < n; j++) {", "            if (numbers[i] + numbers[j] == target) return true;", "            else return false;", "        }", "    }", "    return false;", "}"],
        cpp: ["bool has_pair_sum(const std::vector<int>& numbers, int target) {", "    for (size_t i = 0; i < numbers.size(); i++) {", "        for (size_t j = i + 1; j < numbers.size(); j++) {", "            if (numbers[i] + numbers[j] == target) return true;", "            else return false;", "        }", "    }", "    return false;", "}"]
      }
    },

    quiz: [
      { q: "How many pairs does the plan check for a list of 5 items (if no pair matches)?", options: ["10", "20", "25"], answer: 0, explain: "5 × 4 / 2 = 10: each pair once, and no item with itself." },
      { q: "This version has a bug. What does it return for [5, 1] and a target of 10?", code: "bugSelf", options: ["True", "False"], answer: 0, explain: "j starts at 0, so i = 0, j = 0 pairs the 5 with itself: 5 + 5 = 10." },
      { q: "Why does j start at i + 1?", options: ["To skip pairing an item with itself and seeing a pair twice", "Because arrays start at 1", "To make the loop faster to type"], answer: 0, explain: "Pairs with j ≤ i are either the item itself or a pair already seen the other way round." }
    ],

    exercise: {
      title: "Your turn: count equal pairs",
      task: "Write <code>count_equal_pairs(numbers)</code> that returns how many pairs of positions (i < j) hold equal values. [1, 2, 1, 1] has 3 such pairs.",
      plan: ["Start a counter at 0", "Outer loop: each position i", "Inner loop: each later position j", "Equal values? Count the pair", "Return the counter after both loops"],
      fn: { python: "count_equal_pairs", java: "countEqualPairs", rust: "count_equal_pairs", c: "count_equal_pairs", cpp: "count_equal_pairs" },
      params: ["int[]"], returns: "int",
      tests: [{ args: [[1, 2, 1, 1]], expect: 3 }, { args: [[]], expect: 0 }, { args: [[5, 6]], expect: 0 }, { args: [[7, 7]], expect: 1 }],
      solutions: {
        python: ["def count_equal_pairs(numbers):", "    count = 0", "    for i in range(len(numbers)):", "        for j in range(i + 1, len(numbers)):", "            if numbers[i] == numbers[j]:", "                count += 1", "    return count"],
        java: ["static int countEqualPairs(int[] numbers) {", "    int count = 0;", "    for (int i = 0; i < numbers.length; i++) {", "        for (int j = i + 1; j < numbers.length; j++) {", "            if (numbers[i] == numbers[j]) count++;", "        }", "    }", "    return count;", "}"],
        rust: ["fn count_equal_pairs(numbers: &[i32]) -> i32 {", "    let mut count = 0;", "    for i in 0..numbers.len() {", "        for j in i + 1..numbers.len() {", "            if numbers[i] == numbers[j] { count += 1; }", "        }", "    }", "    count", "}"],
        c: ["int count_equal_pairs(const int numbers[], size_t n) {", "    int count = 0;", "    for (size_t i = 0; i < n; i++) {", "        for (size_t j = i + 1; j < n; j++) {", "            if (numbers[i] == numbers[j]) count++;", "        }", "    }", "    return count;", "}"],
        cpp: ["#include <vector>", "", "int count_equal_pairs(const std::vector<int>& numbers) {", "    int count = 0;", "    for (size_t i = 0; i < numbers.size(); i++) {", "        for (size_t j = i + 1; j < numbers.size(); j++) {", "            if (numbers[i] == numbers[j]) count++;", "        }", "    }", "    return count;", "}"]
      }
    },

    compare: {
      intro: "Nested-loop plans, by where the inner loop starts and what it walks over.",
      rows: [
        { id: "E2", name: "Every pair", question: "Do any two numbers add up to 10?", shape: "for i: for j from i + 1", result: "each pair once", self: true },
        { id: "E1", name: "Rows and columns", question: "Print a triangle of stars", shape: "for row: for col up to the row's width", result: "a 2D output" },
        { id: "D12", name: "Compare with the previous item", question: "Did the price go up?", shape: "one loop: item i with item i − 1", result: "neighbouring pairs only" }
      ],
      table: { head: ["Plan", "Loops", "Pairs considered", "For n items"], rows: [["Every pair", "2, nested", "all pairs", "n(n − 1)/2 checks"], ["Rows and columns", "2, nested", "—", "one cell per row × column"], ["Compare with the previous item", "1", "neighbours only", "n − 1 checks"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "E1", why: "an outer and an inner loop" }, { id: "D7", why: "stop at the first matching pair" }],
      leadsTo: [{ id: "F3", why: "selection sort compares each item with the later ones" }, { id: "F4", why: "remembering what you've seen avoids checking every pair" }]
    }
  };
})();
