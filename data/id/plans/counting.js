/* Bahasa Indonesia overlay for data/plans/counting.js (D1). Text only. */
window.PLAN_ID = {
  title: "Menghitung",
  highlight: "Menghitung",
  aka: ["penghitung", "tally", "hitung jika"],
  hero: { tag: "count = 3", alt: "Lima kubus: 72, 90 dan 50 berwarna kuning karena lulus, 45 dan 38 pucat; labelnya count = 3" },
  planCard: { name: "hitung", lines: ["count = 0", "untuk setiap item", "cocok? count + 1"], foot: "→ kembalikan count" },
  intent: "Cari tahu berapa banyak item yang lolos uji: mulai penghitung dari nol, kunjungi setiap item, dan tambah satu setiap kali item lolos.",
  analogy: { title: "Survei lalu lintas dengan alat penghitung", text: "Anda berdiri di pinggir jalan memegang alat penghitung tangan yang mulai dari 0. Setiap mobil merah yang lewat mendapat satu klik; mobil lain tidak. Setelah satu jam, angka di alat itulah jawabannya." },
  cues: ["berapa banyak …", "hitung …", "jumlah … yang", "berapa kali …", "tally"],
  cueSummary: "Jawabannya <b>bilangan bulat</b>: berapa item yang lolos uji. Setiap item harus diperiksa.",
  cueExamples: ["Berapa mahasiswa yang nilainya minimal 50?", "Berapa kata dalam kalimat yang diawali huruf kapital?", "Berapa hari bulan ini yang suhunya di atas 30 °C?"],
  steps: [
    { title: "Mulai penghitung dari nol", text: "Belum ada yang dihitung." },
    { title: "Kunjungi setiap item", text: "Setiap item, dari pertama sampai terakhir. Menghitung tidak bisa berhenti lebih awal." },
    { title: "Uji item itu", text: "Apakah item ini dihitung? Di sini: apakah nilainya minimal 50?" },
    { title: "Cocok? Tambah satu", text: "Hanya item yang lolos uji yang mengubah penghitung." },
    { title: "Kembalikan hitungannya", text: "Setelah perulangan, ketika setiap item sudah dilihat." }
  ],
  impl: {
    python: { idiomatic: { note: "Menjumlahkan angka 1 untuk setiap nilai yang lolos. Skema yang sama, ditulis sebagai satu ekspresi." } },
    java: { idiomatic: { note: "<code>count()</code> mengembalikan <code>long</code>, karena itu perlu konversi." } },
    rust: { idiomatic: { note: "<code>count()</code> menghasilkan <code>usize</code>; <code>as i32</code> mengubahnya." } },
    c: { idiomaticNote: "C tidak punya “hitung jika” bawaan, jadi perulangan adalah cara idiomatisnya." },
    cpp: { idiomatic: { note: "<code>std::ranges::count_if</code> (C++20) adalah skema yang persis ini." } }
  },
  trace: {
    intro: "Contoh: <b>Berapa mahasiswa yang lulus?</b> Sebuah nilai lulus jika minimal 50.",
    input: { placeholder: "nilai Anda: 72, 45, 90" },
    presets: [{ label: "Nilai campuran" }, { label: "Tidak ada yang lulus" }, { label: "Semua lulus" }, { label: "Daftar kosong" }],
    run(list) {
      const PASS = 50;
      const n = list.length, ev = [], states = list.map(() => "");
      let count = 0;
      const snap = (step, msg, cur = -1, tone = "") => ev.push({
        step, msg, tone,
        view: { values: list, states: states.slice(), ptr: cur },
        vars: [{ k: "s", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "count", role: "count", v: count }]
      });
      snap(null, n ? "Siap. Belum ada yang dihitung." : "Siap. Daftarnya kosong.");
      snap(1, "Mulai penghitung: count = 0.");
      for (let i = 0; i < n; i++) {
        states[i] = "current";
        snap(2, `Kunjungi item [${i}]: s = ${list[i]}`, i);
        const ok = list[i] >= PASS;
        states[i] = ok ? "hit" : "miss";
        snap(3, ok ? `Apakah ${list[i]} >= ${PASS}? Ya, dihitung.` : `Apakah ${list[i]} >= ${PASS}? Tidak, penghitung tetap ${count}.`, i);
        if (ok) { count++; snap(4, `Tambah satu: count sekarang ${count}.`, i); }
      }
      snap(5, n ? `${n === 1 ? "Satu-satunya item sudah" : `Semua ${n} item sudah`} diperiksa. Kembalikan ${count}.` : "Tidak ada item untuk diperiksa. Kembalikan 0.", -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Return di dalam perulangan", text: "Satu indentasi terlalu dalam, dan fungsi kembali setelah item pertama: paling banyak menghitung satu.", take: "Return tempatnya setelah perulangan, ketika setiap item sudah diperiksa." },
    { title: "> alih-alih >=", text: "“Minimal 50” berarti 50 ikut dihitung. Menulis <code>&gt; 50</code> diam-diam melewatkan setiap nilai yang tepat 50.", take: "Uji nilai batasnya dengan sengaja." },
    { title: "Lupa mengatur ulang penghitung", text: "Jika penghitung berada di luar fungsi, atau tidak diatur ulang di antara pemanggilan, pemanggilan kedua menambah total pemanggilan pertama.", take: "Mulai penghitung dari 0 di dalam fungsi, setiap kali." },
    { title: "Periksa daftar kosong", text: "Tanpa item, perulangan tidak pernah berjalan dan jawabannya 0. Itu benar, jadi tidak perlu kasus khusus." },
    { title: "Pakai fungsi bawaan setelah paham", text: "<code>sum(1 for …)</code> di Python, <code>filter().count()</code> di Java, <code>.filter().count()</code> di Rust dan <code>count_if</code> di C++ adalah skema ini." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn} untuk [50, 49, 100, 0]?", explain: "50 dan 100 minimal 50; 49 dan 0 tidak. Dua nilai lulus." },
    { q: "Bisakah perulangan menghitung berhenti begitu menemukan kecocokan?", options: ["Bisa", "Tidak"], explain: "Setiap item mungkin dihitung, jadi setiap item harus diperiksa. Skema seperti “Adakah?” bisa berhenti lebih awal; menghitung tidak bisa." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [50, 70, 40]?", explain: "Dengan > alih-alih >=, nilai yang tepat 50 tidak dihitung. Hanya 70 yang dihitung, jadi mengembalikan 1, bukan 2." }
  ],
  exercise: {
    title: "Giliran Anda: hitung bilangan genap",
    task: "Tulis <code>count_even(numbers)</code> yang mengembalikan berapa banyak bilangan yang genap. Ingat bahwa 0 dan bilangan negatif seperti -2 juga bisa genap.",
    plan: ["Mulai penghitung dari 0", "Kunjungi setiap bilangan", "Uji: apakah habis dibagi 2?", "Jika ya, tambah satu ke penghitung", "Kembalikan penghitung"]
  },
  compare: {
    intro: "Tiga skema pada nilai yang sama <code>[72, 45, 90, 50, 38]</code>. Menghitung dan akumulasi mengunjungi setiap item; “Adakah?” berhenti pada yang lulus pertama.",
    rows: [
      { name: "Menghitung", question: "Berapa yang lulus?" },
      { name: "Akumulasi", question: "Berapa totalnya?" },
      { name: "Adakah?", question: "Adakah yang lulus?" }
    ],
    table: {
      head: ["Skema", "Menjawab", "Mengunjungi", "Mulai dari"],
      rows: [
        ["Menghitung", "berapa banyak (bilangan bulat)", "setiap item", "0"],
        ["Akumulasi", "total atau hasil kali", "setiap item", "0 untuk +, 1 untuk ×"],
        ["Adakah?", "ya / tidak", "sampai kecocokan pertama", "—"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "perulangan yang mengunjungi setiap item" }, { why: "uji ya/tidak untuk setiap item" }],
    leadsTo: [{ why: "rata-rata = total ÷ banyaknya" }, { why: "simpan item yang cocok, bukan hanya jumlahnya" }, { why: "satu penghitung per kategori" }]
  }
};
