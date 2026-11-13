/* Plan data: C2 · Read until a stop value
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   The values come from a list so that every language can be tested the same
   way; in a real program each "read" would be a line of input. */

(function () {
  const STOP = -1;

  window.PLAN = {
    id: "C2",
    slug: "read-until-stop-value",
    title: "Read until a stop value",
    highlight: "stop value",
    aka: ["sentinel loop", "read–process loop", "loop until done"],
    group: "C",
    level: "Foundations",
    core: true,
    fn: { python: "sum_until_stop", java: "sumUntilStop", rust: "sum_until_stop", c: "sum_until_stop", cpp: "sum_until_stop" },

    hero: {
      type: "tiles",
      values: [5, 3, 8, -1, 99],
      colors: ["pale", "pale", "pale", "amber", "fade"],
      tagAt: 3,
      tag: "-1 = stop",
      alt: "Five cubes: 5, 3 and 8 are processed, -1 is amber as the stop value, and 99 after it is greyed out as never read"
    },
    planCard: { name: "until stop", lines: ["read the first value", "while not the stop value", "process, read the next"], foot: "→ the stop value is never processed" },

    intent: "Keep reading and processing values until a special stop value arrives, without knowing in advance how many there will be.",

    analogy: {
      icon: "🛒",
      title: "The divider at the checkout",
      text: "The cashier scans the items on the belt one by one. When the plastic divider arrives, your shopping is done: the divider is never scanned and never charged. Nobody told the cashier how many items you had."
    },

    cues: ["until the user enters …", "stop when … is typed", "enter -1 to finish", "keep reading …", "an unknown number of values"],
    cueSummary: "Values keep coming, and <b>one special value means stop</b>. The stop value itself is never processed.",
    cueExamples: [
      "Add up prices typed by the user until they type 0.",
      "Read words until the word “end”.",
      "Process sensor readings until a reading of -1 marks the end."
    ],

    steps: [
      { n: 1, title: "Read the first value", text: "Before the loop, so the loop's test has something to look at." },
      { n: 2, title: "While it isn't the stop value", text: "The test sits at the top: if the very first value is the stop value, the loop never runs." },
      { n: 3, title: "Process it", text: "Here: add it to the total." },
      { n: 4, title: "Read the next value", text: "At the end of the loop body, so it gets checked before it's processed." },
      { n: 5, title: "Use the result", text: "The stop value has been read but never processed." }
    ],

    impl: {
      python: {
        file: "sentinel.py",
        plain: { lines: [
          [0, "def sum_until_stop(values):"],
          [0, "    total = 0"],
          [1, "    i = 0"],
          [1, "    value = values[i]"],
          [2, "    while value != -1:"],
          [3, "        total += value"],
          [4, "        i += 1"],
          [4, "        value = values[i]"],
          [5, "    return total"]
        ], note: "In a real program each read is <code>int(input())</code>; here the values come from a list so they can be tested." },
        idiomatic: { lines: [
          [0, "from itertools import takewhile"],
          [0, ""],
          [0, "def sum_until_stop(values):"],
          [[1, 2, 3, 4, 5], "    return sum(takewhile(lambda v: v != -1, values))"]
        ], note: "<code>takewhile</code> hands out values until the first one that fails the test." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static int sumUntilStop(int[] values) {"],
          [0, "    int total = 0;"],
          [1, "    int i = 0;"],
          [1, "    int value = values[i];"],
          [2, "    while (value != -1) {"],
          [3, "        total += value;"],
          [4, "        i++;"],
          [4, "        value = values[i];"],
          [0, "    }"],
          [5, "    return total;"],
          [0, "}"]
        ], note: "With real input, each read would be <code>scanner.nextInt()</code>." },
        idiomatic: { lines: [
          [0, "static int sumUntilStop(int[] values) {"],
          [[1, 2, 3, 4, 5], "    return Arrays.stream(values).takeWhile(v -> v != -1).sum();"],
          [0, "}"]
        ], note: "<code>takeWhile</code> (Java 9+) stops the stream at the first value that fails the test." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn sum_until_stop(values: &[i32]) -> i32 {"],
          [0, "    let mut total = 0;"],
          [1, "    let mut i = 0;"],
          [1, "    let mut value = values[i];"],
          [2, "    while value != -1 {"],
          [3, "        total += value;"],
          [4, "        i += 1;"],
          [4, "        value = values[i];"],
          [0, "    }"],
          [5, "    total"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "fn sum_until_stop(values: &[i32]) -> i32 {"],
          [[1, 2, 3, 4, 5], "    values.iter().take_while(|&&v| v != -1).sum()"],
          [0, "}"]
        ] }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "int sum_until_stop(const int values[], size_t n) {"],
          [0, "    (void) n;  /* the stop value marks the end */"],
          [0, "    int total = 0;"],
          [1, "    size_t i = 0;"],
          [1, "    int value = values[i];"],
          [2, "    while (value != -1) {"],
          [3, "        total += value;"],
          [4, "        i++;"],
          [4, "        value = values[i];"],
          [0, "    }"],
          [5, "    return total;"],
          [0, "}"]
        ], note: "With real input, each read would be <code>scanf(\"%d\", &amp;value)</code>." },
        idiomatic: null,
        idiomaticNote: "C has no take-while; the read–test–process–read loop is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "#include <vector>"],
          [0, ""],
          [0, "int sum_until_stop(const std::vector<int>& values) {"],
          [0, "    int total = 0;"],
          [1, "    size_t i = 0;"],
          [1, "    int value = values[i];"],
          [2, "    while (value != -1) {"],
          [3, "        total += value;"],
          [4, "        i++;"],
          [4, "        value = values[i];"],
          [0, "    }"],
          [5, "    return total;"],
          [0, "}"]
        ], note: "With real input, the loop is often written <code>while (std::cin &gt;&gt; value &amp;&amp; value != -1)</code>." },
        idiomatic: null,
        idiomaticNote: "C++20 has <code>std::views::take_while</code>, but summing a view needs more set-up than the plain loop; the loop is clearer here."
      }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Add up the numbers until the stop value -1.</b> Nothing after -1 is ever read.",
      input: { kind: "list", max: 10, placeholder: "your values: 5, 3, -1" },
      presets: [
        { label: "Three values", input: [5, 3, 8, -1, 99] },
        { label: "Stop right away", input: [-1, 4] },
        { label: "One value", input: [10, -1] }
      ],
      run(raw) {
        const list = raw.includes(STOP) ? raw : raw.concat([STOP]);
        const n = list.length, ev = [], states = list.map(() => "");
        let total = 0, value = "—";
        const snap = (step, msg, cur = -1, tone = "") => ev.push({
          step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur },
          vars: [{ k: "value", role: "walker", v: value }, { k: "total", role: "gatherer", v: total }]
        });
        snap(null, raw.includes(STOP) ? "Ready. Values keep coming until -1." : "Ready. Your list had no -1, so one was added at the end.");
        let i = 0;
        value = list[i]; states[i] = "current";
        snap(1, `Read the first value: ${value}.`, i);
        for (;;) {
          if (value === STOP) {
            states[i] = "stop";
            for (let j = i + 1; j < n; j++) states[j] = "skipped";
            snap(2, `Is ${value} the stop value? Yes, so the loop ends. -1 is not added.`, i);
            break;
          }
          snap(2, `Is ${value} the stop value? No, so process it.`, i);
          total += value; states[i] = "added";
          snap(3, `Process it: total = ${total}.`, i);
          i++; value = list[i]; states[i] = "current";
          snap(4, `Read the next value: ${value}.`, i);
        }
        snap(5, `Return ${total}.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"],
      returns: "int",
      cases: [
        { args: [[5, 3, 8, -1]], expect: 16 },
        { args: [[-1]], expect: 0 },
        { args: [[10, -1, 99]], expect: 10 },
        { args: [[0, 0, -1]], expect: 0 }
      ],
      snippets: {
        bugProcessStop: [{ args: [[5, 3, -1]], expect: 7 }],
        bugReadFirst: [{ args: [[5, 3, -1]], expect: 2 }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "Processing the stop value", wide: true, code: "bugProcessStop",
        text: "If the value is processed before it is tested, the -1 gets added to the total. Every answer is off by one.",
        take: "Test first (at the top of the loop), process second." },
      { kind: "dont", title: "Reading in the wrong place",
        text: "Reading the next value <em>before</em> processing the current one skips the first value and processes the stop value instead.",
        take: "Read once before the loop, then once at the very end of the loop body." },
      { kind: "dont", title: "Forgetting to read again",
        text: "Without the read at the end of the body, the value never changes, so the loop never ends.",
        take: "Every path through the loop body must reach the next read." },
      { kind: "do", title: "Pick a stop value that can't be real data",
        text: "-1 works for amounts that are never negative. If every number is possible, use a word like “done” or an end-of-input signal instead." },
      { kind: "do", title: "Test “stop straight away”",
        text: "If the first value is the stop value, the loop body must not run at all. That's why the test sits at the top." }
    ],

    snippets: {
      bugProcessStop: {
        python: ["def sum_until_stop(values):", "    total = 0", "    i = 0", "    while True:", "        value = values[i]", "        total += value          # ✗ added before the test", "        if value == -1:", "            break", "        i += 1", "    return total"],
        java: ["static int sumUntilStop(int[] values) {", "    int total = 0;", "    int i = 0;", "    while (true) {", "        int value = values[i];", "        total += value;         // ✗ added before the test", "        if (value == -1) {", "            break;", "        }", "        i++;", "    }", "    return total;", "}"],
        rust: ["fn sum_until_stop(values: &[i32]) -> i32 {", "    let mut total = 0;", "    let mut i = 0;", "    loop {", "        let value = values[i];", "        total += value;         // ✗ added before the test", "        if value == -1 {", "            break;", "        }", "        i += 1;", "    }", "    total", "}"],
        c: ["int sum_until_stop(const int values[], size_t n) {", "    (void) n;", "    int total = 0;", "    size_t i = 0;", "    while (1) {", "        int value = values[i];", "        total += value;         // ✗ added before the test", "        if (value == -1) {", "            break;", "        }", "        i++;", "    }", "    return total;", "}"],
        cpp: ["int sum_until_stop(const std::vector<int>& values) {", "    int total = 0;", "    size_t i = 0;", "    while (true) {", "        int value = values[i];", "        total += value;         // ✗ added before the test", "        if (value == -1) {", "            break;", "        }", "        i++;", "    }", "    return total;", "}"]
      },
      bugReadFirst: {
        python: ["def sum_until_stop(values):", "    total = 0", "    i = 0", "    value = values[i]", "    while value != -1:", "        i += 1", "        value = values[i]", "        total += value", "    return total"],
        java: ["static int sumUntilStop(int[] values) {", "    int total = 0;", "    int i = 0;", "    int value = values[i];", "    while (value != -1) {", "        i++;", "        value = values[i];", "        total += value;", "    }", "    return total;", "}"],
        rust: ["fn sum_until_stop(values: &[i32]) -> i32 {", "    let mut total = 0;", "    let mut i = 0;", "    let mut value = values[i];", "    while value != -1 {", "        i += 1;", "        value = values[i];", "        total += value;", "    }", "    total", "}"],
        c: ["int sum_until_stop(const int values[], size_t n) {", "    (void) n;", "    int total = 0;", "    size_t i = 0;", "    int value = values[i];", "    while (value != -1) {", "        i++;", "        value = values[i];", "        total += value;", "    }", "    return total;", "}"],
        cpp: ["int sum_until_stop(const std::vector<int>& values) {", "    int total = 0;", "    size_t i = 0;", "    int value = values[i];", "    while (value != -1) {", "        i++;", "        value = values[i];", "        total += value;", "    }", "    return total;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([4, 4, -1, 4]) return?", options: ["8", "7", "11", "12"], answer: 0,
        explain: "4 + 4 = 8. The -1 stops the loop and is not added; the 4 after it is never read." },
      { q: "This version has a bug. What does it return for [5, 3, -1]?", code: "bugReadFirst", options: ["8", "7", "2"], answer: 2,
        explain: "It reads the next value before adding, so it skips the 5 and adds 3 and then the -1: 3 + (-1) = 2." },
      { q: "If the very first value is -1, how many times does the loop body run?", options: ["0", "1"], answer: 0,
        explain: "The test is at the top of the loop, so it fails straight away and the body never runs. The total stays 0." }
    ],

    exercise: {
      title: "Your turn: count until the stop value",
      task: "Write <code>count_until_stop(values)</code> that returns how many values come before the first -1.",
      plan: ["Read the first value", "While it isn't -1", "Count it", "Read the next value", "Return the count"],
      fn: { python: "count_until_stop", java: "countUntilStop", rust: "count_until_stop", c: "count_until_stop", cpp: "count_until_stop" },
      params: ["int[]"],
      returns: "int",
      tests: [
        { args: [[4, 4, -1]], expect: 2 },
        { args: [[-1]], expect: 0 },
        { args: [[7, -1, 7]], expect: 1 },
        { args: [[0, -1]], expect: 1 }
      ],
      solutions: {
        python: ["def count_until_stop(values):", "    count = 0", "    i = 0", "    value = values[i]", "    while value != -1:", "        count += 1", "        i += 1", "        value = values[i]", "    return count"],
        java: ["static int countUntilStop(int[] values) {", "    int count = 0;", "    int i = 0;", "    int value = values[i];", "    while (value != -1) {", "        count++;", "        i++;", "        value = values[i];", "    }", "    return count;", "}"],
        rust: ["fn count_until_stop(values: &[i32]) -> i32 {", "    let mut count = 0;", "    let mut i = 0;", "    let mut value = values[i];", "    while value != -1 {", "        count += 1;", "        i += 1;", "        value = values[i];", "    }", "    count", "}"],
        c: ["int count_until_stop(const int values[], size_t n) {", "    (void) n;", "    int count = 0;", "    size_t i = 0;", "    int value = values[i];", "    while (value != -1) {", "        count++;", "        i++;", "        value = values[i];", "    }", "    return count;", "}"],
        cpp: ["#include <vector>", "", "int count_until_stop(const std::vector<int>& values) {", "    int count = 0;", "    size_t i = 0;", "    int value = values[i];", "    while (value != -1) {", "        count++;", "        i++;", "        value = values[i];", "    }", "    return count;", "}"]
      }
    },

    compare: {
      intro: "Three loop-control plans. The difference is <b>what tells the loop to stop</b>.",
      rows: [
        { id: "C2", name: "Read until a stop value", question: "Add numbers until -1", shape: "read first; while not the stop value: process, read next", result: "unknown count", self: true },
        { id: "C1", name: "Repeat n times", question: "Add interest for 3 years", shape: "for i in 0..n", result: "exactly n rounds" },
        { id: "C3", name: "Ask again until valid", question: "Ask for a number between 1 and 10", shape: "read; while invalid: complain, read again", result: "one valid value" }
      ],
      table: {
        head: ["Plan", "Stops when", "Processes the last value read?", "Typical use"],
        rows: [
          ["Read until a stop value", "the stop value is read", "no", "summing or counting input"],
          ["Repeat n times", "the counter reaches n", "—", "a known number of rounds"],
          ["Ask again until valid", "a valid value is read", "yes, it's the answer", "checking user input"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "D2", why: "the running total inside the loop" }],
      leadsTo: [{ id: "C3", why: "the same shape, used to re-ask for invalid input" }, { id: "C5", why: "a menu that loops until the user chooses “quit”" }]
    }
  };
})();
