/* Bahasa Indonesia overlay for data/plans/predicate-function.js (G1). Text only. */
window.PLAN_ID = {
  title: "Fungsi penguji",
  highlight: "penguji",
  aka: ["fungsi ya/tidak", "fungsi boolean", "fungsi is_… / has_…"],
  hero: { tag: "is_prime(n)?", alt: "Sederet calon pembagi yang diuji oleh sebuah fungsi ya/tidak" },
  planCard: { name: "penguji", lines: ["namai ujinya: is_…(x)", "kasus mudah lebih dulu", "kembalikan true atau false"], foot: "→ pakai ulang di mana saja" },
  intent: "Beri nama pada sebuah uji ya/tidak dengan menaruhnya di fungsinya sendiri yang mengembalikan true atau false, agar bisa dibaca, diuji dan dipakai ulang di skema lain.",
  analogy: { title: "Alat penguji colokan", text: "Seorang teknisi listrik tidak membuat ulang alat penguji tegangan untuk setiap stopkontak: ia punya satu alat dan menempelkannya ke setiap stopkontak bergantian. Fungsi penguji adalah alat itu. Skema menghitung, menyaring atau mencari tinggal “menempelkannya” ke setiap item." },
  cues: ["apakah ia sebuah …?", "periksa apakah …", "valid / diizinkan / memenuhi syarat", "uji yang sama di beberapa tempat", "aturan dengan beberapa bagian"],
  cueSummary: "Dibutuhkan <b>pertanyaan ya/tidak</b> tentang satu nilai, sering di lebih dari satu tempat.",
  cueExamples: ["Apakah sebuah bilangan prima? (Lalu hitung bilangan prima sampai 100.)", "Apakah sebuah tahun adalah tahun kabisat?", "Apakah kata sandinya cukup kuat?"],
  steps: [
    { title: "Namai ujinya", text: "Fungsi bernama is_… atau has_… yang menerima nilai dan mengembalikan true atau false." },
    { title: "Tangani kasus mudah lebih dulu", text: "Di sini: bilangan di bawah 2 bukan prima." },
    { title: "Periksa hal yang menentukan", text: "Di sini: coba setiap calon pembagi d selama d × d ≤ n." },
    { title: "Gagal? Kembalikan false", text: "Ada pembagi berarti n bukan prima; tidak perlu mencari lebih jauh." },
    { title: "Lolos semuanya? Kembalikan true", text: "Tidak ada pembagi yang ditemukan." }
  ],
  impl: {
    python: { plain: { note: "Setelah ujinya punya nama, skema lain terbaca seperti kalimat: “hitung n yang prima”." }, idiomatic: { note: "<code>all()</code> adalah skema Semuakah? (D8): setiap calon pembagi harus gagal membagi n." } },
    c: { idiomaticNote: "Fungsi <code>bool</code> kecil adalah C yang idiomatis; namanyalah yang membuatnya berguna." },
    cpp: { idiomaticNote: "Fungsi <code>bool</code> kecil adalah C++ yang idiomatis, dan bisa dikirim ke algoritme seperti <code>std::ranges::count_if(numbers, is_prime)</code>." }
  },
  trace: {
    intro: "Contoh: <b>Apakah sebuah bilangan prima?</b> Setiap kotak adalah calon pembagi yang dicoba.",
    presets: [{ label: "17" }, { label: "91" }, { label: "1" }],
    run({ n }) {
      const ev = [], tried = [], states = [];
      let answer = "?";
      const snap = (step, msg, cur = -1, tone = "") => ev.push({ step, msg, tone,
        view: { values: tried.slice(), states: states.slice(), ptr: cur, noIdx: true, emptyNote: "belum ada pembagi yang dicoba" },
        vars: [{ k: "n", role: "fixed", v: n }, { k: "d", role: "stepper", v: cur >= 0 ? tried[cur] : "—" }, { k: "is_prime", role: "result", v: answer }] });
      snap(1, `is_prime(${n}): satu uji ya/tidak yang bernama.`);
      if (n < 2) { answer = "false"; snap(2, `${n} < 2, jadi bukan prima. Langsung kembalikan false.`, -1, "no"); return ev; }
      snap(2, `${n} ≥ 2, jadi kasus mudahnya tidak berlaku.`);
      for (let d = 2; d * d <= n; d++) {
        tried.push(d); states.push("current");
        snap(3, `Coba d = ${d} (${d} × ${d} = ${d * d} ≤ ${n}).`, tried.length - 1);
        if (n % d === 0) { states[states.length - 1] = "hit"; answer = "false"; snap(4, `${n} % ${d} = 0: ${d} membagi ${n}, jadi bukan prima. Kembalikan false.`, tried.length - 1, "no"); return ev; }
        states[states.length - 1] = "miss";
        snap(3, `${n} % ${d} = ${n % d}: bukan pembagi.`, tried.length - 1);
      }
      answer = "true";
      snap(5, tried.length ? `Tidak ada d dengan d × d ≤ ${n} yang membaginya. Kembalikan true.` : `Tidak ada d untuk dicoba (2 × 2 > ${n}). Kembalikan true.`, -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Melupakan kasus mudah", text: "Tanpa pemeriksaan <code>n &lt; 2</code>, perulangan tidak pernah berjalan untuk 1 (atau 0, atau bilangan negatif), dan fungsi menyebutnya prima.", take: "Tangani kasus khusus di atas, seperti penjaga (B1)." },
    { title: "Menjawab ya terlalu cepat", text: "Mengembalikan true begitu satu d tidak membagi n (9 % 2 ≠ 0) menjawab sebelum uji yang sebenarnya selesai. 9 bukan prima.", take: "Kembalikan true hanya setelah setiap calon gagal: skema Semuakah? (D8)." },
    { title: "Mencetak alih-alih mengembalikan", text: "Fungsi yang mencetak “prima” tidak bisa dipakai skema lain. Menghitung atau menyaring butuh nilai true / false yang dikembalikan.", take: "Kembalikan jawabannya; biarkan pemanggil memutuskan apa yang dicetak." },
    { title: "Namai seperti pertanyaan", text: "<code>is_prime</code>, <code>has_vowel</code>, <code>is_valid_score</code>: pemanggilannya lalu terbaca seperti aturannya, <code>if is_prime(n)</code>." },
    { title: "Uji fungsinya sendiri", text: "Fungsi ya/tidak yang kecil mudah diperiksa dengan tabel masukan dan jawaban yang diharapkan, sebelum dipakai di dalam skema yang lebih besar." }
  ],
  quiz: [
    { q: "Untuk {fn}(29), berapa d terbesar yang dicoba?", explain: "Perulangan berjalan selama d × d ≤ 29: 5 × 5 = 25 masih boleh, 6 × 6 = 36 terlalu besar. Pembagi di atas 5 pasti berpasangan dengan pembagi di bawah 5." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk 9?", explain: "9 % 2 bukan 0, jadi ia langsung mengembalikan true, sebelum mencoba 3, yang membagi 9." },
    { q: "Mengapa mengembalikan true/false alih-alih mencetak “prima”?", options: ["Agar skema lain bisa memakai jawabannya", "Mencetak lebih lambat", "Fungsi tidak bisa mencetak"], explain: "Menghitung bilangan prima atau menyaring daftar butuh jawabannya sebagai nilai. Kata yang dicetak hanya bisa dibaca manusia." }
  ],
  exercise: {
    title: "Giliran Anda: tahun kabisat",
    task: "Tulis <code>is_leap_year(year)</code>: sebuah tahun adalah tahun kabisat jika habis dibagi 4, kecuali tahun yang habis dibagi 100, yang hanya kabisat jika juga habis dibagi 400.",
    plan: ["Namai ujinya: is_leap_year(year) mengembalikan true atau false", "Habis dibagi 400? Tahun kabisat", "Jika tidak, habis dibagi 100? Bukan tahun kabisat", "Jika tidak, habis dibagi 4? Tahun kabisat; selain itu bukan"]
  },
  compare: {
    intro: "Fungsi penguji biasanya menjadi uji <b>di dalam</b> skema lain.",
    rows: [
      { name: "Fungsi penguji", question: "Apakah 17 prima?", shape: "fungsi yang mengembalikan true / false untuk satu nilai", result: "ya atau tidak" },
      { name: "Menghitung", question: "Berapa bilangan prima sampai 100?", shape: "untuk setiap n: jika is_prime(n), hitung", result: "sebuah hitungan" },
      { name: "Saring", question: "Bilangan mana dalam daftar yang prima?", shape: "untuk setiap n: jika is_prime(n), simpan", result: "daftar baru" }
    ],
    table: {
      head: ["Skema", "Melihat", "Mengembalikan", "Memakai fungsi penguji?"],
      rows: [
        ["Fungsi penguji", "satu nilai", "true / false", "ia sendiri fungsi penguji"],
        ["Menghitung", "sebuah daftar", "sebuah hitungan", "sebagai ujinya"],
        ["Saring", "sebuah daftar", "sebuah daftar", "sebagai ujinya"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "kasus mudah di atas bekerja seperti penjaga" }, { why: "“tidak ada pembagi sama sekali” adalah pemeriksaan semuakah" }],
    leadsTo: [{ why: "coba kandidat dengan sebuah uji sampai ada yang lolos" }, { why: "hitung item yang lolos uji" }]
  }
};
