/* Plan data: D10 · Transform each item
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   Returns a new list (C: output array, returning its length). */

(function () {
  const bonus = (s) => Math.min(s + 5, 100);

  window.PLAN = {
    id: "D10",
    slug: "transform-each-item",
    title: "Transform each item",
    highlight: "Transform",
    aka: ["map", "apply to every element", "element-wise"],
    group: "D",
    level: "Core",
    core: false,
    fn: { python: "with_bonus", java: "withBonus", rust: "with_bonus", c: "with_bonus", cpp: "with_bonus" },

    hero: { type: "tiles", values: [50, 98, 100], colors: ["amber", "amber", "amber"], tagAt: 2, tag: "[55, 100, 100]", alt: "Three cubes, every one amber, with the tag showing the new list 55, 100, 100" },
    planCard: { name: "map", lines: ["result = empty list", "for each item", "add its new value"], foot: "→ same length, new values" },

    intent: "Build a new list with every item changed the same way. The new list has exactly as many items as the original.",

    analogy: { icon: "🖨️", title: "A photocopier set to enlarge", text: "Every page goes through the same machine and comes out bigger. You get one copy per original, in the same order, and the originals are untouched." },

    cues: ["add … to every", "convert each …", "for every item, …", "a list of the …", "double / round / scale all"],
    cueSummary: "The answer is <b>a new list of the same length</b>: every item changed by the same rule.",
    cueExamples: ["Add 5 bonus points to every score, but never above 100.", "Convert a list of temperatures from °C to °F.", "Round every price to the nearest whole number."],

    steps: [
      { n: 1, title: "Start with an empty result list", text: "The original list is left alone." },
      { n: 2, title: "Visit each item", text: "Every item gets transformed; none is skipped." },
      { n: 3, title: "Work out its new value", text: "Here: add 5, but cap it at 100." },
      { n: 4, title: "Add the new value to the result", text: "At the end, so the order is kept." },
      { n: 5, title: "Return the result", text: "Same length as the input." }
    ],

    impl: {
      python: { file: "bonus.py",
        plain: { lines: [[0, "def with_bonus(scores):"], [1, "    result = []"], [2, "    for s in scores:"], [3, "        new = s + 5"], [3, "        if new > 100:"], [3, "            new = 100"], [4, "        result.append(new)"], [5, "    return result"]] },
        idiomatic: { lines: [[0, "def with_bonus(scores):"], [[1, 2, 3, 4, 5], "    return [min(s + 5, 100) for s in scores]"]], note: "A list comprehension with no <code>if</code> part is the map plan." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static List<Integer> withBonus(int[] scores) {"], [1, "    List<Integer> result = new ArrayList<>();"], [2, "    for (int s : scores) {"], [3, "        int value = s + 5;"], [3, "        if (value > 100) {"], [3, "            value = 100;"], [0, "        }"], [4, "        result.add(value);"], [0, "    }"], [5, "    return result;"], [0, "}"]] },
        idiomatic: { lines: [[0, "static List<Integer> withBonus(int[] scores) {"], [[1, 2, 3, 4, 5], "    return Arrays.stream(scores).map(s -> Math.min(s + 5, 100)).boxed().toList();"], [0, "}"]] } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn with_bonus(scores: &[i32]) -> Vec<i32> {"], [1, "    let mut result = Vec::new();"], [2, "    for &s in scores {"], [3, "        let mut value = s + 5;"], [3, "        if value > 100 {"], [3, "            value = 100;"], [0, "        }"], [4, "        result.push(value);"], [0, "    }"], [5, "    result"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn with_bonus(scores: &[i32]) -> Vec<i32> {"], [[1, 2, 3, 4, 5], "    scores.iter().map(|&s| (s + 5).min(100)).collect()"], [0, "}"]] } },
      c: { file: "plans.c",
        plain: { lines: [[0, "size_t with_bonus(const int scores[], size_t n, int out[]) {"], [0, "    /* step 1: the caller provides out, with room for n items */"], [2, "    for (size_t i = 0; i < n; i++) {"], [3, "        int value = scores[i] + 5;"], [3, "        if (value > 100) {"], [3, "            value = 100;"], [0, "        }"], [4, "        out[i] = value;"], [0, "    }"], [[1, 5], "    return n;"], [0, "}"]], note: "The result always has n items, so the caller can size <code>out</code> exactly." },
        idiomatic: null, idiomaticNote: "C has no built-in map; the loop writing into an output array is the idiomatic way." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "std::vector<int> with_bonus(const std::vector<int>& scores) {"], [1, "    std::vector<int> result;"], [2, "    for (int s : scores) {"], [3, "        int value = s + 5;"], [3, "        if (value > 100) {"], [3, "            value = 100;"], [0, "        }"], [4, "        result.push_back(value);"], [0, "    }"], [5, "    return result;"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <algorithm>"], [0, "#include <iterator>"], [0, "#include <vector>"], [0, ""], [0, "std::vector<int> with_bonus(const std::vector<int>& scores) {"], [1, "    std::vector<int> result;"], [[2, 3, 4], "    std::ranges::transform(scores, std::back_inserter(result), [](int s) { return std::min(s + 5, 100); });"], [5, "    return result;"], [0, "}"]] } }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Give every student 5 bonus points, but never more than 100.</b>",
      input: { kind: "list", max: 10, placeholder: "your scores: 50, 98, 100" },
      presets: [{ label: "Near the cap", input: [50, 98, 100] }, { label: "All low", input: [10, 20, 30] }, { label: "Empty list", input: [] }],
      run(list) {
        const ev = [], states = list.map(() => ""), result = [];
        const snap = (step, msg, cur = -1, tone = "", fresh = -1, nv = "—") => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur, out: { label: "result", items: result.slice(), fresh, empty: "[ ] empty" } },
          vars: [{ k: "s", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "new", role: "temp", v: nv }, { k: "len(result)", role: "gatherer", v: result.length }] });
        snap(null, list.length ? `Ready. ${list.length} scores to transform.` : "Ready. The list is empty.");
        snap(1, "Start with an empty result list.");
        list.forEach((s, i) => {
          states[i] = "current"; snap(2, `Visit item [${i}]: s = ${s}`, i);
          const v = bonus(s); snap(3, s + 5 > 100 ? `${s} + 5 = ${s + 5}, which is over 100, so the new value is 100.` : `${s} + 5 = ${v}.`, i, "", -1, v);
          result.push(v); states[i] = "added"; snap(4, `Add ${v} to the end of the result.`, i, "", result.length - 1, v);
        });
        snap(5, `Return [${result.join(", ")}]: the same number of items as the input.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"], returns: "int[]",
      cases: [{ args: [[50, 98, 100]], expect: [55, 100, 100] }, { args: [[]], expect: [] }, { args: [[0]], expect: [5] }, { args: [[96, 3]], expect: [100, 8] }],
      snippets: { bugNoCap: [{ args: [[98, 10]], expect: [103, 15] }], bugReset: [{ args: [[50, 60]], expect: [65] }] }
    },

    pitfalls: [
      { kind: "dont", title: "Forgetting part of the rule", wide: true, code: "bugNoCap", text: "“Add 5, but never above 100” has two parts. Dropping the cap gives scores of 103 and 105.", take: "Write the rule for one item first, test it on the edge cases (95, 96, 100), then loop." },
      { kind: "dont", title: "Creating the result inside the loop", text: "A fresh result on every pass throws away the items transformed so far, leaving only the last one.", take: "Create the result once, before the loop." },
      { kind: "dont", title: "Changing the loop variable and expecting the list to change", text: "In Python, Java's for-each and C++'s range-for, <code>s = s + 5</code> changes a copy. The list stays the same.", take: "Build a new list (this plan), or assign by position: <code>scores[i] = …</code>." },
      { kind: "do", title: "Check the length", text: "The result must have exactly as many items as the input. If it's shorter, you're filtering (D9), not transforming." },
      { kind: "do", title: "Use map once you understand it", text: "List comprehensions, <code>stream().map()</code>, <code>.iter().map().collect()</code> and <code>std::ranges::transform</code> are this plan." }
    ],

    snippets: {
      bugNoCap: {
        python: ["def with_bonus(scores):", "    result = []", "    for s in scores:", "        result.append(s + 5)    # ✗ no cap at 100", "    return result"],
        java: ["static List<Integer> withBonus(int[] scores) {", "    List<Integer> result = new ArrayList<>();", "    for (int s : scores) {", "        result.add(s + 5);      // ✗ no cap at 100", "    }", "    return result;", "}"],
        rust: ["fn with_bonus(scores: &[i32]) -> Vec<i32> {", "    let mut result = Vec::new();", "    for &s in scores {", "        result.push(s + 5);     // ✗ no cap at 100", "    }", "    result", "}"],
        c: ["size_t with_bonus(const int scores[], size_t n, int out[]) {", "    for (size_t i = 0; i < n; i++) {", "        out[i] = scores[i] + 5; // ✗ no cap at 100", "    }", "    return n;", "}"],
        cpp: ["std::vector<int> with_bonus(const std::vector<int>& scores) {", "    std::vector<int> result;", "    for (int s : scores) {", "        result.push_back(s + 5); // ✗ no cap at 100", "    }", "    return result;", "}"]
      },
      bugReset: {
        python: ["def with_bonus(scores):", "    result = []", "    for s in scores:", "        result = []", "        result.append(min(s + 5, 100))", "    return result"],
        java: ["static List<Integer> withBonus(int[] scores) {", "    List<Integer> result = new ArrayList<>();", "    for (int s : scores) {", "        result = new ArrayList<>();", "        result.add(Math.min(s + 5, 100));", "    }", "    return result;", "}"],
        rust: ["fn with_bonus(scores: &[i32]) -> Vec<i32> {", "    let mut result = Vec::new();", "    for &s in scores {", "        result = Vec::new();", "        result.push((s + 5).min(100));", "    }", "    result", "}"],
        c: ["size_t with_bonus(const int scores[], size_t n, int out[]) {", "    size_t count = 0;", "    for (size_t i = 0; i < n; i++) {", "        count = 0;", "        int value = scores[i] + 5;", "        out[count] = value > 100 ? 100 : value;", "        count++;", "    }", "    return count;", "}"],
        cpp: ["std::vector<int> with_bonus(const std::vector<int>& scores) {", "    std::vector<int> result;", "    for (int s : scores) {", "        result.clear();", "        result.push_back(std::min(s + 5, 100));", "    }", "    return result;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([95, 96, 40]) return?", options: ["[100, 101, 45]", "[100, 100, 45]", "[100, 45]"], answer: 1, explain: "95 + 5 = 100, 96 + 5 = 101 is capped to 100, and 40 + 5 = 45. Three items in, three out." },
      { q: "This version has a bug. What does it return for [50, 60]?", code: "bugReset", options: ["[55, 65]", "[65]", "[]"], answer: 1, explain: "The result is emptied on every pass, so only the last transformed item survives." },
      { q: "A list of 8 items is transformed. How long is the result?", options: ["Up to 8", "Exactly 8", "It depends on the values"], answer: 1, explain: "Transforming changes every item and keeps them all: exactly 8. Filtering is what can make a list shorter." }
    ],

    exercise: {
      title: "Your turn: double everything",
      task: "Write <code>doubled(numbers)</code> that returns a new list with every number multiplied by 2.",
      plan: ["Start with an empty result", "Visit each number", "Work out its new value: × 2", "Add it to the end of the result", "Return the result"],
      fn: { python: "doubled", java: "doubled", rust: "doubled", c: "doubled", cpp: "doubled" },
      params: ["int[]"], returns: "int[]",
      tests: [{ args: [[1, 2, 3]], expect: [2, 4, 6] }, { args: [[]], expect: [] }, { args: [[-4, 0]], expect: [-8, 0] }],
      solutions: {
        python: ["def doubled(numbers):", "    result = []", "    for x in numbers:", "        result.append(x * 2)", "    return result"],
        java: ["static List<Integer> doubled(int[] numbers) {", "    List<Integer> result = new ArrayList<>();", "    for (int x : numbers) {", "        result.add(x * 2);", "    }", "    return result;", "}"],
        rust: ["fn doubled(numbers: &[i32]) -> Vec<i32> {", "    let mut result = Vec::new();", "    for &x in numbers {", "        result.push(x * 2);", "    }", "    result", "}"],
        c: ["size_t doubled(const int numbers[], size_t n, int out[]) {", "    for (size_t i = 0; i < n; i++) {", "        out[i] = numbers[i] * 2;", "    }", "    return n;", "}"],
        cpp: ["#include <vector>", "", "std::vector<int> doubled(const std::vector<int>& numbers) {", "    std::vector<int> result;", "    for (int x : numbers) {", "        result.push_back(x * 2);", "    }", "    return result;", "}"]
      }
    },

    compare: {
      intro: "Three plans on <code>[72, 45, 90]</code> that give back different things.",
      data: [72, 45, 90],
      rows: [
        { id: "D10", name: "Transform each item", question: "Add 5 to every score", result: "[77, 50, 95]", self: true },
        { id: "D9", name: "Filter", question: "Keep the scores of 50 or more", result: "[72, 90]" },
        { id: "D2", name: "Accumulate", question: "Total the scores", result: "207" }
      ],
      table: { head: ["Plan", "Result", "Length", "Items changed?"], rows: [["Transform each item", "a new list", "same as the input", "yes, all"], ["Filter", "a new list", "0 up to the input's", "no"], ["Accumulate", "one value", "—", "combined"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "D9", why: "the same build-a-new-list loop, without the test" }, { id: "A1", why: "the rule for one item is a small formula" }],
      leadsTo: [{ id: "E3", why: "transform every cell of a table" }]
    }
  };
})();
