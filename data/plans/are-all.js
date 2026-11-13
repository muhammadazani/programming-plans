/* Plan data: D8 · Are all?
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "D8",
    slug: "are-all",
    title: "Are all?",
    highlight: "all?",
    aka: ["universal check", "all()", "every"],
    group: "D",
    level: "Foundations",
    core: true,
    fn: { python: "all_positive", java: "allPositive", rust: "all_positive", c: "all_positive", cpp: "all_positive" },

    hero: {
      type: "tiles",
      values: [4, 8, -2, 6, 5],
      highlight: 2,
      tag: "-2 > 0 ✗",
      alt: "Five cubes; the third, -2, is amber because it fails the test, and the two after it are greyed out as never checked"
    },
    planCard: { name: "all?", lines: ["visit each item", "test it", "fails → no, stop"], foot: "↻ none failed? yes" },

    intent: "Check that every item passes a test: stop with no at the first item that fails, and answer yes only when none failed.",

    analogy: {
      icon: "🔦",
      title: "Checking the torches before a hike",
      text: "Everyone must have a working torch. You test them one by one; the first dead torch means “not everyone is ready”, and there's no need to test the rest. Only when every torch lights up can you say yes."
    },

    cues: ["are all …", "every …", "each one …", "none of them is not …", "always", "valid only if every …"],
    cueSummary: "The answer is <b>yes or no</b>, and a single failing item is enough to say no.",
    cueExamples: [
      "Are all the scores between 0 and 100?",
      "Is every character in the PIN a digit?",
      "Did every sensor report a value above zero?"
    ],

    steps: [
      { n: 1, title: "Visit each item", text: "From the first to the last, until one fails." },
      { n: 2, title: "Test it", text: "Here: is it positive? We look for an item that fails." },
      { n: 3, title: "Fails? Answer no and stop", text: "One counterexample is enough; the remaining items can't change the answer." },
      { n: 4, title: "None failed? Answer yes", text: "Only after the loop. That includes an empty list: no item failed." }
    ],

    impl: {
      python: {
        file: "all_positive.py",
        plain: { lines: [
          [0, "def all_positive(numbers):"],
          [1, "    for x in numbers:"],
          [2, "        if x <= 0:"],
          [3, "            return False"],
          [4, "    return True"]
        ], note: "The test is written for the failing case: <code>x &lt;= 0</code> is the opposite of “positive”." },
        idiomatic: { lines: [
          [0, "def all_positive(numbers):"],
          [[1, 2, 3, 4], "    return all(x > 0 for x in numbers)"]
        ], note: "<code>all()</code> stops at the first false value, and returns <code>True</code> for an empty list." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static boolean allPositive(int[] numbers) {"],
          [1, "    for (int x : numbers) {"],
          [2, "        if (x <= 0) {"],
          [3, "            return false;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    return true;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "static boolean allPositive(int[] numbers) {"],
          [[1, 2, 3, 4], "    return Arrays.stream(numbers).allMatch(x -> x > 0);"],
          [0, "}"]
        ], note: "<code>allMatch</code> short-circuits too, and is <code>true</code> for an empty stream." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn all_positive(numbers: &[i32]) -> bool {"],
          [1, "    for &x in numbers {"],
          [2, "        if x <= 0 {"],
          [3, "            return false;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    true"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "fn all_positive(numbers: &[i32]) -> bool {"],
          [[1, 2, 3, 4], "    numbers.iter().all(|&x| x > 0)"],
          [0, "}"]
        ], note: "<code>Iterator::all</code> stops at the first <code>false</code>." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "bool all_positive(const int numbers[], size_t n) {"],
          [1, "    for (size_t i = 0; i < n; i++) {"],
          [2, "        if (numbers[i] <= 0) {"],
          [3, "            return false;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    return true;"],
          [0, "}"]
        ], note: "<code>bool</code> needs <code>#include &lt;stdbool.h&gt;</code> before C23." },
        idiomatic: null,
        idiomaticNote: "C has no built-in <code>all</code>, so the loop is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "#include <vector>"],
          [0, ""],
          [0, "bool all_positive(const std::vector<int>& numbers) {"],
          [1, "    for (int x : numbers) {"],
          [2, "        if (x <= 0) {"],
          [3, "            return false;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    return true;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "#include <algorithm>"],
          [0, "#include <vector>"],
          [0, ""],
          [0, "bool all_positive(const std::vector<int>& numbers) {"],
          [[1, 2, 3, 4], "    return std::ranges::all_of(numbers, [](int x) { return x > 0; });"],
          [0, "}"]
        ] }
      }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Are all the numbers positive?</b> The plan looks for the first number that isn't.",
      input: { kind: "list", max: 10, placeholder: "your list: 4, 8, 15" },
      presets: [
        { label: "One fails", input: [4, 8, -2, 6, 5] },
        { label: "All pass", input: [4, 8, 15] },
        { label: "Zero fails", input: [0] },
        { label: "Empty list", input: [] }
      ],
      run(list) {
        const n = list.length, ev = [], states = list.map(() => "");
        let answer = "?";
        const snap = (step, msg, cur = -1, tone = "") => ev.push({
          step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur },
          vars: [{ k: "x", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "answer", role: "result", v: answer }]
        });
        snap(null, n ? "Ready. Are they all positive?" : "Ready. The list is empty.");
        for (let i = 0; i < n; i++) {
          states[i] = "current";
          snap(1, `Visit item [${i}]: x = ${list[i]}`, i);
          const fails = list[i] <= 0;
          states[i] = fails ? "hit" : "added";
          snap(2, fails ? `Is ${list[i]} positive? No, it fails.` : `Is ${list[i]} positive? Yes, keep checking.`, i);
          if (fails) {
            for (let j = i + 1; j < n; j++) states[j] = "skipped";
            answer = "False";
            snap(3, `Found a counterexample. Answer False and stop.${n - i - 1 ? ` ${n - i - 1} item${n - i - 1 > 1 ? "s were" : " was"} never checked.` : ""}`, i, "no");
            return ev;
          }
        }
        answer = "True";
        snap(4, n ? `${n === 1 ? "The only item" : `All ${n} items`} passed. Answer True.` : "No items, so none can fail. Answer True.", -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"],
      returns: "bool",
      cases: [
        { args: [[4, 8, 15]], expect: true },
        { args: [[4, -8, 15]], expect: false },
        { args: [[]], expect: true },
        { args: [[0]], expect: false }
      ],
      snippets: {
        bugElse: [{ args: [[5, -1]], expect: true }],
        bugAny: [{ args: [[5, -1]], expect: true }, { args: [[]], expect: false }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "Saying yes inside the loop", wide: true, code: "bugElse",
        text: "An <code>else: return True</code> inside the loop answers yes as soon as the first item passes, without looking at the rest.",
        take: "“Yes” belongs after the loop, once nothing has failed." },
      { kind: "dont", title: "Writing “any” by accident",
        text: "Starting a flag at false and setting it to true when an item passes checks whether <em>any</em> item passes, not all of them.",
        take: "For “all”, look for the first failure." },
      { kind: "dont", title: "Getting the empty list wrong",
        text: "An empty list has no item that fails, so “are all positive?” is <b>true</b>. It surprises people, but every language's built-in agrees.",
        take: "If an empty list should count as invalid, check for it separately." },
      { kind: "do", title: "Test the opposite condition",
        text: "Inside the loop you're hunting for a failure, so the <code>if</code> tests “not positive”. Saying that aloud keeps the logic straight." },
      { kind: "do", title: "Use the built-in once you understand it",
        text: "<code>all()</code>, <code>allMatch</code>, <code>.all()</code> and <code>std::ranges::all_of</code> are this plan, and they stop early too." }
    ],

    snippets: {
      bugElse: {
        python: ["def all_positive(numbers):", "    for x in numbers:", "        if x <= 0:", "            return False", "        else:", "            return True     # ✗ answers after the first item", "    return True"],
        java: ["static boolean allPositive(int[] numbers) {", "    for (int x : numbers) {", "        if (x <= 0) {", "            return false;", "        } else {", "            return true;    // ✗ answers after the first item", "        }", "    }", "    return true;", "}"],
        rust: ["fn all_positive(numbers: &[i32]) -> bool {", "    for &x in numbers {", "        if x <= 0 {", "            return false;", "        } else {", "            return true;    // ✗ answers after the first item", "        }", "    }", "    true", "}"],
        c: ["bool all_positive(const int numbers[], size_t n) {", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] <= 0) {", "            return false;", "        } else {", "            return true;    // ✗ answers after the first item", "        }", "    }", "    return true;", "}"],
        cpp: ["bool all_positive(const std::vector<int>& numbers) {", "    for (int x : numbers) {", "        if (x <= 0) {", "            return false;", "        } else {", "            return true;    // ✗ answers after the first item", "        }", "    }", "    return true;", "}"]
      },
      bugAny: {
        python: ["def all_positive(numbers):", "    ok = False", "    for x in numbers:", "        if x > 0:", "            ok = True", "    return ok"],
        java: ["static boolean allPositive(int[] numbers) {", "    boolean ok = false;", "    for (int x : numbers) {", "        if (x > 0) {", "            ok = true;", "        }", "    }", "    return ok;", "}"],
        rust: ["fn all_positive(numbers: &[i32]) -> bool {", "    let mut ok = false;", "    for &x in numbers {", "        if x > 0 {", "            ok = true;", "        }", "    }", "    ok", "}"],
        c: ["bool all_positive(const int numbers[], size_t n) {", "    bool ok = false;", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] > 0) {", "            ok = true;", "        }", "    }", "    return ok;", "}"],
        cpp: ["bool all_positive(const std::vector<int>& numbers) {", "    bool ok = false;", "    for (int x : numbers) {", "        if (x > 0) {", "            ok = true;", "        }", "    }", "    return ok;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn} return for an empty list?", options: ["True", "False", "An error"], answer: 0,
        explain: "No item fails, so the loop finishes and the function answers yes. Its sibling “Is there any?” answers no for an empty list." },
      { q: "This version has a bug. What does it return for [5, -1]?", code: "bugAny", options: ["True", "False"], answer: 0,
        explain: "ok becomes true at 5 and nothing ever sets it back, so the -1 is ignored. This code answers “is any item positive?”." },
      { q: "For [6, 0, 9, -3], how many items are checked before the answer is known?", options: ["1", "2", "3", "4"], answer: 1,
        explain: "6 passes, then 0 is not positive, so the answer is no after two checks." }
    ],

    exercise: {
      title: "Your turn: are they all even?",
      task: "Write <code>all_even(numbers)</code> that returns true if every number is even, and false otherwise. An empty list counts as all even.",
      plan: ["Visit each number", "Test it: is it odd (the failing case)?", "If it's odd, return false right away", "After the loop, return true"],
      fn: { python: "all_even", java: "allEven", rust: "all_even", c: "all_even", cpp: "all_even" },
      params: ["int[]"],
      returns: "bool",
      tests: [
        { args: [[2, 4, 6]], expect: true },
        { args: [[2, 3]], expect: false },
        { args: [[]], expect: true },
        { args: [[0, -4]], expect: true }
      ],
      solutions: {
        python: ["def all_even(numbers):", "    for x in numbers:", "        if x % 2 != 0:", "            return False", "    return True"],
        java: ["static boolean allEven(int[] numbers) {", "    for (int x : numbers) {", "        if (x % 2 != 0) {", "            return false;", "        }", "    }", "    return true;", "}"],
        rust: ["fn all_even(numbers: &[i32]) -> bool {", "    for &x in numbers {", "        if x % 2 != 0 {", "            return false;", "        }", "    }", "    true", "}"],
        c: ["bool all_even(const int numbers[], size_t n) {", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] % 2 != 0) {", "            return false;", "        }", "    }", "    return true;", "}"],
        cpp: ["#include <vector>", "", "bool all_even(const std::vector<int>& numbers) {", "    for (int x : numbers) {", "        if (x % 2 != 0) {", "            return false;", "        }", "    }", "    return true;", "}"]
      }
    },

    compare: {
      intro: "Three sibling plans on <code>[4, 8, -2, 6, 5]</code>. Amber marks where each one stops; faded items are never checked.",
      data: [4, 8, -2, 6, 5],
      rows: [
        { id: "D8", name: "Are all?", question: "Are all items positive?", stop: 2, result: "False", self: true },
        { id: "D7", name: "Is there any?", question: "Is any item negative?", stop: 2, result: "True" },
        { id: "D6", name: "Find the first", question: "Where is the first negative?", stop: 2, result: "2" }
      ],
      table: {
        head: ["Plan", "Looks for", "Stops early with", "Empty list"],
        rows: [
          ["Are all?", "the first item that fails", "false", "true"],
          ["Is there any?", "the first item that matches", "true", "false"],
          ["Find the first", "the first item that matches", "its position", "-1"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "D7", why: "the same early stop, looking for a failure instead" }],
      leadsTo: [{ id: "G1", why: "put the test in its own yes/no function" }, { id: "B1", why: "validate input before using it" }]
    }
  };
})();
