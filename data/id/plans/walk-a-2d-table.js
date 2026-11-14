/* Bahasa Indonesia overlay for data/plans/walk-a-2d-table.js (E3). Text only. */
window.PLAN_ID = {
  title: "Telusuri tabel 2D",
  highlight: "tabel 2D",
  aka: ["penelusuran grid", "perulangan matriks", "list of lists"],
  hero: { tag: "for baris: for sel", alt: "Tangga kubus kecil yang mewakili baris dan sel sebuah tabel" },
  planCard: { name: "tabel 2D", lines: ["siapkan hasilnya", "untuk setiap baris", "untuk setiap sel: pakai"], foot: "→ kembalikan hasilnya" },
  intent: "Kunjungi setiap sel tabel yang disimpan sebagai baris-baris nilai: perulangan luar atas baris, perulangan dalam atas sel di baris sekarang, dan skema satu kali telusur apa pun di tengahnya.",
  analogy: { title: "Menjumlahkan lembar jam kerja", text: "Lembar jam kerja mingguan punya satu baris per orang dan satu kolom per hari. Untuk mendapat total jam, Anda menyusuri baris ke bawah dan, di setiap baris, menyusuri hari-harinya, menambahkan setiap angka ke total berjalan. Panjang setiap baris menentukan seberapa jauh Anda menyusurinya." },
  cues: ["tabel / grid / matriks", "baris dan kolom bilangan", "untuk setiap mahasiswa, untuk setiap mata kuliah", "setiap sel", "list of lists"],
  cueSummary: "Datanya <b>sudah tersimpan dalam dua dimensi</b>, dan Anda perlu mengunjungi setiap nilainya.",
  cueExamples: ["Berapa total semua bilangan dalam sebuah tabel?", "Berapa nilai tertinggi dari semua mahasiswa dan semua mata kuliah?", "Berapa kursi yang kosong di sebuah studio bioskop?"],
  steps: [
    { title: "Siapkan hasilnya", text: "Di sini total berjalan dimulai dari 0, seperti pada Akumulasi (D2)." },
    { title: "Perulangan luar: setiap baris", text: "Sebuah baris sendiri adalah daftar nilai." },
    { title: "Perulangan dalam: setiap sel di baris itu", text: "Susuri baris dari sel pertama sampai terakhir." },
    { title: "Pakai selnya", text: "Di sini: tambahkan ke total. Skema satu kali telusur apa pun bisa dipakai: menghitung, mencari terbesar, menguji." },
    { title: "Kembalikan hasilnya", text: "Setelah kedua perulangan, setiap sel sudah dikunjungi sekali." }
  ],
  impl: {
    python: { idiomatic: { note: "Jumlah setiap baris, lalu jumlah dari semuanya." } },
    java: { plain: { note: "<code>int[][]</code> adalah array berisi baris, dan setiap baris adalah <code>int[]</code>." }, idiomatic: { note: "<code>flatMapToInt</code> menggabungkan semua baris menjadi satu stream sel." } },
    rust: { idiomatic: { note: "<code>flatten</code> mengubah baris-baris menjadi satu urutan sel." } },
    c: { plain: { note: "Tabelnya disimpan baris demi baris dalam satu array. Sel (r, c) ada di posisi <code>r * cols + c</code>." }, idiomaticNote: "Dua perulangan indeks atas array baris demi baris adalah C yang idiomatis. (Tabel berukuran tetap juga bisa berupa <code>int grid[ROWS][COLS]</code>.)" },
    cpp: { idiomatic: { note: "<code>std::accumulate</code> mengerjakan perulangan dalam untuk setiap baris." } }
  },
  trace: {
    intro: "Contoh: <b>Berapa total semua bilangan dalam tabel?</b>",
    presets: [{ label: "Tabel 2 × 3" }, { label: "Tabel 3 × 3" }, { label: "Dengan bilangan negatif" }],
    run(grid) {
      const ev = [];
      const cols = Math.max(0, ...grid.map((r) => r.length));
      const cells = grid.map((r) => Array.from({ length: cols }, (_, c) => (c < r.length ? "used" : "")));
      const values = grid.map((r) => Array.from({ length: cols }, (_, c) => (c < r.length ? r[c] : "")));
      let total = 0, rowsDone = 0, log = "";
      const push = (step, msg, r = -1, c = -1, tone = "") => ev.push({ step, msg, tone,
        view: { cells: cells.map((x) => x.slice()), values, output: log, row: r, newlines: rowsDone },
        vars: [{ k: "row", role: "stepper", v: r >= 0 ? r : "—" }, { k: "cell", role: "walker", v: r >= 0 && c >= 0 ? grid[r][c] : "—" }, { k: "total", role: "gatherer", v: total }] });
      push(null, `Siap. ${grid.length} baris, ${grid.reduce((a, r) => a + r.length, 0)} sel.`);
      push(1, "Siapkan hasilnya: total = 0.");
      grid.forEach((row, r) => {
        push(2, `Baris ${r}: [${row.join(", ")}].`, r);
        row.forEach((v, c) => {
          cells[r][c] = "current";
          push(3, `Sel (${r}, ${c}) berisi ${v}.`, r, c);
          total += v; cells[r][c] = "filled"; log += `+ ${v} → ${total}\n`;
          push(4, `Tambahkan: total = ${total}.`, r, c);
        });
        rowsDone = r + 1;
      });
      push(5, `Setiap sel sudah dikunjungi. Kembalikan ${total}.`, -1, -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Mengatur ulang hasil di setiap baris", text: "Menaruh <code>total = 0</code> di dalam perulangan luar memulai total lagi di setiap baris, jadi hanya baris terakhir yang terhitung.", take: "Siapkan hasilnya sekali, sebelum kedua perulangan. (Hasil per baris memang sengaja disiapkan di dalam perulangan luar.)" },
    { title: "Menyusuri baris yang salah", text: "Menelusuri <code>grid[0]</code> di dalam perulangan luar mengunjungi baris pertama berulang-ulang, bukan baris sekarang.", take: "Perulangan dalam menyusuri baris sekarang." },
    { title: "Menganggap setiap baris sepanjang baris pertama", text: "Tabel di Python, Java, Rust dan C++ bisa punya baris dengan panjang berbeda. Mengindeks sampai panjang baris pertama bisa membaca melewati akhir baris yang lebih pendek.", take: "Telusuri sel milik setiap baris itu sendiri." },
    { title: "Tentukan di mana setiap hasil berada", text: "Hasil untuk seluruh tabel ditaruh sebelum kedua perulangan; hasil per baris ditaruh di dalam perulangan luar, sebelum perulangan dalam." },
    { title: "Perhatikan susunan di C", text: "Tabel C yang disimpan baris demi baris menaruh sel (r, c) di <code>r * cols + c</code>. Menukar r dan c membaca sel yang salah." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn}([[2, 4], [1, 1], [0, 3]])?", explain: "6 + 2 + 3 = 11: setiap sel di setiap baris dijumlahkan." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [[1, 2], [3, 4]]?", explain: "Perulangan dalam menyusuri grid[0] untuk setiap baris, jadi 1 + 2 dijumlahkan dua kali: 6." },
    { q: "Untuk mendapat satu total per baris, di mana total = 0 ditaruh?", options: ["Sebelum kedua perulangan", "Di dalam perulangan luar, sebelum perulangan dalam", "Di dalam perulangan dalam"], explain: "Setiap baris butuh total baru, jadi disiapkan di awal setiap putaran perulangan luar." }
  ],
  exercise: {
    title: "Giliran Anda: satu total per baris",
    task: "Tulis <code>row_totals(grid)</code> yang mengembalikan daftar berisi total setiap baris. (Di C: <code>size_t row_totals(const int cells[], size_t rows, size_t cols, int out[])</code>, mengembalikan banyaknya baris.)",
    plan: ["Mulai dengan daftar hasil kosong", "Perulangan luar: setiap baris; mulai total baris dari 0", "Perulangan dalam: tambahkan setiap sel ke total baris", "Setelah perulangan dalam, tambahkan total baris ke hasil", "Kembalikan hasilnya"]
  },
  compare: {
    intro: "Skema perulangan bersarang: dari mana datanya dan apa yang disusuri perulangan dalam.",
    rows: [
      { name: "Telusuri tabel 2D", question: "Total semua sel", shape: "untuk setiap baris tersimpan: untuk setiap sel di dalamnya", result: "mengunjungi data yang ada" },
      { name: "Pola baris-kolom", question: "Cetak segitiga bintang", shape: "for baris: for kolom, sambil mencetak", result: "membuat keluaran 2D" },
      { name: "Bandingkan setiap pasangan", question: "Adakah dua bilangan yang jumlahnya 10?", shape: "for i: for j dari i + 1, atas satu daftar", result: "pasangan dari satu daftar" }
    ],
    table: {
      head: ["Skema", "Data", "Perulangan dalam atas", "Pemakaian khas"],
      rows: [
        ["Telusuri tabel 2D", "list of lists", "sel di baris sekarang", "total, maksimum, hitungan dalam grid"],
        ["Pola baris-kolom", "tidak ada (dibangkitkan)", "kolom di baris yang sedang dicetak", "pola dan tabel"],
        ["Bandingkan setiap pasangan", "satu daftar", "item setelah i", "membandingkan item satu sama lain"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "perulangan luar untuk baris, perulangan dalam untuk kolom" }, { why: "skema yang dipakai pada setiap sel" }],
    leadsTo: [{ why: "cari sel terbesar alih-alih totalnya" }, { why: "bangun tabel baru dengan setiap sel diubah" }]
  }
};
