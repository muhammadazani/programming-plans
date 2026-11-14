/* Bahasa Indonesia overlay for data/plans/remember-what-you-have-seen.js (F4). Text only. */
window.PLAN_ID = {
  title: "Simpan yang sudah dilihat",
  highlight: "sudah dilihat",
  aka: ["set seen", "hapus duplikat", "deduplikasi"],
  hero: { tag: "[3, 1, 2]", alt: "Lima bilangan; 3, 1 dan 2 yang pertama berwarna kuning karena disimpan, dan ulangannya diredupkan" },
  planCard: { name: "seen", lines: ["seen = set kosong", "pernah dilihat? lewati", "baru? simpan, ingat"], foot: "→ setiap nilai sekali" },
  intent: "Simpan set berisi nilai yang sudah pernah ditemui, agar ulangan langsung dikenali: di sini, untuk menyimpan hanya salinan pertama setiap nilai.",
  analogy: { title: "Cap tangan di pintu masuk", text: "Di gerbang festival, tangan setiap pengunjung dicap saat pertama kali masuk. Ketika seseorang kembali, capnya menunjukkan ia sudah dihitung, jadi tidak dihitung dua kali. Cap itulah set “seen”." },
  cues: ["hapus duplikat", "setiap … hanya sekali", "unik / berbeda", "sudah pernah dilihat", "ulangan pertama"],
  cueSummary: "Untuk setiap item, Anda perlu tahu <b>apakah ia sudah pernah muncul</b>.",
  cueExamples: ["Hapus nama ganda dari daftar, simpan yang pertama dari masing-masing.", "Bilangan mana yang pertama kali muncul dua kali?", "Berapa pengunjung berbeda yang datang minggu ini?"],
  steps: [
    { title: "Mulai dengan hasil kosong dan set “seen” kosong", text: "Set langsung menjawab “apakah saya sudah melihat ini?”, berapa pun isinya." },
    { title: "Kunjungi setiap item", text: "Berurutan, agar salinan pertama setiap nilai yang disimpan." },
    { title: "Pernah dilihat? Lewati", text: "Itu ulangan." },
    { title: "Baru? Simpan dan ingat", text: "Tambahkan ke hasil dan ke set seen." },
    { title: "Kembalikan hasilnya", text: "Setiap nilai sekali, dalam urutan kemunculan pertamanya." }
  ],
  impl: {
    python: { idiomatic: { note: "Dictionary menyimpan satu entri per kunci, dalam urutan pertama kali ditambahkan." } },
    java: { plain: { note: "<code>seen.add(x)</code> juga mengembalikan false jika x sudah ada, jadi langkah 3 dan 4 bisa menjadi satu <code>if (seen.add(x))</code>." }, idiomatic: { note: "<code>distinct()</code> menyimpan yang pertama dari setiap nilai, berurutan." } },
    rust: { idiomatic: { note: "<code>insert</code> mengembalikan true hanya untuk nilai baru, jadi ia menjadi uji penyaringnya." } },
    c: { plain: { note: "C tidak punya set bawaan, jadi hasilnya sendiri yang dicari (sebuah Adakah? di dalam perulangan). Cukup untuk daftar kecil; untuk yang besar, urutkan dulu atau pakai hash table." }, idiomaticNote: "Mencari di antara item yang disimpan adalah cara C yang lazim untuk skala kecil." },
    cpp: { plain: { note: "C++20 juga punya <code>seen.contains(x)</code>. (<code>std::unique</code> berbeda: ia hanya menghapus ulangan yang bersebelahan.)" }, idiomaticNote: "Perulangan dengan set seen adalah C++ yang idiomatis jika urutan aslinya penting." }
  },
  trace: {
    intro: "Contoh: <b>Hapus duplikat dari daftar, simpan salinan pertama setiap nilai.</b>",
    input: { placeholder: "bilangan: 3, 1, 3, 2" },
    presets: [{ label: "Ada ulangan" }, { label: "Semua sama" }, { label: "Tanpa ulangan" }],
    run(list) {
      const ev = [], states = list.map(() => ""), seen = [], result = [];
      const snap = (step, msg, cur = -1, tone = "", fresh = -1) => ev.push({ step, msg, tone,
        view: { values: list, states: states.slice(), ptr: cur, out: { label: "result", items: result.slice(), fresh, empty: "[ ] kosong" } },
        vars: [{ k: "x", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "seen", role: "gatherer", v: `{${seen.join(", ")}}` }] });
      snap(null, list.length ? "Siap. Simpan salinan pertama setiap nilai." : "Siap. Daftarnya kosong.");
      snap(1, "Mulai dengan hasil kosong dan set seen kosong.");
      list.forEach((x, i) => {
        states[i] = "current"; snap(2, `Kunjungi item [${i}]: ${x}.`, i);
        if (seen.includes(x)) { states[i] = "skipped"; snap(3, `${x} sudah ada di set seen: lewati ulangan ini.`, i); return; }
        seen.push(x); result.push(x); states[i] = "added";
        snap(4, `${x} baru: simpan, dan ingat.`, i, "", result.length - 1);
      });
      snap(5, `Kembalikan [${result.join(", ")}].`, -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Hanya membandingkan dengan item sebelumnya", text: "Memeriksa item sebelumnya saja menangkap ulangan yang bersebelahan, tetapi [1, 2, 1] tetap menyimpan kedua angka 1.", take: "Ingat setiap nilai yang sudah ditemui, bukan hanya yang terakhir." },
    { title: "Lupa mengingat", text: "Jika nilai baru disimpan tetapi tidak pernah ditambahkan ke set seen, tidak ada yang pernah dianggap sudah dilihat, dan setiap ulangan ikut disimpan.", take: "Menyimpan dan mengingat berjalan bersama." },
    { title: "Mencari di daftar alih-alih set", text: "Memeriksa <code>x in result</code> pada daftar menelusuri seluruh daftar setiap kali: tidak masalah untuk 10 item, lambat untuk 100 000.", take: "Pakai set (atau dictionary) untuk nilai yang sudah dilihat." },
    { title: "Pakai ulang set seen untuk pertanyaan lain", text: "Set yang sama memberi tahu ulangan pertama (latihan), berapa nilai berbeda (ukurannya), atau apakah dua daftar punya nilai yang sama." },
    { title: "Pakai dictionary untuk hitungan", text: "Jika Anda butuh berapa kali setiap nilai muncul, bukan hanya apakah muncul, pakai Hitung kemunculan (D15)." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn}([4, 2, 4, 4, 9, 2])?", explain: "Salinan pertama, dalam urutan kemunculan pertamanya: 4, 2, 9." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [1, 2, 1]?", explain: "Ia hanya membandingkan setiap item dengan item yang baru disimpan. Angka 1 kedua datang setelah 2, jadi tidak dikenali sebagai ulangan." },
    { q: "Mengapa memakai set untuk nilai yang sudah dilihat?", options: ["Set menjawab “apakah saya sudah melihat ini?” dengan cepat, sebesar apa pun isinya", "Set menjaga itemnya terurut", "Set bisa menampung duplikat"], explain: "Memeriksa set butuh waktu kira-kira sama, berisi 10 nilai maupun sejuta; memeriksa daftar makin lambat saat daftarnya bertambah." }
  ],
  exercise: {
    title: "Giliran Anda: ulangan pertama",
    task: "Tulis <code>first_repeat(numbers)</code> yang mengembalikan nilai pertama yang muncul untuk kedua kalinya, atau -1 jika tidak ada yang berulang. (Di C Anda boleh menganggap nilainya antara 0 dan 99.)",
    plan: ["Mulai dengan set seen kosong", "Kunjungi setiap bilangan", "Sudah pernah dilihat? Langsung kembalikan", "Jika tidak, ingat", "Tidak ada ulangan sampai akhir: kembalikan -1"]
  },
  compare: {
    intro: "Skema yang melihat item dalam kaitannya dengan yang datang sebelumnya.",
    rows: [
      { name: "Simpan yang sudah dilihat", question: "Hapus duplikat", shape: "set berisi setiap nilai yang sudah ditemui", result: "sudah dilihat atau baru" },
      { name: "Bandingkan dengan sebelumnya", question: "Apakah naik?", shape: "hanya item tepat sebelumnya", result: "perbandingan tetangga" },
      { name: "Bandingkan setiap pasangan", question: "Adakah dua item yang sama?", shape: "perulangan bersarang atas setiap pasangan", result: "n(n − 1)/2 pemeriksaan" }
    ],
    table: {
      head: ["Skema", "Mengingat", "Menangkap ulangan yang berjauhan?", "Kerja untuk n item"],
      rows: [
        ["Simpan yang sudah dilihat", "setiap nilai yang ditemui", "ya", "sekitar n pencarian di set"],
        ["Bandingkan dengan sebelumnya", "satu item", "tidak", "n − 1 perbandingan"],
        ["Bandingkan setiap pasangan", "tidak ada", "ya", "sekitar n² / 2 perbandingan"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "simpan hanya sebagian item: di sini, yang baru" }, { why: "“apakah saya sudah melihat ini?” adalah pemeriksaan adakah" }],
    leadsTo: [{ why: "hitung berapa kali setiap nilai muncul" }]
  }
};
