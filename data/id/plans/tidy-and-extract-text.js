/* Bahasa Indonesia overlay for data/plans/tidy-and-extract-text.js (A4). Text only. */
(function () {
  const q = (s) => `"${s.replace(/ /g, "␣")}"`;

  window.PLAN_ID = {
    title: "Rapikan dan ambil bagian",
    highlight: "ambil bagian",
    aka: ["mengurai string", "trim, cari dan potong", "metode string"],
    hero: { tag: "trim · cari · potong", alt: "Alamat email yang berantakan dan penanda @ mengalir ke kubus proses, yang menghasilkan domain rapi x.com" },
    planCard: { name: "rapikan & ambil", lines: ["rapikan: trim, huruf kecil", "cari penandanya", "tidak ada? → \"\""], foot: "→ potong bagiannya" },
    intent: "Ambil satu potongan bersih dari teks yang berantakan: rapikan, cari penanda yang memisahkan bagian-bagiannya, pastikan penandanya ada, lalu potong bagian yang dibutuhkan.",
    analogy: { title: "Membaca kode pos dari amplop", text: "Pertama Anda meluruskan amplop yang kusut agar bisa dibaca. Lalu Anda mencari baris awal alamat. Jika tidak ada, tidak ada yang bisa dibaca. Jika ada, Anda menyalin bagian sesudahnya saja." },
    cues: ["ambil bagian …", "setelah …", "sebelum …", "abaikan spasi dan huruf besar", "domain / ekstensi / nama pengguna"],
    cueSummary: "Teksnya punya <b>penanda</b> (seperti <code>@</code>, <code>.</code> atau <code>:</code>), dan jawabannya adalah bagian sebelum atau sesudahnya.",
    cueExamples: ["Ambil domain dari alamat email.", "Ambil ekstensi berkas, abaikan huruf besar.", "Ambil nama pengguna dari “user: alice”."],
    steps: [
      { title: "Rapikan teksnya", text: "Buang spasi di kedua ujung dan ubah ke huruf kecil, agar “ Alice@Example.COM ” dan “alice@example.com” diperlakukan sama." },
      { title: "Cari penandanya", text: "Di sini tanda @. Sebagian besar bahasa memberi posisinya, atau -1 / None / npos jika tidak ada." },
      { title: "Tidak ketemu? Kembalikan jawaban kosong", text: "Periksa sebelum memotong: penanda yang hilang adalah kasus biasa, bukan alasan program gagal." },
      { title: "Potong bagian yang dibutuhkan", text: "Semua setelah @: dari posisi at + 1 sampai akhir." }
    ],
    impl: {
      python: { plain: { note: "<code>find</code> mengembalikan -1 jika @ tidak ada. (<code>index</code> justru memunculkan galat.)" }, idiomatic: { note: "<code>partition</code> memecah pada @ pertama menjadi (sebelum, @, sesudah); <code>after</code> bernilai \"\" jika tidak ada @." } },
      java: { idiomaticNote: "<code>trim</code>, <code>indexOf</code> dan <code>substring</code> memang alat Java yang idiomatis untuk ini. (<code>split(\"@\")</code> juga bisa, tetapi perilakunya aneh jika @ hilang atau berulang.)" },
      rust: { plain: { note: "<code>find</code> mengembalikan <code>Option</code>, jadi Rust memaksa Anda menangani kasus tidak ketemu (langkah 3)." }, idiomatic: { note: "<code>split_once</code> memecah pada @ pertama; <code>unwrap_or_default</code> memberi \"\" jika tidak ada." } },
      c: { plain: { note: "C tidak punya trim atau huruf kecil untuk seluruh string, jadi skemanya dikerjakan manual: lewati spasi di kedua ujung, pindai @, dan ubah ke huruf kecil sambil menyalin. Pemanggil menyediakan <code>out</code>." }, idiomaticNote: "Pustaka C punya <code>strchr</code> untuk mencari karakter, tetapi tidak punya trim; pemindaian manual adalah cara yang lazim." },
      cpp: { plain: { note: "<code>std::string</code> tidak punya <code>trim</code>; <code>find_first_not_of</code> dan <code>find_last_not_of</code> mengerjakannya." }, idiomaticNote: "Tidak ada versi C++ standar yang lebih ringkas; <code>find</code> dan <code>substr</code> adalah alat idiomatisnya." }
    },
    trace: {
      intro: "Contoh: <b>Ambil domain dari alamat email</b>, abaikan spasi liar dan huruf besar. (␣ menandai spasi.)",
      presets: [{ label: "Alamat berantakan" }, { label: "Alamat rapi" }, { label: "Tanpa tanda @" }],
      run({ email }) {
        const ev = [];
        const v = { email: q(email), clean: undefined, at: undefined, found: undefined, result: undefined };
        const push = (step, msg, active, fresh = [], done = [], extra = {}) => {
          const st = (name, n, keys) => ({
            label: name, step: n,
            state: extra.error === n ? "error" : active === n ? "active" : done.includes(n) ? "done" : "",
            vars: keys.map((k) => ({ k, v: v[k], fresh: fresh.includes(k) }))
          });
          const stages = [st("Rapikan", 1, ["email", "clean"]), st("Cari @", 2, ["at"]), st("Periksa", 3, ["found"]), st("Potong", 4, ["result"])];
          if (extra.result) stages[3].state = "result";
          ev.push({ step, msg, tone: extra.tone || "", view: { stages }, vars: [] });
        };
        push(null, `Siap. Masukannya ${q(email)}.`, 0);
        const clean = email.trim().toLowerCase();
        v.clean = q(clean);
        push(1, `Rapikan: buang spasi di kedua ujung dan ubah ke huruf kecil: ${q(clean)}.`, 1, ["clean"]);
        const at = clean.indexOf("@");
        v.at = at;
        push(2, at === -1 ? "Cari @: tidak ada, jadi find memberi -1." : `Cari @: ada di posisi ${at}.`, 2, ["at"], [1]);
        if (at === -1) {
          v.found = "no"; v.result = '""';
          push(3, "Tidak ketemu, jadi kembalikan string kosong alih-alih memotong sembarangan.", 3, ["found", "result"], [1, 2], { error: 3, tone: "no" });
          return ev;
        }
        v.found = "yes";
        push(3, "Ketemu, jadi aman untuk memotong.", 3, ["found"], [1, 2]);
        const result = clean.slice(at + 1);
        v.result = q(result);
        push(4, `Potong dari posisi ${at + 1} sampai akhir: ${q(result)}. Kembalikan.`, 4, ["result"], [1, 2, 3], { result: true, tone: "yes" });
        return ev;
      }
    },
    pitfalls: [
      { title: "Melewatkan langkah merapikan", text: "Masukan sungguhan punya spasi liar dan huruf besar acak. Tanpa dirapikan, “Example.COM ” (dengan spasi di akhir) dan “example.com” terlihat seperti domain berbeda.", take: "Trim dan seragamkan huruf sebelum yang lain." },
      { title: "Ikut mengambil penandanya", text: "Memotong dari <code>at</code> alih-alih <code>at + 1</code> membuat @ ikut dalam jawaban: “@site.org”.", take: "Posisi penanda adalah tempat penanda itu <em>berada</em>; bagian sesudahnya dimulai satu posisi kemudian." },
      { title: "Memotong tanpa memeriksa", text: "Jika penandanya tidak ada, find memberi -1 (Python, Java). Memotong dari -1 + 1 = 0 diam-diam mengembalikan seluruh teks sebagai “domain”.", take: "Periksa “tidak ketemu” sebelum memotong." },
      { title: "Tentukan penanda yang mana", text: "“a@b@c” punya dua tanda @. <code>find</code> / <code>indexOf</code> memberi yang pertama; <code>rfind</code> / <code>lastIndexOf</code> memberi yang terakhir. Ekstensi berkas butuh titik terakhir." },
      { title: "Uji kasus yang berantakan", text: "Spasi di kedua ujung, huruf besar, penanda yang hilang, string kosong. Masukan yang rapi menyembunyikan sebagian besar bug." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}(\"  Carol@Mail.NET\")?", explain: "Setelah dirapikan menjadi \"carol@mail.net\", @ ada di posisi 5, dan semua sesudahnya adalah \"mail.net\"." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk \"bob@site.org\"?", explain: "Ia memotong dari at alih-alih at + 1, jadi @ ikut terambil." },
      { q: "Apa yang seharusnya terjadi jika teks tidak memuat @ sama sekali?", options: ["Kembalikan seluruh teks", "Kembalikan string kosong", "Program gagal"], explain: "Penanda yang hilang adalah kasus biasa pada masukan sungguhan. Langkah 3 memeriksanya dan mengembalikan jawaban kosong alih-alih memotong." }
    ],
    exercise: {
      title: "Giliran Anda: ekstensi berkas",
      task: "Tulis <code>file_extension(name)</code> yang mengembalikan bagian setelah titik <b>terakhir</b>, dalam huruf kecil, dengan mengabaikan spasi di kedua ujung. Kembalikan \"\" jika tidak ada titik. (Di C: <code>void file_extension(const char *name, char out[])</code>.)",
      plan: ["Rapikan: trim spasi dan ubah nama ke huruf kecil", "Cari titik terakhir", "Tidak ada titik? Kembalikan string kosong", "Potong semua setelah titik"]
    },
    compare: {
      intro: "Tiga skema yang bekerja dengan teks atau rumus. A4 adalah yang memotong sebagian dari teks yang ada dengan alat string bawaan bahasa.",
      rows: [
        { name: "Rapikan dan ambil bagian", question: "Ambil domain sebuah email", shape: "trim / huruf kecil → cari penanda → periksa → potong", result: "sepotong teks" },
        { name: "Bangun teks", question: "Sembunyikan digit PIN", shape: "kunjungi setiap karakter dan tambahkan potongan ke string baru", result: "teks baru, sama panjang" },
        { name: "Baca–Proses–Hasilkan", question: "Hitung kecepatan", shape: "ubah satuan → rumus → kembalikan", result: "sebuah bilangan" }
      ],
      table: {
        head: ["Skema", "Perulangan?", "Alat utama", "Waspadai"],
        rows: [
          ["Rapikan dan ambil bagian", "biasanya tidak (metodenya yang berulang)", "trim, lower, find, slice", "penanda yang hilang"],
          ["Bangun teks", "ya, atas setiap karakter", "+= / append / push", "mengatur ulang hasil"],
          ["Baca–Proses–Hasilkan", "tidak", "aritmetika", "pembagian bilangan bulat"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "bentuk baca → proses → hasilkan yang sama, diterapkan pada teks" }, { why: "pemeriksaan ketemu / tidak ketemu" }],
      leadsTo: [{ why: "jika tidak ada metode bawaan yang cocok, bangun teks barunya sendiri" }, { why: "find adalah pencarian linear atas karakter" }]
    }
  };
})();
