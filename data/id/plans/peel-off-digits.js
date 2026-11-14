/* Bahasa Indonesia overlay for data/plans/peel-off-digits.js (D16). Text only. */
window.PLAN_ID = {
  title: "Kupas digit",
  highlight: "digit",
  aka: ["perulangan digit", "% 10 dan ÷ 10", "penguraian bilangan"],
  hero: { tag: "3725 % 10 = 5", alt: "Digit 3, 7, 2, 5; digit terakhir, 5, berwarna kuning sebagai yang sedang dikupas" },
  planCard: { name: "digit", lines: ["n = abs(n), total = 0", "digit terakhir: n % 10", "buang: n // 10"], foot: "↻ selama n > 0" },
  intent: "Urai bilangan bulat satu digit demi satu, dari kanan: % 10 memberi digit terakhir, dan pembagian bilangan bulat dengan 10 membuangnya.",
  analogy: { title: "Mengupas bawang", text: "Anda melepas lapisan terluar, melihatnya, lalu membuangnya; bawangnya kini satu lapis lebih kecil. Anda terus melakukannya sampai tidak ada yang tersisa. % 10 adalah melihat lapisan terluar; ÷ 10 adalah membuangnya." },
  cues: ["setiap digit dari …", "jumlah digit", "berapa banyak digit", "balikkan bilangannya", "digit terakhir"],
  cueSummary: "Masukannya <b>bilangan bulat</b>, dan pertanyaannya tentang <b>digit-digitnya</b>.",
  cueExamples: ["Berapa jumlah digit dari 3725?", "Ada berapa digit dalam sebuah bilangan?", "Balikkan digit 1234 menjadi 4321."],
  steps: [
    { title: "Siapkan: buang tandanya, mulai total dari 0", text: "Kerjakan dengan abs(n), sehingga -45 punya digit 4 dan 5." },
    { title: "Selama masih ada digit", text: "n > 0. Setelah digit terakhir dibuang, n menjadi 0." },
    { title: "Ambil digit terakhir dan pakai", text: "n % 10 adalah sisa bagi dengan 10: digit paling kanan." },
    { title: "Buang digit itu", text: "n // 10 (pembagian bilangan bulat) menghapus digit paling kanan." },
    { title: "Kembalikan hasilnya", text: "Di sini jumlah digitnya." }
  ],
  impl: {
    python: { plain: { note: "<code>//</code> sangat penting: <code>n / 10</code> memberi pecahan di Python 3, dan perulangannya akan kacau." }, idiomatic: { note: "Mengubah bilangan menjadi teks lalu membaca karakternya lebih ringkas, tetapi menyembunyikan aritmetikanya." } },
    java: { idiomatic: { note: "<code>c - '0'</code> mengubah karakter '7' menjadi bilangan 7." } },
    c: { idiomaticNote: "Perulangan % 10 / ÷ 10 adalah C yang idiomatis." },
    cpp: { idiomaticNote: "Perulangan % 10 / ÷ 10 adalah C++ yang idiomatis." }
  },
  trace: {
    intro: "Contoh: <b>Berapa jumlah digit sebuah bilangan?</b> Digitnya dikupas dari kanan.",
    presets: [{ label: "3725" }, { label: "-45" }, { label: "0" }],
    run({ n: start }) {
      let n = Math.abs(start);
      const digits = String(n).split("").map(Number);
      const ev = [], states = digits.map(() => "");
      let total = 0, peeled = 0;
      const snap = (step, msg, cur = -1, tone = "", digit = "—") => ev.push({ step, msg, tone,
        view: { values: digits, states: states.slice(), ptr: cur, noIdx: true },
        vars: [{ k: "n", role: "temp", v: n }, { k: "digit", role: "walker", v: digit }, { k: "total", role: "gatherer", v: total }] });
      snap(null, `Siap. Jumlahkan digit dari ${start}.`);
      snap(1, start < 0 ? `Buang tandanya: n = ${n}. total = 0.` : `n = ${n}, total = 0. Mulai.`);
      while (n > 0) {
        const pos = digits.length - 1 - peeled;
        snap(2, `Apakah n (${n}) > 0? Ya, masih ada digit.`, pos);
        const d = n % 10; total += d; states[pos] = "hit";
        snap(3, `Digit terakhir: ${n} % 10 = ${d}. total = ${total}.`, pos, "", d);
        n = Math.floor(n / 10); states[pos] = "skipped"; peeled++;
        snap(4, `Buang: n // 10 = ${n}.`, pos, "", d);
      }
      snap(2, start === 0 ? "Apakah n (0) > 0? Tidak: 0 tidak punya digit untuk dijumlahkan, jadi perulangan tidak pernah berjalan." : "Apakah n (0) > 0? Tidak, setiap digit sudah dikupas.");
      snap(5, `Kembalikan ${total}.`, -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Membuang digit sebelum memakainya", text: "Jika <code>n = n // 10</code> datang lebih dulu, digit terakhir terbuang tanpa dilihat, dan angka 0 tambahan ikut dijumlahkan di akhir: 123 memberi 2 + 1 + 0 = 3.", take: "Pakai digitnya (n % 10) dulu, baru buang (n // 10)." },
    { title: "Melupakan bilangan negatif", text: "Untuk -45, <code>while n &gt; 0</code> tidak pernah berjalan, jadi jumlahnya 0. (Dan % pada bilangan negatif berbeda antara Python dan bahasa lain.)", take: "Ambil abs(n) lebih dulu." },
    { title: "Memakai / di Python", text: "<code>n / 10</code> memberi 12.3, bukan 12. Perulangan lalu berjalan ratusan kali pada pecahan yang makin kecil.", take: "Pakai // untuk pembagian bilangan bulat di Python." },
    { title: "Perhatikan bilangan 0", text: "0 punya satu digit, tetapi perulangan tidak pernah berjalan untuknya. Untuk jumlah digit tidak masalah (0); untuk “berapa digit” perlu kasus khusus." },
    { title: "Bangun bilangan ke arah sebaliknya", text: "result = result × 10 + digit menambahkan digit di kanan. Digabung dengan mengupas, cara ini membalik bilangan: 1234 → 4321." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn}(9081)?", explain: "9 + 0 + 8 + 1 = 18. Digitnya dikupas sebagai 1, 8, 0, 9." },
    { q: "Berapa 3725 // 10?", explain: "Pembagian bilangan bulat dengan 10 membuang digit terakhir. (3725 % 10 akan memberi digit itu, 5.)" },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk 123?", explain: "Ia membuang setiap digit sebelum menjumlahkan: yang dijumlahkan digit dari 12, 1 dan 0, yaitu 2, 1 dan 0. Angka 3 tidak pernah dijumlahkan." }
  ],
  exercise: {
    title: "Giliran Anda: hitung digitnya",
    task: "Tulis <code>count_digits(n)</code> yang mengembalikan berapa digit yang dimiliki sebuah bilangan bulat. 0 punya satu digit, dan tandanya tidak dihitung.",
    plan: ["Buang tandanya; 0 adalah kasus khusus dengan satu digit", "Selama masih ada digit", "Hitung satu digit", "Buang dengan pembagian bilangan bulat, lalu kembalikan hitungannya"]
  },
  compare: {
    intro: "Dua skema yang dibangun di atas // dan %.",
    rows: [
      { name: "Kupas digit", question: "Jumlah digit dari 3725", shape: "perulangan: % 10 untuk digit terakhir, // 10 untuk membuangnya", result: "satu langkah per digit" },
      { name: "Pecah dengan div dan mod", question: "3725 detik dalam jam, menit, detik", shape: "langkah // dan % dalam jumlah tetap", result: "beberapa bagian" },
      { name: "Ulangi sampai tercapai", question: "Berapa kali dibagi dua sampai 1?", shape: "selama belum selesai: satu langkah, hitung", result: "sebuah hitungan" }
    ],
    table: {
      head: ["Skema", "Perulangan?", "Membagi dengan", "Berakhir saat"],
      rows: [
        ["Kupas digit", "ya", "10", "n mencapai 0"],
        ["Pecah dengan div dan mod", "tidak", "ukuran satuan", "—"],
        ["Ulangi sampai tercapai", "ya", "apa saja", "tujuan tercapai"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "pasangan // dan % yang sama, dipakai sekali" }, { why: "ulangi sampai bilangannya mencapai 0" }],
    leadsTo: [{ why: "jumlah digit yang ditulis secara rekursif" }]
  }
};
