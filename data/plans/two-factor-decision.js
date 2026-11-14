/* Plan data: B4 · Two-factor decision
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const TABLE = [
    { member: true, heavy: true, value: 5 },
    { member: true, heavy: false, value: 2 },
    { member: false, heavy: true, value: 1 },
    { member: false, heavy: false, value: 0 }
  ];

  window.PLAN = {
    id: "B4",
    slug: "two-factor-decision",
    title: "Two-factor decision",
    highlight: "Two-factor",
    aka: ["nested if", "decision table", "combined conditions"],
    group: "B",
    level: "Foundations",
    core: false,
    fn: { python: "discount", java: "discount", rust: "discount", c: "discount", cpp: "discount" },

    hero: { type: "branches", labels: ["5", "2", "1", "0"], hit: 0, tag: "member, 6 kg", alt: "A staircase of four outcomes, one per combination of two yes/no facts; the first is amber" },
    planCard: { name: "two factors", lines: ["table every combination", "test the first factor", "then the second inside it"], foot: "→ one value per combination" },

    intent: "Decide from two separate facts at once: list every combination in a small table, then test one fact and, inside each branch, the other.",

    analogy: { icon: "🧥", title: "Choosing a coat", text: "Is it cold? Is it raining? Four combinations, four answers: cold and rain means the winter raincoat, cold and dry the wool coat, warm and rain an umbrella, warm and dry nothing at all. Neither question on its own is enough." },

    cues: ["… and …", "if both …", "depends on whether … and whether …", "members who …", "except when …"],
    cueSummary: "Two independent yes/no facts decide the outcome together. <b>Write the 2 × 2 table first.</b>",
    cueExamples: ["Members get a bigger discount on heavy orders.", "A ticket price depends on age group and day of the week.", "Free entry for students, except at weekends."],

    steps: [
      { n: 1, title: "Table every combination", text: "Two yes/no facts make four cases. Write the answer for each before coding." },
      { n: 2, title: "Test the first factor", text: "Here: is the customer a member?" },
      { n: 3, title: "Inside each branch, test the second", text: "Here: is the order heavy (over 4 kg)?" },
      { n: 4, title: "Return the value for that combination", text: "Each of the four paths ends with its own answer." }
    ],

    impl: {
      python: { file: "discount.py",
        plain: { lines: [[0, "def discount(member, weight):"], [1, "    # member+heavy 5, member 2, heavy 1, else 0"], [2, "    if member:"], [3, "        if weight > 4:"], [4, "            return 5"], [3, "        else:"], [4, "            return 2"], [2, "    else:"], [3, "        if weight > 4:"], [4, "            return 1"], [3, "        else:"], [4, "            return 0"]] },
        idiomatic: { lines: [[0, "def discount(member, weight):"], [1, "    heavy = weight > 4"], [[2, 3, 4], "    if member and heavy:"], [4, "        return 5"], [[2, 4], "    if member:"], [4, "        return 2"], [[3, 4], "    if heavy:"], [4, "        return 1"], [4, "    return 0"]], note: "A flat chain with <code>and</code>, from the most specific case to the least. Naming <code>heavy</code> keeps it readable." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int discount(boolean member, int weight) {"], [1, "    // member+heavy 5, member 2, heavy 1, else 0"], [2, "    if (member) {"], [3, "        if (weight > 4) {"], [4, "            return 5;"], [3, "        } else {"], [4, "            return 2;"], [0, "        }"], [2, "    } else {"], [3, "        if (weight > 4) {"], [4, "            return 1;"], [3, "        } else {"], [4, "            return 0;"], [0, "        }"], [0, "    }"], [0, "}"]] },
        idiomatic: { lines: [[0, "static int discount(boolean member, int weight) {"], [1, "    boolean heavy = weight > 4;"], [[2, 3, 4], "    if (member && heavy) return 5;"], [[2, 4], "    if (member) return 2;"], [[3, 4], "    if (heavy) return 1;"], [4, "    return 0;"], [0, "}"]] } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn discount(member: bool, weight: i32) -> i32 {"], [1, "    // member+heavy 5, member 2, heavy 1, else 0"], [2, "    if member {"], [[3, 4], "        if weight > 4 { 5 } else { 2 }"], [2, "    } else {"], [[3, 4], "        if weight > 4 { 1 } else { 0 }"], [0, "    }"], [0, "}"]], note: "Each <code>if</code> is an expression, so the chosen number is the result (step 4)." },
        idiomatic: { lines: [[0, "fn discount(member: bool, weight: i32) -> i32 {"], [[1, 2, 3], "    match (member, weight > 4) {"], [4, "        (true, true) => 5,"], [4, "        (true, false) => 2,"], [4, "        (false, true) => 1,"], [4, "        (false, false) => 0,"], [0, "    }"], [0, "}"]], note: "Matching on the pair <em>is</em> the decision table, and the compiler checks that all four combinations are covered." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "int discount(bool member, int weight) {"], [1, "    // member+heavy 5, member 2, heavy 1, else 0"], [2, "    if (member) {"], [3, "        if (weight > 4) {"], [4, "            return 5;"], [3, "        } else {"], [4, "            return 2;"], [0, "        }"], [2, "    } else {"], [3, "        if (weight > 4) {"], [4, "            return 1;"], [3, "        } else {"], [4, "            return 0;"], [0, "        }"], [0, "    }"], [0, "}"]] },
        idiomatic: { lines: [[0, "int discount(bool member, int weight) {"], [1, "    bool heavy = weight > 4;"], [[2, 3, 4], "    if (member && heavy) return 5;"], [[2, 4], "    if (member) return 2;"], [[3, 4], "    if (heavy) return 1;"], [4, "    return 0;"], [0, "}"]] } },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "int discount(bool member, int weight) {"], [1, "    // member+heavy 5, member 2, heavy 1, else 0"], [2, "    if (member) {"], [3, "        if (weight > 4) {"], [4, "            return 5;"], [3, "        } else {"], [4, "            return 2;"], [0, "        }"], [2, "    } else {"], [3, "        if (weight > 4) {"], [4, "            return 1;"], [3, "        } else {"], [4, "            return 0;"], [0, "        }"], [0, "    }"], [0, "}"]] },
        idiomatic: { lines: [[0, "int discount(bool member, int weight) {"], [1, "    bool heavy = weight > 4;"], [[2, 3, 4], "    if (member && heavy) return 5;"], [[2, 4], "    if (member) return 2;"], [[3, 4], "    if (heavy) return 1;"], [4, "    return 0;"], [0, "}"]] } }
    },

    trace: {
      type: "branches",
      intro: "Running example: <b>A laundry's discount.</b> Members save 5 on orders over 4 kg and 2 otherwise; non-members save 1 on orders over 4 kg.",
      input: { kind: "fields", fields: [{ name: "member", label: "member", type: "bool" }, { name: "weight", label: "weight (kg)", min: 0, max: 50 }] },
      presets: [{ label: "Member, 6 kg", input: { member: true, weight: 6 } }, { label: "Member, 3 kg", input: { member: true, weight: 3 } }, { label: "Guest, 6 kg", input: { member: false, weight: 6 } }, { label: "Guest, exactly 4 kg", input: { member: false, weight: 4 } }],
      run({ member, weight }) {
        const ev = [];
        const rows = TABLE.map((r) => ({ test: `${r.member ? "member" : "guest"} · ${r.heavy ? "> 4 kg" : "≤ 4 kg"}`, label: String(r.value), state: "" }));
        let result = "?";
        const push = (step, msg, tone = "") => ev.push({ step, msg, tone,
          view: { subject: { k: "order", v: `${member ? "member" : "guest"}, ${weight} kg` }, rows: rows.map((r) => ({ ...r })) },
          vars: [{ k: "member", role: "fixed", v: member ? "yes" : "no" }, { k: "weight", role: "fixed", v: weight }, { k: "discount", role: "result", v: result }] });
        push(null, "Ready. The table lists all four combinations.");
        push(1, "Step 1 was done before coding: one answer per combination, as in the table.");
        TABLE.forEach((r, i) => { if (r.member !== member) rows[i].state = "skipped"; });
        push(2, member ? "Member? Yes, so only the two member rows are still possible." : "Member? No, so only the two guest rows are still possible.");
        const heavy = weight > 4;
        TABLE.forEach((r, i) => { if (r.member === member) rows[i].state = r.heavy === heavy ? "hit" : "miss"; });
        push(3, `Weight over 4 kg? ${weight} > 4 is ${heavy ? "true" : "false"}${weight === 4 ? " (exactly 4 doesn't count as over)" : ""}.`);
        result = TABLE.find((r) => r.member === member && r.heavy === heavy).value;
        push(4, `Return ${result}.`, "yes");
        return ev;
      }
    },

    checks: {
      params: ["bool", "int"], returns: "int",
      cases: [{ args: [true, 6], expect: 5 }, { args: [true, 3], expect: 2 }, { args: [false, 6], expect: 1 }, { args: [false, 3], expect: 0 }, { args: [true, 4], expect: 2 }],
      snippets: { bugOr: [{ args: [false, 6], expect: 5 }], bugMissing: [{ args: [false, 6], expect: 0 }, { args: [true, 6], expect: 5 }] }
    },

    pitfalls: [
      { kind: "dont", title: "or where you meant and", wide: true, code: "bugOr", text: "<code>member or heavy</code> gives the members' heavy-order discount to every heavy order, and to every member's light order too.", take: "Read the condition aloud: “member and heavy”." },
      { kind: "dont", title: "Forgetting a combination", text: "It's easy to handle three of the four cases and let the fourth fall through to a default. Here a guest's heavy order wrongly gets 0.", take: "Make the 2 × 2 table first and check that every cell has a branch." },
      { kind: "dont", title: "Testing the general case first in a flat chain", text: "In a flat chain, <code>if member</code> before <code>if member and heavy</code> catches every member, so the 5 is never reached.", take: "Most specific combination first." },
      { kind: "do", title: "Name the facts", text: "<code>heavy = weight &gt; 4</code> turns each condition into a word, so <code>if member and heavy</code> reads like the rule." },
      { kind: "do", title: "Test all four corners, and the boundary", text: "Four combinations, plus a weight of exactly 4, cover every path." }
    ],

    snippets: {
      bugOr: {
        python: ["def discount(member, weight):", "    if member or weight > 4:   # ✗ should be and", "        return 5", "    return 0"],
        java: ["static int discount(boolean member, int weight) {", "    if (member || weight > 4) {   // ✗ should be &&", "        return 5;", "    }", "    return 0;", "}"],
        rust: ["fn discount(member: bool, weight: i32) -> i32 {", "    if member || weight > 4 {     // ✗ should be &&", "        return 5;", "    }", "    0", "}"],
        c: ["int discount(bool member, int weight) {", "    if (member || weight > 4) {   // ✗ should be &&", "        return 5;", "    }", "    return 0;", "}"],
        cpp: ["int discount(bool member, int weight) {", "    if (member || weight > 4) {   // ✗ should be &&", "        return 5;", "    }", "    return 0;", "}"]
      },
      bugMissing: {
        python: ["def discount(member, weight):", "    if member and weight > 4:", "        return 5", "    if member:", "        return 2", "    return 0"],
        java: ["static int discount(boolean member, int weight) {", "    if (member && weight > 4) return 5;", "    if (member) return 2;", "    return 0;", "}"],
        rust: ["fn discount(member: bool, weight: i32) -> i32 {", "    if member && weight > 4 { return 5; }", "    if member { return 2; }", "    0", "}"],
        c: ["int discount(bool member, int weight) {", "    if (member && weight > 4) return 5;", "    if (member) return 2;", "    return 0;", "}"],
        cpp: ["int discount(bool member, int weight) {", "    if (member && weight > 4) return 5;", "    if (member) return 2;", "    return 0;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(false, 9) return?", options: ["0", "1", "2", "5"], answer: 1, explain: "A guest (not a member) with a heavy order: the table says 1." },
      { q: "This version has a bug. What does it return for a guest's 6 kg order?", code: "bugMissing", options: ["1", "0", "5"], answer: 1, explain: "The guest-and-heavy case has no branch, so it falls through to return 0. The table says 1." },
      { q: "With two yes/no facts, how many combinations need an answer?", options: ["2", "3", "4"], answer: 2, explain: "Each fact can be yes or no: 2 × 2 = 4 combinations." }
    ],

    exercise: {
      title: "Your turn: cinema tickets",
      task: "Write <code>ticket(student, weekend)</code>: students pay 8 at weekends and 6 on weekdays; everyone else pays 12 at weekends and 10 on weekdays.",
      plan: ["Make the 2 × 2 table of prices", "Test the first fact: is it a student?", "Inside each branch, test: is it the weekend?", "Return the price for that combination"],
      fn: { python: "ticket", java: "ticket", rust: "ticket", c: "ticket", cpp: "ticket" },
      params: ["bool", "bool"], returns: "int",
      tests: [{ args: [true, true], expect: 8 }, { args: [true, false], expect: 6 }, { args: [false, true], expect: 12 }, { args: [false, false], expect: 10 }],
      solutions: {
        python: ["def ticket(student, weekend):", "    if student:", "        return 8 if weekend else 6", "    else:", "        return 12 if weekend else 10"],
        java: ["static int ticket(boolean student, boolean weekend) {", "    if (student) {", "        return weekend ? 8 : 6;", "    } else {", "        return weekend ? 12 : 10;", "    }", "}"],
        rust: ["fn ticket(student: bool, weekend: bool) -> i32 {", "    match (student, weekend) {", "        (true, true) => 8,", "        (true, false) => 6,", "        (false, true) => 12,", "        (false, false) => 10,", "    }", "}"],
        c: ["int ticket(bool student, bool weekend) {", "    if (student) {", "        return weekend ? 8 : 6;", "    } else {", "        return weekend ? 12 : 10;", "    }", "}"],
        cpp: ["int ticket(bool student, bool weekend) {", "    if (student) {", "        return weekend ? 8 : 6;", "    } else {", "        return weekend ? 12 : 10;", "    }", "}"]
      }
    },

    compare: {
      intro: "Selection plans, by what decides the outcome.",
      rows: [
        { id: "B4", name: "Two-factor decision", question: "Member and heavy?", shape: "nested ifs, or and / or, one branch per combination", result: "4 combinations", self: true },
        { id: "B2", name: "Choose one of two", question: "Free shipping or not?", shape: "if … else on one condition", result: "2 outcomes" },
        { id: "B3", name: "Multi-way classification", question: "Which grade?", shape: "else-if chain over ranges of one value", result: "3+ outcomes" }
      ],
      table: { head: ["Plan", "Facts that decide", "Outcomes", "Write first"], rows: [["Two-factor decision", "two, independent", "up to 4", "the 2 × 2 table"], ["Choose one of two", "one", "2", "the condition"], ["Multi-way classification", "one value, several ranges", "3 or more", "the ranges in order"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "B2", why: "each test is a yes/no choice" }],
      leadsTo: [{ id: "B5", why: "many exact combinations: put them in a table" }, { id: "G1", why: "name a condition with a yes/no function" }]
    }
  };
})();
