/* Plan data: D14 · Count per category
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   Returns a list of four counters [A, B, C, D] (C: output array, returning 4). */

(function () {
  const LABELS = ["A", "B", "C", "D"];
  const cat = (s) => (s >= 85 ? 0 : s >= 70 ? 1 : s >= 55 ? 2 : 3);

  window.PLAN = {
    id: "D14",
    slug: "count-per-category",
    title: "Count per category",
    highlight: "per category",
    aka: ["tally by group", "histogram", "one counter per bucket"],
    group: "D",
    level: "Core",
    core: false,
    fn: { python: "grade_counts", java: "gradeCounts", rust: "grade_counts", c: "grade_counts", cpp: "grade_counts" },

    hero: { type: "tiles", values: [90, 72, 60, 40, 88], colors: ["amber", "blue", "pale", "fade", "amber"], tagAt: 4, tag: "A:2 B:1 C:1 D:1", alt: "Five scores coloured by grade, with the tag showing the count for each grade" },
    planCard: { name: "per category", lines: ["one counter per category", "for each item: find its category", "add one to that counter"], foot: "→ return all the counters" },

    intent: "Count how many items fall into each of several categories at once: keep one counter per category and add to the right one for each item.",

    analogy: { icon: "🗳️", title: "Counting votes", text: "Each candidate has their own pile. You take the ballots one by one and put each on the pile of the candidate it names. When the box is empty, the size of each pile is that candidate's count, all from one pass through the ballots." },

    cues: ["how many in each …", "for every category, count", "distribution", "breakdown by …", "tally"],
    cueSummary: "The answer is <b>several counts</b>, one per category, from a single pass through the data.",
    cueExamples: ["How many A, B, C and D grades are there?", "How many readings were low, normal and high?", "How many orders came in each month?"],

    steps: [
      { n: 1, title: "One counter per category, all at 0", text: "Here a list of four: [A, B, C, D]." },
      { n: 2, title: "Visit each item", text: "Once. All the categories are counted in the same pass." },
      { n: 3, title: "Find its category", text: "Here with the grade ranges from Multi-way classification (B3)." },
      { n: 4, title: "Add one to that category's counter", text: "Exactly one counter changes per item." },
      { n: 5, title: "Return all the counters", text: "Together they add up to the number of items." }
    ],

    impl: {
      python: { file: "grades.py",
        plain: { lines: [[0, "def grade_counts(scores):"], [1, "    counts = [0, 0, 0, 0]   # A, B, C, D"], [2, "    for s in scores:"], [3, "        if s >= 85:"], [4, "            counts[0] += 1"], [3, "        elif s >= 70:"], [4, "            counts[1] += 1"], [3, "        elif s >= 55:"], [4, "            counts[2] += 1"], [3, "        else:"], [4, "            counts[3] += 1"], [5, "    return counts"]] },
        idiomatic: { lines: [[0, "def grade_index(s):"], [0, "    return 0 if s >= 85 else 1 if s >= 70 else 2 if s >= 55 else 3"], [0, ""], [0, "def grade_counts(scores):"], [1, "    counts = [0] * 4"], [2, "    for s in scores:"], [[3, 4], "        counts[grade_index(s)] += 1"], [5, "    return counts"]], note: "Moving “which category?” into its own function (G1) leaves a two-line loop." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static List<Integer> gradeCounts(int[] scores) {"], [1, "    int[] counts = new int[4];   // A, B, C, D"], [2, "    for (int s : scores) {"], [3, "        if (s >= 85) {"], [4, "            counts[0]++;"], [3, "        } else if (s >= 70) {"], [4, "            counts[1]++;"], [3, "        } else if (s >= 55) {"], [4, "            counts[2]++;"], [3, "        } else {"], [4, "            counts[3]++;"], [0, "        }"], [0, "    }"], [5, "    return Arrays.stream(counts).boxed().toList();"], [0, "}"]], note: "<code>new int[4]</code> starts every counter at 0." },
        idiomatic: null, idiomaticNote: "An array of counters is idiomatic Java. With named categories, an <code>EnumMap</code> or <code>Collectors.groupingBy(…, counting())</code> does the same." },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn grade_counts(scores: &[i32]) -> Vec<i32> {"], [1, "    let mut counts = vec![0; 4];   // A, B, C, D"], [2, "    for &s in scores {"], [3, "        let index = if s >= 85 { 0 } else if s >= 70 { 1 } else if s >= 55 { 2 } else { 3 };"], [4, "        counts[index] += 1;"], [0, "    }"], [5, "    counts"], [0, "}"]], note: "Working out the index first, then adding once, avoids repeating <code>counts[…] += 1</code> four times." },
        idiomatic: null, idiomaticNote: "The counter vector is the idiomatic Rust; with string categories, a <code>HashMap</code> and <code>entry().or_insert(0)</code> does the same (D15)." },
      c: { file: "plans.c",
        plain: { lines: [[0, "size_t grade_counts(const int scores[], size_t n, int out[]) {"], [1, "    for (int k = 0; k < 4; k++) out[k] = 0;   /* A, B, C, D */"], [2, "    for (size_t i = 0; i < n; i++) {"], [3, "        if (scores[i] >= 85) {"], [4, "            out[0]++;"], [3, "        } else if (scores[i] >= 70) {"], [4, "            out[1]++;"], [3, "        } else if (scores[i] >= 55) {"], [4, "            out[2]++;"], [3, "        } else {"], [4, "            out[3]++;"], [0, "        }"], [0, "    }"], [5, "    return 4;"], [0, "}"]], note: "The caller passes an array of 4 counters; the function returns how many there are." },
        idiomatic: null, idiomaticNote: "An array of counters is the idiomatic C." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "std::vector<int> grade_counts(const std::vector<int>& scores) {"], [1, "    std::vector<int> counts(4, 0);   // A, B, C, D"], [2, "    for (int s : scores) {"], [3, "        if (s >= 85) {"], [4, "            counts[0]++;"], [3, "        } else if (s >= 70) {"], [4, "            counts[1]++;"], [3, "        } else if (s >= 55) {"], [4, "            counts[2]++;"], [3, "        } else {"], [4, "            counts[3]++;"], [0, "        }"], [0, "    }"], [5, "    return counts;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "A vector (or <code>std::array&lt;int, 4&gt;</code>) of counters is the idiomatic C++." }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>How many A, B, C and D grades are there?</b> A is 85 and up, B 70 and up, C 55 and up, and D below 55.",
      input: { kind: "list", max: 10, placeholder: "scores: 90, 72, 60" },
      presets: [{ label: "Mixed class", input: [90, 72, 60, 40, 88] }, { label: "Boundaries", input: [85, 70, 55, 54] }, { label: "Empty class", input: [] }],
      run(list) {
        const ev = [], states = list.map(() => ""), badges = list.map(() => ""), counts = [0, 0, 0, 0];
        const snap = (step, msg, cur = -1, tone = "", fresh = -1) => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur, badges: badges.slice(), out: { label: "counts", items: counts.map((c, k) => `${LABELS[k]}:${c}`), fresh } },
          vars: [{ k: "s", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "items counted", role: "count", v: counts.reduce((a, b) => a + b, 0) }] });
        snap(null, list.length ? `Ready. ${list.length} scores to sort into grades.` : "Ready. No scores.");
        snap(1, "One counter per grade, all at 0.");
        list.forEach((s, i) => {
          states[i] = "current"; snap(2, `Visit score [${i}]: ${s}.`, i);
          const k = cat(s); badges[i] = LABELS[k];
          snap(3, `${s} is a ${LABELS[k]}${k < 3 ? ` (at least ${[85, 70, 55][k]})` : " (below 55)"}.`, i);
          counts[k]++; states[i] = "added";
          snap(4, `Add one to the ${LABELS[k]} counter: ${LABELS[k]} = ${counts[k]}.`, i, "", k);
        });
        snap(5, `Return [${counts.join(", ")}]: ${counts.reduce((a, b) => a + b, 0)} scores in total.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"], returns: "int[]",
      cases: [{ args: [[90, 72, 60, 40, 88]], expect: [2, 1, 1, 1] }, { args: [[]], expect: [0, 0, 0, 0] }, { args: [[55, 54]], expect: [0, 0, 1, 1] }, { args: [[85, 70]], expect: [1, 1, 0, 0] }],
      snippets: { bugNoElse: [{ args: [[90]], expect: [1, 1, 1, 0] }], bugReset: [{ args: [[90, 60]], expect: [0, 0, 1, 0] }] }
    },

    pitfalls: [
      { kind: "dont", title: "Separate ifs instead of else-if", wide: true, code: "bugNoElse", text: "With separate <code>if</code>s, a score of 90 passes “≥ 85”, “≥ 70” <em>and</em> “≥ 55”, so it's counted three times.", take: "Each item goes into exactly one category: use else-if (B3)." },
      { kind: "dont", title: "Resetting the counters inside the loop", text: "Starting the counters again for every item leaves only the last item counted.", take: "Set up the counters once, before the loop." },
      { kind: "dont", title: "One loop per category", text: "Four separate counting loops give the right answer, but read the data four times and repeat the same code.", take: "One loop, one counter per category." },
      { kind: "do", title: "Check the total", text: "The counters must add up to the number of items. If they don't, an item was counted twice or missed." },
      { kind: "do", title: "Use a dictionary for open-ended categories", text: "If the categories aren't known in advance (words, names), count with a dictionary: that's Count occurrences (D15)." }
    ],

    snippets: {
      bugNoElse: {
        python: ["def grade_counts(scores):", "    counts = [0, 0, 0, 0]", "    for s in scores:", "        if s >= 85:", "            counts[0] += 1", "        if s >= 70:              # ✗ should be elif", "            counts[1] += 1", "        if s >= 55:", "            counts[2] += 1", "        if s < 55:", "            counts[3] += 1", "    return counts"],
        java: ["static List<Integer> gradeCounts(int[] scores) {", "    int[] counts = new int[4];", "    for (int s : scores) {", "        if (s >= 85) counts[0]++;", "        if (s >= 70) counts[1]++;   // ✗ should be else if", "        if (s >= 55) counts[2]++;", "        if (s < 55) counts[3]++;", "    }", "    return Arrays.stream(counts).boxed().toList();", "}"],
        rust: ["fn grade_counts(scores: &[i32]) -> Vec<i32> {", "    let mut counts = vec![0; 4];", "    for &s in scores {", "        if s >= 85 { counts[0] += 1; }", "        if s >= 70 { counts[1] += 1; }   // ✗ should be else if", "        if s >= 55 { counts[2] += 1; }", "        if s < 55 { counts[3] += 1; }", "    }", "    counts", "}"],
        c: ["size_t grade_counts(const int scores[], size_t n, int out[]) {", "    for (int k = 0; k < 4; k++) out[k] = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (scores[i] >= 85) out[0]++;", "        if (scores[i] >= 70) out[1]++;   // ✗ should be else if", "        if (scores[i] >= 55) out[2]++;", "        if (scores[i] < 55) out[3]++;", "    }", "    return 4;", "}"],
        cpp: ["std::vector<int> grade_counts(const std::vector<int>& scores) {", "    std::vector<int> counts(4, 0);", "    for (int s : scores) {", "        if (s >= 85) counts[0]++;", "        if (s >= 70) counts[1]++;   // ✗ should be else if", "        if (s >= 55) counts[2]++;", "        if (s < 55) counts[3]++;", "    }", "    return counts;", "}"]
      },
      bugReset: {
        python: ["def grade_counts(scores):", "    counts = [0, 0, 0, 0]", "    for s in scores:", "        counts = [0, 0, 0, 0]", "        if s >= 85:", "            counts[0] += 1", "        elif s >= 70:", "            counts[1] += 1", "        elif s >= 55:", "            counts[2] += 1", "        else:", "            counts[3] += 1", "    return counts"],
        java: ["static List<Integer> gradeCounts(int[] scores) {", "    int[] counts = new int[4];", "    for (int s : scores) {", "        counts = new int[4];", "        if (s >= 85) counts[0]++;", "        else if (s >= 70) counts[1]++;", "        else if (s >= 55) counts[2]++;", "        else counts[3]++;", "    }", "    return Arrays.stream(counts).boxed().toList();", "}"],
        rust: ["fn grade_counts(scores: &[i32]) -> Vec<i32> {", "    let mut counts = vec![0; 4];", "    for &s in scores {", "        counts = vec![0; 4];", "        let index = if s >= 85 { 0 } else if s >= 70 { 1 } else if s >= 55 { 2 } else { 3 };", "        counts[index] += 1;", "    }", "    counts", "}"],
        c: ["size_t grade_counts(const int scores[], size_t n, int out[]) {", "    for (int k = 0; k < 4; k++) out[k] = 0;", "    for (size_t i = 0; i < n; i++) {", "        for (int k = 0; k < 4; k++) out[k] = 0;", "        if (scores[i] >= 85) out[0]++;", "        else if (scores[i] >= 70) out[1]++;", "        else if (scores[i] >= 55) out[2]++;", "        else out[3]++;", "    }", "    return 4;", "}"],
        cpp: ["std::vector<int> grade_counts(const std::vector<int>& scores) {", "    std::vector<int> counts(4, 0);", "    for (int s : scores) {", "        counts.assign(4, 0);", "        if (s >= 85) counts[0]++;", "        else if (s >= 70) counts[1]++;", "        else if (s >= 55) counts[2]++;", "        else counts[3]++;", "    }", "    return counts;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([85, 84, 30]) return?", options: ["[1, 1, 0, 1]", "[2, 0, 0, 1]", "[1, 1, 1, 0]"], answer: 0, explain: "85 is an A, 84 is a B, 30 is a D. [1 A, 1 B, 0 C, 1 D]." },
      { q: "This version has a bug. What does it return for [90]?", code: "bugNoElse", options: ["[1, 0, 0, 0]", "[1, 1, 1, 0]"], answer: 1, explain: "90 passes the first three separate tests, so three counters go up for one score." },
      { q: "For 12 scores, what must the four counters add up to?", options: ["4", "12", "48"], answer: 1, explain: "Every score lands in exactly one category, so the counters always add up to the number of items." }
    ],

    exercise: {
      title: "Your turn: negatives, zeros, positives",
      task: "Write <code>count_signs(numbers)</code> that returns [how many are negative, how many are zero, how many are positive].",
      plan: ["Three counters, all at 0", "Visit each number", "Find its category: below 0, equal to 0, or above 0", "Add one to that counter", "Return the three counters"],
      fn: { python: "count_signs", java: "countSigns", rust: "count_signs", c: "count_signs", cpp: "count_signs" },
      params: ["int[]"], returns: "int[]",
      tests: [{ args: [[-2, 0, 5, 7]], expect: [1, 1, 2] }, { args: [[]], expect: [0, 0, 0] }, { args: [[0, 0]], expect: [0, 2, 0] }],
      solutions: {
        python: ["def count_signs(numbers):", "    counts = [0, 0, 0]", "    for x in numbers:", "        if x < 0:", "            counts[0] += 1", "        elif x == 0:", "            counts[1] += 1", "        else:", "            counts[2] += 1", "    return counts"],
        java: ["static List<Integer> countSigns(int[] numbers) {", "    int[] counts = new int[3];", "    for (int x : numbers) {", "        if (x < 0) counts[0]++;", "        else if (x == 0) counts[1]++;", "        else counts[2]++;", "    }", "    return Arrays.stream(counts).boxed().toList();", "}"],
        rust: ["fn count_signs(numbers: &[i32]) -> Vec<i32> {", "    let mut counts = vec![0; 3];", "    for &x in numbers {", "        let index = if x < 0 { 0 } else if x == 0 { 1 } else { 2 };", "        counts[index] += 1;", "    }", "    counts", "}"],
        c: ["size_t count_signs(const int numbers[], size_t n, int out[]) {", "    out[0] = out[1] = out[2] = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] < 0) out[0]++;", "        else if (numbers[i] == 0) out[1]++;", "        else out[2]++;", "    }", "    return 3;", "}"],
        cpp: ["#include <vector>", "", "std::vector<int> count_signs(const std::vector<int>& numbers) {", "    std::vector<int> counts(3, 0);", "    for (int x : numbers) {", "        if (x < 0) counts[0]++;", "        else if (x == 0) counts[1]++;", "        else counts[2]++;", "    }", "    return counts;", "}"]
      }
    },

    compare: {
      intro: "Counting plans, from one counter to many.",
      rows: [
        { id: "D14", name: "Count per category", question: "How many of each grade?", shape: "a fixed set of counters, one per known category", result: "several counts", self: true },
        { id: "D1", name: "Counting", question: "How many passed?", shape: "one counter", result: "one count" },
        { id: "D15", name: "Count occurrences", question: "How often does each word appear?", shape: "a dictionary from each value seen to its count", result: "a count per distinct value" }
      ],
      table: { head: ["Plan", "Categories known in advance?", "Storage", "Result"], rows: [["Count per category", "yes, a few", "a list / array of counters", "one count per category"], ["Counting", "just pass / fail", "one variable", "one count"], ["Count occurrences", "no, any value", "a dictionary / map", "one count per value seen"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "D1", why: "each category has a counter" }, { id: "B3", why: "deciding the category" }],
      leadsTo: [{ id: "D15", why: "when the categories aren't known in advance" }]
    }
  };
})();
