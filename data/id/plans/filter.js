/* Bahasa Indonesia overlay for data/plans/filter.js (D9). Text only. */
window.PLAN_ID = {
  title: "Saring",
  highlight: "Saring",
  aka: ["pilih", "simpan jika", "where"],
  hero: { tag: "[72, 90, 50]", alt: "Lima kubus; 72, 90 dan 50 berwarna kuning karena disimpan, 45 dan 38 pucat; labelnya memperlihatkan daftar baru [72, 90, 50]" },
  planCard: { name: "saring", lines: ["result = daftar kosong", "untuk setiap item", "lolos? tambahkan"], foot: "→ kembalikan result" },
  intent: "Bangun daftar baru yang hanya menyimpan item yang lolos uji, dengan urutan aslinya. Daftar asli tidak diubah.",
  analogy: { title: "Saringan kopi", text: "Tuang kopi melalui saringan: cairannya lolos ke cangkir, ampasnya tertinggal. Anda mendapat secangkir baru berisi yang lolos saja, tanpa perlu mengubah kopinya sendiri." },
  cues: ["hanya yang …", "semua … yang", "simpan / pilih …", "item mana saja …", "buang semua …", "daftar dari yang …"],
  cueSummary: "Jawabannya <b>daftar baru</b>: item yang lolos uji, dengan urutan aslinya.",
  cueExamples: ["Buat daftar nilai yang lulus.", "Produk mana yang harganya di bawah 10?", "Buang setiap data negatif dari pengukuran."],
  steps: [
    { title: "Mulai dengan daftar hasil kosong", text: "Belum ada yang disimpan." },
    { title: "Kunjungi setiap item", text: "Setiap item mendapat giliran." },
    { title: "Uji item itu", text: "Di sini: apakah nilainya minimal 50?" },
    { title: "Lolos? Tambahkan ke hasil", text: "Tambahkan di akhir, agar urutan aslinya terjaga." },
    { title: "Kembalikan hasilnya", text: "Daftar baru. Daftar masukan tidak berubah." }
  ],
  impl: {
    python: { idiomatic: { note: "List comprehension adalah penyaring bawaan Python: “s, untuk setiap s di scores, jika s ≥ 50”." } },
    java: { plain: { note: "<code>List</code> bisa bertambah panjang, tidak seperti array, jadi cocok untuk hasil yang ukurannya belum diketahui." }, idiomatic: { note: "<code>boxed()</code> mengubah setiap <code>int</code> menjadi <code>Integer</code> agar bisa masuk ke <code>List</code>. <code>toList()</code> memerlukan Java 16+." } },
    rust: { idiomatic: { note: "<code>collect()</code> membangun <code>Vec</code> baru dari item yang lolos." } },
    c: { plain: { note: "Fungsi C tidak mudah mengembalikan array baru. Pemanggil mengirim array <code>out</code> yang cukup besar untuk setiap item, dan fungsi mengembalikan berapa yang disimpan." }, idiomaticNote: "C tidak punya penyaring bawaan. Perulangan dengan array keluaran adalah cara idiomatisnya." },
    cpp: { idiomatic: { note: "<code>back_inserter</code> menambahkan setiap item yang disalin ke <code>result</code>." } }
  },
  trace: {
    intro: "Contoh: <b>Buat daftar nilai yang lulus</b> (minimal 50).",
    input: { placeholder: "nilai Anda: 72, 45, 90" },
    presets: [{ label: "Nilai campuran" }, { label: "Tidak ada yang lulus" }, { label: "Semua lulus" }, { label: "Daftar kosong" }],
    run(list) {
      const PASS = 50;
      const n = list.length, ev = [], states = list.map(() => ""), result = [];
      const snap = (step, msg, cur = -1, tone = "", fresh = -1) => ev.push({
        step, msg, tone,
        view: { values: list, states: states.slice(), ptr: cur, out: { label: "result", items: result.slice(), fresh, empty: "[ ] kosong" } },
        vars: [{ k: "s", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "len(result)", role: "gatherer", v: result.length }]
      });
      snap(null, n ? "Siap. Nilai mana yang lulus?" : "Siap. Daftarnya kosong.");
      snap(1, "Mulai dengan daftar hasil kosong.");
      for (let i = 0; i < n; i++) {
        states[i] = "current";
        snap(2, `Kunjungi item [${i}]: s = ${list[i]}`, i);
        const ok = list[i] >= PASS;
        states[i] = ok ? "added" : "miss";
        snap(3, ok ? `Apakah ${list[i]} >= ${PASS}? Ya, simpan.` : `Apakah ${list[i]} >= ${PASS}? Tidak, tinggalkan.`, i);
        if (ok) { result.push(list[i]); snap(4, `Tambahkan ${list[i]} di akhir hasil.`, i, "", result.length - 1); }
      }
      snap(5, `Kembalikan [${result.join(", ")}]. Daftar aslinya tidak berubah.`, -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Membuat hasil di dalam perulangan", text: "Daftar hasil baru di setiap putaran membuang semua yang sudah disimpan. Paling bagus Anda mendapat item terakhir; sering kali tidak mendapat apa pun.", take: "Buat hasilnya sekali, sebelum perulangan." },
    { title: "Menghapus item dari daftar yang sedang ditelusuri", text: "Menghapus sambil menelusuri menggeser item yang tersisa, sehingga perulangan melewatkan sebagian. Di Java juga bisa melempar <code>ConcurrentModificationException</code>.", take: "Bangun daftar baru. Itulah yang dilakukan skema ini." },
    { title: "Ukuran keluaran C terlalu kecil", text: "Jika semua item lolos, hasilnya sepanjang masukan. Array <code>out</code> yang lebih kecil akan meluap.", take: "Buat array keluaran setidaknya sebesar masukan." },
    { title: "Pisahkan menyaring dan menghitung", text: "Jika Anda hanya perlu <em>berapa banyak</em> yang lolos, itu Menghitung (D1): tidak perlu daftar baru." },
    { title: "Pakai fungsi bawaan setelah paham", text: "List comprehension, <code>stream().filter()</code>, <code>.iter().filter().collect()</code> dan <code>std::ranges::copy_if</code> adalah skema ini." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn}([50, 49, 51])?", explain: "50 dan 51 minimal 50, jadi keduanya disimpan, dengan urutan aslinya. Hasilnya daftar, bukan hitungan." },
    { q: "Setelah menyaring [72, 45, 90], apa isi daftar aslinya?", explain: "Menyaring membangun daftar baru. Daftar aslinya tidak pernah diubah." },
    { q: "Jika 3 dari 10 item lolos, berapa item yang dikunjungi perulangan?", explain: "Setiap item harus diuji untuk mengetahui apakah disimpan, jadi kesepuluhnya dikunjungi." }
  ],
  exercise: {
    title: "Giliran Anda: simpan bilangan genap",
    task: "Tulis <code>evens(numbers)</code> yang mengembalikan daftar baru berisi bilangan genap saja, dengan urutan aslinya. (Di C: <code>size_t evens(const int numbers[], size_t n, int out[])</code>, mengembalikan berapa yang ditulis.)",
    plan: ["Mulai dengan hasil kosong", "Kunjungi setiap bilangan", "Uji: apakah genap?", "Jika ya, tambahkan di akhir hasil", "Kembalikan hasilnya"]
  },
  compare: {
    intro: "Tiga skema yang mengunjungi setiap nilai di <code>[72, 45, 90, 50, 38]</code> tetapi mengembalikan hal berbeda.",
    rows: [
      { name: "Saring", question: "Nilai mana yang lulus?" },
      { name: "Ubah setiap elemen", question: "Tambah 5 poin bonus ke setiap nilai" },
      { name: "Menghitung", question: "Berapa yang lulus?" }
    ],
    table: {
      head: ["Skema", "Hasil", "Panjang hasil", "Mengubah item?"],
      rows: [
        ["Saring", "daftar baru", "0 sampai sepanjang masukan", "tidak"],
        ["Ubah setiap elemen", "daftar baru", "sama dengan masukan", "ya"],
        ["Menghitung", "sebuah bilangan", "—", "tidak"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "uji yang sama, menyimpan item alih-alih menghitungnya" }],
    leadsTo: [{ why: "ubah setiap item alih-alih memilih sebagian" }, { why: "saring item yang sudah pernah ditemui" }]
  }
};
