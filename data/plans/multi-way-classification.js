/* Plan data: B3 · Multi-way classification
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const RANGES = [
    { min: 85, label: "A" },
    { min: 70, label: "B" },
    { min: 55, label: "C" }
  ];
  const ELSE_LABEL = "D";

  window.PLAN = {
    id: "B3",
    slug: "multi-way-classification",
    title: "Multi-way classification",
    highlight: "classification",
    aka: ["if / else-if ladder", "range classification", "banding"],
    group: "B",
    level: "Foundations",
    core: true,
    fn: { python: "grade", java: "grade", rust: "grade", c: "grade", cpp: "grade" },

    hero: {
      type: "branches",
      labels: ["A", "B", "C", "D"],
      hit: 1,
      tag: "78 >= 70 ✓",
      alt: "A staircase of four cubes labelled A to D; the second, B, is amber because 78 passed the test 78 >= 70; the ones below are faded"
    },
    planCard: { name: "classify", lines: ["test the top range", "else the next range", "else: everything left"], foot: "→ the first true test wins" },

    intent:
      "Put a value into exactly one of several ordered ranges: test the ranges from one end, and let the first true test decide.",

    analogy: {
      icon: "🪙",
      title: "A coin-sorting tray",
      text:
        "Coins slide down a ramp past holes that get bigger along the way. Each coin drops through the first hole it fits and never sees the rest. Put the holes in the wrong order and the biggest hole catches every coin."
    },

    cues: ["grade / category / level", "between … and …", "band / tier", "classify …", "depending on the range", "if at least … otherwise …"],
    cueSummary: "One value, <b>three or more</b> possible outcomes, decided by ranges that don't overlap.",
    cueExamples: [
      "Turn an exam score into a letter grade.",
      "Label a BMI as underweight, normal, overweight or obese.",
      "Choose a shipping fee by parcel weight."
    ],

    steps: [
      { n: 1, title: "Test the range at one end first", text: "Here the top range: is the score at least 85?" },
      { n: 2, title: "Otherwise, test the next range", text: "An else-if only runs when every test above it was false, so it needs just one bound." },
      { n: 3, title: "Catch everything that's left", text: "A final else handles whatever no test matched, so no value goes unlabelled." },
      { n: 4, title: "Give back the label", text: "Exactly one branch runs, so exactly one label is returned." }
    ],

    impl: {
      python: {
        file: "grade.py",
        plain: {
          lines: [
            [0, "def grade(score):"],
            [1, "    if score >= 85:"],
            [4, "        return \"A\""],
            [2, "    elif score >= 70:"],
            [4, "        return \"B\""],
            [2, "    elif score >= 55:"],
            [4, "        return \"C\""],
            [3, "    else:"],
            [4, "        return \"D\""]
          ]
        },
        idiomatic: null,
        idiomaticNote: "An <code>if / elif</code> chain <em>is</em> the idiomatic Python for ranges. Python's <code>match</code> can only test ranges through guards, which is longer."
      },
      java: {
        file: "Plans.java",
        plain: {
          lines: [
            [0, "static String grade(int score) {"],
            [1, "    if (score >= 85) {"],
            [4, "        return \"A\";"],
            [2, "    } else if (score >= 70) {"],
            [4, "        return \"B\";"],
            [2, "    } else if (score >= 55) {"],
            [4, "        return \"C\";"],
            [3, "    } else {"],
            [4, "        return \"D\";"],
            [0, "    }"],
            [0, "}"]
          ]
        },
        idiomatic: null,
        idiomaticNote: "In Java the <code>if / else if</code> chain is the idiomatic way. A <code>switch</code> matches exact values, not ranges."
      },
      rust: {
        file: "plans.rs",
        plain: {
          lines: [
            [0, "fn grade(score: i32) -> &'static str {"],
            [1, "    if score >= 85 {"],
            [4, "        \"A\""],
            [2, "    } else if score >= 70 {"],
            [4, "        \"B\""],
            [2, "    } else if score >= 55 {"],
            [4, "        \"C\""],
            [3, "    } else {"],
            [4, "        \"D\""],
            [0, "    }"],
            [0, "}"]
          ],
          note: "<code>if</code> is an expression in Rust: the chosen branch's value is the function's result, no <code>return</code> needed."
        },
        idiomatic: {
          lines: [
            [0, "fn grade(score: i32) -> &'static str {"],
            [0, "    match score {"],
            [[1, 4], "        85.. => \"A\","],
            [[2, 4], "        70..=84 => \"B\","],
            [[2, 4], "        55..=69 => \"C\","],
            [[3, 4], "        _ => \"D\","],
            [0, "    }"],
            [0, "}"]
          ],
          note: "<code>match</code> with range patterns. The compiler checks that every value is covered, and warns about unreachable arms."
        }
      },
      c: {
        file: "plans.c",
        plain: {
          lines: [
            [0, "const char *grade(int score) {"],
            [1, "    if (score >= 85) {"],
            [4, "        return \"A\";"],
            [2, "    } else if (score >= 70) {"],
            [4, "        return \"B\";"],
            [2, "    } else if (score >= 55) {"],
            [4, "        return \"C\";"],
            [3, "    } else {"],
            [4, "        return \"D\";"],
            [0, "    }"],
            [0, "}"]
          ],
          note: "Returning a string literal is safe in C: it lives for the whole program."
        },
        idiomatic: null,
        idiomaticNote: "C's <code>switch</code> only matches exact values, so the <code>if / else if</code> chain is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: {
          lines: [
            [0, "#include <string>"],
            [0, ""],
            [0, "std::string grade(int score) {"],
            [1, "    if (score >= 85) {"],
            [4, "        return \"A\";"],
            [2, "    } else if (score >= 70) {"],
            [4, "        return \"B\";"],
            [2, "    } else if (score >= 55) {"],
            [4, "        return \"C\";"],
            [3, "    } else {"],
            [4, "        return \"D\";"],
            [0, "    }"],
            [0, "}"]
          ]
        },
        idiomatic: null,
        idiomaticNote: "C++'s <code>switch</code> only matches exact values, so the <code>if / else if</code> chain is the idiomatic way."
      }
    },

    trace: {
      type: "branches",
      intro: "Running example: <b>Turn an exam score into a grade.</b> A is 85 and up, B is 70 and up, C is 55 and up, and anything lower is D.",
      input: { kind: "fields", fields: [{ name: "score", label: "score", min: 0, max: 100 }] },
      presets: [
        { label: "Score 78", input: { score: 78 } },
        { label: "Score 92", input: { score: 92 } },
        { label: "Exactly 55", input: { score: 55 } },
        { label: "Score 30", input: { score: 30 } }
      ],
      run({ score: s }) {
        const ev = [];
        const rows = RANGES.map((r) => ({ test: `score >= ${r.min}`, label: r.label, state: "" })).concat([{ test: "else", label: ELSE_LABEL, state: "" }]);
        const push = (step, msg, label = "?", tone = "") => ev.push({
          step, msg, tone,
          view: { subject: { k: "score", v: s }, rows: rows.map((r) => ({ ...r })) },
          vars: [{ k: "score", role: "fixed", v: s }, { k: "label", role: "result", v: label === "?" ? "?" : `"${label}"` }]
        });
        push(null, `Ready. score = ${s}. Which range is it in?`);
        for (let i = 0; i < RANGES.length; i++) {
          const r = RANGES[i];
          const ok = s >= r.min;
          rows[i].state = ok ? "hit" : "miss";
          if (ok) {
            for (let j = i + 1; j < rows.length; j++) rows[j].state = "skipped";
            push(i === 0 ? 1 : 2, `Is ${s} >= ${r.min}? Yes. This is the first true test, so it decides.`);
            push(4, `Return "${r.label}". ${rows.length - i - 1} test${rows.length - i - 1 > 1 ? "s" : ""} below ${rows.length - i - 1 > 1 ? "were" : "was"} never checked.`, r.label, "yes");
            return ev;
          }
          push(i === 0 ? 1 : 2, `Is ${s} >= ${r.min}? No, so move on to the next test.${i > 0 ? ` (We already know ${s} < ${RANGES[i - 1].min}.)` : ""}`);
        }
        rows[rows.length - 1].state = "hit";
        push(3, "Every test was false, so the else catches it.");
        push(4, `Return "${ELSE_LABEL}".`, ELSE_LABEL, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int"],
      returns: "string",
      cases: [100, 85, 84, 70, 69, 55, 54, 0].map((n) => ({ args: [n], expect: n >= 85 ? "A" : n >= 70 ? "B" : n >= 55 ? "C" : "D" })),
      snippets: {
        bugOrder: [{ args: [90], expect: "C" }, { args: [40], expect: "D" }],
        bugSeparate: [{ args: [90], expect: "C" }, { args: [40], expect: "D" }]
      }
    },

    pitfalls: [
      {
        kind: "dont",
        title: "Testing the ranges in the wrong order",
        text: "If the widest range comes first, it catches everything: here every score of 55 or more becomes a C, and the A and B branches can never run.",
        code: "bugOrder",
        take: "Go from one end to the other: highest lower bound first (or lowest upper bound first).",
        wide: true
      },
      {
        kind: "dont",
        title: "Separate ifs instead of else-if",
        text: "With separate <code>if</code>s, every true test runs, and the last one overwrites the earlier answers.",
        take: "Use else-if, so only the first true test counts."
      },
      {
        kind: "dont",
        title: "Double bounds that leave gaps",
        text: "<code>score &gt;= 70 and score &lt;= 84</code> works for whole numbers, but a score of 84.5 matches no range at all.",
        take: "With else-if, one bound per test is enough, and there are no gaps."
      },
      {
        kind: "do",
        title: "Test the boundaries",
        text: "Try 85 and 84, 70 and 69, 55 and 54. That's where <code>&gt;</code> versus <code>&gt;=</code> mistakes hide."
      },
      {
        kind: "do",
        title: "Always finish with else",
        text: "A final else makes sure every value gets a label, even ones you didn't expect, like a negative score."
      }
    ],

    snippets: {
      bugOrder: {
        python: [
          "def grade(score):",
          "    if score >= 55:          # ✗ the widest range first",
          "        return \"C\"",
          "    elif score >= 70:",
          "        return \"B\"",
          "    elif score >= 85:",
          "        return \"A\"",
          "    else:",
          "        return \"D\""
        ],
        java: [
          "static String grade(int score) {",
          "    if (score >= 55) {           // ✗ the widest range first",
          "        return \"C\";",
          "    } else if (score >= 70) {",
          "        return \"B\";",
          "    } else if (score >= 85) {",
          "        return \"A\";",
          "    } else {",
          "        return \"D\";",
          "    }",
          "}"
        ],
        rust: [
          "fn grade(score: i32) -> &'static str {",
          "    if score >= 55 {             // ✗ the widest range first",
          "        \"C\"",
          "    } else if score >= 70 {",
          "        \"B\"",
          "    } else if score >= 85 {",
          "        \"A\"",
          "    } else {",
          "        \"D\"",
          "    }",
          "}"
        ],
        c: [
          "const char *grade(int score) {",
          "    if (score >= 55) {           // ✗ the widest range first",
          "        return \"C\";",
          "    } else if (score >= 70) {",
          "        return \"B\";",
          "    } else if (score >= 85) {",
          "        return \"A\";",
          "    } else {",
          "        return \"D\";",
          "    }",
          "}"
        ],
        cpp: [
          "std::string grade(int score) {",
          "    if (score >= 55) {           // ✗ the widest range first",
          "        return \"C\";",
          "    } else if (score >= 70) {",
          "        return \"B\";",
          "    } else if (score >= 85) {",
          "        return \"A\";",
          "    } else {",
          "        return \"D\";",
          "    }",
          "}"
        ]
      },
      bugSeparate: {
        python: [
          "def grade(score):",
          "    label = \"D\"",
          "    if score >= 85:",
          "        label = \"A\"",
          "    if score >= 70:",
          "        label = \"B\"",
          "    if score >= 55:",
          "        label = \"C\"",
          "    return label"
        ],
        java: [
          "static String grade(int score) {",
          "    String label = \"D\";",
          "    if (score >= 85) {",
          "        label = \"A\";",
          "    }",
          "    if (score >= 70) {",
          "        label = \"B\";",
          "    }",
          "    if (score >= 55) {",
          "        label = \"C\";",
          "    }",
          "    return label;",
          "}"
        ],
        rust: [
          "fn grade(score: i32) -> &'static str {",
          "    let mut label = \"D\";",
          "    if score >= 85 {",
          "        label = \"A\";",
          "    }",
          "    if score >= 70 {",
          "        label = \"B\";",
          "    }",
          "    if score >= 55 {",
          "        label = \"C\";",
          "    }",
          "    label",
          "}"
        ],
        c: [
          "const char *grade(int score) {",
          "    const char *label = \"D\";",
          "    if (score >= 85) {",
          "        label = \"A\";",
          "    }",
          "    if (score >= 70) {",
          "        label = \"B\";",
          "    }",
          "    if (score >= 55) {",
          "        label = \"C\";",
          "    }",
          "    return label;",
          "}"
        ],
        cpp: [
          "std::string grade(int score) {",
          "    std::string label = \"D\";",
          "    if (score >= 85) {",
          "        label = \"A\";",
          "    }",
          "    if (score >= 70) {",
          "        label = \"B\";",
          "    }",
          "    if (score >= 55) {",
          "        label = \"C\";",
          "    }",
          "    return label;",
          "}"
        ]
      }
    },

    quiz: [
      {
        q: "What does {fn}(85) return?",
        options: ["A", "B", "C", "D"],
        answer: 0,
        explain: "The first test is score >= 85, and 85 >= 85 is true. Boundaries belong to the range whose test uses >=."
      },
      {
        q: "For a score of 60, how many conditions are tested before the answer is known?",
        options: ["1", "2", "3", "4"],
        answer: 2,
        explain: "60 >= 85 is false, 60 >= 70 is false, 60 >= 55 is true. Three tests, then it returns C."
      },
      {
        q: "This version has a bug. What does it return for 90?",
        code: "bugSeparate",
        options: ["A", "B", "C", "D"],
        answer: 2,
        explain: "All three ifs are true for 90, and each one overwrites the label. The last to run sets C. With else-if, the first true test would have stopped it at A."
      }
    ],

    exercise: {
      title: "Your turn: cinema ticket prices",
      task: "Write <code>ticket_price(age)</code>: under 3 is free (0), under 13 costs 5, under 65 costs 12, and 65 or older costs 7. This time start from the <b>lowest</b> range: the plan works from either end.",
      plan: [
        "Test one end first: is the age under 3?",
        "Otherwise test the next ranges: under 13? under 65?",
        "Everyone left is 65 or older",
        "Return the price for that range"
      ],
      fn: { python: "ticket_price", java: "ticketPrice", rust: "ticket_price", c: "ticket_price", cpp: "ticket_price" },
      params: ["int"],
      returns: "int",
      tests: [0, 2, 3, 12, 13, 64, 65, 90].map((a) => ({ args: [a], expect: a < 3 ? 0 : a < 13 ? 5 : a < 65 ? 12 : 7 })),
      solutions: {
        python: [
          "def ticket_price(age):",
          "    if age < 3:",
          "        return 0",
          "    elif age < 13:",
          "        return 5",
          "    elif age < 65:",
          "        return 12",
          "    else:",
          "        return 7"
        ],
        java: [
          "static int ticketPrice(int age) {",
          "    if (age < 3) {",
          "        return 0;",
          "    } else if (age < 13) {",
          "        return 5;",
          "    } else if (age < 65) {",
          "        return 12;",
          "    } else {",
          "        return 7;",
          "    }",
          "}"
        ],
        rust: [
          "fn ticket_price(age: i32) -> i32 {",
          "    if age < 3 {",
          "        0",
          "    } else if age < 13 {",
          "        5",
          "    } else if age < 65 {",
          "        12",
          "    } else {",
          "        7",
          "    }",
          "}"
        ],
        c: [
          "int ticket_price(int age) {",
          "    if (age < 3) {",
          "        return 0;",
          "    } else if (age < 13) {",
          "        return 5;",
          "    } else if (age < 65) {",
          "        return 12;",
          "    } else {",
          "        return 7;",
          "    }",
          "}"
        ],
        cpp: [
          "int ticket_price(int age) {",
          "    if (age < 3) {",
          "        return 0;",
          "    } else if (age < 13) {",
          "        return 5;",
          "    } else if (age < 65) {",
          "        return 12;",
          "    } else {",
          "        return 7;",
          "    }",
          "}"
        ]
      }
    },

    compare: {
      intro: "Four plans that all choose between outcomes. The shape of the question tells you which one fits.",
      rows: [
        { id: "B2", name: "Choose one of two", question: "Pass or fail?", shape: "if … else", result: "2 outcomes" },
        { id: "B3", name: "Multi-way classification", question: "Which grade, A to D?", shape: "if … else if … else if … else, over ordered ranges", result: "3+ outcomes", self: true },
        { id: "B4", name: "Two-factor decision", question: "Member and over 4 kg?", shape: "nested ifs, or conditions joined with and / or", result: "a combination" },
        { id: "B5", name: "Lookup table", question: "What's the price of size “M”?", shape: "a dictionary / map from exact keys to values", result: "many exact keys" }
      ],
      table: {
        head: ["Plan", "Outcomes", "Decided by", "Typical question"],
        rows: [
          ["Choose one of two", "2", "one condition", "Is the number even?"],
          ["Multi-way classification", "3 or more", "ordered ranges of one value", "Which tax band is this income in?"],
          ["Two-factor decision", "2 or more", "two independent facts", "Discount for members over 4 kg?"],
          ["Lookup table", "many", "exact values, not ranges", "Which city has this area code?"]
        ],
        selfRow: 1
      }
    },

    related: {
      buildsOn: [{ id: "B2", why: "each test in the ladder is a yes/no choice" }],
      leadsTo: [
        { id: "B4", why: "when the outcome depends on two facts" },
        { id: "B5", why: "when the outcomes are exact values, not ranges" },
        { id: "D14", why: "classify every item in a list, then count each class" }
      ]
    }
  };
})();
