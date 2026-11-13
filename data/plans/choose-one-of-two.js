/* Plan data: B2 · Choose one of two
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const FREE_FROM = 50, FEE = 5;

  window.PLAN = {
    id: "B2",
    slug: "choose-one-of-two",
    title: "Choose one of two",
    highlight: "two",
    aka: ["if / else", "two-way decision", "binary choice"],
    group: "B",
    level: "Foundations",
    core: true,
    fn: { python: "shipping_cost", java: "shippingCost", rust: "shipping_cost", c: "shipping_cost", cpp: "shipping_cost" },

    hero: {
      type: "branches",
      labels: ["0", "5"],
      hit: 0,
      tag: "72 >= 50 ✓",
      alt: "Two cubes: free shipping (0) and the fee (5); the first is amber because 72 is at least 50"
    },
    planCard: { name: "if / else", lines: ["test the condition", "true → first choice", "false → the other"], foot: "→ exactly one runs" },

    intent: "Pick one of exactly two outcomes, depending on whether a single condition is true.",

    analogy: {
      icon: "🚦",
      title: "A fork in a footpath",
      text: "A signpost reads “Raining? Take the covered path.” You look up once, and take one path or the other. You can't take both, and you can't take neither."
    },

    cues: ["if … otherwise …", "either … or …", "free if …", "pass or fail", "yes / no decides"],
    cueSummary: "There are <b>exactly two</b> outcomes, and one condition decides between them.",
    cueExamples: [
      "Shipping is free for orders of 50 or more, otherwise it costs 5.",
      "Print “even” or “odd” for a number.",
      "A student passes with 50 or more, otherwise fails."
    ],

    steps: [
      { n: 1, title: "Test the condition", text: "One question with a yes/no answer: is the total at least 50?" },
      { n: 2, title: "True? Take the first choice", text: "Here: shipping is free (0)." },
      { n: 3, title: "False? Take the other choice", text: "The else branch: shipping costs 5. Exactly one of the two runs." }
    ],

    impl: {
      python: {
        file: "shipping.py",
        plain: { lines: [
          [0, "def shipping_cost(total):"],
          [1, "    if total >= 50:"],
          [2, "        return 0"],
          [3, "    else:"],
          [3, "        return 5"]
        ] },
        idiomatic: { lines: [
          [0, "def shipping_cost(total):"],
          [[1, 2, 3], "    return 0 if total >= 50 else 5"]
        ], note: "A conditional expression picks one of two values in a single line." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static int shippingCost(int total) {"],
          [1, "    if (total >= 50) {"],
          [2, "        return 0;"],
          [3, "    } else {"],
          [3, "        return 5;"],
          [0, "    }"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "static int shippingCost(int total) {"],
          [[1, 2, 3], "    return total >= 50 ? 0 : 5;"],
          [0, "}"]
        ], note: "The ternary operator <code>condition ? a : b</code> chooses between two values." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn shipping_cost(total: i32) -> i32 {"],
          [1, "    if total >= 50 {"],
          [2, "        0"],
          [3, "    } else {"],
          [3, "        5"],
          [0, "    }"],
          [0, "}"]
        ], note: "In Rust, <code>if</code> is an expression: the branch that runs gives the function's result." },
        idiomatic: { lines: [
          [0, "fn shipping_cost(total: i32) -> i32 {"],
          [[1, 2, 3], "    if total >= 50 { 0 } else { 5 }"],
          [0, "}"]
        ], note: "Rust has no ternary operator; an <code>if</code> expression on one line plays that role." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "int shipping_cost(int total) {"],
          [1, "    if (total >= 50) {"],
          [2, "        return 0;"],
          [3, "    } else {"],
          [3, "        return 5;"],
          [0, "    }"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "int shipping_cost(int total) {"],
          [[1, 2, 3], "    return total >= 50 ? 0 : 5;"],
          [0, "}"]
        ] }
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "int shipping_cost(int total) {"],
          [1, "    if (total >= 50) {"],
          [2, "        return 0;"],
          [3, "    } else {"],
          [3, "        return 5;"],
          [0, "    }"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "int shipping_cost(int total) {"],
          [[1, 2, 3], "    return total >= 50 ? 0 : 5;"],
          [0, "}"]
        ] }
      }
    },

    trace: {
      type: "branches",
      intro: "Running example: <b>Shipping is free for orders of 50 or more; otherwise it costs 5.</b>",
      input: { kind: "fields", fields: [{ name: "total", label: "total", min: 0, max: 1000 }] },
      presets: [
        { label: "Total 72", input: { total: 72 } },
        { label: "Exactly 50", input: { total: 50 } },
        { label: "Total 49", input: { total: 49 } }
      ],
      run({ total: t }) {
        const ev = [];
        const rows = [{ test: `total >= ${FREE_FROM}`, label: "0", state: "" }, { test: "else", label: String(FEE), state: "" }];
        let cost = "?";
        const push = (step, msg, tone = "") => ev.push({
          step, msg, tone,
          view: { subject: { k: "total", v: t }, rows: rows.map((r) => ({ ...r })) },
          vars: [{ k: "total", role: "fixed", v: t }, { k: "cost", role: "result", v: cost }]
        });
        push(null, `Ready. total = ${t}. Free shipping or not?`);
        if (t >= FREE_FROM) {
          rows[0].state = "hit"; rows[1].state = "skipped";
          push(1, `Is ${t} >= ${FREE_FROM}? Yes.`);
          cost = 0;
          push(2, "Take the first choice: shipping is free. Return 0. The else branch never runs.", "yes");
        } else {
          rows[0].state = "miss";
          push(1, `Is ${t} >= ${FREE_FROM}? No.`);
          rows[1].state = "hit"; cost = FEE;
          push(3, `Take the other choice: return ${FEE}.`, "yes");
        }
        return ev;
      }
    },

    checks: {
      params: ["int"],
      returns: "int",
      cases: [72, 50, 49, 0].map((t) => ({ args: [t], expect: t >= 50 ? 0 : 5 })),
      snippets: {
        bugBoundary: [{ args: [50], expect: 5 }, { args: [72], expect: 0 }],
        bugSwap: [{ args: [72], expect: 5 }, { args: [10], expect: 0 }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "> instead of >=", wide: true, code: "bugBoundary",
        text: "“50 or more” includes 50. Writing <code>&gt; 50</code> charges a customer who spent exactly 50, the one case the rule was written for.",
        take: "Translate “or more” as >=, and test the boundary value itself." },
      { kind: "dont", title: "Branches the wrong way round",
        text: "Putting the fee in the true branch charges the big orders and lets the small ones ship free. The code runs fine; the business loses money.",
        take: "Read it aloud: “if the total is at least 50, shipping is free”." },
      { kind: "dont", title: "Two ifs where one if/else belongs",
        text: "<code>if total &gt;= 50</code> followed by a separate <code>if total &lt; 50</code> works, until someone edits one condition and not the other.",
        take: "Use else: it covers exactly the cases the if doesn't." },
      { kind: "do", title: "Test both sides of the line",
        text: "49 and 50 (and something far away, like 0 or 1000) cover both branches and the boundary." },
      { kind: "do", title: "Use a conditional expression for values",
        text: "When both branches just produce a value, <code>a if c else b</code>, <code>c ? a : b</code> or Rust's <code>if</code> expression keeps it short." }
    ],

    snippets: {
      bugBoundary: {
        python: ["def shipping_cost(total):", "    if total > 50:", "        return 0", "    else:", "        return 5"],
        java: ["static int shippingCost(int total) {", "    if (total > 50) {", "        return 0;", "    } else {", "        return 5;", "    }", "}"],
        rust: ["fn shipping_cost(total: i32) -> i32 {", "    if total > 50 {", "        0", "    } else {", "        5", "    }", "}"],
        c: ["int shipping_cost(int total) {", "    if (total > 50) {", "        return 0;", "    } else {", "        return 5;", "    }", "}"],
        cpp: ["int shipping_cost(int total) {", "    if (total > 50) {", "        return 0;", "    } else {", "        return 5;", "    }", "}"]
      },
      bugSwap: {
        python: ["def shipping_cost(total):", "    if total >= 50:", "        return 5", "    else:", "        return 0"],
        java: ["static int shippingCost(int total) {", "    if (total >= 50) {", "        return 5;", "    } else {", "        return 0;", "    }", "}"],
        rust: ["fn shipping_cost(total: i32) -> i32 {", "    if total >= 50 {", "        5", "    } else {", "        0", "    }", "}"],
        c: ["int shipping_cost(int total) {", "    if (total >= 50) {", "        return 5;", "    } else {", "        return 0;", "    }", "}"],
        cpp: ["int shipping_cost(int total) {", "    if (total >= 50) {", "        return 5;", "    } else {", "        return 0;", "    }", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(50) return?", options: ["0", "5"], answer: 0,
        explain: "50 >= 50 is true, so the first branch runs: shipping is free." },
      { q: "In an if / else, how many of the two branches run?", options: ["Exactly one", "Both", "Possibly neither"], answer: 0,
        explain: "The condition is either true or false, so exactly one branch runs, every time." },
      { q: "This version has a bug. What does it return for 72?", code: "bugSwap", options: ["0", "5"], answer: 1,
        explain: "The branches are swapped: big orders pay 5 and small ones ship free." }
    ],

    exercise: {
      title: "Your turn: absolute value",
      task: "Write <code>absolute(x)</code> that returns x without its minus sign: -5 becomes 5, and 3 stays 3.",
      plan: ["Test the condition: is x negative?", "True? Return -x", "False? Return x as it is"],
      fn: { python: "absolute", java: "absolute", rust: "absolute", c: "absolute", cpp: "absolute" },
      params: ["int"],
      returns: "int",
      tests: [
        { args: [-5], expect: 5 },
        { args: [3], expect: 3 },
        { args: [0], expect: 0 },
        { args: [-1], expect: 1 }
      ],
      solutions: {
        python: ["def absolute(x):", "    if x < 0:", "        return -x", "    else:", "        return x"],
        java: ["static int absolute(int x) {", "    if (x < 0) {", "        return -x;", "    } else {", "        return x;", "    }", "}"],
        rust: ["fn absolute(x: i32) -> i32 {", "    if x < 0 {", "        -x", "    } else {", "        x", "    }", "}"],
        c: ["int absolute(int x) {", "    if (x < 0) {", "        return -x;", "    } else {", "        return x;", "    }", "}"],
        cpp: ["int absolute(int x) {", "    if (x < 0) {", "        return -x;", "    } else {", "        return x;", "    }", "}"]
      }
    },

    compare: {
      intro: "Four plans that all choose between outcomes. The number of outcomes, and what decides them, tells you which one fits.",
      rows: [
        { id: "B2", name: "Choose one of two", question: "Free shipping or not?", shape: "if … else", result: "2 outcomes", self: true },
        { id: "B3", name: "Multi-way classification", question: "Which grade, A to D?", shape: "if … else if … else if … else", result: "3+ outcomes" },
        { id: "B4", name: "Two-factor decision", question: "Member and over 4 kg?", shape: "nested ifs, or conditions joined with and / or", result: "a combination" },
        { id: "B1", name: "Guard", question: "Is the input usable at all?", shape: "if bad: return early", result: "error or carry on" }
      ],
      table: {
        head: ["Plan", "Outcomes", "Decided by", "Typical question"],
        rows: [
          ["Choose one of two", "2", "one condition", "Is the number even?"],
          ["Multi-way classification", "3 or more", "ordered ranges of one value", "Which tax band?"],
          ["Two-factor decision", "2 or more", "two separate facts", "Discount for members over 4 kg?"],
          ["Guard", "2: stop or continue", "is the input valid?", "What if the list is empty?"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "A1", why: "each branch is usually a small calculation" }],
      leadsTo: [{ id: "B3", why: "more than two outcomes" }, { id: "B4", why: "two conditions at once" }, { id: "B1", why: "an if that protects the rest of the function" }]
    }
  };
})();
