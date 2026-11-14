/* Bahasa Indonesia overlay for data/plans/position-of-largest.js (D5). Text only. */
window.PLAN_ID = {
  title: "Posisi terbesar",
  highlight: "Posisi",
  aka: ["argmax", "indeks maksimum", "di mana yang terbaik"],
  hero: { tag: "terbaik di [1]", alt: "Lima kubus; angka 9 yang pertama, di posisi 1, berwarna kuning sebagai yang terbesar" },
  planCard: { name: "argmax", lines: ["best = posisi 0", "untuk setiap posisi lain", "lebih besar? best = di sini"], foot: "→ kembalikan posisinya" },
  intent: "Cari di mana item terbesar berada: ingat posisi yang terbaik sejauh ini, dan bandingkan setiap item dengan item di posisi itu.",
  analogy: { title: "Menandai puncak tertinggi di peta", text: "Anda berjalan menyusuri punggung bukit dan menancapkan bendera di titik tertinggi yang sudah Anda lihat. Setiap kali sampai di titik yang lebih tinggi, bendera dipindahkan ke sana. Di akhir, bendera menandai di mana titik tertinggi berada, bukan hanya seberapa tinggi." },
  cues: ["hari mana / item mana …", "di mana yang terbesar …", "posisi / indeks yang terbaik", "siapa yang skornya tertinggi"],
  cueSummary: "Jawabannya sebuah <b>posisi</b>, tempat nilai paling ekstrem berada.",
  cueExamples: ["Hari apa yang paling panas?", "Mahasiswa mana (menurut posisinya dalam daftar) yang skornya tertinggi?", "Di mana barang termurah, agar bisa dihapus?"],
  steps: [
    { title: "Mulai dengan posisi 0 sebagai terbaik sejauh ini", text: "Posisi item pertama, bukan nilainya." },
    { title: "Kunjungi setiap posisi lainnya", text: "Dari posisi 1 sampai akhir." },
    { title: "Bandingkan itemnya dengan item di posisi terbaik", text: "numbers[i] > numbers[best]: yang terbaik dibaca melalui posisinya." },
    { title: "Lebih besar? Ingat posisi ini", text: "best = i. Jika seri, posisi yang lebih awal tetap, karena > tidak bernilai benar untuk nilai yang sama." },
    { title: "Kembalikan posisinya", text: "Daftarnya tidak boleh kosong." }
  ],
  impl: {
    python: { idiomatic: { note: "Jelas, tetapi menelusuri daftar dua kali: sekali untuk <code>max</code>, sekali untuk <code>index</code>." } },
    java: { idiomatic: { note: "<code>reduce</code> menyimpan satu posisi dan membiarkan setiap posisi baru menantangnya, skema ini dalam satu ekspresi." } },
    rust: { idiomatic: { note: "<code>max_by_key</code> mengembalikan yang <em>terakhir</em> dari beberapa maksimum yang sama, jadi perlu <code>.rev()</code> untuk mendapat yang pertama. Alasan yang bagus untuk memahami perulangan biasanya." } },
    c: { idiomaticNote: "C tidak punya argmax bawaan, jadi perulangan adalah cara idiomatisnya." },
    cpp: { idiomatic: { note: "<code>max_element</code> mengembalikan iterator ke item terbesar pertama; mengurangkan <code>begin()</code> mengubahnya menjadi posisi." } }
  },
  trace: {
    intro: "Contoh: <b>Di posisi berapa bilangan terbesar?</b> Jika seri, yang pertama menang.",
    input: { placeholder: "daftar Anda: 4, 9, 2, 9" },
    presets: [{ label: "Ada yang seri" }, { label: "Naik" }, { label: "Semua negatif" }],
    run(raw) {
      const list = raw.length ? raw : [0];
      const ev = [], states = list.map(() => "");
      let best = 0;
      const snap = (step, msg, cur = -1, tone = "") => {
        const st = states.slice(); if (st[best] !== "current") st[best] = "best";
        ev.push({ step, msg, tone, view: { values: list, states: st, ptr: cur, badges: list.map((_, i) => (i === best ? "best" : "")) },
          vars: [{ k: "i", role: "stepper", v: cur > 0 ? cur : "—" }, { k: "best", role: "best", v: best }, { k: "numbers[best]", role: "best", v: list[best] }] });
      };
      ev.push({ step: null, msg: raw.length ? "Siap. Di mana bilangan terbesar?" : "Daftar tidak boleh kosong, jadi penelusuran ini memakai [0].", view: { values: list, states: states.slice(), ptr: -1 }, vars: [{ k: "best", role: "best", v: "?" }] });
      snap(1, `Mulai dengan posisi 0 (nilai ${list[0]}) sebagai terbaik sejauh ini.`, 0);
      for (let i = 1; i < list.length; i++) {
        states[i] = "current";
        snap(2, `Kunjungi posisi ${i}: ${list[i]}.`, i);
        states[i] = "miss";
        if (list[i] > list[best]) {
          snap(3, `Apakah ${list[i]} > numbers[${best}] (${list[best]})? Ya.`, i);
          best = i; snap(4, `Ingat posisi ini: best = ${i}.`, i);
        } else snap(3, `Apakah ${list[i]} > numbers[${best}] (${list[best]})? Tidak${list[i] === list[best] ? ": sama besar, jadi posisi yang lebih awal tetap" : ""}.`, i);
      }
      snap(5, `Kembalikan posisi ${best} (nilainya ${list[best]}).`, -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Mengembalikan nilai alih-alih posisi", text: "Menyimpan <em>nilai</em> terbaik (skema D4) lalu mengembalikannya menjawab “seberapa tinggi?”, bukan “di mana?”.", take: "Simpan posisinya, dan baca nilainya melalui posisi itu: numbers[best]." },
    { title: ">= padahal Anda ingin yang pertama", text: "Dengan <code>&gt;=</code>, nilai sama yang datang belakangan mengambil alih, jadi Anda mendapat posisi <em>terakhir</em> dari nilai terbesar.", take: "Tentukan seri mana yang Anda inginkan, lalu pilih > atau >= dengan sengaja." },
    { title: "Daftar kosong", text: "Daftar kosong tidak punya posisi item terbesar. Memulai dengan best = 0 diam-diam menjawab 0.", take: "Pasang penjaga dulu (B1) jika daftar bisa kosong." },
    { title: "Pakai posisinya untuk mendapat lebih banyak", text: "Dengan posisi, Anda bisa mendapat nilainya, nama yang sesuai di daftar sejajar, atau menukar itemnya (pengurutan dengan memilih terkecil, F3)." },
    { title: "Ketahui aturan seri pustaka Anda", text: "<code>max_element</code> di C++ dan <code>index</code> di Python memberi posisi pertama; <code>max_by_key</code> di Rust memberi yang terakhir." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn}([7, 3, 12, 5])?", explain: "Nilai terbesar, 12, ada di posisi 2 (posisi dimulai dari 0)." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [4, 9, 2, 9]?", explain: "Dengan >=, angka 9 kedua (di posisi 3) menggantikan yang pertama, jadi yang dikembalikan posisi terakhir dari nilai terbesar." },
    { q: "Mengapa menyimpan posisi, bukan nilai?", options: ["Posisi adalah bilangan yang lebih kecil", "Dari posisi Anda tetap bisa mendapat nilainya, tetapi tidak sebaliknya", "Nilai tidak bisa dibandingkan"], explain: "numbers[best] memberi nilainya kapan saja. Nilai saja tidak memberi tahu di mana letaknya." }
  ],
  exercise: {
    title: "Giliran Anda: posisi terkecil",
    task: "Tulis <code>index_of_min(numbers)</code> yang mengembalikan posisi bilangan terkecil dalam daftar yang tidak kosong (yang pertama, jika seri).",
    plan: ["Mulai dengan posisi 0 sebagai terbaik sejauh ini", "Kunjungi setiap posisi lainnya", "Apakah itemnya lebih kecil dari item di posisi terbaik?", "Jika ya, ingat posisi ini", "Kembalikan posisinya"]
  },
  compare: {
    intro: "Dua skema pada <code>[4, 9, 2, 9, 7]</code>: satu mengingat nilai terbaik, yang lain letaknya.",
    rows: [
      { name: "Posisi terbesar", question: "Di mana yang terbesar?" },
      { name: "Nilai terbesar / terkecil", question: "Berapa yang terbesar?" },
      { name: "Cari yang pertama", question: "Di mana angka 9 pertama?" }
    ],
    table: {
      head: ["Skema", "Mengingat", "Mengunjungi", "Mengembalikan"],
      rows: [
        ["Posisi terbesar", "posisi terbaik", "setiap item", "sebuah posisi"],
        ["Nilai terbesar / terkecil", "nilai terbaik", "setiap item", "sebuah nilai"],
        ["Cari yang pertama", "tidak ada", "sampai ada yang cocok", "sebuah posisi atau -1"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "gagasan terbaik sejauh ini yang sama, menyimpan posisi" }],
    leadsTo: [{ why: "pengurutan dengan memilih terkecil mencari posisi terkecil berulang kali" }]
  }
};
