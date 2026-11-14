/* Bahasa Indonesia overlay for data/plans/lookup-table.js (B5). Text only. */
(function () {
  const PRICES = [["S", 3], ["M", 4], ["L", 5]];

  window.PLAN_ID = {
    title: "Tabel rujukan",
    highlight: "rujukan",
    aka: ["pencarian di dictionary / map", "kode berbasis tabel", "kunci → nilai"],
    hero: { tag: "\"M\" → 4", alt: "Tabel ukuran dan harga; baris untuk ukuran M berwarna kuning" },
    planCard: { name: "rujukan", lines: ["simpan pasangan kunci → nilai", "cari kuncinya", "tidak ada? pakai nilai bawaan"], foot: "→ kembalikan nilainya" },
    intent: "Ganti rantai if yang panjang atas nilai-nilai pasti dengan tabel pasangan kunci → nilai, lalu cari jawabannya di tabel.",
    analogy: { title: "Buku telepon", text: "Untuk mencari nomor, Anda tidak bertanya “apakah Aaron? apakah Abby? apakah Adam?” satu per satu. Anda langsung menuju namanya dan membaca nomor di sebelahnya. Jika namanya tidak ada di buku, Anda langsung tahu tidak ada nomornya." },
    cues: ["harga ukuran …", "untuk setiap kode, …", "terjemahkan … menjadi …", "daftar pasangan tetap", "jika x adalah A … jika x adalah B … jika x adalah C …"],
    cueSummary: "Hasilnya tergantung pada <b>nilai pasti</b> (kode, nama, ukuran), bukan rentang. Dan jumlahnya banyak.",
    cueExamples: ["Berapa harga kaus ukuran S, M atau L?", "Ubah nama hari seperti “Mon” menjadi angka.", "Cari kode telepon sebuah negara."],
    steps: [
      { title: "Simpan pasangannya dalam tabel", text: "Dictionary / map dari setiap kunci ke nilainya, ditulis sekali, di luar fungsi." },
      { title: "Cari kuncinya", text: "Satu pencarian menggantikan seluruh rantai if." },
      { title: "Tidak ada? Pakai nilai bawaan", text: "Di sini -1 berarti “ukuran itu tidak ada”." },
      { title: "Kembalikan nilainya", text: "Nilai yang tersimpan di sebelah kuncinya." }
    ],
    impl: {
      python: { idiomatic: { note: "<code>get(key, default)</code> mengerjakan pencarian dan nilai bawaan dalam satu panggilan." } },
      java: { idiomatic: { note: "<code>getOrDefault</code> adalah versi satu panggilannya." } },
      rust: { plain: { note: "Untuk program sungguhan, bangun map-nya sekali (misalnya dalam <code>static</code>) alih-alih setiap kali dipanggil." }, idiomatic: { note: "Untuk tabel kecil yang tetap, <code>match</code> pada kuncinya adalah Rust yang idiomatis: tabelnya ada di dalam kode, dan <code>_</code> adalah nilai bawaannya." } },
      c: { plain: { note: "C tidak punya dictionary bawaan, jadi tabelnya berupa dua array sejajar yang ditelusuri berurutan. Untuk tabel besar, urutkan kuncinya dan pakai <code>bsearch</code>." }, idiomaticNote: "Array sejajar (atau array of struct) adalah tabel rujukan C yang idiomatis." },
      cpp: { plain: { note: "<code>find</code> mengembalikan <code>end()</code> untuk kunci yang tidak ada. (<code>PRICES[size]</code> diam-diam menyisipkan 0.)" }, idiomaticNote: "<code>find</code> ditambah pemeriksaan <code>end()</code> adalah cara pencarian C++ yang idiomatis; <code>std::unordered_map</code> bekerja dengan cara yang sama." }
    },
    trace: {
      intro: "Contoh: <b>Harga di toko kaus:</b> S harganya 3, M harganya 4, L harganya 5. Ukuran lain memberi -1.",
      presets: [{ label: "\"M\"" }, { label: "\"L\"" }, { label: "\"XL\" (tidak ada)" }],
      run({ size }) {
        const ev = [];
        const rows = PRICES.map(([k, v]) => ({ test: `"${k}"`, label: String(v), state: "" })).concat([{ test: "selain itu", label: "-1", state: "" }]);
        let result = "?";
        const push = (step, msg, tone = "") => ev.push({ step, msg, tone,
          view: { subject: { k: "size", v: `"${size}"` }, rows: rows.map((r) => ({ ...r })) },
          vars: [{ k: "size", role: "fixed", v: `"${size}"` }, { k: "price", role: "result", v: result }] });
        push(null, `Siap. Berapa harga ukuran "${size}"?`);
        push(1, "Tabelnya sudah memuat setiap ukuran dan harganya.");
        const i = PRICES.findIndex(([k]) => k === size);
        rows.forEach((r, j) => { r.state = j === (i === -1 ? rows.length - 1 : i) ? "hit" : "skipped"; });
        if (i === -1) {
          push(2, `Cari "${size}": tidak ada di tabel. Tidak ada baris yang perlu diuji satu per satu.`);
          result = -1;
          push(3, "Kuncinya tidak ada, jadi kembalikan nilai bawaan: -1.", "no");
          return ev;
        }
        push(2, `Cari "${size}": tabel langsung menuju barisnya. Tidak ada baris yang perlu diuji satu per satu.`);
        result = PRICES[i][1];
        push(4, `Kembalikan ${result}.`, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Nilai bawaan yang terlihat seperti jawaban sungguhan", text: "Mengembalikan 0 untuk ukuran yang tidak ada membuat ukuran tak dikenal terlihat gratis. Pemanggil tidak bisa membedakan “tidak ketemu” dari harga sungguhan.", take: "Pilih nilai bawaan yang tidak mungkin dimiliki nilai sungguhan (-1, None, Option), atau munculkan galat." },
      { title: "Mengakses tanpa memeriksa", text: "<code>PRICES[size]</code> di Python memunculkan <code>KeyError</code> untuk kunci yang tidak ada, dan <code>PRICES[size]</code> di C++ diam-diam menyisipkan 0.", take: "Periksa dulu, atau pakai get / getOrDefault / find." },
      { title: "Kunci yang hampir cocok", text: "\"m\" dan \"M\" adalah kunci berbeda, begitu juga \"M \" dan \"M\".", take: "Rapikan kuncinya dulu (A4): trim dan seragamkan hurufnya." },
      { title: "Pisahkan data dari logika", text: "Menambah ukuran XL berarti menambah satu pasangan ke tabel. Dengan rantai if, berarti mengubah kode." },
      { title: "Pakai rentang jika nilainya berupa rentang", text: "Tabel butuh kunci yang pasti. Untuk “85 ke atas adalah A”, pakai Klasifikasi bertingkat (B3)." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}(\"S\")?", explain: "Tabel memasangkan \"S\" dengan 3." },
      { q: "Tabel ini punya kesalahan. Apa yang dikembalikan untuk \"M\"?", explain: "Harga M dan L tertukar saat tabelnya ditulis. Pencariannya benar; datanya yang salah." },
      { q: "Kapan tabel rujukan lebih cocok daripada rantai if / else-if?", options: ["Saat hasilnya tergantung nilai pasti", "Saat hasilnya tergantung rentang seperti “85 ke atas”", "Saat hanya ada dua hasil"], explain: "Tabel memetakan kunci pasti ke nilai. Rentang butuh perbandingan (B3); dua hasil cukup satu if (B2)." }
    ],
    exercise: {
      title: "Giliran Anda: nomor hari",
      task: "Tulis <code>day_number(day)</code> yang mengubah \"Mon\" … \"Sun\" menjadi 1 … 7, dan mengembalikan 0 untuk yang lain.",
      plan: ["Simpan tujuh pasangan hari → nomor dalam tabel", "Cari harinya", "Tidak ada? Kembalikan 0", "Kembalikan nomor yang ditemukan"]
    },
    compare: {
      intro: "Tiga cara memilih hasil, dibedakan dari jenis nilai yang menentukannya.",
      rows: [
        { name: "Tabel rujukan", question: "Harga ukuran \"M\"?", shape: "dictionary / map dari kunci pasti ke nilai", result: "satu kali cari" },
        { name: "Klasifikasi bertingkat", question: "Nilai huruf untuk skor 78?", shape: "rantai else-if atas rentang terurut", result: "menguji sampai ada yang benar" },
        { name: "Keputusan bersarang", question: "Diskon untuk pesanan berat seorang anggota?", shape: "if bersarang atas dua fakta", result: "salah satu dari 4 kombinasi" }
      ],
      table: {
        head: ["Skema", "Ditentukan oleh", "Menambah kasus berarti", "Kasus yang hilang"],
        rows: [
          ["Tabel rujukan", "kunci yang pasti", "menambah pasangan ke data", "nilai bawaan"],
          ["Klasifikasi bertingkat", "rentang satu nilai", "menambah cabang ke kode", "else terakhir"],
          ["Keputusan bersarang", "dua fakta ya/tidak", "memikirkan ulang tabelnya", "tidak mungkin terjadi jika keempatnya tercakup"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "rantai if yang digantikan tabel" }],
      leadsTo: [{ why: "dictionary yang menghitung alih-alih mencari" }, { why: "rapikan kunci sebelum mencarinya" }]
    }
  };
})();
