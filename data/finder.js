/* The plan finder's decision tree (spec R7), adapted from the course's
   "Which scheme do I need?" decision table.
   Each node is a question; each option leads to another node (`next`) or to a
   plan (`result`, with `why`). If the result isn't live yet, `alt` names a live
   plan to read meanwhile. tools/check_finder.js checks that every path ends at
   a real plan within 4 questions and that every live plan can be reached. */
window.FINDER = {
  start: "root",
  nodes: {
    root: {
      q: "What does the problem ask you to do?",
      options: [
        { label: "Calculate a value with a formula", hint: "speed from distance and time, a price with tax…", next: "formula" },
        { label: "Choose between outcomes", hint: "pass or fail, which grade, which price…", next: "choice" },
        { label: "Repeat something", hint: "n times, until the user types -1, until valid…", next: "repeat" },
        { label: "Go through a list of items", hint: "scores, prices, readings, numbers…", next: "list" },
        { label: "Work with text", hint: "an email, a file name, a sentence…", next: "text" },
        { label: "Print a 2D pattern, or compare pairs", hint: "a triangle of stars, a table, every pair…", next: "twoD" },
        { label: "I'm not sure", hint: "start from what the answer should look like", next: "shape" }
      ]
    },

    shape: {
      q: "What should the answer look like?",
      options: [
        { label: "Yes or no", hint: "true / false", next: "yesno" },
        { label: "A count", hint: "how many …", next: "howmany" },
        { label: "One number", hint: "a total, an average, a speed…", next: "oneNumber" },
        { label: "A position", hint: "where something is", next: "where" },
        { label: "A new list", hint: "some or all of the items, possibly changed", next: "newList" },
        { label: "New or shorter text", hint: "a cleaned-up or transformed string", next: "text" },
        { label: "Lines printed in rows", hint: "a pattern or a table", result: "E1", why: "Two-dimensional output means an outer loop for the rows and an inner loop for the columns." }
      ]
    },

    oneNumber: {
      q: "Where does the number come from?",
      options: [
        { label: "From a few input values", hint: "no list involved", next: "formula" },
        { label: "From all the items of a list", hint: "a total, an average, the largest…", next: "summary" }
      ]
    },

    formula: {
      q: "Could some input make the formula fail or meaningless?",
      options: [
        { label: "Yes", hint: "zero, a negative number, an empty list…", result: "B1", why: "Handle those inputs first with a guard, then do the calculation (A1) for the inputs that are left." },
        { label: "No: just compute it", hint: "convert units if needed, then apply the formula", result: "A1", why: "Name the inputs, convert units, apply the formula, return the result." },
        { label: "Split an amount into units", hint: "seconds into hours, minutes and seconds", result: "A3", alt: "A1", why: "Integer division gives the big units, the remainder gives what's left over." },
        { label: "Exchange two values", hint: "swap a and b", result: "A2", alt: "A1", why: "Use a temporary variable so neither value is lost." },
        { label: "Work with the digits of a number", hint: "sum of the digits, how many digits", result: "D16", why: "% 10 gives the last digit and integer division by 10 drops it; repeat until nothing is left." }
      ]
    },

    choice: {
      q: "What decides the outcome?",
      options: [
        { label: "One condition, two outcomes", hint: "free shipping or not", result: "B2", why: "One yes/no question picks one of exactly two outcomes." },
        { label: "Ranges of one value, three or more outcomes", hint: "a score becomes A, B, C or D", result: "B3", why: "Test the ranges from one end; the first true test decides." },
        { label: "Two separate facts together", hint: "a member and over 4 kg", result: "B4", alt: "B2", why: "Combine the two conditions with and / or, or nest one if inside another." },
        { label: "Many exact values", hint: "the price for size “S”, “M” or “L”", result: "B5", alt: "B3", why: "A dictionary or map from each value to its outcome replaces a long if chain." },
        { label: "Whether the input is usable at all", hint: "reject 0 or negative input", result: "B1", why: "A guard handles the bad input first and returns early." },
        { label: "The same yes/no test, in several places", hint: "“is it a prime?” used again and again", result: "G1", alt: "B2", why: "Put the test in its own function that returns true or false, and reuse it." }
      ]
    },

    repeat: {
      q: "Do you know how many times before the loop starts?",
      options: [
        { label: "Yes", hint: "n times, every year for 10 years", result: "C1", why: "A counted loop runs exactly n times." },
        { label: "No: stop when a special value is read", hint: "until the user types -1", result: "C2", why: "Read first, then: while it isn't the stop value, process it and read the next." },
        { label: "No: ask again until the input is valid", hint: "a number between 1 and 10", result: "C3", alt: "C2", why: "Read, and while the input is invalid, explain and read again." },
        { label: "No: stop when a goal is reached", hint: "how many years until the savings double?", result: "C4", alt: "C1", why: "Loop while the goal isn't reached yet, counting the rounds." },
        { label: "Show a menu until the user quits", hint: "1) add  2) list  0) quit", result: "C5", alt: "C2", why: "Show the menu, act on the choice, and loop until the quit option." },
        { label: "Try candidates until one works", hint: "the smallest number that…", result: "G2", alt: "D6", why: "Generate candidates in order and test each one; stop at the first that passes." },
        { label: "Solve a smaller version of the same problem", hint: "n! = n × (n − 1)!, folders inside folders", result: "G3", alt: "D2", why: "A base case answers the smallest input; every other case calls itself on something smaller and builds on the answer." }
      ]
    },

    list: {
      q: "What should the answer be?",
      options: [
        { label: "Yes or no", hint: "is there any…? are all…?", next: "yesno" },
        { label: "A count", hint: "how many…", next: "howmany" },
        { label: "One number that sums up the items", hint: "total, average, largest…", next: "summary" },
        { label: "Where an item is", hint: "its position", next: "where" },
        { label: "A new list", hint: "some items, or every item changed", next: "newList" },
        { label: "Something about neighbours", hint: "each item compared with the one before", next: "neighbours" }
      ]
    },

    yesno: {
      q: "When is the answer yes?",
      options: [
        { label: "If at least one item matches", hint: "is there any negative number?", result: "D7", why: "Stop with yes at the first match; answer no only after checking everything." },
        { label: "If every item matches", hint: "are all scores between 0 and 100?", result: "D8", why: "Stop with no at the first item that fails; answer yes only if none failed." },
        { label: "A single value passes a check", hint: "is this number a prime?", result: "G1", alt: "D8", why: "A yes/no function wraps the test so you can reuse it." }
      ]
    },

    howmany: {
      q: "Count what?",
      options: [
        { label: "Items that pass a test", hint: "how many scores are at least 50?", result: "D1", why: "Start a counter at 0 and add one for every item that passes." },
        { label: "Items in each category", hint: "how many A, B, C and D grades?", result: "D14", alt: "D1", why: "Keep one counter per category." },
        { label: "How often each value appears", hint: "how many times does each word occur?", result: "D15", alt: "D1", why: "A dictionary maps each value to its count." },
        { label: "Values before a stop value", hint: "numbers typed until -1", result: "C2", why: "Read until the stop value, counting as you go." }
      ]
    },

    summary: {
      q: "Which summary?",
      options: [
        { label: "Total (or product)", hint: "add them all up", result: "D2", why: "Start from 0 (or 1 for a product) and fold every item into the running total." },
        { label: "Average", hint: "the mean", result: "D3", why: "Total and count in one loop, guarded against an empty list, then divide." },
        { label: "Largest or smallest value", hint: "the highest temperature", result: "D4", why: "Start with the first item as the best so far and let every item challenge it." },
        { label: "Position of the largest", hint: "which day was the hottest?", result: "D5", alt: "D4", why: "Like largest, but remember the index of the best so far." },
        { label: "Longest streak", hint: "most days in a row above 30 °C", result: "D13", alt: "D1", why: "Track the current run and the longest run so far." }
      ]
    },

    where: {
      q: "Are the items sorted?",
      options: [
        { label: "No, or I don't know", hint: "walk through them in order", result: "D6", why: "Visit each position and return the first match, or -1." },
        { label: "Yes", hint: "smallest to largest", result: "F2", alt: "D6", why: "Binary search halves the range each step, so it needs very few comparisons." }
      ]
    },

    newList: {
      q: "Which items go into the new list?",
      options: [
        { label: "Only the ones that pass a test", hint: "the passing scores", result: "D9", why: "Start with an empty list and add every item that passes." },
        { label: "All of them, each one changed", hint: "add 5 bonus points to every score", result: "D10", alt: "D9", why: "Add a transformed copy of every item to a new list." },
        { label: "All of them, without duplicates", hint: "each name once", result: "F4", alt: "D9", why: "Remember what you've seen, and only add items you haven't seen yet." },
        { label: "All of them, sorted", hint: "smallest first", result: "F3", alt: "D4", why: "Repeatedly find the smallest remaining item and move it to the front." }
      ]
    },

    neighbours: {
      q: "What about neighbouring items?",
      options: [
        { label: "Compare each item with the previous one", hint: "did the price go up?", result: "D12", alt: "D4", why: "Keep the previous item in a variable as you walk the list." },
        { label: "The longest run of items in a row", hint: "the longest winning streak", result: "D13", alt: "D1", why: "Track the current streak and the longest streak so far." }
      ]
    },

    text: {
      q: "What do you need from the text?",
      options: [
        { label: "One piece of it", hint: "the domain of an email, the extension of a file", result: "A4", why: "Tidy it, find the marker, check it's there, slice out the part you need." },
        { label: "New text, built character by character", hint: "hide the digits, remove the spaces", result: "D11", why: "Walk the characters and add a piece to the end of a new string for each." },
        { label: "How many characters pass a test", hint: "how many vowels?", result: "D1", why: "A string is a list of characters: count the ones that pass, starting from 0." },
        { label: "Whether any character passes a test", hint: "is there a digit in the password?", result: "D7", why: "Walk the characters and stop with yes at the first one that matches." },
        { label: "Compare it from both ends", hint: "is it a palindrome?", result: "F1", alt: "D11", why: "Two positions move inward from the ends, comparing as they go." }
      ]
    },

    twoD: {
      q: "Which of these is it?",
      options: [
        { label: "Print rows and columns", hint: "a triangle of stars, a multiplication table", result: "E1", why: "An outer loop for the rows and an inner loop for the columns of each row." },
        { label: "Check every pair of items", hint: "do any two numbers add up to 10?", result: "E2", alt: "E1", why: "The inner loop starts just after the outer index, so each pair is visited once." },
        { label: "Data stored as a grid", hint: "a table of marks per student per subject", result: "E3", alt: "E1", why: "For each row of the table, walk each cell, using any single-pass plan." }
      ]
    }
  }
};
