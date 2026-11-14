/* Bahasa Indonesia overlay for data/plans/multi-way-classification.js (B3). Text only. */
(function () {
  const RANGES = [{ min: 85, label: "A" }, { min: 70, label: "B" }, { min: 55, label: "C" }];
  const ELSE_LABEL = "D";

  window.PLAN_ID = {
    title: "Klasifikasi bertingkat",
    highlight: "bertingkat",
    aka: ["tangga if / else-if", "klasifikasi rentang", "pengelompokan"],
    hero: { tag: "78 >= 70 ✓", alt: "Tangga empat kubus berlabel A sampai D; kubus kedua, B, berwarna kuning karena 78 lolos uji 78 >= 70; kubus di bawahnya diredupkan" },
    planCard: { name: "klasifikasi", lines: ["uji rentang teratas", "jika tidak, rentang berikutnya", "jika tidak: sisanya"], foot: "→ uji benar pertama yang menentukan" },
    intent: "Masukkan sebuah nilai ke tepat satu dari beberapa rentang yang berurutan: uji rentangnya dari satu ujung, dan biarkan uji benar pertama yang menentukan.",
    analogy: { title: "Baki penyortir koin", text: "Koin meluncur di jalur yang melewati lubang-lubang yang makin besar. Setiap koin jatuh ke lubang pertama yang muat dan tidak pernah melihat lubang lainnya. Jika urutan lubangnya salah, lubang terbesar menangkap semua koin." },
    cues: ["nilai huruf / kategori / tingkat", "antara … dan …", "golongan / jenjang", "klasifikasikan …", "tergantung rentangnya", "jika minimal … jika tidak …"],
    cueSummary: "Satu nilai, <b>tiga kemungkinan atau lebih</b>, ditentukan oleh rentang yang tidak saling tumpang tindih.",
    cueExamples: ["Ubah nilai ujian menjadi nilai huruf.", "Beri label BMI: kurus, normal, gemuk atau obesitas.", "Tentukan ongkos kirim berdasarkan berat paket."],
    steps: [
      { title: "Uji rentang di salah satu ujung lebih dulu", text: "Di sini rentang teratas: apakah nilainya minimal 85?" },
      { title: "Jika tidak, uji rentang berikutnya", text: "Else-if hanya berjalan jika semua uji di atasnya salah, jadi cukup satu batas." },
      { title: "Tangkap semua sisanya", text: "Else terakhir menangani apa pun yang tidak cocok dengan uji mana pun, sehingga tidak ada nilai tanpa label." },
      { title: "Kembalikan labelnya", text: "Tepat satu cabang yang berjalan, jadi tepat satu label yang dikembalikan." }
    ],
    impl: {
      python: { idiomaticNote: "Rantai <code>if / elif</code> <em>adalah</em> cara idiomatis Python untuk rentang. <code>match</code> di Python hanya bisa menguji rentang lewat guard, yang lebih panjang." },
      java: { idiomaticNote: "Di Java, rantai <code>if / else if</code> adalah cara idiomatisnya. <code>switch</code> mencocokkan nilai persis, bukan rentang." },
      rust: { plain: { note: "<code>if</code> adalah ekspresi di Rust: nilai cabang yang terpilih menjadi hasil fungsi, tanpa perlu <code>return</code>." }, idiomatic: { note: "<code>match</code> dengan pola rentang. Kompilator memeriksa bahwa setiap nilai tercakup, dan memperingatkan cabang yang tak terjangkau." } },
      c: { plain: { note: "Mengembalikan literal string aman di C: ia ada selama program berjalan." }, idiomaticNote: "<code>switch</code> di C hanya mencocokkan nilai persis, jadi rantai <code>if / else if</code> adalah cara idiomatisnya." },
      cpp: { idiomaticNote: "<code>switch</code> di C++ hanya mencocokkan nilai persis, jadi rantai <code>if / else if</code> adalah cara idiomatisnya." }
    },
    trace: {
      intro: "Contoh: <b>Ubah nilai ujian menjadi nilai huruf.</b> A mulai 85, B mulai 70, C mulai 55, dan yang lebih rendah D.",
      input: { fields: [{ label: "score" }] },
      presets: [{ label: "Nilai 78" }, { label: "Nilai 92" }, { label: "Tepat 55" }, { label: "Nilai 30" }],
      run({ score: s }) {
        const ev = [];
        const rows = RANGES.map((r) => ({ test: `score >= ${r.min}`, label: r.label, state: "" })).concat([{ test: "else", label: ELSE_LABEL, state: "" }]);
        const push = (step, msg, label = "?", tone = "") => ev.push({ step, msg, tone,
          view: { subject: { k: "score", v: s }, rows: rows.map((r) => ({ ...r })) },
          vars: [{ k: "score", role: "fixed", v: s }, { k: "label", role: "result", v: label === "?" ? "?" : `"${label}"` }] });
        push(null, `Siap. score = ${s}. Termasuk rentang yang mana?`);
        for (let i = 0; i < RANGES.length; i++) {
          const r = RANGES[i];
          const ok = s >= r.min;
          rows[i].state = ok ? "hit" : "miss";
          if (ok) {
            for (let j = i + 1; j < rows.length; j++) rows[j].state = "skipped";
            push(i === 0 ? 1 : 2, `Apakah ${s} >= ${r.min}? Ya. Ini uji benar pertama, jadi inilah yang menentukan.`);
            push(4, `Kembalikan "${r.label}". ${rows.length - i - 1} uji di bawahnya tidak pernah diperiksa.`, r.label, "yes");
            return ev;
          }
          push(i === 0 ? 1 : 2, `Apakah ${s} >= ${r.min}? Tidak, jadi lanjut ke uji berikutnya.${i > 0 ? ` (Kita sudah tahu ${s} < ${RANGES[i - 1].min}.)` : ""}`);
        }
        rows[rows.length - 1].state = "hit";
        push(3, "Semua uji salah, jadi else yang menangkapnya.");
        push(4, `Kembalikan "${ELSE_LABEL}".`, ELSE_LABEL, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Menguji rentang dengan urutan yang salah", text: "Jika rentang terlebar diuji lebih dulu, semuanya tertangkap di sana: setiap nilai 55 ke atas menjadi C, dan cabang A dan B tidak pernah bisa berjalan.", take: "Uji dari satu ujung ke ujung lain: batas bawah tertinggi dulu (atau batas atas terendah dulu)." },
      { title: "If terpisah alih-alih else-if", text: "Dengan <code>if</code> terpisah, setiap uji yang benar ikut berjalan, dan yang terakhir menimpa jawaban sebelumnya.", take: "Pakai else-if, agar hanya uji benar pertama yang dihitung." },
      { title: "Batas ganda yang menyisakan celah", text: "<code>score &gt;= 70 and score &lt;= 84</code> memang benar untuk bilangan bulat, tetapi nilai 84.5 tidak cocok dengan rentang mana pun.", take: "Dengan else-if, satu batas per uji sudah cukup, dan tidak ada celah." },
      { title: "Uji batas-batasnya", text: "Coba 85 dan 84, 70 dan 69, 55 dan 54. Di situlah kesalahan <code>&gt;</code> lawan <code>&gt;=</code> bersembunyi." },
      { title: "Selalu akhiri dengan else", text: "Else terakhir memastikan setiap nilai mendapat label, bahkan yang tidak terduga, seperti nilai negatif." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}(85)?", explain: "Uji pertama adalah score >= 85, dan 85 >= 85 benar. Nilai batas masuk ke rentang yang ujinya memakai >=." },
      { q: "Untuk nilai 60, berapa syarat yang diuji sebelum jawabannya diketahui?", explain: "60 >= 85 salah, 60 >= 70 salah, 60 >= 55 benar. Tiga uji, lalu mengembalikan C." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk 90?", explain: "Ketiga if bernilai benar untuk 90, dan masing-masing menimpa label. Yang terakhir berjalan mengisi C. Dengan else-if, uji benar pertama akan berhenti di A." }
    ],
    exercise: {
      title: "Giliran Anda: harga tiket bioskop",
      task: "Tulis <code>ticket_price(age)</code>: di bawah 3 tahun gratis (0), di bawah 13 tahun 5, di bawah 65 tahun 12, dan 65 tahun ke atas 7. Kali ini mulai dari rentang <b>terendah</b>: skemanya bekerja dari kedua ujung.",
      plan: ["Uji satu ujung lebih dulu: apakah umurnya di bawah 3?", "Jika tidak, uji rentang berikutnya: di bawah 13? di bawah 65?", "Semua yang tersisa berumur 65 ke atas", "Kembalikan harga untuk rentang itu"]
    },
    compare: {
      intro: "Empat skema yang sama-sama memilih hasil. Bentuk pertanyaannya menunjukkan mana yang cocok.",
      rows: [
        { name: "Pilih salah satu", question: "Lulus atau tidak?", shape: "if … else", result: "2 hasil" },
        { name: "Klasifikasi bertingkat", question: "Nilai huruf A sampai D?", shape: "if … else if … else if … else, pada rentang berurutan", result: "3+ hasil" },
        { name: "Keputusan bersarang", question: "Anggota dan lebih dari 4 kg?", shape: "if bersarang, atau syarat digabung dengan and / or", result: "sebuah kombinasi" },
        { name: "Tabel rujukan", question: "Berapa harga ukuran “M”?", shape: "kamus / map dari kunci persis ke nilai", result: "banyak kunci persis" }
      ],
      table: {
        head: ["Skema", "Hasil", "Ditentukan oleh", "Pertanyaan khas"],
        rows: [
          ["Pilih salah satu", "2", "satu syarat", "Apakah bilangan ini genap?"],
          ["Klasifikasi bertingkat", "3 atau lebih", "rentang berurutan dari satu nilai", "Penghasilan ini masuk golongan pajak mana?"],
          ["Keputusan bersarang", "2 atau lebih", "dua fakta yang terpisah", "Diskon untuk anggota dengan berat di atas 4 kg?"],
          ["Tabel rujukan", "banyak", "nilai persis, bukan rentang", "Kota mana yang memakai kode area ini?"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "setiap uji di tangga adalah pilihan ya/tidak" }],
      leadsTo: [{ why: "jika hasilnya bergantung pada dua fakta" }, { why: "jika hasilnya nilai persis, bukan rentang" }, { why: "klasifikasikan setiap item daftar, lalu hitung tiap kelas" }]
    }
  };
})();
