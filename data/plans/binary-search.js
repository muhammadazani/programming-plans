/* Plan data: F2 · Binary search
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  window.PLAN = {
    id: "F2",
    slug: "binary-search",
    title: "Binary search",
    highlight: "Binary",
    aka: ["bisection", "halving search", "divide and conquer search"],
    group: "F",
    level: "Advanced",
    core: false,
    fn: { python: "binary_search", java: "binarySearch", rust: "binary_search", c: "binary_search", cpp: "binary_search" },

    hero: { type: "tiles", values: [1, 3, 5, 7, 9], colors: ["fade", "fade", "pale", "amber", "pale"], highlight: 3, tag: "found 7 at [3]", alt: "A sorted row of cubes; the left half is faded as ruled out, and 7 is amber as found" },
    planCard: { name: "bisect", lines: ["low = start, high = end", "look at the middle", "rule out half"], foot: "↻ until found or empty" },

    intent: "Find an item in sorted data by looking at the middle of the remaining range and ruling out the half where the item can't be, again and again.",

    analogy: { icon: "📞", title: "Finding a name in a phone book", text: "You open the book near the middle. The names there come after the one you want, so the whole second half is ruled out. You open the first half in its middle and repeat. A thousand pages take only about ten looks." },

    cues: ["sorted list", "search quickly", "in order", "guess the number (higher / lower)", "large data"],
    cueSummary: "The data is <b>sorted</b>, and you need to find something in it fast.",
    cueExamples: ["Where is 7 in [1, 3, 5, 7, 9, 11]?", "Guess a number from 1 to 100 with “higher” and “lower” hints.", "Look up a word in a sorted dictionary."],

    steps: [
      { n: 1, title: "The search range is the whole list", text: "low = 0, high = the last position." },
      { n: 2, title: "While the range isn't empty", text: "low ≤ high. A range with one item still needs checking." },
      { n: 3, title: "Look at the middle item", text: "mid = (low + high) // 2." },
      { n: 4, title: "Found it? Return its position", text: "The item at mid is the target." },
      { n: 5, title: "Otherwise rule out half", text: "Target bigger: it can only be right of mid (low = mid + 1). Smaller: left of mid (high = mid − 1)." },
      { n: 6, title: "Range empty: return -1", text: "The target isn't in the list." }
    ],

    impl: {
      python: { file: "bisect.py",
        plain: { lines: [[0, "def binary_search(numbers, target):"], [1, "    low = 0"], [1, "    high = len(numbers) - 1"], [2, "    while low <= high:"], [3, "        mid = (low + high) // 2"], [4, "        if numbers[mid] == target:"], [4, "            return mid"], [5, "        elif numbers[mid] < target:"], [5, "            low = mid + 1"], [5, "        else:"], [5, "            high = mid - 1"], [6, "    return -1"]] },
        idiomatic: { lines: [[0, "from bisect import bisect_left"], [0, ""], [0, "def binary_search(numbers, target):"], [[1, 2, 3, 5], "    i = bisect_left(numbers, target)"], [[4, 6], "    return i if i < len(numbers) and numbers[i] == target else -1"]], note: "<code>bisect_left</code> returns where the target is, or where it would be inserted; the second line checks it's really there." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int binarySearch(int[] numbers, int target) {"], [1, "    int low = 0;"], [1, "    int high = numbers.length - 1;"], [2, "    while (low <= high) {"], [3, "        int mid = (low + high) / 2;"], [4, "        if (numbers[mid] == target) {"], [4, "            return mid;"], [5, "        } else if (numbers[mid] < target) {"], [5, "            low = mid + 1;"], [5, "        } else {"], [5, "            high = mid - 1;"], [0, "        }"], [0, "    }"], [6, "    return -1;"], [0, "}"]], note: "For very large arrays, <code>low + (high - low) / 2</code> avoids <code>low + high</code> overflowing." },
        idiomatic: { lines: [[0, "static int binarySearch(int[] numbers, int target) {"], [[1, 2, 3, 4, 5], "    int i = Arrays.binarySearch(numbers, target);"], [6, "    return i >= 0 ? i : -1;"], [0, "}"]], note: "<code>Arrays.binarySearch</code> returns a negative number (not always -1) when the target is missing." } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn binary_search(numbers: &[i32], target: i32) -> i32 {"], [1, "    let mut low: i32 = 0;"], [1, "    let mut high: i32 = numbers.len() as i32 - 1;"], [2, "    while low <= high {"], [3, "        let mid = (low + high) / 2;"], [4, "        if numbers[mid as usize] == target {"], [4, "            return mid;"], [5, "        } else if numbers[mid as usize] < target {"], [5, "            low = mid + 1;"], [5, "        } else {"], [5, "            high = mid - 1;"], [0, "        }"], [0, "    }"], [6, "    -1"], [0, "}"]], note: "Signed <code>i32</code> positions, because <code>high</code> can drop to -1, which a <code>usize</code> can't hold." },
        idiomatic: { lines: [[0, "fn binary_search(numbers: &[i32], target: i32) -> i32 {"], [[1, 2, 3, 4, 5, 6], "    numbers.binary_search(&target).map_or(-1, |i| i as i32)"], [0, "}"]], note: "<code>binary_search</code> returns <code>Ok(position)</code> or <code>Err(insert position)</code>." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "int binary_search(const int numbers[], size_t n, int target) {"], [1, "    int low = 0;"], [1, "    int high = (int) n - 1;"], [2, "    while (low <= high) {"], [3, "        int mid = (low + high) / 2;"], [4, "        if (numbers[mid] == target) {"], [4, "            return mid;"], [5, "        } else if (numbers[mid] < target) {"], [5, "            low = mid + 1;"], [5, "        } else {"], [5, "            high = mid - 1;"], [0, "        }"], [0, "    }"], [6, "    return -1;"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <stdlib.h>"], [0, ""], [0, "static int compare_ints(const void *a, const void *b) {"], [0, "    int x = *(const int *) a, y = *(const int *) b;"], [0, "    return (x > y) - (x < y);"], [0, "}"], [0, ""], [0, "int binary_search(const int numbers[], size_t n, int target) {"], [[1, 2, 3, 4, 5], "    const int *found = bsearch(&target, numbers, n, sizeof(int), compare_ints);"], [6, "    return found ? (int) (found - numbers) : -1;"], [0, "}"]], note: "The standard library's <code>bsearch</code> needs a comparison function." } },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "int binary_search(const std::vector<int>& numbers, int target) {"], [1, "    int low = 0;"], [1, "    int high = static_cast<int>(numbers.size()) - 1;"], [2, "    while (low <= high) {"], [3, "        int mid = (low + high) / 2;"], [4, "        if (numbers[mid] == target) {"], [4, "            return mid;"], [5, "        } else if (numbers[mid] < target) {"], [5, "            low = mid + 1;"], [5, "        } else {"], [5, "            high = mid - 1;"], [0, "        }"], [0, "    }"], [6, "    return -1;"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <algorithm>"], [0, "#include <vector>"], [0, ""], [0, "int binary_search(const std::vector<int>& numbers, int target) {"], [[1, 2, 3, 5], "    auto it = std::ranges::lower_bound(numbers, target);"], [[4, 6], "    return (it != numbers.end() && *it == target) ? static_cast<int>(it - numbers.begin()) : -1;"], [0, "}"]], note: "<code>lower_bound</code> finds the first item not smaller than the target. (<code>std::binary_search</code> only says yes or no.)" } }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Find the position of a number in a sorted list</b>, or -1 if it isn't there.",
      input: { kind: "none" },
      presets: [
        { label: "Find 7", input: { numbers: [1, 3, 5, 7, 9, 11], target: 7 } },
        { label: "Find 1 (first)", input: { numbers: [1, 3, 5, 7, 9, 11, 13], target: 1 } },
        { label: "Find 4 (missing)", input: { numbers: [1, 3, 5, 7, 9], target: 4 } }
      ],
      run({ numbers: list, target }) {
        const ev = [];
        let low = 0, high = list.length - 1, mid = -1;
        const view = (found = -1) => ({
          values: list, ptr: mid,
          states: list.map((_, i) => (i === found ? "hit" : i < low || i > high ? "skipped" : i === mid ? "current" : "")),
          badges: list.map((_, i) => [i === low && low <= high ? "low" : "", i === mid ? "mid" : "", i === high && low <= high ? "high" : ""].filter(Boolean).join(" "))
        });
        const snap = (step, msg, found = -1, tone = "") => ev.push({ step, msg, tone, view: view(found),
          vars: [{ k: "low", role: "stepper", v: low }, { k: "high", role: "stepper", v: high }, { k: "mid", role: "temp", v: mid >= 0 ? mid : "—" }, { k: "target", role: "fixed", v: target }] });
        snap(null, `Ready. Find ${target} in a sorted list of ${list.length}.`);
        snap(1, `The range is the whole list: low = 0, high = ${high}.`);
        let looks = 0;
        while (low <= high) {
          snap(2, `low (${low}) ≤ high (${high}): ${high - low + 1} item${high > low ? "s" : ""} left to search.`);
          mid = Math.floor((low + high) / 2); looks++;
          snap(3, `Middle: mid = (${low} + ${high}) // 2 = ${mid}, where the item is ${list[mid]}.`);
          if (list[mid] === target) { snap(4, `${list[mid]} is the target. Return ${mid}, after ${looks} look${looks > 1 ? "s" : ""}.`, mid, "yes"); return ev; }
          if (list[mid] < target) { low = mid + 1; snap(5, `${list[mid]} < ${target}, so the target can only be to the right: low = ${low}.`); }
          else { high = mid - 1; snap(5, `${list[mid]} > ${target}, so the target can only be to the left: high = ${high}.`); }
          mid = -1;
        }
        snap(6, `low (${low}) > high (${high}): the range is empty. ${target} isn't in the list. Return -1.`, -1, "no");
        return ev;
      }
    },

    checks: {
      params: ["int[]", "int"], returns: "int",
      cases: [{ args: [[1, 3, 5, 7, 9, 11], 7], expect: 3 }, { args: [[1, 3, 5], 4], expect: -1 }, { args: [[], 3], expect: -1 }, { args: [[5], 5], expect: 0 }, { args: [[2, 4, 6, 8], 2], expect: 0 }, { args: [[2, 4, 6, 8], 8], expect: 3 }],
      snippets: { bugStrict: [{ args: [[5], 5], expect: -1 }, { args: [[1, 3, 5], 5], expect: -1 }], bugHalves: [{ args: [[1, 3, 5, 7, 9], 7], expect: -1 }] }
    },

    pitfalls: [
      { kind: "dont", title: "< instead of <=", wide: true, code: "bugStrict", text: "With <code>while low &lt; high</code>, a range of exactly one item is never checked. A one-item list, or a target at the very end, comes back as -1.", take: "Keep going while low ≤ high." },
      { kind: "dont", title: "Ruling out the wrong half", text: "If the middle item is smaller than the target, the target is to the <em>right</em>. Swapping the two updates throws away the half that holds it.", take: "Smaller in the middle → move low up; bigger → move high down." },
      { kind: "dont", title: "Searching unsorted data", text: "Binary search only works if the items are in order. On unsorted data it quietly gives wrong answers.", take: "Sort first, or use Find the first (D6)." },
      { kind: "do", title: "Feel the speed", text: "Each look halves the range: 1 000 items take at most 10 looks, a million at most 20. A linear search could need all of them." },
      { kind: "do", title: "Use the library version", text: "<code>bisect</code>, <code>Arrays.binarySearch</code>, <code>slice::binary_search</code>, <code>bsearch</code> and <code>lower_bound</code> are well tested; know what each returns when the item is missing." }
    ],

    snippets: {
      bugStrict: {
        python: ["def binary_search(numbers, target):", "    low = 0", "    high = len(numbers) - 1", "    while low < high:            # ✗ skips a one-item range", "        mid = (low + high) // 2", "        if numbers[mid] == target:", "            return mid", "        elif numbers[mid] < target:", "            low = mid + 1", "        else:", "            high = mid - 1", "    return -1"],
        java: ["static int binarySearch(int[] numbers, int target) {", "    int low = 0, high = numbers.length - 1;", "    while (low < high) {         // ✗ skips a one-item range", "        int mid = (low + high) / 2;", "        if (numbers[mid] == target) return mid;", "        else if (numbers[mid] < target) low = mid + 1;", "        else high = mid - 1;", "    }", "    return -1;", "}"],
        rust: ["fn binary_search(numbers: &[i32], target: i32) -> i32 {", "    let (mut low, mut high): (i32, i32) = (0, numbers.len() as i32 - 1);", "    while low < high {           // ✗ skips a one-item range", "        let mid = (low + high) / 2;", "        if numbers[mid as usize] == target { return mid; }", "        else if numbers[mid as usize] < target { low = mid + 1; }", "        else { high = mid - 1; }", "    }", "    -1", "}"],
        c: ["int binary_search(const int numbers[], size_t n, int target) {", "    int low = 0, high = (int) n - 1;", "    while (low < high) {         // ✗ skips a one-item range", "        int mid = (low + high) / 2;", "        if (numbers[mid] == target) return mid;", "        else if (numbers[mid] < target) low = mid + 1;", "        else high = mid - 1;", "    }", "    return -1;", "}"],
        cpp: ["int binary_search(const std::vector<int>& numbers, int target) {", "    int low = 0, high = static_cast<int>(numbers.size()) - 1;", "    while (low < high) {         // ✗ skips a one-item range", "        int mid = (low + high) / 2;", "        if (numbers[mid] == target) return mid;", "        else if (numbers[mid] < target) low = mid + 1;", "        else high = mid - 1;", "    }", "    return -1;", "}"]
      },
      bugHalves: {
        python: ["def binary_search(numbers, target):", "    low = 0", "    high = len(numbers) - 1", "    while low <= high:", "        mid = (low + high) // 2", "        if numbers[mid] == target:", "            return mid", "        elif numbers[mid] < target:", "            high = mid - 1", "        else:", "            low = mid + 1", "    return -1"],
        java: ["static int binarySearch(int[] numbers, int target) {", "    int low = 0, high = numbers.length - 1;", "    while (low <= high) {", "        int mid = (low + high) / 2;", "        if (numbers[mid] == target) return mid;", "        else if (numbers[mid] < target) high = mid - 1;", "        else low = mid + 1;", "    }", "    return -1;", "}"],
        rust: ["fn binary_search(numbers: &[i32], target: i32) -> i32 {", "    let (mut low, mut high): (i32, i32) = (0, numbers.len() as i32 - 1);", "    while low <= high {", "        let mid = (low + high) / 2;", "        if numbers[mid as usize] == target { return mid; }", "        else if numbers[mid as usize] < target { high = mid - 1; }", "        else { low = mid + 1; }", "    }", "    -1", "}"],
        c: ["int binary_search(const int numbers[], size_t n, int target) {", "    int low = 0, high = (int) n - 1;", "    while (low <= high) {", "        int mid = (low + high) / 2;", "        if (numbers[mid] == target) return mid;", "        else if (numbers[mid] < target) high = mid - 1;", "        else low = mid + 1;", "    }", "    return -1;", "}"],
        cpp: ["int binary_search(const std::vector<int>& numbers, int target) {", "    int low = 0, high = static_cast<int>(numbers.size()) - 1;", "    while (low <= high) {", "        int mid = (low + high) / 2;", "        if (numbers[mid] == target) return mid;", "        else if (numbers[mid] < target) high = mid - 1;", "        else low = mid + 1;", "    }", "    return -1;", "}"]
      }
    },

    quiz: [
      { q: "Searching for 9 in [1, 3, 5, 7, 9, 11, 13], which position is looked at first?", options: ["0", "3", "4"], answer: 1, explain: "mid = (0 + 6) // 2 = 3, where the item is 7. Since 7 < 9, the left half is ruled out." },
      { q: "This version has a bug. What does it return for 7 in [1, 3, 5, 7, 9]?", code: "bugHalves", options: ["3", "-1"], answer: 1, explain: "The middle item 5 is smaller than 7, but the code moves high down, throwing away the right half where the 7 is." },
      { q: "About how many looks does binary search need for 1 000 sorted items?", options: ["10", "100", "500"], answer: 0, explain: "Each look halves the range: 1000 → 500 → 250 → … → 1 takes about 10 halvings." }
    ],

    exercise: {
      title: "Your turn: where would it go?",
      task: "Write <code>insert_position(numbers, target)</code> for a sorted list: return the position where <code>target</code> should be inserted to keep the list sorted (before any equal items).",
      plan: ["Range: low = 0, high = length (one past the end)", "While low < high", "Look at the middle item", "Smaller than the target? low = mid + 1; otherwise high = mid", "Return low"],
      fn: { python: "insert_position", java: "insertPosition", rust: "insert_position", c: "insert_position", cpp: "insert_position" },
      params: ["int[]", "int"], returns: "int",
      tests: [{ args: [[1, 3, 5], 4], expect: 2 }, { args: [[1, 3, 5], 0], expect: 0 }, { args: [[1, 3, 5], 9], expect: 3 }, { args: [[], 5], expect: 0 }, { args: [[2, 4], 4], expect: 1 }],
      solutions: {
        python: ["def insert_position(numbers, target):", "    low = 0", "    high = len(numbers)", "    while low < high:", "        mid = (low + high) // 2", "        if numbers[mid] < target:", "            low = mid + 1", "        else:", "            high = mid", "    return low"],
        java: ["static int insertPosition(int[] numbers, int target) {", "    int low = 0, high = numbers.length;", "    while (low < high) {", "        int mid = (low + high) / 2;", "        if (numbers[mid] < target) low = mid + 1;", "        else high = mid;", "    }", "    return low;", "}"],
        rust: ["fn insert_position(numbers: &[i32], target: i32) -> i32 {", "    let (mut low, mut high) = (0, numbers.len());", "    while low < high {", "        let mid = (low + high) / 2;", "        if numbers[mid] < target { low = mid + 1; } else { high = mid; }", "    }", "    low as i32", "}"],
        c: ["int insert_position(const int numbers[], size_t n, int target) {", "    size_t low = 0, high = n;", "    while (low < high) {", "        size_t mid = (low + high) / 2;", "        if (numbers[mid] < target) low = mid + 1;", "        else high = mid;", "    }", "    return (int) low;", "}"],
        cpp: ["#include <vector>", "", "int insert_position(const std::vector<int>& numbers, int target) {", "    size_t low = 0, high = numbers.size();", "    while (low < high) {", "        size_t mid = (low + high) / 2;", "        if (numbers[mid] < target) low = mid + 1;", "        else high = mid;", "    }", "    return static_cast<int>(low);", "}"]
      }
    },

    compare: {
      intro: "Two searches for 7 in <code>[1, 3, 5, 7, 9, 11]</code>. Faded items are never looked at; amber marks where each stops.",
      data: [1, 3, 5, 7, 9, 11],
      rows: [
        { id: "F2", name: "Binary search", question: "Look at the middle, rule out half", stop: 3, result: "2 looks", self: true },
        { id: "D6", name: "Find the first", question: "Look at each item from the left", stop: 3, result: "4 looks" }
      ],
      table: { head: ["Plan", "Needs sorted data?", "Looks for n items", "For 1 000 000 items"], rows: [["Binary search", "yes", "about log₂ n", "about 20"], ["Find the first", "no", "up to n", "up to 1 000 000"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "D6", why: "the same question, answered by halving" }, { id: "F1", why: "two positions that close in on each other" }],
      leadsTo: [{ id: "F3", why: "sort the data first" }]
    }
  };
})();
