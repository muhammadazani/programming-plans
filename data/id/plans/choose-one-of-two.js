/* Bahasa Indonesia overlay for data/plans/choose-one-of-two.js (B2). Text only. */
(function () {
  const FREE_FROM = 50, FEE = 5;

  window.PLAN_ID = {
    title: "Pilih salah satu",
    highlight: "salah satu",
    aka: ["if / else", "keputusan dua arah", "pilihan biner"],
    hero: { tag: "72 >= 50 ✓", alt: "Dua kubus: gratis ongkir (0) dan biaya (5); yang pertama berwarna kuning karena 72 setidaknya 50" },
    planCard: { name: "if / else", lines: ["uji kondisinya", "benar → pilihan pertama", "salah → pilihan lain"], foot: "→ tepat satu yang berjalan" },
    intent: "Pilih satu dari tepat dua hasil, tergantung apakah sebuah kondisi benar.",
    analogy: { title: "Persimpangan jalan setapak", text: "Sebuah papan bertuliskan “Hujan? Ambil jalan beratap.” Anda melihat ke atas sekali, lalu mengambil salah satu jalan. Anda tidak bisa mengambil keduanya, dan tidak bisa tidak memilih." },
    cues: ["jika … selain itu …", "antara … atau …", "gratis jika …", "lulus atau tidak", "ya / tidak menentukan"],
    cueSummary: "Ada <b>tepat dua</b> hasil, dan satu kondisi yang menentukan.",
    cueExamples: ["Ongkir gratis untuk belanja 50 atau lebih, selain itu 5.", "Cetak “genap” atau “ganjil” untuk sebuah bilangan.", "Mahasiswa lulus dengan nilai 50 atau lebih, selain itu tidak lulus."],
    steps: [
      { title: "Uji kondisinya", text: "Satu pertanyaan dengan jawaban ya/tidak: apakah totalnya setidaknya 50?" },
      { title: "Benar? Ambil pilihan pertama", text: "Di sini: ongkirnya gratis (0)." },
      { title: "Salah? Ambil pilihan lainnya", text: "Cabang else: ongkirnya 5. Tepat satu dari keduanya yang berjalan." }
    ],
    impl: {
      python: { idiomatic: { note: "Ekspresi kondisional memilih salah satu dari dua nilai dalam satu baris." } },
      java: { idiomatic: { note: "Operator ternary <code>kondisi ? a : b</code> memilih antara dua nilai." } },
      rust: { plain: { note: "Di Rust, <code>if</code> adalah ekspresi: cabang yang berjalan menjadi hasil fungsi." }, idiomatic: { note: "Rust tidak punya operator ternary; ekspresi <code>if</code> dalam satu baris menggantikannya." } }
    },
    trace: {
      intro: "Contoh: <b>Ongkir gratis untuk belanja 50 atau lebih; selain itu 5.</b>",
      presets: [{ label: "Total 72" }, { label: "Tepat 50" }, { label: "Total 49" }],
      run({ total: t }) {
        const ev = [];
        const rows = [{ test: `total >= ${FREE_FROM}`, label: "0", state: "" }, { test: "else", label: String(FEE), state: "" }];
        let cost = "?";
        const push = (step, msg, tone = "") => ev.push({
          step, msg, tone,
          view: { subject: { k: "total", v: t }, rows: rows.map((r) => ({ ...r })) },
          vars: [{ k: "total", role: "fixed", v: t }, { k: "cost", role: "result", v: cost }]
        });
        push(null, `Siap. total = ${t}. Gratis ongkir atau tidak?`);
        if (t >= FREE_FROM) {
          rows[0].state = "hit"; rows[1].state = "skipped";
          push(1, `Apakah ${t} >= ${FREE_FROM}? Ya.`);
          cost = 0;
          push(2, "Ambil pilihan pertama: ongkir gratis. Kembalikan 0. Cabang else tidak pernah berjalan.", "yes");
        } else {
          rows[0].state = "miss";
          push(1, `Apakah ${t} >= ${FREE_FROM}? Tidak.`);
          rows[1].state = "hit"; cost = FEE;
          push(3, `Ambil pilihan lainnya: kembalikan ${FEE}.`, "yes");
        }
        return ev;
      }
    },
    pitfalls: [
      { title: "> alih-alih >=", text: "“50 atau lebih” termasuk 50. Menulis <code>&gt; 50</code> menagih pelanggan yang belanja tepat 50, padahal justru kasus itulah yang dimaksud aturannya.", take: "Terjemahkan “atau lebih” sebagai >=, dan uji nilai batasnya." },
      { title: "Cabang yang tertukar", text: "Menaruh biaya di cabang benar menagih belanja besar dan menggratiskan belanja kecil. Kodenya berjalan lancar; tokonya yang rugi.", take: "Bacakan: “jika totalnya setidaknya 50, ongkirnya gratis”." },
      { title: "Dua if padahal seharusnya satu if/else", text: "<code>if total &gt;= 50</code> lalu <code>if total &lt; 50</code> yang terpisah memang berjalan, sampai seseorang mengubah satu kondisi dan lupa yang lain.", take: "Pakai else: ia mencakup tepat kasus yang tidak dicakup if." },
      { title: "Uji kedua sisi garis batas", text: "49 dan 50 (ditambah nilai yang jauh, seperti 0 atau 1000) mencakup kedua cabang dan batasnya." },
      { title: "Pakai ekspresi kondisional untuk nilai", text: "Jika kedua cabang hanya menghasilkan nilai, <code>a if c else b</code>, <code>c ? a : b</code> atau ekspresi <code>if</code> di Rust membuatnya ringkas." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}(50)?", explain: "50 >= 50 bernilai benar, jadi cabang pertama berjalan: ongkirnya gratis." },
      { q: "Dalam if / else, berapa dari dua cabang yang berjalan?", options: ["Tepat satu", "Keduanya", "Mungkin tidak ada"], explain: "Kondisinya benar atau salah, jadi tepat satu cabang yang berjalan, setiap kali." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk 72?", explain: "Cabangnya tertukar: belanja besar membayar 5 dan belanja kecil gratis ongkir." }
    ],
    exercise: {
      title: "Giliran Anda: nilai mutlak",
      task: "Tulis <code>absolute(x)</code> yang mengembalikan x tanpa tanda minusnya: -5 menjadi 5, dan 3 tetap 3.",
      plan: ["Uji kondisinya: apakah x negatif?", "Benar? Kembalikan -x", "Salah? Kembalikan x apa adanya"]
    },
    compare: {
      intro: "Empat skema yang sama-sama memilih di antara beberapa hasil. Banyaknya hasil, dan apa yang menentukannya, memberi tahu mana yang cocok.",
      rows: [
        { name: "Pilih salah satu", question: "Gratis ongkir atau tidak?", result: "2 hasil" },
        { name: "Klasifikasi bertingkat", question: "Nilai huruf apa, A sampai D?", result: "3+ hasil" },
        { name: "Keputusan bersarang", question: "Anggota dan lebih dari 4 kg?", shape: "if bersarang, atau kondisi yang digabung dengan and / or", result: "sebuah kombinasi" },
        { name: "Penjaga", question: "Apakah masukannya bisa dipakai?", shape: "jika buruk: kembali dini", result: "galat atau lanjut" }
      ],
      table: {
        head: ["Skema", "Hasil", "Ditentukan oleh", "Pertanyaan khas"],
        rows: [
          ["Pilih salah satu", "2", "satu kondisi", "Apakah bilangannya genap?"],
          ["Klasifikasi bertingkat", "3 atau lebih", "rentang terurut dari satu nilai", "Golongan pajak yang mana?"],
          ["Keputusan bersarang", "2 atau lebih", "dua fakta terpisah", "Diskon untuk anggota di atas 4 kg?"],
          ["Penjaga", "2: berhenti atau lanjut", "apakah masukan valid?", "Bagaimana jika daftarnya kosong?"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "setiap cabang biasanya perhitungan kecil" }],
      leadsTo: [{ why: "lebih dari dua hasil" }, { why: "dua kondisi sekaligus" }, { why: "if yang melindungi sisa fungsi" }]
    }
  };
})();
