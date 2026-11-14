/* Bahasa Indonesia overlay for data/plans/guard.js (B1). Text only. */
(function () {
  const f = (x) => (Number.isInteger(x) ? x.toFixed(1) : String(+x.toFixed(6)));

  window.PLAN_ID = {
    title: "Penjaga",
    highlight: "Penjaga",
    aka: ["guard clause", "kembali lebih awal", "validasi masukan"],
    hero: { tag: "minutes <= 0", alt: "Tiga kubus bertingkat: dua pemeriksaan penjaga dan pekerjaan utama; penjaga kedua berwarna kuning karena menangkap masukan yang buruk" },
    planCard: { name: "penjaga", lines: ["masukan buruk? kembali dini", "kasus buruk berikutnya? kembali", "aman: kerjakan"], foot: "→ kembalikan hasilnya" },
    intent: "Tangani dulu masukan yang akan merusak perhitungan, dan langsung kembali, sehingga kode utama hanya menerima masukan yang valid.",
    analogy: { title: "Batas tinggi badan di roller coaster", text: "Sebelum naik wahana, sebuah papan memeriksa tinggi badan. Terlalu pendek, langsung ditolak di situ. Semua yang lolos papan itu bisa naik dengan aman, dan wahananya sendiri tidak perlu memikirkan tinggi badan lagi." },
    cues: ["jika masukan tidak valid …", "tidak boleh nol / negatif", "jika tidak, kembalikan galat", "hanya jika …", "bagaimana jika … kosong?"],
    cueSummary: "Sebagian masukan membuat perhitungan utama mustahil atau tidak bermakna. <b>Sebutkan dan tangani lebih dulu.</b>",
    cueExamples: ["Hitung kecepatan, tetapi waktunya bisa 0.", "Hitung rata-rata daftar yang mungkin kosong.", "Tarik uang hanya jika saldonya cukup."],
    steps: [
      { title: "Uji sebuah kasus buruk", text: "Satu pemeriksaan untuk setiap hal yang bisa salah: jarak negatif, waktu nol." },
      { title: "Buruk? Kembali dini dengan jawaban aman", text: "Di sini -1.0 berarti “masukan tidak valid”. Fungsi berhenti di situ." },
      { title: "Kerjakan pekerjaan utama", text: "Setiap masukan yang sampai di sini sudah lolos semua penjaga, jadi rumusnya aman." },
      { title: "Kembalikan hasilnya", text: "Hanya masukan valid yang sampai di sini." }
    ],
    impl: {
      python: { idiomaticNote: "Python yang idiomatis <b>memunculkan galat</b> alih-alih mengembalikan nilai khusus: <code>raise ValueError(\"minutes must be positive\")</code>. Skemanya sama: periksa dulu, keluar lebih awal." },
      java: { idiomaticNote: "Java yang idiomatis <b>melempar</b> exception: <code>throw new IllegalArgumentException(\"minutes must be positive\");</code>. Penjaganya tetap di atas." },
      rust: { idiomaticNote: "Rust yang idiomatis mengembalikan <code>Option&lt;f64&gt;</code>: <code>return None;</code> di setiap penjaga dan <code>Some(km / hours)</code> di akhir, sehingga pemanggil tidak bisa lupa memeriksa." },
      c: { idiomaticNote: "C tidak punya exception. Gaya yang umum mengembalikan kode galat dan mengirim hasilnya lewat pointer: <code>int speed_kmh(int d, int m, double *out)</code>." },
      cpp: { idiomaticNote: "C++ yang idiomatis melempar <code>std::invalid_argument</code> atau mengembalikan <code>std::optional&lt;double&gt;</code> dengan <code>std::nullopt</code> dari setiap penjaga." }
    },
    trace: {
      intro: "Contoh: <b>perhitungan kecepatan dari A1, dilindungi penjaga.</b> -1.0 berarti “masukan tidak valid”.",
      presets: [{ label: "Valid: 1500 m, 6 menit" }, { label: "Nol menit" }, { label: "Jarak negatif" }],
      run({ distance_m: d, minutes: m }) {
        const ev = [];
        const rows = [
          { test: "distance_m < 0", label: "-1.0", state: "" },
          { test: "minutes <= 0", label: "-1.0", state: "" },
          { test: "else: hitung", label: "speed", state: "" }
        ];
        let result = "?";
        const push = (step, msg, tone = "") => ev.push({
          step, msg, tone,
          view: { subject: { k: "input", v: `${d} m, ${m} menit` }, rows: rows.map((r) => ({ ...r })) },
          vars: [{ k: "distance_m", role: "fixed", v: d }, { k: "minutes", role: "fixed", v: m }, { k: "result", role: "result", v: result }]
        });
        push(null, "Siap. Apakah masukan aman untuk rumusnya?");
        if (d < 0) {
          rows[0].state = "hit"; rows[1].state = rows[2].state = "skipped";
          push(1, `Apakah ${d} < 0? Ya: jarak tidak mungkin negatif.`);
          result = "-1.0";
          push(2, "Langsung kembalikan -1.0. Rumusnya tidak pernah dijalankan.", "no");
          return ev;
        }
        rows[0].state = "miss";
        push(1, `Apakah ${d} < 0? Tidak, jaraknya aman.`);
        if (m <= 0) {
          rows[1].state = "hit"; rows[2].state = "skipped";
          push(1, `Apakah ${m} <= 0? Ya: membagi dengan waktu ini akan gagal.`);
          result = "-1.0";
          push(2, "Langsung kembalikan -1.0. Pembagian dengan nol tidak pernah terjadi.", "no");
          return ev;
        }
        rows[1].state = "miss";
        push(1, `Apakah ${m} <= 0? Tidak, waktunya aman.`);
        const speed = (d / 1000) / (m / 60);
        rows[2].state = "hit"; rows[2].label = f(speed);
        push(3, `Kedua penjaga lolos, jadi masukannya valid: ${d} / 1000 km ÷ ${m} / 60 jam = ${f(speed)}.`);
        result = f(speed);
        push(4, `Kembalikan ${f(speed)} km/jam.`, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Penjaga yang tidak keluar", text: "Mencatat masalahnya tetapi tetap jalan membuat masukan buruk tetap sampai ke rumus. Di sini jarak negatif menghasilkan kecepatan negatif, bukan -1.0.", take: "Penjaga harus kembali (atau memunculkan galat) agar sisa fungsi tidak pernah dijalankan." },
      { title: "Menjaga terlalu banyak", text: "Menolak <code>distance_m &lt;= 0</code> juga membuang jarak 0, padahal itu valid: diam di tempat berarti 0 km/jam.", take: "Jaga tepat masukan yang merusak perhitungan, dan uji batasnya." },
      { title: "Memeriksa setelah kerusakan terjadi", text: "Penjaga yang ditaruh setelah pembagian sudah terlambat: pembagian dengan nol sudah terjadi.", take: "Penjaga ditaruh paling atas." },
      { title: "Satu penjaga untuk satu masalah", text: "Pemeriksaan yang terpisah dan datar terbaca seperti daftar periksa. <code>if</code> yang bersarang dalam di sekitar kode utama lebih sulit diikuti." },
      { title: "Pilih jawaban yang tidak mungkin disalahartikan", text: "-1.0 bisa dipakai karena kecepatan tidak pernah negatif. Lebih baik lagi alat idiomatisnya: exception, <code>Option</code> di Rust, <code>std::optional</code> di C++." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}(3000, 0)?", options: ["-1.0", "0.0", "tak hingga", "galat"], explain: "Penjaga kedua menangkap minutes <= 0 dan mengembalikan -1.0 sebelum pembagian terjadi." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk (0, 10)?", options: ["0.0", "-1.0", "galat"], explain: "Penjaganya menolak distance_m <= 0, jadi jarak 0 yang valid dianggap galat. Jawaban yang benar 0.0 km/jam." },
      { q: "Mengapa penjaga ditaruh di bagian atas fungsi?", options: ["Lebih cepat diketik", "Agar masukan buruk tidak pernah sampai ke pekerjaan utama", "Diwajibkan compiler"], explain: "Setelah semua penjaga lolos, sisa fungsi boleh menganggap masukannya valid." }
    ],
    exercise: {
      title: "Giliran Anda: persentase yang aman",
      task: "Tulis <code>percent(part, whole)</code> yang mengembalikan part ÷ whole × 100. Kembalikan -1.0 jika <code>whole</code> 0 atau kurang, atau jika <code>part</code> negatif.",
      plan: ["Penjaga: whole 0 atau kurang? Kembalikan -1.0", "Penjaga: part negatif? Kembalikan -1.0", "Hitung part × 100 ÷ whole sebagai desimal", "Kembalikan hasilnya"]
    },
    compare: {
      intro: "Tiga skema seleksi. Penjaga adalah yang tugasnya <b>melindungi</b> sisa fungsi.",
      rows: [
        { name: "Penjaga", question: "Apakah masukannya bisa dipakai?", shape: "jika buruk: kembali dini; lalu pekerjaan utama, tanpa indentasi", result: "galat atau jawaban" },
        { name: "Pilih salah satu", question: "Gratis ongkir atau tidak?", shape: "if … else, kedua cabang adalah hasil normal", result: "salah satu dari 2 nilai" },
        { name: "Klasifikasi bertingkat", question: "Nilai huruf apa?", shape: "if … else if … else pada rentang terurut", result: "salah satu dari 3+ nilai" }
      ],
      table: {
        head: ["Skema", "Letaknya", "Cabang", "Yang terjadi sesudahnya"],
        rows: [
          ["Penjaga", "paling atas", "kasus buruk vs. lanjut", "pekerjaan utama, hanya untuk masukan valid"],
          ["Pilih salah satu", "di mana saja", "dua hasil normal", "kedua jalur lanjut atau kembali"],
          ["Klasifikasi bertingkat", "di mana saja", "tiga hasil atau lebih", "tepat satu cabang berjalan"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "perhitungan yang dilindungi" }, { why: "setiap penjaga adalah sebuah if" }],
      leadsTo: [{ why: "jaga rata-rata dari daftar kosong" }, { why: "minta ulang sampai masukannya valid" }]
    }
  };
})();
