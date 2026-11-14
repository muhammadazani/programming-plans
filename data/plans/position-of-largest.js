/* Plan data: D5 · Position of the largest
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "D5",
    slug: "position-of-largest",
    title: "Position of the largest",
    highlight: "Position",
    aka: ["argmax", "index of max", "where is the best"],
    group: "D",
    level: "Core",
    core: false,
    fn: { python: "index_of_max", java: "indexOfMax", rust: "index_of_max", c: "index_of_max", cpp: "index_of_max" },

    hero: { type: "tiles", values: [4, 9, 2, 9, 7], colors: ["pale", "amber", "pale", "pale", "pale"], highlight: 1, tag: "best at [1]", alt: "Five cubes; the first 9, at position 1, is amber as the largest" },
    planCard: { name: "argmax", lines: ["best = position 0", "for each other position", "bigger? best = here"], foot: "→ return the position" },

    intent: "Find where the largest item is: remember the position of the best so far, and compare each item with the item at that position.",

    analogy: { icon: "🏔️", title: "Marking the highest peak on a map", text: "You walk along a ridge and keep a flag in the highest point you've seen so far. Each time you reach a higher point, you move the flag there. At the end, the flag marks where the highest point is, not just how high it is." },

    cues: ["which day / which item …", "where is the largest …", "position / index of the best", "who scored the highest"],
    cueSummary: "The answer is a <b>position</b>, the place where the most extreme value sits.",
    cueExamples: ["On which day was it hottest?", "Which student (by position in the list) scored the highest?", "Where is the cheapest item, so you can remove it?"],

    steps: [
      { n: 1, title: "Start with position 0 as the best so far", text: "The first item's position, not its value." },
      { n: 2, title: "Visit each other position", text: "From position 1 to the end." },
      { n: 3, title: "Compare its item with the item at the best position", text: "numbers[i] > numbers[best]: the best is looked up through its position." },
      { n: 4, title: "Bigger? Remember this position", text: "best = i. On a tie, the earlier position stays, because > isn't true for equal values." },
      { n: 5, title: "Return the position", text: "The list must not be empty." }
    ],

    impl: {
      python: { file: "argmax.py",
        plain: { lines: [[0, "def index_of_max(numbers):"], [1, "    best = 0"], [2, "    for i in range(1, len(numbers)):"], [3, "        if numbers[i] > numbers[best]:"], [4, "            best = i"], [5, "    return best"]] },
        idiomatic: { lines: [[0, "def index_of_max(numbers):"], [[1, 2, 3, 4, 5], "    return numbers.index(max(numbers))"]], note: "Clear, but it walks the list twice: once for <code>max</code>, once for <code>index</code>." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int indexOfMax(int[] numbers) {"], [1, "    int best = 0;"], [2, "    for (int i = 1; i < numbers.length; i++) {"], [3, "        if (numbers[i] > numbers[best]) {"], [4, "            best = i;"], [0, "        }"], [0, "    }"], [5, "    return best;"], [0, "}"]] },
        idiomatic: { lines: [[0, "static int indexOfMax(int[] numbers) {"], [[1, 2, 3, 4, 5], "    return IntStream.range(0, numbers.length).reduce((a, b) -> numbers[b] > numbers[a] ? b : a).getAsInt();"], [0, "}"]], note: "<code>reduce</code> keeps one position and lets each new one challenge it, the plan in one expression." } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn index_of_max(numbers: &[i32]) -> i32 {"], [1, "    let mut best = 0;"], [2, "    for i in 1..numbers.len() {"], [3, "        if numbers[i] > numbers[best] {"], [4, "            best = i;"], [0, "        }"], [0, "    }"], [5, "    best as i32"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn index_of_max(numbers: &[i32]) -> i32 {"], [[1, 2, 3, 4, 5], "    numbers.iter().enumerate().rev().max_by_key(|&(_, &x)| x).unwrap().0 as i32"], [0, "}"]], note: "<code>max_by_key</code> returns the <em>last</em> of several equal maxima, so <code>.rev()</code> is needed to get the first. A good reason to know the plain loop." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "int index_of_max(const int numbers[], size_t n) {"], [1, "    size_t best = 0;"], [2, "    for (size_t i = 1; i < n; i++) {"], [3, "        if (numbers[i] > numbers[best]) {"], [4, "            best = i;"], [0, "        }"], [0, "    }"], [5, "    return (int) best;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "C has no built-in argmax, so the loop is the idiomatic way." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "int index_of_max(const std::vector<int>& numbers) {"], [1, "    size_t best = 0;"], [2, "    for (size_t i = 1; i < numbers.size(); i++) {"], [3, "        if (numbers[i] > numbers[best]) {"], [4, "            best = i;"], [0, "        }"], [0, "    }"], [5, "    return static_cast<int>(best);"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <algorithm>"], [0, "#include <vector>"], [0, ""], [0, "int index_of_max(const std::vector<int>& numbers) {"], [[1, 2, 3, 4, 5], "    return static_cast<int>(std::ranges::max_element(numbers) - numbers.begin());"], [0, "}"]], note: "<code>max_element</code> returns an iterator to the first largest item; subtracting <code>begin()</code> turns it into a position." } }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>At which position is the largest number?</b> On a tie, the first one wins.",
      input: { kind: "list", max: 10, placeholder: "your list: 4, 9, 2, 9" },
      presets: [{ label: "With a tie", input: [4, 9, 2, 9, 7] }, { label: "Rising", input: [1, 2, 3] }, { label: "All negative", input: [-5, -2, -9] }],
      run(raw) {
        const list = raw.length ? raw : [0];
        const ev = [], states = list.map(() => "");
        let best = 0;
        const snap = (step, msg, cur = -1, tone = "") => {
          const st = states.slice(); if (st[best] !== "current") st[best] = "best";
          ev.push({ step, msg, tone, view: { values: list, states: st, ptr: cur, badges: list.map((_, i) => (i === best ? "best" : "")) },
            vars: [{ k: "i", role: "stepper", v: cur > 0 ? cur : "—" }, { k: "best", role: "best", v: best }, { k: "numbers[best]", role: "best", v: list[best] }] });
        };
        ev.push({ step: null, msg: raw.length ? "Ready. Where is the largest number?" : "The list must not be empty, so this trace uses [0].", view: { values: list, states: states.slice(), ptr: -1 }, vars: [{ k: "best", role: "best", v: "?" }] });
        snap(1, `Start with position 0 (value ${list[0]}) as the best so far.`, 0);
        for (let i = 1; i < list.length; i++) {
          states[i] = "current";
          snap(2, `Visit position ${i}: ${list[i]}.`, i);
          states[i] = "miss";
          if (list[i] > list[best]) {
            snap(3, `Is ${list[i]} > numbers[${best}] (${list[best]})? Yes.`, i);
            best = i; snap(4, `Remember this position: best = ${i}.`, i);
          } else snap(3, `Is ${list[i]} > numbers[${best}] (${list[best]})? No${list[i] === list[best] ? ": equal, so the earlier position stays" : ""}.`, i);
        }
        snap(5, `Return position ${best} (the value there is ${list[best]}).`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"], returns: "int",
      cases: [{ args: [[4, 9, 2, 9, 7]], expect: 1 }, { args: [[5]], expect: 0 }, { args: [[1, 2, 3]], expect: 2 }, { args: [[-5, -2, -9]], expect: 1 }],
      snippets: { bugValue: [{ args: [[4, 9, 2]], expect: 9 }], bugLastTie: [{ args: [[4, 9, 2, 9]], expect: 3 }] }
    },

    pitfalls: [
      { kind: "dont", title: "Returning the value instead of the position", wide: true, code: "bugValue", text: "Keeping the best <em>value</em> (the D4 plan) and returning it answers “how high?”, not “where?”.", take: "Keep the position, and look the value up through it: numbers[best]." },
      { kind: "dont", title: ">= when you want the first", text: "With <code>&gt;=</code>, a later equal value takes over, so you get the <em>last</em> position of the largest value.", take: "Decide which tie you want, and pick > or >= on purpose." },
      { kind: "dont", title: "An empty list", text: "There is no position of the largest item in an empty list. Starting with best = 0 silently answers 0.", take: "Guard first (B1) if the list can be empty." },
      { kind: "do", title: "Use the position to get more", text: "With the position you can find the value, a matching name in a parallel list, or swap the item (selection sort, F3)." },
      { kind: "do", title: "Know your library's tie rule", text: "C++ <code>max_element</code> and Python <code>index</code> give the first position; Rust's <code>max_by_key</code> gives the last." }
    ],

    snippets: {
      bugValue: {
        python: ["def index_of_max(numbers):", "    best = numbers[0]", "    for x in numbers[1:]:", "        if x > best:", "            best = x", "    return best          # ✗ a value, not a position"],
        java: ["static int indexOfMax(int[] numbers) {", "    int best = numbers[0];", "    for (int x : numbers) {", "        if (x > best) best = x;", "    }", "    return best;         // ✗ a value, not a position", "}"],
        rust: ["fn index_of_max(numbers: &[i32]) -> i32 {", "    let mut best = numbers[0];", "    for &x in numbers {", "        if x > best { best = x; }", "    }", "    best                 // ✗ a value, not a position", "}"],
        c: ["int index_of_max(const int numbers[], size_t n) {", "    int best = numbers[0];", "    for (size_t i = 1; i < n; i++) {", "        if (numbers[i] > best) best = numbers[i];", "    }", "    return best;         // ✗ a value, not a position", "}"],
        cpp: ["int index_of_max(const std::vector<int>& numbers) {", "    int best = numbers[0];", "    for (int x : numbers) {", "        if (x > best) best = x;", "    }", "    return best;         // ✗ a value, not a position", "}"]
      },
      bugLastTie: {
        python: ["def index_of_max(numbers):", "    best = 0", "    for i in range(1, len(numbers)):", "        if numbers[i] >= numbers[best]:", "            best = i", "    return best"],
        java: ["static int indexOfMax(int[] numbers) {", "    int best = 0;", "    for (int i = 1; i < numbers.length; i++) {", "        if (numbers[i] >= numbers[best]) best = i;", "    }", "    return best;", "}"],
        rust: ["fn index_of_max(numbers: &[i32]) -> i32 {", "    let mut best = 0;", "    for i in 1..numbers.len() {", "        if numbers[i] >= numbers[best] { best = i; }", "    }", "    best as i32", "}"],
        c: ["int index_of_max(const int numbers[], size_t n) {", "    size_t best = 0;", "    for (size_t i = 1; i < n; i++) {", "        if (numbers[i] >= numbers[best]) best = i;", "    }", "    return (int) best;", "}"],
        cpp: ["int index_of_max(const std::vector<int>& numbers) {", "    size_t best = 0;", "    for (size_t i = 1; i < numbers.size(); i++) {", "        if (numbers[i] >= numbers[best]) best = i;", "    }", "    return static_cast<int>(best);", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([7, 3, 12, 5]) return?", options: ["12", "2", "3"], answer: 1, explain: "The largest value, 12, is at position 2 (positions start at 0)." },
      { q: "This version has a bug. What does it return for [4, 9, 2, 9]?", code: "bugLastTie", options: ["1", "3", "9"], answer: 1, explain: "With >=, the second 9 (at position 3) replaces the first, so it returns the last position of the largest value." },
      { q: "Why keep the position rather than the value?", options: ["Positions are smaller numbers", "From the position you can still get the value, but not the other way round", "Values can't be compared"], answer: 1, explain: "numbers[best] gives the value at any time. A value alone doesn't tell you where it was." }
    ],

    exercise: {
      title: "Your turn: position of the smallest",
      task: "Write <code>index_of_min(numbers)</code> that returns the position of the smallest number in a non-empty list (the first one, on a tie).",
      plan: ["Start with position 0 as the best so far", "Visit each other position", "Is its item smaller than the item at the best position?", "If so, remember this position", "Return the position"],
      fn: { python: "index_of_min", java: "indexOfMin", rust: "index_of_min", c: "index_of_min", cpp: "index_of_min" },
      params: ["int[]"], returns: "int",
      tests: [{ args: [[4, 1, 8, 1]], expect: 1 }, { args: [[3]], expect: 0 }, { args: [[9, 7, 5]], expect: 2 }],
      solutions: {
        python: ["def index_of_min(numbers):", "    best = 0", "    for i in range(1, len(numbers)):", "        if numbers[i] < numbers[best]:", "            best = i", "    return best"],
        java: ["static int indexOfMin(int[] numbers) {", "    int best = 0;", "    for (int i = 1; i < numbers.length; i++) {", "        if (numbers[i] < numbers[best]) best = i;", "    }", "    return best;", "}"],
        rust: ["fn index_of_min(numbers: &[i32]) -> i32 {", "    let mut best = 0;", "    for i in 1..numbers.len() {", "        if numbers[i] < numbers[best] { best = i; }", "    }", "    best as i32", "}"],
        c: ["int index_of_min(const int numbers[], size_t n) {", "    size_t best = 0;", "    for (size_t i = 1; i < n; i++) {", "        if (numbers[i] < numbers[best]) best = i;", "    }", "    return (int) best;", "}"],
        cpp: ["#include <vector>", "", "int index_of_min(const std::vector<int>& numbers) {", "    size_t best = 0;", "    for (size_t i = 1; i < numbers.size(); i++) {", "        if (numbers[i] < numbers[best]) best = i;", "    }", "    return static_cast<int>(best);", "}"]
      }
    },

    compare: {
      intro: "Two plans on <code>[4, 9, 2, 9, 7]</code>: one remembers the best value, the other where it is.",
      data: [4, 9, 2, 9, 7],
      rows: [
        { id: "D5", name: "Position of the largest", question: "Where is the largest?", result: "1", self: true },
        { id: "D4", name: "Largest / smallest", question: "What is the largest?", result: "9" },
        { id: "D6", name: "Find the first", question: "Where is the first 9?", stop: 1, result: "1" }
      ],
      table: { head: ["Plan", "Remembers", "Visits", "Returns"], rows: [["Position of the largest", "the best position", "every item", "a position"], ["Largest / smallest", "the best value", "every item", "a value"], ["Find the first", "nothing", "until a match", "a position or -1"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "D4", why: "the same best-so-far idea, keeping a position" }],
      leadsTo: [{ id: "F3", why: "selection sort finds the smallest position again and again" }]
    }
  };
})();
