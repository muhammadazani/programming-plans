/* Bahasa Indonesia overlay for data/plans/find-the-first.js (D6). Text only. */
window.PLAN_ID = {
  title: "Cari yang pertama",
  highlight: "pertama",
  aka: ["pencarian linear", "indeks dari", "find"],
  hero: { tag: "ketemu di [2]", alt: "Lima kubus; kubus ketiga, -2, berwarna kuning sebagai bilangan negatif pertama, di posisi 2; dua kubus sesudahnya diredupkan karena tidak pernah diperiksa" },
  planCard: { name: "cari", lines: ["kunjungi setiap posisi", "uji itemnya", "cocok → kembalikan posisi"], foot: "↻ tidak ada? kembalikan -1" },
  intent: "Cari di mana item pertama yang cocok berada: telusuri posisinya berurutan dan kembali begitu ada yang cocok, atau laporkan “tidak ketemu”.",
  analogy: { title: "Mencari buku di rak yang tidak terurut", text: "Anda menyusuri rak dari kiri, satu punggung buku demi satu. Begitu melihat judul yang dicari, Anda berhenti dan mencatat letaknya. Hanya jika sampai di ujung rak Anda bisa berkata buku itu tidak ada." },
  cues: ["cari yang pertama …", "di mana …", "posisi / indeks dari …", "item mana …", "telusuri untuk …"],
  cueSummary: "Jawabannya <b>sebuah posisi</b> (atau itemnya), ditambah cara menyatakan “tidak ketemu”.",
  cueExamples: ["Di posisi berapa saldo negatif pertama?", "Cari indeks sebuah nama dalam daftar.", "Hari ke berapa suhu pertama kali di atas 30 °C?"],
  steps: [
    { title: "Kunjungi setiap posisi berurutan", text: "Telusuri indeks 0, 1, 2, … karena jawabannya sebuah posisi." },
    { title: "Uji item di posisi itu", text: "Di sini: apakah negatif?" },
    { title: "Cocok? Langsung kembalikan posisinya", text: "Inilah kecocokan pertama, karena semua item sebelumnya gagal." },
    { title: "Tidak ada yang cocok setelah perulangan? Kembalikan “tidak ketemu”", text: "Di sini -1, posisi yang tidak mungkin ada." }
  ],
  impl: {
    python: { plain: { note: "Kode Python sering mengembalikan <code>None</code> untuk “tidak ketemu”. -1 membuat kelima bahasa seragam di sini." }, idiomatic: { note: "<code>next()</code> mengambil kecocokan pertama dari generator, atau nilai bawaan -1 jika tidak ada." } },
    java: { idiomatic: { note: "Stream bersifat malas: <code>findFirst</code> berhenti pada kecocokan pertama. Perlu <code>java.util.stream.IntStream</code>." } },
    rust: { plain: { note: "Rust yang idiomatis akan mengembalikan <code>Option&lt;usize&gt;</code> alih-alih -1; lihat versi idiomatis." }, idiomatic: { note: "<code>position</code> mengembalikan <code>Some(indeks)</code> atau <code>None</code>; <code>map_or</code> mengubah <code>None</code> menjadi -1." } },
    c: { idiomaticNote: "C tidak punya fungsi pencarian bawaan untuk array, jadi perulangan adalah cara idiomatisnya." },
    cpp: { idiomatic: { note: "<code>find_if</code> mengembalikan iterator; <code>end()</code> berarti “tidak ketemu”." } }
  },
  trace: {
    intro: "Contoh: <b>Di posisi berapa bilangan negatif pertama?</b> Kembalikan -1 jika tidak ada.",
    input: { placeholder: "daftar Anda: 3, 8, -2" },
    presets: [{ label: "Ketemu di tengah" }, { label: "Ketemu di awal" }, { label: "Tidak ketemu" }, { label: "Daftar kosong" }],
    run(list) {
      const n = list.length, ev = [], states = list.map(() => "");
      let answer = "?";
      const snap = (step, msg, cur = -1, tone = "") => ev.push({
        step, msg, tone,
        view: { values: list, states: states.slice(), ptr: cur },
        vars: [{ k: "i", role: "stepper", v: cur >= 0 ? cur : "—" }, { k: "numbers[i]", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "answer", role: "result", v: answer }]
      });
      snap(null, n ? "Siap. Di mana bilangan negatif pertama?" : "Siap. Daftarnya kosong.");
      for (let i = 0; i < n; i++) {
        states[i] = "current";
        snap(1, `Kunjungi posisi ${i}.`, i);
        const hit = list[i] < 0;
        states[i] = hit ? "hit" : "miss";
        snap(2, hit ? `Apakah ${list[i]} < 0? Ya.` : `Apakah ${list[i]} < 0? Tidak, lanjut.`, i);
        if (hit) {
          for (let j = i + 1; j < n; j++) states[j] = "skipped";
          answer = i;
          snap(3, `Kecocokan pertama: kembalikan posisi ${i}. ${n - i - 1 ? `${n - i - 1} item lainnya tidak pernah diperiksa.` : ""}`, i, "yes");
          return ev;
        }
      }
      answer = -1;
      snap(4, n ? "Sampai di ujung tanpa kecocokan. Kembalikan -1 (tidak ketemu)." : "Tidak ada posisi untuk dikunjungi. Kembalikan -1 (tidak ketemu).", -1, "no");
      return ev;
    }
  },
  pitfalls: [
    { title: "Menyerah di dalam perulangan", text: "<code>else: return -1</code> di dalam perulangan melaporkan “tidak ketemu” setelah melihat item pertama saja.", take: "“Tidak ketemu” tempatnya setelah perulangan, ketika setiap posisi sudah gagal." },
    { title: "Tidak berhenti pada kecocokan pertama", text: "Menyimpan posisi lalu melanjutkan terus menimpanya, sehingga yang didapat kecocokan <em>terakhir</em>, bukan yang pertama.", take: "Kembalikan (atau break) begitu ketemu." },
    { title: "Nilai “tidak ketemu” yang bisa jadi posisi nyata", text: "Mengembalikan 0 untuk “tidak ketemu” bentrok dengan kecocokan nyata di posisi 0.", take: "Pakai -1, None, atau Option: sesuatu yang tidak mungkin menjadi posisi." },
    { title: "Pakai bagi dua pada data terurut", text: "Jika itemnya terurut, Bagi dua (F2) menemukan item dengan langkah jauh lebih sedikit daripada menelusuri seluruh daftar." },
    { title: "Pakai fungsi bawaan setelah paham", text: "<code>list.index()</code> di Python (memunculkan galat jika tidak ada), <code>indexOf</code> pada list Java, <code>.position()</code> di Rust dan <code>std::ranges::find</code> di C++." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn}([5, -3, -8])?", explain: "Yang dikembalikan posisinya, bukan nilainya. -3 ada di posisi 1 (posisi dimulai dari 0)." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [3, -2, 6, -5]?", explain: "Ia tidak pernah berhenti, jadi setiap bilangan negatif menimpa found. Bilangan negatif terakhir, -5 di posisi 3, yang menang, bukan yang pertama." },
    { q: "Mengapa -1 jawaban “tidak ketemu” yang baik?", options: ["Itu bilangan terkecil", "Tidak ada posisi nyata yang bernilai -1", "Python memerlukannya"], explain: "Posisi dimulai dari 0, jadi -1 tidak pernah tertukar dengan kecocokan nyata." }
  ],
  exercise: {
    title: "Giliran Anda: indeks sebuah target",
    task: "Tulis <code>index_of(numbers, target)</code> yang mengembalikan posisi item pertama yang sama dengan <code>target</code>, atau -1 jika tidak ada.",
    plan: ["Kunjungi setiap posisi berurutan", "Uji: apakah item di posisi itu sama dengan target?", "Cocok? Langsung kembalikan posisi itu", "Setelah perulangan, kembalikan -1"]
  },
  compare: {
    intro: "Tiga skema bersaudara pada daftar yang sama <code>[3, 8, -2, 6, -5]</code>. Warna kuning menandai tempat masing-masing berhenti; item yang pudar tidak pernah diperiksa.",
    rows: [
      { name: "Cari yang pertama", question: "Di mana bilangan negatif pertama?" },
      { name: "Adakah?", question: "Adakah item yang negatif?" },
      { name: "Semuakah?", question: "Apakah semua item positif?" }
    ],
    table: {
      head: ["Skema", "Menjawab", "Berhenti dini pada", "Jika perulangan selesai"],
      rows: [
        ["Cari yang pertama", "sebuah posisi", "kecocokan pertama", "-1 (tidak ketemu)"],
        ["Adakah?", "true / false", "kecocokan pertama", "false"],
        ["Semuakah?", "true / false", "item pertama yang gagal", "true"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "berhenti dini yang sama, mengembalikan posisi alih-alih ya/tidak" }],
    leadsTo: [{ why: "pencarian jauh lebih cepat jika datanya terurut" }, { why: "coba kandidat berurutan sampai ada yang berhasil" }]
  }
};
