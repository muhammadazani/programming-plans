/* Bahasa Indonesia overlay for data/plans/two-factor-decision.js (B4). Text only. */
(function () {
  const TABLE = [
    { member: true, heavy: true, value: 5 },
    { member: true, heavy: false, value: 2 },
    { member: false, heavy: true, value: 1 },
    { member: false, heavy: false, value: 0 }
  ];

  window.PLAN_ID = {
    title: "Keputusan bersarang",
    highlight: "bersarang",
    aka: ["if bersarang", "tabel keputusan", "kondisi gabungan"],
    hero: { tag: "anggota, 6 kg", alt: "Tangga empat hasil, satu untuk setiap kombinasi dua fakta ya/tidak; yang pertama berwarna kuning" },
    planCard: { name: "dua faktor", lines: ["tabelkan setiap kombinasi", "uji faktor pertama", "lalu faktor kedua di dalamnya"], foot: "→ satu nilai per kombinasi" },
    intent: "Putuskan berdasarkan dua fakta terpisah sekaligus: daftarkan setiap kombinasi dalam tabel kecil, lalu uji satu fakta dan, di dalam setiap cabangnya, fakta yang lain.",
    analogy: { title: "Memilih jaket", text: "Apakah dingin? Apakah hujan? Empat kombinasi, empat jawaban: dingin dan hujan berarti jas hujan tebal, dingin dan kering jaket wol, hangat dan hujan payung, hangat dan kering tidak perlu apa-apa. Satu pertanyaan saja tidak cukup." },
    cues: ["… dan …", "jika keduanya …", "tergantung apakah … dan apakah …", "anggota yang …", "kecuali jika …"],
    cueSummary: "Dua fakta ya/tidak yang saling bebas menentukan hasil bersama-sama. <b>Tulis tabel 2 × 2 lebih dulu.</b>",
    cueExamples: ["Anggota mendapat diskon lebih besar untuk pesanan berat.", "Harga tiket tergantung kelompok usia dan hari.", "Masuk gratis untuk pelajar, kecuali di akhir pekan."],
    steps: [
      { title: "Tabelkan setiap kombinasi", text: "Dua fakta ya/tidak menghasilkan empat kasus. Tulis jawaban masing-masing sebelum menulis kode." },
      { title: "Uji faktor pertama", text: "Di sini: apakah pelanggannya anggota?" },
      { title: "Di dalam setiap cabang, uji faktor kedua", text: "Di sini: apakah pesanannya berat (lebih dari 4 kg)?" },
      { title: "Kembalikan nilai untuk kombinasi itu", text: "Setiap dari empat jalur berakhir dengan jawabannya sendiri." }
    ],
    impl: {
      python: { idiomatic: { note: "Rantai datar dengan <code>and</code>, dari kasus paling spesifik ke yang paling umum. Menamai <code>heavy</code> membuatnya mudah dibaca." } },
      rust: { plain: { note: "Setiap <code>if</code> adalah ekspresi, jadi angka yang terpilih menjadi hasilnya (langkah 4)." }, idiomatic: { note: "Mencocokkan pasangan nilai <em>adalah</em> tabel keputusannya, dan compiler memeriksa bahwa keempat kombinasi tercakup." } }
    },
    trace: {
      intro: "Contoh: <b>Diskon sebuah binatu.</b> Anggota hemat 5 untuk pesanan di atas 4 kg dan 2 untuk lainnya; bukan anggota hemat 1 untuk pesanan di atas 4 kg.",
      input: { fields: [{ label: "member" }, { label: "berat (kg)" }] },
      presets: [{ label: "Anggota, 6 kg" }, { label: "Anggota, 3 kg" }, { label: "Tamu, 6 kg" }, { label: "Tamu, tepat 4 kg" }],
      run({ member, weight }) {
        const ev = [];
        const rows = TABLE.map((r) => ({ test: `${r.member ? "anggota" : "tamu"} · ${r.heavy ? "> 4 kg" : "≤ 4 kg"}`, label: String(r.value), state: "" }));
        let result = "?";
        const push = (step, msg, tone = "") => ev.push({ step, msg, tone,
          view: { subject: { k: "pesanan", v: `${member ? "anggota" : "tamu"}, ${weight} kg` }, rows: rows.map((r) => ({ ...r })) },
          vars: [{ k: "member", role: "fixed", v: member ? "ya" : "tidak" }, { k: "weight", role: "fixed", v: weight }, { k: "discount", role: "result", v: result }] });
        push(null, "Siap. Tabel memuat keempat kombinasi.");
        push(1, "Langkah 1 sudah dikerjakan sebelum menulis kode: satu jawaban per kombinasi, seperti di tabel.");
        TABLE.forEach((r, i) => { if (r.member !== member) rows[i].state = "skipped"; });
        push(2, member ? "Anggota? Ya, jadi hanya dua baris anggota yang masih mungkin." : "Anggota? Bukan, jadi hanya dua baris tamu yang masih mungkin.");
        const heavy = weight > 4;
        TABLE.forEach((r, i) => { if (r.member === member) rows[i].state = r.heavy === heavy ? "hit" : "miss"; });
        push(3, `Berat di atas 4 kg? ${weight} > 4 bernilai ${heavy ? "true" : "false"}${weight === 4 ? " (tepat 4 tidak dihitung di atas)" : ""}.`);
        result = TABLE.find((r) => r.member === member && r.heavy === heavy).value;
        push(4, `Kembalikan ${result}.`, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "or padahal maksudnya and", text: "<code>member or heavy</code> memberi diskon pesanan berat anggota kepada setiap pesanan berat, dan juga ke setiap pesanan ringan anggota.", take: "Bacakan kondisinya: “anggota dan berat”." },
      { title: "Melupakan sebuah kombinasi", text: "Mudah sekali menangani tiga dari empat kasus dan membiarkan yang keempat jatuh ke nilai bawaan. Di sini pesanan berat seorang tamu keliru mendapat 0.", take: "Buat tabel 2 × 2 lebih dulu dan pastikan setiap selnya punya cabang." },
      { title: "Menguji kasus umum dulu dalam rantai datar", text: "Dalam rantai datar, <code>if member</code> sebelum <code>if member and heavy</code> menangkap semua anggota, sehingga angka 5 tidak pernah tercapai.", take: "Kombinasi paling spesifik lebih dulu." },
      { title: "Beri nama faktanya", text: "<code>heavy = weight &gt; 4</code> mengubah setiap kondisi menjadi sebuah kata, sehingga <code>if member and heavy</code> terbaca seperti aturannya." },
      { title: "Uji keempat sudut, dan batasnya", text: "Empat kombinasi, ditambah berat tepat 4, mencakup setiap jalur." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}(false, 9)?", explain: "Tamu (bukan anggota) dengan pesanan berat: tabel menyebut 1." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk pesanan 6 kg seorang tamu?", explain: "Kasus tamu-dan-berat tidak punya cabang, jadi jatuh ke return 0. Tabel menyebut 1." },
      { q: "Dengan dua fakta ya/tidak, berapa kombinasi yang butuh jawaban?", explain: "Setiap fakta bisa ya atau tidak: 2 × 2 = 4 kombinasi." }
    ],
    exercise: {
      title: "Giliran Anda: tiket bioskop",
      task: "Tulis <code>ticket(student, weekend)</code>: pelajar membayar 8 di akhir pekan dan 6 di hari biasa; selain pelajar membayar 12 di akhir pekan dan 10 di hari biasa.",
      plan: ["Buat tabel harga 2 × 2", "Uji fakta pertama: apakah pelajar?", "Di dalam setiap cabang, uji: apakah akhir pekan?", "Kembalikan harga untuk kombinasi itu"]
    },
    compare: {
      intro: "Skema seleksi, dibedakan dari apa yang menentukan hasilnya.",
      rows: [
        { name: "Keputusan bersarang", question: "Anggota dan berat?", shape: "if bersarang, atau and / or, satu cabang per kombinasi", result: "4 kombinasi" },
        { name: "Pilih salah satu", question: "Gratis ongkir atau tidak?", shape: "if … else pada satu kondisi", result: "2 hasil" },
        { name: "Klasifikasi bertingkat", question: "Nilai huruf apa?", shape: "rantai else-if atas rentang satu nilai", result: "3+ hasil" }
      ],
      table: {
        head: ["Skema", "Fakta penentu", "Hasil", "Tulis lebih dulu"],
        rows: [
          ["Keputusan bersarang", "dua, saling bebas", "sampai 4", "tabel 2 × 2"],
          ["Pilih salah satu", "satu", "2", "kondisinya"],
          ["Klasifikasi bertingkat", "satu nilai, beberapa rentang", "3 atau lebih", "rentang secara berurutan"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "setiap uji adalah pilihan ya/tidak" }],
      leadsTo: [{ why: "banyak kombinasi pasti: taruh di tabel" }, { why: "namai kondisi dengan fungsi ya/tidak" }]
    }
  };
})();
