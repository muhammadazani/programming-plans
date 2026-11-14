/* Bahasa Indonesia overlay for data/plans/generate-and-test.js (G2). Text only. */
(function () {
  const SHOW = 10; // the trace shows the last few candidates only

  window.PLAN_ID = {
    title: "Coba semua kemungkinan",
    highlight: "semua kemungkinan",
    aka: ["brute force", "coba-coba", "coba setiap kandidat"],
    hero: { tag: "91 % 7 = 0", alt: "Kandidat 2 sampai 7 dicoba berurutan; 7 berwarna kuning sebagai yang pertama membagi 91" },
    planCard: { name: "coba & uji", lines: ["kandidat pertama", "selama gagal uji", "coba yang berikutnya"], foot: "→ yang pertama lolos" },
    intent: "Jika tidak ada rumus untuk jawabannya tetapi Anda bisa memeriksa sebuah kandidat, coba kandidatnya berurutan dan berhenti pada yang pertama lolos.",
    analogy: { title: "Seikat kunci tanpa label", text: "Anda tidak tahu kunci mana yang membuka pintu, tetapi langsung tahu jika ada yang berhasil. Jadi Anda mencobanya satu demi satu dan berhenti pada yang pertama bisa diputar. Tanpa rumus, hanya uji yang andal dan daftar kandidat." },
    cues: ["… terkecil yang memenuhi", "bilangan pertama yang …", "cari nilai yang memenuhi …", "tidak ada rumus", "coba setiap kemungkinan"],
    cueSummary: "Anda tidak bisa menghitung jawabannya langsung, tetapi bisa <b>memeriksa</b> apakah sebuah kandidat benar.",
    cueExamples: ["Berapa bilangan terkecil di atas 1 yang membagi 91?", "Berapa bilangan kuadrat pertama yang lebih dari 50?", "PIN terkecil mana yang memenuhi aturan?"],
    steps: [
      { title: "Mulai dengan kandidat pertama", text: "Di sini: 2, pembagi terkecil yang mungkin." },
      { title: "Selama kandidatnya gagal uji", text: "Di sini: selama ia tidak membagi n habis." },
      { title: "Lanjut ke kandidat berikutnya", text: "Berurutan, agar yang pertama lolos juga yang terkecil." },
      { title: "Kembalikan kandidat pertama yang lolos", text: "Perulangan pasti berhenti: n selalu membagi dirinya sendiri." }
    ],
    impl: {
      python: { plain: { note: "Bekerja untuk n ≥ 2. Karena d = n selalu lolos, perulangan tidak mungkin berjalan selamanya." } },
      rust: { idiomatic: { note: "<code>find</code> berhenti pada kandidat pertama yang lolos uji." } },
      c: { idiomaticNote: "Perulangan kandidat adalah C yang idiomatis." },
      cpp: { idiomaticNote: "Perulangan kandidat adalah C++ yang idiomatis." }
    },
    trace: {
      intro: "Contoh: <b>Berapa bilangan terkecil di atas 1 yang membagi n?</b> Setiap kotak adalah sebuah kandidat. (Hanya beberapa yang terakhir ditampilkan.)",
      presets: [{ label: "91" }, { label: "15" }, { label: "13 (prima)" }],
      run({ n }) {
        const ev = [], tried = [];
        const snap = (step, msg, tone = "", hit = false) => {
          const shown = tried.slice(-SHOW);
          ev.push({ step, msg, tone,
            view: { values: shown, states: shown.map((_, i) => (i === shown.length - 1 ? (hit ? "hit" : "current") : "miss")), ptr: shown.length - 1, noIdx: true, emptyNote: "belum ada kandidat" },
            vars: [{ k: "n", role: "fixed", v: n }, { k: "d", role: "stepper", v: tried.length ? tried[tried.length - 1] : "—" }, { k: "dicoba", role: "count", v: tried.length }] });
        };
        snap(null, `Siap. Cari pembagi terkecil dari ${n} di atas 1.`);
        let d = 2; tried.push(d);
        snap(1, "Mulai dengan kandidat pertama: d = 2.");
        while (n % d !== 0) {
          snap(2, `${n} % ${d} = ${n % d}: ${d} gagal uji.`);
          d++; tried.push(d);
          snap(3, `Coba kandidat berikutnya: d = ${d}.`);
        }
        snap(2, `${n} % ${d} = 0: ${d} lolos.`, "", true);
        snap(4, `Kembalikan ${d}${d === n ? `: ${n} tidak punya pembagi yang lebih kecil, jadi ia prima` : ""}.`, "yes", true);
        return ev;
      }
    },
    pitfalls: [
      { title: "Mulai dari kandidat yang salah", text: "Mulai dari 1 membuat jawabannya selalu 1, karena 1 membagi setiap bilangan. Kandidat pertama harus yang pertama <em>masuk akal</em>.", take: "Tentukan di mana kandidat sebenarnya dimulai." },
      { title: "Menguji kondisi kebalikannya", text: "<code>while n % d == 0</code> terus berjalan selama d <em>membagi</em> n, jadi yang dikembalikan bilangan pertama yang tidak membagi.", take: "Ulangi selama kandidatnya gagal; berhenti saat lolos." },
      { title: "Pencarian yang mungkin tidak pernah selesai", text: "Jika tidak ada kandidat yang pasti lolos, perulangannya bisa berjalan selamanya.", take: "Pastikan ada kandidat yang lolos (di sini, n sendiri), atau beri batas atas pada kandidatnya." },
      { title: "Urutkan kandidat sesuai pertanyaannya", text: "Mencoba dari terkecil ke terbesar membuat kecocokan pertama yang terkecil. Untuk mencari yang terbesar, coba dari atas ke bawah." },
      { title: "Kurangi kandidatnya jika bisa", text: "Di sini, jika tidak ada bilangan sampai √n yang membagi n, jawabannya n sendiri. Lebih sedikit kandidat berarti pencarian lebih cepat." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}(35)?", explain: "2, 3 dan 4 tidak membagi 35; 5 membagi. Itulah kandidat pertama yang lolos." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk 91?", explain: "Ujinya terbalik: ia berhenti pada bilangan pertama yang tidak membagi 91, yaitu 2." },
      { q: "Mengapa perulangannya selalu berhenti untuk n ≥ 2?", options: ["Karena d akhirnya mencapai n, dan n membagi dirinya sendiri", "Karena perulangan selalu berhenti", "Karena d mulai dari 2"], explain: "Ada kandidat yang pasti lolos, jadi pencariannya tidak mungkin berjalan selamanya." }
    ],
    exercise: {
      title: "Giliran Anda: kuadrat pertama di atas n",
      task: "Tulis <code>first_square_above(n)</code> yang mengembalikan bilangan kuadrat terkecil (1, 4, 9, 16, …) yang lebih besar dari <code>n</code>.",
      plan: ["Mulai dengan kandidat k = 1", "Selama k × k tidak lebih besar dari n", "Coba k berikutnya", "Kembalikan k × k"]
    },
    compare: {
      intro: "Tiga skema yang berhenti pada keberhasilan pertama.",
      rows: [
        { name: "Coba semua kemungkinan", question: "Pembagi terkecil dari 91?", shape: "buat kandidat satu per satu; berhenti pada yang pertama lolos", result: "kandidatnya" },
        { name: "Cari yang pertama", question: "Bilangan negatif pertama dalam daftar?", shape: "telusuri item yang ada; berhenti pada kecocokan pertama", result: "posisinya" },
        { name: "Ulangi sampai tercapai", question: "Berapa tahun sampai tabungan dua kali lipat?", shape: "satu putaran setiap kali sampai tujuan tercapai", result: "banyaknya putaran" }
      ],
      table: {
        head: ["Skema", "Kandidat berasal dari", "Berhenti pada", "Mengembalikan"],
        rows: [
          ["Coba semua kemungkinan", "dibuat sambil jalan (2, 3, 4, …)", "yang pertama lolos uji", "kandidat itu"],
          ["Cari yang pertama", "daftar yang sudah ada", "kecocokan pertama", "posisinya"],
          ["Ulangi sampai tercapai", "putaran yang berulang", "tujuannya", "berapa putaran"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "uji untuk setiap kandidat" }, { why: "ulangi sampai ada yang berhasil" }],
      leadsTo: [{ why: "jika kandidatnya terurut, membagi dua menemukan jawaban lebih cepat" }]
    }
  };
})();
