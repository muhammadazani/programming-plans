/* Plan data: F4 · Remember what you've seen
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   Returns a new list (C: output array, returning its length). */

(function () {
  window.PLAN = {
    id: "F4",
    slug: "remember-what-you-have-seen",
    title: "Remember what you've seen",
    highlight: "seen",
    aka: ["seen set", "remove duplicates", "deduplicate"],
    group: "F",
    level: "Advanced",
    core: false,
    fn: { python: "unique", java: "unique", rust: "unique", c: "unique", cpp: "unique" },

    hero: { type: "tiles", values: [3, 1, 3, 2, 1], colors: ["amber", "amber", "fade", "amber", "fade"], tagAt: 4, tag: "[3, 1, 2]", alt: "Five numbers; the first 3, 1 and 2 are amber because they are kept, and the repeats are faded" },
    planCard: { name: "seen", lines: ["seen = empty set", "seen before? skip it", "new? keep it, remember it"], foot: "→ each value once" },

    intent: "Keep a set of the values you've already met, so you can recognise repeats instantly: here, to keep only the first copy of each value.",

    analogy: { icon: "🎟️", title: "Stamping hands at the door", text: "At a festival gate, each visitor's hand is stamped the first time they come in. When someone comes back, the stamp shows they've already been counted, so they aren't counted twice. The stamp is the “seen” set." },

    cues: ["remove duplicates", "each … only once", "unique / distinct", "already seen", "first repeat"],
    cueSummary: "You need to know, for each item, <b>whether it has appeared before</b>.",
    cueExamples: ["Remove the duplicate names from a list, keeping the first of each.", "Which number is the first to appear twice?", "How many different visitors came this week?"],

    steps: [
      { n: 1, title: "Start with an empty result and an empty “seen” set", text: "A set answers “have I seen this?” at once, however many items it holds." },
      { n: 2, title: "Visit each item", text: "In order, so the first copy of each value is the one kept." },
      { n: 3, title: "Seen it before? Skip it", text: "It's a repeat." },
      { n: 4, title: "New? Keep it and remember it", text: "Add it to the result and to the seen set." },
      { n: 5, title: "Return the result", text: "Each value once, in the order it first appeared." }
    ],

    impl: {
      python: { file: "unique.py",
        plain: { lines: [[0, "def unique(numbers):"], [1, "    seen = set()"], [1, "    result = []"], [2, "    for x in numbers:"], [3, "        if x in seen:"], [3, "            continue"], [4, "        seen.add(x)"], [4, "        result.append(x)"], [5, "    return result"]] },
        idiomatic: { lines: [[0, "def unique(numbers):"], [[1, 2, 3, 4, 5], "    return list(dict.fromkeys(numbers))"]], note: "A dictionary keeps one entry per key, in the order they were first added." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static List<Integer> unique(int[] numbers) {"], [1, "    Set<Integer> seen = new HashSet<>();"], [1, "    List<Integer> result = new ArrayList<>();"], [2, "    for (int x : numbers) {"], [3, "        if (seen.contains(x)) {"], [3, "            continue;"], [0, "        }"], [4, "        seen.add(x);"], [4, "        result.add(x);"], [0, "    }"], [5, "    return result;"], [0, "}"]], note: "<code>seen.add(x)</code> also returns false if x was already there, so steps 3 and 4 can be one <code>if (seen.add(x))</code>." },
        idiomatic: { lines: [[0, "static List<Integer> unique(int[] numbers) {"], [[1, 2, 3, 4, 5], "    return Arrays.stream(numbers).distinct().boxed().toList();"], [0, "}"]], note: "<code>distinct()</code> keeps the first of each value, in order." } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "use std::collections::HashSet;"], [0, ""], [0, "fn unique(numbers: &[i32]) -> Vec<i32> {"], [1, "    let mut seen = HashSet::new();"], [1, "    let mut result = Vec::new();"], [2, "    for &x in numbers {"], [3, "        if seen.contains(&x) {"], [3, "            continue;"], [0, "        }"], [4, "        seen.insert(x);"], [4, "        result.push(x);"], [0, "    }"], [5, "    result"], [0, "}"]] },
        idiomatic: { lines: [[0, "use std::collections::HashSet;"], [0, ""], [0, "fn unique(numbers: &[i32]) -> Vec<i32> {"], [1, "    let mut seen = HashSet::new();"], [[2, 3, 4, 5], "    numbers.iter().copied().filter(|x| seen.insert(*x)).collect()"], [0, "}"]], note: "<code>insert</code> returns true only for a new value, so it is the filter's test." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "size_t unique(const int numbers[], size_t n, int out[]) {"], [1, "    size_t count = 0;   /* out[0..count) is both the result and the seen set */"], [2, "    for (size_t i = 0; i < n; i++) {"], [3, "        bool seen = false;"], [3, "        for (size_t k = 0; k < count; k++) {"], [3, "            if (out[k] == numbers[i]) seen = true;"], [3, "        }"], [3, "        if (seen) continue;"], [4, "        out[count] = numbers[i];"], [4, "        count++;"], [0, "    }"], [5, "    return count;"], [0, "}"]], note: "C has no built-in set, so the result itself is searched (an Is there any? inside the loop). Fine for small lists; for big ones, sort first or use a hash table." },
        idiomatic: null, idiomaticNote: "Searching the kept items is the usual small-scale C approach." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <unordered_set>"], [0, "#include <vector>"], [0, ""], [0, "std::vector<int> unique(const std::vector<int>& numbers) {"], [1, "    std::unordered_set<int> seen;"], [1, "    std::vector<int> result;"], [2, "    for (int x : numbers) {"], [3, "        if (seen.count(x)) {"], [3, "            continue;"], [0, "        }"], [4, "        seen.insert(x);"], [4, "        result.push_back(x);"], [0, "    }"], [5, "    return result;"], [0, "}"]], note: "C++20 also has <code>seen.contains(x)</code>. (<code>std::unique</code> is different: it only removes repeats that are next to each other.)" },
        idiomatic: null, idiomaticNote: "The seen-set loop is the idiomatic C++ when the original order matters." }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Remove the duplicates from a list, keeping the first copy of each value.</b>",
      input: { kind: "list", max: 10, placeholder: "numbers: 3, 1, 3, 2" },
      presets: [{ label: "Some repeats", input: [3, 1, 3, 2, 1] }, { label: "All the same", input: [5, 5, 5] }, { label: "No repeats", input: [1, 2, 3] }],
      run(list) {
        const ev = [], states = list.map(() => ""), seen = [], result = [];
        const snap = (step, msg, cur = -1, tone = "", fresh = -1) => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur, out: { label: "result", items: result.slice(), fresh, empty: "[ ] empty" } },
          vars: [{ k: "x", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "seen", role: "gatherer", v: `{${seen.join(", ")}}` }] });
        snap(null, list.length ? "Ready. Keep the first copy of each value." : "Ready. The list is empty.");
        snap(1, "Start with an empty result and an empty seen set.");
        list.forEach((x, i) => {
          states[i] = "current"; snap(2, `Visit item [${i}]: ${x}.`, i);
          if (seen.includes(x)) { states[i] = "skipped"; snap(3, `${x} is already in the seen set: skip this repeat.`, i); return; }
          seen.push(x); result.push(x); states[i] = "added";
          snap(4, `${x} is new: keep it, and remember it.`, i, "", result.length - 1);
        });
        snap(5, `Return [${result.join(", ")}].`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"], returns: "int[]",
      cases: [{ args: [[3, 1, 3, 2, 1]], expect: [3, 1, 2] }, { args: [[]], expect: [] }, { args: [[5, 5, 5]], expect: [5] }, { args: [[1, 2, 3]], expect: [1, 2, 3] }],
      snippets: { bugNeighbours: [{ args: [[1, 2, 1]], expect: [1, 2, 1] }, { args: [[1, 1, 2]], expect: [1, 2] }], bugForget: [{ args: [[1, 1, 2]], expect: [1, 1, 2] }] }
    },

    pitfalls: [
      { kind: "dont", title: "Only comparing with the previous item", wide: true, code: "bugNeighbours", text: "Checking just the item before catches repeats that are next to each other, but [1, 2, 1] keeps both 1s.", take: "Remember every value seen so far, not just the last one." },
      { kind: "dont", title: "Forgetting to remember", text: "If new values are kept but never added to the seen set, nothing ever counts as seen, and every repeat is kept.", take: "Keeping and remembering go together." },
      { kind: "dont", title: "Searching a list instead of a set", text: "Checking <code>x in result</code> on a list walks the whole list each time: fine for 10 items, slow for 100 000.", take: "Use a set (or dictionary) for the seen values." },
      { kind: "do", title: "Reuse the seen set for other questions", text: "The same set tells you the first repeat (exercise), how many distinct values there are (its size), or whether two lists share a value." },
      { kind: "do", title: "Use a dictionary for counts", text: "If you need how many times each value appears, not just whether, use Count occurrences (D15)." }
    ],

    snippets: {
      bugNeighbours: {
        python: ["def unique(numbers):", "    result = []", "    for x in numbers:", "        if result and result[-1] == x:   # ✗ only the previous item", "            continue", "        result.append(x)", "    return result"],
        java: ["static List<Integer> unique(int[] numbers) {", "    List<Integer> result = new ArrayList<>();", "    for (int x : numbers) {", "        if (!result.isEmpty() && result.get(result.size() - 1) == x) continue;   // ✗ only the previous item", "        result.add(x);", "    }", "    return result;", "}"],
        rust: ["fn unique(numbers: &[i32]) -> Vec<i32> {", "    let mut result: Vec<i32> = Vec::new();", "    for &x in numbers {", "        if result.last() == Some(&x) { continue; }   // ✗ only the previous item", "        result.push(x);", "    }", "    result", "}"],
        c: ["size_t unique(const int numbers[], size_t n, int out[]) {", "    size_t count = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (count > 0 && out[count - 1] == numbers[i]) continue;   // ✗ only the previous item", "        out[count] = numbers[i];", "        count++;", "    }", "    return count;", "}"],
        cpp: ["std::vector<int> unique(const std::vector<int>& numbers) {", "    std::vector<int> result;", "    for (int x : numbers) {", "        if (!result.empty() && result.back() == x) continue;   // ✗ only the previous item", "        result.push_back(x);", "    }", "    return result;", "}"]
      },
      bugForget: {
        python: ["def unique(numbers):", "    seen = set()", "    result = []", "    for x in numbers:", "        if x in seen:", "            continue", "        result.append(x)", "    return result"],
        java: ["static List<Integer> unique(int[] numbers) {", "    Set<Integer> seen = new HashSet<>();", "    List<Integer> result = new ArrayList<>();", "    for (int x : numbers) {", "        if (seen.contains(x)) continue;", "        result.add(x);", "    }", "    return result;", "}"],
        rust: ["fn unique(numbers: &[i32]) -> Vec<i32> {", "    let seen: std::collections::HashSet<i32> = std::collections::HashSet::new();", "    let mut result = Vec::new();", "    for &x in numbers {", "        if seen.contains(&x) { continue; }", "        result.push(x);", "    }", "    result", "}"],
        c: ["size_t unique(const int numbers[], size_t n, int out[]) {", "    int seen[100];", "    size_t seen_count = 0;", "    size_t count = 0;", "    for (size_t i = 0; i < n; i++) {", "        bool found = false;", "        for (size_t k = 0; k < seen_count; k++) if (seen[k] == numbers[i]) found = true;", "        if (found) continue;", "        out[count++] = numbers[i];", "    }", "    return count;", "}"],
        cpp: ["std::vector<int> unique(const std::vector<int>& numbers) {", "    std::unordered_set<int> seen;", "    std::vector<int> result;", "    for (int x : numbers) {", "        if (seen.count(x)) continue;", "        result.push_back(x);", "    }", "    return result;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([4, 2, 4, 4, 9, 2]) return?", options: ["[4, 2, 9]", "[2, 4, 9]", "[4, 2, 4, 9]"], answer: 0, explain: "The first copies, in the order they first appear: 4, 2, 9." },
      { q: "This version has a bug. What does it return for [1, 2, 1]?", code: "bugNeighbours", options: ["[1, 2]", "[1, 2, 1]"], answer: 1, explain: "It only compares each item with the one just kept. The second 1 comes after a 2, so it isn't recognised as a repeat." },
      { q: "Why use a set for the seen values?", options: ["It answers “have I seen this?” quickly, however big it gets", "It keeps the items sorted", "It can hold duplicates"], answer: 0, explain: "Checking a set takes about the same time whether it holds 10 values or a million; checking a list gets slower as it grows." }
    ],

    exercise: {
      title: "Your turn: the first repeat",
      task: "Write <code>first_repeat(numbers)</code> that returns the first value that appears for the second time, or -1 if nothing repeats. (In C you may assume values are from 0 to 99.)",
      plan: ["Start with an empty seen set", "Visit each number", "Already seen? Return it straight away", "Otherwise remember it", "No repeat at the end: return -1"],
      fn: { python: "first_repeat", java: "firstRepeat", rust: "first_repeat", c: "first_repeat", cpp: "first_repeat" },
      params: ["int[]"], returns: "int",
      tests: [{ args: [[3, 1, 4, 1, 5]], expect: 1 }, { args: [[1, 2, 3]], expect: -1 }, { args: [[]], expect: -1 }, { args: [[7, 7]], expect: 7 }],
      solutions: {
        python: ["def first_repeat(numbers):", "    seen = set()", "    for x in numbers:", "        if x in seen:", "            return x", "        seen.add(x)", "    return -1"],
        java: ["static int firstRepeat(int[] numbers) {", "    Set<Integer> seen = new HashSet<>();", "    for (int x : numbers) {", "        if (!seen.add(x)) return x;", "    }", "    return -1;", "}"],
        rust: ["fn first_repeat(numbers: &[i32]) -> i32 {", "    let mut seen = std::collections::HashSet::new();", "    for &x in numbers {", "        if !seen.insert(x) { return x; }", "    }", "    -1", "}"],
        c: ["int first_repeat(const int numbers[], size_t n) {", "    bool seen[100] = {false};", "    for (size_t i = 0; i < n; i++) {", "        if (seen[numbers[i]]) return numbers[i];", "        seen[numbers[i]] = true;", "    }", "    return -1;", "}"],
        cpp: ["#include <unordered_set>", "#include <vector>", "", "int first_repeat(const std::vector<int>& numbers) {", "    std::unordered_set<int> seen;", "    for (int x : numbers) {", "        if (!seen.insert(x).second) return x;", "    }", "    return -1;", "}"]
      }
    },

    compare: {
      intro: "Plans that look at items in relation to what came before.",
      rows: [
        { id: "F4", name: "Remember what you've seen", question: "Remove duplicates", shape: "a set of every value met so far", result: "seen or new", self: true },
        { id: "D12", name: "Compare with the previous item", question: "Did it go up?", shape: "only the item just before", result: "a neighbour comparison" },
        { id: "E2", name: "Every pair", question: "Do any two items match?", shape: "nested loops over every pair", result: "n(n − 1)/2 checks" }
      ],
      table: { head: ["Plan", "Remembers", "Catches repeats far apart?", "Work for n items"], rows: [["Remember what you've seen", "every value seen", "yes", "about n set lookups"], ["Compare with the previous item", "one item", "no", "n − 1 comparisons"], ["Every pair", "nothing", "yes", "about n² / 2 comparisons"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "D9", why: "keep only some items: here, the new ones" }, { id: "D7", why: "“have I seen this?” is an is-there-any check" }],
      leadsTo: [{ id: "D15", why: "count how many times each value appears" }]
    }
  };
})();
