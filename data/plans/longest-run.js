/* Plan data: D13 · Longest run
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const HOT = 30;

  window.PLAN = {
    id: "D13",
    slug: "longest-run",
    title: "Longest run",
    highlight: "run",
    aka: ["longest streak", "consecutive run", "current and best"],
    group: "D",
    level: "Core",
    core: false,
    fn: { python: "longest_hot_streak", java: "longestHotStreak", rust: "longest_hot_streak", c: "longest_hot_streak", cpp: "longest_hot_streak" },

    hero: { type: "tiles", values: [31, 32, 20, 33, 34], colors: ["pale", "pale", "fade", "amber", "amber"], tagAt: 4, tag: "longest = 2", alt: "Five days of temperatures; the hot days 31, 32 form one run and 33, 34 another, broken by a cool day of 20" },
    planCard: { name: "streak", lines: ["current = longest = 0", "pass? current + 1, maybe record", "fail? current = 0"], foot: "→ return longest" },

    intent: "Find the longest run of items in a row that pass a test: keep a current streak that grows or resets, and remember the best streak so far.",

    analogy: { icon: "🔥", title: "A daily streak in a language app", text: "Practise today and your streak goes up by one; skip a day and it drops back to 0. The app also remembers your record, the longest streak you've ever had, which only changes when the current streak beats it." },

    cues: ["in a row", "consecutive", "streak", "longest run", "without a break"],
    cueSummary: "The answer is <b>how long the longest unbroken run</b> of passing items is.",
    cueExamples: ["What is the longest run of days above 30 °C?", "What's the team's longest winning streak?", "How many heads in a row, at most, in a list of coin flips?"],

    steps: [
      { n: 1, title: "Start the current run and the record at 0", text: "Two variables: one for the streak happening now, one for the best ever." },
      { n: 2, title: "Visit each item", text: "In order: runs are about neighbours." },
      { n: 3, title: "Passes? Extend the current run", text: "Here: a day above 30 °C adds one to the current streak." },
      { n: 4, title: "Beats the record? Update it", text: "Check straight after extending, so a run at the very end still counts." },
      { n: 5, title: "Fails? The run is broken", text: "Back to 0. The record keeps its value." },
      { n: 6, title: "Return the record", text: "The longest run found." }
    ],

    impl: {
      python: { file: "streak.py",
        plain: { lines: [[0, "def longest_hot_streak(temps):"], [1, "    current = 0"], [1, "    longest = 0"], [2, "    for t in temps:"], [3, "        if t > 30:"], [3, "            current += 1"], [4, "            if current > longest:"], [4, "                longest = current"], [5, "        else:"], [5, "            current = 0"], [6, "    return longest"]] },
        idiomatic: { lines: [[0, "from itertools import groupby"], [0, ""], [0, "def longest_hot_streak(temps):"], [[1, 2, 3, 4, 5, 6], "    return max((len(list(g)) for hot, g in groupby(temps, key=lambda t: t > 30) if hot), default=0)"]], note: "<code>groupby</code> cuts the list into runs of equal keys (hot / not hot); then take the longest hot run." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int longestHotStreak(int[] temps) {"], [1, "    int current = 0;"], [1, "    int longest = 0;"], [2, "    for (int t : temps) {"], [3, "        if (t > 30) {"], [3, "            current++;"], [4, "            if (current > longest) {"], [4, "                longest = current;"], [0, "            }"], [5, "        } else {"], [5, "            current = 0;"], [0, "        }"], [0, "    }"], [6, "    return longest;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "There's no built-in streak finder; the two-variable loop is the idiomatic Java." },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn longest_hot_streak(temps: &[i32]) -> i32 {"], [1, "    let mut current = 0;"], [1, "    let mut longest = 0;"], [2, "    for &t in temps {"], [3, "        if t > 30 {"], [3, "            current += 1;"], [4, "            longest = longest.max(current);"], [5, "        } else {"], [5, "            current = 0;"], [0, "        }"], [0, "    }"], [6, "    longest"], [0, "}"]], note: "<code>longest.max(current)</code> is step 4 in one call." },
        idiomatic: null, idiomaticNote: "The two-variable loop is the idiomatic Rust; a <code>fold</code> version exists but is harder to read." },
      c: { file: "plans.c",
        plain: { lines: [[0, "int longest_hot_streak(const int temps[], size_t n) {"], [1, "    int current = 0;"], [1, "    int longest = 0;"], [2, "    for (size_t i = 0; i < n; i++) {"], [3, "        if (temps[i] > 30) {"], [3, "            current++;"], [4, "            if (current > longest) {"], [4, "                longest = current;"], [0, "            }"], [5, "        } else {"], [5, "            current = 0;"], [0, "        }"], [0, "    }"], [6, "    return longest;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "The two-variable loop is the idiomatic C." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "int longest_hot_streak(const std::vector<int>& temps) {"], [1, "    int current = 0;"], [1, "    int longest = 0;"], [2, "    for (int t : temps) {"], [3, "        if (t > 30) {"], [3, "            current++;"], [4, "            if (current > longest) {"], [4, "                longest = current;"], [0, "            }"], [5, "        } else {"], [5, "            current = 0;"], [0, "        }"], [0, "    }"], [6, "    return longest;"], [0, "}"]] },
        idiomatic: null, idiomaticNote: "The two-variable loop is the idiomatic C++." }
    },

    trace: {
      type: "tiles",
      intro: `Running example: <b>What is the longest run of days above ${HOT} °C?</b>`,
      input: { kind: "list", max: 10, placeholder: "temps: 31, 32, 20, 33" },
      presets: [{ label: "Run at the end", input: [31, 32, 20, 33, 34, 35] }, { label: "Never hot", input: [20, 25] }, { label: "Broken runs", input: [31, 20, 32, 20, 33] }],
      run(list) {
        const ev = [], states = list.map(() => ""), badges = list.map(() => "");
        let current = 0, longest = 0;
        const snap = (step, msg, cur = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur, badges: badges.slice() },
          vars: [{ k: "t", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "current", role: "count", v: current }, { k: "longest", role: "best", v: longest }] });
        snap(null, list.length ? "Ready. Find the longest run of hot days." : "Ready. No days.");
        snap(1, "Start: current = 0, longest = 0.");
        list.forEach((t, i) => {
          states[i] = "current"; snap(2, `Visit day [${i}]: ${t} °C.`, i);
          if (t > HOT) {
            current++; states[i] = "hit"; badges[i] = `run ${current}`;
            snap(3, `${t} > ${HOT}: hot, so the current run grows to ${current}.`, i);
            if (current > longest) { longest = current; snap(4, `New record: longest = ${longest}.`, i); }
          } else {
            states[i] = "miss";
            snap(5, `${t} isn't above ${HOT}: the run is broken, current = 0. The record stays ${longest}.`, i);
            current = 0;
          }
        });
        snap(6, `Return ${longest}.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"], returns: "int",
      cases: [{ args: [[31, 32, 20, 33, 34, 35]], expect: 3 }, { args: [[]], expect: 0 }, { args: [[20, 25]], expect: 0 }, { args: [[31, 20, 32]], expect: 1 }, { args: [[35]], expect: 1 }],
      snippets: { bugRecordOnBreak: [{ args: [[31, 32, 20, 33, 34, 35]], expect: 2 }], bugNoReset: [{ args: [[31, 20, 32]], expect: 2 }] }
    },

    pitfalls: [
      { kind: "dont", title: "Updating the record only when a run breaks", wide: true, code: "bugRecordOnBreak", text: "If the record is only checked when a cold day ends a run, a run that lasts until the very end is never recorded.", take: "Check the record every time the current run grows." },
      { kind: "dont", title: "Forgetting to reset", text: "Without <code>current = 0</code> on a failing item, the “run” keeps counting across breaks, and you've counted all the hot days instead.", take: "A failing item sets the current run back to 0." },
      { kind: "dont", title: "Resetting the record instead of the run", text: "The record must survive a break; only the current run starts over.", take: "Two variables, two different jobs." },
      { kind: "do", title: "Test a run at the start, the middle and the end", text: "[35, 20, 20], [20, 35, 20] and [20, 20, 35] catch most streak bugs." },
      { kind: "do", title: "Count the runs, too, if you need them", text: "Adding one to a run counter whenever <code>current</code> becomes 1 tells you how many separate runs there were." }
    ],

    snippets: {
      bugRecordOnBreak: {
        python: ["def longest_hot_streak(temps):", "    current = 0", "    longest = 0", "    for t in temps:", "        if t > 30:", "            current += 1", "        else:", "            if current > longest:    # ✗ only checked when a run breaks", "                longest = current", "            current = 0", "    return longest"],
        java: ["static int longestHotStreak(int[] temps) {", "    int current = 0;", "    int longest = 0;", "    for (int t : temps) {", "        if (t > 30) {", "            current++;", "        } else {", "            if (current > longest) longest = current;   // ✗ only on a break", "            current = 0;", "        }", "    }", "    return longest;", "}"],
        rust: ["fn longest_hot_streak(temps: &[i32]) -> i32 {", "    let mut current = 0;", "    let mut longest = 0;", "    for &t in temps {", "        if t > 30 {", "            current += 1;", "        } else {", "            longest = longest.max(current);   // ✗ only on a break", "            current = 0;", "        }", "    }", "    longest", "}"],
        c: ["int longest_hot_streak(const int temps[], size_t n) {", "    int current = 0;", "    int longest = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (temps[i] > 30) {", "            current++;", "        } else {", "            if (current > longest) longest = current;   // ✗ only on a break", "            current = 0;", "        }", "    }", "    return longest;", "}"],
        cpp: ["int longest_hot_streak(const std::vector<int>& temps) {", "    int current = 0;", "    int longest = 0;", "    for (int t : temps) {", "        if (t > 30) {", "            current++;", "        } else {", "            if (current > longest) longest = current;   // ✗ only on a break", "            current = 0;", "        }", "    }", "    return longest;", "}"]
      },
      bugNoReset: {
        python: ["def longest_hot_streak(temps):", "    current = 0", "    longest = 0", "    for t in temps:", "        if t > 30:", "            current += 1", "            if current > longest:", "                longest = current", "    return longest"],
        java: ["static int longestHotStreak(int[] temps) {", "    int current = 0;", "    int longest = 0;", "    for (int t : temps) {", "        if (t > 30) {", "            current++;", "            if (current > longest) longest = current;", "        }", "    }", "    return longest;", "}"],
        rust: ["fn longest_hot_streak(temps: &[i32]) -> i32 {", "    let mut current = 0;", "    let mut longest = 0;", "    for &t in temps {", "        if t > 30 {", "            current += 1;", "            longest = longest.max(current);", "        }", "    }", "    longest", "}"],
        c: ["int longest_hot_streak(const int temps[], size_t n) {", "    int current = 0;", "    int longest = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (temps[i] > 30) {", "            current++;", "            if (current > longest) longest = current;", "        }", "    }", "    return longest;", "}"],
        cpp: ["int longest_hot_streak(const std::vector<int>& temps) {", "    int current = 0;", "    int longest = 0;", "    for (int t : temps) {", "        if (t > 30) {", "            current++;", "            if (current > longest) longest = current;", "        }", "    }", "    return longest;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([33, 20, 31, 32, 34, 25]) return?", options: ["2", "3", "4"], answer: 1, explain: "Runs of hot days: [33] (1) and [31, 32, 34] (3). The longest is 3." },
      { q: "This version has a bug. What does it return for [31, 20, 32]?", code: "bugNoReset", options: ["1", "2"], answer: 1, explain: "The cool day never resets current, so it reaches 2 by the last day, though no two hot days are next to each other." },
      { q: "After a cold day, what happens to longest?", options: ["It goes back to 0", "It keeps its value"], answer: 1, explain: "Only the current run resets. The record remembers the best run so far." }
    ],

    exercise: {
      title: "Your turn: longest run of a value",
      task: "Write <code>longest_run_of(numbers, target)</code> that returns the length of the longest run of items equal to <code>target</code>.",
      plan: ["Start current and longest at 0", "Visit each number", "Equal to the target? Extend the current run", "Beats the record? Update it", "Otherwise reset the current run, and finally return the record"],
      fn: { python: "longest_run_of", java: "longestRunOf", rust: "longest_run_of", c: "longest_run_of", cpp: "longest_run_of" },
      params: ["int[]", "int"], returns: "int",
      tests: [{ args: [[1, 1, 0, 1, 1, 1], 1], expect: 3 }, { args: [[], 5], expect: 0 }, { args: [[2, 2], 3], expect: 0 }, { args: [[7], 7], expect: 1 }],
      solutions: {
        python: ["def longest_run_of(numbers, target):", "    current = 0", "    longest = 0", "    for x in numbers:", "        if x == target:", "            current += 1", "            if current > longest:", "                longest = current", "        else:", "            current = 0", "    return longest"],
        java: ["static int longestRunOf(int[] numbers, int target) {", "    int current = 0;", "    int longest = 0;", "    for (int x : numbers) {", "        if (x == target) {", "            current++;", "            if (current > longest) longest = current;", "        } else {", "            current = 0;", "        }", "    }", "    return longest;", "}"],
        rust: ["fn longest_run_of(numbers: &[i32], target: i32) -> i32 {", "    let mut current = 0;", "    let mut longest = 0;", "    for &x in numbers {", "        if x == target {", "            current += 1;", "            longest = longest.max(current);", "        } else {", "            current = 0;", "        }", "    }", "    longest", "}"],
        c: ["int longest_run_of(const int numbers[], size_t n, int target) {", "    int current = 0;", "    int longest = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (numbers[i] == target) {", "            current++;", "            if (current > longest) longest = current;", "        } else {", "            current = 0;", "        }", "    }", "    return longest;", "}"],
        cpp: ["#include <vector>", "", "int longest_run_of(const std::vector<int>& numbers, int target) {", "    int current = 0;", "    int longest = 0;", "    for (int x : numbers) {", "        if (x == target) {", "            current++;", "            if (current > longest) longest = current;", "        } else {", "            current = 0;", "        }", "    }", "    return longest;", "}"]
      }
    },

    compare: {
      intro: "Three plans on the temperatures <code>[31, 32, 20, 33, 34, 35]</code>.",
      data: [31, 32, 20, 33, 34, 35],
      rows: [
        { id: "D13", name: "Longest run", question: "Longest run of days above 30?", result: "3", self: true },
        { id: "D1", name: "Counting", question: "How many days above 30?", result: "5" },
        { id: "D4", name: "Largest / smallest", question: "Hottest day?", result: "35" }
      ],
      table: { head: ["Plan", "Variables", "Resets?", "Returns"], rows: [["Longest run", "current run + record", "current, on a failing item", "the longest run"], ["Counting", "one counter", "never", "how many pass"], ["Largest / smallest", "best so far", "never", "the best value"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "D1", why: "the current run is a counter" }, { id: "D4", why: "the record is a best-so-far" }],
      leadsTo: [{ id: "D12", why: "runs of rises compare each item with the one before" }]
    }
  };
})();
