/* Plan data: C4 · Repeat until a target
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const RATE = 1.05, MAX_YEARS = 60;

  window.PLAN = {
    id: "C4",
    slug: "repeat-until-target",
    title: "Repeat until a target",
    highlight: "target",
    aka: ["goal-driven loop", "while not reached", "count the rounds"],
    group: "C",
    level: "Foundations",
    core: false,
    fn: { python: "years_to_reach", java: "yearsToReach", rust: "years_to_reach", c: "years_to_reach", cpp: "years_to_reach" },

    hero: { type: "tiles", values: ["Y1", "Y2", "Y3", "Y4", "Y5"], colors: ["pale", "pale", "pale", "pale", "amber"], tagAt: 4, tag: "reached the goal", alt: "A row of year cubes; the last one is amber because the goal is reached that year" },
    planCard: { name: "until target", lines: ["count = 0", "while goal not reached", "one round, count + 1"], foot: "→ return the count" },

    intent: "Repeat a step until a goal is reached, counting the rounds: the number of rounds is the answer, so it can't be known in advance.",

    analogy: { icon: "🪣", title: "Filling a bucket with a cup", text: "You pour cup after cup into the bucket and keep count. You don't know beforehand how many cups it takes; you stop when the bucket is full, and your count is the answer." },

    cues: ["how many years until …", "how long before …", "until it reaches …", "at least …", "keep going until"],
    cueSummary: "The answer is <b>how many rounds</b> it takes to reach a goal. The loop stops on the goal, not on a count.",
    cueExamples: ["How many years until the savings reach 2000?", "How many times must you halve a number to get to 1?", "How many days until the plant is 30 cm tall?"],

    steps: [
      { n: 1, title: "Set up: start the counter at 0", text: "And the starting value: here the balance starts at the starting amount." },
      { n: 2, title: "While the goal isn't reached", text: "Here: while the balance is still below the target. If it's already reached, the loop never runs." },
      { n: 3, title: "Do one round and count it", text: "Add a year's interest, then add one to the year counter." },
      { n: 4, title: "Return the count", text: "The number of rounds it took." }
    ],

    impl: {
      python: { file: "target.py",
        plain: { lines: [[0, "def years_to_reach(start, target):"], [1, "    balance = start"], [1, "    years = 0"], [2, "    while balance < target:"], [3, "        balance = balance * 1.05"], [3, "        years += 1"], [4, "    return years"]], note: "If <code>start</code> were 0, the balance would never grow and the loop would never end. See the pitfalls." },
        idiomatic: null, idiomaticNote: "A <code>while</code> loop is the idiomatic Python here. (A logarithm formula exists, but rounding makes it fiddly to get exactly right.)" },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int yearsToReach(int start, int target) {"], [1, "    double balance = start;"], [1, "    int years = 0;"], [2, "    while (balance < target) {"], [3, "        balance = balance * 1.05;"], [3, "        years++;"], [0, "    }"], [4, "    return years;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "A <code>while</code> loop is the idiomatic Java here." },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn years_to_reach(start: i32, target: i32) -> i32 {"], [1, "    let mut balance = start as f64;"], [1, "    let mut years = 0;"], [2, "    while balance < target as f64 {"], [3, "        balance = balance * 1.05;"], [3, "        years += 1;"], [0, "    }"], [4, "    years"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "A <code>while</code> loop is the idiomatic Rust here." },
      c: { file: "plans.c",
        plain: { lines: [[0, "int years_to_reach(int start, int target) {"], [1, "    double balance = start;"], [1, "    int years = 0;"], [2, "    while (balance < target) {"], [3, "        balance = balance * 1.05;"], [3, "        years++;"], [0, "    }"], [4, "    return years;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "A <code>while</code> loop is the idiomatic C here." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "int years_to_reach(int start, int target) {"], [1, "    double balance = start;"], [1, "    int years = 0;"], [2, "    while (balance < target) {"], [3, "        balance = balance * 1.05;"], [3, "        years++;"], [0, "    }"], [4, "    return years;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "A <code>while</code> loop is the idiomatic C++ here." }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Savings grow by 5% a year. How many years until they reach the target?</b> A new tile appears for each year.",
      input: { kind: "fields", fields: [{ name: "start", label: "start", min: 1, max: 100000 }, { name: "target", label: "target", min: 0, max: 1000000 }] },
      presets: [{ label: "1000 → 1300", input: { start: 1000, target: 1300 } }, { label: "Already there", input: { start: 1000, target: 1000 } }, { label: "500 → 800", input: { start: 500, target: 800 } }],
      run({ start, target }) {
        const ev = [], years = [], states = [];
        let balance = start, count = 0;
        const snap = (step, msg, cur = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: years.slice(), states: states.slice(), ptr: cur, emptyNote: "no years yet" },
          vars: [{ k: "balance", role: "gatherer", v: balance.toFixed(2) }, { k: "target", role: "fixed", v: target }, { k: "years", role: "count", v: count }] });
        snap(null, `Ready. Start at ${start}, aim for ${target}.`);
        snap(1, `Set up: balance = ${start}, years = 0.`);
        while (balance < target) {
          if (count >= MAX_YEARS) { snap(2, `Stopped the trace after ${MAX_YEARS} years: the goal is very far away.`, -1, "no"); return ev; }
          snap(2, `Is ${balance.toFixed(2)} < ${target}? Yes, the goal isn't reached yet.`);
          balance *= RATE; count++;
          years.push(Math.round(balance)); states.forEach((_, i) => { states[i] = "miss"; }); states.push("current");
          snap(3, `Year ${count}: balance = ${balance.toFixed(2)}.`, years.length - 1);
        }
        if (states.length) states[states.length - 1] = "hit";
        snap(2, `Is ${balance.toFixed(2)} < ${target}? No, the goal is reached.`, years.length - 1);
        snap(4, `Return ${count} year${count === 1 ? "" : "s"}.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int", "int"], returns: "int",
      cases: [{ args: [1000, 2000], expect: 15 }, { args: [1000, 1000], expect: 0 }, { args: [1000, 1100], expect: 2 }, { args: [500, 800], expect: 10 }],
      snippets: { bugDoFirst: [{ args: [1000, 1000], expect: 1 }, { args: [1000, 1100], expect: 2 }], bugDirection: [{ args: [1000, 2000], expect: 0 }] }
    },

    pitfalls: [
      { kind: "dont", title: "Doing a round before checking", wide: true, code: "bugDoFirst", text: "If the round runs before the test, a goal that is already met still costs one round: 1000 → 1000 gives 1 year instead of 0.", take: "Test first, at the top of the loop." },
      { kind: "dont", title: "A goal that can never be reached", text: "With a starting balance of 0 (or a negative growth rate), the balance never reaches the target and the loop runs forever.", take: "Guard first (B1): check that progress is possible, or set a maximum number of rounds." },
      { kind: "dont", title: "Comparing the wrong way", text: "<code>while balance &gt; target</code> stops immediately when the balance starts below the target, and reports 0 years.", take: "Loop while the goal is <em>not yet</em> reached." },
      { kind: "do", title: "Count in the same place you change the value", text: "Change the balance and add one to the counter side by side, so they can't get out of step." },
      { kind: "do", title: "Use repeat-n-times when the count is known", text: "If you're told “for 10 years”, the number of rounds is given: that's C1, not this plan." }
    ],

    snippets: {
      bugDoFirst: {
        python: ["def years_to_reach(start, target):", "    balance = start", "    years = 0", "    while True:", "        balance = balance * 1.05   # ✗ a round before the test", "        years += 1", "        if balance >= target:", "            break", "    return years"],
        java: ["static int yearsToReach(int start, int target) {", "    double balance = start;", "    int years = 0;", "    do {", "        balance = balance * 1.05;  // ✗ a round before the test", "        years++;", "    } while (balance < target);", "    return years;", "}"],
        rust: ["fn years_to_reach(start: i32, target: i32) -> i32 {", "    let mut balance = start as f64;", "    let mut years = 0;", "    loop {", "        balance = balance * 1.05;  // ✗ a round before the test", "        years += 1;", "        if balance >= target as f64 { break; }", "    }", "    years", "}"],
        c: ["int years_to_reach(int start, int target) {", "    double balance = start;", "    int years = 0;", "    do {", "        balance = balance * 1.05;  // ✗ a round before the test", "        years++;", "    } while (balance < target);", "    return years;", "}"],
        cpp: ["int years_to_reach(int start, int target) {", "    double balance = start;", "    int years = 0;", "    do {", "        balance = balance * 1.05;  // ✗ a round before the test", "        years++;", "    } while (balance < target);", "    return years;", "}"]
      },
      bugDirection: {
        python: ["def years_to_reach(start, target):", "    balance = start", "    years = 0", "    while balance > target:", "        balance = balance * 1.05", "        years += 1", "    return years"],
        java: ["static int yearsToReach(int start, int target) {", "    double balance = start;", "    int years = 0;", "    while (balance > target) {", "        balance = balance * 1.05;", "        years++;", "    }", "    return years;", "}"],
        rust: ["fn years_to_reach(start: i32, target: i32) -> i32 {", "    let mut balance = start as f64;", "    let mut years = 0;", "    while balance > target as f64 {", "        balance = balance * 1.05;", "        years += 1;", "    }", "    years", "}"],
        c: ["int years_to_reach(int start, int target) {", "    double balance = start;", "    int years = 0;", "    while (balance > target) {", "        balance = balance * 1.05;", "        years++;", "    }", "    return years;", "}"],
        cpp: ["int years_to_reach(int start, int target) {", "    double balance = start;", "    int years = 0;", "    while (balance > target) {", "        balance = balance * 1.05;", "        years++;", "    }", "    return years;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(1000, 1100) return?", options: ["1", "2", "3"], answer: 1, explain: "After 1 year: 1050 (still below 1100). After 2 years: 1102.50, which reaches it. So 2." },
      { q: "This version has a bug. What does it return for (1000, 1000)?", code: "bugDoFirst", options: ["0", "1"], answer: 1, explain: "It adds a year before checking, so even a goal that is already met costs one year." },
      { q: "Which plan fits “print the balance for each of the next 10 years”?", options: ["Repeat until a target", "Repeat n times"], answer: 1, explain: "The number of rounds (10) is given up front, so it's a counted loop, C1." }
    ],

    exercise: {
      title: "Your turn: halve until 1",
      task: "Write <code>halvings(n)</code> that returns how many times you must halve <code>n</code> (with integer division) until it is 1 or less.",
      plan: ["Start the counter at 0", "While n is greater than 1", "Halve n (n = n // 2) and count it", "Return the count"],
      fn: { python: "halvings", java: "halvings", rust: "halvings", c: "halvings", cpp: "halvings" },
      params: ["int"], returns: "int",
      tests: [{ args: [8], expect: 3 }, { args: [1], expect: 0 }, { args: [10], expect: 3 }, { args: [0], expect: 0 }],
      solutions: {
        python: ["def halvings(n):", "    count = 0", "    while n > 1:", "        n = n // 2", "        count += 1", "    return count"],
        java: ["static int halvings(int n) {", "    int count = 0;", "    while (n > 1) {", "        n = n / 2;", "        count++;", "    }", "    return count;", "}"],
        rust: ["fn halvings(n: i32) -> i32 {", "    let mut n = n;", "    let mut count = 0;", "    while n > 1 {", "        n = n / 2;", "        count += 1;", "    }", "    count", "}"],
        c: ["int halvings(int n) {", "    int count = 0;", "    while (n > 1) {", "        n = n / 2;", "        count++;", "    }", "    return count;", "}"],
        cpp: ["int halvings(int n) {", "    int count = 0;", "    while (n > 1) {", "        n = n / 2;", "        count++;", "    }", "    return count;", "}"]
      }
    },

    compare: {
      intro: "Loop plans, by what stops the loop.",
      rows: [
        { id: "C4", name: "Repeat until a target", question: "Years until savings reach 2000?", shape: "while goal not reached: one round, count it", result: "the count is the answer", self: true },
        { id: "C1", name: "Repeat n times", question: "Balance after 10 years?", shape: "for i in 0..n", result: "the count is given" },
        { id: "G2", name: "Generate and test", question: "Smallest divisor of 91?", shape: "try candidates in order until one passes", result: "the candidate is the answer" }
      ],
      table: { head: ["Plan", "Known up front", "Stops when", "Answer"], rows: [["Repeat until a target", "the goal", "the goal is reached", "how many rounds"], ["Repeat n times", "the number of rounds", "the counter reaches n", "the state after n rounds"], ["Generate and test", "the test", "a candidate passes", "that candidate"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "C1", why: "the counter and the repeated step" }, { id: "B1", why: "guard against goals that can't be reached" }],
      leadsTo: [{ id: "G2", why: "stop at the first candidate that works" }, { id: "D16", why: "keep dividing a number until it reaches 0" }]
    }
  };
})();
