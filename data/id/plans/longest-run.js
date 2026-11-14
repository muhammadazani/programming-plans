/* Bahasa Indonesia overlay for data/plans/longest-run.js (D13). Text only. */
(function () {
  const HOT = 30;

  window.PLAN_ID = {
    title: "Rangkaian terpanjang",
    highlight: "terpanjang",
    aka: ["streak terpanjang", "rangkaian berturut-turut", "sekarang dan terbaik"],
    hero: { tag: "longest = 2", alt: "Suhu lima hari; hari panas 31, 32 membentuk satu rangkaian dan 33, 34 rangkaian lain, dipisahkan hari sejuk bersuhu 20" },
    planCard: { name: "rangkaian", lines: ["current = longest = 0", "lolos? current + 1, mungkin rekor", "gagal? current = 0"], foot: "→ kembalikan longest" },
    intent: "Cari rangkaian terpanjang item berturut-turut yang lolos uji: simpan rangkaian sekarang yang bertambah atau diatur ulang, dan ingat rangkaian terbaik sejauh ini.",
    analogy: { title: "Streak harian di aplikasi belajar bahasa", text: "Berlatih hari ini dan streak Anda naik satu; bolos sehari dan streak kembali ke 0. Aplikasinya juga mengingat rekor Anda, streak terpanjang yang pernah Anda capai, yang hanya berubah saat streak sekarang mengalahkannya." },
    cues: ["berturut-turut", "berurutan", "streak", "rangkaian terpanjang", "tanpa putus"],
    cueSummary: "Jawabannya adalah <b>seberapa panjang rangkaian tak terputus terpanjang</b> dari item yang lolos.",
    cueExamples: ["Berapa rangkaian hari terpanjang dengan suhu di atas 30 °C?", "Berapa rekor kemenangan beruntun tim itu?", "Paling banyak berapa “angka” berturut-turut dalam daftar lemparan koin?"],
    steps: [
      { title: "Mulai rangkaian sekarang dan rekor dari 0", text: "Dua variabel: satu untuk streak yang sedang berlangsung, satu untuk yang terbaik." },
      { title: "Kunjungi setiap item", text: "Berurutan: rangkaian berkaitan dengan tetangga." },
      { title: "Lolos? Perpanjang rangkaian sekarang", text: "Di sini: hari di atas 30 °C menambah satu ke streak sekarang." },
      { title: "Mengalahkan rekor? Perbarui", text: "Periksa tepat setelah memperpanjang, agar rangkaian di paling akhir tetap terhitung." },
      { title: "Gagal? Rangkaiannya putus", text: "Kembali ke 0. Rekornya tetap." },
      { title: "Kembalikan rekornya", text: "Rangkaian terpanjang yang ditemukan." }
    ],
    impl: {
      python: { idiomatic: { note: "<code>groupby</code> memotong daftar menjadi rangkaian berkunci sama (panas / tidak panas); lalu ambil rangkaian panas terpanjang." } },
      java: { idiomaticNote: "Tidak ada pencari streak bawaan; perulangan dua variabel adalah Java yang idiomatis." },
      rust: { plain: { note: "<code>longest.max(current)</code> adalah langkah 4 dalam satu panggilan." }, idiomaticNote: "Perulangan dua variabel adalah Rust yang idiomatis; versi <code>fold</code> ada, tetapi lebih sulit dibaca." },
      c: { idiomaticNote: "Perulangan dua variabel adalah C yang idiomatis." },
      cpp: { idiomaticNote: "Perulangan dua variabel adalah C++ yang idiomatis." }
    },
    trace: {
      intro: "Contoh: <b>Berapa rangkaian hari terpanjang dengan suhu di atas 30 °C?</b>",
      input: { placeholder: "suhu: 31, 32, 20, 33" },
      presets: [{ label: "Rangkaian di akhir" }, { label: "Tidak pernah panas" }, { label: "Rangkaian terputus" }],
      run(list) {
        const ev = [], states = list.map(() => ""), badges = list.map(() => "");
        let current = 0, longest = 0;
        const snap = (step, msg, cur = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur, badges: badges.slice() },
          vars: [{ k: "t", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "current", role: "count", v: current }, { k: "longest", role: "best", v: longest }] });
        snap(null, list.length ? "Siap. Cari rangkaian hari panas terpanjang." : "Siap. Tidak ada hari.");
        snap(1, "Mulai: current = 0, longest = 0.");
        list.forEach((t, i) => {
          states[i] = "current"; snap(2, `Kunjungi hari [${i}]: ${t} °C.`, i);
          if (t > HOT) {
            current++; states[i] = "hit"; badges[i] = `ke-${current}`;
            snap(3, `${t} > ${HOT}: panas, jadi rangkaian sekarang bertambah menjadi ${current}.`, i);
            if (current > longest) { longest = current; snap(4, `Rekor baru: longest = ${longest}.`, i); }
          } else {
            states[i] = "miss";
            snap(5, `${t} tidak di atas ${HOT}: rangkaiannya putus, current = 0. Rekornya tetap ${longest}.`, i);
            current = 0;
          }
        });
        snap(6, `Kembalikan ${longest}.`, -1, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Memperbarui rekor hanya saat rangkaian putus", text: "Jika rekor hanya diperiksa ketika hari sejuk mengakhiri rangkaian, rangkaian yang berlangsung sampai paling akhir tidak pernah tercatat.", take: "Periksa rekor setiap kali rangkaian sekarang bertambah." },
      { title: "Lupa mengatur ulang", text: "Tanpa <code>current = 0</code> pada item yang gagal, “rangkaian” terus menghitung melewati putusnya, sehingga yang terhitung justru semua hari panas.", take: "Item yang gagal mengembalikan rangkaian sekarang ke 0." },
      { title: "Mengatur ulang rekor, bukan rangkaiannya", text: "Rekor harus bertahan saat rangkaian putus; hanya rangkaian sekarang yang dimulai lagi.", take: "Dua variabel, dua tugas berbeda." },
      { title: "Uji rangkaian di awal, tengah dan akhir", text: "[35, 20, 20], [20, 35, 20] dan [20, 20, 35] menangkap sebagian besar bug rangkaian." },
      { title: "Hitung juga banyaknya rangkaian, jika perlu", text: "Menambah satu ke penghitung rangkaian setiap kali <code>current</code> menjadi 1 memberi tahu berapa rangkaian terpisah yang ada." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}([33, 20, 31, 32, 34, 25])?", explain: "Rangkaian hari panas: [33] (1) dan [31, 32, 34] (3). Yang terpanjang 3." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk [31, 20, 32]?", explain: "Hari sejuk tidak pernah mengatur ulang current, jadi ia mencapai 2 pada hari terakhir, padahal tidak ada dua hari panas yang bersebelahan." },
      { q: "Setelah hari dingin, apa yang terjadi pada longest?", options: ["Kembali ke 0", "Nilainya tetap"], explain: "Hanya rangkaian sekarang yang diatur ulang. Rekor mengingat rangkaian terbaik sejauh ini." }
    ],
    exercise: {
      title: "Giliran Anda: rangkaian terpanjang sebuah nilai",
      task: "Tulis <code>longest_run_of(numbers, target)</code> yang mengembalikan panjang rangkaian terpanjang item yang sama dengan <code>target</code>.",
      plan: ["Mulai current dan longest dari 0", "Kunjungi setiap bilangan", "Sama dengan target? Perpanjang rangkaian sekarang", "Mengalahkan rekor? Perbarui", "Jika tidak, atur ulang rangkaian sekarang, dan akhirnya kembalikan rekornya"]
    },
    compare: {
      intro: "Tiga skema pada suhu <code>[31, 32, 20, 33, 34, 35]</code>.",
      rows: [
        { name: "Rangkaian terpanjang", question: "Rangkaian hari terpanjang di atas 30?" },
        { name: "Menghitung", question: "Berapa hari di atas 30?" },
        { name: "Nilai terbesar / terkecil", question: "Hari terpanas?" }
      ],
      table: {
        head: ["Skema", "Variabel", "Diatur ulang?", "Mengembalikan"],
        rows: [
          ["Rangkaian terpanjang", "rangkaian sekarang + rekor", "rangkaian sekarang, pada item yang gagal", "rangkaian terpanjang"],
          ["Menghitung", "satu penghitung", "tidak pernah", "berapa yang lolos"],
          ["Nilai terbesar / terkecil", "terbaik sejauh ini", "tidak pernah", "nilai terbaik"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "rangkaian sekarang adalah penghitung" }, { why: "rekornya adalah terbaik sejauh ini" }],
      leadsTo: [{ why: "rangkaian kenaikan membandingkan setiap item dengan sebelumnya" }]
    }
  };
})();
