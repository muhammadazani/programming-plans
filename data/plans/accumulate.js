/* Plan data: D2 · Accumulate
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "D2",
    slug: "accumulate",
    title: "Accumulate",
    highlight: "Accumulate",
    aka: ["running total", "sum / product", "accumulator", "fold"],
    group: "D",
    level: "Foundations",
    core: true,
    fn: { python: "total_of", java: "totalOf", rust: "total_of", c: "total_of", cpp: "total_of" },

    hero: {
      type: "tiles",
      values: [12, 5, 30, 8],
      colors: ["pale", "pale", "pale", "amber"],
      tagAt: 3,
      tag: "total = 55",
      alt: "Four cubes, 12, 5, 30 and 8, with the last one amber and the tag total = 55"
    },
    planCard: { name: "accumulate", lines: ["total = 0", "for each item", "total += item"], foot: "→ return total" },

    intent: "Combine every item into one value: start from a neutral value, and fold each item into a running total as you go.",

    analogy: {
      icon: "🧾",
      title: "A shop till",
      text: "The till shows 0.00 before the first item is scanned. Each scan adds that item's price to the running total on the display. When the last item is scanned, the display already shows the amount to pay."
    },

    cues: ["total", "sum of …", "add up …", "product of …", "altogether", "in total"],
    cueSummary: "Many items go in, <b>one combined value</b> comes out: a sum, a product, or another running combination.",
    cueExamples: [
      "What is the total price of the items in the basket?",
      "How many kilometres did I run this week?",
      "What is 1 × 2 × … × n (n factorial)?"
    ],

    steps: [
      { n: 1, title: "Start from the neutral value", text: "0 for a sum (adding 0 changes nothing), 1 for a product (multiplying by 1 changes nothing)." },
      { n: 2, title: "Visit each item", text: "Every item contributes, so every item is visited." },
      { n: 3, title: "Fold it into the total", text: "total = total + item. The total always holds the sum of the items seen so far." },
      { n: 4, title: "Return the total", text: "After the loop, the running total is the final answer." }
    ],

    impl: {
      python: {
        file: "total.py",
        plain: { lines: [
          [0, "def total_of(amounts):"],
          [1, "    total = 0"],
          [2, "    for a in amounts:"],
          [3, "        total += a"],
          [4, "    return total"]
        ] },
        idiomatic: { lines: [
          [0, "def total_of(amounts):"],
          [[1, 2, 3, 4], "    return sum(amounts)"]
        ], note: "<code>sum()</code> starts at 0 and adds every item. For a product, use <code>math.prod()</code>." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static int totalOf(int[] amounts) {"],
          [1, "    int total = 0;"],
          [2, "    for (int a : amounts) {"],
          [3, "        total += a;"],
          [0, "    }"],
          [4, "    return total;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "static int totalOf(int[] amounts) {"],
          [[1, 2, 3, 4], "    return Arrays.stream(amounts).sum();"],
          [0, "}"]
        ], note: "An <code>IntStream</code> has <code>sum()</code> built in." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn total_of(amounts: &[i32]) -> i32 {"],
          [1, "    let mut total = 0;"],
          [2, "    for &a in amounts {"],
          [3, "        total += a;"],
          [0, "    }"],
          [4, "    total"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "fn total_of(amounts: &[i32]) -> i32 {"],
          [[1, 2, 3, 4], "    amounts.iter().sum()"],
          [0, "}"]
        ], note: "<code>Iterator::sum</code> is the accumulate plan; <code>.product()</code> multiplies instead." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "int total_of(const int amounts[], size_t n) {"],
          [1, "    int total = 0;"],
          [2, "    for (size_t i = 0; i < n; i++) {"],
          [3, "        total += amounts[i];"],
          [0, "    }"],
          [4, "    return total;"],
          [0, "}"]
        ] },
        idiomatic: null,
        idiomaticNote: "C has no built-in sum, so the loop is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "#include <vector>"],
          [0, ""],
          [0, "int total_of(const std::vector<int>& amounts) {"],
          [1, "    int total = 0;"],
          [2, "    for (int a : amounts) {"],
          [3, "        total += a;"],
          [0, "    }"],
          [4, "    return total;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "#include <numeric>"],
          [0, "#include <vector>"],
          [0, ""],
          [0, "int total_of(const std::vector<int>& amounts) {"],
          [[1, 2, 3, 4], "    return std::accumulate(amounts.begin(), amounts.end(), 0);"],
          [0, "}"]
        ], note: "The last argument, <code>0</code>, is the starting value from step 1." }
      }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>What is the total of a list of amounts?</b>",
      input: { kind: "list", max: 10, placeholder: "your amounts: 12, 5, 30" },
      presets: [
        { label: "Four amounts", input: [12, 5, 30, 8] },
        { label: "With a refund", input: [20, -5, 15] },
        { label: "One item", input: [100] },
        { label: "Empty list", input: [] }
      ],
      run(list) {
        const n = list.length, ev = [], states = list.map(() => "");
        let total = 0;
        const snap = (step, msg, cur = -1, tone = "") => ev.push({
          step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur },
          vars: [{ k: "a", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "total", role: "gatherer", v: total }]
        });
        snap(null, n ? "Ready. Nothing added yet." : "Ready. The list is empty.");
        snap(1, "Start from the neutral value: total = 0.");
        for (let i = 0; i < n; i++) {
          states[i] = "current";
          snap(2, `Visit item [${i}]: a = ${list[i]}`, i);
          const before = total;
          total += list[i];
          states[i] = "added";
          snap(3, `Fold it in: total = ${before} + ${list[i]} = ${total}`, i);
        }
        snap(4, n ? `${n === 1 ? "The only item is" : `All ${n} items are`} added. Return ${total}.` : "Nothing to add. Return 0, the neutral value.", -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"],
      returns: "int",
      cases: [
        { args: [[12, 5, 30, 8]], expect: 55 },
        { args: [[]], expect: 0 },
        { args: [[-5, 5]], expect: 0 },
        { args: [[100]], expect: 100 }
      ],
      snippets: {
        bugReset: [{ args: [[3, 4, 5]], expect: 5 }],
        bugProduct: [{ args: [[2, 3, 4]], expect: 0 }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "Resetting the total inside the loop", wide: true, code: "bugReset",
        text: "Starting from zero on every pass throws away everything added so far. The function returns only the last item.",
        take: "Set the starting value once, before the loop." },
      { kind: "dont", title: "Starting a product at 0",
        text: "0 × anything is 0, so a product that starts at 0 stays 0 forever. Products start at 1.",
        take: "Start from the value that changes nothing: 0 for +, 1 for ×." },
      { kind: "dont", title: "Ignoring overflow",
        text: "In Java, C, C++ and Rust an <code>int</code> holds at most 2,147,483,647. Big totals wrap around to negative numbers in Java and C, and panic in a Rust debug build.",
        take: "Use a wider type (long, i64) when totals can grow large." },
      { kind: "do", title: "Read the total as “so far”",
        text: "Inside the loop, total always means “the sum of the items visited so far”. Saying that out loud catches most bugs." },
      { kind: "do", title: "Use the built-in once you understand it",
        text: "<code>sum()</code>, <code>Arrays.stream().sum()</code>, <code>.iter().sum()</code> and <code>std::accumulate</code> are this plan." }
    ],

    snippets: {
      bugReset: {
        python: ["def total_of(amounts):", "    total = 0", "    for a in amounts:", "        total = 0        # ✗ reset on every pass", "        total += a", "    return total"],
        java: ["static int totalOf(int[] amounts) {", "    int total = 0;", "    for (int a : amounts) {", "        total = 0;       // ✗ reset on every pass", "        total += a;", "    }", "    return total;", "}"],
        rust: ["fn total_of(amounts: &[i32]) -> i32 {", "    let mut total = 0;", "    for &a in amounts {", "        total = 0;       // ✗ reset on every pass", "        total += a;", "    }", "    total", "}"],
        c: ["int total_of(const int amounts[], size_t n) {", "    int total = 0;", "    for (size_t i = 0; i < n; i++) {", "        total = 0;       // ✗ reset on every pass", "        total += amounts[i];", "    }", "    return total;", "}"],
        cpp: ["int total_of(const std::vector<int>& amounts) {", "    int total = 0;", "    for (int a : amounts) {", "        total = 0;       // ✗ reset on every pass", "        total += a;", "    }", "    return total;", "}"]
      },
      bugProduct: {
        python: ["def total_of(numbers):", "    product = 0", "    for x in numbers:", "        product *= x", "    return product"],
        java: ["static int totalOf(int[] numbers) {", "    int product = 0;", "    for (int x : numbers) {", "        product *= x;", "    }", "    return product;", "}"],
        rust: ["fn total_of(numbers: &[i32]) -> i32 {", "    let mut product = 0;", "    for &x in numbers {", "        product *= x;", "    }", "    product", "}"],
        c: ["int total_of(const int numbers[], size_t n) {", "    int product = 0;", "    for (size_t i = 0; i < n; i++) {", "        product *= numbers[i];", "    }", "    return product;", "}"],
        cpp: ["int total_of(const std::vector<int>& numbers) {", "    int product = 0;", "    for (int x : numbers) {", "        product *= x;", "    }", "    return product;", "}"]
      }
    },

    quiz: [
      { q: "During {fn}([12, 5, 30, 8]), what is total right after the third item has been added?", options: ["30", "35", "47", "55"], answer: 2,
        explain: "12 + 5 + 30 = 47. The total always holds the sum of the items visited so far." },
      { q: "This version is meant to multiply all the numbers. What does it return for [2, 3, 4]?", code: "bugProduct", options: ["24", "9", "0"], answer: 2,
        explain: "The product starts at 0, and 0 × 2 × 3 × 4 is still 0. A product must start at 1." },
      { q: "What should {fn} return for an empty list?", options: ["0", "an error", "nothing"], answer: 0,
        explain: "The loop doesn't run, so the starting value is returned. That's why the neutral value matters: 0 is the right total for no items." }
    ],

    exercise: {
      title: "Your turn: multiply them all",
      task: "Write <code>product_of(numbers)</code> that returns all the numbers multiplied together. The product of an empty list is 1.",
      plan: ["Start the product at 1, the neutral value for ×", "Visit each number", "Multiply it into the product", "Return the product"],
      fn: { python: "product_of", java: "productOf", rust: "product_of", c: "product_of", cpp: "product_of" },
      params: ["int[]"],
      returns: "int",
      tests: [
        { args: [[2, 3, 4]], expect: 24 },
        { args: [[]], expect: 1 },
        { args: [[5]], expect: 5 },
        { args: [[-1, 2]], expect: -2 }
      ],
      solutions: {
        python: ["def product_of(numbers):", "    product = 1", "    for x in numbers:", "        product *= x", "    return product"],
        java: ["static int productOf(int[] numbers) {", "    int product = 1;", "    for (int x : numbers) {", "        product *= x;", "    }", "    return product;", "}"],
        rust: ["fn product_of(numbers: &[i32]) -> i32 {", "    let mut product = 1;", "    for &x in numbers {", "        product *= x;", "    }", "    product", "}"],
        c: ["int product_of(const int numbers[], size_t n) {", "    int product = 1;", "    for (size_t i = 0; i < n; i++) {", "        product *= numbers[i];", "    }", "    return product;", "}"],
        cpp: ["#include <vector>", "", "int product_of(const std::vector<int>& numbers) {", "    int product = 1;", "    for (int x : numbers) {", "        product *= x;", "    }", "    return product;", "}"]
      }
    },

    compare: {
      intro: "Three plans that all visit every item of <code>[12, 5, 30, 8]</code>. What they keep track of is what differs.",
      data: [12, 5, 30, 8],
      rows: [
        { id: "D2", name: "Accumulate", question: "What's the total?", result: "55", self: true },
        { id: "D1", name: "Counting", question: "How many are at least 10?", result: "2" },
        { id: "D3", name: "Average", question: "What's the average?", result: "13.75" }
      ],
      table: {
        head: ["Plan", "Keeps track of", "Starts at", "Result"],
        rows: [
          ["Accumulate", "a running total", "0 (or 1 for ×)", "the total"],
          ["Counting", "how many matched", "0", "a count"],
          ["Average", "a total and a count", "0 and 0", "total ÷ count"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "C1", why: "a loop that visits every item" }],
      leadsTo: [{ id: "D3", why: "divide the total by the count" }, { id: "D4", why: "keep the best value instead of a total" }, { id: "D11", why: "accumulate characters into a string" }]
    }
  };
})();
