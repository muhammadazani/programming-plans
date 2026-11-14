/* Plan data: D12 · Compare with the previous item
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "D12",
    slug: "compare-with-previous",
    title: "Compare with the previous item",
    highlight: "previous",
    aka: ["neighbours", "pairwise", "follower variable"],
    group: "D",
    level: "Core",
    core: false,
    fn: { python: "count_rises", java: "countRises", rust: "count_rises", c: "count_rises", cpp: "count_rises" },

    hero: { type: "tiles", values: [10, 12, 11, 15, 15], colors: ["pale", "amber", "pale", "amber", "pale"], tagAt: 3, tag: "2 rises", alt: "Five cubes of daily prices; 12 and 15 are amber because each is higher than the day before" },
    planCard: { name: "neighbours", lines: ["count = 0", "from the second item", "compare with the one before"], foot: "→ return the count" },

    intent: "Look at each item together with the one just before it, to spot rises, drops, repeats or changes.",

    analogy: { icon: "📈", title: "Reading a temperature log", text: "To know whether today was warmer, you don't look at today alone: you compare it with yesterday. Going down the log, every entry is judged against the one just above it. The first entry has nothing to compare with." },

    cues: ["went up / went down", "compared with the day before", "changes", "in a row", "increase / decrease", "repeated"],
    cueSummary: "The question is about <b>pairs of neighbours</b>: each item and the one right before it.",
    cueExamples: ["On how many days did the price go up?", "Find the biggest jump between two neighbouring readings.", "Is the list sorted from smallest to largest?"],

    steps: [
      { n: 1, title: "Start the counter at 0", text: "Nothing has been compared yet." },
      { n: 2, title: "Visit each item from the second one", text: "The first item has no previous item, so it can't be compared." },
      { n: 3, title: "Compare it with the item just before it", text: "prices[i] against prices[i - 1]." },
      { n: 4, title: "Went up? Count it", text: "Only a rise counts; equal or lower doesn't." },
      { n: 5, title: "Return the count", text: "A list of n items has n − 1 neighbouring pairs." }
    ],

    impl: {
      python: { file: "rises.py",
        plain: { lines: [[0, "def count_rises(prices):"], [1, "    count = 0"], [2, "    for i in range(1, len(prices)):"], [3, "        if prices[i] > prices[i - 1]:"], [4, "            count += 1"], [5, "    return count"]] },
        idiomatic: { lines: [[0, "from itertools import pairwise"], [0, ""], [0, "def count_rises(prices):"], [[1, 2, 3, 4, 5], "    return sum(1 for a, b in pairwise(prices) if b > a)"]], note: "<code>pairwise</code> (Python 3.10+) hands out each neighbouring pair (a, b)." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int countRises(int[] prices) {"], [1, "    int count = 0;"], [2, "    for (int i = 1; i < prices.length; i++) {"], [3, "        if (prices[i] > prices[i - 1]) {"], [4, "            count++;"], [0, "        }"], [0, "    }"], [5, "    return count;"], [0, "}"]] },
        idiomatic: { lines: [[0, "static int countRises(int[] prices) {"], [[1, 2, 3, 4, 5], "    return (int) IntStream.range(1, prices.length).filter(i -> prices[i] > prices[i - 1]).count();"], [0, "}"]] } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn count_rises(prices: &[i32]) -> i32 {"], [1, "    let mut count = 0;"], [2, "    for i in 1..prices.len() {"], [3, "        if prices[i] > prices[i - 1] {"], [4, "            count += 1;"], [0, "        }"], [0, "    }"], [5, "    count"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn count_rises(prices: &[i32]) -> i32 {"], [[1, 2, 3, 4, 5], "    prices.windows(2).filter(|w| w[1] > w[0]).count() as i32"], [0, "}"]], note: "<code>windows(2)</code> slides a two-item window along the slice: exactly the neighbouring pairs." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "int count_rises(const int prices[], size_t n) {"], [1, "    int count = 0;"], [2, "    for (size_t i = 1; i < n; i++) {"], [3, "        if (prices[i] > prices[i - 1]) {"], [4, "            count++;"], [0, "        }"], [0, "    }"], [5, "    return count;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "The index loop starting at 1 is the idiomatic C way." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "int count_rises(const std::vector<int>& prices) {"], [1, "    int count = 0;"], [2, "    for (size_t i = 1; i < prices.size(); i++) {"], [3, "        if (prices[i] > prices[i - 1]) {"], [4, "            count++;"], [0, "        }"], [0, "    }"], [5, "    return count;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "C++23 adds <code>std::views::adjacent</code>; until then, the index loop is the clearest." }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>On how many days did the price go up compared with the day before?</b>",
      input: { kind: "list", max: 10, placeholder: "prices: 10, 12, 11, 15" },
      presets: [{ label: "Up and down", input: [10, 12, 11, 15, 15] }, { label: "Always rising", input: [1, 2, 3] }, { label: "One day", input: [5] }],
      run(list) {
        const ev = [], states = list.map(() => ""), badges = list.map(() => "");
        let count = 0;
        const snap = (step, msg, ptr = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr, badges: badges.slice() },
          vars: [{ k: "prices[i-1]", role: "walker", v: Array.isArray(ptr) ? list[ptr[0]] : "—" }, { k: "prices[i]", role: "walker", v: Array.isArray(ptr) ? list[ptr[1]] : "—" }, { k: "count", role: "count", v: count }] });
        snap(null, list.length ? `Ready. ${list.length} days, so ${Math.max(0, list.length - 1)} pairs of neighbours.` : "Ready. No days.");
        snap(1, "Start the counter: count = 0.");
        if (list.length) states[0] = "miss";
        for (let i = 1; i < list.length; i++) {
          states[i] = "current";
          snap(2, `Visit day [${i}], and look back at day [${i - 1}].`, [i - 1, i]);
          const up = list[i] > list[i - 1];
          states[i] = up ? "hit" : "miss";
          snap(3, `Is ${list[i]} > ${list[i - 1]}? ${up ? "Yes, the price went up." : list[i] === list[i - 1] ? "No, it stayed the same." : "No, it went down."}`, [i - 1, i]);
          if (up) { count++; badges[i] = "↑"; snap(4, `Count the rise: count = ${count}.`, [i - 1, i]); }
        }
        snap(5, `Return ${count}.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"], returns: "int",
      cases: [{ args: [[10, 12, 11, 15, 15]], expect: 2 }, { args: [[5]], expect: 0 }, { args: [[]], expect: 0 }, { args: [[1, 2, 3]], expect: 2 }, { args: [[3, 2, 1]], expect: 0 }],
      snippets: { bugMissLast: [{ args: [[1, 2, 3]], expect: 1 }], bugFirst: [{ args: [[5, 3, 4]], expect: 0 }] }
    },

    pitfalls: [
      { kind: "dont", title: "Stopping one pair early", wide: true, code: "bugMissLast", text: "Starting at 1 <em>and</em> stopping before the last index skips the final pair: [1, 2, 3] has two rises, but only one is counted.", take: "From index 1 up to and including the last index." },
      { kind: "dont", title: "Comparing with the first item", text: "<code>prices[i] &gt; prices[0]</code> asks “higher than day one?”, not “higher than yesterday?”.", take: "The neighbour of i is i − 1." },
      { kind: "dont", title: "Starting at index 0", text: "At i = 0 there is no previous item. In Python, <code>prices[-1]</code> silently means the <em>last</em> item; in the other languages it reads outside the array.", take: "Start at 1." },
      { kind: "do", title: "Or keep a follower variable", text: "Instead of indexes, keep <code>previous</code>: compare the current item with it, then set <code>previous = current</code>. That works for input streams too." },
      { kind: "do", title: "Test lists of length 0, 1 and 2", text: "They have 0, 0 and 1 pairs: the edges where off-by-one errors live." }
    ],

    snippets: {
      bugMissLast: {
        python: ["def count_rises(prices):", "    count = 0", "    for i in range(1, len(prices) - 1):   # ✗ skips the last pair", "        if prices[i] > prices[i - 1]:", "            count += 1", "    return count"],
        java: ["static int countRises(int[] prices) {", "    int count = 0;", "    for (int i = 1; i < prices.length - 1; i++) {   // ✗ skips the last pair", "        if (prices[i] > prices[i - 1]) count++;", "    }", "    return count;", "}"],
        rust: ["fn count_rises(prices: &[i32]) -> i32 {", "    let mut count = 0;", "    for i in 1..prices.len() - 1 {   // ✗ skips the last pair", "        if prices[i] > prices[i - 1] { count += 1; }", "    }", "    count", "}"],
        c: ["int count_rises(const int prices[], size_t n) {", "    int count = 0;", "    for (size_t i = 1; i + 1 < n; i++) {   // ✗ skips the last pair", "        if (prices[i] > prices[i - 1]) count++;", "    }", "    return count;", "}"],
        cpp: ["int count_rises(const std::vector<int>& prices) {", "    int count = 0;", "    for (size_t i = 1; i + 1 < prices.size(); i++) {   // ✗ skips the last pair", "        if (prices[i] > prices[i - 1]) count++;", "    }", "    return count;", "}"]
      },
      bugFirst: {
        python: ["def count_rises(prices):", "    count = 0", "    for i in range(1, len(prices)):", "        if prices[i] > prices[0]:", "            count += 1", "    return count"],
        java: ["static int countRises(int[] prices) {", "    int count = 0;", "    for (int i = 1; i < prices.length; i++) {", "        if (prices[i] > prices[0]) count++;", "    }", "    return count;", "}"],
        rust: ["fn count_rises(prices: &[i32]) -> i32 {", "    let mut count = 0;", "    for i in 1..prices.len() {", "        if prices[i] > prices[0] { count += 1; }", "    }", "    count", "}"],
        c: ["int count_rises(const int prices[], size_t n) {", "    int count = 0;", "    for (size_t i = 1; i < n; i++) {", "        if (prices[i] > prices[0]) count++;", "    }", "    return count;", "}"],
        cpp: ["int count_rises(const std::vector<int>& prices) {", "    int count = 0;", "    for (size_t i = 1; i < prices.size(); i++) {", "        if (prices[i] > prices[0]) count++;", "    }", "    return count;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([4, 4, 6, 5, 9]) return?", options: ["2", "3", "4"], answer: 0, explain: "4→4 is not a rise, 4→6 is, 6→5 isn't, 5→9 is. Two rises." },
      { q: "This version has a bug. What does it return for [5, 3, 4]?", code: "bugFirst", options: ["1", "0", "2"], answer: 1, explain: "It compares every day with the first day (5). 3 and 4 are both lower than 5, so nothing counts, though 3 → 4 was a rise." },
      { q: "How many neighbouring pairs does a list of 6 items have?", options: ["5", "6", "7"], answer: 0, explain: "Each pair starts at one item and ends at the next, and the last item starts no pair: 6 − 1 = 5." }
    ],

    exercise: {
      title: "Your turn: the biggest jump",
      task: "Write <code>largest_jump(numbers)</code> that returns the biggest increase from one item to the next. If there is no increase at all (or fewer than two items), return 0.",
      plan: ["Start the best jump at 0", "Visit each item from the second one", "Work out the jump: this item minus the one before", "Bigger than the best jump? Keep it", "Return the best jump"],
      fn: { python: "largest_jump", java: "largestJump", rust: "largest_jump", c: "largest_jump", cpp: "largest_jump" },
      params: ["int[]"], returns: "int",
      tests: [{ args: [[3, 8, 5, 12]], expect: 7 }, { args: [[5]], expect: 0 }, { args: [[9, 7]], expect: 0 }, { args: [[1, 2, 3]], expect: 1 }],
      solutions: {
        python: ["def largest_jump(numbers):", "    best = 0", "    for i in range(1, len(numbers)):", "        jump = numbers[i] - numbers[i - 1]", "        if jump > best:", "            best = jump", "    return best"],
        java: ["static int largestJump(int[] numbers) {", "    int best = 0;", "    for (int i = 1; i < numbers.length; i++) {", "        int jump = numbers[i] - numbers[i - 1];", "        if (jump > best) best = jump;", "    }", "    return best;", "}"],
        rust: ["fn largest_jump(numbers: &[i32]) -> i32 {", "    let mut best = 0;", "    for i in 1..numbers.len() {", "        let jump = numbers[i] - numbers[i - 1];", "        if jump > best { best = jump; }", "    }", "    best", "}"],
        c: ["int largest_jump(const int numbers[], size_t n) {", "    int best = 0;", "    for (size_t i = 1; i < n; i++) {", "        int jump = numbers[i] - numbers[i - 1];", "        if (jump > best) best = jump;", "    }", "    return best;", "}"],
        cpp: ["#include <vector>", "", "int largest_jump(const std::vector<int>& numbers) {", "    int best = 0;", "    for (size_t i = 1; i < numbers.size(); i++) {", "        int jump = numbers[i] - numbers[i - 1];", "        if (jump > best) best = jump;", "    }", "    return best;", "}"]
      }
    },

    compare: {
      intro: "Plans that look at items in context, on <code>[10, 12, 11, 15, 15]</code>.",
      data: [10, 12, 11, 15, 15],
      rows: [
        { id: "D12", name: "Compare with the previous item", question: "How many rises?", result: "2", self: true },
        { id: "D13", name: "Longest run", question: "Longest run of rises in a row?", result: "1" },
        { id: "D1", name: "Counting", question: "How many prices above 11?", result: "3" }
      ],
      table: { head: ["Plan", "Looks at", "Starts at index", "Typical question"], rows: [["Compare with the previous item", "each item and the one before", "1", "did it go up?"], ["Longest run", "whether the current streak continues", "0", "how many in a row?"], ["Counting", "each item on its own", "0", "how many pass?"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "D1", why: "counting the pairs that pass" }],
      leadsTo: [{ id: "D13", why: "track streaks of neighbouring items" }, { id: "E2", why: "compare every pair, not just neighbours" }]
    }
  };
})();
