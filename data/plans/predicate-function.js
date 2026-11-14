/* Plan data: G1 · Predicate function
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "G1",
    slug: "predicate-function",
    title: "Predicate function",
    highlight: "Predicate",
    aka: ["yes/no function", "boolean function", "is_… / has_… function"],
    group: "G",
    level: "Advanced",
    core: false,
    fn: { python: "is_prime", java: "isPrime", rust: "is_prime", c: "is_prime", cpp: "is_prime" },

    hero: { type: "tiles", values: [2, 3, 4, 5, 6], colors: ["pale", "pale", "pale", "pale", "pale"], tagAt: 2, tag: "is_prime(n)?", alt: "A row of candidate divisors tested by a yes/no function" },
    planCard: { name: "predicate", lines: ["name the test: is_…(x)", "easy cases first", "return true or false"], foot: "→ reuse it anywhere" },

    intent: "Give a yes/no test a name by putting it in its own function that returns true or false, so it can be read, tested and reused in other plans.",

    analogy: { icon: "🔌", title: "A plug-in tester", text: "An electrician doesn't rebuild a voltage tester for every socket: they have one tester and press it against each socket in turn. A predicate function is that tester. Counting, filtering or searching plans just “press” it against each item." },

    cues: ["is it a …?", "check whether …", "valid / allowed / eligible", "the same test in several places", "a rule with several parts"],
    cueSummary: "A <b>yes/no question</b> about one value is needed, often in more than one place.",
    cueExamples: ["Is a number prime? (Then count the primes up to 100.)", "Is a year a leap year?", "Is a password strong enough?"],

    steps: [
      { n: 1, title: "Name the test", text: "A function called is_… or has_… that takes the value and returns true or false." },
      { n: 2, title: "Handle the easy cases first", text: "Here: numbers below 2 are not prime." },
      { n: 3, title: "Check what decides it", text: "Here: try each possible divisor d while d × d ≤ n." },
      { n: 4, title: "Fails? Return false", text: "A divisor means n is not prime; there's no need to look further." },
      { n: 5, title: "Passed everything? Return true", text: "No divisor was found." }
    ],

    impl: {
      python: { file: "prime.py",
        plain: { lines: [[1, "def is_prime(n):"], [2, "    if n < 2:"], [2, "        return False"], [3, "    d = 2"], [3, "    while d * d <= n:"], [4, "        if n % d == 0:"], [4, "            return False"], [3, "        d += 1"], [5, "    return True"], [0, ""], [0, "# reused by another plan (Counting, D1):"], [0, "def count_primes(limit):"], [0, "    return sum(1 for n in range(limit + 1) if is_prime(n))"]], note: "Once the test has a name, other plans read like sentences: “count the n that are prime”." },
        idiomatic: { lines: [[0, "from math import isqrt"], [0, ""], [1, "def is_prime(n):"], [[2, 3, 4, 5], "    return n >= 2 and all(n % d != 0 for d in range(2, isqrt(n) + 1))"]], note: "<code>all()</code> is the Are all? plan (D8): every possible divisor must fail to divide n." } },
      java: { file: "Plans.java",
        plain: { lines: [[1, "static boolean isPrime(int n) {"], [2, "    if (n < 2) {"], [2, "        return false;"], [0, "    }"], [3, "    for (int d = 2; d * d <= n; d++) {"], [4, "        if (n % d == 0) {"], [4, "            return false;"], [0, "        }"], [0, "    }"], [5, "    return true;"], [0, "}"]] },
        idiomatic: { lines: [[1, "static boolean isPrime(int n) {"], [[2, 3, 4, 5], "    return n >= 2 && IntStream.rangeClosed(2, (int) Math.sqrt(n)).noneMatch(d -> n % d == 0);"], [0, "}"]] } },
      rust: { file: "plans.rs",
        plain: { lines: [[1, "fn is_prime(n: i32) -> bool {"], [2, "    if n < 2 {"], [2, "        return false;"], [0, "    }"], [3, "    let mut d = 2;"], [3, "    while d * d <= n {"], [4, "        if n % d == 0 {"], [4, "            return false;"], [0, "        }"], [3, "        d += 1;"], [0, "    }"], [5, "    true"], [0, "}"]] },
        idiomatic: { lines: [[1, "fn is_prime(n: i32) -> bool {"], [[2, 3, 4, 5], "    n >= 2 && (2..).take_while(|d| d * d <= n).all(|d| n % d != 0)"], [0, "}"]] } },
      c: { file: "plans.c",
        plain: { lines: [[1, "bool is_prime(int n) {"], [2, "    if (n < 2) {"], [2, "        return false;"], [0, "    }"], [3, "    for (int d = 2; d * d <= n; d++) {"], [4, "        if (n % d == 0) {"], [4, "            return false;"], [0, "        }"], [0, "    }"], [5, "    return true;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "A small <code>bool</code> function is the idiomatic C; the name is what makes it useful." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[1, "bool is_prime(int n) {"], [2, "    if (n < 2) {"], [2, "        return false;"], [0, "    }"], [3, "    for (int d = 2; d * d <= n; d++) {"], [4, "        if (n % d == 0) {"], [4, "            return false;"], [0, "        }"], [0, "    }"], [5, "    return true;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "A small <code>bool</code> function is the idiomatic C++, and it can be passed to algorithms like <code>std::ranges::count_if(numbers, is_prime)</code>." }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Is a number prime?</b> Each tile is a possible divisor that gets tried.",
      input: { kind: "fields", fields: [{ name: "n", label: "n", min: -10, max: 10000 }] },
      presets: [{ label: "17", input: { n: 17 } }, { label: "91", input: { n: 91 } }, { label: "1", input: { n: 1 } }],
      run({ n }) {
        const ev = [], tried = [], states = [];
        let answer = "?";
        const snap = (step, msg, cur = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: tried.slice(), states: states.slice(), ptr: cur, noIdx: true, emptyNote: "no divisors tried" },
          vars: [{ k: "n", role: "fixed", v: n }, { k: "d", role: "stepper", v: cur >= 0 ? tried[cur] : "—" }, { k: "is_prime", role: "result", v: answer }] });
        snap(1, `is_prime(${n}): one named yes/no test.`);
        if (n < 2) { answer = "false"; snap(2, `${n} < 2, so it isn't prime. Return false straight away.`, -1, "no"); return ev; }
        snap(2, `${n} ≥ 2, so the easy case doesn't apply.`);
        for (let d = 2; d * d <= n; d++) {
          tried.push(d); states.push("current");
          snap(3, `Try d = ${d} (${d} × ${d} = ${d * d} ≤ ${n}).`, tried.length - 1);
          if (n % d === 0) { states[states.length - 1] = "hit"; answer = "false"; snap(4, `${n} % ${d} = 0: ${d} divides ${n}, so it isn't prime. Return false.`, tried.length - 1, "no"); return ev; }
          states[states.length - 1] = "miss";
          snap(3, `${n} % ${d} = ${n % d}: not a divisor.`, tried.length - 1);
        }
        answer = "true";
        snap(5, tried.length ? `No d with d × d ≤ ${n} divides it. Return true.` : `No d to try (2 × 2 > ${n}). Return true.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int"], returns: "bool",
      cases: [2, 17, 1, 0, 9, 25, 97, -3].map((n) => ({ args: [n], expect: [2, 17, 97].includes(n) })),
      snippets: { bugOne: [{ args: [1], expect: true }], bugEarlyYes: [{ args: [9], expect: true }] }
    },

    pitfalls: [
      { kind: "dont", title: "Forgetting the easy cases", wide: true, code: "bugOne", text: "Without the <code>n &lt; 2</code> check, the loop never runs for 1 (or 0, or negatives), and the function says they're prime.", take: "Handle the special cases at the top, like a guard (B1)." },
      { kind: "dont", title: "Saying yes too early", text: "Returning true as soon as one d doesn't divide n (9 % 2 ≠ 0) answers before the real test is done. 9 is not prime.", take: "Only return true after every candidate has failed: the Are all? plan (D8)." },
      { kind: "dont", title: "Printing instead of returning", text: "A function that prints “prime” can't be used by another plan. Counting or filtering needs a true / false value back.", take: "Return the answer; let the caller decide what to print." },
      { kind: "do", title: "Name it as a question", text: "<code>is_prime</code>, <code>has_vowel</code>, <code>is_valid_score</code>: the call then reads like the rule, <code>if is_prime(n)</code>." },
      { kind: "do", title: "Test it on its own", text: "A small yes/no function is easy to check with a table of inputs and expected answers, before you use it inside a bigger plan." }
    ],

    snippets: {
      bugOne: {
        python: ["def is_prime(n):", "    d = 2                     # ✗ no check for n < 2", "    while d * d <= n:", "        if n % d == 0:", "            return False", "        d += 1", "    return True"],
        java: ["static boolean isPrime(int n) {", "    for (int d = 2; d * d <= n; d++) {   // ✗ no check for n < 2", "        if (n % d == 0) return false;", "    }", "    return true;", "}"],
        rust: ["fn is_prime(n: i32) -> bool {", "    let mut d = 2;            // ✗ no check for n < 2", "    while d * d <= n {", "        if n % d == 0 { return false; }", "        d += 1;", "    }", "    true", "}"],
        c: ["bool is_prime(int n) {", "    for (int d = 2; d * d <= n; d++) {   // ✗ no check for n < 2", "        if (n % d == 0) return false;", "    }", "    return true;", "}"],
        cpp: ["bool is_prime(int n) {", "    for (int d = 2; d * d <= n; d++) {   // ✗ no check for n < 2", "        if (n % d == 0) return false;", "    }", "    return true;", "}"]
      },
      bugEarlyYes: {
        python: ["def is_prime(n):", "    if n < 2:", "        return False", "    d = 2", "    while d * d <= n:", "        if n % d == 0:", "            return False", "        else:", "            return True", "    return True"],
        java: ["static boolean isPrime(int n) {", "    if (n < 2) return false;", "    for (int d = 2; d * d <= n; d++) {", "        if (n % d == 0) return false;", "        else return true;", "    }", "    return true;", "}"],
        rust: ["fn is_prime(n: i32) -> bool {", "    if n < 2 { return false; }", "    let mut d = 2;", "    while d * d <= n {", "        if n % d == 0 { return false; } else { return true; }", "    }", "    true", "}"],
        c: ["bool is_prime(int n) {", "    if (n < 2) return false;", "    for (int d = 2; d * d <= n; d++) {", "        if (n % d == 0) return false;", "        else return true;", "    }", "    return true;", "}"],
        cpp: ["bool is_prime(int n) {", "    if (n < 2) return false;", "    for (int d = 2; d * d <= n; d++) {", "        if (n % d == 0) return false;", "        else return true;", "    }", "    return true;", "}"]
      }
    },

    quiz: [
      { q: "For {fn}(29), what is the largest d that gets tried?", options: ["5", "14", "28"], answer: 0, explain: "The loop runs while d × d ≤ 29: 5 × 5 = 25 is fine, 6 × 6 = 36 is too big. Any divisor above 5 would pair with one below 5." },
      { q: "This version has a bug. What does it return for 9?", code: "bugEarlyYes", options: ["true", "false"], answer: 0, explain: "9 % 2 isn't 0, so it returns true at once, before ever trying 3, which divides 9." },
      { q: "Why return true/false instead of printing “prime”?", options: ["So other plans can use the answer", "Printing is slower", "Functions can't print"], answer: 0, explain: "Counting primes or filtering a list needs the answer as a value. A printed word can only be read by a person." }
    ],

    exercise: {
      title: "Your turn: leap years",
      task: "Write <code>is_leap_year(year)</code>: a year is a leap year if it's divisible by 4, except years divisible by 100, which are leap years only if they're also divisible by 400.",
      plan: ["Name the test: is_leap_year(year) returns true or false", "Divisible by 400? Leap year", "Otherwise divisible by 100? Not a leap year", "Otherwise divisible by 4? Leap year; else not"],
      fn: { python: "is_leap_year", java: "isLeapYear", rust: "is_leap_year", c: "is_leap_year", cpp: "is_leap_year" },
      params: ["int"], returns: "bool",
      tests: [{ args: [2024], expect: true }, { args: [1900], expect: false }, { args: [2000], expect: true }, { args: [2023], expect: false }],
      solutions: {
        python: ["def is_leap_year(year):", "    if year % 400 == 0:", "        return True", "    if year % 100 == 0:", "        return False", "    return year % 4 == 0"],
        java: ["static boolean isLeapYear(int year) {", "    if (year % 400 == 0) return true;", "    if (year % 100 == 0) return false;", "    return year % 4 == 0;", "}"],
        rust: ["fn is_leap_year(year: i32) -> bool {", "    if year % 400 == 0 { return true; }", "    if year % 100 == 0 { return false; }", "    year % 4 == 0", "}"],
        c: ["bool is_leap_year(int year) {", "    if (year % 400 == 0) return true;", "    if (year % 100 == 0) return false;", "    return year % 4 == 0;", "}"],
        cpp: ["bool is_leap_year(int year) {", "    if (year % 400 == 0) return true;", "    if (year % 100 == 0) return false;", "    return year % 4 == 0;", "}"]
      }
    },

    compare: {
      intro: "A predicate is usually the test <b>inside</b> another plan.",
      rows: [
        { id: "G1", name: "Predicate function", question: "Is 17 prime?", shape: "a function returning true / false for one value", result: "yes or no", self: true },
        { id: "D1", name: "Counting", question: "How many primes up to 100?", shape: "for each n: if is_prime(n), count it", result: "a count" },
        { id: "D9", name: "Filter", question: "Which numbers in the list are prime?", shape: "for each n: if is_prime(n), keep it", result: "a new list" }
      ],
      table: { head: ["Plan", "Looks at", "Returns", "Uses a predicate?"], rows: [["Predicate function", "one value", "true / false", "it is one"], ["Counting", "a list", "a count", "as its test"], ["Filter", "a list", "a list", "as its test"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "B1", why: "the easy cases at the top work like a guard" }, { id: "D8", why: "“no divisor at all” is an are-all check" }],
      leadsTo: [{ id: "G2", why: "try candidates with a test until one passes" }, { id: "D1", why: "count the items that pass the test" }]
    }
  };
})();
