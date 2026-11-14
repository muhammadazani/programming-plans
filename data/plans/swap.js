/* Plan data: A2 · Swap two values
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "A2",
    slug: "swap",
    title: "Swap two values",
    highlight: "Swap",
    aka: ["exchange", "temp swap", "three-step swap"],
    group: "A",
    level: "Foundations",
    core: false,
    fn: { python: "sort_two", java: "sortTwo", rust: "sort_two", c: "sort_two", cpp: "sort_two" },

    hero: { type: "tiles", values: [5, 3, 5], colors: ["pale", "amber", "blue"], tagAt: 2, tag: "temp = a", alt: "Three cubes for a, b and temp; temp holds a copy of a while b moves into a" },
    planCard: { name: "swap", lines: ["temp = a", "a = b", "b = temp"], foot: "→ nothing is lost" },

    intent: "Exchange the values of two variables without losing either one, by parking one of them in a temporary variable first.",

    analogy: { icon: "🥤", title: "Swapping the drinks in two glasses", text: "Juice is in one glass and milk in the other, and you want them the other way round. You can't pour juice into the full milk glass. So you pour the juice into an empty third glass, pour the milk into the juice glass, then pour the juice from the third glass into the milk glass." },

    cues: ["swap", "exchange", "the other way round", "put the smaller one first", "reverse two items"],
    cueSummary: "Two places must <b>trade</b> their values. Overwriting one directly would destroy it.",
    cueExamples: ["Make sure a is the smaller of two numbers.", "Swap the first and last items of a list.", "Exchange the players' positions."],

    steps: [
      { n: 1, title: "Check whether a swap is needed", text: "Here: only if a is bigger than b. (Some problems always swap.)" },
      { n: 2, title: "Park one value in a temporary variable", text: "temp = a. Now a's value is safe." },
      { n: 3, title: "Copy the other value across", text: "a = b. a's old value would be lost here without the temp." },
      { n: 4, title: "Put the parked value in place", text: "b = temp. The swap is complete." },
      { n: 5, title: "Return the result", text: "Here both values, smaller first." }
    ],

    impl: {
      python: { file: "swap.py",
        plain: { lines: [[0, "def sort_two(a, b):"], [1, "    if a > b:"], [2, "        temp = a"], [3, "        a = b"], [4, "        b = temp"], [5, "    return [a, b]"]] },
        idiomatic: { lines: [[0, "def sort_two(a, b):"], [1, "    if a > b:"], [[2, 3, 4], "        a, b = b, a"], [5, "    return [a, b]"]], note: "Python packs the right-hand side into a tuple first, so <code>a, b = b, a</code> needs no temp." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static List<Integer> sortTwo(int a, int b) {"], [1, "    if (a > b) {"], [2, "        int temp = a;"], [3, "        a = b;"], [4, "        b = temp;"], [0, "    }"], [5, "    return List.of(a, b);"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "Java has no built-in swap for local variables; the three-line temp swap is the idiomatic way. (A method can't swap its caller's <code>int</code>s, because Java passes copies.)" },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn sort_two(a: i32, b: i32) -> Vec<i32> {"], [0, "    let (mut a, mut b) = (a, b);"], [1, "    if a > b {"], [2, "        let temp = a;"], [3, "        a = b;"], [4, "        b = temp;"], [0, "    }"], [5, "    vec![a, b]"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn sort_two(a: i32, b: i32) -> Vec<i32> {"], [0, "    let (mut a, mut b) = (a, b);"], [1, "    if a > b {"], [[2, 3, 4], "        std::mem::swap(&mut a, &mut b);"], [0, "    }"], [5, "    vec![a, b]"], [0, "}"]], note: "<code>std::mem::swap</code> exchanges any two values of the same type." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "size_t sort_two(int a, int b, int out[]) {"], [1, "    if (a > b) {"], [2, "        int temp = a;"], [3, "        a = b;"], [4, "        b = temp;"], [0, "    }"], [5, "    out[0] = a;"], [5, "    out[1] = b;"], [5, "    return 2;"], [0, "}"]], note: "The result goes into the caller's <code>out</code> array. To swap a caller's variables, C passes pointers: <code>void swap(int *x, int *y)</code>." },
        idiomatic: null, idiomaticNote: "C has no swap function; the temp swap (often inside <code>void swap(int *x, int *y)</code>) is the idiomatic way." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "std::vector<int> sort_two(int a, int b) {"], [1, "    if (a > b) {"], [2, "        int temp = a;"], [3, "        a = b;"], [4, "        b = temp;"], [0, "    }"], [5, "    return {a, b};"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <utility>"], [0, "#include <vector>"], [0, ""], [0, "std::vector<int> sort_two(int a, int b) {"], [1, "    if (a > b) {"], [[2, 3, 4], "        std::swap(a, b);"], [0, "    }"], [5, "    return {a, b};"], [0, "}"]], note: "<code>std::swap</code> (in <code>&lt;utility&gt;</code>) does the three steps for you." } }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Return two numbers with the smaller one first.</b> The three boxes are the variables a, b and temp.",
      input: { kind: "fields", fields: [{ name: "a", label: "a", min: -99, max: 999 }, { name: "b", label: "b", min: -99, max: 999 }] },
      presets: [{ label: "a = 5, b = 3", input: { a: 5, b: 3 } }, { label: "Already in order", input: { a: 2, b: 9 } }, { label: "Equal", input: { a: 4, b: 4 } }],
      run({ a, b }) {
        const ev = [];
        let va = a, vb = b, vt = "·";
        const push = (step, msg, hot = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: [va, vb, vt], states: [0, 1, 2].map((i) => (i === hot ? "hit" : "")), ptr: hot, noIdx: true, badges: ["a", "b", "temp"] },
          vars: [{ k: "a", role: "temp", v: va }, { k: "b", role: "temp", v: vb }, { k: "temp", role: "temp", v: vt }] });
        push(null, `Ready. a = ${a}, b = ${b}.`);
        if (!(va > vb)) {
          push(1, `Is ${va} > ${vb}? No, they're already in order. No swap needed.`);
          push(5, `Return [${va}, ${vb}].`, -1, "yes");
          return ev;
        }
        push(1, `Is ${va} > ${vb}? Yes, so swap them.`);
        vt = va; push(2, `Park a's value: temp = ${vt}.`, 2);
        va = vb; push(3, `Copy b into a: a = ${va}. Without temp, the ${vt} would now be gone.`, 0);
        vb = vt; push(4, `Put the parked value into b: b = ${vb}.`, 1);
        push(5, `Return [${va}, ${vb}].`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int", "int"], returns: "int[]",
      cases: [{ args: [5, 3], expect: [3, 5] }, { args: [2, 9], expect: [2, 9] }, { args: [4, 4], expect: [4, 4] }, { args: [-1, -7], expect: [-7, -1] }],
      snippets: { bugNoTemp: [{ args: [5, 3], expect: [3, 3] }], bugCondition: [{ args: [3, 5], expect: [5, 3] }] }
    },

    pitfalls: [
      { kind: "dont", title: "Swapping without a temp", wide: true, code: "bugNoTemp", text: "<code>a = b</code> followed by <code>b = a</code> copies b into a, then copies it straight back. Both end up holding b's value; a's value is gone.", take: "Park one value first: temp = a, a = b, b = temp." },
      { kind: "dont", title: "Testing the wrong way round", text: "Swapping when <code>a &lt; b</code> puts the larger value first, the opposite of what was asked.", take: "Swap when the pair is in the wrong order." },
      { kind: "dont", title: "Expecting a function to swap the caller's variables", text: "In Java (and in Python, for numbers), a function gets copies. Swapping them inside the function changes nothing outside.", take: "Return the swapped values, or use pointers (C) or references (C++)." },
      { kind: "do", title: "Use the language's swap", text: "Python's <code>a, b = b, a</code>, Rust's <code>std::mem::swap</code> and C++'s <code>std::swap</code> are clearer than three lines once you know what they do." },
      { kind: "do", title: "Know where you'll use it", text: "Swapping is a building block: selection sort (F3) and reversing a list with two pointers (F1) both swap over and over." }
    ],

    snippets: {
      bugNoTemp: {
        python: ["def sort_two(a, b):", "    if a > b:", "        a = b          # ✗ a's value is lost here", "        b = a", "    return [a, b]"],
        java: ["static List<Integer> sortTwo(int a, int b) {", "    if (a > b) {", "        a = b;         // ✗ a's value is lost here", "        b = a;", "    }", "    return List.of(a, b);", "}"],
        rust: ["fn sort_two(a: i32, b: i32) -> Vec<i32> {", "    let (mut a, mut b) = (a, b);", "    if a > b {", "        a = b;         // ✗ a's value is lost here", "        b = a;", "    }", "    vec![a, b]", "}"],
        c: ["size_t sort_two(int a, int b, int out[]) {", "    if (a > b) {", "        a = b;         // ✗ a's value is lost here", "        b = a;", "    }", "    out[0] = a;", "    out[1] = b;", "    return 2;", "}"],
        cpp: ["std::vector<int> sort_two(int a, int b) {", "    if (a > b) {", "        a = b;         // ✗ a's value is lost here", "        b = a;", "    }", "    return {a, b};", "}"]
      },
      bugCondition: {
        python: ["def sort_two(a, b):", "    if a < b:", "        temp = a", "        a = b", "        b = temp", "    return [a, b]"],
        java: ["static List<Integer> sortTwo(int a, int b) {", "    if (a < b) {", "        int temp = a;", "        a = b;", "        b = temp;", "    }", "    return List.of(a, b);", "}"],
        rust: ["fn sort_two(a: i32, b: i32) -> Vec<i32> {", "    let (mut a, mut b) = (a, b);", "    if a < b {", "        let temp = a;", "        a = b;", "        b = temp;", "    }", "    vec![a, b]", "}"],
        c: ["size_t sort_two(int a, int b, int out[]) {", "    if (a < b) {", "        int temp = a;", "        a = b;", "        b = temp;", "    }", "    out[0] = a;", "    out[1] = b;", "    return 2;", "}"],
        cpp: ["std::vector<int> sort_two(int a, int b) {", "    if (a < b) {", "        int temp = a;", "        a = b;", "        b = temp;", "    }", "    return {a, b};", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(8, 2) return?", options: ["[8, 2]", "[2, 8]", "[2, 2]"], answer: 1, explain: "8 > 2, so they're swapped: the smaller value comes first." },
      { q: "This version has a bug. What does it return for (5, 3)?", code: "bugNoTemp", options: ["[3, 5]", "[3, 3]", "[5, 5]"], answer: 1, explain: "a = b makes a 3, and then b = a copies that 3 back into b. The 5 is lost." },
      { q: "How many assignments does a temp swap need?", options: ["2", "3", "4"], answer: 1, explain: "temp = a, a = b, b = temp: three. Two assignments can't swap without losing a value." }
    ],

    exercise: {
      title: "Your turn: rotate three values",
      task: "Write <code>rotate_left(a, b, c)</code> that returns the three values moved one place to the left: (1, 2, 3) becomes [2, 3, 1]. Use one temporary variable.",
      plan: ["Park a in temp", "Move b into a", "Move c into b", "Put temp into c, then return [a, b, c]"],
      fn: { python: "rotate_left", java: "rotateLeft", rust: "rotate_left", c: "rotate_left", cpp: "rotate_left" },
      params: ["int", "int", "int"], returns: "int[]",
      tests: [{ args: [1, 2, 3], expect: [2, 3, 1] }, { args: [7, 7, 0], expect: [7, 0, 7] }, { args: [-1, 5, 9], expect: [5, 9, -1] }],
      solutions: {
        python: ["def rotate_left(a, b, c):", "    temp = a", "    a = b", "    b = c", "    c = temp", "    return [a, b, c]"],
        java: ["static List<Integer> rotateLeft(int a, int b, int c) {", "    int temp = a;", "    a = b;", "    b = c;", "    c = temp;", "    return List.of(a, b, c);", "}"],
        rust: ["fn rotate_left(a: i32, b: i32, c: i32) -> Vec<i32> {", "    let (mut a, mut b, mut c) = (a, b, c);", "    let temp = a;", "    a = b;", "    b = c;", "    c = temp;", "    vec![a, b, c]", "}"],
        c: ["size_t rotate_left(int a, int b, int c, int out[]) {", "    int temp = a;", "    a = b;", "    b = c;", "    c = temp;", "    out[0] = a;", "    out[1] = b;", "    out[2] = c;", "    return 3;", "}"],
        cpp: ["#include <vector>", "", "std::vector<int> rotate_left(int a, int b, int c) {", "    int temp = a;", "    a = b;", "    b = c;", "    c = temp;", "    return {a, b, c};", "}"]
      }
    },

    compare: {
      intro: "Three small sequence plans: straight-line code with no loop.",
      rows: [
        { id: "A2", name: "Swap two values", question: "Put the smaller number first", shape: "temp = a; a = b; b = temp", result: "values exchanged", self: true },
        { id: "A1", name: "Input → process → output", question: "Compute a speed", shape: "convert, compute, return", result: "a new value" },
        { id: "A3", name: "Split with div and mod", question: "Seconds to hours, minutes, seconds", shape: "// for how many fit, % for what's left", result: "several parts" }
      ],
      table: { head: ["Plan", "Creates new values?", "Needs a temp?", "Typical use"], rows: [["Swap two values", "no, it moves existing ones", "yes", "ordering, sorting, reversing"], ["Input → process → output", "yes", "no", "formulas"], ["Split with div and mod", "yes", "no", "units, digits, change"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "B2", why: "the check whether a swap is needed" }],
      leadsTo: [{ id: "F3", why: "selection sort swaps the smallest item into place" }, { id: "F1", why: "reverse a list by swapping from both ends" }]
    }
  };
})();
