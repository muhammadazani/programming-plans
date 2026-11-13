/* Plan data: E1 · Rows and columns
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const tri = (n) => Array.from({ length: n }, (_, r) => "*".repeat(r + 1) + "\n").join("");

  window.PLAN = {
    id: "E1",
    slug: "rows-and-columns",
    title: "Rows and columns",
    highlight: "columns",
    aka: ["nested loops", "2D pattern", "row-by-row loop"],
    group: "E",
    level: "Core",
    core: true,
    fn: { python: "triangle", java: "triangle", rust: "triangle", c: "triangle", cpp: "triangle" },

    hero: {
      type: "grid",
      rows: 4,
      tag: "row 4: ****",
      alt: "A staircase of cubes: one cube in the first row, two in the second, three in the third and four in the fourth, with the last cube amber"
    },
    planCard: { name: "rows × cols", lines: ["for each row", "for each column", "print one cell"], foot: "↵ end the row" },

    intent:
      "Produce something two-dimensional: an outer loop walks the rows, an inner loop walks the columns of the current row, and each row ends with a line break.",

    analogy: {
      icon: "📝",
      title: "Writing on lined paper",
      text:
        "You write characters along a line from left to right, then move to the start of the next line and do it again. Your pen moving along the line is the inner loop; moving down the page is the outer loop."
    },

    cues: ["rows and columns", "grid / table / board", "a pattern of * or #", "for every row … for every column", "n × m", "multiplication table"],
    cueSummary: "The output is <b>two-dimensional</b>: several lines, and each line has its own number of items.",
    cueExamples: [
      "Print a right triangle of stars with n rows.",
      "Print an n × n multiplication table.",
      "Draw a chessboard of # and . characters."
    ],

    steps: [
      { n: 1, title: "Outer loop: one pass per row", text: "row goes 1, 2, …, n." },
      { n: 2, title: "Inner loop: one pass per column of this row", text: "Here the row number decides how many columns there are: row 3 gets 3 stars." },
      { n: 3, title: "Print one cell", text: "Print a star without a line break, so the whole row stays on one line." },
      { n: 4, title: "End the row", text: "After the inner loop finishes, print a line break. It sits inside the outer loop but outside the inner one." }
    ],

    impl: {
      python: {
        file: "triangle.py",
        plain: {
          lines: [
            [0, "def triangle(n):"],
            [1, "    for row in range(1, n + 1):"],
            [2, "        for col in range(1, row + 1):"],
            [3, "            print(\"*\", end=\"\")"],
            [4, "        print()"]
          ],
          note: "<code>end=\"\"</code> stops <code>print</code> from adding its usual line break."
        },
        idiomatic: {
          lines: [
            [0, "def triangle(n):"],
            [1, "    for row in range(1, n + 1):"],
            [[2, 3, 4], "        print(\"*\" * row)"]
          ],
          note: "<code>\"*\" * row</code> repeats the string, which replaces the inner loop. The inner loop still happens; Python does it for you."
        }
      },
      java: {
        file: "Plans.java",
        plain: {
          lines: [
            [0, "static void triangle(int n) {"],
            [1, "    for (int row = 1; row <= n; row++) {"],
            [2, "        for (int col = 1; col <= row; col++) {"],
            [3, "            System.out.print(\"*\");"],
            [0, "        }"],
            [4, "        System.out.println();"],
            [0, "    }"],
            [0, "}"]
          ],
          note: "<code>print</code> stays on the line; <code>println</code> ends it."
        },
        idiomatic: {
          lines: [
            [0, "static void triangle(int n) {"],
            [1, "    for (int row = 1; row <= n; row++) {"],
            [[2, 3, 4], "        System.out.println(\"*\".repeat(row));"],
            [0, "    }"],
            [0, "}"]
          ],
          note: "<code>String.repeat</code> (Java 11+) builds the row in one call."
        }
      },
      rust: {
        file: "plans.rs",
        plain: {
          lines: [
            [0, "fn triangle(n: i32) {"],
            [1, "    for row in 1..=n {"],
            [2, "        for _col in 1..=row {"],
            [3, "            print!(\"*\");"],
            [0, "        }"],
            [4, "        println!();"],
            [0, "    }"],
            [0, "}"]
          ],
          note: "The column number itself isn't used, so by Rust convention it's named <code>_col</code>."
        },
        idiomatic: {
          lines: [
            [0, "fn triangle(n: i32) {"],
            [1, "    for row in 1..=n {"],
            [[2, 3, 4], "        println!(\"{}\", \"*\".repeat(row as usize));"],
            [0, "    }"],
            [0, "}"]
          ],
          note: "<code>str::repeat</code> builds the row; <code>as usize</code> converts the row number to a count."
        }
      },
      c: {
        file: "plans.c",
        plain: {
          lines: [
            [0, "#include <stdio.h>"],
            [0, ""],
            [0, "void triangle(int n) {"],
            [1, "    for (int row = 1; row <= n; row++) {"],
            [2, "        for (int col = 1; col <= row; col++) {"],
            [3, "            putchar('*');"],
            [0, "        }"],
            [4, "        putchar('\\n');"],
            [0, "    }"],
            [0, "}"]
          ]
        },
        idiomatic: null,
        idiomaticNote: "C has no string-repeat function, so the nested loop is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: {
          lines: [
            [0, "#include <iostream>"],
            [0, ""],
            [0, "void triangle(int n) {"],
            [1, "    for (int row = 1; row <= n; row++) {"],
            [2, "        for (int col = 1; col <= row; col++) {"],
            [3, "            std::cout << '*';"],
            [0, "        }"],
            [4, "        std::cout << '\\n';"],
            [0, "    }"],
            [0, "}"]
          ]
        },
        idiomatic: {
          lines: [
            [0, "#include <iostream>"],
            [0, "#include <string>"],
            [0, ""],
            [0, "void triangle(int n) {"],
            [1, "    for (int row = 1; row <= n; row++) {"],
            [[2, 3, 4], "        std::cout << std::string(row, '*') << '\\n';"],
            [0, "    }"],
            [0, "}"]
          ],
          note: "<code>std::string(count, ch)</code> builds a string of <code>count</code> copies of <code>ch</code>."
        }
      }
    },

    trace: {
      type: "grid",
      speed: 550,
      intro: "Running example: <b>Print a right triangle of stars with n rows</b>, where row 1 has one star, row 2 has two, and so on.",
      input: { kind: "fields", fields: [{ name: "n", label: "n", min: 1, max: 7 }] },
      presets: [
        { label: "n = 4", input: { n: 4 } },
        { label: "n = 3", input: { n: 3 } },
        { label: "n = 6", input: { n: 6 } }
      ],
      run({ n }) {
        const ev = [];
        const cells = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (c <= r ? "used" : "")));
        let output = "", newlines = 0, stars = 0;
        const push = (step, msg, row, col, tone = "") => ev.push({
          step, msg, tone,
          view: { cells: cells.map((r) => r.slice()), output, row: row - 1, newlines },
          vars: [
            { k: "row", role: "stepper", v: row || "—", of: n },
            { k: "col", role: "stepper", v: col || "—", of: row || undefined },
            { k: "stars", role: "count", v: stars }
          ]
        });
        push(null, `Ready. n = ${n}, so the triangle will have ${n} rows.`, 0, 0);
        for (let row = 1; row <= n; row++) {
          push(1, `Row ${row} starts (row = ${row}). It needs ${row} star${row > 1 ? "s" : ""}.`, row, 0);
          for (let col = 1; col <= row; col++) {
            cells[row - 1][col - 1] = "current";
            push(2, `Column ${col} of ${row} (col = ${col}).`, row, col);
            cells[row - 1][col - 1] = "filled";
            output += "*"; stars++;
            push(3, "Print * and stay on the same line.", row, col);
          }
          output += "\n"; newlines++;
          const last = row === n;
          push(4, last ? `Row ${row} done: print a line break. ${n === 1 ? "The only row is" : `All ${n} rows are`} printed: ${stars} star${stars === 1 ? "" : "s"} in total.` : `Row ${row} done: print a line break and move to the next row.`, row, 0, last ? "yes" : "");
        }
        return ev;
      }
    },

    checks: {
      params: ["int"],
      returns: "void",
      cases: [1, 3, 4, 0].map((n) => ({ args: [n], stdout: tri(n) })),
      snippets: {
        bugNewlineInside: [{ args: [3], stdout: "*\n*\n*\n*\n*\n*\n" }],
        bugInnerN: [{ args: [3], stdout: "***\n***\n***\n" }]
      }
    },

    pitfalls: [
      {
        kind: "dont",
        title: "A line break inside the inner loop",
        text: "One level of indentation too deep, and every star gets its own line: you get a tall column instead of a triangle.",
        code: "bugNewlineInside",
        take: "The line break belongs after the inner loop, still inside the outer loop.",
        wide: true
      },
      {
        kind: "dont",
        title: "An inner loop that ignores the row",
        text: "Looping the columns up to <code>n</code> instead of <code>row</code> prints an n × n square.",
        take: "Ask: how many columns does this particular row have?"
      },
      {
        kind: "dont",
        title: "Reusing the loop variable",
        text: "In C or Java, writing <code>i</code> for both loops (or sharing one variable) lets the inner loop overwrite the outer loop's counter.",
        take: "Give each loop its own name, such as row and col."
      },
      {
        kind: "do",
        title: "Count the work",
        text: "The star is printed 1 + 2 + … + n = n(n+1)/2 times. For n = 1000 that's 500,500 prints. Nested loops grow fast."
      },
      {
        kind: "do",
        title: "Name the loops after what they walk",
        text: "<code>row</code> and <code>col</code> say what each loop is for; <code>i</code> and <code>j</code> don't."
      }
    ],

    snippets: {
      bugNewlineInside: {
        python: [
          "def triangle(n):",
          "    for row in range(1, n + 1):",
          "        for col in range(1, row + 1):",
          "            print(\"*\", end=\"\")",
          "            print()          # ✗ one level too deep"
        ],
        java: [
          "static void triangle(int n) {",
          "    for (int row = 1; row <= n; row++) {",
          "        for (int col = 1; col <= row; col++) {",
          "            System.out.print(\"*\");",
          "            System.out.println();   // ✗ inside the inner loop",
          "        }",
          "    }",
          "}"
        ],
        rust: [
          "fn triangle(n: i32) {",
          "    for row in 1..=n {",
          "        for _col in 1..=row {",
          "            print!(\"*\");",
          "            println!();        // ✗ inside the inner loop",
          "        }",
          "    }",
          "}"
        ],
        c: [
          "void triangle(int n) {",
          "    for (int row = 1; row <= n; row++) {",
          "        for (int col = 1; col <= row; col++) {",
          "            putchar('*');",
          "            putchar('\\n');      // ✗ inside the inner loop",
          "        }",
          "    }",
          "}"
        ],
        cpp: [
          "void triangle(int n) {",
          "    for (int row = 1; row <= n; row++) {",
          "        for (int col = 1; col <= row; col++) {",
          "            std::cout << '*';",
          "            std::cout << '\\n';  // ✗ inside the inner loop",
          "        }",
          "    }",
          "}"
        ]
      },
      bugInnerN: {
        python: [
          "def triangle(n):",
          "    for row in range(1, n + 1):",
          "        for col in range(1, n + 1):",
          "            print(\"*\", end=\"\")",
          "        print()"
        ],
        java: [
          "static void triangle(int n) {",
          "    for (int row = 1; row <= n; row++) {",
          "        for (int col = 1; col <= n; col++) {",
          "            System.out.print(\"*\");",
          "        }",
          "        System.out.println();",
          "    }",
          "}"
        ],
        rust: [
          "fn triangle(n: i32) {",
          "    for _row in 1..=n {",
          "        for _col in 1..=n {",
          "            print!(\"*\");",
          "        }",
          "        println!();",
          "    }",
          "}"
        ],
        c: [
          "void triangle(int n) {",
          "    for (int row = 1; row <= n; row++) {",
          "        for (int col = 1; col <= n; col++) {",
          "            putchar('*');",
          "        }",
          "        putchar('\\n');",
          "    }",
          "}"
        ],
        cpp: [
          "void triangle(int n) {",
          "    for (int row = 1; row <= n; row++) {",
          "        for (int col = 1; col <= n; col++) {",
          "            std::cout << '*';",
          "        }",
          "        std::cout << '\\n';",
          "    }",
          "}"
        ]
      }
    },

    quiz: [
      {
        q: "How many stars does {fn}(4) print in total?",
        options: ["4", "8", "10", "16"],
        answer: 2,
        explain: "1 + 2 + 3 + 4 = 10. Each row prints as many stars as its row number."
      },
      {
        q: "This version has a bug. What shape does it print for n = 3?",
        code: "bugInnerN",
        options: ["a triangle", "a 3 × 3 square", "one long line"],
        answer: 1,
        explain: "The inner loop always runs n times, whatever the row, so every row has 3 stars: a square."
      },
      {
        q: "If the line break moves inside the inner loop, how many lines does {fn}(3) print?",
        options: ["3", "6", "9"],
        answer: 1,
        explain: "Every star is followed by a line break, and there are 1 + 2 + 3 = 6 stars, so you get 6 lines of one star each."
      }
    ],

    exercise: {
      title: "Your turn: a rectangle of #",
      task: "Write <code>rectangle(rows, cols)</code> that prints <code>rows</code> lines, each with <code>cols</code> <code>#</code> characters. This time every row has the same number of columns.",
      plan: [
        "Outer loop: one pass per row",
        "Inner loop: one pass per column (cols of them)",
        "Print one # without a line break",
        "After the inner loop: end the row"
      ],
      fn: { python: "rectangle", java: "rectangle", rust: "rectangle", c: "rectangle", cpp: "rectangle" },
      params: ["int", "int"],
      returns: "void",
      tests: [
        { args: [2, 3], stdout: "###\n###\n" },
        { args: [1, 5], stdout: "#####\n" },
        { args: [3, 1], stdout: "#\n#\n#\n" },
        { args: [0, 4], stdout: "" }
      ],
      solutions: {
        python: [
          "def rectangle(rows, cols):",
          "    for row in range(rows):",
          "        for col in range(cols):",
          "            print(\"#\", end=\"\")",
          "        print()"
        ],
        java: [
          "static void rectangle(int rows, int cols) {",
          "    for (int row = 0; row < rows; row++) {",
          "        for (int col = 0; col < cols; col++) {",
          "            System.out.print(\"#\");",
          "        }",
          "        System.out.println();",
          "    }",
          "}"
        ],
        rust: [
          "fn rectangle(rows: i32, cols: i32) {",
          "    for _row in 0..rows {",
          "        for _col in 0..cols {",
          "            print!(\"#\");",
          "        }",
          "        println!();",
          "    }",
          "}"
        ],
        c: [
          "#include <stdio.h>",
          "",
          "void rectangle(int rows, int cols) {",
          "    for (int row = 0; row < rows; row++) {",
          "        for (int col = 0; col < cols; col++) {",
          "            putchar('#');",
          "        }",
          "        putchar('\\n');",
          "    }",
          "}"
        ],
        cpp: [
          "#include <iostream>",
          "",
          "void rectangle(int rows, int cols) {",
          "    for (int row = 0; row < rows; row++) {",
          "        for (int col = 0; col < cols; col++) {",
          "            std::cout << '#';",
          "        }",
          "        std::cout << '\\n';",
          "    }",
          "}"
        ]
      }
    },

    compare: {
      intro: "Loop plans that look alike. Count the loops, and check where the inner loop starts and stops.",
      rows: [
        { id: "C1", name: "Repeat n times", question: "Print one line of n stars", shape: "one loop", result: "1D: one line" },
        { id: "E1", name: "Rows and columns", question: "Print a triangle or grid", shape: "outer loop for rows, inner loop for the columns of each row", result: "2D: rows of cells", self: true },
        { id: "E2", name: "Every pair", question: "Compare each pair of items once", shape: "inner loop starts just after the outer index (j from i + 1)", result: "each pair once" },
        { id: "E3", name: "Walk a 2D table", question: "Total every cell of a table", shape: "for each row of the data, for each cell in that row", result: "visits stored data" }
      ],
      table: {
        head: ["Plan", "Loops", "Inner loop runs", "Typical task"],
        rows: [
          ["Repeat n times", "1", "—", "Print 5 stars on one line"],
          ["Rows and columns", "2, nested", "over the columns of the current row", "Print a multiplication table"],
          ["Every pair", "2, nested", "from i + 1 to the end", "Find two numbers that add up to 10"],
          ["Walk a 2D table", "2, nested", "over the cells of a stored row", "Find the largest value in a grid"]
        ],
        selfRow: 1
      }
    },

    related: {
      buildsOn: [{ id: "C1", why: "each of the two loops is a counted loop" }],
      leadsTo: [
        { id: "E2", why: "an inner loop that starts after the outer one" },
        { id: "E3", why: "the same two loops over data stored in a grid" }
      ]
    }
  };
})();
