/* Bahasa Indonesia overlay for data/plans/ask-again-until-valid.js (C3). Text only. */
(function () {
  const LOW = 1, HIGH = 10;

  window.PLAN_ID = {
    title: "Minta ulang sampai benar",
    highlight: "sampai benar",
    aka: ["perulangan validasi masukan", "minta ulang", "validasi dan coba lagi"],
    hero: { tag: "7 ada di 1–10", alt: "Empat percobaan: 0 dan 15 ditolak, 7 berwarna kuning sebagai yang valid pertama, dan 3 tidak pernah diminta" },
    planCard: { name: "sampai valid", lines: ["baca sebuah nilai", "selama tidak valid", "jelaskan, baca lagi"], foot: "→ pakai nilai yang valid" },
    intent: "Terus meminta nilai sampai memenuhi aturan, lalu lanjutkan dengan nilai yang valid itu.",
    analogy: { title: "Memasukkan PIN", text: "Mesin ATM meminta PIN Anda. Jika salah, ia memberi tahu dan meminta lagi. Ia baru pindah ke menu setelah Anda mengetik PIN yang benar. Berapa kali percobaannya tidak diketahui sebelumnya." },
    cues: ["harus antara … dan …", "minta lagi", "sampai pengguna memasukkan … yang valid", "tolak masukan yang tidak valid", "masukkan ulang"],
    cueSummary: "Anda butuh <b>satu nilai valid</b>, dan pengguna mungkin salah berkali-kali dulu.",
    cueExamples: ["Minta bilangan 1 sampai 10 sampai pengguna memasukkannya.", "Minta kata sandi sampai panjangnya setidaknya 8 karakter.", "Minta pilihan menu sampai pilihannya salah satu opsi."],
    steps: [
      { title: "Baca sebuah nilai", text: "Sebelum perulangan, agar ujinya punya sesuatu untuk diperiksa." },
      { title: "Selama tidak valid", text: "Di sini: lebih kecil dari 1 atau lebih besar dari 10. Perulangan hanya berjalan untuk masukan yang buruk." },
      { title: "Jelaskan, lalu baca lagi", text: "Program sungguhan memberi tahu apa yang salah (“Masukkan 1 sampai 10”), lalu membaca percobaan berikutnya." },
      { title: "Pakai nilai yang valid", text: "Setelah perulangan selesai, nilainya pasti valid." }
    ],
    impl: {
      python: { plain: { note: "Dalam program sungguhan setiap pembacaan adalah <code>int(input(\"Number (1-10): \"))</code>." }, idiomatic: { note: "Python mengizinkan perbandingan berantai: <code>low &lt;= v &lt;= high</code>." } },
      rust: { idiomatic: { note: "<code>(low..=high).contains(&v)</code> terbaca seperti aturannya." } },
      c: { plain: { note: "Dengan masukan sungguhan: <code>scanf(\"%d\", &amp;value)</code>, dan periksa juga nilai kembaliannya, kalau-kalau pengguna mengetik huruf." }, idiomaticNote: "Perulangan baca–uji–baca lagi adalah bentuk C yang idiomatis." }
    },
    trace: {
      intro: "Contoh: <b>Minta bilangan dari 1 sampai 10.</b> Setiap kotak adalah satu percobaan pengguna.",
      input: { placeholder: "percobaan: 0, 15, 7" },
      presets: [{ label: "Dua kali salah" }, { label: "Langsung benar" }, { label: "Nilai batas" }],
      run(raw) {
        const ok = (v) => v >= LOW && v <= HIGH;
        const list = raw.some(ok) ? raw : raw.concat([5]);
        const ev = [], states = list.map(() => "");
        let value = "—", fails = 0;
        const snap = (step, msg, cur = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur },
          vars: [{ k: "value", role: "walker", v: value }, { k: "rejected", role: "count", v: fails }] });
        snap(null, raw.some(ok) ? `Siap. Jawaban yang valid adalah ${LOW} sampai ${HIGH}.` : "Tidak ada percobaan Anda yang valid, jadi angka 5 ditambahkan di akhir.");
        let i = 0; value = list[0]; states[0] = "current";
        snap(1, `Baca percobaan pertama: ${value}.`, 0);
        while (!ok(value)) {
          states[i] = "miss"; fails++;
          snap(2, `Apakah ${value} di luar ${LOW}–${HIGH}? Ya, tidak valid.`, i);
          i++; value = list[i]; states[i] = "current";
          snap(3, `Tampilkan “Masukkan ${LOW} sampai ${HIGH}” dan baca lagi: ${value}.`, i);
        }
        states[i] = "hit"; for (let j = i + 1; j < list.length; j++) states[j] = "skipped";
        snap(2, `Apakah ${value} di luar ${LOW}–${HIGH}? Tidak, valid. Perulangan selesai.`, i);
        snap(4, `Pakai ${value}.${fails ? ` Butuh ${fails + 1} percobaan.` : ""}`, -1, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "and alih-alih or", text: "Sebuah nilai tidak mungkin lebih kecil dari 1 <em>dan</em> lebih besar dari 10 sekaligus, jadi <code>value &lt; low and value &gt; high</code> tidak pernah benar. Semua nilai diterima, termasuk 0.", take: "Tidak valid berarti terlalu kecil <b>atau</b> terlalu besar." },
      { title: "if alih-alih while", text: "<code>if</code> hanya meminta ulang sekali. Jika percobaan kedua juga salah, program tetap lanjut dengannya.", take: "Terus minta selama nilainya tidak valid." },
      { title: "Tidak memberi tahu pengguna apa yang salah", text: "Meminta ulang tanpa penjelasan membuat orang menebak-nebak aturannya.", take: "Sebutkan aturannya setiap kali: “Masukkan bilangan dari 1 sampai 10”." },
      { title: "Uji kedua batasnya", text: "1 dan 10 harus diterima; 0 dan 11 harus ditolak." },
      { title: "Validasi tipenya juga, di program sungguhan", text: "Pengguna bisa mengetik huruf. <code>int()</code> di Python memunculkan <code>ValueError</code>, dan <code>scanf</code> di C mengembalikan 0; tangani itu di dalam perulangan yang sama." }
    ],
    quiz: [
      { q: "Untuk percobaan [12, 0, 4, 9] dan rentang 1–10, apa yang dikembalikan {fn}?", explain: "12 dan 0 ditolak; 4 adalah nilai pertama di dalam 1–10, jadi perulangan berhenti di situ." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk percobaan [0, 15, 7]?", explain: "if hanya meminta ulang sekali. Percobaan kedua, 15, juga tidak valid, tetapi tetap dikembalikan." },
      { q: "Jika percobaan pertama sudah valid, berapa kali badan perulangan berjalan?", explain: "Ujinya langsung gagal, jadi badan perulangan tidak pernah berjalan dan nilai pertama yang dipakai." }
    ],
    exercise: {
      title: "Giliran Anda: hitung percobaannya",
      task: "Tulis <code>count_attempts(attempts, low, high)</code> yang mengembalikan berapa percobaan yang dibutuhkan untuk mendapat nilai valid, termasuk yang valid.",
      plan: ["Baca percobaan pertama dan hitung", "Selama tidak valid", "Baca percobaan berikutnya dan hitung", "Kembalikan hitungannya"]
    },
    compare: {
      intro: "Tiga perulangan masukan dengan bentuk baca–uji–baca yang sama. Yang mengakhiri perulangannya berbeda.",
      rows: [
        { name: "Minta ulang sampai benar", question: "Bilangan dari 1 sampai 10", shape: "selama nilainya tidak valid: jelaskan, baca lagi", result: "nilai yang valid" },
        { name: "Baca sampai tanda berhenti", question: "Jumlahkan angka sampai -1", shape: "selama bukan tanda berhenti: proses, baca berikutnya", result: "total dari banyak nilai" },
        { name: "Perulangan menu", question: "1) setor 2) tarik 0) keluar", shape: "selama bukan keluar: jalankan pilihan, baca berikutnya", result: "keadaan setelah keluar" }
      ],
      table: {
        head: ["Skema", "Perulangan berjalan selama", "Nilai terakhir yang dibaca adalah", "Memproses banyak nilai?"],
        rows: [
          ["Minta ulang sampai benar", "masukannya tidak valid", "jawabannya", "tidak, hanya satu"],
          ["Baca sampai tanda berhenti", "masukannya bukan tanda berhenti", "tanda berhenti (diabaikan)", "ya"],
          ["Perulangan menu", "pilihannya bukan keluar", "keluar", "ya, satu perintah setiap kali"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "perulangan baca–uji–baca lagi yang sama" }, { why: "uji validitasnya adalah penjaga" }],
      leadsTo: [{ why: "menu memvalidasi dan menjalankan setiap pilihan" }]
    }
  };
})();
