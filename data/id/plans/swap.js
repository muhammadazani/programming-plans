/* Bahasa Indonesia overlay for data/plans/swap.js (A2). Text only. */
window.PLAN_ID = {
  title: "Tukar nilai",
  highlight: "Tukar",
  aka: ["pertukaran", "tukar dengan temp", "tukar tiga langkah"],
  hero: { tag: "temp = a", alt: "Tiga kubus untuk a, b dan temp; temp menyimpan salinan a selagi b pindah ke a" },
  planCard: { name: "tukar", lines: ["temp = a", "a = b", "b = temp"], foot: "→ tidak ada yang hilang" },
  intent: "Pertukarkan nilai dua variabel tanpa kehilangan salah satunya, dengan menitipkan salah satu nilai di variabel sementara lebih dulu.",
  analogy: { title: "Menukar isi dua gelas", text: "Satu gelas berisi jus dan gelas lain berisi susu, dan Anda ingin menukarnya. Jus tidak bisa dituang ke gelas susu yang penuh. Jadi jus dituang ke gelas ketiga yang kosong, susu dituang ke gelas jus, lalu jus dari gelas ketiga dituang ke gelas susu." },
  cues: ["tukar", "pertukarkan", "sebaliknya", "taruh yang lebih kecil di depan", "balik dua item"],
  cueSummary: "Dua tempat harus <b>bertukar</b> nilai. Menimpa salah satunya langsung akan menghapusnya.",
  cueExamples: ["Pastikan a adalah yang lebih kecil dari dua bilangan.", "Tukar item pertama dan terakhir sebuah daftar.", "Tukar posisi para pemain."],
  steps: [
    { title: "Periksa apakah perlu ditukar", text: "Di sini: hanya jika a lebih besar dari b. (Sebagian soal selalu menukar.)" },
    { title: "Titipkan satu nilai di variabel sementara", text: "temp = a. Sekarang nilai a aman." },
    { title: "Salin nilai yang lain", text: "a = b. Tanpa temp, nilai lama a akan hilang di sini." },
    { title: "Taruh nilai titipan di tempatnya", text: "b = temp. Pertukaran selesai." },
    { title: "Kembalikan hasilnya", text: "Di sini kedua nilai, yang lebih kecil di depan." }
  ],
  impl: {
    python: { idiomatic: { note: "Python mengemas sisi kanan menjadi tuple lebih dulu, jadi <code>a, b = b, a</code> tidak butuh temp." } },
    java: { idiomaticNote: "Java tidak punya fungsi tukar bawaan untuk variabel lokal; tukar tiga baris dengan temp adalah cara idiomatisnya. (Sebuah method tidak bisa menukar <code>int</code> milik pemanggil, karena Java mengirim salinan.)" },
    rust: { idiomatic: { note: "<code>std::mem::swap</code> mempertukarkan dua nilai apa pun yang bertipe sama." } },
    c: { plain: { note: "Hasilnya masuk ke array <code>out</code> milik pemanggil. Untuk menukar variabel pemanggil, C mengirim pointer: <code>void swap(int *x, int *y)</code>." }, idiomaticNote: "C tidak punya fungsi tukar; tukar dengan temp (sering di dalam <code>void swap(int *x, int *y)</code>) adalah cara idiomatisnya." },
    cpp: { idiomatic: { note: "<code>std::swap</code> (di <code>&lt;utility&gt;</code>) mengerjakan ketiga langkah untuk Anda." } }
  },
  trace: {
    intro: "Contoh: <b>Kembalikan dua bilangan dengan yang lebih kecil di depan.</b> Tiga kotak itu adalah variabel a, b dan temp.",
    presets: [{ label: "a = 5, b = 3" }, { label: "Sudah urut" }, { label: "Sama besar" }],
    run({ a, b }) {
      const ev = [];
      let va = a, vb = b, vt = "·";
      const push = (step, msg, hot = -1, tone = "") => ev.push({ step, msg, tone,
        view: { values: [va, vb, vt], states: [0, 1, 2].map((i) => (i === hot ? "hit" : "")), ptr: hot, noIdx: true, badges: ["a", "b", "temp"] },
        vars: [{ k: "a", role: "temp", v: va }, { k: "b", role: "temp", v: vb }, { k: "temp", role: "temp", v: vt }] });
      push(null, `Siap. a = ${a}, b = ${b}.`);
      if (!(va > vb)) {
        push(1, `Apakah ${va} > ${vb}? Tidak, keduanya sudah urut. Tidak perlu ditukar.`);
        push(5, `Kembalikan [${va}, ${vb}].`, -1, "yes");
        return ev;
      }
      push(1, `Apakah ${va} > ${vb}? Ya, jadi tukar.`);
      vt = va; push(2, `Titipkan nilai a: temp = ${vt}.`, 2);
      va = vb; push(3, `Salin b ke a: a = ${va}. Tanpa temp, ${vt} kini sudah hilang.`, 0);
      vb = vt; push(4, `Taruh nilai titipan ke b: b = ${vb}.`, 1);
      push(5, `Kembalikan [${va}, ${vb}].`, -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Menukar tanpa temp", text: "<code>a = b</code> lalu <code>b = a</code> menyalin b ke a, lalu menyalinnya kembali. Keduanya berakhir berisi nilai b; nilai a hilang.", take: "Titipkan satu nilai dulu: temp = a, a = b, b = temp." },
    { title: "Menguji terbalik", text: "Menukar saat <code>a &lt; b</code> menaruh nilai yang lebih besar di depan, kebalikan dari yang diminta.", take: "Tukar jika pasangannya dalam urutan yang salah." },
    { title: "Berharap fungsi menukar variabel pemanggil", text: "Di Java (dan di Python, untuk bilangan), fungsi menerima salinan. Menukarnya di dalam fungsi tidak mengubah apa pun di luar.", take: "Kembalikan nilai yang sudah ditukar, atau pakai pointer (C) atau referensi (C++)." },
    { title: "Pakai fungsi tukar bawaan bahasa", text: "<code>a, b = b, a</code> di Python, <code>std::mem::swap</code> di Rust dan <code>std::swap</code> di C++ lebih jelas daripada tiga baris, setelah Anda paham cara kerjanya." },
    { title: "Ketahui di mana Anda akan memakainya", text: "Menukar adalah bahan dasar: pengurutan dengan memilih terkecil (F3) dan membalik daftar dengan dua penunjuk (F1) sama-sama menukar berulang kali." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn}(8, 2)?", explain: "8 > 2, jadi keduanya ditukar: nilai yang lebih kecil di depan." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk (5, 3)?", explain: "a = b membuat a bernilai 3, lalu b = a menyalin 3 itu kembali ke b. Angka 5 hilang." },
    { q: "Berapa penugasan yang dibutuhkan tukar dengan temp?", explain: "temp = a, a = b, b = temp: tiga. Dua penugasan tidak bisa menukar tanpa kehilangan satu nilai." }
  ],
  exercise: {
    title: "Giliran Anda: putar tiga nilai",
    task: "Tulis <code>rotate_left(a, b, c)</code> yang mengembalikan ketiga nilai bergeser satu tempat ke kiri: (1, 2, 3) menjadi [2, 3, 1]. Pakai satu variabel sementara.",
    plan: ["Titipkan a di temp", "Pindahkan b ke a", "Pindahkan c ke b", "Taruh temp ke c, lalu kembalikan [a, b, c]"]
  },
  compare: {
    intro: "Tiga skema urutan kecil: kode lurus tanpa perulangan.",
    rows: [
      { name: "Tukar nilai", question: "Taruh bilangan yang lebih kecil di depan", result: "nilai bertukar" },
      { name: "Baca–Proses–Hasilkan", question: "Hitung kecepatan", shape: "ubah, hitung, kembalikan", result: "nilai baru" },
      { name: "Pecah dengan div dan mod", question: "Detik menjadi jam, menit, detik", shape: "// untuk berapa yang muat, % untuk sisanya", result: "beberapa bagian" }
    ],
    table: {
      head: ["Skema", "Membuat nilai baru?", "Butuh temp?", "Pemakaian khas"],
      rows: [
        ["Tukar nilai", "tidak, memindahkan yang ada", "ya", "mengurutkan, membalik"],
        ["Baca–Proses–Hasilkan", "ya", "tidak", "rumus"],
        ["Pecah dengan div dan mod", "ya", "tidak", "satuan, digit, uang kembalian"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "pemeriksaan apakah perlu ditukar" }],
    leadsTo: [{ why: "pengurutan dengan memilih terkecil menukar item terkecil ke tempatnya" }, { why: "balik daftar dengan menukar dari kedua ujung" }]
  }
};
