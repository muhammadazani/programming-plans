/* Bahasa Indonesia overlay for data/plans/are-all.js (D8). Text only. */
window.PLAN_ID = {
  title: "Semuakah?",
  highlight: "Semuakah?",
  aka: ["pemeriksaan universal", "all()", "every"],
  hero: { tag: "-2 > 0 ✗", alt: "Lima kubus; kubus ketiga, -2, berwarna kuning karena gagal uji, dan dua kubus sesudahnya diredupkan karena tidak pernah diperiksa" },
  planCard: { name: "semuakah?", lines: ["kunjungi setiap item", "uji item itu", "gagal → tidak, berhenti"], foot: "↻ tidak ada yang gagal? ya" },
  intent: "Periksa bahwa setiap item lolos uji: berhenti dengan jawaban tidak pada item pertama yang gagal, dan jawab ya hanya jika tidak ada yang gagal.",
  analogy: { title: "Memeriksa senter sebelum mendaki", text: "Setiap orang harus punya senter yang menyala. Anda menguji satu per satu; senter mati yang pertama berarti “tidak semua siap”, dan sisanya tidak perlu diuji. Hanya jika setiap senter menyala Anda bisa menjawab ya." },
  cues: ["apakah semua …", "setiap …", "masing-masing …", "tidak ada yang tidak …", "selalu", "valid hanya jika setiap …"],
  cueSummary: "Jawabannya <b>ya atau tidak</b>, dan satu item yang gagal sudah cukup untuk menjawab tidak.",
  cueExamples: ["Apakah semua nilai antara 0 dan 100?", "Apakah setiap karakter PIN berupa digit?", "Apakah setiap sensor melaporkan nilai di atas nol?"],
  steps: [
    { title: "Kunjungi setiap item", text: "Dari pertama sampai terakhir, sampai ada yang gagal." },
    { title: "Uji item itu", text: "Di sini: apakah positif? Kita mencari item yang gagal." },
    { title: "Gagal? Jawab tidak dan berhenti", text: "Satu contoh tandingan sudah cukup; sisa item tidak bisa mengubah jawaban." },
    { title: "Tidak ada yang gagal? Jawab ya", text: "Hanya setelah perulangan. Termasuk daftar kosong: tidak ada item yang gagal." }
  ],
  impl: {
    python: { plain: { note: "Ujinya ditulis untuk kasus gagal: <code>x &lt;= 0</code> adalah kebalikan dari “positif”." }, idiomatic: { note: "<code>all()</code> berhenti pada nilai salah pertama, dan mengembalikan <code>True</code> untuk daftar kosong." } },
    java: { idiomatic: { note: "<code>allMatch</code> juga berhenti dini, dan bernilai <code>true</code> untuk stream kosong." } },
    rust: { idiomatic: { note: "<code>Iterator::all</code> berhenti pada <code>false</code> pertama." } },
    c: { plain: { note: "<code>bool</code> memerlukan <code>#include &lt;stdbool.h&gt;</code> sebelum C23." }, idiomaticNote: "C tidak punya <code>all</code> bawaan, jadi perulangan adalah cara idiomatisnya." }
  },
  trace: {
    intro: "Contoh: <b>Apakah semua bilangan positif?</b> Skema ini mencari bilangan pertama yang tidak positif.",
    input: { placeholder: "daftar Anda: 4, 8, 15" },
    presets: [{ label: "Satu gagal" }, { label: "Semua lolos" }, { label: "Nol gagal" }, { label: "Daftar kosong" }],
    run(list) {
      const n = list.length, ev = [], states = list.map(() => "");
      let answer = "?";
      const snap = (step, msg, cur = -1, tone = "") => ev.push({
        step, msg, tone,
        view: { values: list, states: states.slice(), ptr: cur },
        vars: [{ k: "x", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "answer", role: "result", v: answer }]
      });
      snap(null, n ? "Siap. Apakah semuanya positif?" : "Siap. Daftarnya kosong.");
      for (let i = 0; i < n; i++) {
        states[i] = "current";
        snap(1, `Kunjungi item [${i}]: x = ${list[i]}`, i);
        const fails = list[i] <= 0;
        states[i] = fails ? "hit" : "added";
        snap(2, fails ? `Apakah ${list[i]} positif? Tidak, ia gagal.` : `Apakah ${list[i]} positif? Ya, lanjut memeriksa.`, i);
        if (fails) {
          for (let j = i + 1; j < n; j++) states[j] = "skipped";
          answer = "False";
          snap(3, `Ketemu contoh tandingan. Jawab False dan berhenti.${n - i - 1 ? ` ${n - i - 1} item tidak pernah diperiksa.` : ""}`, i, "no");
          return ev;
        }
      }
      answer = "True";
      snap(4, n ? `${n === 1 ? "Satu-satunya item" : `Semua ${n} item`} lolos. Jawab True.` : "Tidak ada item, jadi tidak ada yang bisa gagal. Jawab True.", -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Menjawab ya di dalam perulangan", text: "<code>else: return True</code> di dalam perulangan menjawab ya begitu item pertama lolos, tanpa melihat sisanya.", take: "“Ya” tempatnya setelah perulangan, ketika tidak ada yang gagal." },
    { title: "Tanpa sadar menulis “adakah”", text: "Memulai bendera dari false dan mengisinya true saat ada item lolos memeriksa apakah <em>ada</em> item yang lolos, bukan semuanya.", take: "Untuk “semua”, carilah kegagalan pertama." },
    { title: "Salah menjawab daftar kosong", text: "Daftar kosong tidak punya item yang gagal, jadi “apakah semua positif?” bernilai <b>true</b>. Ini mengejutkan banyak orang, tetapi fungsi bawaan setiap bahasa setuju.", take: "Jika daftar kosong harus dianggap tidak valid, periksa secara terpisah." },
    { title: "Uji kondisi kebalikannya", text: "Di dalam perulangan Anda memburu kegagalan, jadi <code>if</code>-nya menguji “tidak positif”. Mengucapkannya menjaga logikanya tetap lurus." },
    { title: "Pakai fungsi bawaan setelah paham", text: "<code>all()</code>, <code>allMatch</code>, <code>.all()</code> dan <code>std::ranges::all_of</code> adalah skema ini, dan juga berhenti dini." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn} untuk daftar kosong?", options: ["True", "False", "Galat"], explain: "Tidak ada item yang gagal, jadi perulangan selesai dan fungsi menjawab ya. Saudaranya, “Adakah?”, menjawab tidak untuk daftar kosong." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [5, -1]?", explain: "ok menjadi true pada 5 dan tidak ada yang mengembalikannya, jadi -1 diabaikan. Kode ini menjawab “adakah item yang positif?”." },
    { q: "Untuk [6, 0, 9, -3], berapa item yang diperiksa sebelum jawabannya diketahui?", explain: "6 lolos, lalu 0 tidak positif, jadi jawabannya tidak setelah dua pemeriksaan." }
  ],
  exercise: {
    title: "Giliran Anda: semuanya genapkah?",
    task: "Tulis <code>all_even(numbers)</code> yang mengembalikan true jika setiap bilangan genap, dan false jika tidak. Daftar kosong dianggap semuanya genap.",
    plan: ["Kunjungi setiap bilangan", "Uji: apakah ganjil (kasus gagal)?", "Jika ganjil, langsung kembalikan false", "Setelah perulangan, kembalikan true"]
  },
  compare: {
    intro: "Tiga skema bersaudara pada <code>[4, 8, -2, 6, 5]</code>. Warna kuning menandai tempat masing-masing berhenti; item yang pudar tidak pernah diperiksa.",
    rows: [
      { name: "Semuakah?", question: "Apakah semua item positif?" },
      { name: "Adakah?", question: "Adakah item yang negatif?" },
      { name: "Cari yang pertama", question: "Di mana bilangan negatif pertama?" }
    ],
    table: {
      head: ["Skema", "Mencari", "Berhenti dini dengan", "Daftar kosong"],
      rows: [
        ["Semuakah?", "item pertama yang gagal", "false", "true"],
        ["Adakah?", "item pertama yang cocok", "true", "false"],
        ["Cari yang pertama", "item pertama yang cocok", "posisinya", "-1"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "berhenti dini yang sama, mencari kegagalan" }],
    leadsTo: [{ why: "taruh ujinya dalam fungsi ya/tidak tersendiri" }, { why: "validasi masukan sebelum memakainya" }]
  }
};
