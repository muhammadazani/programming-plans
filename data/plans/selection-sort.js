/* Plan data: F3 · Selection sort
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   Returns a sorted copy (C: output array, returning its length). */

(function () {
  window.PLAN = {
    id: "F3",
    slug: "selection-sort",
    title: "Selection sort",
    highlight: "sort",
    aka: ["sort by selecting the minimum", "simple sort", "in-place sort"],
    group: "F",
    level: "Advanced",
    core: false,
    fn: { python: "selection_sort", java: "selectionSort", rust: "selection_sort", c: "selection_sort", cpp: "selection_sort" },

    hero: { type: "tiles", values: [1, 2, 7, 5, 9], colors: ["pale", "pale", "blue", "amber", "blue"], tagAt: 3, tag: "next smallest: 5", alt: "A row being sorted: 1 and 2 are already in place, and 5 is amber as the next smallest to move" },
    planCard: { name: "selection sort", lines: ["for each position i", "find the smallest from i on", "swap it into position i"], foot: "→ the left part grows sorted" },

    intent: "Sort a list by repeatedly finding the smallest remaining item and swapping it into the next position from the left.",

    analogy: { icon: "🃏", title: "Sorting a hand of cards", text: "Lay the cards in a row. Find the lowest card and swap it into the first place. Of the cards that are left, find the lowest and swap it into the second place. Keep going; the sorted part on the left grows by one card each time." },

    cues: ["sort", "in order", "smallest to largest", "arrange", "rank"],
    cueSummary: "The items must be <b>put in order</b>. (In real code you'd call the library sort; this plan shows how sorting works.)",
    cueExamples: ["Sort a list of scores from lowest to highest.", "Put the runners in order of finishing time.", "Arrange words alphabetically."],

    steps: [
      { n: 1, title: "Work on a copy", text: "So the caller's list is unchanged." },
      { n: 2, title: "For each position i, from the left", text: "Everything left of i is already sorted." },
      { n: 3, title: "Find the position of the smallest item from i to the end", text: "This is Position of the largest (D5), looking for the smallest." },
      { n: 4, title: "Swap it into position i", text: "A temp swap (A2). Now positions 0 to i are sorted." },
      { n: 5, title: "Return the sorted copy", text: "After the last position, everything is in order." }
    ],

    impl: {
      python: { file: "sort.py",
        plain: { lines: [[0, "def selection_sort(numbers):"], [1, "    result = list(numbers)"], [2, "    for i in range(len(result)):"], [3, "        smallest = i"], [3, "        for j in range(i + 1, len(result)):"], [3, "            if result[j] < result[smallest]:"], [3, "                smallest = j"], [4, "        temp = result[i]"], [4, "        result[i] = result[smallest]"], [4, "        result[smallest] = temp"], [5, "    return result"]] },
        idiomatic: { lines: [[0, "def selection_sort(numbers):"], [[1, 2, 3, 4, 5], "    return sorted(numbers)"]], note: "In real code, use <code>sorted()</code> (or <code>list.sort()</code>): it's much faster on big lists." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static List<Integer> selectionSort(int[] numbers) {"], [1, "    int[] result = numbers.clone();"], [2, "    for (int i = 0; i < result.length; i++) {"], [3, "        int smallest = i;"], [3, "        for (int j = i + 1; j < result.length; j++) {"], [3, "            if (result[j] < result[smallest]) smallest = j;"], [3, "        }"], [4, "        int temp = result[i];"], [4, "        result[i] = result[smallest];"], [4, "        result[smallest] = temp;"], [0, "    }"], [5, "    return Arrays.stream(result).boxed().toList();"], [0, "}"]] },
        idiomatic: { lines: [[0, "static List<Integer> selectionSort(int[] numbers) {"], [[1, 2, 3, 4, 5], "    return Arrays.stream(numbers).sorted().boxed().toList();"], [0, "}"]], note: "Or <code>Arrays.sort(copy)</code> to sort an array in place." } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn selection_sort(numbers: &[i32]) -> Vec<i32> {"], [1, "    let mut result = numbers.to_vec();"], [2, "    for i in 0..result.len() {"], [3, "        let mut smallest = i;"], [3, "        for j in i + 1..result.len() {"], [3, "            if result[j] < result[smallest] { smallest = j; }"], [3, "        }"], [4, "        result.swap(i, smallest);"], [0, "    }"], [5, "    result"], [0, "}"]], note: "<code>swap(i, smallest)</code> is the three-step swap (A2) built into slices." },
        idiomatic: { lines: [[0, "fn selection_sort(numbers: &[i32]) -> Vec<i32> {"], [1, "    let mut result = numbers.to_vec();"], [[2, 3, 4], "    result.sort();"], [5, "    result"], [0, "}"]] } },
      c: { file: "plans.c",
        plain: { lines: [[0, "size_t selection_sort(const int numbers[], size_t n, int out[]) {"], [1, "    for (size_t k = 0; k < n; k++) out[k] = numbers[k];"], [2, "    for (size_t i = 0; i < n; i++) {"], [3, "        size_t smallest = i;"], [3, "        for (size_t j = i + 1; j < n; j++) {"], [3, "            if (out[j] < out[smallest]) smallest = j;"], [3, "        }"], [4, "        int temp = out[i];"], [4, "        out[i] = out[smallest];"], [4, "        out[smallest] = temp;"], [0, "    }"], [5, "    return n;"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <stdlib.h>"], [0, ""], [0, "static int compare_ints(const void *a, const void *b) {"], [0, "    int x = *(const int *) a, y = *(const int *) b;"], [0, "    return (x > y) - (x < y);"], [0, "}"], [0, ""], [0, "size_t selection_sort(const int numbers[], size_t n, int out[]) {"], [1, "    for (size_t k = 0; k < n; k++) out[k] = numbers[k];"], [[2, 3, 4], "    qsort(out, n, sizeof(int), compare_ints);"], [5, "    return n;"], [0, "}"]], note: "The standard library's <code>qsort</code> needs a comparison function, like <code>bsearch</code>." } },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "std::vector<int> selection_sort(const std::vector<int>& numbers) {"], [1, "    std::vector<int> result = numbers;"], [2, "    for (size_t i = 0; i < result.size(); i++) {"], [3, "        size_t smallest = i;"], [3, "        for (size_t j = i + 1; j < result.size(); j++) {"], [3, "            if (result[j] < result[smallest]) smallest = j;"], [3, "        }"], [4, "        int temp = result[i];"], [4, "        result[i] = result[smallest];"], [4, "        result[smallest] = temp;"], [0, "    }"], [5, "    return result;"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <algorithm>"], [0, "#include <vector>"], [0, ""], [0, "std::vector<int> selection_sort(const std::vector<int>& numbers) {"], [1, "    std::vector<int> result = numbers;"], [[2, 3, 4], "    std::ranges::sort(result);"], [5, "    return result;"], [0, "}"]] } }
    },

    trace: {
      type: "tiles",
      speed: 650,
      intro: "Running example: <b>Sort a list from smallest to largest.</b> Green tiles are already in their final place.",
      input: { kind: "list", max: 7, placeholder: "numbers: 7, 2, 9, 1" },
      presets: [{ label: "Four numbers", input: [7, 2, 9, 1] }, { label: "With a repeat", input: [4, 4, 1] }, { label: "Already sorted", input: [1, 2, 3] }],
      run(raw) {
        const a = raw.slice(), n = a.length, ev = [];
        let sortedUpTo = 0, smallest = -1;
        const snap = (step, msg, ptr = -1, tone = "", j = -1) => ev.push({ step, msg, tone,
          view: { values: a.slice(), ptr, states: a.map((_, k) => (k < sortedUpTo ? "added" : k === smallest ? "best" : k === j ? "current" : "")), badges: a.map((_, k) => (k === smallest ? "min" : "")) },
          vars: [{ k: "i", role: "stepper", v: sortedUpTo < n ? sortedUpTo : "—" }, { k: "smallest", role: "best", v: smallest >= 0 ? `[${smallest}] = ${a[smallest]}` : "—" }] });
        snap(null, n ? `Ready. Sort ${n} numbers.` : "Ready. Nothing to sort.");
        snap(1, "Work on a copy of the list.");
        for (let i = 0; i < n; i++) {
          sortedUpTo = i; smallest = i;
          snap(2, `Position ${i}: everything to the left is sorted. Find the smallest from here on.`, i);
          for (let j = i + 1; j < n; j++) {
            if (a[j] < a[smallest]) { smallest = j; snap(3, `${a[j]} at [${j}] is smaller: it's the smallest so far.`, j, "", j); }
            else snap(3, `${a[j]} at [${j}] isn't smaller than ${a[smallest]}.`, j, "", j);
          }
          if (smallest !== i) { const t = a[i]; a[i] = a[smallest]; a[smallest] = t; snap(4, `Swap ${a[i]} into position ${i}.`, i); }
          else snap(4, `The smallest is already at position ${i}: nothing to swap.`, i);
          smallest = -1;
        }
        sortedUpTo = n;
        snap(5, `Return [${a.join(", ")}].`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"], returns: "int[]",
      cases: [{ args: [[3, 1, 2]], expect: [1, 2, 3] }, { args: [[]], expect: [] }, { args: [[5]], expect: [5] }, { args: [[4, 4, 1]], expect: [1, 4, 4] }, { args: [[9, 8, 7, 6]], expect: [6, 7, 8, 9] }],
      snippets: { bugInnerFromZero: [{ args: [[3, 1, 2]], expect: [3, 2, 1] }], bugNoTemp: [{ args: [[3, 1, 2]], expect: [1, 1, 2] }] }
    },

    pitfalls: [
      { kind: "dont", title: "Searching the sorted part again", wide: true, code: "bugInnerFromZero", text: "If the inner loop starts at 0, it finds the smallest of the <em>whole</em> list every time and keeps swapping it around, scrambling the sorted part.", take: "Search only from i to the end: the part that isn't sorted yet." },
      { kind: "dont", title: "Swapping without a temp", text: "<code>result[i] = result[smallest]; result[smallest] = result[i]</code> copies one value over the other, so a number disappears and another is duplicated.", take: "Swap with a temporary variable (A2), or the language's swap." },
      { kind: "dont", title: "Using it for big lists", text: "Selection sort always does about n² / 2 comparisons: half a billion for 32 000 items.", take: "In real programs, call the library sort; learn this one to understand how sorting works." },
      { kind: "do", title: "Watch the sorted part grow", text: "After step i, positions 0 to i hold the i + 1 smallest values, in order. Checking that is a good way to debug." },
      { kind: "do", title: "Sort the other way with one change", text: "Look for the largest instead of the smallest, and the list comes out from largest to smallest (see the exercise)." }
    ],

    snippets: {
      bugInnerFromZero: {
        python: ["def selection_sort(numbers):", "    result = list(numbers)", "    for i in range(len(result)):", "        smallest = i", "        for j in range(len(result)):       # ✗ searches the sorted part too", "            if result[j] < result[smallest]:", "                smallest = j", "        result[i], result[smallest] = result[smallest], result[i]", "    return result"],
        java: ["static List<Integer> selectionSort(int[] numbers) {", "    int[] result = numbers.clone();", "    for (int i = 0; i < result.length; i++) {", "        int smallest = i;", "        for (int j = 0; j < result.length; j++) {   // ✗ searches the sorted part too", "            if (result[j] < result[smallest]) smallest = j;", "        }", "        int temp = result[i]; result[i] = result[smallest]; result[smallest] = temp;", "    }", "    return Arrays.stream(result).boxed().toList();", "}"],
        rust: ["fn selection_sort(numbers: &[i32]) -> Vec<i32> {", "    let mut result = numbers.to_vec();", "    for i in 0..result.len() {", "        let mut smallest = i;", "        for j in 0..result.len() {   // ✗ searches the sorted part too", "            if result[j] < result[smallest] { smallest = j; }", "        }", "        result.swap(i, smallest);", "    }", "    result", "}"],
        c: ["size_t selection_sort(const int numbers[], size_t n, int out[]) {", "    for (size_t k = 0; k < n; k++) out[k] = numbers[k];", "    for (size_t i = 0; i < n; i++) {", "        size_t smallest = i;", "        for (size_t j = 0; j < n; j++) {   // ✗ searches the sorted part too", "            if (out[j] < out[smallest]) smallest = j;", "        }", "        int temp = out[i]; out[i] = out[smallest]; out[smallest] = temp;", "    }", "    return n;", "}"],
        cpp: ["std::vector<int> selection_sort(const std::vector<int>& numbers) {", "    std::vector<int> result = numbers;", "    for (size_t i = 0; i < result.size(); i++) {", "        size_t smallest = i;", "        for (size_t j = 0; j < result.size(); j++) {   // ✗ searches the sorted part too", "            if (result[j] < result[smallest]) smallest = j;", "        }", "        std::swap(result[i], result[smallest]);", "    }", "    return result;", "}"]
      },
      bugNoTemp: {
        python: ["def selection_sort(numbers):", "    result = list(numbers)", "    for i in range(len(result)):", "        smallest = i", "        for j in range(i + 1, len(result)):", "            if result[j] < result[smallest]:", "                smallest = j", "        result[i] = result[smallest]", "        result[smallest] = result[i]", "    return result"],
        java: ["static List<Integer> selectionSort(int[] numbers) {", "    int[] result = numbers.clone();", "    for (int i = 0; i < result.length; i++) {", "        int smallest = i;", "        for (int j = i + 1; j < result.length; j++) {", "            if (result[j] < result[smallest]) smallest = j;", "        }", "        result[i] = result[smallest];", "        result[smallest] = result[i];", "    }", "    return Arrays.stream(result).boxed().toList();", "}"],
        rust: ["fn selection_sort(numbers: &[i32]) -> Vec<i32> {", "    let mut result = numbers.to_vec();", "    for i in 0..result.len() {", "        let mut smallest = i;", "        for j in i + 1..result.len() {", "            if result[j] < result[smallest] { smallest = j; }", "        }", "        result[i] = result[smallest];", "        result[smallest] = result[i];", "    }", "    result", "}"],
        c: ["size_t selection_sort(const int numbers[], size_t n, int out[]) {", "    for (size_t k = 0; k < n; k++) out[k] = numbers[k];", "    for (size_t i = 0; i < n; i++) {", "        size_t smallest = i;", "        for (size_t j = i + 1; j < n; j++) {", "            if (out[j] < out[smallest]) smallest = j;", "        }", "        out[i] = out[smallest];", "        out[smallest] = out[i];", "    }", "    return n;", "}"],
        cpp: ["std::vector<int> selection_sort(const std::vector<int>& numbers) {", "    std::vector<int> result = numbers;", "    for (size_t i = 0; i < result.size(); i++) {", "        size_t smallest = i;", "        for (size_t j = i + 1; j < result.size(); j++) {", "            if (result[j] < result[smallest]) smallest = j;", "        }", "        result[i] = result[smallest];", "        result[smallest] = result[i];", "    }", "    return result;", "}"]
      }
    },

    quiz: [
      { q: "Sorting [5, 2, 8, 1], what does the list look like after the first swap?", options: ["[1, 2, 8, 5]", "[2, 5, 8, 1]", "[1, 5, 2, 8]"], answer: 0, explain: "The smallest item, 1 at position 3, is swapped with position 0: [1, 2, 8, 5]." },
      { q: "This version has a bug. What does it return for [3, 1, 2]?", code: "bugNoTemp", options: ["[1, 2, 3]", "[1, 1, 2]", "[3, 1, 2]"], answer: 1, explain: "The “swap” copies 1 over the 3, then copies that 1 back. The 3 is lost and the 1 appears twice." },
      { q: "How many comparisons does selection sort make for 4 items?", options: ["4", "6", "16"], answer: 1, explain: "3 + 2 + 1 = 6, whatever order the items start in." }
    ],

    exercise: {
      title: "Your turn: largest first",
      task: "Write <code>sort_descending(numbers)</code> that returns a copy sorted from largest to smallest, using the selection sort plan.",
      plan: ["Work on a copy", "For each position i from the left", "Find the position of the largest item from i to the end", "Swap it into position i", "Return the copy"],
      fn: { python: "sort_descending", java: "sortDescending", rust: "sort_descending", c: "sort_descending", cpp: "sort_descending" },
      params: ["int[]"], returns: "int[]",
      tests: [{ args: [[3, 1, 2]], expect: [3, 2, 1] }, { args: [[]], expect: [] }, { args: [[1, 5, 5]], expect: [5, 5, 1] }],
      solutions: {
        python: ["def sort_descending(numbers):", "    result = list(numbers)", "    for i in range(len(result)):", "        largest = i", "        for j in range(i + 1, len(result)):", "            if result[j] > result[largest]:", "                largest = j", "        result[i], result[largest] = result[largest], result[i]", "    return result"],
        java: ["static List<Integer> sortDescending(int[] numbers) {", "    int[] result = numbers.clone();", "    for (int i = 0; i < result.length; i++) {", "        int largest = i;", "        for (int j = i + 1; j < result.length; j++) {", "            if (result[j] > result[largest]) largest = j;", "        }", "        int temp = result[i]; result[i] = result[largest]; result[largest] = temp;", "    }", "    return Arrays.stream(result).boxed().toList();", "}"],
        rust: ["fn sort_descending(numbers: &[i32]) -> Vec<i32> {", "    let mut result = numbers.to_vec();", "    for i in 0..result.len() {", "        let mut largest = i;", "        for j in i + 1..result.len() {", "            if result[j] > result[largest] { largest = j; }", "        }", "        result.swap(i, largest);", "    }", "    result", "}"],
        c: ["size_t sort_descending(const int numbers[], size_t n, int out[]) {", "    for (size_t k = 0; k < n; k++) out[k] = numbers[k];", "    for (size_t i = 0; i < n; i++) {", "        size_t largest = i;", "        for (size_t j = i + 1; j < n; j++) {", "            if (out[j] > out[largest]) largest = j;", "        }", "        int temp = out[i]; out[i] = out[largest]; out[largest] = temp;", "    }", "    return n;", "}"],
        cpp: ["#include <utility>", "#include <vector>", "", "std::vector<int> sort_descending(const std::vector<int>& numbers) {", "    std::vector<int> result = numbers;", "    for (size_t i = 0; i < result.size(); i++) {", "        size_t largest = i;", "        for (size_t j = i + 1; j < result.size(); j++) {", "            if (result[j] > result[largest]) largest = j;", "        }", "        std::swap(result[i], result[largest]);", "    }", "    return result;", "}"]
      }
    },

    compare: {
      intro: "Selection sort is built from two smaller plans.",
      rows: [
        { id: "F3", name: "Selection sort", question: "Put the list in order", shape: "for each i: find the smallest from i on (D5), swap it in (A2)", result: "a sorted list", self: true },
        { id: "D5", name: "Position of the largest", question: "Where is the biggest?", shape: "one pass, remembering the best position", result: "one position" },
        { id: "A2", name: "Swap two values", question: "Exchange two values", shape: "temp = a; a = b; b = temp", result: "two values exchanged" }
      ],
      table: { head: ["Plan", "Loops", "Comparisons for n items", "Use in practice"], rows: [["Selection sort", "2, nested", "n(n − 1)/2", "learning; tiny lists"], ["Position of the largest", "1", "n − 1", "everywhere"], ["Swap two values", "0", "0", "everywhere"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "D5", why: "find the position of the smallest remaining item" }, { id: "A2", why: "swap it into place" }],
      leadsTo: [{ id: "F2", why: "sorted data can be searched by halving" }]
    }
  };
})();
