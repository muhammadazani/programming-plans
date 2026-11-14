/* Plan data: D16 · Peel off digits
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "D16",
    slug: "peel-off-digits",
    title: "Peel off digits",
    highlight: "digits",
    aka: ["digit loop", "% 10 and ÷ 10", "number decomposition"],
    group: "D",
    level: "Core",
    core: false,
    fn: { python: "digit_sum", java: "digitSum", rust: "digit_sum", c: "digit_sum", cpp: "digit_sum" },

    hero: { type: "tiles", values: [3, 7, 2, 5], colors: ["blue", "blue", "pale", "amber"], tagAt: 3, tag: "3725 % 10 = 5", alt: "The digits 3, 7, 2, 5; the last digit, 5, is amber as the one being peeled off" },
    planCard: { name: "digits", lines: ["n = abs(n), total = 0", "last digit: n % 10", "drop it: n // 10"], foot: "↻ while n > 0" },

    intent: "Take a whole number apart one digit at a time, from the right: % 10 gives the last digit, and integer division by 10 drops it.",

    analogy: { icon: "🧅", title: "Peeling an onion", text: "You take off the outer layer, look at it, and throw it away; the onion is now one layer smaller. You keep going until there's nothing left. % 10 is looking at the outer layer; ÷ 10 is throwing it away." },

    cues: ["each digit of …", "sum of the digits", "how many digits", "reverse the number", "the last digit"],
    cueSummary: "The input is <b>a whole number</b>, and the question is about its <b>digits</b>.",
    cueExamples: ["What is the sum of the digits of 3725?", "How many digits does a number have?", "Reverse the digits of 1234 to get 4321."],

    steps: [
      { n: 1, title: "Set up: drop the sign, start the total at 0", text: "Work with abs(n), so -45 has the digits 4 and 5." },
      { n: 2, title: "While there are digits left", text: "n > 0. When the last digit has been dropped, n becomes 0." },
      { n: 3, title: "Take the last digit and use it", text: "n % 10 is the remainder after dividing by 10: the rightmost digit." },
      { n: 4, title: "Drop that digit", text: "n // 10 (integer division) removes the rightmost digit." },
      { n: 5, title: "Return the result", text: "Here the sum of the digits." }
    ],

    impl: {
      python: { file: "digits.py",
        plain: { lines: [[0, "def digit_sum(n):"], [1, "    n = abs(n)"], [1, "    total = 0"], [2, "    while n > 0:"], [3, "        total += n % 10"], [4, "        n = n // 10"], [5, "    return total"]], note: "<code>//</code> is essential: <code>n / 10</code> gives a fraction in Python 3, and the loop would go wrong." },
        idiomatic: { lines: [[0, "def digit_sum(n):"], [[1, 2, 3, 4, 5], "    return sum(int(d) for d in str(abs(n)))"]], note: "Turning the number into text and reading its characters is shorter, but it hides the arithmetic." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int digitSum(int n) {"], [1, "    n = Math.abs(n);"], [1, "    int total = 0;"], [2, "    while (n > 0) {"], [3, "        total += n % 10;"], [4, "        n = n / 10;"], [0, "    }"], [5, "    return total;"], [0, "}"]] },
        idiomatic: { lines: [[0, "static int digitSum(int n) {"], [[1, 2, 3, 4, 5], "    return String.valueOf(Math.abs(n)).chars().map(c -> c - '0').sum();"], [0, "}"]], note: "<code>c - '0'</code> turns the character '7' into the number 7." } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn digit_sum(n: i32) -> i32 {"], [1, "    let mut n = n.abs();"], [1, "    let mut total = 0;"], [2, "    while n > 0 {"], [3, "        total += n % 10;"], [4, "        n /= 10;"], [0, "    }"], [5, "    total"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn digit_sum(n: i32) -> i32 {"], [[1, 2, 3, 4, 5], "    n.abs().to_string().chars().map(|c| c.to_digit(10).unwrap() as i32).sum()"], [0, "}"]] } },
      c: { file: "plans.c",
        plain: { lines: [[0, "#include <stdlib.h>"], [0, ""], [0, "int digit_sum(int n) {"], [1, "    n = abs(n);"], [1, "    int total = 0;"], [2, "    while (n > 0) {"], [3, "        total += n % 10;"], [4, "        n = n / 10;"], [0, "    }"], [5, "    return total;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "The % 10 / ÷ 10 loop is the idiomatic C." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <cstdlib>"], [0, ""], [0, "int digit_sum(int n) {"], [1, "    n = std::abs(n);"], [1, "    int total = 0;"], [2, "    while (n > 0) {"], [3, "        total += n % 10;"], [4, "        n = n / 10;"], [0, "    }"], [5, "    return total;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "The % 10 / ÷ 10 loop is the idiomatic C++." }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>What is the sum of the digits of a number?</b> The digits are peeled off from the right.",
      input: { kind: "fields", fields: [{ name: "n", label: "n", min: -999999, max: 9999999 }] },
      presets: [{ label: "3725", input: { n: 3725 } }, { label: "-45", input: { n: -45 } }, { label: "0", input: { n: 0 } }],
      run({ n: start }) {
        let n = Math.abs(start);
        const digits = String(n).split("").map(Number);
        const ev = [], states = digits.map(() => "");
        let total = 0, peeled = 0;
        const snap = (step, msg, cur = -1, tone = "", digit = "—") => ev.push({ step, msg, tone,
          view: { values: digits, states: states.slice(), ptr: cur, noIdx: true },
          vars: [{ k: "n", role: "temp", v: n }, { k: "digit", role: "walker", v: digit }, { k: "total", role: "gatherer", v: total }] });
        snap(null, `Ready. Sum the digits of ${start}.`);
        snap(1, start < 0 ? `Drop the sign: n = ${n}. total = 0.` : `n = ${n}, total = 0.`);
        while (n > 0) {
          const pos = digits.length - 1 - peeled;
          snap(2, `Is n (${n}) > 0? Yes, there are digits left.`, pos);
          const d = n % 10; total += d; states[pos] = "hit";
          snap(3, `Last digit: ${n} % 10 = ${d}. total = ${total}.`, pos, "", d);
          n = Math.floor(n / 10); states[pos] = "skipped"; peeled++;
          snap(4, `Drop it: n // 10 = ${n}.`, pos, "", d);
        }
        snap(2, start === 0 ? "Is n (0) > 0? No: 0 has no digits to add, so the loop never runs." : "Is n (0) > 0? No, every digit has been peeled off.");
        snap(5, `Return ${total}.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int"], returns: "int",
      cases: [{ args: [123], expect: 6 }, { args: [0], expect: 0 }, { args: [7], expect: 7 }, { args: [-45], expect: 9 }, { args: [1000], expect: 1 }],
      snippets: { bugOrder: [{ args: [123], expect: 3 }], bugNoAbs: [{ args: [-45], expect: 0 }, { args: [45], expect: 9 }] }
    },

    pitfalls: [
      { kind: "dont", title: "Dropping the digit before using it", wide: true, code: "bugOrder", text: "If <code>n = n // 10</code> comes first, the last digit is thrown away unseen, and an extra 0 is added at the end: 123 gives 2 + 1 + 0 = 3.", take: "Use the digit (n % 10) first, then drop it (n // 10)." },
      { kind: "dont", title: "Forgetting negative numbers", text: "For -45, <code>while n &gt; 0</code> never runs, so the sum is 0. (And % on negatives differs between Python and the other languages.)", take: "Take abs(n) first." },
      { kind: "dont", title: "Using / in Python", text: "<code>n / 10</code> gives 12.3, not 12. The loop then runs hundreds of times on ever-smaller fractions.", take: "Use // for integer division in Python." },
      { kind: "do", title: "Watch the number 0", text: "0 has one digit, but the loop never runs for it. For a digit sum that's fine (0); for “how many digits” it needs a special case." },
      { kind: "do", title: "Build numbers the other way", text: "result = result × 10 + digit adds a digit on the right. Combined with peeling, that reverses a number: 1234 → 4321." }
    ],

    snippets: {
      bugOrder: {
        python: ["def digit_sum(n):", "    n = abs(n)", "    total = 0", "    while n > 0:", "        n = n // 10          # ✗ dropped before it's used", "        total += n % 10", "    return total"],
        java: ["static int digitSum(int n) {", "    n = Math.abs(n);", "    int total = 0;", "    while (n > 0) {", "        n = n / 10;          // ✗ dropped before it's used", "        total += n % 10;", "    }", "    return total;", "}"],
        rust: ["fn digit_sum(n: i32) -> i32 {", "    let mut n = n.abs();", "    let mut total = 0;", "    while n > 0 {", "        n /= 10;             // ✗ dropped before it's used", "        total += n % 10;", "    }", "    total", "}"],
        c: ["int digit_sum(int n) {", "    n = abs(n);", "    int total = 0;", "    while (n > 0) {", "        n = n / 10;          // ✗ dropped before it's used", "        total += n % 10;", "    }", "    return total;", "}"],
        cpp: ["int digit_sum(int n) {", "    n = std::abs(n);", "    int total = 0;", "    while (n > 0) {", "        n = n / 10;          // ✗ dropped before it's used", "        total += n % 10;", "    }", "    return total;", "}"]
      },
      bugNoAbs: {
        python: ["def digit_sum(n):", "    total = 0", "    while n > 0:", "        total += n % 10", "        n = n // 10", "    return total"],
        java: ["static int digitSum(int n) {", "    int total = 0;", "    while (n > 0) {", "        total += n % 10;", "        n = n / 10;", "    }", "    return total;", "}"],
        rust: ["fn digit_sum(n: i32) -> i32 {", "    let mut n = n;", "    let mut total = 0;", "    while n > 0 {", "        total += n % 10;", "        n /= 10;", "    }", "    total", "}"],
        c: ["int digit_sum(int n) {", "    int total = 0;", "    while (n > 0) {", "        total += n % 10;", "        n = n / 10;", "    }", "    return total;", "}"],
        cpp: ["int digit_sum(int n) {", "    int total = 0;", "    while (n > 0) {", "        total += n % 10;", "        n = n / 10;", "    }", "    return total;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(9081) return?", options: ["18", "9081", "17"], answer: 0, explain: "9 + 0 + 8 + 1 = 18. The digits are peeled off as 1, 8, 0, 9." },
      { q: "What is 3725 // 10?", options: ["372", "372.5", "5"], answer: 0, explain: "Integer division by 10 drops the last digit. (3725 % 10 would give that digit, 5.)" },
      { q: "This version has a bug. What does it return for 123?", code: "bugOrder", options: ["6", "3", "5"], answer: 1, explain: "It drops each digit before adding: it adds the digits of 12, 1 and 0, which are 2, 1 and 0. The 3 is never added." }
    ],

    exercise: {
      title: "Your turn: count the digits",
      task: "Write <code>count_digits(n)</code> that returns how many digits a whole number has. 0 has one digit, and the sign doesn't count.",
      plan: ["Drop the sign; 0 is a special case with one digit", "While there are digits left", "Count one digit", "Drop it with integer division, then return the count"],
      fn: { python: "count_digits", java: "countDigits", rust: "count_digits", c: "count_digits", cpp: "count_digits" },
      params: ["int"], returns: "int",
      tests: [{ args: [123], expect: 3 }, { args: [0], expect: 1 }, { args: [-7], expect: 1 }, { args: [1000], expect: 4 }],
      solutions: {
        python: ["def count_digits(n):", "    n = abs(n)", "    if n == 0:", "        return 1", "    count = 0", "    while n > 0:", "        count += 1", "        n = n // 10", "    return count"],
        java: ["static int countDigits(int n) {", "    n = Math.abs(n);", "    if (n == 0) return 1;", "    int count = 0;", "    while (n > 0) {", "        count++;", "        n = n / 10;", "    }", "    return count;", "}"],
        rust: ["fn count_digits(n: i32) -> i32 {", "    let mut n = n.abs();", "    if n == 0 { return 1; }", "    let mut count = 0;", "    while n > 0 {", "        count += 1;", "        n /= 10;", "    }", "    count", "}"],
        c: ["#include <stdlib.h>", "", "int count_digits(int n) {", "    n = abs(n);", "    if (n == 0) return 1;", "    int count = 0;", "    while (n > 0) {", "        count++;", "        n = n / 10;", "    }", "    return count;", "}"],
        cpp: ["#include <cstdlib>", "", "int count_digits(int n) {", "    n = std::abs(n);", "    if (n == 0) return 1;", "    int count = 0;", "    while (n > 0) {", "        count++;", "        n = n / 10;", "    }", "    return count;", "}"]
      }
    },

    compare: {
      intro: "Two plans built on // and %.",
      rows: [
        { id: "D16", name: "Peel off digits", question: "Sum of the digits of 3725", shape: "loop: % 10 for the last digit, // 10 to drop it", result: "one step per digit", self: true },
        { id: "A3", name: "Split with div and mod", question: "3725 s in h, min, s", shape: "a fixed number of // and % steps", result: "a few parts" },
        { id: "C4", name: "Repeat until a target", question: "How many halvings until 1?", shape: "while not done: one step, count it", result: "a count" }
      ],
      table: { head: ["Plan", "Loop?", "Divides by", "Ends when"], rows: [["Peel off digits", "yes", "10", "n reaches 0"], ["Split with div and mod", "no", "the unit sizes", "—"], ["Repeat until a target", "yes", "anything", "the goal is reached"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "A3", why: "the same // and % pair, used once" }, { id: "C4", why: "loop until the number reaches 0" }],
      leadsTo: [{ id: "G3", why: "a digit sum written recursively" }]
    }
  };
})();
