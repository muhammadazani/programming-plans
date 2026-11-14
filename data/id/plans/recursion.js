/* Bahasa Indonesia overlay for data/plans/recursion.js (G3). Text only. */
window.PLAN_ID = {
  title: "Rekursi",
  highlight: "Rekursi",
  aka: ["fungsi rekursif", "kasus dasar + kasus rekursif", "memanggil diri sendiri"],
  hero: { tag: "kasus dasar: 1", alt: "Tangga pemanggilan: faktorial 4 memanggil 3, yang memanggil 2, yang memanggil 1, kasus dasar berwarna kuning" },
  planCard: { name: "rekursi", lines: ["kasus dasar: jawab langsung", "selain itu: panggil diri dengan yang lebih kecil", "gabungkan hasilnya"], foot: "→ setiap panggilan kembali ke pemanggilnya" },
  intent: "Selesaikan masalah dengan menyelesaikan versi yang lebih kecil dari masalah yang sama: kasus dasar menjawab masukan terkecil langsung, dan setiap kasus lain memanggil fungsi pada sesuatu yang lebih kecil lalu membangun di atas jawabannya.",
  analogy: { title: "Boneka matryoshka", text: "Untuk menghitung bonekanya, Anda membuka yang terluar dan bertanya “ada berapa di dalam yang ini?”, lalu menambahkan satu. Setiap boneka mengajukan pertanyaan yang sama kepada boneka di dalamnya, sampai boneka terkecil, yang cukup menjawab “hanya aku: 1”. Lalu jawabannya kembali keluar, satu boneka demi satu." },
  cues: ["didefinisikan dengan dirinya sendiri", "n! = n × (n − 1)!", "data bersarang / berbentuk pohon", "versi lebih kecil dari masalah yang sama", "folder di dalam folder"],
  cueSummary: "Jawaban untuk n bisa dibangun dari jawaban untuk <b>n yang lebih kecil</b>, dan kasus terkecilnya mudah.",
  cueExamples: ["Hitung n! = n × (n − 1) × … × 1.", "Jumlahkan bilangan dari 1 sampai n.", "Hitung semua berkas di sebuah folder dan subfoldernya."],
  steps: [
    { title: "Kasus dasar: jawab masukan terkecil langsung", text: "Di sini: 0! dan 1! bernilai 1. Tanpa kasus dasar, pemanggilannya tidak pernah berhenti." },
    { title: "Kasus rekursif: panggil diri sendiri dengan masukan lebih kecil", text: "factorial(n − 1): satu langkah lebih dekat ke kasus dasar." },
    { title: "Gabungkan dan kembalikan", text: "Pakai jawaban yang lebih kecil untuk membangun jawaban ini: n × factorial(n − 1)." }
  ],
  impl: {
    python: { plain: { note: "Python membatasi kedalaman rekursi (sekitar 1000 panggilan), jadi rekursi yang sangat dalam perlu diganti perulangan." }, idiomatic: { note: "Faktorial juga bisa berupa perulangan akumulasi (D2); <code>math.factorial(n)</code> juga ada. Rekursi paling bersinar untuk data bersarang, seperti folder." } },
    java: { plain: { note: "<code>int</code> meluap di atas 12!; pakai <code>long</code> (sampai 20!) atau <code>BigInteger</code>." }, idiomaticNote: "Method rekursif ini adalah Java yang idiomatis; perulangan juga sama baiknya untuk faktorial." },
    rust: { idiomatic: { note: "<code>product()</code> mengalikan sebuah rentang: versi perulangan dari gagasan yang sama." } },
    c: { idiomaticNote: "Fungsi rekursif ini adalah C yang idiomatis; setiap panggilan mendapat salinan <code>n</code>-nya sendiri di call stack." },
    cpp: { idiomaticNote: "Fungsi rekursif ini adalah C++ yang idiomatis (bahkan bisa <code>constexpr</code>, dihitung saat kompilasi)." }
  },
  trace: {
    intro: "Contoh: <b>n! = n × (n − 1) × … × 1.</b> Setiap kotak adalah satu panggilan fungsi, menunggu panggilan di bawahnya kembali.",
    presets: [{ label: "4!" }, { label: "1! (kasus dasar)" }, { label: "6!" }],
    run({ n }) {
      const ev = [], frames = [];
      const snap = (step, msg, tone = "") => ev.push({ step, msg, tone, view: { frames: frames.map((f) => ({ ...f })) },
        vars: [{ k: "panggilan menunggu", role: "count", v: frames.filter((f) => f.state === "waiting").length }, { k: "kedalaman", role: "stepper", v: frames.length }] });
      snap(null, `Siap. Panggil factorial(${n}).`);
      for (let k = n; ; k--) {
        frames.forEach((f) => { if (f.state === "active") f.state = "waiting"; });
        frames.push({ call: `factorial(${k})`, state: "active", note: "" });
        if (k <= 1) {
          frames[frames.length - 1].state = "base";
          frames[frames.length - 1].note = `${k} ≤ 1: kasus dasar`;
          snap(1, `factorial(${k}): ${k} ≤ 1, jadi langsung jawab 1. Tidak ada panggilan lagi.`);
          frames[frames.length - 1].ret = 1;
          break;
        }
        frames[frames.length - 1].note = `butuh factorial(${k - 1})`;
        snap(2, `factorial(${k}): bukan kasus dasar, jadi panggil factorial(${k - 1}) dan tunggu jawabannya.`);
      }
      for (let i = frames.length - 1; i > 0; i--) {
        const below = frames[i].ret, parent = frames[i - 1], pk = n - (i - 1);
        frames[i].state = "done";
        parent.state = "active"; parent.ret = pk * below; parent.note = `${pk} × ${below}`;
        snap(3, `factorial(${pk}) menerima ${below} dan mengembalikan ${pk} × ${below} = ${pk * below}.`, i === 1 ? "yes" : "");
      }
      if (frames.length === 1) snap(3, `factorial(${n}) mengembalikan 1.`, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Kasus dasar yang salah", text: "Jika kasus dasar mengembalikan 0, setiap jawaban dikalikan 0 dalam perjalanan kembali: factorial(4) menjadi 0.", take: "Periksa kasus dasar secara manual: 1! harus 1." },
    { title: "Tanpa kasus dasar, atau panggilan yang tidak mengecil", text: "<code>factorial(n)</code> yang memanggil <code>factorial(n)</code> (atau lupa kasus dasar) tidak pernah berhenti, sampai program kehabisan stack dan gagal.", take: "Setiap panggilan rekursif harus bergerak menuju kasus dasar." },
    { title: "Menggabungkan dengan cara yang salah", text: "<code>n + factorial(n - 1)</code> menghitung 1 + 2 + … + n, bukan hasil kalinya.", take: "Tulis definisinya dulu (n! = n × (n − 1)!), lalu salin ke dalam kode." },
    { title: "Percayai panggilan yang lebih kecil", text: "Saat menulis kasus rekursif, anggap <code>factorial(n - 1)</code> sudah benar, dan tanyakan saja: bagaimana mendapat n! darinya?" },
    { title: "Pilih perulangan untuk hitungan sederhana", text: "Untuk faktorial dan jumlah, perulangan (D2) lebih sederhana dan tidak bisa kehabisan stack. Rekursi paling cocok untuk data bersarang: folder, pohon, daftar bersarang." }
  ],
  quiz: [
    { q: "Berapa kali {fn} dipanggil untuk {fn}(5), termasuk yang pertama?", explain: "factorial(5), (4), (3), (2) dan (1): lima panggilan. factorial(1) adalah kasus dasar dan tidak memanggil lagi." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk 4?", explain: "Ia menjumlahkan alih-alih mengalikan: 4 + 3 + 2 + 1 = 10." },
    { q: "Panggilan mana yang selesai lebih dulu?", explain: "Setiap panggilan menunggu panggilan yang dibuatnya. Kasus dasar kembali lebih dulu, dan jawabannya mengalir naik sampai factorial(5) yang terakhir." }
  ],
  exercise: {
    title: "Giliran Anda: jumlah 1 sampai n, secara rekursif",
    task: "Tulis <code>sum_to(n)</code> yang mengembalikan 1 + 2 + … + n dengan rekursi. sum_to(0) bernilai 0.",
    plan: ["Kasus dasar: n 0 atau kurang? Kembalikan 0", "Kasus rekursif: panggil sum_to(n - 1)", "Gabungkan: kembalikan n + jawaban itu"]
  },
  compare: {
    intro: "Perhitungan yang sama, 4! = 24, dengan rekursi dan dengan perulangan.",
    rows: [
      { name: "Rekursi", question: "4! = 4 × 3!", shape: "kasus dasar, lalu panggil diri dengan n − 1 dan gabungkan", result: "panggilan menumpuk, lalu kembali" },
      { name: "Akumulasi", question: "1 × 2 × 3 × 4", shape: "hasil kali berjalan dalam satu perulangan", result: "satu variabel diperbarui" },
      { name: "Ulangi n kali", question: "Kalikan 4 kali", shape: "perulangan terhitung", result: "satu variabel diperbarui" }
    ],
    table: {
      head: ["Skema", "Berulang dengan", "Berhenti pada", "Paling cocok untuk"],
      rows: [
        ["Rekursi", "memanggil diri dengan masukan lebih kecil", "kasus dasar", "masalah bersarang atau berbentuk pohon"],
        ["Akumulasi", "perulangan atas item", "akhir daftar", "total dan hasil kali sebuah daftar"],
        ["Ulangi n kali", "perulangan terhitung", "n putaran", "banyak pengulangan yang diketahui"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "fungsi dengan tugas yang jelas" }, { why: "kasus dasar diperiksa lebih dulu, seperti penjaga" }],
    leadsTo: [{ why: "jumlah digit juga bisa ditulis secara rekursif" }]
  }
};
