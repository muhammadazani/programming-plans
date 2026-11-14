/* Bahasa Indonesia overlay for data/plans/build-a-string.js (D11). Text only. */
(function () {
  const show = (ch) => (ch === " " ? "␣" : ch);
  const isDigit = (ch) => ch >= "0" && ch <= "9";

  window.PLAN_ID = {
    title: "Bangun teks",
    highlight: "teks",
    aka: ["string builder", "akumulasi teks", "map pada karakter"],
    hero: { tag: "\"PIN**\"", alt: "Lima kubus berisi P, I, N, 4, 0; digitnya berwarna kuning dan labelnya memperlihatkan hasil PIN**" },
    planCard: { name: "bangun", lines: ["result = \"\"", "untuk setiap karakter", "tambah potongan di akhir"], foot: "→ kembalikan result" },
    intent: "Buat teks baru dengan menelusuri teks asli satu karakter demi satu dan menambahkan satu potongan di akhir hasil untuk setiap karakter.",
    analogy: { title: "Menyalin catatan dengan pena merah", text: "Anda menyalin sebuah catatan ke halaman baru, huruf demi huruf. Setiap kali sampai pada nomor telepon, Anda menulis bintang alih-alih setiap digitnya. Catatan aslinya tetap; halaman baru tumbuh satu karakter demi satu." },
    cues: ["ganti setiap …", "sembunyikan / samarkan …", "hapus semua …", "ubah … menjadi …", "bangun / buat string baru", "balikkan"],
    cueSummary: "Jawabannya <b>teks baru</b> yang dibuat dari teks lama, satu karakter demi satu.",
    cueExamples: ["Sembunyikan digit nomor kartu dengan *.", "Hapus semua spasi dari sebuah kalimat.", "Ubah \u201chalo dunia\u201d menjadi \u201cHALO DUNIA\u201d."],
    steps: [
      { title: "Mulai dengan hasil kosong", text: "Belum ada yang ditulis." },
      { title: "Kunjungi setiap karakter", text: "Dari pertama sampai terakhir." },
      { title: "Tentukan apa yang ditulis", text: "Bintang untuk digit; karakter itu sendiri untuk yang lain." },
      { title: "Tambahkan di akhir hasil", text: "Menambah di akhir menjaga karakter tetap dalam urutan aslinya." },
      { title: "Kembalikan hasilnya", text: "Teks aslinya tidak berubah." }
    ],
    impl: {
      python: { plain: { note: "String Python tidak bisa diubah, jadi <code>+=</code> membuat string baru setiap kali. Untuk teks pendek tidak masalah; untuk teks sangat panjang, kumpulkan potongannya dalam daftar lalu <code>\"\".join()</code>." }, idiomatic: { note: "<code>join</code> merekatkan semua potongan sekaligus." } },
      java: { plain: { note: "<code>StringBuilder</code> tumbuh di tempat, alih-alih menyalin seluruh string pada setiap <code>+</code>." }, idiomatic: { note: "Ekspresi reguler yang menelusuri: <code>[0-9]</code> cocok dengan digit mana pun." } },
      rust: { idiomatic: { note: "<code>map</code> menentukan setiap potongan; <code>collect</code> membangun <code>String</code>-nya." } },
      c: { plain: { note: "Pemanggil menyediakan <code>out</code>, cukup besar untuk teks ditambah penutup <code>'\\0'</code>, yang ditulis pada langkah 5." }, idiomaticNote: "C tidak punya pemetaan string bawaan. Perulangan karakter adalah cara idiomatisnya." },
      cpp: { idiomatic: { note: "Salin dulu, lalu ganti di salinannya, agar aslinya tidak berubah." } }
    },
    trace: {
      intro: "Contoh: <b>Sembunyikan setiap digit dengan bintang.</b> Karakter lain disalin apa adanya.",
      presets: [{ label: "\"PIN 4096\"" }, { label: "\"card 12\"" }, { label: "\"hello\"" }, { label: "Teks kosong" }],
      run({ text }) {
        const chars = [...text], n = chars.length, ev = [], states = chars.map(() => ""), result = [];
        const snap = (step, msg, cur = -1, tone = "", fresh = -1) => ev.push({
          step, msg, tone,
          view: { values: chars.map(show), states: states.slice(), ptr: cur, emptyNote: "\"\"  (tidak ada karakter)", out: { label: "result", items: result.map(show), fresh, text: true, empty: "\"\" kosong" } },
          vars: [{ k: "ch", role: "walker", v: cur >= 0 ? `'${chars[cur]}'` : "—" }, { k: "result", role: "gatherer", v: `"${result.join("")}"` }]
        });
        snap(null, n ? `Siap. Ada ${n} karakter untuk disalin.` : "Siap. Teksnya kosong.");
        snap(1, "Mulai dengan hasil kosong: \"\".");
        for (let i = 0; i < n; i++) {
          states[i] = "current";
          snap(2, `Kunjungi karakter [${i}]: '${chars[i]}'`, i);
          const d = isDigit(chars[i]);
          states[i] = d ? "hit" : "miss";
          snap(3, d ? `'${chars[i]}' adalah digit, jadi tulis '*'.` : `'${chars[i]}' bukan digit, jadi tulis apa adanya.`, i);
          result.push(d ? "*" : chars[i]);
          snap(4, `Tambahkan di akhir: result = "${result.join("")}"`, i, "", result.length - 1);
        }
        snap(5, `Kembalikan "${result.join("")}". Teks aslinya tidak berubah.`, -1, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Mulai lagi di dalam perulangan", text: "Mengatur ulang hasil di setiap putaran membuang yang sudah ditulis, sehingga hanya karakter terakhir yang tersisa.", take: "Buat hasil kosong sekali, sebelum perulangan." },
      { title: "Tanpa sengaja menambah di depan", text: "<code>result = potongan + result</code> menaruh setiap potongan baru di depan, sehingga teksnya terbalik. Berguna jika Anda memang ingin membalik, bug jika tidak.", take: "Tambahkan di akhir untuk menjaga urutan." },
      { title: "Melupakan penutup di C", text: "String C diakhiri <code>'\\0'</code>. Tanpa itu, mencetak hasil akan terus membaca memori di belakangnya.", take: "Tulis <code>'\\0'</code> setelah karakter terakhir." },
      { title: "Pakai builder untuk teks panjang", text: "<code>StringBuilder</code> di Java, <code>\"\".join()</code> di Python dan <code>String::push</code> di Rust menghindari penyalinan seluruh string pada setiap penambahan." },
      { title: "Uji teks kosong", text: "Perulangan tidak pernah berjalan dan hasilnya tetap kosong. Hasilnya harus <code>\"\"</code>, bukan galat." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}(\"R2-D2\")?", explain: "Hanya dua angka 2 yang berupa digit, jadi keduanya menjadi bintang. R, - dan D disalin apa adanya." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk \"ab1\"?", explain: "Setiap potongan ditaruh di depan hasil, jadi teksnya keluar terbalik: \"*ba\"." },
      { q: "Berapa panjang hasil dibandingkan teks masukan?", options: ["Lebih pendek", "Sama panjang", "Lebih panjang"], explain: "Setiap karakter menghasilkan tepat satu potongan (bintang atau dirinya sendiri), jadi panjangnya sama. Skema yang menghapus karakter menghasilkan teks yang lebih pendek." }
    ],
    exercise: {
      title: "Giliran Anda: hapus spasi",
      task: "Tulis <code>remove_spaces(text)</code> yang mengembalikan teks tanpa satu spasi pun. (Di C: <code>void remove_spaces(const char *text, char out[])</code>.)",
      plan: ["Mulai dengan hasil kosong", "Kunjungi setiap karakter", "Tentukan: apakah spasi?", "Jika bukan, tambahkan di akhir hasil", "Kembalikan hasilnya"]
    },
    compare: {
      intro: "Tiga skema yang membangun sesuatu yang baru dari sebuah urutan. Yang berbeda adalah apa yang dibangun.",
      rows: [
        { name: "Bangun teks", question: "\"PIN 40\" → \"PIN **\"", shape: "untuk setiap karakter, tambahkan satu potongan di akhir string", result: "teks baru" },
        { name: "Saring", question: "Simpan nilai yang lulus", shape: "untuk setiap item, tambahkan ke daftar baru hanya jika lolos", result: "daftar baru" },
        { name: "Akumulasi", question: "Jumlahkan semua angka", shape: "untuk setiap item, lipat ke total berjalan", result: "satu nilai" }
      ],
      table: {
        head: ["Skema", "Mulai dengan", "Setiap langkah", "Hasil"],
        rows: [
          ["Bangun teks", "\"\"", "menambah sepotong teks di akhir", "sebuah string"],
          ["Saring", "daftar kosong", "mungkin menambah item", "sebuah daftar"],
          ["Akumulasi", "0", "menambah item ke total", "sebuah bilangan"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "gagasan hasil berjalan yang sama, dengan teks alih-alih angka" }],
      leadsTo: [{ why: "rapikan teks dengan metode string bawaan" }, { why: "dua penunjuk, untuk membalik dan palindrom" }]
    }
  };
})();
