/* Plan data: D11 · Build a string
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   Returns a new string. In C the caller passes an output buffer
   (checks.returns "text" knows this). */

(function () {
  const show = (ch) => (ch === " " ? "␣" : ch);
  const isDigit = (ch) => ch >= "0" && ch <= "9";

  window.PLAN = {
    id: "D11",
    slug: "build-a-string",
    title: "Build a string",
    highlight: "string",
    aka: ["string builder", "accumulate text", "map over characters"],
    group: "D",
    level: "Core",
    core: true,
    fn: { python: "mask_digits", java: "maskDigits", rust: "mask_digits", c: "mask_digits", cpp: "mask_digits" },

    hero: {
      type: "tiles",
      values: ["P", "I", "N", "4", "0"],
      colors: ["pale", "pale", "pale", "amber", "amber"],
      tagAt: 4,
      tag: "\"PIN**\"",
      alt: "Five cubes spelling P, I, N, 4, 0; the digits are amber and the tag shows the result PIN**"
    },
    planCard: { name: "build", lines: ["result = \"\"", "for each character", "add a piece to the end"], foot: "→ return result" },

    intent: "Make a new piece of text by walking the original one character at a time and adding a piece to the end of the result for each.",

    analogy: {
      icon: "🖍️",
      title: "Copying a note with a red pen",
      text: "You copy a note onto a fresh page, letter by letter. Whenever you reach a phone number, you write a star instead of each digit. The original note stays as it was; the new page grows one character at a time."
    },

    cues: ["replace every …", "hide / mask …", "remove all …", "turn … into …", "build / make a new string", "reverse"],
    cueSummary: "The answer is <b>new text</b> made from the old text, one character at a time.",
    cueExamples: [
      "Hide the digits of a card number with *.",
      "Remove all the spaces from a sentence.",
      "Turn \u201chello world\u201d into \u201cHELLO WORLD\u201d."
    ],

    steps: [
      { n: 1, title: "Start with an empty result", text: "Nothing has been written yet." },
      { n: 2, title: "Visit each character", text: "From the first to the last." },
      { n: 3, title: "Decide what to write", text: "A star for a digit; the character itself for anything else." },
      { n: 4, title: "Add it to the end of the result", text: "Adding to the end keeps the characters in their original order." },
      { n: 5, title: "Return the result", text: "The original text is unchanged." }
    ],

    impl: {
      python: {
        file: "mask.py",
        plain: { lines: [
          [0, "def mask_digits(text):"],
          [1, "    result = \"\""],
          [2, "    for ch in text:"],
          [3, "        if ch.isdigit():"],
          [4, "            result += \"*\""],
          [3, "        else:"],
          [4, "            result += ch"],
          [5, "    return result"]
        ], note: "Python strings can't change, so <code>+=</code> makes a new string each time. That's fine for short text; for very long text, collect pieces in a list and <code>\"\".join()</code> them." },
        idiomatic: { lines: [
          [0, "def mask_digits(text):"],
          [[1, 2, 3, 4, 5], "    return \"\".join(\"*\" if ch.isdigit() else ch for ch in text)"]
        ], note: "<code>join</code> glues the pieces together in one go." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static String maskDigits(String text) {"],
          [1, "    StringBuilder result = new StringBuilder();"],
          [2, "    for (char ch : text.toCharArray()) {"],
          [3, "        if (Character.isDigit(ch)) {"],
          [4, "            result.append('*');"],
          [3, "        } else {"],
          [4, "            result.append(ch);"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return result.toString();"],
          [0, "}"]
        ], note: "A <code>StringBuilder</code> grows in place, instead of copying the whole string on every <code>+</code>." },
        idiomatic: { lines: [
          [0, "static String maskDigits(String text) {"],
          [[1, 2, 3, 4, 5], "    return text.replaceAll(\"[0-9]\", \"*\");"],
          [0, "}"]
        ], note: "A regular expression does the walking: <code>[0-9]</code> matches any digit." }
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn mask_digits(text: &str) -> String {"],
          [1, "    let mut result = String::new();"],
          [2, "    for ch in text.chars() {"],
          [3, "        if ch.is_ascii_digit() {"],
          [4, "            result.push('*');"],
          [3, "        } else {"],
          [4, "            result.push(ch);"],
          [0, "        }"],
          [0, "    }"],
          [5, "    result"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "fn mask_digits(text: &str) -> String {"],
          [[1, 2, 3, 4, 5], "    text.chars().map(|ch| if ch.is_ascii_digit() { '*' } else { ch }).collect()"],
          [0, "}"]
        ], note: "<code>map</code> decides each piece; <code>collect</code> builds the <code>String</code>." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "#include <ctype.h>"],
          [0, ""],
          [0, "void mask_digits(const char *text, char out[]) {"],
          [1, "    size_t i = 0;"],
          [2, "    for (; text[i] != '\\0'; i++) {"],
          [3, "        if (isdigit((unsigned char) text[i])) {"],
          [4, "            out[i] = '*';"],
          [3, "        } else {"],
          [4, "            out[i] = text[i];"],
          [0, "        }"],
          [0, "    }"],
          [5, "    out[i] = '\\0';"],
          [0, "}"]
        ], note: "The caller provides <code>out</code>, big enough for the text plus the terminating <code>'\\0'</code>, which step 5 writes." },
        idiomatic: null,
        idiomaticNote: "C has no built-in string mapping. The character loop is the idiomatic way."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "#include <cctype>"],
          [0, "#include <string>"],
          [0, ""],
          [0, "std::string mask_digits(const std::string& text) {"],
          [1, "    std::string result;"],
          [2, "    for (char ch : text) {"],
          [3, "        if (std::isdigit(static_cast<unsigned char>(ch))) {"],
          [4, "            result += '*';"],
          [3, "        } else {"],
          [4, "            result += ch;"],
          [0, "        }"],
          [0, "    }"],
          [5, "    return result;"],
          [0, "}"]
        ] },
        idiomatic: { lines: [
          [0, "#include <algorithm>"],
          [0, "#include <string>"],
          [0, ""],
          [0, "std::string mask_digits(const std::string& text) {"],
          [1, "    std::string result = text;"],
          [[2, 3, 4], "    std::ranges::replace_if(result, [](char ch) { return ch >= '0' && ch <= '9'; }, '*');"],
          [5, "    return result;"],
          [0, "}"]
        ], note: "Copy first, then replace in the copy, so the original stays unchanged." }
      }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>Hide every digit with a star.</b> Everything else is copied as it is.",
      input: { kind: "fields", fields: [{ name: "text", label: "text", type: "text", max: 12 }] },
      presets: [
        { label: "\"PIN 4096\"", input: { text: "PIN 4096" } },
        { label: "\"card 12\"", input: { text: "card 12" } },
        { label: "\"hello\"", input: { text: "hello" } },
        { label: "Empty text", input: { text: "" } }
      ],
      run({ text }) {
        const chars = [...text], n = chars.length, ev = [], states = chars.map(() => ""), result = [];
        const snap = (step, msg, cur = -1, tone = "", fresh = -1) => ev.push({
          step, msg, tone,
          view: { values: chars.map(show), states: states.slice(), ptr: cur, emptyNote: "\"\"  (no characters)", out: { label: "result", items: result.map(show), fresh, text: true, empty: "\"\" empty" } },
          vars: [{ k: "ch", role: "walker", v: cur >= 0 ? `'${chars[cur]}'` : "—" }, { k: "result", role: "gatherer", v: `"${result.join("")}"` }]
        });
        snap(null, n ? `Ready. ${n} characters to copy.` : "Ready. The text is empty.");
        snap(1, "Start with an empty result: \"\".");
        for (let i = 0; i < n; i++) {
          states[i] = "current";
          snap(2, `Visit character [${i}]: '${chars[i]}'`, i);
          const d = isDigit(chars[i]);
          states[i] = d ? "hit" : "miss";
          snap(3, d ? `'${chars[i]}' is a digit, so write '*'.` : `'${chars[i]}' isn't a digit, so write it as it is.`, i);
          result.push(d ? "*" : chars[i]);
          snap(4, `Add it to the end: result = "${result.join("")}"`, i, "", result.length - 1);
        }
        snap(5, `Return "${result.join("")}". The original text is unchanged.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["string"],
      returns: "text",
      cases: [
        { args: ["card 1234"], expect: "card ****" },
        { args: [""], expect: "" },
        { args: ["no digits"], expect: "no digits" },
        { args: ["2026-11-14"], expect: "****-**-**" }
      ],
      snippets: {
        bugReset: [{ args: ["ab1"], expect: "*" }],
        bugPrepend: [{ args: ["ab1"], expect: "*ba" }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "Starting over inside the loop", wide: true, code: "bugReset",
        text: "Resetting the result on every pass throws away what was written so far, so only the last character survives.",
        take: "Create the empty result once, before the loop." },
      { kind: "dont", title: "Adding to the front by accident",
        text: "<code>result = piece + result</code> puts each new piece in front, which reverses the text. Useful when you want reversal, a bug when you don't.",
        take: "Add to the end to keep the order." },
      { kind: "dont", title: "Forgetting the terminator in C",
        text: "C strings end with <code>'\\0'</code>. Without it, printing the result runs on into whatever memory follows.",
        take: "Write <code>'\\0'</code> after the last character." },
      { kind: "do", title: "Use a builder for long text",
        text: "Java's <code>StringBuilder</code>, Python's <code>\"\".join()</code> and Rust's <code>String::push</code> avoid copying the whole string on every addition." },
      { kind: "do", title: "Test empty text",
        text: "The loop never runs and the result stays empty. It should be <code>\"\"</code>, not an error." }
    ],

    snippets: {
      bugReset: {
        python: ["def mask_digits(text):", "    result = \"\"", "    for ch in text:", "        result = \"\"          # \u2717 starts over on every pass", "        if ch.isdigit():", "            result += \"*\"", "        else:", "            result += ch", "    return result"],
        java: ["static String maskDigits(String text) {", "    StringBuilder result = new StringBuilder();", "    for (char ch : text.toCharArray()) {", "        result = new StringBuilder();   // \u2717 starts over on every pass", "        if (Character.isDigit(ch)) {", "            result.append('*');", "        } else {", "            result.append(ch);", "        }", "    }", "    return result.toString();", "}"],
        rust: ["fn mask_digits(text: &str) -> String {", "    let mut result = String::new();", "    for ch in text.chars() {", "        result = String::new();        // \u2717 starts over on every pass", "        if ch.is_ascii_digit() {", "            result.push('*');", "        } else {", "            result.push(ch);", "        }", "    }", "    result", "}"],
        c: ["void mask_digits(const char *text, char out[]) {", "    size_t j = 0;", "    for (size_t i = 0; text[i] != '\\0'; i++) {", "        j = 0;                         // \u2717 starts over on every pass", "        out[j] = isdigit((unsigned char) text[i]) ? '*' : text[i];", "        j++;", "    }", "    out[j] = '\\0';", "}"],
        cpp: ["std::string mask_digits(const std::string& text) {", "    std::string result;", "    for (char ch : text) {", "        result = \"\";                   // \u2717 starts over on every pass", "        if (std::isdigit(static_cast<unsigned char>(ch))) {", "            result += '*';", "        } else {", "            result += ch;", "        }", "    }", "    return result;", "}"]
      },
      bugPrepend: {
        python: ["def mask_digits(text):", "    result = \"\"", "    for ch in text:", "        if ch.isdigit():", "            result = \"*\" + result", "        else:", "            result = ch + result", "    return result"],
        java: ["static String maskDigits(String text) {", "    String result = \"\";", "    for (char ch : text.toCharArray()) {", "        if (Character.isDigit(ch)) {", "            result = \"*\" + result;", "        } else {", "            result = ch + result;", "        }", "    }", "    return result;", "}"],
        rust: ["fn mask_digits(text: &str) -> String {", "    let mut result = String::new();", "    for ch in text.chars() {", "        if ch.is_ascii_digit() {", "            result.insert(0, '*');", "        } else {", "            result.insert(0, ch);", "        }", "    }", "    result", "}"],
        c: ["void mask_digits(const char *text, char out[]) {", "    size_t len = 0;", "    out[0] = '\\0';", "    for (size_t i = 0; text[i] != '\\0'; i++) {", "        char piece = isdigit((unsigned char) text[i]) ? '*' : text[i];", "        memmove(out + 1, out, len + 1);   /* shift everything right */", "        out[0] = piece;", "        len++;", "    }", "}"],
        cpp: ["std::string mask_digits(const std::string& text) {", "    std::string result;", "    for (char ch : text) {", "        if (std::isdigit(static_cast<unsigned char>(ch))) {", "            result = '*' + result;", "        } else {", "            result = ch + result;", "        }", "    }", "    return result;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(\"R2-D2\") return?", options: ["\"R*-D*\"", "\"**-**\"", "\"R2-D2\"", "\"RD\""], answer: 0,
        explain: "Only the two 2s are digits, so they become stars. R, - and D are copied as they are." },
      { q: "This version has a bug. What does it return for \"ab1\"?", code: "bugPrepend", options: ["\"ab*\"", "\"*ba\"", "\"*\""], answer: 1,
        explain: "Each piece goes in front of the result, so the text comes out reversed: \"*ba\"." },
      { q: "How long is the result compared with the input text?", options: ["Shorter", "The same length", "Longer"], answer: 1,
        explain: "Every character produces exactly one piece (a star or itself), so the lengths match. Plans that remove characters produce shorter text." }
    ],

    exercise: {
      title: "Your turn: remove the spaces",
      task: "Write <code>remove_spaces(text)</code> that returns the text with every space left out. (In C: <code>void remove_spaces(const char *text, char out[])</code>.)",
      plan: ["Start with an empty result", "Visit each character", "Decide: is it a space?", "If it isn't, add it to the end of the result", "Return the result"],
      fn: { python: "remove_spaces", java: "removeSpaces", rust: "remove_spaces", c: "remove_spaces", cpp: "remove_spaces" },
      params: ["string"],
      returns: "text",
      tests: [
        { args: ["a b c"], expect: "abc" },
        { args: [""], expect: "" },
        { args: ["   "], expect: "" },
        { args: ["no-spaces"], expect: "no-spaces" }
      ],
      solutions: {
        python: ["def remove_spaces(text):", "    result = \"\"", "    for ch in text:", "        if ch != \" \":", "            result += ch", "    return result"],
        java: ["static String removeSpaces(String text) {", "    StringBuilder result = new StringBuilder();", "    for (char ch : text.toCharArray()) {", "        if (ch != ' ') {", "            result.append(ch);", "        }", "    }", "    return result.toString();", "}"],
        rust: ["fn remove_spaces(text: &str) -> String {", "    let mut result = String::new();", "    for ch in text.chars() {", "        if ch != ' ' {", "            result.push(ch);", "        }", "    }", "    result", "}"],
        c: ["void remove_spaces(const char *text, char out[]) {", "    size_t j = 0;", "    for (size_t i = 0; text[i] != '\\0'; i++) {", "        if (text[i] != ' ') {", "            out[j] = text[i];", "            j++;", "        }", "    }", "    out[j] = '\\0';", "}"],
        cpp: ["#include <string>", "", "std::string remove_spaces(const std::string& text) {", "    std::string result;", "    for (char ch : text) {", "        if (ch != ' ') {", "            result += ch;", "        }", "    }", "    return result;", "}"]
      }
    },

    compare: {
      intro: "Three plans that build something new from a sequence. What they build is what differs.",
      rows: [
        { id: "D11", name: "Build a string", question: "\"PIN 40\" → \"PIN **\"", shape: "for each character, add one piece to the end of a string", result: "new text", self: true },
        { id: "D9", name: "Filter", question: "Keep the passing scores", shape: "for each item, add it to a new list only if it passes", result: "new list" },
        { id: "D2", name: "Accumulate", question: "Total the amounts", shape: "for each item, fold it into a running total", result: "one value" }
      ],
      table: {
        head: ["Plan", "Starts with", "Each step", "Result"],
        rows: [
          ["Build a string", "\"\"", "adds a piece of text to the end", "a string"],
          ["Filter", "an empty list", "maybe adds the item", "a list"],
          ["Accumulate", "0", "adds the item to the total", "a number"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "D2", why: "the same running-result idea, with text instead of a number" }],
      leadsTo: [{ id: "A4", why: "tidy text with built-in string methods" }, { id: "F1", why: "two pointers, for reversing and palindromes" }]
    }
  };
})();
