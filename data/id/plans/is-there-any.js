/* Bahasa Indonesia overlay for data/plans/is-there-any.js (D7 · Adakah?). Text only. */
window.PLAN_ID = {
  title: "Adakah?",
  highlight: "Adakah?",
  aka: ["pemeriksaan keberadaan", "any()", "pencarian berhenti dini"],
  hero: { tag: "-2 < 0 ✓", alt: "Deretan lima kubus; kubus ketiga, -2, disorot sebagai kecocokan pertama dan dua kubus terakhir diredupkan karena tidak pernah diperiksa" },
  planCard: { name: "adakah?", lines: ["kunjungi setiap item", "uji item itu", "cocok → ya, berhenti"], foot: "↻ jika tidak, lanjut mencari" },
  intent: "Telusuri koleksi dan jawab ya begitu ada satu item yang memenuhi syarat. Jawab tidak hanya setelah semua item gagal.",
  analogy: { title: "Mencari telur yang retak", text: "Anda memeriksa telur dalam satu wadah satu per satu. Begitu menemukan satu yang retak, Anda sudah tahu jawabannya: ya, ada telur retak, dan sisanya tidak perlu dilihat. Anda baru bisa berkata “tidak ada telur retak” setelah memeriksa semuanya." },
  cues: ["adakah …", "apakah berisi …", "setidaknya satu …", "punya … ?", "salah satu …", "… ada?"],
  cueSummary: "Jawabannya hanya <b>ya atau tidak</b>, dan satu item yang cocok sudah cukup untuk menjawab ya.",
  cueExamples: ["Apakah kata sandi berisi setidaknya satu digit?", "Adakah nilai di kelas yang di bawah 50?", "Adakah sensor yang melaporkan suhu di atas 90°?"],
  steps: [
    { title: "Kunjungi setiap item", text: "Telusuri koleksi dari item pertama sampai terakhir." },
    { title: "Uji item itu", text: "Periksa item terhadap syaratnya. Di sini: apakah negatif?" },
    { title: "Cocok? Jawab ya dan berhenti", text: "Satu kecocokan sudah cukup. Langsung kembalikan true, karena sisa item tidak bisa mengubah jawaban." },
    { title: "Tidak ada yang cocok? Jawab tidak", text: "Hanya setelah perulangan selesai, ketika setiap item sudah diuji dan gagal, kembalikan false." }
  ],
  impl: {
    python: { idiomatic: { note: "<code>any()</code> menjalankan langkah 1–4 untuk Anda, dan juga berhenti pada kecocokan pertama." } },
    java: { idiomatic: { note: "<code>anyMatch</code> (perlu <code>import java.util.Arrays;</code>) juga berhenti dini: ia berhenti pada kecocokan pertama." } },
    rust: { plain: { note: "Di Rust, ekspresi terakhir adalah nilai kembalian, jadi <code>false</code> tanpa titik koma berarti “kembalikan false”." }, idiomatic: { note: "<code>Iterator::any</code> berhenti pada item pertama yang membuat closure bernilai <code>true</code>." } },
    c: { plain: { note: "Array C tidak tahu panjangnya sendiri, jadi pemanggil mengirim <code>n</code>." }, idiomaticNote: "C tidak punya <code>any</code> bawaan. Perulangan dasar <em>adalah</em> cara idiomatisnya, karena itu layak dihafal." },
    cpp: { plain: { note: "Berbeda dengan array C, <code>std::vector</code> tahu panjangnya sendiri, jadi <code>for</code> berbasis rentang tidak perlu indeks." }, idiomatic: { note: "<code>std::ranges::any_of</code> (C++20) berhenti pada kecocokan pertama. Sebelum C++20, tulis <code>std::any_of(numbers.begin(), numbers.end(), …)</code>." } }
  },
  trace: {
    intro: "Contoh: <b>Apakah daftar transaksi bank berisi jumlah yang negatif?</b> Syarat untuk setiap item adalah <code>x &lt; 0</code>.",
    input: { placeholder: "daftar Anda: 5, 2, -7" },
    presets: [{ label: "Ketemu di awal" }, { label: "Ketemu di akhir" }, { label: "Tidak ketemu" }, { label: "Daftar kosong" }],
    run(list) {
      const n = list.length, ev = [];
      const snap = (step, msg, { cur = -1, states = [], answer = "?", checked = 0, tone = "" } = {}) => ev.push({
        step, msg, tone,
        view: { values: list, states, ptr: cur },
        vars: [
          { k: "x", role: "walker", v: cur >= 0 ? list[cur] : "—" },
          { k: "answer", role: "result", v: answer },
          { k: "checked", role: "count", v: checked, of: n }
        ]
      });
      const seen = (i, cls) => list.map((_, j) => (j < i ? "miss" : j === i ? cls : ""));
      snap(null, n ? "Siap. Belum ada yang diperiksa, jadi jawabannya belum diketahui." : "Siap. Daftarnya kosong.");
      for (let i = 0; i < n; i++) {
        snap(1, `Kunjungi item [${i}]: x = ${list[i]}`, { cur: i, states: seen(i, "current"), checked: i + 1 });
        const hit = list[i] < 0;
        snap(2, hit ? `Apakah ${list[i]} < 0? Ya, cocok.` : `Apakah ${list[i]} < 0? Tidak, lanjut mencari.`,
          { cur: i, states: seen(i, hit ? "hit" : "miss current"), checked: i + 1 });
        if (hit) {
          const left = n - i - 1;
          snap(3, `Ketemu. Jawab True dan berhenti. ${left ? `${left} item tidak pernah diperiksa.` : "Kebetulan itu item terakhir."}`,
            { cur: i, states: list.map((_, j) => (j < i ? "miss" : j === i ? "hit" : "skipped")), answer: "True", checked: i + 1, tone: "yes" });
          return ev;
        }
      }
      snap(4, n === 1 ? "Satu-satunya item sudah diperiksa dan tidak cocok. Jawab False." : n ? `Semua ${n} item sudah diperiksa dan tidak ada yang cocok. Jawab False.` : "Tidak ada item, jadi tidak ada yang bisa cocok. Jawab False.",
        { states: list.map(() => "miss"), answer: "False", checked: n, tone: "no" });
      return ev;
    }
  },
  pitfalls: [
    { title: "Menyerah di dalam perulangan", text: "Menaruh jawaban “tidak” di <code>else</code> di dalam perulangan membuat fungsi menjawab setelah melihat item pertama saja.", take: "Jawaban “tidak” tempatnya setelah perulangan, ketika setiap item sudah gagal." },
    { title: "Menimpa jawaban", text: "Menulis <code>found = x &lt; 0</code> di setiap putaran membuang kecocokan sebelumnya. Hasilnya hanya menggambarkan item terakhir.", take: "Bendera “sudah ketemu” itu satu arah: boleh berubah dari false ke true, tidak pernah kembali." },
    { title: "Terus mencari setelah ketemu", text: "Mengisi bendera lalu melanjutkan memang memberi jawaban yang benar, tetapi memeriksa setiap item dengan sia-sia. Untuk sejuta item, itu sejuta pemeriksaan terbuang.", take: "Berhenti pada kecocokan pertama dengan return (atau break)." },
    { title: "Ketahui jawaban untuk daftar kosong", text: "Tanpa item, tidak ada yang bisa cocok, jadi jawabannya <b>tidak</b> (false). Saudaranya, “Semuakah?”, menjawab <b>ya</b> untuk daftar kosong. Keduanya sering tertukar." },
    { title: "Pakai fungsi bawaan setelah paham", text: "<code>any()</code> di Python, <code>anyMatch</code> di Java, <code>.any()</code> di Rust dan <code>std::ranges::any_of</code> di C++ adalah skema yang persis ini. Ganti bilah atas ke <b>Idiomatis</b> untuk melihatnya." }
  ],
  quiz: [
    { q: "Memanggil {fn} pada [5, -1, -8, 3]: berapa item yang diperiksa perulangan sebelum menjawab?", explain: "Ia memeriksa 5 (tidak), lalu -1 (ya) dan berhenti. -8 dan 3 tidak pernah dilihat." },
    { q: "Apa yang dikembalikan {fn} untuk daftar kosong?", options: ["True", "False", "Galat"], explain: "Badan perulangan tidak pernah berjalan, jadi baris setelah perulangan yang menjawab: False. Tidak ada bilangan negatif, karena memang tidak ada bilangan sama sekali." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [-2, 3]?", explain: "found menjadi true pada -2, lalu 3 menimpanya dengan false. Setiap putaran mengganti jawaban, jadi hanya item terakhir yang dihitung. Inilah jebakan “menimpa jawaban”." }
  ],
  exercise: {
    title: "Giliran Anda: adakah huruf vokal?",
    task: "Tulis <code>has_vowel(word)</code> yang mengembalikan true jika kata (huruf kecil) berisi setidaknya satu dari <code>a e i o u</code>, dan false jika tidak. Ikuti keempat langkah skemanya.",
    plan: ["Kunjungi setiap karakter", "Uji: apakah termasuk \"aeiou\"?", "Cocok? Langsung kembalikan true", "Setelah perulangan: kembalikan false"]
  },
  compare: {
    intro: "Tiga skema bersaudara pada daftar yang sama <code>[3, 8, -2, 6, -5]</code>. Warna kuning menandai tempat masing-masing berhenti; item yang pudar tidak pernah diperiksa.",
    rows: [
      { name: "Cari yang pertama", question: "Bilangan negatif pertama yang mana?", result: "-2 (di 2)" },
      { name: "Adakah?", question: "Adakah item yang negatif?" },
      { name: "Semuakah?", question: "Apakah semua item negatif?" }
    ],
    table: {
      head: ["Skema", "Menjawab", "Berhenti dini pada", "Jika perulangan selesai", "Daftar kosong"],
      rows: [
        ["Cari yang pertama", "itemnya atau posisinya", "kecocokan pertama", "“tidak ketemu” (None / -1)", "tidak ketemu"],
        ["Adakah?", "true / false", "kecocokan pertama", "false", "false"],
        ["Semuakah?", "true / false", "item pertama yang gagal", "true", "true"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "perulangan yang mengunjungi setiap item" }, { why: "uji ya/tidak di dalam perulangan" }],
    leadsTo: [{ why: "kembalikan itemnya, bukan hanya ya/tidak" }, { why: "kebalikannya: berhenti pada kegagalan pertama" }, { why: "pindahkan uji ke fungsi tersendiri yang bisa dipakai ulang" }]
  }
};
