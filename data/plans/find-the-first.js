/* Plan data: D6 · Find the first
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "D6",
    slug: "find-the-first",
    title: "Find the first",
    highlight: "first",
    aka: ["linear search", "index of", "find"],
    group: "D",
    level: "Foundations",
    core: true,
    fn: { python: "first_negative", java: "firstNegative", rust: "first_negative", c: "first_negative", cpp: "first_negative" },

    hero: {
      type: "tiles",
      values: [3, 8, -2, 6, -5],
      highlight: 2,
      tag: "found at [2]",
      alt: "Five cubes; the third, -2, is amber as the first negative, at position 2; the two after it are greyed out as never checked"
    },
    planCard: { name: "find", lines: ["visit each position", "test the item", "match → return position"], foot: "↻ none? return -1" },

    intent: "Find where the first matching item is: walk the positions in order and return as soon as one matches, or report “not found”.",

    analogy: {
      icon: "📚",
      title: "Finding a book on an unsorted shelf",
      text: "You run your finger along the shelf from the left, one spine at a time. The moment you see the title you want, you stop and note its place. Only if you reach the end of the shelf can you say it isn't there."
    },

    cues: ["find the first …", "where is …", "position / index of …", "which item …", "search for …"],
    cueSummary: "The answer is <b>a position</b> (or the item itself), plus a way to say “not found”.",
    cueExamples: [
      "At which position is the first negative balance?",
      "Find the index of a name in a list.",
      "Which is the first day the temperature went above 30 °C?"
    ],

    steps: [
      { n: 1, title: "Visit each position in order", text: "Walk the indexes 0, 1, 2, … because the answer is a position." },
      { n: 2, title: "Test the item there", text: "Here: is it negative?" },
      { n: 3, title: "Match? Return its position right away", text: "This is the first match, because every earlier item failed." },
      { n: 4, title: "No match after the loop? Return “not found”", text: "Here -1, a position that can't exist." }
    ],

    impl: {
      python: {
        file: "find.py",
        plain: { lines: [
          [0, "def first_negative(numbers):"],
          [1, "    for i in range(len(numbers)):"],
          [2, "        if numbers[i] < 0:"],
          [3, "            return i"],
          [4, "    return -1"]
        ], note: "Python code often returns <code>None</code> for “not found”. -1 keeps all five languages alike here." },
        idiomatic: { lines: [
          [0, "def first_negative(numbers):"],
          [[1, 2, 3, 4], "    return next((i for i, x in enumerate(numbers) if x < 0), -1)"]
        ], note: "<code>next()</code> takes the first match from the generator, or the default -1 if there is none." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static int firstNegative(int[] numbers) {"],
          [1, "    for (int i = 0; i < numbers.length; i++) {"],
          [2, "        if (numbers[i] < 0) {"],
          [3, "            return i;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    return -1;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "static int firstNegative(int[] numbers) {"],
          [[1, 2, 3, 4], "    return IntStream.range(0, numbers.length).filter(i -> numbers[i] < 0).findFirst().orElse(-1);"],
          [0, "}"]
        ], note: "Streams are lazy: <code>findFirst</code> stops at the first match. Needs <code>java.util.stream.IntStream</code>." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn first_negative(numbers: &[i32]) -> i32 {"],
          [1, "    for (i, &x) in numbers.iter().enumerate() {"],
          [2, "        if x < 0 {"],
          [3, "            return i as i32;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    -1"],
          [0, "}"]
        ], note: "Idiomatic Rust would return <code>Option&lt;usize&gt;</code> instead of -1; see the idiomatic version." },
        idiomatic: { lines: [
          [0, "fn first_negative(numbers: &[i32]) -> i32 {"],
          [[1, 2, 3, 4], "    numbers.iter().position(|&x| x < 0).map_or(-1, |i| i as i32)"],
          [0, "}"]
        ], note: "<code>position</code> returns <code>Some(index)</code> or <code>None</code>; <code>map_or</code> turns <code>None</code> into -1." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "int first_negative(const int numbers[], size_t n) {"],
          [1, "    for (size_t i = 0; i < n; i++) {"],
          [2, "        if (numbers[i] < 0) {"],
          [3, "            return (int) i;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    return -1;"],
          [0, "}"]
        ] },
        idiomatic: null,
        idiomaticNote: "C has no built-in search for arrays, so the loop is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "#include <vector>"],
          [0, ""],
          [0, "int first_negative(const std::vector<int>& numbers) {"],
          [1, "    for (size_t i = 0; i < numbers.size(); i++) {"],
          [2, "        if (numbers[i] < 0) {"],
          [3, "            return static_cast<int>(i);"],
          [0, "        }"],
          [0, "    }"],
          [4, "    return -1;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "#include <algorithm>"],
          [0, "#include <vector>"],
          [0, ""],
          [0, "int first_negative(const std::vector<int>& numbers) {"],
          [[1, 2, 3], "    auto it = std::ranges::find_if(numbers, [](int x) { return x < 0; });"],
          [4, "    return it == numbers.end() ? -1 : static_cast<int>(it - numbers.begin());"],
          [0, "}"]
        ], note: "<code>find_if</code> returns an iterator; <code>end()</code> means “not found”." }
      }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>At which position is the first negative number?</b> Return -1 if there isn't one.",
      input: { kind: "list", max: 10, placeholder: "your list: 3, 8, -2" },
      presets: [
        { label: "Found in the middle", input: [3, 8, -2, 6, -5] },
        { label: "Found first", input: [-1, 4] },
        { label: "Not found", input: [1, 2, 3] },
        { label: "Empty list", input: [] }
      ],
      run(list) {
        const n = list.length, ev = [], states = list.map(() => "");
        let answer = "?";
        const snap = (step, msg, cur = -1, tone = "") => ev.push({
          step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur },
          vars: [{ k: "i", role: "stepper", v: cur >= 0 ? cur : "—" }, { k: "numbers[i]", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "answer", role: "result", v: answer }]
        });
        snap(null, n ? "Ready. Where is the first negative number?" : "Ready. The list is empty.");
        for (let i = 0; i < n; i++) {
          states[i] = "current";
          snap(1, `Visit position ${i}.`, i);
          const hit = list[i] < 0;
          states[i] = hit ? "hit" : "miss";
          snap(2, hit ? `Is ${list[i]} < 0? Yes.` : `Is ${list[i]} < 0? No, move on.`, i);
          if (hit) {
            for (let j = i + 1; j < n; j++) states[j] = "skipped";
            answer = i;
            snap(3, `First match: return position ${i}. ${n - i - 1 ? `The other ${n - i - 1} item${n - i - 1 > 1 ? "s are" : " is"} never checked.` : ""}`, i, "yes");
            return ev;
          }
        }
        answer = -1;
        snap(4, n ? `Reached the end without a match. Return -1 (not found).` : "No positions to visit. Return -1 (not found).", -1, "no");
        return ev;
      }
    },

    checks: {
      params: ["int[]"],
      returns: "int",
      cases: [
        { args: [[3, 8, -2, 6, -5]], expect: 2 },
        { args: [[-1, 4]], expect: 0 },
        { args: [[1, 2, 3]], expect: -1 },
        { args: [[]], expect: -1 }
      ],
      snippets: {
        bugElse: [{ args: [[3, -2]], expect: -1 }],
        bugLast: [{ args: [[3, -2, 6, -5]], expect: 3 }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "Giving up inside the loop", wide: true, code: "bugElse",
        text: "An <code>else: return -1</code> inside the loop reports “not found” after looking at only the first item.",
        take: "“Not found” belongs after the loop, once every position has failed." },
      { kind: "dont", title: "Not stopping at the first match",
        text: "Saving the position and carrying on keeps overwriting it, so you end up with the <em>last</em> match instead of the first.",
        take: "Return (or break) as soon as you find it." },
      { kind: "dont", title: "Using a “not found” value that could be real",
        text: "Returning 0 for “not found” clashes with a real match at position 0.",
        take: "Use -1, None, or an Option: something that can't be a position." },
      { kind: "do", title: "Use binary search on sorted data",
        text: "If the items are sorted, Binary search (F2) finds an item in far fewer steps than walking the whole list." },
      { kind: "do", title: "Use the built-in once you understand it",
        text: "<code>list.index()</code> in Python (it raises if missing), <code>indexOf</code> on Java lists, <code>.position()</code> in Rust and <code>std::ranges::find</code> in C++." }
    ],

    snippets: {
      bugElse: {
        python: ["def first_negative(numbers):", "    for i in range(len(numbers)):", "        if numbers[i] < 0:", "            return i", "        else:", "            return -1    # ✗ gives up after the first item", "    return -1"],
        java: ["static int firstNegative(int[] numbers) {", "    for (int i = 0; i < numbers.length; i++) {", "        if (numbers[i] < 0) {", "            return i;", "        } else {", "            return -1;   // ✗ gives up after the first item", "        }", "    }", "    return -1;", "}"],
        rust: ["fn first_negative(numbers: &[i32]) -> i32 {", "    for (i, &x) in numbers.iter().enumerate() {", "        if x < 0 {", "            return i as i32;", "        } else {", "            return -1;   // ✗ gives up after the first item", "        }", "    }", "    -1", "}"],
        c: ["int first_negative(const int numbers[], size_t n) {", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] < 0) {", "            return (int) i;", "        } else {", "            return -1;   // ✗ gives up after the first item", "        }", "    }", "    return -1;", "}"],
        cpp: ["int first_negative(const std::vector<int>& numbers) {", "    for (size_t i = 0; i < numbers.size(); i++) {", "        if (numbers[i] < 0) {", "            return static_cast<int>(i);", "        } else {", "            return -1;   // ✗ gives up after the first item", "        }", "    }", "    return -1;", "}"]
      },
      bugLast: {
        python: ["def first_negative(numbers):", "    found = -1", "    for i in range(len(numbers)):", "        if numbers[i] < 0:", "            found = i", "    return found"],
        java: ["static int firstNegative(int[] numbers) {", "    int found = -1;", "    for (int i = 0; i < numbers.length; i++) {", "        if (numbers[i] < 0) {", "            found = i;", "        }", "    }", "    return found;", "}"],
        rust: ["fn first_negative(numbers: &[i32]) -> i32 {", "    let mut found = -1;", "    for (i, &x) in numbers.iter().enumerate() {", "        if x < 0 {", "            found = i as i32;", "        }", "    }", "    found", "}"],
        c: ["int first_negative(const int numbers[], size_t n) {", "    int found = -1;", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] < 0) {", "            found = (int) i;", "        }", "    }", "    return found;", "}"],
        cpp: ["int first_negative(const std::vector<int>& numbers) {", "    int found = -1;", "    for (size_t i = 0; i < numbers.size(); i++) {", "        if (numbers[i] < 0) {", "            found = static_cast<int>(i);", "        }", "    }", "    return found;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([5, -3, -8]) return?", options: ["-3", "1", "2", "-1"], answer: 1,
        explain: "It returns the position, not the value. -3 is at position 1 (positions start at 0)." },
      { q: "This version has a bug. What does it return for [3, -2, 6, -5]?", code: "bugLast", options: ["1", "3", "-1"], answer: 1,
        explain: "It never stops, so each negative overwrites found. The last negative, -5 at position 3, wins instead of the first." },
      { q: "Why is -1 a good “not found” answer?", options: ["It's the smallest number", "No real position can be -1", "Python needs it"], answer: 1,
        explain: "Positions start at 0, so -1 can never be confused with a real match." }
    ],

    exercise: {
      title: "Your turn: index of a target",
      task: "Write <code>index_of(numbers, target)</code> that returns the position of the first item equal to <code>target</code>, or -1 if it isn't there.",
      plan: ["Visit each position in order", "Test: is the item there equal to the target?", "Match? Return that position right away", "After the loop, return -1"],
      fn: { python: "index_of", java: "indexOf", rust: "index_of", c: "index_of", cpp: "index_of" },
      params: ["int[]", "int"],
      returns: "int",
      tests: [
        { args: [[4, 7, 1, 7], 7], expect: 1 },
        { args: [[4, 7], 5], expect: -1 },
        { args: [[], 3], expect: -1 },
        { args: [[9], 9], expect: 0 }
      ],
      solutions: {
        python: ["def index_of(numbers, target):", "    for i in range(len(numbers)):", "        if numbers[i] == target:", "            return i", "    return -1"],
        java: ["static int indexOf(int[] numbers, int target) {", "    for (int i = 0; i < numbers.length; i++) {", "        if (numbers[i] == target) {", "            return i;", "        }", "    }", "    return -1;", "}"],
        rust: ["fn index_of(numbers: &[i32], target: i32) -> i32 {", "    for (i, &x) in numbers.iter().enumerate() {", "        if x == target {", "            return i as i32;", "        }", "    }", "    -1", "}"],
        c: ["int index_of(const int numbers[], size_t n, int target) {", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] == target) {", "            return (int) i;", "        }", "    }", "    return -1;", "}"],
        cpp: ["#include <vector>", "", "int index_of(const std::vector<int>& numbers, int target) {", "    for (size_t i = 0; i < numbers.size(); i++) {", "        if (numbers[i] == target) {", "            return static_cast<int>(i);", "        }", "    }", "    return -1;", "}"]
      }
    },

    compare: {
      intro: "Three sibling plans on the same list <code>[3, 8, -2, 6, -5]</code>. Amber marks where each one stops; faded items are never checked.",
      data: [3, 8, -2, 6, -5],
      rows: [
        { id: "D6", name: "Find the first", question: "Where is the first negative?", stop: 2, result: "2", self: true },
        { id: "D7", name: "Is there any?", question: "Is any item negative?", stop: 2, result: "True" },
        { id: "D8", name: "Are all?", question: "Are all items positive?", stop: 2, result: "False" }
      ],
      table: {
        head: ["Plan", "Answers", "Stops early at", "If the loop finishes"],
        rows: [
          ["Find the first", "a position", "the first match", "-1 (not found)"],
          ["Is there any?", "true / false", "the first match", "false"],
          ["Are all?", "true / false", "the first item that fails", "true"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "D7", why: "the same early stop, returning a position instead of yes/no" }],
      leadsTo: [{ id: "F2", why: "a much faster search when the data is sorted" }, { id: "G2", why: "try candidates in order until one works" }]
    }
  };
})();
