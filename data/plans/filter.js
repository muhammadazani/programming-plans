/* Plan data: D9 · Filter
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   Returns a new list. In C the caller passes an output array and the function
   returns how many items it wrote (checks.returns "int[]" knows this). */

(function () {
  const PASS = 50;

  window.PLAN = {
    id: "D9",
    slug: "filter",
    title: "Filter",
    highlight: "Filter",
    aka: ["select", "keep if", "where"],
    group: "D",
    level: "Core",
    core: true,
    fn: { python: "passed", java: "passed", rust: "passed", c: "passed", cpp: "passed" },

    hero: {
      type: "tiles",
      values: [72, 45, 90, 50, 38],
      colors: ["amber", "pale", "amber", "amber", "pale"],
      tagAt: 4,
      tag: "[72, 90, 50]",
      alt: "Five cubes; 72, 90 and 50 are amber because they are kept, 45 and 38 are pale; the tag shows the new list [72, 90, 50]"
    },
    planCard: { name: "filter", lines: ["result = empty list", "for each item", "passes? add it"], foot: "→ return result" },

    intent: "Build a new list that keeps only the items that pass a test, in their original order. The original list is left alone.",

    analogy: {
      icon: "☕",
      title: "A coffee filter",
      text: "Pour the coffee through the filter: the liquid passes into the cup, the grounds stay behind. You end up with a new cup of only what got through, and you never had to change the coffee itself."
    },

    cues: ["only the …", "all the … that", "keep / select …", "which items …", "remove all …", "a list of those that …"],
    cueSummary: "The answer is <b>a new list</b>: the items that pass a test, in their original order.",
    cueExamples: [
      "Make a list of the scores that passed.",
      "Which products cost less than 10?",
      "Remove every negative reading from the data."
    ],

    steps: [
      { n: 1, title: "Start with an empty result list", text: "Nothing has been kept yet." },
      { n: 2, title: "Visit each item", text: "Every item gets its chance." },
      { n: 3, title: "Test it", text: "Here: is the score at least 50?" },
      { n: 4, title: "Passes? Add it to the result", text: "Append it at the end, so the original order is kept." },
      { n: 5, title: "Return the result", text: "A new list. The input list is unchanged." }
    ],

    impl: {
      python: {
        file: "filter.py",
        plain: { lines: [
          [0, "def passed(scores):"],
          [1, "    result = []"],
          [2, "    for s in scores:"],
          [3, "        if s >= 50:"],
          [4, "            result.append(s)"],
          [5, "    return result"]
        ] },
        idiomatic: { lines: [
          [0, "def passed(scores):"],
          [[1, 2, 3, 4, 5], "    return [s for s in scores if s >= 50]"]
        ], note: "A list comprehension is Python's built-in filter: “s, for each s in scores, if s ≥ 50”." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static List<Integer> passed(int[] scores) {"],
          [1, "    List<Integer> result = new ArrayList<>();"],
          [2, "    for (int s : scores) {"],
          [3, "        if (s >= 50) {"],
          [4, "            result.add(s);"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return result;"],
          [0, "}"]
        ], note: "A <code>List</code> can grow, unlike an array, so it suits a result whose size isn't known in advance." },
        idiomatic: { lines: [
          [0, "static List<Integer> passed(int[] scores) {"],
          [[1, 2, 3, 4, 5], "    return Arrays.stream(scores).filter(s -> s >= 50).boxed().toList();"],
          [0, "}"]
        ], note: "<code>boxed()</code> turns each <code>int</code> into an <code>Integer</code> so it can go into a <code>List</code>. <code>toList()</code> needs Java 16+." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn passed(scores: &[i32]) -> Vec<i32> {"],
          [1, "    let mut result = Vec::new();"],
          [2, "    for &s in scores {"],
          [3, "        if s >= 50 {"],
          [4, "            result.push(s);"],
          [0, "        }"],
          [0, "    }"],
          [5, "    result"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "fn passed(scores: &[i32]) -> Vec<i32> {"],
          [[1, 2, 3, 4, 5], "    scores.iter().copied().filter(|&s| s >= 50).collect()"],
          [0, "}"]
        ], note: "<code>collect()</code> builds the new <code>Vec</code> from the items that pass." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "size_t passed(const int scores[], size_t n, int out[]) {"],
          [1, "    size_t count = 0;"],
          [2, "    for (size_t i = 0; i < n; i++) {"],
          [3, "        if (scores[i] >= 50) {"],
          [4, "            out[count] = scores[i];"],
          [4, "            count++;"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return count;"],
          [0, "}"]
        ], note: "C functions don't easily return new arrays. The caller passes an <code>out</code> array big enough for every item, and the function returns how many it kept." },
        idiomatic: null,
        idiomaticNote: "C has no built-in filter. The output-array loop is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "#include <vector>"],
          [0, ""],
          [0, "std::vector<int> passed(const std::vector<int>& scores) {"],
          [1, "    std::vector<int> result;"],
          [2, "    for (int s : scores) {"],
          [3, "        if (s >= 50) {"],
          [4, "            result.push_back(s);"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return result;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "#include <algorithm>"],
          [0, "#include <iterator>"],
          [0, "#include <vector>"],
          [0, ""],
          [0, "std::vector<int> passed(const std::vector<int>& scores) {"],
          [1, "    std::vector<int> result;"],
          [[2, 3, 4], "    std::ranges::copy_if(scores, std::back_inserter(result), [](int s) { return s >= 50; });"],
          [5, "    return result;"],
          [0, "}"]
        ], note: "<code>back_inserter</code> appends each copied item to <code>result</code>." }
      }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Make a list of the scores that passed</b> (at least 50).",
      input: { kind: "list", max: 10, placeholder: "your scores: 72, 45, 90" },
      presets: [
        { label: "Mixed scores", input: [72, 45, 90, 50, 38] },
        { label: "Nobody passes", input: [10, 20] },
        { label: "Everyone passes", input: [60, 80] },
        { label: "Empty list", input: [] }
      ],
      run(list) {
        const n = list.length, ev = [], states = list.map(() => ""), result = [];
        const snap = (step, msg, cur = -1, tone = "", fresh = -1) => ev.push({
          step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur, out: { label: "result", items: result.slice(), fresh, empty: "[ ] empty" } },
          vars: [{ k: "s", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "len(result)", role: "gatherer", v: result.length }]
        });
        snap(null, n ? "Ready. Which scores pass?" : "Ready. The list is empty.");
        snap(1, "Start with an empty result list.");
        for (let i = 0; i < n; i++) {
          states[i] = "current";
          snap(2, `Visit item [${i}]: s = ${list[i]}`, i);
          const ok = list[i] >= PASS;
          states[i] = ok ? "added" : "miss";
          snap(3, ok ? `Is ${list[i]} >= ${PASS}? Yes, keep it.` : `Is ${list[i]} >= ${PASS}? No, leave it out.`, i);
          if (ok) { result.push(list[i]); snap(4, `Add ${list[i]} to the end of the result.`, i, "", result.length - 1); }
        }
        snap(5, `Return [${result.join(", ")}]. The original list is unchanged.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"],
      returns: "int[]",
      cases: [
        { args: [[72, 45, 90, 50, 38]], expect: [72, 90, 50] },
        { args: [[]], expect: [] },
        { args: [[10, 20]], expect: [] },
        { args: [[60]], expect: [60] }
      ],
      snippets: {
        bugReset: [{ args: [[72, 90, 40]], expect: [] }, { args: [[40, 72, 90]], expect: [90] }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "Creating the result inside the loop", wide: true, code: "bugReset",
        text: "A new empty result on every pass throws away everything kept so far. At best you get the last item back; often you get nothing.",
        take: "Create the result once, before the loop." },
      { kind: "dont", title: "Removing items from the list you're looping over",
        text: "Deleting while iterating shifts the remaining items, so the loop skips some. In Java it can also throw <code>ConcurrentModificationException</code>.",
        take: "Build a new list instead. That's what this plan does." },
      { kind: "dont", title: "Sizing the C output too small",
        text: "If every item passes, the result is as long as the input. A smaller <code>out</code> array overflows.",
        take: "Make the output array at least as big as the input." },
      { kind: "do", title: "Keep filtering and counting apart",
        text: "If you only need <em>how many</em> pass, that's Counting (D1): no new list needed." },
      { kind: "do", title: "Use the built-in once you understand it",
        text: "List comprehensions, <code>stream().filter()</code>, <code>.iter().filter().collect()</code> and <code>std::ranges::copy_if</code> are this plan." }
    ],

    snippets: {
      bugReset: {
        python: ["def passed(scores):", "    result = []", "    for s in scores:", "        result = []          # ✗ a new list on every pass", "        if s >= 50:", "            result.append(s)", "    return result"],
        java: ["static List<Integer> passed(int[] scores) {", "    List<Integer> result = new ArrayList<>();", "    for (int s : scores) {", "        result = new ArrayList<>();   // ✗ a new list on every pass", "        if (s >= 50) {", "            result.add(s);", "        }", "    }", "    return result;", "}"],
        rust: ["fn passed(scores: &[i32]) -> Vec<i32> {", "    let mut result = Vec::new();", "    for &s in scores {", "        result = Vec::new();          // ✗ a new list on every pass", "        if s >= 50 {", "            result.push(s);", "        }", "    }", "    result", "}"],
        c: ["size_t passed(const int scores[], size_t n, int out[]) {", "    size_t count = 0;", "    for (size_t i = 0; i < n; i++) {", "        count = 0;                    // ✗ starts over on every pass", "        if (scores[i] >= 50) {", "            out[count] = scores[i];", "            count++;", "        }", "    }", "    return count;", "}"],
        cpp: ["std::vector<int> passed(const std::vector<int>& scores) {", "    std::vector<int> result;", "    for (int s : scores) {", "        result.clear();               // ✗ empties the list on every pass", "        if (s >= 50) {", "            result.push_back(s);", "        }", "    }", "    return result;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([50, 49, 51]) return?", options: ["[50, 51]", "[51]", "[49]", "2"], answer: 0,
        explain: "50 and 51 are at least 50, so they're kept, in their original order. The result is a list, not a count." },
      { q: "After filtering [72, 45, 90], what does the original list contain?", options: ["[72, 45, 90]", "[72, 90]", "[45]"], answer: 0,
        explain: "Filtering builds a new list. The original is never changed." },
      { q: "If 3 of 10 items pass, how many items does the loop visit?", options: ["3", "7", "10"], answer: 2,
        explain: "Every item has to be tested to know whether to keep it, so all 10 are visited." }
    ],

    exercise: {
      title: "Your turn: keep the even numbers",
      task: "Write <code>evens(numbers)</code> that returns a new list containing only the even numbers, in their original order. (In C: <code>size_t evens(const int numbers[], size_t n, int out[])</code>, returning how many were written.)",
      plan: ["Start with an empty result", "Visit each number", "Test it: is it even?", "If so, add it to the end of the result", "Return the result"],
      fn: { python: "evens", java: "evens", rust: "evens", c: "evens", cpp: "evens" },
      params: ["int[]"],
      returns: "int[]",
      tests: [
        { args: [[1, 2, 3, 4]], expect: [2, 4] },
        { args: [[]], expect: [] },
        { args: [[1, 3]], expect: [] },
        { args: [[0, -2]], expect: [0, -2] }
      ],
      solutions: {
        python: ["def evens(numbers):", "    result = []", "    for x in numbers:", "        if x % 2 == 0:", "            result.append(x)", "    return result"],
        java: ["static List<Integer> evens(int[] numbers) {", "    List<Integer> result = new ArrayList<>();", "    for (int x : numbers) {", "        if (x % 2 == 0) {", "            result.add(x);", "        }", "    }", "    return result;", "}"],
        rust: ["fn evens(numbers: &[i32]) -> Vec<i32> {", "    let mut result = Vec::new();", "    for &x in numbers {", "        if x % 2 == 0 {", "            result.push(x);", "        }", "    }", "    result", "}"],
        c: ["size_t evens(const int numbers[], size_t n, int out[]) {", "    size_t count = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] % 2 == 0) {", "            out[count] = numbers[i];", "            count++;", "        }", "    }", "    return count;", "}"],
        cpp: ["#include <vector>", "", "std::vector<int> evens(const std::vector<int>& numbers) {", "    std::vector<int> result;", "    for (int x : numbers) {", "        if (x % 2 == 0) {", "            result.push_back(x);", "        }", "    }", "    return result;", "}"]
      }
    },

    compare: {
      intro: "Three plans that visit every score in <code>[72, 45, 90, 50, 38]</code> but give back different things.",
      data: [72, 45, 90, 50, 38],
      rows: [
        { id: "D9", name: "Filter", question: "Which scores passed?", result: "[72, 90, 50]", self: true },
        { id: "D10", name: "Transform each item", question: "Add 5 bonus points to every score", result: "[77, 50, 95, 55, 43]" },
        { id: "D1", name: "Counting", question: "How many passed?", result: "3" }
      ],
      table: {
        head: ["Plan", "Result", "Length of the result", "Changes the items?"],
        rows: [
          ["Filter", "a new list", "0 up to the input's length", "no"],
          ["Transform each item", "a new list", "same as the input", "yes"],
          ["Counting", "a number", "—", "no"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "D1", why: "the same test, keeping items instead of counting them" }],
      leadsTo: [{ id: "D10", why: "change every item instead of choosing some" }, { id: "F4", why: "filter out items you've already seen" }]
    }
  };
})();
