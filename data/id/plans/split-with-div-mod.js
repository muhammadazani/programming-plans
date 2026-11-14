/* Bahasa Indonesia overlay for data/plans/split-with-div-mod.js (A3). Text only. */
window.PLAN_ID = {
  title: "Pecah dengan div dan mod",
  highlight: "div dan mod",
  aka: ["konversi satuan", "hasil bagi dan sisa", "divmod"],
  hero: { tag: "// dan %", alt: "3725 detik mengalir melalui pembagian bilangan bulat dan sisa bagi menjadi 1 jam, 2 menit, 5 detik" },
  planCard: { name: "pecah", lines: ["besar = total // ukuran", "sisa = total % ukuran", "ulangi untuk satuan berikutnya"], foot: "→ kembalikan bagian-bagiannya" },
  intent: "Pecah sebuah jumlah menjadi satuan besar dan kecil: pembagian bilangan bulat menghitung berapa satuan besar yang muat, sisa baginya untuk satuan yang lebih kecil.",
  analogy: { title: "Mengemas telur ke dalam kotak", text: "Anda punya 27 telur dan kotak isi 12. Dua kotak terisi penuh (27 ÷ 12 = 2, pecahannya dibuang), dan 3 telur tersisa (sisa bagi). Pembagian bilangan bulat memberi tahu berapa kotak; sisa bagi memberi tahu berapa yang tercecer." },
  cues: ["jam, menit dan detik", "berapa … penuh", "sisanya", "dalam kotak / bungkus isi", "uang kembalian", "minggu dan hari"],
  cueSummary: "Satu jumlah harus menjadi <b>beberapa satuan</b> (jam dan menit, kotak dan sisa), tanpa pecahan.",
  cueExamples: ["Ubah 3725 detik menjadi jam, menit dan detik.", "Berapa kotak isi 12 yang penuh, dan berapa telur yang tersisa?", "Buat uang kembalian dengan pecahan 5, 2 dan 1."],
  steps: [
    { title: "Hitung satuan besarnya", text: "hours = seconds // 3600: pembagian bilangan bulat membuang pecahannya." },
    { title: "Simpan sisanya", text: "rest = seconds % 3600: sisa yang tidak cukup untuk satu jam penuh." },
    { title: "Ulangi untuk satuan berikutnya", text: "minutes = rest // 60, dan detiknya rest % 60." },
    { title: "Kembalikan bagian-bagiannya", text: "Di sini [hours, minutes, seconds]." }
  ],
  impl: {
    python: { plain: { note: "Di Python, <code>//</code> adalah pembagian bilangan bulat dan <code>%</code> adalah sisa bagi. <code>/</code> tunggal akan memberi pecahan." }, idiomatic: { note: "<code>divmod</code> mengembalikan hasil bagi dan sisanya sekaligus." } },
    java: { plain: { note: "Dengan dua <code>int</code>, <code>/</code> di Java sudah merupakan pembagian bilangan bulat." }, idiomaticNote: "<code>/</code> dan <code>%</code> pada <code>int</code> adalah alat Java yang idiomatis di sini." },
    rust: { idiomaticNote: "<code>/</code> dan <code>%</code> bilangan bulat adalah alat Rust yang idiomatis di sini." },
    c: { idiomatic: { note: "<code>div</code> mengembalikan hasil bagi (<code>.quot</code>) dan sisa (<code>.rem</code>) sekaligus." } },
    cpp: { idiomatic: { note: "<code>std::div</code> memberi hasil bagi dan sisa dalam satu panggilan." } }
  },
  trace: {
    intro: "Contoh: <b>Ubah sejumlah detik menjadi jam, menit dan detik.</b>",
    presets: [{ label: "3725 detik" }, { label: "59 detik" }, { label: "Sehari kurang satu detik" }],
    run({ seconds: t }) {
      const ev = [], v = { seconds: t };
      const push = (step, msg, active, fresh = [], done = [], tone = "") => {
        const st = (label, n, keys) => ({ label, step: n, state: active === n ? "active" : done.includes(n) ? "done" : "", vars: keys.map((k) => ({ k, v: v[k], fresh: fresh.includes(k) })) });
        const stages = [st("Jam", 1, ["seconds", "hours"]), st("Sisa", 2, ["rest"]), st("Menit & detik", 3, ["minutes", "secs"]), st("Hasil", 4, ["result"])];
        if (step === 4) stages[3].state = "result";
        ev.push({ step, msg, tone, view: { stages }, vars: [] });
      };
      push(null, `Siap. Ada ${t} detik untuk dipecah.`, 0);
      v.hours = Math.floor(t / 3600); push(1, `Berapa jam penuh yang muat? ${t} // 3600 = ${v.hours}`, 1, ["hours"]);
      v.rest = t % 3600; push(2, `Berapa sisanya? ${t} % 3600 = ${v.rest} detik`, 2, ["rest"], [1]);
      v.minutes = Math.floor(v.rest / 60); v.secs = v.rest % 60;
      push(3, `Lakukan lagi untuk menit: ${v.rest} // 60 = ${v.minutes}, dan ${v.rest} % 60 = ${v.secs}`, 3, ["minutes", "secs"], [1, 2]);
      v.result = `[${v.hours}, ${v.minutes}, ${v.secs}]`;
      push(4, `Kembalikan ${v.result}: ${v.hours} jam ${v.minutes} menit ${v.secs} detik.`, 4, ["result"], [1, 2, 3], "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Melupakan sisanya", text: "Menghitung menit dari total awal (<code>seconds // 60</code>) menghitung ulang menit yang sudah masuk ke jam: 3725 detik menjadi 1 jam 62 menit.", take: "Setiap satuan yang lebih kecil berasal dari sisa, bukan dari total." },
    { title: "Memakai ukuran satuan yang salah", text: "Membagi dengan 60 untuk jam menghasilkan menit. Tulis ukurannya sebagai konstanta bernama (SECONDS_PER_HOUR = 3600) agar angkanya menjelaskan dirinya sendiri.", take: "Periksa ukurannya: 60 per menit, 3600 per jam, 86 400 per hari." },
    { title: "Lupa bahwa bilangan negatif berperilaku lain", text: "Untuk -7, <code>//</code> di Python membulatkan ke bawah (-7 // 2 adalah -4), sedangkan Java, C, C++ dan Rust membulatkan ke arah nol (-7 / 2 adalah -3). Sisa baginya juga berbeda.", take: "Jaga jumlahnya tidak negatif, atau uji bilangan negatif di bahasa Anda." },
    { title: "Periksa dengan menyusunnya kembali", text: "hours × 3600 + minutes × 60 + seconds harus menghasilkan total semula. Jika tidak, ada langkah yang salah." },
    { title: "Pakai divmod atau div jika butuh keduanya", text: "<code>divmod</code> di Python dan <code>div</code> di C/C++ mengembalikan hasil bagi dan sisa sekaligus." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn}(7322)?", explain: "7322 // 3600 = 2 jam, menyisakan 122 detik; 122 // 60 = 2 menit dan 122 % 60 = 2 detik." },
    { q: "Berapa 27 % 12?", explain: "12 muat dua kali dalam 27 (24), dan sisanya 3. % memberi sisanya." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk 3725?", explain: "Ia membagi dengan 60 untuk jam, yang justru menghitung menit: 3725 // 60 = 62. Jam butuh 3600." }
  ],
  exercise: {
    title: "Giliran Anda: uang kembalian",
    task: "Tulis <code>make_change(amount)</code> yang memecah jumlah bulat menjadi koin 5, 2 dan 1, dengan sebanyak mungkin koin besar. Kembalikan [fives, twos, ones].",
    plan: ["fives = amount // 5", "rest = amount % 5", "twos = rest // 2 dan ones = rest % 2", "Kembalikan [fives, twos, ones]"]
  },
  compare: {
    intro: "Dua skema yang sama-sama memakai // dan %, untuk tugas berbeda.",
    rows: [
      { name: "Pecah dengan div dan mod", question: "3725 detik → 1 jam 2 menit 5 detik", shape: "jumlah langkah tetap, satu per satuan", result: "beberapa bagian" },
      { name: "Kupas digit", question: "Jumlahkan digit 3725", shape: "sebuah perulangan: % 10 untuk digit terakhir, // 10 untuk membuangnya", result: "satu nilai per digit" },
      { name: "Baca–Proses–Hasilkan", question: "Hitung kecepatan", shape: "satu rumus", result: "satu nilai" }
    ],
    table: {
      head: ["Skema", "Perulangan?", "Membagi dengan", "Pemakaian khas"],
      rows: [
        ["Pecah dengan div dan mod", "tidak", "ukuran satuan (3600, 60)", "waktu, kotak, uang kembalian"],
        ["Kupas digit", "ya", "selalu 10", "jumlah digit, membalik bilangan"],
        ["Baca–Proses–Hasilkan", "tidak", "—", "rumus"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "perhitungan lurus yang sama" }],
    leadsTo: [{ why: "ulangi % 10 dan // 10 untuk mengupas setiap digit" }]
  }
};
