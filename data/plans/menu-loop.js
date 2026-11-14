/* Plan data: C5 · Menu loop
   Code lines are [steps, text]; see is-there-any.js for the conventions.
   The user's choices come from a list so every language can be tested the same
   way; in a real program each choice is read from input after printing the menu. */

(function () {
  const NAMES = { 0: "quit", 1: "deposit 10", 2: "withdraw 5" };

  window.PLAN = {
    id: "C5",
    slug: "menu-loop",
    title: "Menu loop",
    highlight: "Menu",
    aka: ["command loop", "event loop (simple)", "dispatch loop"],
    group: "C",
    level: "Foundations",
    core: false,
    fn: { python: "run_menu", java: "runMenu", rust: "run_menu", c: "run_menu", cpp: "run_menu" },

    hero: { type: "tiles", values: [1, 1, 2, 0, 1], colors: ["pale", "pale", "pale", "amber", "fade"], highlight: 3, tag: "0 = quit", alt: "A row of menu choices: deposit, deposit, withdraw are done, 0 is amber as quit, and the choice after it is never read" },
    planCard: { name: "menu", lines: ["show menu, read choice", "while not quit", "act on it, read again"], foot: "→ finish up" },

    intent: "Show a menu, act on the user's choice, and come back to the menu, again and again until they choose to quit.",

    analogy: { icon: "🏧", title: "A cash machine", text: "The screen offers: 1) deposit, 2) withdraw, 0) exit. You choose, it does that, and the menu comes back. It keeps going until you press exit; only then does it hand back your card." },

    cues: ["menu", "1) … 2) … 0) quit", "until the user chooses exit", "repeatedly ask what to do", "commands"],
    cueSummary: "The program offers <b>several actions</b> and keeps offering them until the user picks “quit”.",
    cueExamples: ["A bank account menu: deposit, withdraw, show balance, quit.", "A to-do app: add, list, remove, exit.", "A quiz that asks “play again?” after each round."],

    steps: [
      { n: 1, title: "Show the menu and read a choice", text: "Before the loop, so the test has a choice to look at." },
      { n: 2, title: "While the choice isn't quit", text: "Here 0 means quit." },
      { n: 3, title: "Act on the choice", text: "One branch per option: 1 deposits 10, 2 withdraws 5 if there's enough money. Unknown choices are ignored." },
      { n: 4, title: "Show the menu again and read the next choice", text: "At the end of the loop body." },
      { n: 5, title: "Finish up", text: "After quitting: here, return the final balance." }
    ],

    impl: {
      python: { file: "menu.py",
        plain: { lines: [[0, "def run_menu(choices):"], [0, "    balance = 0"], [1, "    i = 0"], [1, "    choice = choices[i]"], [2, "    while choice != 0:"], [3, "        if choice == 1:"], [3, "            balance += 10"], [3, "        elif choice == 2 and balance >= 5:"], [3, "            balance -= 5"], [4, "        i += 1"], [4, "        choice = choices[i]"], [5, "    return balance"]], note: "A real program prints the menu and reads <code>int(input(\"Choice: \"))</code> in steps 1 and 4." },
        idiomatic: { lines: [[0, "def run_menu(choices):"], [0, "    balance = 0"], [1, "    i = 0"], [1, "    choice = choices[i]"], [2, "    while choice != 0:"], [3, "        match choice:"], [3, "            case 1:"], [3, "                balance += 10"], [3, "            case 2 if balance >= 5:"], [3, "                balance -= 5"], [4, "        i += 1"], [4, "        choice = choices[i]"], [5, "    return balance"]], note: "<code>match</code> (Python 3.10+) lists the options like the menu does; <code>case 2 if …</code> adds a condition." } },
      java: { file: "Plans.java",
        plain: { lines: [[0, "static int runMenu(int[] choices) {"], [0, "    int balance = 0;"], [1, "    int i = 0;"], [1, "    int choice = choices[i];"], [2, "    while (choice != 0) {"], [3, "        if (choice == 1) {"], [3, "            balance += 10;"], [3, "        } else if (choice == 2 && balance >= 5) {"], [3, "            balance -= 5;"], [0, "        }"], [4, "        i++;"], [4, "        choice = choices[i];"], [0, "    }"], [5, "    return balance;"], [0, "}"]] },
        idiomatic: { lines: [[0, "static int runMenu(int[] choices) {"], [0, "    int balance = 0;"], [1, "    int i = 0;"], [1, "    int choice = choices[i];"], [2, "    while (choice != 0) {"], [3, "        switch (choice) {"], [3, "            case 1 -> balance += 10;"], [3, "            case 2 -> { if (balance >= 5) balance -= 5; }"], [3, "            default -> { }"], [0, "        }"], [4, "        i++;"], [4, "        choice = choices[i];"], [0, "    }"], [5, "    return balance;"], [0, "}"]], note: "Arrow-style <code>switch</code> (Java 14+) has no fall-through, so no <code>break</code> is needed." } },
      rust: { file: "plans.rs",
        plain: { lines: [[0, "fn run_menu(choices: &[i32]) -> i32 {"], [0, "    let mut balance = 0;"], [1, "    let mut i = 0;"], [1, "    let mut choice = choices[i];"], [2, "    while choice != 0 {"], [3, "        if choice == 1 {"], [3, "            balance += 10;"], [3, "        } else if choice == 2 && balance >= 5 {"], [3, "            balance -= 5;"], [0, "        }"], [4, "        i += 1;"], [4, "        choice = choices[i];"], [0, "    }"], [5, "    balance"], [0, "}"]] },
        idiomatic: { lines: [[0, "fn run_menu(choices: &[i32]) -> i32 {"], [0, "    let mut balance = 0;"], [1, "    let mut i = 0;"], [1, "    let mut choice = choices[i];"], [2, "    while choice != 0 {"], [3, "        match choice {"], [3, "            1 => balance += 10,"], [3, "            2 if balance >= 5 => balance -= 5,"], [3, "            _ => {}"], [0, "        }"], [4, "        i += 1;"], [4, "        choice = choices[i];"], [0, "    }"], [5, "    balance"], [0, "}"]] } },
      c: { file: "plans.c",
        plain: { lines: [[0, "int run_menu(const int choices[], size_t n) {"], [0, "    (void) n;  /* a 0 (quit) is assumed to come */"], [0, "    int balance = 0;"], [1, "    size_t i = 0;"], [1, "    int choice = choices[i];"], [2, "    while (choice != 0) {"], [3, "        if (choice == 1) {"], [3, "            balance += 10;"], [3, "        } else if (choice == 2 && balance >= 5) {"], [3, "            balance -= 5;"], [0, "        }"], [4, "        i++;"], [4, "        choice = choices[i];"], [0, "    }"], [5, "    return balance;"], [0, "}"]] },
        idiomatic: { lines: [[0, "int run_menu(const int choices[], size_t n) {"], [0, "    (void) n;"], [0, "    int balance = 0;"], [1, "    size_t i = 0;"], [1, "    int choice = choices[i];"], [2, "    while (choice != 0) {"], [3, "        switch (choice) {"], [3, "            case 1: balance += 10; break;"], [3, "            case 2: if (balance >= 5) balance -= 5; break;"], [3, "            default: break;"], [0, "        }"], [4, "        i++;"], [4, "        choice = choices[i];"], [0, "    }"], [5, "    return balance;"], [0, "}"]], note: "Every <code>case</code> ends with <code>break</code>; without it, C falls through into the next case." } },
      cpp: { file: "plans.cpp",
        plain: { lines: [[0, "#include <vector>"], [0, ""], [0, "int run_menu(const std::vector<int>& choices) {"], [0, "    int balance = 0;"], [1, "    size_t i = 0;"], [1, "    int choice = choices[i];"], [2, "    while (choice != 0) {"], [3, "        if (choice == 1) {"], [3, "            balance += 10;"], [3, "        } else if (choice == 2 && balance >= 5) {"], [3, "            balance -= 5;"], [0, "        }"], [4, "        i++;"], [4, "        choice = choices[i];"], [0, "    }"], [5, "    return balance;"], [0, "}"]] },
        idiomatic: { lines: [[0, "#include <vector>"], [0, ""], [0, "int run_menu(const std::vector<int>& choices) {"], [0, "    int balance = 0;"], [1, "    size_t i = 0;"], [1, "    int choice = choices[i];"], [2, "    while (choice != 0) {"], [3, "        switch (choice) {"], [3, "            case 1: balance += 10; break;"], [3, "            case 2: if (balance >= 5) balance -= 5; break;"], [3, "            default: break;"], [0, "        }"], [4, "        i++;"], [4, "        choice = choices[i];"], [0, "    }"], [5, "    return balance;"], [0, "}"]] } }
    },

    trace: {
      type: "tiles",
      intro: "Running example: <b>A tiny bank menu.</b> 1) deposit 10, 2) withdraw 5 (only if there's at least 5), 0) quit. Each tile is one choice the user types.",
      input: { kind: "list", max: 10, placeholder: "choices: 1, 1, 2, 0" },
      presets: [{ label: "Deposit, deposit, withdraw", input: [1, 1, 2, 0, 1] }, { label: "Quit straight away", input: [0] }, { label: "Withdraw too early", input: [2, 1, 9, 2, 0] }],
      run(raw) {
        const list = raw.includes(0) ? raw : raw.concat([0]);
        const ev = [], states = list.map(() => ""), badges = list.map(() => "");
        let balance = 0, choice = "—";
        const snap = (step, msg, cur = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur, badges: badges.slice() },
          vars: [{ k: "choice", role: "walker", v: choice }, { k: "balance", role: "gatherer", v: balance }] });
        snap(null, raw.includes(0) ? "Ready. The menu is on screen." : "Your list had no 0 (quit), so one was added at the end.");
        let i = 0; choice = list[0]; states[0] = "current";
        snap(1, `Show the menu and read a choice: ${choice} (${NAMES[choice] || "not an option"}).`, 0);
        while (choice !== 0) {
          snap(2, `Is ${choice} the quit option? No, so act on it.`, i);
          if (choice === 1) { balance += 10; badges[i] = "+10"; states[i] = "added"; snap(3, `Deposit 10: balance = ${balance}.`, i); }
          else if (choice === 2 && balance >= 5) { balance -= 5; badges[i] = "−5"; states[i] = "added"; snap(3, `Withdraw 5: balance = ${balance}.`, i); }
          else if (choice === 2) { badges[i] = "refused"; states[i] = "miss"; snap(3, `Withdraw 5? Not enough money (balance ${balance}), so nothing happens.`, i); }
          else { badges[i] = "unknown"; states[i] = "miss"; snap(3, `${choice} isn't on the menu, so it's ignored. (A real program would say so.)`, i); }
          i++; choice = list[i]; states[i] = "current";
          snap(4, `Show the menu again and read the next choice: ${choice} (${NAMES[choice] || "not an option"}).`, i);
        }
        states[i] = "stop"; badges[i] = "quit"; for (let j = i + 1; j < list.length; j++) states[j] = "skipped";
        snap(2, "Is 0 the quit option? Yes, so the loop ends.", i);
        snap(5, `Finish up: return the balance, ${balance}.`, -1, "yes");
        return ev;
      }
    },

    checks: {
      params: ["int[]"], returns: "int",
      cases: [{ args: [[1, 1, 2, 0]], expect: 15 }, { args: [[0]], expect: 0 }, { args: [[2, 0]], expect: 0 }, { args: [[1, 7, 2, 0, 1]], expect: 5 }],
      snippets: { bugNoCheck: [{ args: [[2, 0]], expect: -5 }], bugIgnoresQuit: [{ args: [[1, 0, 1, 0]], expect: 20 }] }
    },

    pitfalls: [
      { kind: "dont", title: "Not checking before acting", wide: true, code: "bugNoCheck", text: "A withdrawal without a balance check lets the account go negative: choosing 2 first leaves -5.", take: "Each option checks its own conditions before it acts." },
      { kind: "dont", title: "Ignoring the quit option", text: "Looping over every choice, instead of stopping at 0, keeps processing commands the user never meant to give after quitting.", take: "The loop's condition is “not quit”." },
      { kind: "dont", title: "Falling through in C and C++", text: "A <code>case</code> without <code>break</code> runs straight into the next case: a deposit would also withdraw.", take: "End every case with break (or use Java's arrow switch, Rust's or Python's match)." },
      { kind: "do", title: "Handle unknown choices", text: "Users type things that aren't on the menu. An else / default branch should say “unknown option” and show the menu again." },
      { kind: "do", title: "Put each action in its own function", text: "Once the options do real work, <code>deposit()</code>, <code>withdraw()</code> and so on keep the loop short and readable." }
    ],

    snippets: {
      bugNoCheck: {
        python: ["def run_menu(choices):", "    balance = 0", "    i = 0", "    choice = choices[i]", "    while choice != 0:", "        if choice == 1:", "            balance += 10", "        elif choice == 2:          # ✗ no balance check", "            balance -= 5", "        i += 1", "        choice = choices[i]", "    return balance"],
        java: ["static int runMenu(int[] choices) {", "    int balance = 0;", "    int i = 0;", "    int choice = choices[i];", "    while (choice != 0) {", "        if (choice == 1) {", "            balance += 10;", "        } else if (choice == 2) {   // ✗ no balance check", "            balance -= 5;", "        }", "        i++;", "        choice = choices[i];", "    }", "    return balance;", "}"],
        rust: ["fn run_menu(choices: &[i32]) -> i32 {", "    let mut balance = 0;", "    let mut i = 0;", "    let mut choice = choices[i];", "    while choice != 0 {", "        if choice == 1 {", "            balance += 10;", "        } else if choice == 2 {     // ✗ no balance check", "            balance -= 5;", "        }", "        i += 1;", "        choice = choices[i];", "    }", "    balance", "}"],
        c: ["int run_menu(const int choices[], size_t n) {", "    (void) n;", "    int balance = 0;", "    size_t i = 0;", "    int choice = choices[i];", "    while (choice != 0) {", "        if (choice == 1) {", "            balance += 10;", "        } else if (choice == 2) {   // ✗ no balance check", "            balance -= 5;", "        }", "        i++;", "        choice = choices[i];", "    }", "    return balance;", "}"],
        cpp: ["int run_menu(const std::vector<int>& choices) {", "    int balance = 0;", "    size_t i = 0;", "    int choice = choices[i];", "    while (choice != 0) {", "        if (choice == 1) {", "            balance += 10;", "        } else if (choice == 2) {   // ✗ no balance check", "            balance -= 5;", "        }", "        i++;", "        choice = choices[i];", "    }", "    return balance;", "}"]
      },
      bugIgnoresQuit: {
        python: ["def run_menu(choices):", "    balance = 0", "    for choice in choices:", "        if choice == 1:", "            balance += 10", "        elif choice == 2 and balance >= 5:", "            balance -= 5", "    return balance"],
        java: ["static int runMenu(int[] choices) {", "    int balance = 0;", "    for (int choice : choices) {", "        if (choice == 1) {", "            balance += 10;", "        } else if (choice == 2 && balance >= 5) {", "            balance -= 5;", "        }", "    }", "    return balance;", "}"],
        rust: ["fn run_menu(choices: &[i32]) -> i32 {", "    let mut balance = 0;", "    for &choice in choices {", "        if choice == 1 {", "            balance += 10;", "        } else if choice == 2 && balance >= 5 {", "            balance -= 5;", "        }", "    }", "    balance", "}"],
        c: ["int run_menu(const int choices[], size_t n) {", "    int balance = 0;", "    for (size_t i = 0; i < n; i++) {", "        if (choices[i] == 1) {", "            balance += 10;", "        } else if (choices[i] == 2 && balance >= 5) {", "            balance -= 5;", "        }", "    }", "    return balance;", "}"],
        cpp: ["int run_menu(const std::vector<int>& choices) {", "    int balance = 0;", "    for (int choice : choices) {", "        if (choice == 1) {", "            balance += 10;", "        } else if (choice == 2 && balance >= 5) {", "            balance -= 5;", "        }", "    }", "    return balance;", "}"]
      }
    },

    quiz: [
      { q: "What does {fn}([1, 2, 2, 0]) return?", options: ["0", "5", "10"], answer: 0, explain: "Deposit 10 (10), withdraw 5 (5), withdraw 5 (0), then quit." },
      { q: "This version has a bug. What does it return for [1, 0, 1, 0]?", code: "bugIgnoresQuit", options: ["10", "20"], answer: 1, explain: "It loops over every choice and never stops at the first 0, so the deposit typed after quitting is processed too." },
      { q: "Where does the program read the next choice?", options: ["At the start of the loop body", "At the end of the loop body", "Only before the loop"], answer: 1, explain: "Once before the loop, then at the end of each pass, so every choice is checked against “quit” before it's acted on." }
    ],

    exercise: {
      title: "Your turn: a counter menu",
      task: "Write <code>run_counter(commands)</code>: 1 adds one to a counter, 2 subtracts one (but never below 0), 3 resets it to 0, and 0 quits. Return the counter after quitting.",
      plan: ["Read the first command", "While it isn't 0", "Act on it: 1 adds, 2 subtracts if above 0, 3 resets", "Read the next command, and return the counter at the end"],
      fn: { python: "run_counter", java: "runCounter", rust: "run_counter", c: "run_counter", cpp: "run_counter" },
      params: ["int[]"], returns: "int",
      tests: [{ args: [[1, 1, 1, 2, 0]], expect: 2 }, { args: [[1, 3, 1, 0]], expect: 1 }, { args: [[2, 2, 0]], expect: 0 }, { args: [[0, 1]], expect: 0 }],
      solutions: {
        python: ["def run_counter(commands):", "    count = 0", "    i = 0", "    command = commands[i]", "    while command != 0:", "        if command == 1:", "            count += 1", "        elif command == 2 and count > 0:", "            count -= 1", "        elif command == 3:", "            count = 0", "        i += 1", "        command = commands[i]", "    return count"],
        java: ["static int runCounter(int[] commands) {", "    int count = 0;", "    int i = 0;", "    int command = commands[i];", "    while (command != 0) {", "        if (command == 1) count++;", "        else if (command == 2 && count > 0) count--;", "        else if (command == 3) count = 0;", "        i++;", "        command = commands[i];", "    }", "    return count;", "}"],
        rust: ["fn run_counter(commands: &[i32]) -> i32 {", "    let mut count = 0;", "    let mut i = 0;", "    let mut command = commands[i];", "    while command != 0 {", "        match command {", "            1 => count += 1,", "            2 if count > 0 => count -= 1,", "            3 => count = 0,", "            _ => {}", "        }", "        i += 1;", "        command = commands[i];", "    }", "    count", "}"],
        c: ["int run_counter(const int commands[], size_t n) {", "    (void) n;", "    int count = 0;", "    size_t i = 0;", "    int command = commands[i];", "    while (command != 0) {", "        if (command == 1) count++;", "        else if (command == 2 && count > 0) count--;", "        else if (command == 3) count = 0;", "        i++;", "        command = commands[i];", "    }", "    return count;", "}"],
        cpp: ["#include <vector>", "", "int run_counter(const std::vector<int>& commands) {", "    int count = 0;", "    size_t i = 0;", "    int command = commands[i];", "    while (command != 0) {", "        if (command == 1) count++;", "        else if (command == 2 && count > 0) count--;", "        else if (command == 3) count = 0;", "        i++;", "        command = commands[i];", "    }", "    return count;", "}"]
      }
    },

    compare: {
      intro: "Three input loops with the same read–test–read shape.",
      rows: [
        { id: "C5", name: "Menu loop", question: "1) deposit 2) withdraw 0) quit", shape: "while not quit: dispatch on the choice, read the next", result: "state after quitting", self: true },
        { id: "C2", name: "Read until a stop value", question: "Add numbers until -1", shape: "while not the stop value: process, read next", result: "a total" },
        { id: "B5", name: "Lookup table", question: "What does choice 2 mean?", shape: "a table from option to action", result: "one action" }
      ],
      table: { head: ["Plan", "Each value read is", "Ends on", "Inside the loop"], rows: [["Menu loop", "a command", "the quit option", "one branch per option"], ["Read until a stop value", "data", "the stop value", "the same processing every time"], ["Lookup table", "a key", "—", "no loop"]], selfRow: 0 }
    },

    related: {
      buildsOn: [{ id: "C2", why: "read, test for the stop value, read again" }, { id: "B3", why: "one branch per menu option" }],
      leadsTo: [{ id: "G1", why: "move each action into its own function" }, { id: "B5", why: "map options to actions with a table" }]
    }
  };
})();
