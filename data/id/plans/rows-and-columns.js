/* Bahasa Indonesia overlay for data/plans/rows-and-columns.js (E1). Text only. */
window.PLAN_ID = {
  title: "Pola baris-kolom",
  highlight: "baris-kolom",
  aka: ["perulangan bersarang", "pola 2D", "perulangan baris demi baris"],
  hero: { tag: "baris 4: ****", alt: "Tangga kubus: satu kubus di baris pertama, dua di baris kedua, tiga di baris ketiga dan empat di baris keempat, dengan kubus terakhir berwarna kuning" },
  planCard: { name: "baris × kolom", lines: ["untuk setiap baris", "untuk setiap kolom", "cetak satu sel"], foot: "↵ akhiri baris" },
  intent: "Hasilkan sesuatu yang dua dimensi: perulangan luar menelusuri baris, perulangan dalam menelusuri kolom pada baris itu, dan setiap baris diakhiri dengan pindah baris.",
  analogy: { title: "Menulis di kertas bergaris", text: "Anda menulis karakter sepanjang satu garis dari kiri ke kanan, lalu pindah ke awal garis berikutnya dan mengulanginya. Pena yang bergerak sepanjang garis adalah perulangan dalam; pindah ke bawah halaman adalah perulangan luar." },
  cues: ["baris dan kolom", "petak / tabel / papan", "pola * atau #", "untuk setiap baris … untuk setiap kolom", "n × m", "tabel perkalian"],
  cueSummary: "Keluarannya <b>dua dimensi</b>: beberapa baris, dan setiap baris punya jumlah itemnya sendiri.",
  cueExamples: ["Cetak segitiga siku-siku bintang dengan n baris.", "Cetak tabel perkalian n × n.", "Gambar papan catur dari karakter # dan .."],
  steps: [
    { title: "Perulangan luar: satu putaran per baris", text: "row bernilai 1, 2, …, n." },
    { title: "Perulangan dalam: satu putaran per kolom pada baris ini", text: "Di sini nomor baris menentukan banyaknya kolom: baris 3 mendapat 3 bintang." },
    { title: "Cetak satu sel", text: "Cetak sebuah bintang tanpa pindah baris, agar seluruh baris tetap di satu garis." },
    { title: "Akhiri baris", text: "Setelah perulangan dalam selesai, cetak pindah baris. Baris ini ada di dalam perulangan luar tetapi di luar perulangan dalam." }
  ],
  impl: {
    python: { plain: { note: "<code>end=\"\"</code> mencegah <code>print</code> menambahkan pindah baris seperti biasanya." }, idiomatic: { note: "<code>\"*\" * row</code> mengulang string, menggantikan perulangan dalam. Perulangan dalam tetap terjadi; Python yang mengerjakannya." } },
    java: { plain: { note: "<code>print</code> tetap di baris yang sama; <code>println</code> mengakhirinya." }, idiomatic: { note: "<code>String.repeat</code> (Java 11+) membangun baris dalam satu panggilan." } },
    rust: { plain: { note: "Nomor kolomnya sendiri tidak dipakai, jadi menurut kebiasaan Rust namanya <code>_col</code>." }, idiomatic: { note: "<code>str::repeat</code> membangun baris; <code>as usize</code> mengubah nomor baris menjadi jumlah." } },
    c: { idiomaticNote: "C tidak punya fungsi pengulang string, jadi perulangan bersarang adalah cara idiomatisnya." },
    cpp: { idiomatic: { note: "<code>std::string(count, ch)</code> membangun string berisi <code>count</code> salinan <code>ch</code>." } }
  },
  trace: {
    intro: "Contoh: <b>Cetak segitiga siku-siku bintang dengan n baris</b>, baris 1 berisi satu bintang, baris 2 dua bintang, dan seterusnya.",
    presets: [{ label: "n = 4" }, { label: "n = 3" }, { label: "n = 6" }],
    run({ n }) {
      const ev = [];
      const cells = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (c <= r ? "used" : "")));
      let output = "", newlines = 0, stars = 0;
      const push = (step, msg, row, col, tone = "") => ev.push({
        step, msg, tone,
        view: { cells: cells.map((r) => r.slice()), output, row: row - 1, newlines },
        vars: [
          { k: "row", role: "stepper", v: row || "—", of: n },
          { k: "col", role: "stepper", v: col || "—", of: row || undefined },
          { k: "stars", role: "count", v: stars }
        ]
      });
      push(null, `Siap. n = ${n}, jadi segitiganya akan punya ${n} baris.`, 0, 0);
      for (let row = 1; row <= n; row++) {
        push(1, `Baris ${row} dimulai (row = ${row}). Baris ini perlu ${row} bintang.`, row, 0);
        for (let col = 1; col <= row; col++) {
          cells[row - 1][col - 1] = "current";
          push(2, `Kolom ${col} dari ${row} (col = ${col}).`, row, col);
          cells[row - 1][col - 1] = "filled";
          output += "*"; stars++;
          push(3, "Cetak * dan tetap di baris yang sama.", row, col);
        }
        output += "\n"; newlines++;
        const last = row === n;
        push(4, last ? `Baris ${row} selesai: cetak pindah baris. ${n === 1 ? "Satu-satunya baris" : `Semua ${n} baris`} sudah dicetak: total ${stars} bintang.` : `Baris ${row} selesai: cetak pindah baris dan lanjut ke baris berikutnya.`, row, 0, last ? "yes" : "");
      }
      return ev;
    }
  },
  pitfalls: [
    { title: "Pindah baris di dalam perulangan dalam", text: "Satu tingkat indentasi terlalu dalam, dan setiap bintang mendapat barisnya sendiri: hasilnya kolom tinggi, bukan segitiga.", take: "Pindah baris tempatnya setelah perulangan dalam, masih di dalam perulangan luar." },
    { title: "Perulangan dalam yang mengabaikan baris", text: "Mengulang kolom sampai <code>n</code> alih-alih <code>row</code> mencetak persegi n × n.", take: "Tanyakan: berapa kolom yang dimiliki baris yang ini?" },
    { title: "Memakai ulang variabel perulangan", text: "Di C atau Java, menulis <code>i</code> untuk kedua perulangan (atau berbagi satu variabel) membuat perulangan dalam menimpa penghitung perulangan luar.", take: "Beri setiap perulangan namanya sendiri, misalnya row dan col." },
    { title: "Hitung banyaknya kerja", text: "Bintang dicetak 1 + 2 + … + n = n(n+1)/2 kali. Untuk n = 1000 itu 500.500 kali cetak. Perulangan bersarang cepat membengkak." },
    { title: "Namai perulangan sesuai yang ditelusurinya", text: "<code>row</code> dan <code>col</code> menyatakan gunanya; <code>i</code> dan <code>j</code> tidak." }
  ],
  quiz: [
    { q: "Berapa total bintang yang dicetak {fn}(4)?", explain: "1 + 2 + 3 + 4 = 10. Setiap baris mencetak bintang sebanyak nomor barisnya." },
    { q: "Versi ini punya bug. Bentuk apa yang dicetak untuk n = 3?", options: ["segitiga", "persegi 3 × 3", "satu baris panjang"], explain: "Perulangan dalam selalu berjalan n kali, apa pun barisnya, jadi setiap baris berisi 3 bintang: persegi." },
    { q: "Jika pindah baris dipindahkan ke dalam perulangan dalam, berapa baris yang dicetak {fn}(3)?", explain: "Setiap bintang diikuti pindah baris, dan ada 1 + 2 + 3 = 6 bintang, jadi Anda mendapat 6 baris masing-masing satu bintang." }
  ],
  exercise: {
    title: "Giliran Anda: persegi panjang dari #",
    task: "Tulis <code>rectangle(rows, cols)</code> yang mencetak <code>rows</code> baris, masing-masing berisi <code>cols</code> karakter <code>#</code>. Kali ini setiap baris punya jumlah kolom yang sama.",
    plan: ["Perulangan luar: satu putaran per baris", "Perulangan dalam: satu putaran per kolom (sebanyak cols)", "Cetak satu # tanpa pindah baris", "Setelah perulangan dalam: akhiri baris"]
  },
  compare: {
    intro: "Skema perulangan yang mirip. Hitung perulangannya, dan periksa di mana perulangan dalam mulai dan berhenti.",
    rows: [
      { name: "Ulangi n kali", question: "Cetak satu baris berisi n bintang", shape: "satu perulangan", result: "1D: satu baris" },
      { name: "Pola baris-kolom", question: "Cetak segitiga atau petak", shape: "perulangan luar untuk baris, perulangan dalam untuk kolom setiap baris", result: "2D: baris-baris sel" },
      { name: "Bandingkan setiap pasangan", question: "Bandingkan setiap pasangan item sekali", shape: "perulangan dalam mulai tepat setelah indeks luar (j dari i + 1)", result: "setiap pasangan sekali" },
      { name: "Telusuri tabel 2D", question: "Jumlahkan setiap sel tabel", shape: "untuk setiap baris data, untuk setiap sel di baris itu", result: "mengunjungi data tersimpan" }
    ],
    table: {
      head: ["Skema", "Perulangan", "Perulangan dalam berjalan", "Tugas khas"],
      rows: [
        ["Ulangi n kali", "1", "—", "Cetak 5 bintang dalam satu baris"],
        ["Pola baris-kolom", "2, bersarang", "pada kolom baris saat ini", "Cetak tabel perkalian"],
        ["Bandingkan setiap pasangan", "2, bersarang", "dari i + 1 sampai akhir", "Cari dua bilangan yang jumlahnya 10"],
        ["Telusuri tabel 2D", "2, bersarang", "pada sel baris yang tersimpan", "Cari nilai terbesar dalam petak"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "masing-masing dari kedua perulangan adalah perulangan terhitung" }],
    leadsTo: [{ why: "perulangan dalam yang mulai setelah perulangan luar" }, { why: "dua perulangan yang sama pada data yang disimpan dalam petak" }]
  }
};
