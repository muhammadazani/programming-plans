/* Bahasa Indonesia overlay for data/plans/selection-sort.js (F3). Text only. */
window.PLAN_ID = {
  title: "Urutkan dengan memilih terkecil",
  highlight: "terkecil",
  aka: ["selection sort", "pengurutan sederhana", "pengurutan di tempat"],
  hero: { tag: "terkecil berikutnya: 5", alt: "Sederet angka yang sedang diurutkan: 1 dan 2 sudah di tempatnya, dan 5 berwarna kuning sebagai yang terkecil berikutnya untuk dipindah" },
  planCard: { name: "selection sort", lines: ["untuk setiap posisi i", "cari yang terkecil mulai dari i", "tukar ke posisi i"], foot: "→ bagian kiri makin terurut" },
  intent: "Urutkan daftar dengan berulang kali mencari item terkecil yang tersisa dan menukarnya ke posisi berikutnya dari kiri.",
  analogy: { title: "Mengurutkan kartu di tangan", text: "Jajarkan kartunya. Cari kartu terendah dan tukar ke tempat pertama. Dari kartu yang tersisa, cari yang terendah dan tukar ke tempat kedua. Teruskan; bagian terurut di kiri bertambah satu kartu setiap kali." },
  cues: ["urutkan", "berurutan", "dari terkecil ke terbesar", "susun", "peringkat"],
  cueSummary: "Itemnya harus <b>disusun berurutan</b>. (Dalam kode sungguhan Anda memanggil fungsi pengurutan pustaka; skema ini memperlihatkan cara kerja pengurutan.)",
  cueExamples: ["Urutkan daftar nilai dari terendah ke tertinggi.", "Susun pelari menurut waktu finisnya.", "Susun kata-kata menurut abjad."],
  steps: [
    { title: "Kerjakan pada salinan", text: "Agar daftar milik pemanggil tidak berubah." },
    { title: "Untuk setiap posisi i, dari kiri", text: "Semua yang di kiri i sudah terurut." },
    { title: "Cari posisi item terkecil dari i sampai akhir", text: "Ini Posisi terbesar (D5), yang mencari terkecil." },
    { title: "Tukar ke posisi i", text: "Tukar dengan temp (A2). Sekarang posisi 0 sampai i sudah terurut." },
    { title: "Kembalikan salinan yang terurut", text: "Setelah posisi terakhir, semuanya berurutan." }
  ],
  impl: {
    python: { idiomatic: { note: "Dalam kode sungguhan, pakai <code>sorted()</code> (atau <code>list.sort()</code>): jauh lebih cepat untuk daftar besar." } },
    java: { idiomatic: { note: "Atau <code>Arrays.sort(copy)</code> untuk mengurutkan array di tempat." } },
    rust: { plain: { note: "<code>swap(i, smallest)</code> adalah tukar tiga langkah (A2) yang sudah ada di slice." } },
    c: { idiomatic: { note: "<code>qsort</code> dari pustaka standar butuh fungsi pembanding, seperti <code>bsearch</code>." } }
  },
  trace: {
    intro: "Contoh: <b>Urutkan daftar dari terkecil ke terbesar.</b> Kotak hijau sudah berada di tempat akhirnya.",
    input: { placeholder: "bilangan: 7, 2, 9, 1" },
    presets: [{ label: "Empat bilangan" }, { label: "Ada yang berulang" }, { label: "Sudah terurut" }],
    run(raw) {
      const a = raw.slice(), n = a.length, ev = [];
      let sortedUpTo = 0, smallest = -1;
      const snap = (step, msg, ptr = -1, tone = "", j = -1) => ev.push({ step, msg, tone,
        view: { values: a.slice(), ptr, states: a.map((_, k) => (k < sortedUpTo ? "added" : k === smallest ? "best" : k === j ? "current" : "")), badges: a.map((_, k) => (k === smallest ? "min" : "")) },
        vars: [{ k: "i", role: "stepper", v: sortedUpTo < n ? sortedUpTo : "—" }, { k: "smallest", role: "best", v: smallest >= 0 ? `[${smallest}] = ${a[smallest]}` : "—" }] });
      snap(null, n ? `Siap. Urutkan ${n} bilangan.` : "Siap. Tidak ada yang perlu diurutkan.");
      snap(1, "Kerjakan pada salinan daftar.");
      for (let i = 0; i < n; i++) {
        sortedUpTo = i; smallest = i;
        snap(2, `Posisi ${i}: semua di kirinya sudah terurut. Cari yang terkecil mulai dari sini.`, i);
        for (let j = i + 1; j < n; j++) {
          if (a[j] < a[smallest]) { smallest = j; snap(3, `${a[j]} di [${j}] lebih kecil: inilah yang terkecil sejauh ini.`, j, "", j); }
          else snap(3, `${a[j]} di [${j}] tidak lebih kecil dari ${a[smallest]}.`, j, "", j);
        }
        if (smallest !== i) { const t = a[i]; a[i] = a[smallest]; a[smallest] = t; snap(4, `Tukar ${a[i]} ke posisi ${i}.`, i); }
        else snap(4, `Yang terkecil sudah di posisi ${i}: tidak ada yang perlu ditukar.`, i);
        smallest = -1;
      }
      sortedUpTo = n;
      snap(5, `Kembalikan [${a.join(", ")}].`, -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Mencari lagi di bagian yang sudah terurut", text: "Jika perulangan dalam mulai dari 0, ia menemukan yang terkecil dari <em>seluruh</em> daftar setiap kali dan terus menukarnya, mengacak bagian yang sudah terurut.", take: "Cari hanya dari i sampai akhir: bagian yang belum terurut." },
    { title: "Menukar tanpa temp", text: "<code>result[i] = result[smallest]; result[smallest] = result[i]</code> menyalin satu nilai di atas yang lain, sehingga satu bilangan hilang dan yang lain berganda.", take: "Tukar dengan variabel sementara (A2), atau fungsi tukar bawaan bahasa." },
    { title: "Memakainya untuk daftar besar", text: "Pengurutan ini selalu melakukan sekitar n² / 2 perbandingan: setengah miliar untuk 32 000 item.", take: "Dalam program sungguhan, panggil fungsi pengurutan pustaka; pelajari yang ini untuk memahami cara kerja pengurutan." },
    { title: "Amati bagian terurut bertambah", text: "Setelah langkah i, posisi 0 sampai i berisi i + 1 nilai terkecil, berurutan. Memeriksa hal itu cara yang bagus untuk men-debug." },
    { title: "Urutkan ke arah sebaliknya dengan satu perubahan", text: "Cari yang terbesar alih-alih terkecil, dan daftarnya keluar dari terbesar ke terkecil (lihat latihannya)." }
  ],
  quiz: [
    { q: "Mengurutkan [5, 2, 8, 1], seperti apa daftarnya setelah tukar pertama?", explain: "Item terkecil, 1 di posisi 3, ditukar dengan posisi 0: [1, 2, 8, 5]." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [3, 1, 2]?", explain: "“Tukar”-nya menyalin 1 di atas 3, lalu menyalin 1 itu kembali. Angka 3 hilang dan angka 1 muncul dua kali." },
    { q: "Berapa perbandingan yang dilakukan pengurutan ini untuk 4 item?", explain: "3 + 2 + 1 = 6, apa pun urutan awal itemnya." }
  ],
  exercise: {
    title: "Giliran Anda: terbesar lebih dulu",
    task: "Tulis <code>sort_descending(numbers)</code> yang mengembalikan salinan yang terurut dari terbesar ke terkecil, dengan skema pengurutan ini.",
    plan: ["Kerjakan pada salinan", "Untuk setiap posisi i dari kiri", "Cari posisi item terbesar dari i sampai akhir", "Tukar ke posisi i", "Kembalikan salinannya"]
  },
  compare: {
    intro: "Pengurutan ini dibangun dari dua skema yang lebih kecil.",
    rows: [
      { name: "Urutkan dengan memilih terkecil", question: "Susun daftarnya berurutan", shape: "untuk setiap i: cari yang terkecil mulai dari i (D5), tukar ke tempatnya (A2)", result: "daftar terurut" },
      { name: "Posisi terbesar", question: "Di mana yang terbesar?", shape: "satu telusur, mengingat posisi terbaik", result: "satu posisi" },
      { name: "Tukar nilai", question: "Pertukarkan dua nilai", result: "dua nilai bertukar" }
    ],
    table: {
      head: ["Skema", "Perulangan", "Perbandingan untuk n item", "Pemakaian sehari-hari"],
      rows: [
        ["Urutkan dengan memilih terkecil", "2, bersarang", "n(n − 1)/2", "belajar; daftar mungil"],
        ["Posisi terbesar", "1", "n − 1", "di mana-mana"],
        ["Tukar nilai", "0", "0", "di mana-mana"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "cari posisi item terkecil yang tersisa" }, { why: "tukar ke tempatnya" }],
    leadsTo: [{ why: "data terurut bisa dicari dengan membagi dua" }]
  }
};
