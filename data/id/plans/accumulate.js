/* Bahasa Indonesia overlay for data/plans/accumulate.js (D2). Text only. */
window.PLAN_ID = {
  title: "Akumulasi",
  highlight: "Akumulasi",
  aka: ["total berjalan", "jumlah / hasil kali", "akumulator", "fold"],
  hero: { tag: "total = 55", alt: "Empat kubus, 12, 5, 30 dan 8, dengan kubus terakhir kuning dan label total = 55" },
  planCard: { name: "akumulasi", lines: ["total = 0", "untuk setiap item", "total += item"], foot: "→ kembalikan total" },
  intent: "Gabungkan setiap item menjadi satu nilai: mulai dari nilai netral, lalu lipat setiap item ke dalam total berjalan.",
  analogy: { title: "Mesin kasir", text: "Layar kasir menunjukkan 0 sebelum barang pertama dipindai. Setiap pemindaian menambahkan harga barang itu ke total berjalan di layar. Saat barang terakhir dipindai, layar sudah menunjukkan jumlah yang harus dibayar." },
  cues: ["total", "jumlah dari …", "jumlahkan …", "hasil kali …", "seluruhnya", "secara total"],
  cueSummary: "Banyak item masuk, <b>satu nilai gabungan</b> keluar: jumlah, hasil kali, atau gabungan berjalan lainnya.",
  cueExamples: ["Berapa total harga barang di keranjang?", "Berapa kilometer saya berlari minggu ini?", "Berapa 1 × 2 × … × n (n faktorial)?"],
  steps: [
    { title: "Mulai dari nilai netral", text: "0 untuk penjumlahan (menambah 0 tidak mengubah apa pun), 1 untuk perkalian (mengalikan dengan 1 tidak mengubah apa pun)." },
    { title: "Kunjungi setiap item", text: "Setiap item ikut menyumbang, jadi setiap item dikunjungi." },
    { title: "Lipat ke dalam total", text: "total = total + item. Total selalu berisi jumlah item yang sudah dikunjungi." },
    { title: "Kembalikan totalnya", text: "Setelah perulangan, total berjalan adalah jawaban akhir." }
  ],
  impl: {
    python: { idiomatic: { note: "<code>sum()</code> mulai dari 0 dan menambahkan setiap item. Untuk hasil kali, pakai <code>math.prod()</code>." } },
    java: { idiomatic: { note: "<code>IntStream</code> sudah punya <code>sum()</code>." } },
    rust: { idiomatic: { note: "<code>Iterator::sum</code> adalah skema akumulasi; <code>.product()</code> mengalikan." } },
    c: { idiomaticNote: "C tidak punya fungsi penjumlah bawaan, jadi perulangan adalah cara idiomatisnya." },
    cpp: { idiomatic: { note: "Argumen terakhir, <code>0</code>, adalah nilai awal dari langkah 1." } }
  },
  trace: {
    intro: "Contoh: <b>Berapa total dari daftar jumlah uang?</b>",
    input: { placeholder: "jumlah Anda: 12, 5, 30" },
    presets: [{ label: "Empat jumlah" }, { label: "Ada pengembalian" }, { label: "Satu item" }, { label: "Daftar kosong" }],
    run(list) {
      const n = list.length, ev = [], states = list.map(() => "");
      let total = 0;
      const snap = (step, msg, cur = -1, tone = "") => ev.push({
        step, msg, tone,
        view: { values: list, states: states.slice(), ptr: cur },
        vars: [{ k: "a", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "total", role: "gatherer", v: total }]
      });
      snap(null, n ? "Siap. Belum ada yang dijumlahkan." : "Siap. Daftarnya kosong.");
      snap(1, "Mulai dari nilai netral: total = 0.");
      for (let i = 0; i < n; i++) {
        states[i] = "current";
        snap(2, `Kunjungi item [${i}]: a = ${list[i]}`, i);
        const before = total;
        total += list[i];
        states[i] = "added";
        snap(3, `Lipat ke dalam total: total = ${before} + ${list[i]} = ${total}`, i);
      }
      snap(4, n ? `${n === 1 ? "Satu-satunya item sudah" : `Semua ${n} item sudah`} dijumlahkan. Kembalikan ${total}.` : "Tidak ada yang dijumlahkan. Kembalikan 0, nilai netralnya.", -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Mengatur ulang total di dalam perulangan", text: "Mulai dari nol di setiap putaran membuang semua yang sudah dijumlahkan. Fungsi hanya mengembalikan item terakhir.", take: "Atur nilai awal sekali saja, sebelum perulangan." },
    { title: "Memulai hasil kali dari 0", text: "0 × apa pun hasilnya 0, jadi hasil kali yang dimulai dari 0 akan tetap 0. Hasil kali dimulai dari 1.", take: "Mulai dari nilai yang tidak mengubah apa pun: 0 untuk +, 1 untuk ×." },
    { title: "Mengabaikan luapan (overflow)", text: "Di Java, C, C++ dan Rust, <code>int</code> menampung paling banyak 2.147.483.647. Total besar berputar menjadi negatif di Java dan C, dan membuat program Rust berhenti (panic) pada build debug.", take: "Pakai tipe yang lebih lebar (long, i64) jika total bisa sangat besar." },
    { title: "Baca total sebagai “sejauh ini”", text: "Di dalam perulangan, total selalu berarti “jumlah item yang sudah dikunjungi”. Mengucapkannya keras-keras menangkap sebagian besar bug." },
    { title: "Pakai fungsi bawaan setelah paham", text: "<code>sum()</code>, <code>Arrays.stream().sum()</code>, <code>.iter().sum()</code> dan <code>std::accumulate</code> adalah skema ini." }
  ],
  quiz: [
    { q: "Selama {fn}([12, 5, 30, 8]), berapa total tepat setelah item ketiga dijumlahkan?", explain: "12 + 5 + 30 = 47. Total selalu berisi jumlah item yang sudah dikunjungi." },
    { q: "Versi ini dimaksudkan untuk mengalikan semua bilangan. Apa yang dikembalikan untuk [2, 3, 4]?", explain: "Hasil kali dimulai dari 0, dan 0 × 2 × 3 × 4 tetap 0. Hasil kali harus dimulai dari 1." },
    { q: "Apa yang seharusnya dikembalikan {fn} untuk daftar kosong?", options: ["0", "galat", "tidak ada"], explain: "Perulangan tidak berjalan, jadi nilai awal yang dikembalikan. Karena itulah nilai netral penting: 0 adalah total yang benar untuk tanpa item." }
  ],
  exercise: {
    title: "Giliran Anda: kalikan semuanya",
    task: "Tulis <code>product_of(numbers)</code> yang mengembalikan hasil perkalian semua bilangan. Hasil kali daftar kosong adalah 1.",
    plan: ["Mulai hasil kali dari 1, nilai netral untuk ×", "Kunjungi setiap bilangan", "Kalikan ke dalam hasil kali", "Kembalikan hasil kalinya"]
  },
  compare: {
    intro: "Tiga skema yang sama-sama mengunjungi setiap item <code>[12, 5, 30, 8]</code>. Yang berbeda adalah apa yang dicatat.",
    rows: [
      { name: "Akumulasi", question: "Berapa totalnya?" },
      { name: "Menghitung", question: "Berapa yang minimal 10?" },
      { name: "Rata-rata", question: "Berapa rata-ratanya?" }
    ],
    table: {
      head: ["Skema", "Mencatat", "Mulai dari", "Hasil"],
      rows: [
        ["Akumulasi", "total berjalan", "0 (atau 1 untuk ×)", "totalnya"],
        ["Menghitung", "berapa yang cocok", "0", "sebuah hitungan"],
        ["Rata-rata", "total dan banyaknya", "0 dan 0", "total ÷ banyaknya"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "perulangan yang mengunjungi setiap item" }],
    leadsTo: [{ why: "bagi total dengan banyaknya" }, { why: "simpan nilai terbaik, bukan total" }, { why: "akumulasikan karakter menjadi string" }]
  }
};
