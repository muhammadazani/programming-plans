/* Bahasa Indonesia overlay for data/plans/every-pair.js (E2). Text only. */
(function () {
  const TARGET = 10;

  window.PLAN_ID = {
    title: "Bandingkan setiap pasangan",
    highlight: "setiap pasangan",
    aka: ["semua pasangan", "perulangan bersarang i < j", "perbandingan berpasangan"],
    hero: { tag: "j mulai dari i + 1", alt: "Tangga kubus: setiap baris berkurang satu kubus, pasangan-pasangan di atas diagonal" },
    planCard: { name: "setiap pasangan", lines: ["untuk setiap item i", "untuk setiap item j sesudahnya", "uji pasangan (i, j)"], foot: "→ setiap pasangan tepat sekali" },
    intent: "Lihat setiap pasangan item tepat sekali: perulangan dalam dimulai tepat setelah item luar, sehingga tidak ada item yang dipasangkan dengan dirinya sendiri dan tidak ada pasangan yang dilihat dua kali.",
    analogy: { title: "Semua orang bersalaman sekali", text: "Di sebuah pesta, setiap tamu bersalaman dengan setiap tamu lain tepat sekali. Tamu pertama bersalaman dengan semua orang sesudahnya; tamu kedua dengan semua orang sesudahnya (ia sudah bersalaman dengan tamu pertama); dan seterusnya. Tidak ada yang bersalaman dengan dirinya sendiri." },
    cues: ["dua … mana saja", "setiap pasangan", "dua item yang …", "setiap kombinasi dua", "bandingkan semua dengan semua"],
    cueSummary: "Pertanyaannya tentang <b>dua item sekaligus</b>, dan setiap kombinasi dua harus dipertimbangkan.",
    cueExamples: ["Adakah dua bilangan yang jumlahnya 10?", "Adakah dua orang di kelas yang tingginya sama?", "Dua kota mana yang paling berdekatan?"],
    steps: [
      { title: "Perulangan luar: setiap item i", text: "Item pertama dari pasangan." },
      { title: "Perulangan dalam: setiap item j sesudahnya", text: "j mulai dari i + 1, jadi (i, i) dan ulangan seperti (j, i) dilewati." },
      { title: "Uji pasangannya", text: "Di sini: apakah numbers[i] dan numbers[j] berjumlah 10?" },
      { title: "Cocok? Jawab ya dan berhenti", text: "Satu pasangan sudah cukup, seperti pada “Adakah?” (D7)." },
      { title: "Tidak ada pasangan sama sekali? Jawab tidak", text: "Hanya setelah kedua perulangan selesai." }
    ],
    impl: {
      python: { idiomatic: { note: "<code>combinations(numbers, 2)</code> menghasilkan tepat pasangan dengan i &lt; j." } },
      java: { idiomaticNote: "Dua perulangan indeks adalah Java yang idiomatis; versi stream lebih sulit dibaca." },
      rust: { idiomatic: { note: "<code>numbers[i + 1..]</code> berarti “item-item setelah i”: perulangan dalam sebagai slice." } },
      c: { idiomaticNote: "Dua perulangan indeks adalah C yang idiomatis." },
      cpp: { idiomaticNote: "Dua perulangan indeks adalah C++ yang idiomatis." }
    },
    trace: {
      intro: "Contoh: <b>Adakah dua bilangan dalam daftar yang jumlahnya 10?</b> Baris i, kolom j adalah pasangan (numbers[i], numbers[j]); hanya sel di kanan diagonal yang dikunjungi.",
      input: { placeholder: "bilangan: 3, 8, 1, 7" },
      presets: [{ label: "Pasangan di akhir" }, { label: "Tidak ada pasangan" }, { label: "Bilangan yang sama" }],
      run(list) {
        const n = list.length, ev = [];
        const cells = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (c > r ? "used" : "")));
        const values = Array.from({ length: n }, () => Array.from({ length: n }, () => ""));
        let log = "", rowsDone = 0;
        const push = (step, msg, i = -1, j = -1, tone = "") => ev.push({ step, msg, tone,
          view: { cells: cells.map((r) => r.slice()), values: values.map((r) => r.slice()), output: log, row: i, newlines: rowsDone },
          vars: [{ k: "i", role: "stepper", v: i >= 0 ? i : "—" }, { k: "j", role: "stepper", v: j >= 0 ? j : "—" }, { k: "sum", role: "temp", v: i >= 0 && j >= 0 ? list[i] + list[j] : "—" }] });
        push(null, n > 1 ? `Siap. ${n} bilangan membentuk ${(n * (n - 1)) / 2} pasangan.` : "Siap. Kurang dari dua bilangan: tidak ada pasangan.");
        for (let i = 0; i < n; i++) {
          push(1, `Perulangan luar: i = ${i} (bilangan ${list[i]}).`, i);
          for (let j = i + 1; j < n; j++) {
            cells[i][j] = "current";
            push(2, `Perulangan dalam: j = ${j}, dimulai setelah i.`, i, j);
            const s = list[i] + list[j]; values[i][j] = s;
            log += `${list[i]} + ${list[j]} = ${s}${s === TARGET ? " ✓" : ""}\n`;
            if (s === TARGET) {
              cells[i][j] = "current";
              push(3, `${list[i]} + ${list[j]} = ${s}. Itulah targetnya.`, i, j);
              push(4, "Ketemu pasangan: jawab True dan berhenti. Pasangan sisanya tidak pernah diperiksa.", i, j, "yes");
              return ev;
            }
            cells[i][j] = "filled";
            push(3, `${list[i]} + ${list[j]} = ${s}, bukan ${TARGET}.`, i, j);
          }
          rowsDone = i + 1;
        }
        push(5, n > 1 ? "Setiap pasangan sudah diperiksa, tidak ada yang jumlahnya sama dengan target. Jawab False." : "Tidak ada pasangan untuk diperiksa. Jawab False.", -1, -1, "no");
        return ev;
      }
    },
    pitfalls: [
      { title: "Memasangkan item dengan dirinya sendiri", text: "Jika j mulai dari 0, perulangan dalam juga mengunjungi j = i. Maka [5, 1] “punya” pasangan berjumlah 10: angka 5 dengan dirinya sendiri.", take: "Mulai perulangan dalam dari i + 1." },
      { title: "Menyerah di dalam perulangan", text: "<code>else: return False</code> di dalam perulangan dalam menjawab setelah pasangan pertama.", take: "“Tidak” tempatnya setelah kedua perulangan." },
      { title: "Memeriksa setiap pasangan dua kali", text: "Memulai j dari 0 (dan melewati j == i) tetap memeriksa (i, j) dan (j, i): kerja dua kali lipat, dan hitungan ganda jika Anda menghitung pasangan.", take: "j dari i + 1 melihat setiap pasangan tepat sekali." },
      { title: "Ketahui biayanya", text: "n item punya n(n − 1)/2 pasangan: 45 untuk 10 item, tetapi sekitar 5 juta untuk 3 200 item. Untuk daftar besar, skema yang lebih cerdas (mengurutkan, atau mengingat yang sudah dilihat) lebih baik." },
      { title: "Pakai ulang skema satu item di dalamnya", text: "Uji di dalam bisa menghitung pasangan (D1), mencari pasangan terbaik (D4), atau berhenti pada yang pertama (D7), sama seperti dengan item tunggal." }
    ],
    quiz: [
      { q: "Berapa pasangan yang diperiksa skema ini untuk daftar berisi 5 item (jika tidak ada yang cocok)?", explain: "5 × 4 / 2 = 10: setiap pasangan sekali, dan tidak ada item dengan dirinya sendiri." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk [5, 1] dan target 10?", explain: "j mulai dari 0, jadi i = 0, j = 0 memasangkan 5 dengan dirinya sendiri: 5 + 5 = 10." },
      { q: "Mengapa j mulai dari i + 1?", options: ["Untuk melewati pasangan item dengan dirinya sendiri dan pasangan yang terlihat dua kali", "Karena array dimulai dari 1", "Agar perulangannya lebih cepat diketik"], explain: "Pasangan dengan j ≤ i adalah item itu sendiri atau pasangan yang sudah dilihat dengan urutan terbalik." }
    ],
    exercise: {
      title: "Giliran Anda: hitung pasangan yang sama",
      task: "Tulis <code>count_equal_pairs(numbers)</code> yang mengembalikan berapa pasangan posisi (i < j) yang berisi nilai sama. [1, 2, 1, 1] punya 3 pasangan seperti itu.",
      plan: ["Mulai penghitung dari 0", "Perulangan luar: setiap posisi i", "Perulangan dalam: setiap posisi j sesudahnya", "Nilainya sama? Hitung pasangannya", "Kembalikan penghitung setelah kedua perulangan"]
    },
    compare: {
      intro: "Skema perulangan bersarang, dibedakan dari tempat perulangan dalam dimulai dan apa yang ditelusurinya.",
      rows: [
        { name: "Bandingkan setiap pasangan", question: "Adakah dua bilangan yang jumlahnya 10?", shape: "for i: for j dari i + 1", result: "setiap pasangan sekali" },
        { name: "Pola baris-kolom", question: "Cetak segitiga bintang", shape: "for baris: for kolom sampai lebar baris", result: "keluaran 2D" },
        { name: "Bandingkan dengan sebelumnya", question: "Apakah harganya naik?", shape: "satu perulangan: item i dengan item i − 1", result: "hanya pasangan tetangga" }
      ],
      table: {
        head: ["Skema", "Perulangan", "Pasangan yang dilihat", "Untuk n item"],
        rows: [
          ["Bandingkan setiap pasangan", "2, bersarang", "semua pasangan", "n(n − 1)/2 pemeriksaan"],
          ["Pola baris-kolom", "2, bersarang", "—", "satu sel per baris × kolom"],
          ["Bandingkan dengan sebelumnya", "1", "hanya tetangga", "n − 1 pemeriksaan"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "perulangan luar dan dalam" }, { why: "berhenti pada pasangan pertama yang cocok" }],
      leadsTo: [{ why: "pengurutan dengan memilih terkecil membandingkan setiap item dengan item sesudahnya" }, { why: "mengingat yang sudah dilihat menghindari memeriksa setiap pasangan" }]
    }
  };
})();
