/* Bahasa Indonesia overlay for data/plans/repeat-n-times.js (C1). Text only. */
(function () {
  const money = (x) => x.toFixed(2);

  window.PLAN_ID = {
    title: "Ulangi n kali",
    highlight: "n kali",
    aka: ["perulangan terhitung", "for loop", "iterasi pasti"],
    hero: { tag: "× 1.05 tiap tahun", alt: "Lima kubus berlabel tahun 1 sampai tahun 5, yang terakhir berwarna kuning, dengan label kali 1.05 tiap tahun" },
    planCard: { name: "ulangi", lines: ["siapkan sebelum perulangan", "ulangi tepat n kali", "kerjakan satu putaran"], foot: "→ pakai hasilnya" },
    intent: "Kerjakan pekerjaan yang sama sebanyak jumlah yang sudah diketahui sebelum perulangan dimulai.",
    analogy: { title: "Berenang 10 putaran", text: "Sebelum masuk kolam, Anda sudah tahu jumlahnya: 10 putaran. Anda menghitung setiap putaran yang selesai, dan berhenti saat hitungan mencapai 10. Setiap putaran pekerjaannya sama; hanya penghitungnya yang berubah." },
    cues: ["n kali", "untuk setiap dari n …", "setiap hari selama seminggu", "ulangi …", "dari 1 sampai n", "setelah n tahun"],
    cueSummary: "Anda tahu <b>berapa kali</b> sebelum perulangan dimulai: sebuah n yang diberikan, atau panjang sebuah daftar.",
    cueExamples: ["Berapa saldo setelah n tahun dengan bunga 5% per tahun?", "Cetak n kelipatan 7 yang pertama.", "Lempar dadu 100 kali dan catat hasilnya."],
    steps: [
      { title: "Siapkan sebelum perulangan", text: "Apa pun yang akan diperbarui setiap putaran: di sini saldo dimulai dari jumlah awal." },
      { title: "Ulangi tepat n kali", text: "Sebuah penghitung melewati n nilai (0 sampai n − 1, atau 1 sampai n). Perulangan tahu kapan berhenti sebelum dimulai." },
      { title: "Kerjakan satu putaran", text: "Langkah yang sama setiap kali: tambahkan bunga setahun." },
      { title: "Pakai hasilnya setelah perulangan", text: "Setelah penghitung menyelesaikan n putaran, pekerjaannya selesai." }
    ],
    impl: {
      python: { plain: { note: "<code>range(years)</code> memberi 0, 1, …, years − 1: tepat <code>years</code> putaran." }, idiomatic: { note: "Tanpa perulangan sama sekali: bunga majemuk punya rumus. Perulangan bisa dipakai untuk langkah berulang apa pun, bahkan yang tidak punya rumus." } },
      java: { plain: { note: "<code>year &lt; years</code>, dimulai dari 0, berjalan tepat <code>years</code> kali." }, idiomatic: { note: "Rumus tertutupnya, sebagai pembanding." } },
      rust: { plain: { note: "<code>0..years</code> berhenti sebelum <code>years</code>; <code>0..=years</code> akan mengikutsertakannya dan berjalan sekali terlalu banyak." }, idiomatic: { note: "Rumus tertutupnya, sebagai pembanding." } },
      c: { idiomatic: { note: "Rumus tertutupnya, sebagai pembanding (tautkan dengan <code>-lm</code>)." } },
      cpp: { idiomatic: { note: "Rumus tertutupnya, sebagai pembanding." } }
    },
    trace: {
      intro: "Contoh: <b>Rekening tabungan memberi bunga 5% per tahun. Berapa saldonya setelah n tahun?</b>",
      presets: [{ label: "1000 selama 3 tahun" }, { label: "200 selama 5 tahun" }, { label: "Nol tahun" }],
      run({ start, years }) {
        const rounds = Array.from({ length: years }, (_, i) => `Y${i + 1}`);
        const ev = [], states = rounds.map(() => "");
        let balance = start;
        const snap = (step, msg, cur = -1, tone = "", yr = "—") => ev.push({
          step, msg, tone,
          view: { values: rounds, states: states.slice(), ptr: cur, emptyNote: "tidak ada putaran: years = 0" },
          vars: [{ k: "year", role: "stepper", v: yr, of: yr === "—" ? undefined : years }, { k: "balance", role: "gatherer", v: money(balance) }]
        });
        snap(null, `Siap. Ada ${years} putaran yang harus dikerjakan.`);
        snap(1, `Siapkan sebelum perulangan: balance = ${start}.`);
        for (let y = 0; y < years; y++) {
          states[y] = "current";
          snap(2, `Putaran ${y + 1} dari ${years} (year = ${y}).`, y, "", y + 1);
          const before = balance;
          balance = balance * 1.05;
          states[y] = "added";
          snap(3, `Tambahkan bunga setahun: ${money(before)} × 1.05 = ${money(balance)}`, y, "", y + 1);
        }
        snap(4, years ? `${years === 1 ? "Satu-satunya putaran" : `Semua ${years} putaran`} selesai. Kembalikan ${money(balance)}.` : "Nol putaran: badan perulangan tidak pernah berjalan. Kembalikan saldo awal.", -1, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Satu putaran terlalu banyak", text: "Menghitung dari 0 <em>sampai dan termasuk</em> n berjalan n + 1 kali. Bunga satu tahun menjadi dua.", take: "Dari 0, berhenti sebelum n (<code>&lt; n</code>, <code>range(n)</code>, <code>0..n</code>). Dari 1, sampai dan termasuk n." },
      { title: "Menyiapkan di dalam perulangan", text: "Jika <code>balance = start</code> ada di dalam perulangan, setiap putaran mulai dari awal lagi, dan Anda hanya mendapat bunga satu tahun.", take: "Siapkan sekali, sebelum perulangan." },
      { title: "Mengubah n atau penghitung di dalam perulangan", text: "Mengubah penghitung perulangan secara manual (atau n pembandingnya) merusak janji “tepat n kali”.", take: "Jika jumlahnya tidak diketahui sejak awal, pakai skema perulangan lain (C2 atau C4)." },
      { title: "Periksa kasus nol", text: "Dengan n = 0 badan perulangan tidak pernah berjalan, jadi hasilnya sesuai persiapan. Di sini: saldo awal, dan itu benar." },
      { title: "Uji dengan n = 1", text: "Satu putaran mudah dihitung manual (1000 → 1050) dan langsung menangkap galat selisih satu." }
    ],
    quiz: [
      { q: "Berapa kali badan perulangan berjalan dalam {fn}(1000, 4)?", explain: "years bernilai 4, dan perulangan berjalan untuk year = 0, 1, 2, 3: empat putaran." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk (1000, 3)?", explain: "Setiap putaran mengatur ulang balance menjadi 1000 sebelum menambah bunga, jadi setelah berapa pun putaran hasilnya 1000 × 1.05 = 1050.0." },
      { q: "Kapan “ulangi n kali” adalah skema yang tepat?", options: ["Saat n diketahui sebelum perulangan dimulai", "Saat perulangan berhenti pada masukan khusus", "Saat Anda berhenti begitu tujuan tercapai"], explain: "Perulangan terhitung butuh jumlahnya sejak awal. Berhenti pada masukan khusus adalah C2; berhenti saat tujuan tercapai adalah C4." }
    ],
    exercise: {
      title: "Giliran Anda: pangkat dengan perkalian berulang",
      task: "Tulis <code>power(base, exponent)</code> yang mengembalikan base dikalikan dengan dirinya sendiri sebanyak <code>exponent</code> kali, dengan perulangan. Bilangan apa pun pangkat 0 adalah 1.",
      plan: ["Siapkan: result = 1", "Ulangi tepat exponent kali", "Setiap putaran: result = result × base", "Kembalikan result"]
    },
    compare: {
      intro: "Tiga skema kendali perulangan. Bedanya ada pada <b>apa yang menyuruh perulangan berhenti</b>.",
      rows: [
        { name: "Ulangi n kali", question: "Tambahkan bunga selama 3 tahun", shape: "jumlahnya diketahui sejak awal: for i in 0..n", result: "tepat n putaran" },
        { name: "Baca sampai tanda berhenti", question: "Jumlahkan angka sampai pengguna mengetik -1", shape: "baca dulu; selama bukan tanda berhenti: proses, baca berikutnya", result: "tidak diketahui sebelumnya" },
        { name: "Ulangi sampai tercapai", question: "Berapa tahun sampai saldonya dua kali lipat?", shape: "selama tujuan belum tercapai: satu putaran lagi", result: "menghitung putarannya" }
      ],
      table: {
        head: ["Skema", "Berhenti saat", "Jumlah putaran diketahui?", "Perulangan khas"],
        rows: [
          ["Ulangi n kali", "penghitung mencapai n", "ya", "for"],
          ["Baca sampai tanda berhenti", "nilai khusus terbaca", "tidak", "while"],
          ["Ulangi sampai tercapai", "tujuan tercapai", "tidak", "while"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "setiap putaran adalah perhitungan kecil" }],
      leadsTo: [{ why: "ulangi atas item sebuah daftar, menjumlahkan masing-masing" }, { why: "jika Anda tidak tahu berapa putaran" }, { why: "perulangan terhitung di dalam perulangan lain" }]
    }
  };
})();
