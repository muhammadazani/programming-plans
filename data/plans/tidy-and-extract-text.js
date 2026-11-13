/* Plan data: A4 · Tidy and extract text
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   Returns a new string. In C the caller passes an output buffer
   (checks.returns "text" knows this). */

(function () {
  const q = (s) => `"${s.replace(/ /g, "␣")}"`;

  window.PLAN = {
    id: "A4",
    slug: "tidy-and-extract-text",
    title: "Tidy and extract text",
    highlight: "extract",
    aka: ["parse a string", "trim, find and slice", "string methods"],
    group: "A",
    level: "Foundations",
    core: true,
    fn: { python: "domain", java: "domain", rust: "domain", c: "domain", cpp: "domain" },

    hero: {
      type: "pipeline",
      inputs: ["\" Al@X.COM \"", "find @"],
      output: "x.com",
      tag: "trim · find · slice",
      alt: "A messy email address and the marker @ flow into a process cube, which produces the tidy domain x.com"
    },
    planCard: { name: "tidy & extract", lines: ["tidy: trim, lowercase", "find the marker", "not found? → \"\""], foot: "→ slice out the part" },

    intent: "Get one clean piece out of messy text: tidy it up, find the marker that separates the parts, check it was there, and slice out the part you need.",

    analogy: {
      icon: "✉️",
      title: "Reading the postcode off an envelope",
      text: "First you straighten the crumpled envelope so you can read it. Then you look for the line that starts the address. If there isn't one, there's nothing to read. If there is, you copy out just the part after it."
    },

    cues: ["extract / get the … part", "after the …", "before the …", "ignore spaces and capitals", "the domain / extension / username"],
    cueSummary: "The text has a <b>marker</b> (like <code>@</code>, <code>.</code> or <code>:</code>), and the answer is the part before or after it.",
    cueExamples: [
      "Get the domain from an email address.",
      "Get a file's extension, ignoring capital letters.",
      "Get the username from “user: alice”."
    ],

    steps: [
      { n: 1, title: "Tidy the text", text: "Remove spaces at the ends and make it lowercase, so “ Alice@Example.COM ” and “alice@example.com” are treated the same." },
      { n: 2, title: "Find the marker", text: "Here the @ sign. Most languages give its position, or -1 / None / npos if it's missing." },
      { n: 3, title: "Not found? Return an empty answer", text: "Check before slicing: a missing marker is a normal case, not a crash." },
      { n: 4, title: "Slice out the part you need", text: "Everything after the @: from position at + 1 to the end." }
    ],

    impl: {
      python: {
        file: "domain.py",
        plain: { lines: [
          [0, "def domain(email):"],
          [1, "    clean = email.strip().lower()"],
          [2, "    at = clean.find(\"@\")"],
          [3, "    if at == -1:"],
          [3, "        return \"\""],
          [4, "    return clean[at + 1:]"]
        ], note: "<code>find</code> returns -1 if the @ is missing. (<code>index</code> would raise an error instead.)" },
        idiomatic: { lines: [
          [0, "def domain(email):"],
          [[1, 2, 3, 4], "    return email.strip().lower().partition(\"@\")[2]"]
        ], note: "<code>partition</code> splits at the first @ into (before, @, after); <code>after</code> is \"\" when there's no @." }
      },
      java: {
        file: "Plans.java",
        plain: { lines: [
          [0, "static String domain(String email) {"],
          [1, "    String clean = email.trim().toLowerCase();"],
          [2, "    int at = clean.indexOf('@');"],
          [3, "    if (at == -1) {"],
          [3, "        return \"\";"],
          [0, "    }"],
          [4, "    return clean.substring(at + 1);"],
          [0, "}"]
        ] },
        idiomatic: null,
        idiomaticNote: "<code>trim</code>, <code>indexOf</code> and <code>substring</code> <em>are</em> the idiomatic Java tools for this. (<code>split(\"@\")</code> also works, but behaves oddly with a missing or repeated @.)"
      },
      rust: {
        file: "plans.rs",
        plain: { lines: [
          [0, "fn domain(email: &str) -> String {"],
          [1, "    let clean = email.trim().to_lowercase();"],
          [2, "    match clean.find('@') {"],
          [3, "        None => String::new(),"],
          [4, "        Some(at) => clean[at + 1..].to_string(),"],
          [0, "    }"],
          [0, "}"]
        ], note: "<code>find</code> returns an <code>Option</code>, so Rust makes you handle the not-found case (step 3)." },
        idiomatic: { lines: [
          [0, "fn domain(email: &str) -> String {"],
          [[1, 2, 3, 4], "    email.trim().to_lowercase().split_once('@').map(|(_, d)| d.to_string()).unwrap_or_default()"],
          [0, "}"]
        ], note: "<code>split_once</code> splits at the first @; <code>unwrap_or_default</code> gives \"\" when there's none." }
      },
      c: {
        file: "plans.c",
        plain: { lines: [
          [0, "#include <ctype.h>"],
          [0, "#include <string.h>"],
          [0, ""],
          [0, "void domain(const char *email, char out[]) {"],
          [1, "    size_t start = 0, end = strlen(email);"],
          [1, "    while (start < end && isspace((unsigned char) email[start])) start++;"],
          [1, "    while (end > start && isspace((unsigned char) email[end - 1])) end--;"],
          [2, "    size_t at = start;"],
          [2, "    while (at < end && email[at] != '@') at++;"],
          [3, "    if (at == end) {"],
          [3, "        out[0] = '\\0';"],
          [3, "        return;"],
          [0, "    }"],
          [4, "    size_t j = 0;"],
          [4, "    for (size_t i = at + 1; i < end; i++) {"],
          [[1, 4], "        out[j++] = (char) tolower((unsigned char) email[i]);"],
          [0, "    }"],
          [4, "    out[j] = '\\0';"],
          [0, "}"]
        ], note: "C has no trim or lowercase for whole strings, so the plan is done by hand: skip spaces at both ends, scan for the @, and lowercase while copying. The caller provides <code>out</code>." },
        idiomatic: null,
        idiomaticNote: "The C library has <code>strchr</code> to find a character, but no trim; the hand-written scan is the usual way."
      },
      cpp: {
        file: "plans.cpp",
        plain: { lines: [
          [0, "#include <cctype>"],
          [0, "#include <string>"],
          [0, ""],
          [0, "std::string domain(const std::string& email) {"],
          [1, "    size_t first = email.find_first_not_of(' ');"],
          [1, "    if (first == std::string::npos) return \"\";"],
          [1, "    size_t last = email.find_last_not_of(' ');"],
          [1, "    std::string clean = email.substr(first, last - first + 1);"],
          [1, "    for (char& ch : clean) ch = static_cast<char>(std::tolower(static_cast<unsigned char>(ch)));"],
          [2, "    size_t at = clean.find('@');"],
          [3, "    if (at == std::string::npos) {"],
          [3, "        return \"\";"],
          [0, "    }"],
          [4, "    return clean.substr(at + 1);"],
          [0, "}"]
        ], note: "<code>std::string</code> has no <code>trim</code>; <code>find_first_not_of</code> and <code>find_last_not_of</code> do the job." },
        idiomatic: null,
        idiomaticNote: "There's no shorter standard C++ version; <code>find</code> and <code>substr</code> are the idiomatic tools."
      }
    },

    trace: {
      type: "pipeline",
      intro: "Running example: <b>Get the domain from an email address</b>, ignoring stray spaces and capital letters. (␣ marks a space.)",
      input: { kind: "fields", fields: [{ name: "email", label: "email", type: "text", max: 30 }] },
      presets: [
        { label: "Messy address", input: { email: " Alice@Example.COM " } },
        { label: "Clean address", input: { email: "bob@site.org" } },
        { label: "No @ sign", input: { email: "no-at-sign" } }
      ],
      run({ email }) {
        const ev = [];
        const v = { email: q(email), clean: undefined, at: undefined, found: undefined, result: undefined };
        const push = (step, msg, active, fresh = [], done = [], extra = {}) => {
          const st = (name, n, keys) => ({
            label: name, step: n,
            state: extra.error === n ? "error" : active === n ? "active" : done.includes(n) ? "done" : "",
            vars: keys.map((k) => ({ k, v: v[k], fresh: fresh.includes(k) }))
          });
          const stages = [st("Tidy", 1, ["email", "clean"]), st("Find @", 2, ["at"]), st("Check", 3, ["found"]), st("Slice", 4, ["result"])];
          if (extra.result) stages[3].state = "result";
          ev.push({ step, msg, tone: extra.tone || "", view: { stages }, vars: [] });
        };
        push(null, `Ready. The input is ${q(email)}.`, 0);
        const clean = email.trim().toLowerCase();
        v.clean = q(clean);
        push(1, `Tidy: remove the spaces at both ends and lowercase it: ${q(clean)}.`, 1, ["clean"]);
        const at = clean.indexOf("@");
        v.at = at;
        push(2, at === -1 ? "Find the @: it isn't there, so find gives -1." : `Find the @: it's at position ${at}.`, 2, ["at"], [1]);
        if (at === -1) {
          v.found = "no"; v.result = '""';
          push(3, "Not found, so return an empty string instead of slicing nonsense.", 3, ["found", "result"], [1, 2], { error: 3, tone: "no" });
          return ev;
        }
        v.found = "yes";
        push(3, "Found it, so slicing is safe.", 3, ["found"], [1, 2]);
        const result = clean.slice(at + 1);
        v.result = q(result);
        push(4, `Slice from position ${at + 1} to the end: ${q(result)}. Return it.`, 4, ["result"], [1, 2, 3], { result: true, tone: "yes" });
        return ev;
      }
    },

    checks: {
      params: ["string"],
      returns: "text",
      cases: [
        { args: [" Alice@Example.COM "], expect: "example.com" },
        { args: ["bob@site.org"], expect: "site.org" },
        { args: ["no-at-sign"], expect: "" },
        { args: [""], expect: "" },
        { args: ["a@b@c"], expect: "b@c" }
      ],
      snippets: {
        bugNoTidy: [{ args: [" Alice@Example.COM "], expect: "Example.COM " }],
        bugOffByOne: [{ args: ["bob@site.org"], expect: "@site.org" }]
      }
    },

    pitfalls: [
      { kind: "dont", title: "Skipping the tidy step", wide: true, code: "bugNoTidy",
        text: "Real input has stray spaces and random capitals. Without tidying, “Example.COM ” (with a trailing space) and “example.com” look like different domains.",
        take: "Trim and normalise the case before anything else." },
      { kind: "dont", title: "Including the marker",
        text: "Slicing from <code>at</code> instead of <code>at + 1</code> keeps the @ in the answer: “@site.org”.",
        take: "The marker's position is where the marker <em>is</em>; the part after it starts one later." },
      { kind: "dont", title: "Slicing without checking",
        text: "If the marker is missing, find gives -1 (Python, Java). Slicing from -1 + 1 = 0 quietly returns the whole text as the “domain”.",
        take: "Check for “not found” before you slice." },
      { kind: "do", title: "Decide which marker you want",
        text: "“a@b@c” has two @ signs. <code>find</code> / <code>indexOf</code> give the first; <code>rfind</code> / <code>lastIndexOf</code> give the last. File extensions want the last dot." },
      { kind: "do", title: "Test the messy cases",
        text: "Spaces at both ends, capitals, a missing marker, an empty string. Clean input hides most bugs." }
    ],

    snippets: {
      bugNoTidy: {
        python: ["def domain(email):", "    at = email.find(\"@\")          # ✗ no strip(), no lower()", "    if at == -1:", "        return \"\"", "    return email[at + 1:]"],
        java: ["static String domain(String email) {", "    int at = email.indexOf('@');   // ✗ no trim(), no toLowerCase()", "    if (at == -1) {", "        return \"\";", "    }", "    return email.substring(at + 1);", "}"],
        rust: ["fn domain(email: &str) -> String {", "    match email.find('@') {        // ✗ no trim(), no to_lowercase()", "        None => String::new(),", "        Some(at) => email[at + 1..].to_string(),", "    }", "}"],
        c: ["void domain(const char *email, char out[]) {", "    size_t at = 0;                 // ✗ no trimming, no tolower", "    while (email[at] != '\\0' && email[at] != '@') at++;", "    if (email[at] == '\\0') {", "        out[0] = '\\0';", "        return;", "    }", "    strcpy(out, email + at + 1);", "}"],
        cpp: ["std::string domain(const std::string& email) {", "    size_t at = email.find('@');   // ✗ no trimming, no tolower", "    if (at == std::string::npos) {", "        return \"\";", "    }", "    return email.substr(at + 1);", "}"]
      },
      bugOffByOne: {
        python: ["def domain(email):", "    clean = email.strip().lower()", "    at = clean.find(\"@\")", "    if at == -1:", "        return \"\"", "    return clean[at:]"],
        java: ["static String domain(String email) {", "    String clean = email.trim().toLowerCase();", "    int at = clean.indexOf('@');", "    if (at == -1) {", "        return \"\";", "    }", "    return clean.substring(at);", "}"],
        rust: ["fn domain(email: &str) -> String {", "    let clean = email.trim().to_lowercase();", "    match clean.find('@') {", "        None => String::new(),", "        Some(at) => clean[at..].to_string(),", "    }", "}"],
        c: ["void domain(const char *email, char out[]) {", "    size_t start = 0, end = strlen(email);", "    while (start < end && isspace((unsigned char) email[start])) start++;", "    while (end > start && isspace((unsigned char) email[end - 1])) end--;", "    size_t at = start;", "    while (at < end && email[at] != '@') at++;", "    if (at == end) {", "        out[0] = '\\0';", "        return;", "    }", "    size_t j = 0;", "    for (size_t i = at; i < end; i++) {", "        out[j++] = (char) tolower((unsigned char) email[i]);", "    }", "    out[j] = '\\0';", "}"],
        cpp: ["std::string domain(const std::string& email) {", "    size_t first = email.find_first_not_of(' ');", "    if (first == std::string::npos) return \"\";", "    size_t last = email.find_last_not_of(' ');", "    std::string clean = email.substr(first, last - first + 1);", "    for (char& ch : clean) ch = static_cast<char>(std::tolower(static_cast<unsigned char>(ch)));", "    size_t at = clean.find('@');", "    if (at == std::string::npos) {", "        return \"\";", "    }", "    return clean.substr(at);", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}(\"  Carol@Mail.NET\") return?", options: ["\"mail.net\"", "\"Mail.NET\"", "\"carol\"", "\"@mail.net\""], answer: 0,
        explain: "Tidy gives \"carol@mail.net\", the @ is at position 5, and everything after it is \"mail.net\"." },
      { q: "This version has a bug. What does it return for \"bob@site.org\"?", code: "bugOffByOne", options: ["\"site.org\"", "\"@site.org\"", "\"bob\""], answer: 1,
        explain: "It slices from at instead of at + 1, so the @ itself is included." },
      { q: "What should happen when the text has no @ at all?", options: ["Return the whole text", "Return an empty string", "Crash"], answer: 1,
        explain: "A missing marker is a normal case for real input. Step 3 checks for it and returns an empty answer instead of slicing." }
    ],

    exercise: {
      title: "Your turn: a file's extension",
      task: "Write <code>file_extension(name)</code> that returns the part after the <b>last</b> dot, in lowercase, ignoring spaces at the ends. Return \"\" if there's no dot. (In C: <code>void file_extension(const char *name, char out[])</code>.)",
      plan: ["Tidy: trim the spaces and lowercase the name", "Find the last dot", "No dot? Return an empty string", "Slice out everything after the dot"],
      fn: { python: "file_extension", java: "fileExtension", rust: "file_extension", c: "file_extension", cpp: "file_extension" },
      params: ["string"],
      returns: "text",
      tests: [
        { args: ["Report.PDF"], expect: "pdf" },
        { args: ["archive.tar.gz"], expect: "gz" },
        { args: ["README"], expect: "" },
        { args: [" notes.Txt "], expect: "txt" }
      ],
      solutions: {
        python: ["def file_extension(name):", "    clean = name.strip().lower()", "    dot = clean.rfind(\".\")", "    if dot == -1:", "        return \"\"", "    return clean[dot + 1:]"],
        java: ["static String fileExtension(String name) {", "    String clean = name.trim().toLowerCase();", "    int dot = clean.lastIndexOf('.');", "    if (dot == -1) {", "        return \"\";", "    }", "    return clean.substring(dot + 1);", "}"],
        rust: ["fn file_extension(name: &str) -> String {", "    let clean = name.trim().to_lowercase();", "    match clean.rfind('.') {", "        None => String::new(),", "        Some(dot) => clean[dot + 1..].to_string(),", "    }", "}"],
        c: ["#include <ctype.h>", "#include <string.h>", "", "void file_extension(const char *name, char out[]) {", "    size_t start = 0, end = strlen(name);", "    while (start < end && isspace((unsigned char) name[start])) start++;", "    while (end > start && isspace((unsigned char) name[end - 1])) end--;", "    size_t dot = end;", "    for (size_t i = start; i < end; i++) {", "        if (name[i] == '.') dot = i;", "    }", "    size_t j = 0;", "    if (dot != end) {", "        for (size_t i = dot + 1; i < end; i++) {", "            out[j++] = (char) tolower((unsigned char) name[i]);", "        }", "    }", "    out[j] = '\\0';", "}"],
        cpp: ["#include <cctype>", "#include <string>", "", "std::string file_extension(const std::string& name) {", "    size_t first = name.find_first_not_of(' ');", "    if (first == std::string::npos) return \"\";", "    size_t last = name.find_last_not_of(' ');", "    std::string clean = name.substr(first, last - first + 1);", "    for (char& ch : clean) ch = static_cast<char>(std::tolower(static_cast<unsigned char>(ch)));", "    size_t dot = clean.rfind('.');", "    if (dot == std::string::npos) {", "        return \"\";", "    }", "    return clean.substr(dot + 1);", "}"]
      }
    },

    compare: {
      intro: "Three plans that work with text or formulas. A4 is the one that cuts a piece out of existing text using the language's string tools.",
      rows: [
        { id: "A4", name: "Tidy and extract text", question: "Get the domain of an email", shape: "trim / lowercase → find the marker → check → slice", result: "a piece of the text", self: true },
        { id: "D11", name: "Build a string", question: "Hide the digits of a PIN", shape: "visit every character and add a piece to a new string", result: "new text, same length" },
        { id: "A1", name: "Input → process → output", question: "Compute a speed", shape: "convert units → formula → return", result: "a number" }
      ],
      table: {
        head: ["Plan", "Loop?", "Main tools", "Watch out for"],
        rows: [
          ["Tidy and extract text", "usually not (the methods loop for you)", "trim, lower, find, slice", "a missing marker"],
          ["Build a string", "yes, over the characters", "+= / append / push", "resetting the result"],
          ["Input → process → output", "no", "arithmetic", "integer division"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [{ id: "A1", why: "the same input → process → output shape, applied to text" }, { id: "B2", why: "the found / not-found check" }],
      leadsTo: [{ id: "D11", why: "when no built-in method fits, build the new text yourself" }, { id: "D6", why: "find is a linear search over the characters" }]
    }
  };
})();
