/* Bahasa Indonesia overlay for data/plans/count-per-category.js (D14). Text only. */
(function () {
  const LABELS = ["A", "B", "C", "D"];
  const cat = (s) => (s >= 85 ? 0 : s >= 70 ? 1 : s >= 55 ? 2 : 3);

  window.PLAN_ID = {
    title: "Hitung per kategori",
    highlight: "per kategori",
    aka: ["tally per kelompok", "histogram", "satu penghitung per wadah"],
    hero: { tag: "A:2 B:1 C:1 D:1", alt: "Lima nilai diwarnai menurut nilai hurufnya, dengan label yang memperlihatkan hitungan setiap nilai huruf" },
    planCard: { name: "per kategori", lines: ["satu penghitung per kategori", "setiap item: tentukan kategorinya", "tambah satu ke penghitung itu"], foot: "→ kembalikan semua penghitung" },
    intent: "Hitung berapa item yang masuk ke setiap kategori sekaligus: simpan satu penghitung per kategori dan tambahkan ke penghitung yang tepat untuk setiap item.",
    analogy: { title: "Menghitung suara", text: "Setiap kandidat punya tumpukannya sendiri. Anda mengambil surat suara satu per satu dan menaruhnya di tumpukan kandidat yang dipilih. Saat kotak suara kosong, tinggi setiap tumpukan adalah perolehan kandidat itu, semuanya dari satu kali menelusuri surat suara." },
    cues: ["berapa banyak di setiap …", "untuk setiap kategori, hitung", "sebaran", "rincian menurut …", "tally"],
    cueSummary: "Jawabannya <b>beberapa hitungan</b>, satu per kategori, dari sekali telusur data.",
    cueExamples: ["Berapa banyak nilai A, B, C dan D?", "Berapa data yang rendah, normal dan tinggi?", "Berapa pesanan yang masuk setiap bulan?"],
    steps: [
      { title: "Satu penghitung per kategori, semuanya 0", text: "Di sini daftar berisi empat: [A, B, C, D]." },
      { title: "Kunjungi setiap item", text: "Sekali. Semua kategori dihitung dalam telusur yang sama." },
      { title: "Tentukan kategorinya", text: "Di sini dengan rentang nilai dari Klasifikasi bertingkat (B3)." },
      { title: "Tambah satu ke penghitung kategori itu", text: "Tepat satu penghitung berubah untuk setiap item." },
      { title: "Kembalikan semua penghitung", text: "Jumlah semuanya sama dengan banyaknya item." }
    ],
    impl: {
      python: { idiomatic: { note: "Memindahkan “kategori yang mana?” ke fungsinya sendiri (G1) menyisakan perulangan dua baris." } },
      java: { plain: { note: "<code>new int[4]</code> memulai setiap penghitung dari 0." }, idiomaticNote: "Array penghitung adalah Java yang idiomatis. Dengan kategori bernama, <code>EnumMap</code> atau <code>Collectors.groupingBy(…, counting())</code> melakukan hal yang sama." },
      rust: { plain: { note: "Menentukan indeks dulu, lalu menambah sekali, menghindari pengulangan <code>counts[…] += 1</code> empat kali." }, idiomaticNote: "Vektor penghitung adalah Rust yang idiomatis; dengan kategori berupa string, <code>HashMap</code> dan <code>entry().or_insert(0)</code> melakukan hal yang sama (D15)." },
      c: { plain: { note: "Pemanggil mengirim array berisi 4 penghitung; fungsi mengembalikan banyaknya." }, idiomaticNote: "Array penghitung adalah C yang idiomatis." },
      cpp: { idiomaticNote: "Vector (atau <code>std::array&lt;int, 4&gt;</code>) penghitung adalah C++ yang idiomatis." }
    },
    trace: {
      intro: "Contoh: <b>Berapa banyak nilai A, B, C dan D?</b> A untuk 85 ke atas, B 70 ke atas, C 55 ke atas, dan D di bawah 55.",
      input: { placeholder: "nilai: 90, 72, 60" },
      presets: [{ label: "Kelas campuran" }, { label: "Nilai batas" }, { label: "Kelas kosong" }],
      run(list) {
        const ev = [], states = list.map(() => ""), badges = list.map(() => ""), counts = [0, 0, 0, 0];
        const snap = (step, msg, cur = -1, tone = "", fresh = -1) => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur, badges: badges.slice(), out: { label: "counts", items: counts.map((c, k) => `${LABELS[k]}:${c}`), fresh } },
          vars: [{ k: "s", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "item terhitung", role: "count", v: counts.reduce((a, b) => a + b, 0) }] });
        snap(null, list.length ? `Siap. Ada ${list.length} nilai untuk dikelompokkan.` : "Siap. Tidak ada nilai.");
        snap(1, "Satu penghitung per nilai huruf, semuanya 0.");
        list.forEach((s, i) => {
          states[i] = "current"; snap(2, `Kunjungi nilai [${i}]: ${s}.`, i);
          const k = cat(s); badges[i] = LABELS[k];
          snap(3, `${s} mendapat ${LABELS[k]}${k < 3 ? ` (setidaknya ${[85, 70, 55][k]})` : " (di bawah 55)"}.`, i);
          counts[k]++; states[i] = "added";
          snap(4, `Tambah satu ke penghitung ${LABELS[k]}: ${LABELS[k]} = ${counts[k]}.`, i, "", k);
        });
        snap(5, `Kembalikan [${counts.join(", ")}]: total ${counts.reduce((a, b) => a + b, 0)} nilai.`, -1, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "if terpisah alih-alih else-if", text: "Dengan <code>if</code> terpisah, nilai 90 lolos “≥ 85”, “≥ 70” <em>dan</em> “≥ 55”, jadi terhitung tiga kali.", take: "Setiap item masuk ke tepat satu kategori: pakai else-if (B3)." },
      { title: "Mengatur ulang penghitung di dalam perulangan", text: "Memulai penghitung lagi untuk setiap item membuat hanya item terakhir yang terhitung.", take: "Siapkan penghitung sekali, sebelum perulangan." },
      { title: "Satu perulangan per kategori", text: "Empat perulangan hitung yang terpisah memberi jawaban benar, tetapi membaca data empat kali dan mengulang kode yang sama.", take: "Satu perulangan, satu penghitung per kategori." },
      { title: "Periksa totalnya", text: "Penghitung harus berjumlah sama dengan banyaknya item. Jika tidak, ada item yang terhitung dua kali atau terlewat." },
      { title: "Pakai dictionary untuk kategori yang terbuka", text: "Jika kategorinya tidak diketahui sebelumnya (kata, nama), hitung dengan dictionary: itulah Hitung kemunculan (D15)." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}([85, 84, 30])?", explain: "85 mendapat A, 84 mendapat B, 30 mendapat D. [1 A, 1 B, 0 C, 1 D]." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk [90]?", explain: "90 lolos tiga uji terpisah yang pertama, jadi tiga penghitung naik untuk satu nilai." },
      { q: "Untuk 12 nilai, berapa jumlah keempat penghitung?", explain: "Setiap nilai masuk ke tepat satu kategori, jadi jumlah penghitung selalu sama dengan banyaknya item." }
    ],
    exercise: {
      title: "Giliran Anda: negatif, nol, positif",
      task: "Tulis <code>count_signs(numbers)</code> yang mengembalikan [berapa yang negatif, berapa yang nol, berapa yang positif].",
      plan: ["Tiga penghitung, semuanya 0", "Kunjungi setiap bilangan", "Tentukan kategorinya: di bawah 0, sama dengan 0, atau di atas 0", "Tambah satu ke penghitung itu", "Kembalikan ketiga penghitung"]
    },
    compare: {
      intro: "Skema menghitung, dari satu penghitung sampai banyak.",
      rows: [
        { name: "Hitung per kategori", question: "Berapa banyak setiap nilai huruf?", shape: "sekumpulan penghitung tetap, satu per kategori yang diketahui", result: "beberapa hitungan" },
        { name: "Menghitung", question: "Berapa yang lulus?", shape: "satu penghitung", result: "satu hitungan" },
        { name: "Hitung kemunculan", question: "Seberapa sering setiap kata muncul?", shape: "dictionary dari setiap nilai yang ditemui ke hitungannya", result: "satu hitungan per nilai berbeda" }
      ],
      table: {
        head: ["Skema", "Kategori diketahui sebelumnya?", "Penyimpanan", "Hasil"],
        rows: [
          ["Hitung per kategori", "ya, beberapa", "list / array penghitung", "satu hitungan per kategori"],
          ["Menghitung", "hanya lolos / gagal", "satu variabel", "satu hitungan"],
          ["Hitung kemunculan", "tidak, nilai apa pun", "dictionary / map", "satu hitungan per nilai yang ditemui"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "setiap kategori punya penghitung" }, { why: "menentukan kategorinya" }],
      leadsTo: [{ why: "jika kategorinya tidak diketahui sebelumnya" }]
    }
  };
})();
