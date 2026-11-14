/* Plan data: D15 · Count occurrences
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "D15",
    slug: "count-occurrences",
    title: "Count occurrences",
    highlight: "occurrences",
    aka: ["frequency count", "word count", "dictionary of counts"],
    group: "D",
    level: "Core",
    core: false,
    fn: { python: "most_common", java: "mostCommon", rust: "most_common", c: "most_common", cpp: "most_common" },

    hero: { type: "tiles", values: [3, 5, 5, 1, 5], colors: ["pale", "amber", "amber", "pale", "amber"], tagAt: 4, tag: "5 appears 3×", alt: "Five numbers; the three 5s are amber because 5 is the most common value" },
    planCard: { name: "frequency", lines: ["counts = empty dictionary", "for each item: counts[item] + 1", "then pick the biggest count"], foot: "→ return that value" },

    intent: "Count how often each distinct value appears, using a dictionary from value to count; here, then pick the value with the highest count.",

    analogy: { icon: "🗂️", title: "Sorting the post into pigeonholes", text: "Each letter goes into the pigeonhole with that person's name; if there's no pigeonhole yet, you make one. At the end, the fullest pigeonhole shows who got the most post. You didn't need a list of names in advance." },

    cues: ["how often does each …", "most common / most frequent", "frequency", "count each different …", "duplicates"],
    cueSummary: "You need a count for <b>every different value</b>, and you don't know the values in advance.",
    cueExamples: ["Which number appears most often in a list of dice rolls?", "How many times does each word appear in a text?", "Which product was ordered most often?"],

    steps: [
      { n: 1, title: "Start with an empty dictionary of counts", text: "No value has been seen yet." },
      { n: 2, title: "Visit each item", text: "Every item is counted." },
      { n: 3, title: "Add one to its count", text: "A value seen for the first time starts at 0, so its count becomes 1." },
      { n: 4, title: "Find the value with the highest count", text: "A best-so-far search (D4) over the dictionary. On a tie, the smaller value wins here." },
      { n: 5, title: "Return it", text: "The list must not be empty." }
    ],

    impl: {
      python: { file: "mode.py",
        plain: { lines: [[0, "def most_common(numbers):"], [1, "    counts = {}"], [2, "    for x in numbers:"], [3, "        counts[x] = counts.get(x, 0) + 1"], [4, "    best = None"], [4, "    for value in sorted(counts):"], [4, "        if best is None or counts[value] > counts[best]:"], [4, "            best = value"], [5, "    return best"]], note: "<code>sorted(counts)</code> visits the values from smallest to largest, so on a tie the smallest value is kept." },
        idiomatic: { lines: [[0, "from collections import Counter"], [0, ""], [0, "def most_common(numbers):"], [[1, 2, 3], "    counts = Counter(numbers)"], [[4, 5], "    return min(counts, key=lambda v: (-counts[v], v))"]], note: "<code>Counter</code> is the counting dictionary. (Its own <code>most_common()</code> breaks ties by first appearance, not by size.)" } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int mostCommon(int[] numbers) {"], [1, "    Map<Integer, Integer> counts = new TreeMap<>();"], [2, "    for (int x : numbers) {"], [3, "        counts.merge(x, 1, Integer::sum);"], [0, "    }"], [4, "    int best = numbers[0];"], [4, "    int bestCount = 0;"], [4, "    for (Map.Entry<Integer, Integer> e : counts.entrySet()) {"], [4, "        if (e.getValue() > bestCount) {"], [4, "            best = e.getKey();"], [4, "            bestCount = e.getValue();"], [0, "        }"], [0, "    }"], [5, "    return best;"], [0, "}"]], note: "<code>merge(x, 1, Integer::sum)</code> puts 1 for a new key, or adds 1 to the old count. A <code>TreeMap</code> keeps the keys sorted." },
        idiomatic: null, idiomaticNote: "With streams: <code>Collectors.groupingBy(x -> x, Collectors.counting())</code> builds the counts; picking the maximum is still a separate step." },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "use std::collections::BTreeMap;"], [0, ""], [0, "fn most_common(numbers: &[i32]) -> i32 {"], [1, "    let mut counts = BTreeMap::new();"], [2, "    for &x in numbers {"], [3, "        *counts.entry(x).or_insert(0) += 1;"], [0, "    }"], [4, "    let mut best = numbers[0];"], [4, "    let mut best_count = 0;"], [4, "    for (&value, &count) in &counts {"], [4, "        if count > best_count {"], [4, "            best = value;"], [4, "            best_count = count;"], [0, "        }"], [0, "    }"], [5, "    best"], [0, "}"]], note: "<code>entry(x).or_insert(0)</code> gives the count for x, starting at 0 for a new value. A <code>BTreeMap</code> iterates in sorted order." },
        idiomatic: null, idiomaticNote: "The <code>entry</code> API is the idiomatic Rust way to count; <code>HashMap</code> works the same if order doesn't matter." },
      c: { file: "plans.c",
        plain: { lines: [[0, "int most_common(const int numbers[], size_t n) {"], [1, "    int counts[100] = {0};   /* values must be 0..99 */"], [2, "    for (size_t i = 0; i < n; i++) {"], [3, "        counts[numbers[i]]++;"], [0, "    }"], [4, "    int best = numbers[0];"], [4, "    for (int value = 0; value < 100; value++) {"], [4, "        if (counts[value] > counts[best]) {"], [4, "            best = value;"], [0, "        }"], [0, "    }"], [5, "    return best;"], [0, "}"]], note: "C has no built-in dictionary. When the values are small whole numbers, an array indexed by value is the counting table." },
        idiomatic: null, idiomaticNote: "For any values, C programs sort a copy first (equal values end up next to each other) and count the runs, or write a hash table." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <map>"], [0, "#include <vector>"], [0, ""], [0, "int most_common(const std::vector<int>& numbers) {"], [1, "    std::map<int, int> counts;"], [2, "    for (int x : numbers) {"], [3, "        counts[x]++;"], [0, "    }"], [4, "    int best = numbers[0];"], [4, "    int best_count = 0;"], [4, "    for (const auto& [value, count] : counts) {"], [4, "        if (count > best_count) {"], [4, "            best = value;"], [4, "            best_count = count;"], [0, "        }"], [0, "    }"], [5, "    return best;"], [0, "}"]], note: "<code>counts[x]</code> creates a 0 for a new key, so <code>++</code> works straight away." },
        idiomatic: null, idiomaticNote: "A <code>std::map</code> or <code>std::unordered_map</code> of counts is the idiomatic C++." }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Which number appears most often?</b> On a tie, the smaller number wins.",
      input: { kind: "list", max: 10, placeholder: "numbers: 3, 5, 5, 1" },
      presets: [{ label: "Clear winner", input: [3, 5, 5, 1, 5] }, { label: "A tie", input: [2, 2, 7, 7] }, { label: "One number", input: [4] }],
      run(raw) {
        const list = raw.length ? raw : [0];
        const ev = [], states = list.map(() => ""), counts = new Map();
        const outItems = () => [...counts.keys()].sort((a, b) => a - b).map((v) => `${v}×${counts.get(v)}`);
        let best = "?";
        const snap = (step, msg, cur = -1, tone = "", freshVal = null) => {
          const keys = [...counts.keys()].sort((a, b) => a - b);
          ev.push({ step, msg, tone, view: { values: list, states: states.slice(), ptr: cur, out: { label: "counts", items: outItems(), fresh: freshVal === null ? -1 : keys.indexOf(freshVal), empty: "{ } empty" } },
            vars: [{ k: "x", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "different values", role: "count", v: counts.size }, { k: "best", role: "best", v: best }] });
        };
        snap(null, raw.length ? "Ready. Count each different number." : "The list must not be empty, so this trace uses [0].");
        snap(1, "Start with an empty dictionary of counts.");
        list.forEach((x, i) => {
          states[i] = "current"; snap(2, `Visit item [${i}]: ${x}.`, i);
          const before = counts.get(x) || 0; counts.set(x, before + 1); states[i] = "added";
          snap(3, before ? `${x} has been seen before: its count goes from ${before} to ${before + 1}.` : `First time ${x} is seen: its count starts at 1.`, i, "", x);
        });
        let bestCount = 0;
        [...counts.keys()].sort((a, b) => a - b).forEach((v) => { if (counts.get(v) > bestCount) { bestCount = counts.get(v); best = v; } });
        snap(4, `The highest count is ${bestCount}, for ${best}${[...counts.values()].filter((c) => c === bestCount).length > 1 ? " (the smallest of the tied values)" : ""}.`, -1, "", best);
        snap(5, `Return ${best}.`, -1, "yes", best);
        return ev;
      }
    },

    checks: {
      params: ["int[]"], returns: "int",
      cases: [{ args: [[3, 5, 5, 1]], expect: 5 }, { args: [[4]], expect: 4 }, { args: [[2, 2, 7, 7]], expect: 2 }, { args: [[9, 1, 9, 1, 9]], expect: 9 }],
      snippets: { bugSetOne: [{ args: [[3, 5, 5]], expect: 3 }], bugTieLast: [{ args: [[2, 2, 7, 7]], expect: 7 }] }
    },

    pitfalls: [
      { kind: "dont", title: "Setting the count instead of adding to it", wide: true, code: "bugSetOne", text: "<code>counts[x] = 1</code> records that x appeared, but forgets how many times. Every value ends up with a count of 1.", take: "Add one to the old count, starting from 0 for a new value." },
      { kind: "dont", title: "Reading a count that doesn't exist yet", text: "In Python, <code>counts[x] += 1</code> raises <code>KeyError</code> for a new x. (C++'s <code>map</code> and Rust's <code>entry</code> create the 0 for you.)", take: "Use get(x, 0), a Counter, merge, or entry().or_insert(0)." },
      { kind: "dont", title: "Leaving ties to chance", text: "With a hash map, “the first value with the highest count” depends on the map's internal order, which can change between runs.", take: "Decide the tie rule and code it: here, the smallest value." },
      { kind: "do", title: "Separate counting from choosing", text: "First build all the counts, then search them. Trying to track the winner while counting is easy to get wrong." },
      { kind: "do", title: "Reuse the counts", text: "The same dictionary answers other questions: how many distinct values (its size), which values appear once, and so on." }
    ],

    snippets: {
      bugSetOne: {
        python: ["def most_common(numbers):", "    counts = {}", "    for x in numbers:", "        counts[x] = 1              # ✗ forgets earlier counts", "    best = None", "    for value in sorted(counts):", "        if best is None or counts[value] > counts[best]:", "            best = value", "    return best"],
        java: ["static int mostCommon(int[] numbers) {", "    Map<Integer, Integer> counts = new TreeMap<>();", "    for (int x : numbers) {", "        counts.put(x, 1);          // ✗ forgets earlier counts", "    }", "    int best = numbers[0];", "    int bestCount = 0;", "    for (Map.Entry<Integer, Integer> e : counts.entrySet()) {", "        if (e.getValue() > bestCount) { best = e.getKey(); bestCount = e.getValue(); }", "    }", "    return best;", "}"],
        rust: ["fn most_common(numbers: &[i32]) -> i32 {", "    let mut counts = std::collections::BTreeMap::new();", "    for &x in numbers {", "        counts.insert(x, 1);       // ✗ forgets earlier counts", "    }", "    let mut best = numbers[0];", "    let mut best_count = 0;", "    for (&value, &count) in &counts {", "        if count > best_count { best = value; best_count = count; }", "    }", "    best", "}"],
        c: ["int most_common(const int numbers[], size_t n) {", "    int counts[100] = {0};", "    for (size_t i = 0; i < n; i++) {", "        counts[numbers[i]] = 1;    // ✗ forgets earlier counts", "    }", "    int best = numbers[0];", "    for (int value = 0; value < 100; value++) {", "        if (counts[value] > counts[best]) best = value;", "    }", "    return best;", "}"],
        cpp: ["int most_common(const std::vector<int>& numbers) {", "    std::map<int, int> counts;", "    for (int x : numbers) {", "        counts[x] = 1;             // ✗ forgets earlier counts", "    }", "    int best = numbers[0];", "    int best_count = 0;", "    for (const auto& [value, count] : counts) {", "        if (count > best_count) { best = value; best_count = count; }", "    }", "    return best;", "}"]
      },
      bugTieLast: {
        python: ["def most_common(numbers):", "    counts = {}", "    for x in numbers:", "        counts[x] = counts.get(x, 0) + 1", "    best = None", "    for value in sorted(counts):", "        if best is None or counts[value] >= counts[best]:", "            best = value", "    return best"],
        java: ["static int mostCommon(int[] numbers) {", "    Map<Integer, Integer> counts = new TreeMap<>();", "    for (int x : numbers) counts.merge(x, 1, Integer::sum);", "    int best = numbers[0];", "    int bestCount = 0;", "    for (Map.Entry<Integer, Integer> e : counts.entrySet()) {", "        if (e.getValue() >= bestCount) { best = e.getKey(); bestCount = e.getValue(); }", "    }", "    return best;", "}"],
        rust: ["fn most_common(numbers: &[i32]) -> i32 {", "    let mut counts = std::collections::BTreeMap::new();", "    for &x in numbers { *counts.entry(x).or_insert(0) += 1; }", "    let mut best = numbers[0];", "    let mut best_count = 0;", "    for (&value, &count) in &counts {", "        if count >= best_count { best = value; best_count = count; }", "    }", "    best", "}"],
        c: ["int most_common(const int numbers[], size_t n) {", "    int counts[100] = {0};", "    for (size_t i = 0; i < n; i++) counts[numbers[i]]++;", "    int best = numbers[0];", "    for (int value = 0; value < 100; value++) {", "        if (counts[value] > 0 && counts[value] >= counts[best]) best = value;", "    }", "    return best;", "}"],
        cpp: ["int most_common(const std::vector<int>& numbers) {", "    std::map<int, int> counts;", "    for (int x : numbers) counts[x]++;", "    int best = numbers[0];", "    int best_count = 0;", "    for (const auto& [value, count] : counts) {", "        if (count >= best_count) { best = value; best_count = count; }", "    }", "    return best;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([6, 1, 6, 1, 1]) return?", options: ["6", "1", "3"], answer: 1, explain: "1 appears three times and 6 twice, so 1 is the most common value." },
      { q: "This version has a bug. What does it return for [3, 5, 5]?", code: "bugSetOne", options: ["5", "3"], answer: 1, explain: "Every count is set to 1, so all values tie, and the smallest, 3, wins." },
      { q: "After counting [4, 4, 4], what does the dictionary hold?", options: ["{4: 3}", "{4: 1, 4: 1, 4: 1}", "[4, 4, 4]"], answer: 0, explain: "One key per different value: 4, with the count 3." }
    ],

    exercise: {
      title: "Your turn: how many different values?",
      task: "Write <code>count_distinct(numbers)</code> that returns how many different values the list contains. (In C you may assume every value is from 0 to 99.)",
      plan: ["Start with an empty set (or dictionary)", "Visit each number", "Record it as seen", "Return how many different values were recorded"],
      fn: { python: "count_distinct", java: "countDistinct", rust: "count_distinct", c: "count_distinct", cpp: "count_distinct" },
      params: ["int[]"], returns: "int",
      tests: [{ args: [[1, 2, 2, 3]], expect: 3 }, { args: [[]], expect: 0 }, { args: [[5, 5]], expect: 1 }, { args: [[0, 9, 0]], expect: 2 }],
      solutions: {
        python: ["def count_distinct(numbers):", "    seen = set()", "    for x in numbers:", "        seen.add(x)", "    return len(seen)"],
        java: ["static int countDistinct(int[] numbers) {", "    Set<Integer> seen = new HashSet<>();", "    for (int x : numbers) {", "        seen.add(x);", "    }", "    return seen.size();", "}"],
        rust: ["fn count_distinct(numbers: &[i32]) -> i32 {", "    let mut seen = std::collections::HashSet::new();", "    for &x in numbers {", "        seen.insert(x);", "    }", "    seen.len() as i32", "}"],
        c: ["int count_distinct(const int numbers[], size_t n) {", "    int seen[100] = {0};", "    int distinct = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (!seen[numbers[i]]) {", "            seen[numbers[i]] = 1;", "            distinct++;", "        }", "    }", "    return distinct;", "}"],
        cpp: ["#include <set>", "#include <vector>", "", "int count_distinct(const std::vector<int>& numbers) {", "    std::set<int> seen;", "    for (int x : numbers) {", "        seen.insert(x);", "    }", "    return static_cast<int>(seen.size());", "}"]
      }
    },

    compare: {
      intro: "Counting plans, from one counter to a counter for every value.",
      rows: [
        { id: "D15", name: "Count occurrences", question: "Which number appears most often?", shape: "a dictionary from each value seen to its count", result: "a count per value", self: true },
        { id: "D14", name: "Count per category", question: "How many A, B, C, D?", shape: "a fixed list of counters", result: "a count per known category" },
        { id: "F4", name: "Remember what you've seen", question: "Remove the duplicates", shape: "a set of values seen so far", result: "seen or not, no count" }
      ],
      table: { head: ["Plan", "Remembers per value", "Categories known in advance?", "Storage"], rows: [["Count occurrences", "how many times", "no", "dictionary / map"], ["Count per category", "how many times", "yes", "list / array"], ["Remember what you've seen", "only whether", "no", "set"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "D14", why: "one counter per value, created as values appear" }, { id: "B5", why: "a dictionary as a lookup table" }],
      leadsTo: [{ id: "F4", why: "only remember whether a value was seen" }]
    }
  };
})();
