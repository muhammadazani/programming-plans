/* Plan data: A1 · Input → process → output
   Code lines are [steps, text]; see is-there-any.js for the conventions. */

(function () {
  // Format numbers the way Python prints floats: 15.0, 0.1, 14.065
  const f = (x) => (Number.isInteger(x) ? x.toFixed(1) : String(+x.toFixed(6)));

  window.PLAN = {
    id: "A1",
    slug: "input-process-output",
    title: "Input → process → output",
    highlight: "output",
    aka: ["IPO", "formula plan", "straight-line computation"],
    group: "A",
    level: "Foundations",
    core: true,
    fn: { python: "speed_kmh", java: "speedKmh", rust: "speed_kmh", c: "speed_kmh", cpp: "speed_kmh" },

    hero: {
      type: "pipeline",
      inputs: ["1500 m", "6 min"],
      output: "15.0",
      tag: "km / hours",
      alt: "Two small input cubes, 1500 m and 6 min, flow into a blue process cube, which produces an amber output cube, 15.0"
    },
    planCard: { name: "i → p → o", lines: ["name the inputs", "convert units", "apply the formula"], foot: "→ return the result" },

    intent:
      "Turn inputs into a result with a fixed formula: name what you're given, convert it to the units the formula needs, compute, and return the answer.",

    analogy: {
      icon: "🍰",
      title: "Baking from a foreign recipe",
      text:
        "A recipe from abroad asks for 8 oz of flour and an oven at 350 °F. Before you can bake, you convert to grams and °C, then follow the steps, then serve the cake. Convert first, then compute, then hand over the result."
    },

    cues: ["calculate …", "convert …", "how fast / how much …", "given … find …", "per hour / per km", "formula"],
    cueSummary: "There is a <b>formula</b>, no repetition and no choice between cases. Often the inputs arrive in the wrong units.",
    cueExamples: [
      "Given a distance in metres and a time in minutes, find the speed in km/h.",
      "Convert a temperature from Fahrenheit to Celsius.",
      "Compute the price of n items including 11% tax."
    ],

    steps: [
      { n: 1, title: "Name the inputs and the output", text: "Decide what you're given (metres, minutes) and what you must give back (km/h). The function header says exactly this." },
      { n: 2, title: "Convert to the units the formula needs", text: "Metres to kilometres, minutes to hours. Give each converted value its own name." },
      { n: 3, title: "Apply the formula", text: "speed = distance ÷ time, using the converted values." },
      { n: 4, title: "Return the result", text: "Hand the answer back to the caller. Printing it is the caller's job." }
    ],

    impl: {
      python: {
        file: "speed.py",
        plain: {
          lines: [
            [1, "def speed_kmh(distance_m, minutes):"],
            [2, "    km = distance_m / 1000"],
            [2, "    hours = minutes / 60"],
            [3, "    speed = km / hours"],
            [4, "    return speed"]
          ],
          note: "In Python 3, <code>/</code> always gives a float, even for two whole numbers."
        },
        idiomatic: {
          lines: [
            [1, "def speed_kmh(distance_m, minutes):"],
            [[2, 3, 4], "    return (distance_m / 1000) / (minutes / 60)"]
          ],
          note: "One expression is shorter, but the named version shows each unit conversion. Prefer names while learning."
        }
      },
      java: {
        file: "Plans.java",
        plain: {
          lines: [
            [1, "static double speedKmh(int distanceM, int minutes) {"],
            [2, "    double km = distanceM / 1000.0;"],
            [2, "    double hours = minutes / 60.0;"],
            [3, "    double speed = km / hours;"],
            [4, "    return speed;"],
            [0, "}"]
          ],
          note: "<code>1000.0</code>, not <code>1000</code>: dividing two <code>int</code>s in Java throws the fraction away."
        },
        idiomatic: {
          lines: [
            [1, "static double speedKmh(int distanceM, int minutes) {"],
            [[2, 3, 4], "    return (distanceM / 1000.0) / (minutes / 60.0);"],
            [0, "}"]
          ],
          note: "Same formula in one expression."
        }
      },
      rust: {
        file: "plans.rs",
        plain: {
          lines: [
            [1, "fn speed_kmh(distance_m: i32, minutes: i32) -> f64 {"],
            [2, "    let km = distance_m as f64 / 1000.0;"],
            [2, "    let hours = minutes as f64 / 60.0;"],
            [3, "    let speed = km / hours;"],
            [4, "    speed"],
            [0, "}"]
          ],
          note: "Rust never mixes integers and floats silently. <code>as f64</code> converts on purpose, so integer division can't sneak in."
        },
        idiomatic: {
          lines: [
            [1, "fn speed_kmh(distance_m: i32, minutes: i32) -> f64 {"],
            [[2, 3, 4], "    (distance_m as f64 / 1000.0) / (minutes as f64 / 60.0)"],
            [0, "}"]
          ],
          note: "Same formula in one expression. The last expression is the return value."
        }
      },
      c: {
        file: "plans.c",
        plain: {
          lines: [
            [1, "double speed_kmh(int distance_m, int minutes) {"],
            [2, "    double km = distance_m / 1000.0;"],
            [2, "    double hours = minutes / 60.0;"],
            [3, "    double speed = km / hours;"],
            [4, "    return speed;"],
            [0, "}"]
          ],
          note: "<code>1000.0</code>, not <code>1000</code>: <code>int / int</code> in C throws the fraction away."
        },
        idiomatic: {
          lines: [
            [1, "double speed_kmh(int distance_m, int minutes) {"],
            [[2, 3, 4], "    return (distance_m / 1000.0) / (minutes / 60.0);"],
            [0, "}"]
          ],
          note: "Same formula in one expression."
        }
      },
      cpp: {
        file: "plans.cpp",
        plain: {
          lines: [
            [1, "double speed_kmh(int distance_m, int minutes) {"],
            [2, "    double km = distance_m / 1000.0;"],
            [2, "    double hours = minutes / 60.0;"],
            [3, "    double speed = km / hours;"],
            [4, "    return speed;"],
            [0, "}"]
          ],
          note: "Same rule as C: make one side of the division a <code>double</code>."
        },
        idiomatic: {
          lines: [
            [1, "double speed_kmh(int distance_m, int minutes) {"],
            [[2, 3, 4], "    return (distance_m / 1000.0) / (minutes / 60.0);"],
            [0, "}"]
          ],
          note: "Same formula in one expression."
        }
      }
    },

    trace: {
      type: "pipeline",
      intro: "Running example: <b>Given a distance in metres and a time in minutes, how fast was the run in km/h?</b>",
      input: {
        kind: "fields",
        fields: [
          { name: "distance_m", label: "distance_m", min: 0, max: 100000 },
          { name: "minutes", label: "minutes", min: 0, max: 1440 }
        ]
      },
      presets: [
        { label: "1.5 km in 6 min", input: { distance_m: 1500, minutes: 6 } },
        { label: "5 km in 30 min", input: { distance_m: 5000, minutes: 30 } },
        { label: "Marathon in 3 h", input: { distance_m: 42195, minutes: 180 } },
        { label: "Zero minutes", input: { distance_m: 1000, minutes: 0 } }
      ],
      run({ distance_m: d, minutes: m }) {
        const ev = [];
        const v = { distance_m: undefined, minutes: undefined, km: undefined, hours: undefined, speed: undefined, ret: undefined };
        const push = (step, msg, active, fresh = [], extra = {}) => {
          const st = (name, stepNo, vars, cls) => ({
            label: name, step: stepNo,
            state: extra.error === stepNo ? "error" : active === stepNo ? "active" : (extra.done || []).includes(stepNo) ? "done" : "",
            vars: vars.map((k) => ({
              k: k === "ret" ? "return" : k,
              v: ["km", "hours", "speed"].includes(k) && typeof v[k] === "number" ? f(v[k]) : v[k],
              fresh: fresh.includes(k)
            })),
            cls
          });
          const stages = [
            st("Inputs", 1, ["distance_m", "minutes"]),
            st("Convert", 2, ["km", "hours"]),
            st("Compute", 3, ["speed"]),
            st("Output", 4, ["ret"])
          ];
          if (extra.result) stages[3].state = "result";
          ev.push({ step, msg, tone: extra.tone || "", view: { stages }, vars: [] });
        };
        push(null, "Ready. Nothing has been computed yet.", 0);
        v.distance_m = d; v.minutes = m;
        push(1, `The inputs arrive: distance_m = ${d} metres, minutes = ${m}. The output will be a speed in km/h.`, 1, ["distance_m", "minutes"]);
        v.km = d / 1000;
        push(2, `Convert metres to kilometres: ${d} / 1000 = ${f(v.km)}`, 2, ["km"], { done: [1] });
        v.hours = m / 60;
        push(2, `Convert minutes to hours: ${m} / 60 = ${f(v.hours)}`, 2, ["hours"], { done: [1] });
        if (m === 0) {
          v.speed = "÷ 0!";
          push(3, "Division by zero: hours is 0. Python raises ZeroDivisionError; Java, C, C++ and Rust give infinity. A Guard (plan B1) should reject this input before the formula runs.", 3, ["speed"], { done: [1, 2], error: 3, tone: "no" });
          return ev;
        }
        v.speed = v.km / v.hours;
        push(3, `Apply the formula: speed = km / hours = ${f(v.km)} / ${f(v.hours)} = ${f(v.speed)}`, 3, ["speed"], { done: [1, 2] });
        v.ret = f(v.speed);
        push(4, `Return ${f(v.speed)} km/h to the caller.`, 4, ["ret"], { done: [1, 2, 3], result: true, tone: "yes" });
        return ev;
      }
    },

    checks: {
      params: ["int", "int"],
      returns: "double",
      cases: [
        { args: [1500, 6], expect: 15.0 },
        { args: [5000, 30], expect: 10.0 },
        { args: [42195, 180], expect: 14.065 },
        { args: [6000, 60], expect: 6.0 }
      ],
      snippets: {
        bugIntDiv: [{ args: [1500, 6], expect: 10.0 }],
        bugConvert: [{ args: [1500, 6], expect: 0.004166666666666667 }]
      }
    },

    pitfalls: [
      {
        kind: "dont",
        title: "Integer division",
        text: "In Java, C and C++, <code>1500 / 1000</code> is <code>1</code>, not <code>1.5</code>: dividing two integers drops the fraction. Python's <code>//</code> and Rust's integer <code>/</code> do the same.",
        code: "bugIntDiv",
        take: "Make one side a floating-point number (1000.0), or convert before dividing.",
        wide: true
      },
      {
        kind: "dont",
        title: "Converting the wrong way",
        text: "<code>minutes * 60</code> gives seconds, not hours. The code runs, and the answer is just wrong.",
        take: "Sanity-check each conversion: 60 minutes must become 1 hour."
      },
      {
        kind: "dont",
        title: "Dividing by an input that can be zero",
        text: "With <code>minutes = 0</code>, Python crashes and the other languages return infinity. Try the <b>Zero minutes</b> preset in the trace above.",
        take: "Check the input first. That's plan B1, Guard."
      },
      {
        kind: "do",
        title: "Name the in-between values",
        text: "<code>km</code> and <code>hours</code> make each unit visible, so a wrong conversion is easy to spot when you read the code."
      },
      {
        kind: "do",
        title: "Test with numbers you can do in your head",
        text: "6 km in 60 minutes must be 6 km/h. If your function disagrees, the bug is in a conversion."
      }
    ],

    snippets: {
      bugIntDiv: {
        python: [
          "def speed_kmh(distance_m, minutes):",
          "    km = distance_m // 1000      # ✗ floor division drops the .5",
          "    hours = minutes / 60",
          "    speed = km / hours",
          "    return speed"
        ],
        java: [
          "static double speedKmh(int distanceM, int minutes) {",
          "    double km = distanceM / 1000;    // ✗ int / int drops the .5",
          "    double hours = minutes / 60.0;",
          "    double speed = km / hours;",
          "    return speed;",
          "}"
        ],
        rust: [
          "fn speed_kmh(distance_m: i32, minutes: i32) -> f64 {",
          "    let km = (distance_m / 1000) as f64; // ✗ divides before converting",
          "    let hours = minutes as f64 / 60.0;",
          "    let speed = km / hours;",
          "    speed",
          "}"
        ],
        c: [
          "double speed_kmh(int distance_m, int minutes) {",
          "    double km = distance_m / 1000;   // ✗ int / int drops the .5",
          "    double hours = minutes / 60.0;",
          "    double speed = km / hours;",
          "    return speed;",
          "}"
        ],
        cpp: [
          "double speed_kmh(int distance_m, int minutes) {",
          "    double km = distance_m / 1000;   // ✗ int / int drops the .5",
          "    double hours = minutes / 60.0;",
          "    double speed = km / hours;",
          "    return speed;",
          "}"
        ]
      },
      bugConvert: {
        python: [
          "def speed_kmh(distance_m, minutes):",
          "    km = distance_m / 1000",
          "    hours = minutes * 60",
          "    speed = km / hours",
          "    return speed"
        ],
        java: [
          "static double speedKmh(int distanceM, int minutes) {",
          "    double km = distanceM / 1000.0;",
          "    double hours = minutes * 60.0;",
          "    double speed = km / hours;",
          "    return speed;",
          "}"
        ],
        rust: [
          "fn speed_kmh(distance_m: i32, minutes: i32) -> f64 {",
          "    let km = distance_m as f64 / 1000.0;",
          "    let hours = minutes as f64 * 60.0;",
          "    let speed = km / hours;",
          "    speed",
          "}"
        ],
        c: [
          "double speed_kmh(int distance_m, int minutes) {",
          "    double km = distance_m / 1000.0;",
          "    double hours = minutes * 60.0;",
          "    double speed = km / hours;",
          "    return speed;",
          "}"
        ],
        cpp: [
          "double speed_kmh(int distance_m, int minutes) {",
          "    double km = distance_m / 1000.0;",
          "    double hours = minutes * 60.0;",
          "    double speed = km / hours;",
          "    return speed;",
          "}"
        ]
      }
    },

    quiz: [
      {
        q: "What does {fn}(3000, 20) return?",
        options: ["9.0", "0.15", "150.0", "60.0"],
        answer: 0,
        explain: "3000 m is 3 km and 20 minutes is 1/3 of an hour. 3 ÷ (1/3) = 9 km/h."
      },
      {
        q: "In Java, C or C++, what is the value of 1500 / 1000?",
        options: ["1.5", "1", "2"],
        answer: 1,
        explain: "Both numbers are integers, so the result is an integer and the .5 is thrown away. Python's / gives 1.5; its // gives 1."
      },
      {
        q: "This version has a bug. Roughly what does it return for (1500, 6)?",
        code: "bugConvert",
        options: ["15.0", "0.004", "900.0"],
        answer: 1,
        explain: "minutes * 60 turns 6 minutes into 360 “hours”, so the speed is 1.5 / 360 ≈ 0.004. Converting minutes to hours means dividing by 60."
      }
    ],

    exercise: {
      title: "Your turn: body mass index",
      task: "Write <code>bmi(weight_kg, height_cm)</code> that returns weight ÷ height², with the height in <b>metres</b>. Follow the four steps of the plan.",
      plan: [
        "Inputs: weight in kg, height in cm. Output: the BMI",
        "Convert the height from cm to metres",
        "Apply the formula: weight / (height * height)",
        "Return the result"
      ],
      fn: { python: "bmi", java: "bmi", rust: "bmi", c: "bmi", cpp: "bmi" },
      params: ["int", "int"],
      returns: "double",
      tests: [
        { args: [70, 175], expect: 22.857142857142858 },
        { args: [50, 160], expect: 19.53125 },
        { args: [90, 180], expect: 27.77777777777778 },
        { args: [100, 200], expect: 25.0 }
      ],
      solutions: {
        python: [
          "def bmi(weight_kg, height_cm):",
          "    height_m = height_cm / 100",
          "    result = weight_kg / (height_m * height_m)",
          "    return result"
        ],
        java: [
          "static double bmi(int weightKg, int heightCm) {",
          "    double heightM = heightCm / 100.0;",
          "    double result = weightKg / (heightM * heightM);",
          "    return result;",
          "}"
        ],
        rust: [
          "fn bmi(weight_kg: i32, height_cm: i32) -> f64 {",
          "    let height_m = height_cm as f64 / 100.0;",
          "    let result = weight_kg as f64 / (height_m * height_m);",
          "    result",
          "}"
        ],
        c: [
          "double bmi(int weight_kg, int height_cm) {",
          "    double height_m = height_cm / 100.0;",
          "    double result = weight_kg / (height_m * height_m);",
          "    return result;",
          "}"
        ],
        cpp: [
          "double bmi(int weight_kg, int height_cm) {",
          "    double height_m = height_cm / 100.0;",
          "    double result = weight_kg / (height_m * height_m);",
          "    return result;",
          "}"
        ]
      }
    },

    compare: {
      intro: "Three plans that all produce a single value. The question is whether you need a loop or a check first.",
      rows: [
        { id: "A1", name: "Input → process → output", question: "Compute one answer from a formula", shape: "inputs → convert → formula → return. No loop, no decision.", result: "one value", self: true },
        { id: "B1", name: "Guard", question: "Reject bad input before the formula", shape: "check the input first and return early if it's invalid", result: "an error value, or the answer" },
        { id: "D2", name: "Accumulate", question: "Combine many items into one total", shape: "a loop adds each item to a running total", result: "one total" }
      ],
      table: {
        head: ["Plan", "Loop?", "Decision?", "Typical question"],
        rows: [
          ["Input → process → output", "no", "no", "How fast was the run?"],
          ["Guard", "no", "yes, up front", "What if the time is 0?"],
          ["Accumulate", "yes", "no", "What's the total of all the runs?"]
        ],
        selfRow: 0
      }
    },

    related: {
      buildsOn: [],
      buildsOnNote: "This is a starting point. It only needs variables and arithmetic.",
      leadsTo: [
        { id: "B1", why: "protect the formula from inputs like 0" },
        { id: "B2", why: "pick between two formulas" },
        { id: "D2", why: "apply a calculation across many items" }
      ]
    }
  };
})();
