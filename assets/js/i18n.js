/* buatkode · Programming Plans — interface text in English and Bahasa Indonesia.

   The page language comes from <html lang="…">. Indonesian pages also load
   translation overlays (data/id/…), which hold only the text of a plan, the
   catalogue or the finder; this file layers them over the English data, so
   code, tests and trace logic are shared by both editions.

   Load order on a page: data files → their overlays → i18n.js → page script. */
(function () {
  "use strict";

  const LANG = (document.documentElement.lang || "en").slice(0, 2) === "id" ? "id" : "en";

  const S = {
    en: {
      siteName: "Programming Plans", plans: "Plans", planWord: "plan",
      aka: "Also known as", corePlan: "Core plan", level: "Level", group: "Group",
      "lvl.Foundations": "Foundations", "lvl.Core": "Core", "lvl.Advanced": "Advanced",
      copy: "Copy", copied: "Copied",
      analogy: "Everyday analogy", when: "When to use it", clueWords: "Clue words in the problem", problemsUsing: "Problems that use this plan",
      noItems: "[ ]  (no items to visit)", empty: "empty", noCalls: "no calls yet", returns: "returns", output: "Output",
      rFalse: "false", rTrue: "true ✓", rSkipped: "not tested", rTesting: "testing…",
      watch: "Watch it run", chooseInput: "Choose an input", backToStart: "Back to the start",
      reset: "⏮ Reset", back: "◀ Back", step: "Step ▶", play: "▶ Play", pause: "⏸ Pause", replay: "↻ Replay",
      ownList: "Your own list of numbers", listPlaceholder: "your list: 5, 2, -7", use: "Use", stepOf: "step {a} of {b}",
      "role.walker": "walker", "role.stepper": "stepper", "role.result": "result", "role.count": "count", "role.fixed": "fixed",
      "role.best": "best", "role.gatherer": "gatherer", "role.flag": "flag", "role.temp": "temp",
      "roleHelp.walker": "Walker: holds each item of a collection in turn",
      "roleHelp.stepper": "Stepper: counts through a known sequence of values (1, 2, 3, …)",
      "roleHelp.result": "The answer the function gives back",
      "roleHelp.count": "Counter: goes up by one each time something happens",
      "roleHelp.fixed": "Fixed value: set once and never changed",
      "roleHelp.best": "Best so far: the most suitable value seen up to now",
      "roleHelp.gatherer": "Gatherer: collects the items (or total) seen so far",
      "roleHelp.flag": "One-way flag: once it changes, it never changes back",
      "roleHelp.temp": "Temporary: holds a value for a short while",
      stepsTitle: "The plan, step by step", stepsSub: "The steps are the same in every language. Hover a step to find it in the code, or a line to find its step.",
      sameTitle: "Same plan, {n} languages",
      sameSub: "Tick the languages you want to compare. Hover any line: the matching step lights up in every listing. Switch <b>Style</b> in the toolbar to compare the plain version with each language's built-in shortcut.",
      langsToShow: "Languages to show", all: "All",
      pitfalls: "Pitfalls", pitfallsSub: "The mistakes people make most often with this plan, and what to do instead.",
      do: "✓ Do", dont: "✗ Don't", buggy: "buggy",
      tryIt: "Try it", tryItSub: "Predict first, then check. Then write the plan yourself in your own editor.",
      questionOf: "QUESTION {a} OF {b}", right: "Right.", notQuite: "Not quite.",
      planToFollow: "The plan to follow", testCases: "Test your code with these cases",
      testNote: "Write it in your own editor or an online playground, run each case, and compare. Any language works.",
      solution: "Solution", solutionNote: "Try it first. The solution follows the same steps as the plan.",
      showSolution: "Show solution", hideSolution: "Hide solution",
      call: "Call", prints: "Prints", returnsCol: "Returns", nothing: "nothing",
      checksOf: "checks {a} of {b} items",
      confuse: "Don't confuse it with…", fits: "Where it fits", buildsOn: "Builds on", leadsTo: "Leads to",
      open: "Open →", soon: "Coming soon", startingPoint: "Nothing: this is a starting point.",
      plain: "Plain", idiomatic: "Idiomatic",
      num: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
      // home page
      question: "Question {n}", yourPlan: "Your plan", why: "Why:", openCard: "Open the {id} card →", meanwhile: "Meanwhile, read {id} · {title} →",
      startOver: "Start over", answersSoFar: "Your answers so far", changeAnswer: "Change this answer",
      filterLevel: "Filter by level", filterGroup: "Filter by group", levelLabel: "Level", groupLabel: "Group", liveOnly: "Only show plans that are live",
      plansCount: "{n} plans", liveCount: "{n} live", noMatch: "No plans match these filters.", clearFilters: "Clear the filters",
      heroStats: "<b>{live}</b> plans live · <b>{all}</b> in the catalogue · code in <b>Python, Java, Rust, C and C++</b>",
      heroCardTitle: "plans <b>you'll meet</b>", heroCard1: "count, total, average", heroCard2: "find, any?, all?", heroCard3: "filter, build, classify", heroCardFoot: "↻ in 5 languages"
    },
    id: {
      siteName: "Skema Pemrograman", plans: "Skema", planWord: "skema",
      aka: "Dikenal juga sebagai", corePlan: "Skema inti", level: "Tingkat", group: "Kelompok",
      "lvl.Foundations": "Dasar", "lvl.Core": "Menengah", "lvl.Advanced": "Lanjut",
      copy: "Salin", copied: "Tersalin",
      analogy: "Analogi sehari-hari", when: "Kapan dipakai", clueWords: "Kata petunjuk dalam soal", problemsUsing: "Soal yang memakai skema ini",
      noItems: "[ ]  (tidak ada item)", empty: "kosong", noCalls: "belum ada pemanggilan", returns: "mengembalikan", output: "Keluaran",
      rFalse: "salah", rTrue: "benar ✓", rSkipped: "tidak diuji", rTesting: "diuji…",
      watch: "Lihat cara kerjanya", chooseInput: "Pilih masukan", backToStart: "Kembali ke awal",
      reset: "⏮ Ulang", back: "◀ Mundur", step: "Langkah ▶", play: "▶ Putar", pause: "⏸ Jeda", replay: "↻ Putar lagi",
      ownList: "Daftar angka Anda sendiri", listPlaceholder: "daftar Anda: 5, 2, -7", use: "Pakai", stepOf: "langkah {a} dari {b}",
      "role.walker": "penjelajah", "role.stepper": "pelangkah", "role.result": "hasil", "role.count": "penghitung", "role.fixed": "nilai tetap",
      "role.best": "terbaik", "role.gatherer": "pengumpul", "role.flag": "bendera", "role.temp": "sementara",
      "roleHelp.walker": "Penjelajah: memegang setiap item koleksi secara bergantian",
      "roleHelp.stepper": "Pelangkah: menghitung melalui urutan nilai yang sudah diketahui (1, 2, 3, …)",
      "roleHelp.result": "Jawaban yang dikembalikan fungsi",
      "roleHelp.count": "Penghitung: bertambah satu setiap kali sesuatu terjadi",
      "roleHelp.fixed": "Nilai tetap: diisi sekali dan tidak pernah berubah",
      "roleHelp.best": "Terbaik sejauh ini: nilai paling cocok yang sudah ditemui",
      "roleHelp.gatherer": "Pengumpul: mengumpulkan item (atau total) yang sudah ditemui",
      "roleHelp.flag": "Bendera satu arah: sekali berubah, tidak pernah kembali",
      "roleHelp.temp": "Sementara: menyimpan nilai untuk sesaat",
      stepsTitle: "Skema, langkah demi langkah", stepsSub: "Langkahnya sama di semua bahasa. Arahkan kursor ke sebuah langkah untuk menemukannya di kode, atau ke sebuah baris untuk menemukan langkahnya.",
      sameTitle: "Skema yang sama, {n} bahasa",
      sameSub: "Centang bahasa yang ingin Anda bandingkan. Arahkan kursor ke baris mana saja: langkah yang sama menyala di setiap kode. Ganti <b>Gaya</b> di bilah atas untuk membandingkan versi dasar dengan jalan pintas bawaan tiap bahasa.",
      langsToShow: "Bahasa yang ditampilkan", all: "Semua",
      pitfalls: "Jebakan", pitfallsSub: "Kesalahan yang paling sering terjadi dengan skema ini, dan apa yang sebaiknya dilakukan.",
      do: "✓ Lakukan", dont: "✗ Jangan", buggy: "salah",
      tryIt: "Coba sendiri", tryItSub: "Tebak dulu, lalu periksa. Kemudian tulis skemanya sendiri di editor Anda.",
      questionOf: "SOAL {a} DARI {b}", right: "Benar.", notQuite: "Belum tepat.",
      planToFollow: "Skema yang diikuti", testCases: "Uji kode Anda dengan kasus berikut",
      testNote: "Tulis di editor Anda sendiri atau di playground daring, jalankan setiap kasus, lalu bandingkan. Bahasa apa pun boleh.",
      solution: "Solusi", solutionNote: "Coba dulu. Solusinya mengikuti langkah yang sama dengan skema.",
      showSolution: "Tampilkan solusi", hideSolution: "Sembunyikan solusi",
      call: "Pemanggilan", prints: "Mencetak", returnsCol: "Mengembalikan", nothing: "tidak ada",
      checksOf: "memeriksa {a} dari {b} item",
      confuse: "Jangan tertukar dengan…", fits: "Posisinya", buildsOn: "Dibangun di atas", leadsTo: "Mengarah ke",
      open: "Buka →", soon: "Segera hadir", startingPoint: "Tidak ada: ini titik awal.",
      plain: "Dasar", idiomatic: "Idiomatis",
      num: ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh"],
      question: "Pertanyaan {n}", yourPlan: "Skema Anda", why: "Alasannya:", openCard: "Buka kartu {id} →", meanwhile: "Sementara itu, baca {id} · {title} →",
      startOver: "Mulai lagi", answersSoFar: "Jawaban Anda sejauh ini", changeAnswer: "Ubah jawaban ini",
      filterLevel: "Saring menurut tingkat", filterGroup: "Saring menurut kelompok", levelLabel: "Tingkat", groupLabel: "Kelompok", liveOnly: "Tampilkan hanya skema yang sudah tersedia",
      plansCount: "{n} skema", liveCount: "{n} tersedia", noMatch: "Tidak ada skema yang cocok dengan saringan ini.", clearFilters: "Hapus saringan",
      heroStats: "<b>{live}</b> skema tersedia · <b>{all}</b> dalam katalog · kode dalam <b>Python, Java, Rust, C dan C++</b>",
      heroCardTitle: "skema <b>yang akan Anda temui</b>", heroCard1: "hitung, total, rata-rata", heroCard2: "cari, adakah?, semuakah?", heroCard3: "saring, bangun, klasifikasi", heroCardFoot: "↻ dalam 5 bahasa"
    }
  };

  function t(key, vars) {
    const v = S[LANG][key] !== undefined ? S[LANG][key] : S.en[key];
    if (typeof v !== "string") return v;
    return vars ? v.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m)) : v;
  }

  /* Layer a translation over the English data. Objects merge key by key;
     arrays of objects merge item by item (so a translated step keeps its number,
     a translated preset keeps its input); any other value is replaced. */
  function overlay(base, extra) {
    if (extra === undefined) return base;
    if (Array.isArray(base) && Array.isArray(extra) && base.every(isObj) && extra.every(isObj)) {
      return base.map((b, i) => overlay(b, extra[i]));
    }
    if (isObj(base) && isObj(extra)) {
      const out = Object.assign({}, base);
      Object.keys(extra).forEach((k) => { out[k] = overlay(base[k], extra[k]); });
      return out;
    }
    return extra;
  }
  function isObj(x) { return x !== null && typeof x === "object" && !Array.isArray(x); }

  if (LANG === "id") {
    if (window.PLAN && window.PLAN_ID) window.PLAN = overlay(window.PLAN, window.PLAN_ID);
    if (window.CATALOG && window.CATALOG_ID) window.CATALOG = overlay(window.CATALOG, window.CATALOG_ID);
    if (window.FINDER_ID) window.FINDER = window.FINDER_ID;
  }

  window.I18N = { lang: LANG, t, overlay, strings: S };
})();
