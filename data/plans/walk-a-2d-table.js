/* Plan data: E3 · Walk a 2D table
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   The table is a list of lists (rows). In C it is passed flattened, row by
   row, with its number of rows and columns (checks type "int[][]" knows this). */

(function () {
  window.PLAN = {
    id: "E3",
    slug: "walk-a-2d-table",
    title: "Walk a 2D table",
    highlight: "2D table",
    aka: ["grid traversal", "matrix loop", "list of lists"],
    group: "E",
    level: "Core",
    core: false,
    fn: { python: "grid_total", java: "gridTotal", rust: "grid_total", c: "grid_total", cpp: "grid_total" },

    hero: { type: "grid", rows: 3, tag: "for row: for cell", alt: "A small staircase of cubes standing for the rows and cells of a table" },
    planCard: { name: "2D table", lines: ["set up the result", "for each row", "for each cell: use it"], foot: "→ return the result" },

    intent: "Visit every cell of a table stored as rows of values: an outer loop over the rows, an inner loop over the cells of the current row, and any single-pass plan in the middle.",

    analogy: { icon: "🗓️", title: "Totting up a timesheet", text: "A weekly timesheet has one row per person and one column per day. To get the total hours, you go down the rows and, in each row, along the days, adding each number to a running total. Each row's length decides how far you go along." },

    cues: ["table / grid / matrix", "rows and columns of numbers", "for each student, for each subject", "every cell", "a list of lists"],
    cueSummary: "The data is <b>already stored in two dimensions</b>, and you need to visit every value in it.",
    cueExamples: ["What is the total of every number in a table?", "What's the highest mark across all students and all subjects?", "How many seats in a cinema hall are free?"],

    steps: [
      { n: 1, title: "Set up the result", text: "Here the running total starts at 0, as in Accumulate (D2)." },
      { n: 2, title: "Outer loop: each row", text: "A row is itself a list of values." },
      { n: 3, title: "Inner loop: each cell of that row", text: "Go along the row from its first cell to its last." },
      { n: 4, title: "Use the cell", text: "Here: add it to the total. Any single-pass plan works: count, find the largest, test." },
      { n: 5, title: "Return the result", text: "After both loops, every cell has been visited once." }
    ],

    impl: {
      python: { file: "grid.py",
        plain: { lines: [[0, "def grid_total(grid):"], [1, "    total = 0"], [2, "    for row in grid:"], [3, "        for cell in row:"], [4, "            total += cell"], [5, "    return total"]] },
        idiomatic: { lines: [[0, "def grid_total(grid):"], [[1, 2, 3, 4, 5], "    return sum(sum(row) for row in grid)"]], note: "Each row's sum, then the sum of those." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int gridTotal(int[][] grid) {"], [1, "    int total = 0;"], [2, "    for (int[] row : grid) {"], [3, "        for (int cell : row) {"], [4, "            total += cell;"], [0, "        }"], [0, "    }"], [5, "    return total;"], [0, "}"]], note: "An <code>int[][]</code> is an array of rows, and each row is an <code>int[]</code>." },
        idiomatic: { lines: [[0, "static int gridTotal(int[][] grid) {"], [[1, 2, 3, 4, 5], "    return Arrays.stream(grid).flatMapToInt(Arrays::stream).sum();"], [0, "}"]], note: "<code>flatMapToInt</code> joins all the rows into one stream of cells." } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn grid_total(grid: &[Vec<i32>]) -> i32 {"], [1, "    let mut total = 0;"], [2, "    for row in grid {"], [3, "        for &cell in row {"], [4, "            total += cell;"], [0, "        }"], [0, "    }"], [5, "    total"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn grid_total(grid: &[Vec<i32>]) -> i32 {"], [[1, 2, 3, 4, 5], "    grid.iter().flatten().sum()"], [0, "}"]], note: "<code>flatten</code> turns the rows into one sequence of cells." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "int grid_total(const int cells[], size_t rows, size_t cols) {"], [1, "    int total = 0;"], [2, "    for (size_t r = 0; r < rows; r++) {"], [3, "        for (size_t c = 0; c < cols; c++) {"], [4, "            total += cells[r * cols + c];"], [0, "        }"], [0, "    }"], [5, "    return total;"], [0, "}"]], note: "The table is stored row after row in one array. Cell (r, c) is at position <code>r * cols + c</code>." },
        idiomatic: null, idiomaticNote: "Two index loops over a row-by-row array are the idiomatic C. (A fixed-size table can also be <code>int grid[ROWS][COLS]</code>.)" },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "int grid_total(const std::vector<std::vector<int>>& grid) {"], [1, "    int total = 0;"], [2, "    for (const auto& row : grid) {"], [3, "        for (int cell : row) {"], [4, "            total += cell;"], [0, "        }"], [0, "    }"], [5, "    return total;"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <numeric>"], [0, "#include <vector>"], [0, ""], [0, "int grid_total(const std::vector<std::vector<int>>& grid) {"], [1, "    int total = 0;"], [2, "    for (const auto& row : grid) {"], [[3, 4], "        total += std::accumulate(row.begin(), row.end(), 0);"], [0, "    }"], [5, "    return total;"], [0, "}"]], note: "<code>std::accumulate</code> does the inner loop for each row." } }
    },

    trace: {
      type: "grid",
      speed: 600,
      intro: "Running example: <b>What is the total of every number in the table?</b>",
      input: { kind: "none" },
      presets: [{ label: "2 × 3 table", input: [[1, 2, 3], [4, 5, 6]] }, { label: "3 × 3 table", input: [[2, 0, 1], [3, 3, 3], [1, 0, 5]] }, { label: "With negatives", input: [[1, -1], [2, -2]] }],
      run(grid) {
        const ev = [];
        const cols = Math.max(0, ...grid.map((r) => r.length));
        const cells = grid.map((r) => Array.from({ length: cols }, (_, c) => (c < r.length ? "used" : "")));
        const values = grid.map((r) => Array.from({ length: cols }, (_, c) => (c < r.length ? r[c] : "")));
        let total = 0, rowsDone = 0, log = "";
        const push = (step, msg, r = -1, c = -1, tone = "") => ev.push({ step, msg, tone,
          view: { cells: cells.map((x) => x.slice()), values, output: log, row: r, newlines: rowsDone },
          vars: [{ k: "row", role: "stepper", v: r >= 0 ? r : "—" }, { k: "cell", role: "walker", v: r >= 0 && c >= 0 ? grid[r][c] : "—" }, { k: "total", role: "gatherer", v: total }] });
        push(null, `Ready. ${grid.length} rows, ${grid.reduce((a, r) => a + r.length, 0)} cells.`);
        push(1, "Set up the result: total = 0.");
        grid.forEach((row, r) => {
          push(2, `Row ${r}: [${row.join(", ")}].`, r);
          row.forEach((v, c) => {
            cells[r][c] = "current";
            push(3, `Cell (${r}, ${c}) holds ${v}.`, r, c);
            total += v; cells[r][c] = "filled"; log += `+ ${v} → ${total}\n`;
            push(4, `Add it: total = ${total}.`, r, c);
          });
          rowsDone = r + 1;
        });
        push(5, `Every cell visited. Return ${total}.`, -1, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[][]"], returns: "int",
      cases: [{ args: [[[1, 2, 3], [4, 5, 6]]], expect: 21 }, { args: [[]], expect: 0 }, { args: [[[7]]], expect: 7 }, { args: [[[1, -1], [2, -2]]], expect: 0 }],
      snippets: { bugResetRow: [{ args: [[[1, 2], [3, 4]]], expect: 7 }], bugFirstRow: [{ args: [[[1, 2], [3, 4]]], expect: 6 }] }
    },

    pitfalls: [
      { kind: "dont", title: "Resetting the result for every row", wide: true, code: "bugResetRow", text: "Putting <code>total = 0</code> inside the outer loop starts the total again on every row, so only the last row is counted.", take: "Set up the result once, before both loops. (Per-row results are set up inside the outer loop on purpose.)" },
      { kind: "dont", title: "Walking the wrong row", text: "Looping over <code>grid[0]</code> inside the outer loop visits the first row again and again, instead of the current one.", take: "The inner loop walks the current row." },
      { kind: "dont", title: "Assuming every row is as long as the first", text: "Python, Java, Rust and C++ tables can have rows of different lengths. Indexing up to the first row's length can read past the end of a shorter row.", take: "Loop over each row's own cells." },
      { kind: "do", title: "Decide where each result lives", text: "A result for the whole table goes before both loops; a result per row goes inside the outer loop, before the inner one." },
      { kind: "do", title: "Mind the C layout", text: "A C table stored row by row puts cell (r, c) at <code>r * cols + c</code>. Swapping r and c reads the wrong cell." }
    ],

    snippets: {
      bugResetRow: {
        python: ["def grid_total(grid):", "    for row in grid:", "        total = 0            # ✗ starts again on every row", "        for cell in row:", "            total += cell", "    return total"],
        java: ["static int gridTotal(int[][] grid) {", "    int total = 0;", "    for (int[] row : grid) {", "        total = 0;           // ✗ starts again on every row", "        for (int cell : row) total += cell;", "    }", "    return total;", "}"],
        rust: ["fn grid_total(grid: &[Vec<i32>]) -> i32 {", "    let mut total = 0;", "    for row in grid {", "        total = 0;           // ✗ starts again on every row", "        for &cell in row { total += cell; }", "    }", "    total", "}"],
        c: ["int grid_total(const int cells[], size_t rows, size_t cols) {", "    int total = 0;", "    for (size_t r = 0; r < rows; r++) {", "        total = 0;           // ✗ starts again on every row", "        for (size_t c = 0; c < cols; c++) total += cells[r * cols + c];", "    }", "    return total;", "}"],
        cpp: ["int grid_total(const std::vector<std::vector<int>>& grid) {", "    int total = 0;", "    for (const auto& row : grid) {", "        total = 0;           // ✗ starts again on every row", "        for (int cell : row) total += cell;", "    }", "    return total;", "}"]
      },
      bugFirstRow: {
        python: ["def grid_total(grid):", "    total = 0", "    for row in grid:", "        for cell in grid[0]:", "            total += cell", "    return total"],
        java: ["static int gridTotal(int[][] grid) {", "    int total = 0;", "    for (int[] row : grid) {", "        for (int cell : grid[0]) total += cell;", "    }", "    return total;", "}"],
        rust: ["fn grid_total(grid: &[Vec<i32>]) -> i32 {", "    let mut total = 0;", "    for _row in grid {", "        for &cell in &grid[0] { total += cell; }", "    }", "    total", "}"],
        c: ["int grid_total(const int cells[], size_t rows, size_t cols) {", "    int total = 0;", "    for (size_t r = 0; r < rows; r++) {", "        for (size_t c = 0; c < cols; c++) total += cells[c];", "    }", "    return total;", "}"],
        cpp: ["int grid_total(const std::vector<std::vector<int>>& grid) {", "    int total = 0;", "    for (const auto& row : grid) {", "        (void) row;", "        for (int cell : grid[0]) total += cell;", "    }", "    return total;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([[2, 4], [1, 1], [0, 3]]) return?", options: ["6", "11", "3"], answer: 1, explain: "6 + 2 + 3 = 11: every cell of every row is added." },
      { q: "This version has a bug. What does it return for [[1, 2], [3, 4]]?", code: "bugFirstRow", options: ["10", "6", "3"], answer: 1, explain: "The inner loop walks grid[0] for every row, so it adds 1 + 2 twice: 6." },
      { q: "To get one total per row, where does total = 0 go?", options: ["Before both loops", "Inside the outer loop, before the inner loop", "Inside the inner loop"], answer: 1, explain: "Each row needs a fresh total, so it's set up at the start of each pass of the outer loop." }
    ],

    exercise: {
      title: "Your turn: one total per row",
      task: "Write <code>row_totals(grid)</code> that returns a list with the total of each row. (In C: <code>size_t row_totals(const int cells[], size_t rows, size_t cols, int out[])</code>, returning the number of rows.)",
      plan: ["Start with an empty result list", "Outer loop: each row; start a row total at 0", "Inner loop: add each cell to the row total", "After the inner loop, add the row total to the result", "Return the result"],
      fn: { python: "row_totals", java: "rowTotals", rust: "row_totals", c: "row_totals", cpp: "row_totals" },
      params: ["int[][]"], returns: "int[]",
      tests: [{ args: [[[1, 2], [3, 4]]], expect: [3, 7] }, { args: [[]], expect: [] }, { args: [[[5]]], expect: [5] }, { args: [[[1, 1, 1], [0, 0, 9]]], expect: [3, 9] }],
      solutions: {
        python: ["def row_totals(grid):", "    result = []", "    for row in grid:", "        total = 0", "        for cell in row:", "            total += cell", "        result.append(total)", "    return result"],
        java: ["static List<Integer> rowTotals(int[][] grid) {", "    List<Integer> result = new ArrayList<>();", "    for (int[] row : grid) {", "        int total = 0;", "        for (int cell : row) total += cell;", "        result.add(total);", "    }", "    return result;", "}"],
        rust: ["fn row_totals(grid: &[Vec<i32>]) -> Vec<i32> {", "    let mut result = Vec::new();", "    for row in grid {", "        let mut total = 0;", "        for &cell in row { total += cell; }", "        result.push(total);", "    }", "    result", "}"],
        c: ["size_t row_totals(const int cells[], size_t rows, size_t cols, int out[]) {", "    for (size_t r = 0; r < rows; r++) {", "        int total = 0;", "        for (size_t c = 0; c < cols; c++) total += cells[r * cols + c];", "        out[r] = total;", "    }", "    return rows;", "}"],
        cpp: ["#include <vector>", "", "std::vector<int> row_totals(const std::vector<std::vector<int>>& grid) {", "    std::vector<int> result;", "    for (const auto& row : grid) {", "        int total = 0;", "        for (int cell : row) total += cell;", "        result.push_back(total);", "    }", "    return result;", "}"]
      }
    },

    compare: {
      intro: "Nested-loop plans: where the data comes from and what the inner loop walks.",
      rows: [
        { id: "E3", name: "Walk a 2D table", question: "Total of every cell", shape: "for each stored row: for each cell in it", result: "visits existing data", self: true },
        { id: "E1", name: "Rows and columns", question: "Print a triangle of stars", shape: "for row: for col, printing as you go", result: "creates 2D output" },
        { id: "E2", name: "Every pair", question: "Any two numbers adding to 10?", shape: "for i: for j from i + 1, over one list", result: "pairs from one list" }
      ],
      table: { head: ["Plan", "Data", "Inner loop over", "Typical use"], rows: [["Walk a 2D table", "a list of lists", "the cells of the current row", "totals, maxima, counts in a grid"], ["Rows and columns", "none (it's generated)", "the columns of the row being printed", "patterns and tables"], ["Every pair", "one list", "the items after i", "comparing items with each other"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "E1", why: "an outer loop for rows, an inner loop for columns" }, { id: "D2", why: "the plan used on each cell" }],
      leadsTo: [{ id: "D4", why: "find the largest cell instead of the total" }, { id: "D10", why: "build a new table with every cell changed" }]
    }
  };
})();
