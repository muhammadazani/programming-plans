/* Plan data: B5 · Lookup table
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const PRICES = [["S", 3], ["M", 4], ["L", 5]];

  window.PLAN = {
    id: "B5",
    slug: "lookup-table",
    title: "Lookup table",
    highlight: "Lookup",
    aka: ["dictionary / map lookup", "table-driven code", "key → value"],
    group: "B",
    level: "Foundations",
    core: false,
    fn: { python: "price_for", java: "priceFor", rust: "price_for", c: "price_for", cpp: "price_for" },

    hero: { type: "branches", labels: ["S→3", "M→4", "L→5", "?"], hit: 1, tag: "\"M\" → 4", alt: "A table of sizes and prices; the row for size M is amber" },
    planCard: { name: "lookup", lines: ["store key → value pairs", "look the key up", "missing? use a default"], foot: "→ return the value" },

    intent: "Replace a long chain of ifs on exact values with a table of key → value pairs, and look the answer up.",

    analogy: { icon: "📖", title: "A phone book", text: "To find a number, you don't ask “is it Aaron? is it Abby? is it Adam?” one by one. You go straight to the name and read the number next to it. And if the name isn't in the book, you know at once that there's no number." },

    cues: ["the price of size …", "for each code, the …", "translate … into …", "a list of fixed pairs", "if x is A … if x is B … if x is C …"],
    cueSummary: "The outcome depends on an <b>exact value</b> (a code, a name, a size), not on a range. There are many of them.",
    cueExamples: ["What is the price of a T-shirt in size S, M or L?", "Turn a day name like “Mon” into a number.", "Look up a country's dialling code."],

    steps: [
      { n: 1, title: "Store the pairs in a table", text: "A dictionary / map from each key to its value, written once, outside the function." },
      { n: 2, title: "Look the key up", text: "One lookup replaces the whole chain of ifs." },
      { n: 3, title: "Missing? Use a default", text: "Here -1 means “no such size”." },
      { n: 4, title: "Return the value", text: "The value stored next to the key." }
    ],

    impl: {
      python: { file: "prices.py",
        plain: { lines: [[1, "PRICES = {\"S\": 3, \"M\": 4, \"L\": 5}"], [0, ""], [0, "def price_for(size):"], [2, "    if size in PRICES:"], [4, "        return PRICES[size]"], [3, "    return -1"]] },
        idiomatic: { lines: [[1, "PRICES = {\"S\": 3, \"M\": 4, \"L\": 5}"], [0, ""], [0, "def price_for(size):"], [[2, 3, 4], "    return PRICES.get(size, -1)"]], note: "<code>get(key, default)</code> does the lookup and the default in one call." } },
      java: { file: "Plans.java",
        plain: { lines: [[1, "static final Map<String, Integer> PRICES = Map.of(\"S\", 3, \"M\", 4, \"L\", 5);"], [0, ""], [0, "static int priceFor(String size) {"], [2, "    if (PRICES.containsKey(size)) {"], [4, "        return PRICES.get(size);"], [0, "    }"], [3, "    return -1;"], [0, "}"]] },
        idiomatic: { lines: [[1, "static final Map<String, Integer> PRICES = Map.of(\"S\", 3, \"M\", 4, \"L\", 5);"], [0, ""], [0, "static int priceFor(String size) {"], [[2, 3, 4], "    return PRICES.getOrDefault(size, -1);"], [0, "}"]], note: "<code>getOrDefault</code> is the one-call version." } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "use std::collections::HashMap;"], [0, ""], [0, "fn price_for(size: &str) -> i32 {"], [1, "    let prices = HashMap::from([(\"S\", 3), (\"M\", 4), (\"L\", 5)]);"], [2, "    match prices.get(size) {"], [4, "        Some(&price) => price,"], [3, "        None => -1,"], [0, "    }"], [0, "}"]], note: "For a real program, build the map once (for example in a <code>static</code>) rather than on every call." },
        idiomatic: { lines: [[0, "fn price_for(size: &str) -> i32 {"], [[1, 2], "    match size {"], [4, "        \"S\" => 3,"], [4, "        \"M\" => 4,"], [4, "        \"L\" => 5,"], [3, "        _ => -1,"], [0, "    }"], [0, "}"]], note: "For a small fixed table, a <code>match</code> on the key is idiomatic Rust: the table lives in the code, and <code>_</code> is the default." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "#include <string.h>"], [0, ""], [1, "static const char *SIZES[] = {\"S\", \"M\", \"L\"};"], [1, "static const int PRICES[] = {3, 4, 5};"], [0, ""], [0, "int price_for(const char *size) {"], [2, "    for (size_t i = 0; i < 3; i++) {"], [2, "        if (strcmp(SIZES[i], size) == 0) {"], [4, "            return PRICES[i];"], [0, "        }"], [0, "    }"], [3, "    return -1;"], [0, "}"]], note: "C has no built-in dictionary, so the table is two parallel arrays searched in order. For big tables, sort the keys and use <code>bsearch</code>." },
        idiomatic: null, idiomaticNote: "Parallel arrays (or an array of structs) are the idiomatic C lookup table." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <map>"], [0, "#include <string>"], [0, ""], [1, "static const std::map<std::string, int> PRICES = {{\"S\", 3}, {\"M\", 4}, {\"L\", 5}};"], [0, ""], [0, "int price_for(const std::string& size) {"], [2, "    auto it = PRICES.find(size);"], [3, "    if (it == PRICES.end()) {"], [3, "        return -1;"], [0, "    }"], [4, "    return it->second;"], [0, "}"]], note: "<code>find</code> returns <code>end()</code> for a missing key. (<code>PRICES[size]</code> would quietly insert a 0.)" },
        idiomatic: null, idiomaticNote: "<code>find</code> plus a check for <code>end()</code> is the idiomatic C++ lookup; <code>std::unordered_map</code> works the same way." }
    },

    trace: {
      type: "branches",
      intro: "Running example: <b>A T-shirt shop's prices:</b> S costs 3, M costs 4, L costs 5. Any other size gives -1.",
      input: { kind: "fields", fields: [{ name: "size", label: "size", type: "text", max: 4 }] },
      presets: [{ label: "\"M\"", input: { size: "M" } }, { label: "\"L\"", input: { size: "L" } }, { label: "\"XL\" (missing)", input: { size: "XL" } }],
      run({ size }) {
        const ev = [];
        const rows = PRICES.map(([k, v]) => ({ test: `"${k}"`, label: String(v), state: "" })).concat([{ test: "anything else", label: "-1", state: "" }]);
        let result = "?";
        const push = (step, msg, tone = "") => ev.push({ step, msg, tone,
          view: { subject: { k: "size", v: `"${size}"` }, rows: rows.map((r) => ({ ...r })) },
          vars: [{ k: "size", role: "fixed", v: `"${size}"` }, { k: "price", role: "result", v: result }] });
        push(null, `Ready. What does size "${size}" cost?`);
        push(1, "The table already holds every size and its price.");
        const i = PRICES.findIndex(([k]) => k === size);
        rows.forEach((r, j) => { r.state = j === (i === -1 ? rows.length - 1 : i) ? "hit" : "skipped"; });
        if (i === -1) {
          push(2, `Look up "${size}": it isn't in the table. No row had to be tested one by one.`);
          result = -1;
          push(3, "Missing key, so return the default: -1.", "no");
          return ev;
        }
        push(2, `Look up "${size}": the table goes straight to its row. No row had to be tested one by one.`);
        result = PRICES[i][1];
        push(4, `Return ${result}.`, "yes");
        return ev;
      }
    },

    checks: {
      params: ["string"], returns: "int",
      cases: [{ args: ["S"], expect: 3 }, { args: ["M"], expect: 4 }, { args: ["L"], expect: 5 }, { args: ["XL"], expect: -1 }, { args: [""], expect: -1 }],
      snippets: { bugDefault: [{ args: ["XL"], expect: 0 }, { args: ["S"], expect: 3 }], bugTable: [{ args: ["M"], expect: 5 }] }
    },

    pitfalls: [
      { kind: "dont", title: "A default that looks like a real answer", wide: true, code: "bugDefault", text: "Returning 0 for a missing size makes an unknown size look free. Callers can't tell “not found” from a real price.", take: "Pick a default no real value can have (-1, None, an Option), or raise an error." },
      { kind: "dont", title: "Indexing without checking", text: "Python's <code>PRICES[size]</code> raises <code>KeyError</code> for a missing key, and C++'s <code>PRICES[size]</code> quietly inserts a 0.", take: "Check first, or use get / getOrDefault / find." },
      { kind: "dont", title: "Keys that almost match", text: "\"m\" and \"M\" are different keys, and so are \"M \" and \"M\".", take: "Tidy the key first (A4): trim it and fix its case." },
      { kind: "do", title: "Keep the data out of the logic", text: "Adding size XL means adding one pair to the table. With an if chain, it means editing the code." },
      { kind: "do", title: "Use ranges when the values are ranges", text: "A table needs exact keys. For “85 and up is an A”, use Multi-way classification (B3)." }
    ],

    snippets: {
      bugDefault: {
        python: ["PRICES = {\"S\": 3, \"M\": 4, \"L\": 5}", "", "def price_for(size):", "    return PRICES.get(size, 0)   # ✗ 0 looks like a real price"],
        java: ["static final Map<String, Integer> PRICES = Map.of(\"S\", 3, \"M\", 4, \"L\", 5);", "", "static int priceFor(String size) {", "    return PRICES.getOrDefault(size, 0);   // ✗ 0 looks like a real price", "}"],
        rust: ["fn price_for(size: &str) -> i32 {", "    match size {", "        \"S\" => 3,", "        \"M\" => 4,", "        \"L\" => 5,", "        _ => 0,                 // ✗ 0 looks like a real price", "    }", "}"],
        c: ["static const char *SIZES[] = {\"S\", \"M\", \"L\"};", "static const int PRICES[] = {3, 4, 5};", "", "int price_for(const char *size) {", "    for (size_t i = 0; i < 3; i++) {", "        if (strcmp(SIZES[i], size) == 0) return PRICES[i];", "    }", "    return 0;                    // ✗ 0 looks like a real price", "}"],
        cpp: ["static const std::map<std::string, int> PRICES = {{\"S\", 3}, {\"M\", 4}, {\"L\", 5}};", "", "int price_for(const std::string& size) {", "    auto it = PRICES.find(size);", "    return it == PRICES.end() ? 0 : it->second;   // ✗ 0 looks like a real price", "}"]
      },
      bugTable: {
        python: ["PRICES = {\"S\": 3, \"M\": 5, \"L\": 4}", "", "def price_for(size):", "    return PRICES.get(size, -1)"],
        java: ["static final Map<String, Integer> PRICES = Map.of(\"S\", 3, \"M\", 5, \"L\", 4);", "", "static int priceFor(String size) {", "    return PRICES.getOrDefault(size, -1);", "}"],
        rust: ["fn price_for(size: &str) -> i32 {", "    match size {", "        \"S\" => 3,", "        \"M\" => 5,", "        \"L\" => 4,", "        _ => -1,", "    }", "}"],
        c: ["static const char *SIZES[] = {\"S\", \"M\", \"L\"};", "static const int PRICES[] = {3, 5, 4};", "", "int price_for(const char *size) {", "    for (size_t i = 0; i < 3; i++) {", "        if (strcmp(SIZES[i], size) == 0) return PRICES[i];", "    }", "    return -1;", "}"],
        cpp: ["static const std::map<std::string, int> PRICES = {{\"S\", 3}, {\"M\", 5}, {\"L\", 4}};", "", "int price_for(const std::string& size) {", "    auto it = PRICES.find(size);", "    return it == PRICES.end() ? -1 : it->second;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(\"S\") return?", options: ["3", "4", "5", "-1"], answer: 0, explain: "The table pairs \"S\" with 3." },
      { q: "This table has a mistake. What does it return for \"M\"?", code: "bugTable", options: ["4", "5", "-1"], answer: 1, explain: "The prices for M and L were swapped when the table was written. The lookup itself is fine; the data is wrong." },
      { q: "When is a lookup table a better fit than an if / else-if chain?", options: ["When outcomes depend on exact values", "When outcomes depend on ranges like “85 and up”", "When there are only two outcomes"], answer: 0, explain: "Tables map exact keys to values. Ranges need comparisons (B3); two outcomes need one if (B2)." }
    ],

    exercise: {
      title: "Your turn: day numbers",
      task: "Write <code>day_number(day)</code> that turns \"Mon\" … \"Sun\" into 1 … 7, and returns 0 for anything else.",
      plan: ["Store the seven day → number pairs in a table", "Look the day up", "Missing? Return 0", "Return the number found"],
      fn: { python: "day_number", java: "dayNumber", rust: "day_number", c: "day_number", cpp: "day_number" },
      params: ["string"], returns: "int",
      tests: [{ args: ["Mon"], expect: 1 }, { args: ["Sun"], expect: 7 }, { args: ["Wed"], expect: 3 }, { args: ["Funday"], expect: 0 }],
      solutions: {
        python: ["DAYS = {\"Mon\": 1, \"Tue\": 2, \"Wed\": 3, \"Thu\": 4, \"Fri\": 5, \"Sat\": 6, \"Sun\": 7}", "", "def day_number(day):", "    return DAYS.get(day, 0)"],
        java: ["static final Map<String, Integer> DAYS = Map.of(\"Mon\", 1, \"Tue\", 2, \"Wed\", 3, \"Thu\", 4, \"Fri\", 5, \"Sat\", 6, \"Sun\", 7);", "", "static int dayNumber(String day) {", "    return DAYS.getOrDefault(day, 0);", "}"],
        rust: ["fn day_number(day: &str) -> i32 {", "    match day {", "        \"Mon\" => 1, \"Tue\" => 2, \"Wed\" => 3, \"Thu\" => 4,", "        \"Fri\" => 5, \"Sat\" => 6, \"Sun\" => 7,", "        _ => 0,", "    }", "}"],
        c: ["#include <string.h>", "", "static const char *DAYS[] = {\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\", \"Sun\"};", "", "int day_number(const char *day) {", "    for (int i = 0; i < 7; i++) {", "        if (strcmp(DAYS[i], day) == 0) return i + 1;", "    }", "    return 0;", "}"],
        cpp: ["#include <map>", "#include <string>", "", "static const std::map<std::string, int> DAYS = {{\"Mon\", 1}, {\"Tue\", 2}, {\"Wed\", 3}, {\"Thu\", 4}, {\"Fri\", 5}, {\"Sat\", 6}, {\"Sun\", 7}};", "", "int day_number(const std::string& day) {", "    auto it = DAYS.find(day);", "    return it == DAYS.end() ? 0 : it->second;", "}"]
      }
    },

    compare: {
      intro: "Three ways to pick an outcome, by the kind of value that decides it.",
      rows: [
        { id: "B5", name: "Lookup table", question: "Price of size \"M\"?", shape: "a dictionary / map from exact keys to values", result: "one lookup", self: true },
        { id: "B3", name: "Multi-way classification", question: "Grade for a score of 78?", shape: "else-if chain over ordered ranges", result: "tests until one is true" },
        { id: "B4", name: "Two-factor decision", question: "Discount for a member's heavy order?", shape: "nested ifs over two facts", result: "one of 4 combinations" }
      ],
      table: { head: ["Plan", "Decided by", "Adding a case means", "Missing case"], rows: [["Lookup table", "an exact key", "adding a pair to the data", "a default value"], ["Multi-way classification", "ranges of one value", "adding a branch to the code", "the final else"], ["Two-factor decision", "two yes/no facts", "rethinking the table", "can't happen if all 4 are covered"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "B3", why: "the if chain a table replaces" }],
      leadsTo: [{ id: "D15", why: "a dictionary that counts instead of looking up" }, { id: "A4", why: "tidy the key before looking it up" }]
    }
  };
})();
