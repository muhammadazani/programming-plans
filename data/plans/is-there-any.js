/* Plan data: D7 · Is there any?
   Every code line is [steps, text]. `steps` is a step number (1–4), an array of
   step numbers, or 0 when the line belongs to no step. The renderer uses these
   tags for the step callouts and to sync the animated trace with whatever
   language is selected, so a new language only needs new data, never new code. */

window.PLAN = {
  id: "D7",
  slug: "is-there-any",
  title: "Is there any?",
  highlight: "any?",
  aka: ["Existence check", "any()", "short-circuit search"],
  group: "D",
  level: "Foundations",
  core: true,
  fn: { python: "has_negative", java: "hasNegative", rust: "has_negative", c: "has_negative", cpp: "has_negative" },

  hero: {
    type: "tiles",
    values: [4, 7, -2, 9, 5],
    highlight: 2,
    tag: "-2 < 0 ✓",
    alt: "A row of five cubes; the third, -2, is highlighted as the first match and the last two are greyed out as never checked"
  },
  planCard: { name: "any?", lines: ["visit each item", "test it", "match → yes, stop"], foot: "↻ else keep looking" },

  intent:
    "Walk through a collection and answer yes the moment one item meets the condition. Answer no only after every item has failed.",

  analogy: {
    icon: "🥚",
    title: "Looking for a cracked egg",
    text:
      "You check the eggs in a carton one by one. As soon as you spot a cracked one, you know the answer: yes, there is a cracked egg, and you don't need to look at the rest. You can only say “no cracked eggs” after you have checked every single one."
  },

  example: {
    problem: "Does a list of bank transactions contain any negative amount?",
    condition: "x < 0",
    conditionText: "is it negative?"
  },

  cues: ["is there any …", "does it contain …", "at least one …", "has any …", "any of …", "… exists?"],
  cueSummary: "The answer is a single <b>yes or no</b>, and one matching item is enough to say yes.",
  cueExamples: [
    "Does the password contain at least one digit?",
    "Is any score in the class below 50?",
    "Has any sensor reported a temperature above 90°?"
  ],

  steps: [
    { n: 1, title: "Visit each item", text: "Go through the collection from the first item to the last." },
    { n: 2, title: "Test it", text: "Check the item against the condition. Here: is it negative?" },
    { n: 3, title: "Match? Answer yes and stop", text: "One match is enough. Return true right away, because the remaining items can't change the answer." },
    { n: 4, title: "No match at all? Answer no", text: "Only after the loop has finished, with every item tested and failed, return False." }
  ],

  impl: {
    python: {
      file: "has_negative.py",
      plain: {
        lines: [
          [0, "def has_negative(numbers):"],
          [1, "    for x in numbers:"],
          [2, "        if x < 0:"],
          [3, "            return True"],
          [4, "    return False"]
        ]
      },
      idiomatic: {
        lines: [
          [0, "def has_negative(numbers):"],
          [[1, 2, 3, 4], "    return any(x < 0 for x in numbers)"]
        ],
        note: "<code>any()</code> runs steps 1–4 for you, and it also stops at the first match."
      }
    },
    java: {
      file: "Plans.java",
      plain: {
        lines: [
          [0, "static boolean hasNegative(int[] numbers) {"],
          [1, "    for (int x : numbers) {"],
          [2, "        if (x < 0) {"],
          [3, "            return true;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    return false;"],
          [0, "}"]
        ]
      },
      idiomatic: {
        lines: [
          [0, "static boolean hasNegative(int[] numbers) {"],
          [[1, 2, 3, 4], "    return Arrays.stream(numbers).anyMatch(x -> x < 0);"],
          [0, "}"]
        ],
        note: "<code>anyMatch</code> (needs <code>import java.util.Arrays;</code>) short-circuits too: it stops at the first match."
      }
    },
    rust: {
      file: "plans.rs",
      plain: {
        lines: [
          [0, "fn has_negative(numbers: &[i32]) -> bool {"],
          [1, "    for &x in numbers {"],
          [2, "        if x < 0 {"],
          [3, "            return true;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    false"],
          [0, "}"]
        ],
        note: "In Rust the last expression is the return value, so <code>false</code> with no semicolon means “return false”."
      },
      idiomatic: {
        lines: [
          [0, "fn has_negative(numbers: &[i32]) -> bool {"],
          [[1, 2, 3, 4], "    numbers.iter().any(|&x| x < 0)"],
          [0, "}"]
        ],
        note: "<code>Iterator::any</code> stops at the first item for which the closure returns <code>true</code>."
      }
    },
    c: {
      file: "plans.c",
      plain: {
        lines: [
          [0, "#include <stdbool.h>"],
          [0, "#include <stddef.h>"],
          [0, ""],
          [0, "bool has_negative(const int numbers[], size_t n) {"],
          [1, "    for (size_t i = 0; i < n; i++) {"],
          [2, "        if (numbers[i] < 0) {"],
          [3, "            return true;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    return false;"],
          [0, "}"]
        ],
        note: "C arrays don't know their own length, so the caller passes <code>n</code>."
      },
      idiomatic: null,
      idiomaticNote: "C has no built-in <code>any</code>. The plain loop <em>is</em> the idiomatic way, which is why it's worth knowing by heart."
    },
    cpp: {
      file: "plans.cpp",
      plain: {
        lines: [
          [0, "#include <vector>"],
          [0, ""],
          [0, "bool has_negative(const std::vector<int>& numbers) {"],
          [1, "    for (int x : numbers) {"],
          [2, "        if (x < 0) {"],
          [3, "            return true;"],
          [0, "        }"],
          [0, "    }"],
          [4, "    return false;"],
          [0, "}"]
        ],
        note: "Unlike a C array, a <code>std::vector</code> knows its own length, so the range-based <code>for</code> needs no index."
      },
      idiomatic: {
        lines: [
          [0, "#include <algorithm>"],
          [0, "#include <vector>"],
          [0, ""],
          [0, "bool has_negative(const std::vector<int>& numbers) {"],
          [[1, 2, 3, 4], "    return std::ranges::any_of(numbers, [](int x) { return x < 0; });"],
          [0, "}"]
        ],
        note: "<code>std::ranges::any_of</code> (C++20) stops at the first match. Before C++20, write <code>std::any_of(numbers.begin(), numbers.end(), …)</code>."
      }
    }
  },

  trace: {
    type: "tiles",
    intro: "Running example: <b>Does a list of bank transactions contain any negative amount?</b> The condition for each item is <code>x &lt; 0</code>.",
    input: { kind: "list", max: 10, placeholder: "your list: 5, 2, -7" },
    presets: [
      { label: "Found early", input: [4, 7, -2, 9, 5] },
      { label: "Found last", input: [3, 8, 1, 6, -4] },
      { label: "Not found", input: [3, 8, 1, 6, 4] },
      { label: "Empty list", input: [] }
    ],
    /* Returns one event per step. Each event carries the full picture to draw. */
    run(list) {
      const n = list.length, ev = [];
      const snap = (step, msg, { cur = -1, states = [], answer = "?", checked = 0, tone = "" } = {}) => ev.push({
        step, msg, tone,
        view: { values: list, states, ptr: cur },
        vars: [
          { k: "x", role: "walker", v: cur >= 0 ? list[cur] : "—" },
          { k: "answer", role: "result", v: answer },
          { k: "checked", role: "count", v: checked, of: n }
        ]
      });
      const seen = (i, cls) => list.map((_, j) => (j < i ? "miss" : j === i ? cls : ""));
      snap(null, n ? "Ready. Nothing checked yet, so the answer is still unknown." : "Ready. The list is empty.");
      for (let i = 0; i < n; i++) {
        snap(1, `Visit item [${i}]: x = ${list[i]}`, { cur: i, states: seen(i, "current"), checked: i + 1 });
        const hit = list[i] < 0;
        snap(2, hit ? `Is ${list[i]} < 0? Yes, it matches.` : `Is ${list[i]} < 0? No, keep looking.`,
          { cur: i, states: seen(i, hit ? "hit" : "miss current"), checked: i + 1 });
        if (hit) {
          const left = n - i - 1;
          snap(3, `Found one. Answer True and stop. ${left ? `${left} item${left > 1 ? "s were" : " was"} never checked.` : "It happened to be the last item."}`,
            { cur: i, states: list.map((_, j) => (j < i ? "miss" : j === i ? "hit" : "skipped")), answer: "True", checked: i + 1, tone: "yes" });
          return ev;
        }
      }
      snap(4, n ? `${n === 1 ? "The only item was checked and didn't" : `All ${n} items were checked and none`} match. Answer False.` : "No items, so nothing can match. Answer False.",
        { states: list.map(() => "miss"), answer: "False", checked: n, tone: "no" });
      return ev;
    }
  },

  /* Used by tools/check_snippets.py: every implementation, buggy snippet and
     solution is compiled and run against these cases in all five languages. */
  checks: {
    params: ["int[]"],
    returns: "bool",
    cases: [
      { args: [[4, 7, -2, 9, 5]], expect: true },
      { args: [[3, 8, 1, 6, -4]], expect: true },
      { args: [[3, 8, 1, 6, 4]], expect: false },
      { args: [[]], expect: false }
    ],
    snippets: {
      bugElse: [{ args: [[3, -2]], expect: false }],
      bugOverwrite: [{ args: [[-2, 3]], expect: false }]
    }
  },

  pitfalls: [
    {
      kind: "dont",
      title: "Giving up inside the loop",
      text: "Putting the “no” answer in an <code>else</code> inside the loop makes the function answer after looking at only the first item.",
      code: "bugElse",
      take: "The “no” answer belongs after the loop, once every item has failed.",
      wide: true
    },
    {
      kind: "dont",
      title: "Overwriting the answer",
      text: "Setting <code>found = x &lt; 0</code> on every pass throws away an earlier match. The result only describes the last item.",
      take: "A found-it flag is one-way: it may change from false to true, never back."
    },
    {
      kind: "dont",
      title: "Keeping looking after you've found it",
      text: "Setting a flag and carrying on gives the right answer, but checks every item for nothing. On a million items, that's a million wasted checks.",
      take: "Stop at the first match with return (or break)."
    },
    {
      kind: "do",
      title: "Know the empty-list answer",
      text: "With no items, nothing can match, so the answer is <b>no</b> (false). Its sibling “Are all?” answers <b>yes</b> for an empty list. People mix these up often."
    },
    {
      kind: "do",
      title: "Use the built-in once you understand it",
      text: "Python's <code>any()</code>, Java's <code>anyMatch</code>, Rust's <code>.any()</code> and C++'s <code>std::ranges::any_of</code> are this exact plan. Switch the toolbar to <b>Idiomatic</b> to see them."
    }
  ],

  snippets: {
    bugElse: {
      python: [
        "def has_negative(numbers):",
        "    for x in numbers:",
        "        if x < 0:",
        "            return True",
        "        else:",
        "            return False   # ✗ answers after the first item",
        "    return False"
      ],
      java: [
        "static boolean hasNegative(int[] numbers) {",
        "    for (int x : numbers) {",
        "        if (x < 0) {",
        "            return true;",
        "        } else {",
        "            return false;  // ✗ answers after the first item",
        "        }",
        "    }",
        "    return false;",
        "}"
      ],
      rust: [
        "fn has_negative(numbers: &[i32]) -> bool {",
        "    for &x in numbers {",
        "        if x < 0 {",
        "            return true;",
        "        } else {",
        "            return false; // ✗ answers after the first item",
        "        }",
        "    }",
        "    false",
        "}"
      ],
      c: [
        "bool has_negative(const int numbers[], size_t n) {",
        "    for (size_t i = 0; i < n; i++) {",
        "        if (numbers[i] < 0) {",
        "            return true;",
        "        } else {",
        "            return false;  // ✗ answers after the first item",
        "        }",
        "    }",
        "    return false;",
        "}"
      ],
      cpp: [
        "bool has_negative(const std::vector<int>& numbers) {",
        "    for (int x : numbers) {",
        "        if (x < 0) {",
        "            return true;",
        "        } else {",
        "            return false;  // ✗ answers after the first item",
        "        }",
        "    }",
        "    return false;",
        "}"
      ]
    },
    bugOverwrite: {
      python: [
        "def has_negative(numbers):",
        "    found = False",
        "    for x in numbers:",
        "        found = x < 0",
        "    return found"
      ],
      java: [
        "static boolean hasNegative(int[] numbers) {",
        "    boolean found = false;",
        "    for (int x : numbers) {",
        "        found = x < 0;",
        "    }",
        "    return found;",
        "}"
      ],
      rust: [
        "fn has_negative(numbers: &[i32]) -> bool {",
        "    let mut found = false;",
        "    for &x in numbers {",
        "        found = x < 0;",
        "    }",
        "    found",
        "}"
      ],
      c: [
        "bool has_negative(const int numbers[], size_t n) {",
        "    bool found = false;",
        "    for (size_t i = 0; i < n; i++) {",
        "        found = numbers[i] < 0;",
        "    }",
        "    return found;",
        "}"
      ],
      cpp: [
        "bool has_negative(const std::vector<int>& numbers) {",
        "    bool found = false;",
        "    for (int x : numbers) {",
        "        found = x < 0;",
        "    }",
        "    return found;",
        "}"
      ]
    }
  },

  quiz: [
    {
      q: "Calling {fn} on [5, -1, -8, 3]: how many items does the loop check before it answers?",
      options: ["1", "2", "3", "4"],
      answer: 1,
      explain: "It checks 5 (no), then -1 (yes) and stops. -8 and 3 are never looked at."
    },
    {
      q: "What does {fn} return for an empty list?",
      options: ["True", "False", "An error"],
      answer: 1,
      explain: "The loop body never runs, so the line after the loop answers: False. There isn't any negative number, because there isn't any number at all."
    },
    {
      q: "This version has a bug. What does it return for [-2, 3]?",
      code: "bugOverwrite",
      options: ["True", "False"],
      answer: 1,
      explain: "found becomes true at -2, then 3 overwrites it with false. Each pass replaces the answer, so only the last item counts. This is the “overwriting the answer” pitfall."
    }
  ],

  exercise: {
    title: "Your turn: does the word contain a vowel?",
    task: "Write <code>has_vowel(word)</code> that returns true if the lowercase word contains at least one of <code>a e i o u</code>, and false otherwise. Follow the four steps of the plan.",
    plan: [
      "Visit each character",
      "Test it: is it one of \"aeiou\"?",
      "Match? Return true right away",
      "After the loop: return false"
    ],
    fn: { python: "has_vowel", java: "hasVowel", rust: "has_vowel", c: "has_vowel", cpp: "has_vowel" },
    params: ["string"],
    returns: "bool",
    tests: [
      { args: ["code"], expect: true },
      { args: ["rhythm"], expect: false },
      { args: [""], expect: false },
      { args: ["a"], expect: true },
      { args: ["strengths"], expect: true },
      { args: ["xyz"], expect: false }
    ],
    solutions: {
      python: [
        "def has_vowel(word):",
        "    for ch in word:",
        "        if ch in \"aeiou\":",
        "            return True",
        "    return False"
      ],
      java: [
        "static boolean hasVowel(String word) {",
        "    for (char ch : word.toCharArray()) {",
        "        if (\"aeiou\".indexOf(ch) >= 0) {",
        "            return true;",
        "        }",
        "    }",
        "    return false;",
        "}"
      ],
      rust: [
        "fn has_vowel(word: &str) -> bool {",
        "    for ch in word.chars() {",
        "        if \"aeiou\".contains(ch) {",
        "            return true;",
        "        }",
        "    }",
        "    false",
        "}"
      ],
      c: [
        "#include <stdbool.h>",
        "#include <string.h>",
        "",
        "bool has_vowel(const char *word) {",
        "    for (size_t i = 0; word[i] != '\\0'; i++) {",
        "        if (strchr(\"aeiou\", word[i]) != NULL) {",
        "            return true;",
        "        }",
        "    }",
        "    return false;",
        "}"
      ],
      cpp: [
        "#include <string>",
        "",
        "bool has_vowel(const std::string& word) {",
        "    const std::string vowels = \"aeiou\";",
        "    for (char ch : word) {",
        "        if (vowels.find(ch) != std::string::npos) {",
        "            return true;",
        "        }",
        "    }",
        "    return false;",
        "}"
      ]
    }
  },

  compare: {
    intro: "Three sibling plans on the same list <code>[3, 8, -2, 6, -5]</code>. Amber marks where each one stops; faded items are never checked.",
    data: [3, 8, -2, 6, -5],
    rows: [
      { id: "D6", name: "Find the first", question: "Which is the first negative?", seen: 3, stop: 2, result: "-2 (at 2)" },
      { id: "D7", name: "Is there any?", question: "Is any item negative?", seen: 3, stop: 2, result: "True", self: true },
      { id: "D8", name: "Are all?", question: "Are all items negative?", seen: 1, stop: 0, result: "False" }
    ],
    table: {
      head: ["Plan", "Answers", "Stops early at", "If the loop finishes", "Empty list"],
      rows: [
        ["Find the first", "the item or its position", "the first match", "“not found” (None / -1)", "not found"],
        ["Is there any?", "true / false", "the first match", "false", "false"],
        ["Are all?", "true / false", "the first item that fails", "true", "true"]
      ],
      selfRow: 1
    }
  },

  related: {
    buildsOn: [
      { id: "C1", why: "the loop that visits every item" },
      { id: "B2", why: "the yes/no test inside the loop" }
    ],
    leadsTo: [
      { id: "D6", why: "return the item, not just yes/no" },
      { id: "D8", why: "the mirror image: stop at the first failure" },
      { id: "G1", why: "move the test into its own reusable function" }
    ]
  }
};
