/* Plan data: F1 · Two pointers
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  const show = (ch) => (ch === " " ? "␣" : ch);

  window.PLAN = {
    id: "F1",
    slug: "two-pointers",
    title: "Two pointers",
    highlight: "pointers",
    aka: ["left and right index", "meet in the middle", "from both ends"],
    group: "F",
    level: "Advanced",
    core: false,
    fn: { python: "is_palindrome", java: "isPalindrome", rust: "is_palindrome", c: "is_palindrome", cpp: "is_palindrome" },

    hero: { type: "tiles", values: ["r", "a", "c", "a", "r"], colors: ["amber", "pale", "blue", "pale", "amber"], tagAt: 4, tag: "left ↔ right", alt: "The letters of racecar; the two ends are amber, compared from the outside in" },
    planCard: { name: "two pointers", lines: ["left = start, right = end", "while left < right: compare", "move both inward"], foot: "→ they meet in the middle" },

    intent: "Walk a sequence from both ends at once: one position starts at the left, one at the right, and they move towards each other until they meet.",

    analogy: { icon: "📏", title: "Checking a row of bunting", text: "To check that a string of flags is symmetrical, two people start at opposite ends, compare the flags in their hands, and each step one flag towards the middle. As soon as two flags differ, it isn't symmetrical; if they meet in the middle, it is." },

    cues: ["palindrome", "reads the same backwards", "reverse in place", "from both ends", "pairs from the outside in"],
    cueSummary: "The problem pairs <b>the first item with the last</b>, the second with the second-to-last, and so on.",
    cueExamples: ["Is “racecar” a palindrome?", "Reverse a list without making a copy.", "In a sorted list, find two numbers that add up to a target."],

    steps: [
      { n: 1, title: "Start one pointer at each end", text: "left = 0, right = the last position." },
      { n: 2, title: "While the pointers haven't met", text: "left < right. In the middle of an odd-length text, one character is left over, and it can't mismatch anything." },
      { n: 3, title: "Compare the items at both pointers", text: "Here: the character at left and the character at right." },
      { n: 4, title: "Different? Answer no and stop", text: "One mismatched pair is enough." },
      { n: 5, title: "Same? Move both pointers inward", text: "left goes one to the right, right one to the left." },
      { n: 6, title: "The pointers met: answer yes", text: "Every pair matched." }
    ],

    impl: {
      python: { file: "palindrome.py",
        plain: { lines: [[0, "def is_palindrome(text):"], [1, "    left = 0"], [1, "    right = len(text) - 1"], [2, "    while left < right:"], [3, "        if text[left] != text[right]:"], [4, "            return False"], [5, "        left += 1"], [5, "        right -= 1"], [6, "    return True"]] },
        idiomatic: { lines: [[0, "def is_palindrome(text):"], [[1, 2, 3, 4, 5, 6], "    return text == text[::-1]"]], note: "<code>text[::-1]</code> is the text reversed. Simple, but it builds a whole copy and compares everything." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static boolean isPalindrome(String text) {"], [1, "    int left = 0;"], [1, "    int right = text.length() - 1;"], [2, "    while (left < right) {"], [3, "        if (text.charAt(left) != text.charAt(right)) {"], [4, "            return false;"], [0, "        }"], [5, "        left++;"], [5, "        right--;"], [0, "    }"], [6, "    return true;"], [0, "}"]] },
        idiomatic: { lines: [[0, "static boolean isPalindrome(String text) {"], [[1, 2, 3, 4, 5, 6], "    return new StringBuilder(text).reverse().toString().equals(text);"], [0, "}"]] } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn is_palindrome(text: &str) -> bool {"], [0, "    let b = text.as_bytes();"], [1, "    let mut left = 0;"], [1, "    let mut right = b.len();   // one past the last byte"], [2, "    while left + 1 < right {"], [3, "        if b[left] != b[right - 1] {"], [4, "            return false;"], [0, "        }"], [5, "        left += 1;"], [5, "        right -= 1;"], [0, "    }"], [6, "    true"], [0, "}"]], note: "Rust indexes are <code>usize</code>, which can't go below 0, so <code>right</code> points one past the last byte and the code compares <code>b[right - 1]</code>. This version assumes plain ASCII text." },
        idiomatic: { lines: [[0, "fn is_palindrome(text: &str) -> bool {"], [[1, 2, 3, 4, 5, 6], "    text.chars().eq(text.chars().rev())"], [0, "}"]], note: "Compares the characters forwards and backwards, and works for any Unicode text." } },
      c: { file: "plans.c",
        plain: { lines: [[0, "#include <string.h>"], [0, ""], [0, "bool is_palindrome(const char *text) {"], [1, "    int left = 0;"], [1, "    int right = (int) strlen(text) - 1;"], [2, "    while (left < right) {"], [3, "        if (text[left] != text[right]) {"], [4, "            return false;"], [0, "        }"], [5, "        left++;"], [5, "        right--;"], [0, "    }"], [6, "    return true;"], [0, "}"]], note: "<code>int</code> rather than <code>size_t</code>, so <code>right</code> can be -1 for empty text without wrapping around." },
        idiomatic: null, idiomaticNote: "The two-index loop is the idiomatic C." },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <string>"], [0, ""], [0, "bool is_palindrome(const std::string& text) {"], [1, "    int left = 0;"], [1, "    int right = static_cast<int>(text.size()) - 1;"], [2, "    while (left < right) {"], [3, "        if (text[left] != text[right]) {"], [4, "            return false;"], [0, "        }"], [5, "        left++;"], [5, "        right--;"], [0, "    }"], [6, "    return true;"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <algorithm>"], [0, "#include <string>"], [0, ""], [0, "bool is_palindrome(const std::string& text) {"], [[1, 2, 3, 4, 5, 6], "    return std::equal(text.begin(), text.begin() + text.size() / 2, text.rbegin());"], [0, "}"]], note: "<code>rbegin()</code> walks backwards from the end; comparing half the text is enough." } }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Is the text a palindrome</b> (does it read the same backwards)?",
      input: { kind: "fields", fields: [{ name: "text", label: "text", type: "text", max: 12 }] },
      presets: [{ label: "\"racecar\"", input: { text: "racecar" } }, { label: "\"abba\"", input: { text: "abba" } }, { label: "\"abca\"", input: { text: "abca" } }],
      run({ text }) {
        const ch = [...text], ev = [], states = ch.map(() => "");
        let left = 0, right = ch.length - 1;
        const snap = (step, msg, tone = "") => ev.push({ step, msg, tone,
          view: { values: ch.map(show), states: states.slice(), ptr: left < right ? [left, right] : [], badges: ch.map((_, i) => (i === left && left < right ? "left" : i === right && left < right ? "right" : "")), emptyNote: "\"\"  (empty text)" },
          vars: [{ k: "left", role: "stepper", v: left }, { k: "right", role: "stepper", v: right }] });
        snap(null, `Ready. Is "${text}" a palindrome?`);
        snap(1, `left = 0, right = ${right}.`);
        while (left < right) {
          snap(2, `left (${left}) < right (${right}): the pointers haven't met.`);
          if (ch[left] !== ch[right]) {
            states[left] = states[right] = "hit";
            snap(3, `'${ch[left]}' and '${ch[right]}' are different.`);
            snap(4, "Answer False and stop.", "no");
            return ev;
          }
          states[left] = states[right] = "added";
          snap(3, `'${ch[left]}' and '${ch[right]}' match.`);
          left++; right--;
          snap(5, `Move both inward: left = ${left}, right = ${right}.`);
        }
        snap(2, ch.length > 1 ? `left (${left}) is no longer < right (${right}): the pointers have met.` : "There are no pairs to compare.");
        snap(6, "Every pair matched. Answer True.", "yes");
        return ev;
      }
    },

    checks: {
      params: ["string"], returns: "bool",
      cases: [{ args: ["racecar"], expect: true }, { args: ["abba"], expect: true }, { args: ["abca"], expect: false }, { args: [""], expect: true }, { args: ["a"], expect: true }, { args: ["ab"], expect: false }],
      snippets: { bugEarlyYes: [{ args: ["abca"], expect: true }], bugOneSide: [{ args: ["abba"], expect: false }] }
    },

    pitfalls: [
      { kind: "dont", title: "Saying yes after one matching pair", wide: true, code: "bugEarlyYes", text: "Returning true as soon as the outer pair matches ignores everything inside: “abca” starts and ends with a, but isn't a palindrome.", take: "Only answer yes after the pointers meet." },
      { kind: "dont", title: "Moving only one pointer", text: "If only <code>left</code> moves, the second character is compared with the last one again, so “abba” looks wrong.", take: "Both pointers move inward together." },
      { kind: "dont", title: "Starting right at the length", text: "The last position is length − 1. <code>right = len(text)</code> reads one past the end.", take: "right = length − 1 (or keep it one past and compare right − 1, as in the Rust version)." },
      { kind: "do", title: "Use the same shape to reverse", text: "Swapping the items at left and right, then moving inward, reverses a list in place (see the exercise)." },
      { kind: "do", title: "Use it on sorted data", text: "In a sorted list, two pointers find a pair with a given sum in one pass: move left up if the sum is too small, right down if it's too big." }
    ],

    snippets: {
      bugEarlyYes: {
        python: ["def is_palindrome(text):", "    left = 0", "    right = len(text) - 1", "    while left < right:", "        if text[left] != text[right]:", "            return False", "        return True          # ✗ after one matching pair", "    return True"],
        java: ["static boolean isPalindrome(String text) {", "    int left = 0;", "    int right = text.length() - 1;", "    while (left < right) {", "        if (text.charAt(left) != text.charAt(right)) return false;", "        return true;         // ✗ after one matching pair", "    }", "    return true;", "}"],
        rust: ["fn is_palindrome(text: &str) -> bool {", "    let b = text.as_bytes();", "    let mut left = 0;", "    let mut right = b.len();", "    while left + 1 < right {", "        if b[left] != b[right - 1] { return false; }", "        return true;         // ✗ after one matching pair", "    }", "    true", "}"],
        c: ["bool is_palindrome(const char *text) {", "    int left = 0;", "    int right = (int) strlen(text) - 1;", "    while (left < right) {", "        if (text[left] != text[right]) return false;", "        return true;         // ✗ after one matching pair", "    }", "    return true;", "}"],
        cpp: ["bool is_palindrome(const std::string& text) {", "    int left = 0;", "    int right = static_cast<int>(text.size()) - 1;", "    while (left < right) {", "        if (text[left] != text[right]) return false;", "        return true;         // ✗ after one matching pair", "    }", "    return true;", "}"]
      },
      bugOneSide: {
        python: ["def is_palindrome(text):", "    left = 0", "    right = len(text) - 1", "    while left < right:", "        if text[left] != text[right]:", "            return False", "        left += 1", "    return True"],
        java: ["static boolean isPalindrome(String text) {", "    int left = 0;", "    int right = text.length() - 1;", "    while (left < right) {", "        if (text.charAt(left) != text.charAt(right)) return false;", "        left++;", "    }", "    return true;", "}"],
        rust: ["fn is_palindrome(text: &str) -> bool {", "    let b = text.as_bytes();", "    let mut left = 0;", "    let right = b.len();", "    while left + 1 < right {", "        if b[left] != b[right - 1] { return false; }", "        left += 1;", "    }", "    true", "}"],
        c: ["bool is_palindrome(const char *text) {", "    int left = 0;", "    int right = (int) strlen(text) - 1;", "    while (left < right) {", "        if (text[left] != text[right]) return false;", "        left++;", "    }", "    return true;", "}"],
        cpp: ["bool is_palindrome(const std::string& text) {", "    int left = 0;", "    int right = static_cast<int>(text.size()) - 1;", "    while (left < right) {", "        if (text[left] != text[right]) return false;", "        left++;", "    }", "    return true;", "}"]
      }
    },

    quiz: [
      { q: "How many pairs does {fn}(\"racecar\") compare before answering?", options: ["3", "4", "7"], answer: 0, explain: "r–r, a–a, c–c. Then both pointers reach the middle 'e' and stop. Three comparisons for seven letters." },
      { q: "This version has a bug. What does it return for \"abba\"?", code: "bugOneSide", options: ["True", "False"], answer: 1, explain: "Only left moves, so the second comparison is 'b' against the last 'a'. They differ, and it wrongly says no." },
      { q: "Why does the loop test left < right rather than left <= right?", options: ["When they meet on one character, there's nothing to compare it with", "To avoid an infinite loop", "Because strings start at 1"], answer: 0, explain: "A single middle character always matches itself, so the loop can stop when the pointers meet." }
    ],

    exercise: {
      title: "Your turn: reverse a list",
      task: "Write <code>reversed_list(numbers)</code> that returns a copy of the list reversed, by swapping items from both ends of the copy towards the middle.",
      plan: ["Copy the list; left = 0, right = last position", "While left < right", "Swap the items at left and right", "Move both pointers inward", "Return the copy"],
      fn: { python: "reversed_list", java: "reversedList", rust: "reversed_list", c: "reversed_list", cpp: "reversed_list" },
      params: ["int[]"], returns: "int[]",
      tests: [{ args: [[1, 2, 3]], expect: [3, 2, 1] }, { args: [[]], expect: [] }, { args: [[5]], expect: [5] }, { args: [[1, 2]], expect: [2, 1] }],
      solutions: {
        python: ["def reversed_list(numbers):", "    result = list(numbers)", "    left = 0", "    right = len(result) - 1", "    while left < right:", "        result[left], result[right] = result[right], result[left]", "        left += 1", "        right -= 1", "    return result"],
        java: ["static List<Integer> reversedList(int[] numbers) {", "    int[] result = numbers.clone();", "    int left = 0;", "    int right = result.length - 1;", "    while (left < right) {", "        int temp = result[left];", "        result[left] = result[right];", "        result[right] = temp;", "        left++;", "        right--;", "    }", "    return Arrays.stream(result).boxed().toList();", "}"],
        rust: ["fn reversed_list(numbers: &[i32]) -> Vec<i32> {", "    let mut result = numbers.to_vec();", "    let mut left = 0;", "    let mut right = result.len();", "    while left + 1 < right {", "        result.swap(left, right - 1);", "        left += 1;", "        right -= 1;", "    }", "    result", "}"],
        c: ["size_t reversed_list(const int numbers[], size_t n, int out[]) {", "    for (size_t i = 0; i < n; i++) out[i] = numbers[i];", "    int left = 0;", "    int right = (int) n - 1;", "    while (left < right) {", "        int temp = out[left];", "        out[left] = out[right];", "        out[right] = temp;", "        left++;", "        right--;", "    }", "    return n;", "}"],
        cpp: ["#include <utility>", "#include <vector>", "", "std::vector<int> reversed_list(const std::vector<int>& numbers) {", "    std::vector<int> result = numbers;", "    int left = 0;", "    int right = static_cast<int>(result.size()) - 1;", "    while (left < right) {", "        std::swap(result[left], result[right]);", "        left++;", "        right--;", "    }", "    return result;", "}"]
      }
    },

    compare: {
      intro: "Plans that move positions through a sequence in different ways.",
      rows: [
        { id: "F1", name: "Two pointers", question: "Is it a palindrome?", shape: "left from the start, right from the end, meeting in the middle", result: "about n/2 steps", self: true },
        { id: "F2", name: "Binary search", question: "Where is 7 in a sorted list?", shape: "low and high close in on the middle each step", result: "about log₂ n steps" },
        { id: "D6", name: "Find the first", question: "Where is the first negative?", shape: "one position from left to right", result: "up to n steps" }
      ],
      table: { head: ["Plan", "Positions", "Move by", "Needs sorted data?"], rows: [["Two pointers", "2, from both ends", "one step inward each", "only for pair-sum problems"], ["Binary search", "low, high, mid", "halving the range", "yes"], ["Find the first", "1", "one step right", "no"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "A2", why: "swapping the two ends when reversing" }, { id: "D8", why: "stop with no at the first mismatch" }],
      leadsTo: [{ id: "F2", why: "two positions that close in by halving" }]
    }
  };
})();
