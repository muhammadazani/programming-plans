/* Plan data: B1 · Guard
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const f = (x) => (Number.isInteger(x) ? x.toFixed(1) : String(+x.toFixed(6)));

  window.PLAN = {
    id: "B1",
    slug: "guard",
    title: "Guard",
    highlight: "Guard",
    aka: ["guard clause", "early return", "input validation"],
    group: "B",
    level: "Foundations",
    core: true,
    fn: { python: "speed_kmh", java: "speedKmh", rust: "speed_kmh", c: "speed_kmh", cpp: "speed_kmh" },

    hero: {
      type: "branches",
      labels: ["✗", "✗", "✓"],
      hit: 1,
      tag: "minutes <= 0",
      alt: "Three cubes in a staircase: two guard checks and the main work; the second guard is amber because it caught a bad input"
    },
    planCard: { name: "guard", lines: ["bad input? return early", "next bad case? return", "safe: do the work"], foot: "→ return the result" },

    intent: "Deal with the inputs that would break a calculation first, and return straight away, so the main code only ever sees valid input.",

    analogy: {
      icon: "🎢",
      title: "The height check at a roller coaster",
      text: "Before anyone gets on the ride, a sign checks their height. Too short, and they're turned away right there. Everyone who gets past the sign can ride safely, and the ride itself never has to think about height again."
    },

    cues: ["if the input is invalid …", "must not be zero / negative", "otherwise return an error", "only if …", "what if … is empty?"],
    cueSummary: "Some inputs make the main calculation impossible or meaningless. <b>Name them and handle them first.</b>",
    cueExamples: [
      "Compute a speed, but the time might be 0.",
      "Take the average of a list that might be empty.",
      "Withdraw money only if the balance is large enough."
    ],

    steps: [
      { n: 1, title: "Test a bad case", text: "One check per thing that could go wrong: a negative distance, a time of zero." },
      { n: 2, title: "Bad? Return early with a safe answer", text: "Here -1.0 means “invalid input”. The function stops right there." },
      { n: 3, title: "Do the main work", text: "Every input that reaches this point has passed all the guards, so the formula is safe." },
      { n: 4, title: "Return the result", text: "Only valid inputs ever get here." }
    ],

    impl: {
      python: {
        file: "speed.py",
        plain: { lines: [
          [0, "def speed_kmh(distance_m, minutes):"],
          [1, "    if distance_m < 0:"],
          [2, "        return -1.0"],
          [1, "    if minutes <= 0:"],
          [2, "        return -1.0"],
          [3, "    km = distance_m / 1000"],
          [3, "    hours = minutes / 60"],
          [4, "    return km / hours"]
        ] },
        idiomatic: null,
        idiomaticNote: "Idiomatic Python <b>raises</b> instead of returning a special value: <code>raise ValueError(\"minutes must be positive\")</code>. The plan is the same: check first, leave early."
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static double speedKmh(int distanceM, int minutes) {"],
          [1, "    if (distanceM < 0) {"],
          [2, "        return -1.0;"],
          [0, "    }"],
          [1, "    if (minutes <= 0) {"],
          [2, "        return -1.0;"],
          [0, "    }"],
          [3, "    double km = distanceM / 1000.0;"],
          [3, "    double hours = minutes / 60.0;"],
          [4, "    return km / hours;"],
          [0, "}"]
        ] },
        idiomatic: null,
        idiomaticNote: "Idiomatic Java <b>throws</b>: <code>throw new IllegalArgumentException(\"minutes must be positive\");</code>. The guard stays at the top."
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn speed_kmh(distance_m: i32, minutes: i32) -> f64 {"],
          [1, "    if distance_m < 0 {"],
          [2, "        return -1.0;"],
          [0, "    }"],
          [1, "    if minutes <= 0 {"],
          [2, "        return -1.0;"],
          [0, "    }"],
          [3, "    let km = distance_m as f64 / 1000.0;"],
          [3, "    let hours = minutes as f64 / 60.0;"],
          [4, "    km / hours"],
          [0, "}"]
        ] },
        idiomatic: null,
        idiomaticNote: "Idiomatic Rust returns <code>Option&lt;f64&gt;</code>: <code>return None;</code> in each guard and <code>Some(km / hours)</code> at the end, so the caller can't forget to check."
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "double speed_kmh(int distance_m, int minutes) {"],
          [1, "    if (distance_m < 0) {"],
          [2, "        return -1.0;"],
          [0, "    }"],
          [1, "    if (minutes <= 0) {"],
          [2, "        return -1.0;"],
          [0, "    }"],
          [3, "    double km = distance_m / 1000.0;"],
          [3, "    double hours = minutes / 60.0;"],
          [4, "    return km / hours;"],
          [0, "}"]
        ] },
        idiomatic: null,
        idiomaticNote: "C has no exceptions. A common style returns an error code and passes the result back through a pointer: <code>int speed_kmh(int d, int m, double *out)</code>."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "double speed_kmh(int distance_m, int minutes) {"],
          [1, "    if (distance_m < 0) {"],
          [2, "        return -1.0;"],
          [0, "    }"],
          [1, "    if (minutes <= 0) {"],
          [2, "        return -1.0;"],
          [0, "    }"],
          [3, "    double km = distance_m / 1000.0;"],
          [3, "    double hours = minutes / 60.0;"],
          [4, "    return km / hours;"],
          [0, "}"]
        ] },
        idiomatic: null,
        idiomaticNote: "Idiomatic C++ either throws <code>std::invalid_argument</code> or returns <code>std::optional&lt;double&gt;</code> with <code>std::nullopt</code> from each guard."
      }
    },

    trace: {
      type: "branches",
      intro: "Running example: <b>the speed calculation from A1, protected by guards.</b> -1.0 means “invalid input”.",
      input: { kind: "fields", fields: [{ name: "distance_m", label: "distance_m", min: -1000, max: 100000 }, { name: "minutes", label: "minutes", min: -60, max: 1440 }] },
      presets: [
        { label: "Valid: 1500 m, 6 min", input: { distance_m: 1500, minutes: 6 } },
        { label: "Zero minutes", input: { distance_m: 1500, minutes: 0 } },
        { label: "Negative distance", input: { distance_m: -100, minutes: 10 } }
      ],
      run({ distance_m: d, minutes: m }) {
        const ev = [];
        const rows = [
          { test: "distance_m < 0", label: "-1.0", state: "" },
          { test: "minutes <= 0", label: "-1.0", state: "" },
          { test: "else: compute", label: "speed", state: "" }
        ];
        let result = "?";
        const push = (step, msg, tone = "") => ev.push({
          step, msg, tone,
          view: { subject: { k: "input", v: `${d} m, ${m} min` }, rows: rows.map((r) => ({ ...r })) },
          vars: [{ k: "distance_m", role: "fixed", v: d }, { k: "minutes", role: "fixed", v: m }, { k: "result", role: "result", v: result }]
        });
        push(null, "Ready. Is the input safe for the formula?");
        if (d < 0) {
          rows[0].state = "hit"; rows[1].state = rows[2].state = "skipped";
          push(1, `Is ${d} < 0? Yes: a distance can't be negative.`);
          result = "-1.0";
          push(2, "Return -1.0 straight away. The formula never runs.", "no");
          return ev;
        }
        rows[0].state = "miss";
        push(1, `Is ${d} < 0? No, the distance is fine.`);
        if (m <= 0) {
          rows[1].state = "hit"; rows[2].state = "skipped";
          push(1, `Is ${m} <= 0? Yes: dividing by this time would fail.`);
          result = "-1.0";
          push(2, "Return -1.0 straight away. The division by zero never happens.", "no");
          return ev;
        }
        rows[1].state = "miss";
        push(1, `Is ${m} <= 0? No, the time is fine.`);
        const speed = (d / 1000) / (m / 60);
        rows[2].state = "hit"; rows[2].label = f(speed);
        push(3, `Both guards passed, so the inputs are valid: ${d} / 1000 km ÷ ${m} / 60 h = ${f(speed)}.`);
        result = f(speed);
        push(4, `Return ${f(speed)} km/h.`, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int", "int"],
      returns: "double",
      cases: [
        { args: [1500, 6], expect: 15.0 },
        { args: [1500, 0], expect: -1.0 },
        { args: [-100, 10], expect: -1.0 },
        { args: [0, 10], expect: 0.0 }
      ],
      snippets: {
        bugNoReturn: [{ args: [-1500, 6], expect: -15.0 }],
        bugZeroDistance: [{ args: [0, 10], expect: -1.0 }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "A guard that doesn't leave", wide: true, code: "bugNoReturn",
        text: "Noting the problem but carrying on lets the bad input reach the formula anyway. Here a negative distance produces a negative speed instead of -1.0.",
        take: "A guard must return (or raise) so the rest of the function never runs." },
      { kind: "dont", title: "Guarding too much",
        text: "Rejecting <code>distance_m &lt;= 0</code> also throws out a distance of 0, which is perfectly valid: standing still is 0 km/h.",
        take: "Guard exactly the inputs that break the calculation, and test the boundary." },
      { kind: "dont", title: "Checking after the damage",
        text: "A guard placed after the division is too late: the division by zero has already happened.",
        take: "Guards go at the very top." },
      { kind: "do", title: "One guard per problem",
        text: "Separate, flat checks read like a checklist. Deeply nested <code>if</code>s around the main code are harder to follow." },
      { kind: "do", title: "Choose an answer the caller can't mistake",
        text: "-1.0 works because a speed is never negative. Better still are the idiomatic tools: exceptions, Rust's <code>Option</code>, C++'s <code>std::optional</code>." }
    ],

    snippets: {
      bugNoReturn: {
        python: ["def speed_kmh(distance_m, minutes):", "    result = 0.0", "    if distance_m < 0:", "        result = -1.0     # ✗ noted, but keeps going", "    if minutes <= 0:", "        return -1.0", "    result = (distance_m / 1000) / (minutes / 60)", "    return result"],
        java: ["static double speedKmh(int distanceM, int minutes) {", "    double result = 0.0;", "    if (distanceM < 0) {", "        result = -1.0;    // ✗ noted, but keeps going", "    }", "    if (minutes <= 0) {", "        return -1.0;", "    }", "    result = (distanceM / 1000.0) / (minutes / 60.0);", "    return result;", "}"],
        rust: ["fn speed_kmh(distance_m: i32, minutes: i32) -> f64 {", "    let mut result = 0.0;", "    if distance_m < 0 {", "        result = -1.0;    // ✗ noted, but keeps going", "    }", "    if minutes <= 0 {", "        return -1.0;", "    }", "    result = (distance_m as f64 / 1000.0) / (minutes as f64 / 60.0);", "    result", "}"],
        c: ["double speed_kmh(int distance_m, int minutes) {", "    double result = 0.0;", "    if (distance_m < 0) {", "        result = -1.0;    // ✗ noted, but keeps going", "    }", "    if (minutes <= 0) {", "        return -1.0;", "    }", "    result = (distance_m / 1000.0) / (minutes / 60.0);", "    return result;", "}"],
        cpp: ["double speed_kmh(int distance_m, int minutes) {", "    double result = 0.0;", "    if (distance_m < 0) {", "        result = -1.0;    // ✗ noted, but keeps going", "    }", "    if (minutes <= 0) {", "        return -1.0;", "    }", "    result = (distance_m / 1000.0) / (minutes / 60.0);", "    return result;", "}"]
      },
      bugZeroDistance: {
        python: ["def speed_kmh(distance_m, minutes):", "    if distance_m <= 0:", "        return -1.0", "    if minutes <= 0:", "        return -1.0", "    km = distance_m / 1000", "    hours = minutes / 60", "    return km / hours"],
        java: ["static double speedKmh(int distanceM, int minutes) {", "    if (distanceM <= 0) {", "        return -1.0;", "    }", "    if (minutes <= 0) {", "        return -1.0;", "    }", "    double km = distanceM / 1000.0;", "    double hours = minutes / 60.0;", "    return km / hours;", "}"],
        rust: ["fn speed_kmh(distance_m: i32, minutes: i32) -> f64 {", "    if distance_m <= 0 {", "        return -1.0;", "    }", "    if minutes <= 0 {", "        return -1.0;", "    }", "    let km = distance_m as f64 / 1000.0;", "    let hours = minutes as f64 / 60.0;", "    km / hours", "}"],
        c: ["double speed_kmh(int distance_m, int minutes) {", "    if (distance_m <= 0) {", "        return -1.0;", "    }", "    if (minutes <= 0) {", "        return -1.0;", "    }", "    double km = distance_m / 1000.0;", "    double hours = minutes / 60.0;", "    return km / hours;", "}"],
        cpp: ["double speed_kmh(int distance_m, int minutes) {", "    if (distance_m <= 0) {", "        return -1.0;", "    }", "    if (minutes <= 0) {", "        return -1.0;", "    }", "    double km = distance_m / 1000.0;", "    double hours = minutes / 60.0;", "    return km / hours;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(3000, 0) return?", options: ["-1.0", "0.0", "infinity", "an error"], answer: 0,
        explain: "The second guard catches minutes <= 0 and returns -1.0 before any division happens." },
      { q: "This version has a bug. What does it return for (0, 10)?", code: "bugZeroDistance", options: ["0.0", "-1.0", "an error"], answer: 1,
        explain: "The guard rejects distance_m <= 0, so a valid distance of 0 is treated as an error. The correct answer is 0.0 km/h." },
      { q: "Why do guards go at the top of the function?", options: ["It's faster to type", "So bad input never reaches the main work", "The compiler requires it"], answer: 1,
        explain: "Once every guard has passed, the rest of the function can assume its input is valid." }
    ],

    exercise: {
      title: "Your turn: a safe percentage",
      task: "Write <code>percent(part, whole)</code> that returns part ÷ whole × 100. Return -1.0 if <code>whole</code> is 0 or less, or if <code>part</code> is negative.",
      plan: ["Guard: whole is 0 or less? Return -1.0", "Guard: part is negative? Return -1.0", "Compute part × 100 ÷ whole as a decimal", "Return the result"],
      fn: { python: "percent", java: "percent", rust: "percent", c: "percent", cpp: "percent" },
      params: ["int", "int"],
      returns: "double",
      tests: [
        { args: [1, 4], expect: 25.0 },
        { args: [3, 0], expect: -1.0 },
        { args: [-1, 5], expect: -1.0 },
        { args: [0, 5], expect: 0.0 }
      ],
      solutions: {
        python: ["def percent(part, whole):", "    if whole <= 0:", "        return -1.0", "    if part < 0:", "        return -1.0", "    return part * 100 / whole"],
        java: ["static double percent(int part, int whole) {", "    if (whole <= 0) {", "        return -1.0;", "    }", "    if (part < 0) {", "        return -1.0;", "    }", "    return part * 100.0 / whole;", "}"],
        rust: ["fn percent(part: i32, whole: i32) -> f64 {", "    if whole <= 0 {", "        return -1.0;", "    }", "    if part < 0 {", "        return -1.0;", "    }", "    part as f64 * 100.0 / whole as f64", "}"],
        c: ["double percent(int part, int whole) {", "    if (whole <= 0) {", "        return -1.0;", "    }", "    if (part < 0) {", "        return -1.0;", "    }", "    return part * 100.0 / whole;", "}"],
        cpp: ["double percent(int part, int whole) {", "    if (whole <= 0) {", "        return -1.0;", "    }", "    if (part < 0) {", "        return -1.0;", "    }", "    return part * 100.0 / whole;", "}"]
      }
    },

    compare: {
      intro: "Three selection plans. A guard is the one whose job is to <b>protect</b> the rest of the function.",
      rows: [
        { id: "B1", name: "Guard", question: "Is the input usable at all?", shape: "if bad: return early; then the main work, unindented", result: "error or answer", self: true },
        { id: "B2", name: "Choose one of two", question: "Free shipping or not?", shape: "if … else, both branches are normal outcomes", result: "one of 2 values" },
        { id: "B3", name: "Multi-way classification", question: "Which grade?", shape: "if … else if … else over ordered ranges", result: "one of 3+ values" }
      ],
      table: {
        head: ["Plan", "Where it goes", "Branches", "What happens after"],
        rows: [
          ["Guard", "at the very top", "bad case vs. carry on", "the main work, for valid input only"],
          ["Choose one of two", "anywhere", "two normal outcomes", "both paths continue or return"],
          ["Multi-way classification", "anywhere", "three or more outcomes", "exactly one branch runs"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "A1", why: "the calculation being protected" }, { id: "B2", why: "each guard is an if" }],
      leadsTo: [{ id: "D3", why: "guard an average against an empty list" }, { id: "C3", why: "ask again until the input is valid" }]
    }
  };
})();
