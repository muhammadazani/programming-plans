/* Plan data: C3 · Ask again until valid
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   The "user's attempts" come from a list so every language can be tested the
   same way; in a real program each read is a line of input. */

(function () {
  const LOW = 1, HIGH = 10;

  window.PLAN = {
    id: "C3",
    slug: "ask-again-until-valid",
    title: "Ask again until valid",
    highlight: "until valid",
    aka: ["input validation loop", "re-prompt", "validate and retry"],
    group: "C",
    level: "Foundations",
    core: false,
    fn: { python: "first_valid", java: "firstValid", rust: "first_valid", c: "first_valid", cpp: "first_valid" },

    hero: { type: "tiles", values: [0, 15, 7, 3], colors: ["pale", "pale", "amber", "fade"], highlight: 2, tag: "7 is in 1–10", alt: "Four attempts: 0 and 15 are rejected, 7 is amber as the first valid one, and 3 is never asked for" },
    planCard: { name: "until valid", lines: ["read a value", "while it's invalid", "explain, read again"], foot: "→ use the valid value" },

    intent: "Keep asking for a value until it meets the rules, then carry on with that valid value.",

    analogy: { icon: "🔐", title: "Entering a PIN", text: "The cash machine asks for your PIN. If it's wrong, it tells you so and asks again. It only moves on to the menu once you've typed a valid one. The number of tries isn't known in advance." },

    cues: ["must be between … and …", "ask again", "until the user enters a valid …", "reject invalid input", "re-enter"],
    cueSummary: "You need <b>one valid value</b>, and the user may get it wrong any number of times first.",
    cueExamples: ["Ask for a number from 1 to 10 until the user enters one.", "Ask for a password until it has at least 8 characters.", "Ask for a menu choice until it's one of the options."],

    steps: [
      { n: 1, title: "Read a value", text: "Before the loop, so the test has something to check." },
      { n: 2, title: "While it's invalid", text: "Here: smaller than 1 or bigger than 10. The loop runs only for bad input." },
      { n: 3, title: "Explain, then read again", text: "A real program says what's wrong (“Enter 1 to 10”), then reads the next attempt." },
      { n: 4, title: "Use the valid value", text: "Once the loop ends, the value is guaranteed to be valid." }
    ],

    impl: {
      python: { file: "ask.py",
        plain: { lines: [[0, "def first_valid(attempts, low, high):"], [1, "    i = 0"], [1, "    value = attempts[i]"], [2, "    while value < low or value > high:"], [3, "        # a real program prints why, e.g. \"Enter 1 to 10\""], [3, "        i += 1"], [3, "        value = attempts[i]"], [4, "    return value"]], note: "In a real program each read is <code>int(input(\"Number (1-10): \"))</code>." },
        idiomatic: { lines: [[0, "def first_valid(attempts, low, high):"], [[1, 2, 3, 4], "    return next(v for v in attempts if low <= v <= high)"]], note: "Python allows chained comparisons: <code>low &lt;= v &lt;= high</code>." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int firstValid(int[] attempts, int low, int high) {"], [1, "    int i = 0;"], [1, "    int value = attempts[i];"], [2, "    while (value < low || value > high) {"], [3, "        // a real program prints why, e.g. \"Enter 1 to 10\""], [3, "        i++;"], [3, "        value = attempts[i];"], [0, "    }"], [4, "    return value;"], [0, "}"]] },
        idiomatic: { lines: [[0, "static int firstValid(int[] attempts, int low, int high) {"], [[1, 2, 3, 4], "    return Arrays.stream(attempts).filter(v -> v >= low && v <= high).findFirst().getAsInt();"], [0, "}"]] } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn first_valid(attempts: &[i32], low: i32, high: i32) -> i32 {"], [1, "    let mut i = 0;"], [1, "    let mut value = attempts[i];"], [2, "    while value < low || value > high {"], [3, "        // a real program prints why, e.g. \"Enter 1 to 10\""], [3, "        i += 1;"], [3, "        value = attempts[i];"], [0, "    }"], [4, "    value"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn first_valid(attempts: &[i32], low: i32, high: i32) -> i32 {"], [[1, 2, 3, 4], "    *attempts.iter().find(|&&v| (low..=high).contains(&v)).unwrap()"], [0, "}"]], note: "<code>(low..=high).contains(&v)</code> reads like the rule." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "int first_valid(const int attempts[], size_t n, int low, int high) {"], [0, "    (void) n;  /* a valid attempt is assumed to exist */"], [1, "    size_t i = 0;"], [1, "    int value = attempts[i];"], [2, "    while (value < low || value > high) {"], [3, "        /* a real program prints why, e.g. \"Enter 1 to 10\" */"], [3, "        i++;"], [3, "        value = attempts[i];"], [0, "    }"], [4, "    return value;"], [0, "}"]], note: "With real input: <code>scanf(\"%d\", &amp;value)</code>, and check its return value too, in case the user types letters." },
        idiomatic: null, idiomaticNote: "The read–test–read-again loop is the idiomatic C shape." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "int first_valid(const std::vector<int>& attempts, int low, int high) {"], [1, "    size_t i = 0;"], [1, "    int value = attempts[i];"], [2, "    while (value < low || value > high) {"], [3, "        // a real program prints why, e.g. \"Enter 1 to 10\""], [3, "        i++;"], [3, "        value = attempts[i];"], [0, "    }"], [4, "    return value;"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <algorithm>"], [0, "#include <vector>"], [0, ""], [0, "int first_valid(const std::vector<int>& attempts, int low, int high) {"], [[1, 2, 3, 4], "    return *std::ranges::find_if(attempts, [&](int v) { return v >= low && v <= high; });"], [0, "}"]] } }
    },

    trace: {
      type: "tiles",
      intro: `Running example: <b>Ask for a number from ${LOW} to ${HIGH}.</b> Each tile is one attempt by the user.`,
      input: { kind: "list", max: 8, placeholder: "attempts: 0, 15, 7" },
      presets: [{ label: "Two bad tries", input: [0, 15, 7, 3] }, { label: "Right first time", input: [5] }, { label: "Edge values", input: [-2, 11, 10] }],
      run(raw) {
        const ok = (v) => v >= LOW && v <= HIGH;
        const list = raw.some(ok) ? raw : raw.concat([5]);
        const ev = [], states = list.map(() => "");
        let value = "—", fails = 0;
        const snap = (step, msg, cur = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur },
          vars: [{ k: "value", role: "walker", v: value }, { k: "rejected", role: "count", v: fails }] });
        snap(null, raw.some(ok) ? `Ready. Valid answers are ${LOW} to ${HIGH}.` : "None of your attempts was valid, so a 5 was added at the end.");
        let i = 0; value = list[0]; states[0] = "current";
        snap(1, `Read the first attempt: ${value}.`, 0);
        while (!ok(value)) {
          states[i] = "miss"; fails++;
          snap(2, `Is ${value} outside ${LOW}–${HIGH}? Yes, it's invalid.`, i);
          i++; value = list[i]; states[i] = "current";
          snap(3, `Say “Enter ${LOW} to ${HIGH}” and read again: ${value}.`, i);
        }
        states[i] = "hit"; for (let j = i + 1; j < list.length; j++) states[j] = "skipped";
        snap(2, `Is ${value} outside ${LOW}–${HIGH}? No, it's valid. The loop ends.`, i);
        snap(4, `Use ${value}.${fails ? ` It took ${fails + 1} attempts.` : ""}`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]", "int", "int"], returns: "int",
      cases: [{ args: [[0, 15, 7, 3], 1, 10], expect: 7 }, { args: [[5], 1, 10], expect: 5 }, { args: [[-2, 11, 10], 1, 10], expect: 10 }, { args: [[1], 1, 10], expect: 1 }],
      snippets: { bugAnd: [{ args: [[0, 15, 7], 1, 10], expect: 0 }], bugIf: [{ args: [[0, 15, 7], 1, 10], expect: 15 }] }
    },

    pitfalls: [
      { kind: "dont", title: "and instead of or", wide: true, code: "bugAnd", text: "A value can't be smaller than 1 <em>and</em> bigger than 10 at the same time, so <code>value &lt; low and value &gt; high</code> is never true. Every value is accepted, including 0.", take: "Invalid means too small <b>or</b> too big." },
      { kind: "dont", title: "if instead of while", text: "An <code>if</code> asks again only once. If the second attempt is also wrong, the program carries on with it anyway.", take: "Keep asking while the value is invalid." },
      { kind: "dont", title: "Not telling the user what's wrong", text: "Silently asking again leaves people guessing what the rule is.", take: "Say the rule each time: “Enter a number from 1 to 10”." },
      { kind: "do", title: "Test both edges", text: "1 and 10 must be accepted; 0 and 11 must be rejected." },
      { kind: "do", title: "Validate the type too, in real programs", text: "Users type letters. Python's <code>int()</code> raises <code>ValueError</code>, and C's <code>scanf</code> returns 0; handle that inside the same loop." }
    ],

    snippets: {
      bugAnd: {
        python: ["def first_valid(attempts, low, high):", "    i = 0", "    value = attempts[i]", "    while value < low and value > high:   # ✗ never true", "        i += 1", "        value = attempts[i]", "    return value"],
        java: ["static int firstValid(int[] attempts, int low, int high) {", "    int i = 0;", "    int value = attempts[i];", "    while (value < low && value > high) {   // ✗ never true", "        i++;", "        value = attempts[i];", "    }", "    return value;", "}"],
        rust: ["fn first_valid(attempts: &[i32], low: i32, high: i32) -> i32 {", "    let mut i = 0;", "    let mut value = attempts[i];", "    while value < low && value > high {     // ✗ never true", "        i += 1;", "        value = attempts[i];", "    }", "    value", "}"],
        c: ["int first_valid(const int attempts[], size_t n, int low, int high) {", "    (void) n;", "    size_t i = 0;", "    int value = attempts[i];", "    while (value < low && value > high) {   // ✗ never true", "        i++;", "        value = attempts[i];", "    }", "    return value;", "}"],
        cpp: ["int first_valid(const std::vector<int>& attempts, int low, int high) {", "    size_t i = 0;", "    int value = attempts[i];", "    while (value < low && value > high) {   // ✗ never true", "        i++;", "        value = attempts[i];", "    }", "    return value;", "}"]
      },
      bugIf: {
        python: ["def first_valid(attempts, low, high):", "    i = 0", "    value = attempts[i]", "    if value < low or value > high:", "        i += 1", "        value = attempts[i]", "    return value"],
        java: ["static int firstValid(int[] attempts, int low, int high) {", "    int i = 0;", "    int value = attempts[i];", "    if (value < low || value > high) {", "        i++;", "        value = attempts[i];", "    }", "    return value;", "}"],
        rust: ["fn first_valid(attempts: &[i32], low: i32, high: i32) -> i32 {", "    let mut i = 0;", "    let mut value = attempts[i];", "    if value < low || value > high {", "        i += 1;", "        value = attempts[i];", "    }", "    value", "}"],
        c: ["int first_valid(const int attempts[], size_t n, int low, int high) {", "    (void) n;", "    size_t i = 0;", "    int value = attempts[i];", "    if (value < low || value > high) {", "        i++;", "        value = attempts[i];", "    }", "    return value;", "}"],
        cpp: ["int first_valid(const std::vector<int>& attempts, int low, int high) {", "    size_t i = 0;", "    int value = attempts[i];", "    if (value < low || value > high) {", "        i++;", "        value = attempts[i];", "    }", "    return value;", "}"]
      }
    },

    quiz: [
      { q: "For attempts [12, 0, 4, 9] and the range 1–10, what does {fn} return?", options: ["12", "4", "9"], answer: 1, explain: "12 and 0 are rejected; 4 is the first value inside 1–10, so the loop stops there." },
      { q: "This version has a bug. What does it return for attempts [0, 15, 7]?", code: "bugIf", options: ["7", "15", "0"], answer: 1, explain: "The if asks again only once. The second attempt, 15, is also invalid, but it's returned anyway." },
      { q: "If the first attempt is valid, how many times does the loop body run?", options: ["0", "1"], answer: 0, explain: "The test fails straight away, so the body never runs and the first value is used." }
    ],

    exercise: {
      title: "Your turn: count the attempts",
      task: "Write <code>count_attempts(attempts, low, high)</code> that returns how many attempts it took to get a valid value, counting the valid one.",
      plan: ["Read the first attempt and count it", "While it's invalid", "Read the next attempt and count it", "Return the count"],
      fn: { python: "count_attempts", java: "countAttempts", rust: "count_attempts", c: "count_attempts", cpp: "count_attempts" },
      params: ["int[]", "int", "int"], returns: "int",
      tests: [{ args: [[0, 15, 7], 1, 10], expect: 3 }, { args: [[4], 1, 10], expect: 1 }, { args: [[11, 10], 1, 10], expect: 2 }],
      solutions: {
        python: ["def count_attempts(attempts, low, high):", "    i = 0", "    count = 1", "    value = attempts[i]", "    while value < low or value > high:", "        i += 1", "        count += 1", "        value = attempts[i]", "    return count"],
        java: ["static int countAttempts(int[] attempts, int low, int high) {", "    int i = 0;", "    int count = 1;", "    int value = attempts[i];", "    while (value < low || value > high) {", "        i++;", "        count++;", "        value = attempts[i];", "    }", "    return count;", "}"],
        rust: ["fn count_attempts(attempts: &[i32], low: i32, high: i32) -> i32 {", "    let mut i = 0;", "    let mut count = 1;", "    let mut value = attempts[i];", "    while value < low || value > high {", "        i += 1;", "        count += 1;", "        value = attempts[i];", "    }", "    count", "}"],
        c: ["int count_attempts(const int attempts[], size_t n, int low, int high) {", "    (void) n;", "    size_t i = 0;", "    int count = 1;", "    int value = attempts[i];", "    while (value < low || value > high) {", "        i++;", "        count++;", "        value = attempts[i];", "    }", "    return count;", "}"],
        cpp: ["#include <vector>", "", "int count_attempts(const std::vector<int>& attempts, int low, int high) {", "    size_t i = 0;", "    int count = 1;", "    int value = attempts[i];", "    while (value < low || value > high) {", "        i++;", "        count++;", "        value = attempts[i];", "    }", "    return count;", "}"]
      }
    },

    compare: {
      intro: "Three input loops with the same read–test–read shape. What ends the loop is different.",
      rows: [
        { id: "C3", name: "Ask again until valid", question: "A number from 1 to 10", shape: "while the value is invalid: explain, read again", result: "the valid value", self: true },
        { id: "C2", name: "Read until a stop value", question: "Add numbers until -1", shape: "while not the stop value: process, read next", result: "a total of many values" },
        { id: "C5", name: "Menu loop", question: "1) deposit 2) withdraw 0) quit", shape: "while not quit: act on the choice, read the next", result: "the state after quitting" }
      ],
      table: { head: ["Plan", "Loop runs while", "Last value read is", "Processes many values?"], rows: [["Ask again until valid", "the input is invalid", "the answer", "no, just one"], ["Read until a stop value", "the input isn't the stop value", "the stop value (ignored)", "yes"], ["Menu loop", "the choice isn't quit", "quit", "yes, one command each"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "C2", why: "the same read–test–read-again loop" }, { id: "B1", why: "the validity test is a guard" }],
      leadsTo: [{ id: "C5", why: "a menu validates and acts on each choice" }]
    }
  };
})();
