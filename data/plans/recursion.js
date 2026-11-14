/* Plan data: G3 · Recursion
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "G3",
    slug: "recursion",
    title: "Recursion",
    highlight: "Recursion",
    aka: ["recursive function", "base case + recursive case", "self-call"],
    group: "G",
    level: "Advanced",
    core: false,
    fn: { python: "factorial", java: "factorial", rust: "factorial", c: "factorial", cpp: "factorial" },

    hero: { type: "stack", labels: ["4!", "3!", "2!", "1!"], hit: 3, tag: "base case: 1", alt: "A staircase of calls: factorial of 4 calls 3, which calls 2, which calls 1, the amber base case" },
    planCard: { name: "recursion", lines: ["base case: answer directly", "else: call yourself on less", "combine the result"], foot: "→ each call returns to its caller" },

    intent: "Solve a problem by solving a smaller version of the same problem: a base case answers the smallest input directly, and every other case calls the function on something smaller and builds on the answer.",

    analogy: { icon: "🪆", title: "Russian dolls", text: "To count the dolls, you open the outer one and ask “how many are inside this one?”, then add one. Each doll asks the same question of the doll inside it, until the smallest doll, which simply answers “just me: 1”. Then the answers come back out, one doll at a time." },

    cues: ["defined in terms of itself", "n! = n × (n − 1)!", "nested / tree-shaped data", "a smaller version of the same problem", "folders inside folders"],
    cueSummary: "The answer for n can be built from the answer for <b>a smaller n</b>, and the smallest case is easy.",
    cueExamples: ["Compute n! = n × (n − 1) × … × 1.", "Add up the numbers from 1 to n.", "Count all the files in a folder and its subfolders."],

    steps: [
      { n: 1, title: "Base case: answer the smallest input directly", text: "Here: 0! and 1! are 1. Without a base case, the calls never stop." },
      { n: 2, title: "Recursive case: call yourself on a smaller input", text: "factorial(n − 1): one step closer to the base case." },
      { n: 3, title: "Combine and return", text: "Use the smaller answer to build this one: n × factorial(n − 1)." }
    ],

    impl: {
      python: { file: "factorial.py",
        plain: { lines: [[0, "def factorial(n):"], [1, "    if n <= 1:"], [1, "        return 1"], [2, "    smaller = factorial(n - 1)"], [3, "    return n * smaller"]], note: "Python limits recursion depth (about 1000 calls), so very deep recursion needs a loop instead." },
        idiomatic: { lines: [[0, "from math import prod"], [0, ""], [0, "def factorial(n):"], [[1, 2, 3], "    return prod(range(1, n + 1))"]], note: "Factorial is also an accumulate (D2) loop; <code>math.factorial(n)</code> exists too. Recursion shines for nested data, like folders." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int factorial(int n) {"], [1, "    if (n <= 1) {"], [1, "        return 1;"], [0, "    }"], [2, "    int smaller = factorial(n - 1);"], [3, "    return n * smaller;"], [0, "}"]], note: "<code>int</code> overflows above 12!; use <code>long</code> (up to 20!) or <code>BigInteger</code>." },
        idiomatic: null, idiomaticNote: "This recursive method is idiomatic Java; a loop works just as well for factorial." },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn factorial(n: i32) -> i32 {"], [1, "    if n <= 1 {"], [1, "        return 1;"], [0, "    }"], [2, "    let smaller = factorial(n - 1);"], [3, "    n * smaller"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn factorial(n: i32) -> i32 {"], [[1, 2, 3], "    (1..=n).product()"], [0, "}"]], note: "<code>product()</code> multiplies a range: the loop version of the same idea." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "int factorial(int n) {"], [1, "    if (n <= 1) {"], [1, "        return 1;"], [0, "    }"], [2, "    int smaller = factorial(n - 1);"], [3, "    return n * smaller;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "This recursive function is idiomatic C; each call gets its own copy of <code>n</code> on the call stack." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "int factorial(int n) {"], [1, "    if (n <= 1) {"], [1, "        return 1;"], [0, "    }"], [2, "    int smaller = factorial(n - 1);"], [3, "    return n * smaller;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "This recursive function is idiomatic C++ (it can even be <code>constexpr</code>, computed while compiling)." }
    },

    trace: {
      type: "stack",
      speed: 800,
      intro: "Running example: <b>n! = n × (n − 1) × … × 1.</b> Each box is one call of the function, waiting for the call below it to return.",
      input: { kind: "fields", fields: [{ name: "n", label: "n", min: 0, max: 8 }] },
      presets: [{ label: "4!", input: { n: 4 } }, { label: "1! (base case)", input: { n: 1 } }, { label: "6!", input: { n: 6 } }],
      run({ n }) {
        const ev = [], frames = [];
        const snap = (step, msg, tone = "") => ev.push({ step, msg, tone, view: { frames: frames.map((f) => ({ ...f })) },
          vars: [{ k: "calls waiting", role: "count", v: frames.filter((f) => f.state === "waiting").length }, { k: "depth", role: "stepper", v: frames.length }] });
        snap(null, `Ready. Call factorial(${n}).`);
        for (let k = n; ; k--) {
          frames.forEach((f) => { if (f.state === "active") f.state = "waiting"; });
          frames.push({ call: `factorial(${k})`, state: "active", note: "" });
          if (k <= 1) {
            frames[frames.length - 1].state = "base";
            frames[frames.length - 1].note = `${k} ≤ 1: base case`;
            snap(1, `factorial(${k}): ${k} ≤ 1, so answer directly with 1. No further call.`);
            frames[frames.length - 1].ret = 1;
            break;
          }
          frames[frames.length - 1].note = `needs factorial(${k - 1})`;
          snap(2, `factorial(${k}): not the base case, so call factorial(${k - 1}) and wait for its answer.`);
        }
        for (let i = frames.length - 1; i > 0; i--) {
          const below = frames[i].ret, parent = frames[i - 1], pk = n - (i - 1);
          frames[i].state = "done";
          parent.state = "active"; parent.ret = pk * below; parent.note = `${pk} × ${below}`;
          snap(3, `factorial(${pk}) gets ${below} back and returns ${pk} × ${below} = ${pk * below}.`, i === 1 ? "yes" : "");
        }
        if (frames.length === 1) snap(3, `factorial(${n}) returns 1.`, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int"], returns: "int",
      cases: [{ args: [0], expect: 1 }, { args: [1], expect: 1 }, { args: [4], expect: 24 }, { args: [5], expect: 120 }, { args: [10], expect: 3628800 }],
      snippets: { bugBaseZero: [{ args: [4], expect: 0 }], bugAdd: [{ args: [4], expect: 10 }] }
    },

    pitfalls: [
      { kind: "dont", title: "A wrong base case", wide: true, code: "bugBaseZero", text: "If the base case returns 0, every answer is multiplied by 0 on the way back out: factorial(4) becomes 0.", take: "Check the base case by hand: 1! must be 1." },
      { kind: "dont", title: "No base case, or a call that doesn't get smaller", text: "<code>factorial(n)</code> calling <code>factorial(n)</code> (or forgetting the base case) never stops, until the program runs out of stack and crashes.", take: "Every recursive call must move towards the base case." },
      { kind: "dont", title: "Combining the wrong way", text: "<code>n + factorial(n - 1)</code> computes 1 + 2 + … + n, not the product.", take: "Write the definition first (n! = n × (n − 1)!), then copy it into code." },
      { kind: "do", title: "Trust the smaller call", text: "When writing the recursive case, assume <code>factorial(n - 1)</code> already works, and only ask: how do I get n! from it?" },
      { kind: "do", title: "Prefer a loop for simple counting", text: "For factorials and sums, a loop (D2) is simpler and can't run out of stack. Recursion is the natural fit for nested data: folders, trees, nested lists." }
    ],

    snippets: {
      bugBaseZero: {
        python: ["def factorial(n):", "    if n <= 1:", "        return 0          # ✗ the base case should be 1", "    return n * factorial(n - 1)"],
        java: ["static int factorial(int n) {", "    if (n <= 1) return 0;   // ✗ the base case should be 1", "    return n * factorial(n - 1);", "}"],
        rust: ["fn factorial(n: i32) -> i32 {", "    if n <= 1 { return 0; }   // ✗ the base case should be 1", "    n * factorial(n - 1)", "}"],
        c: ["int factorial(int n) {", "    if (n <= 1) return 0;   // ✗ the base case should be 1", "    return n * factorial(n - 1);", "}"],
        cpp: ["int factorial(int n) {", "    if (n <= 1) return 0;   // ✗ the base case should be 1", "    return n * factorial(n - 1);", "}"]
      },
      bugAdd: {
        python: ["def factorial(n):", "    if n <= 1:", "        return 1", "    return n + factorial(n - 1)"],
        java: ["static int factorial(int n) {", "    if (n <= 1) return 1;", "    return n + factorial(n - 1);", "}"],
        rust: ["fn factorial(n: i32) -> i32 {", "    if n <= 1 { return 1; }", "    n + factorial(n - 1)", "}"],
        c: ["int factorial(int n) {", "    if (n <= 1) return 1;", "    return n + factorial(n - 1);", "}"],
        cpp: ["int factorial(int n) {", "    if (n <= 1) return 1;", "    return n + factorial(n - 1);", "}"]
      }
    },

    quiz: [
      { q: "How many calls of {fn} happen for {fn}(5), counting the first?", options: ["4", "5", "6"], answer: 1, explain: "factorial(5), (4), (3), (2) and (1): five calls. factorial(1) is the base case and makes no further call." },
      { q: "This version has a bug. What does it return for 4?", code: "bugAdd", options: ["24", "10", "4"], answer: 1, explain: "It adds instead of multiplying: 4 + 3 + 2 + 1 = 10." },
      { q: "Which call finishes first?", options: ["factorial(5)", "factorial(1)"], answer: 1, explain: "Each call waits for the one it made. The base case returns first, and the answers flow back up to factorial(5) last." }
    ],

    exercise: {
      title: "Your turn: sum from 1 to n, recursively",
      task: "Write <code>sum_to(n)</code> that returns 1 + 2 + … + n using recursion. sum_to(0) is 0.",
      plan: ["Base case: n is 0 or less? Return 0", "Recursive case: call sum_to(n - 1)", "Combine: return n + that answer"],
      fn: { python: "sum_to", java: "sumTo", rust: "sum_to", c: "sum_to", cpp: "sum_to" },
      params: ["int"], returns: "int",
      tests: [{ args: [4], expect: 10 }, { args: [0], expect: 0 }, { args: [1], expect: 1 }, { args: [10], expect: 55 }],
      solutions: {
        python: ["def sum_to(n):", "    if n <= 0:", "        return 0", "    return n + sum_to(n - 1)"],
        java: ["static int sumTo(int n) {", "    if (n <= 0) return 0;", "    return n + sumTo(n - 1);", "}"],
        rust: ["fn sum_to(n: i32) -> i32 {", "    if n <= 0 { return 0; }", "    n + sum_to(n - 1)", "}"],
        c: ["int sum_to(int n) {", "    if (n <= 0) return 0;", "    return n + sum_to(n - 1);", "}"],
        cpp: ["int sum_to(int n) {", "    if (n <= 0) return 0;", "    return n + sum_to(n - 1);", "}"]
      }
    },

    compare: {
      intro: "The same calculation, 4! = 24, with recursion and with a loop.",
      rows: [
        { id: "G3", name: "Recursion", question: "4! = 4 × 3!", shape: "a base case, then call yourself on n − 1 and combine", result: "calls stack up, then return", self: true },
        { id: "D2", name: "Accumulate", question: "1 × 2 × 3 × 4", shape: "a running product in one loop", result: "one variable updated" },
        { id: "C1", name: "Repeat n times", question: "Multiply 4 times", shape: "a counted loop", result: "one variable updated" }
      ],
      table: { head: ["Plan", "Repeats by", "Stops at", "Best for"], rows: [["Recursion", "calling itself on a smaller input", "the base case", "nested or tree-shaped problems"], ["Accumulate", "a loop over the items", "the end of the list", "totals and products of a list"], ["Repeat n times", "a counted loop", "n rounds", "a known number of repetitions"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "G1", why: "a function with a clear job" }, { id: "B1", why: "the base case is checked first, like a guard" }],
      leadsTo: [{ id: "D16", why: "a digit sum can be written recursively too" }]
    }
  };
})();
