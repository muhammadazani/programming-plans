/* Bahasa Indonesia overlay for data/plans/average.js (D3). Text only. */
(function () {
  const f = (x) => (Number.isInteger(x) ? x.toFixed(1) : String(+x.toFixed(6)));

  window.PLAN_ID = {
    title: "Rata-rata",
    highlight: "Rata-rata",
    aka: ["mean", "rata-rata hitung", "total ÷ banyaknya"],
    hero: { tag: "240 ÷ 3 = 80.0", alt: "Tiga kubus, 70, 80 dan 90, dengan label 240 dibagi 3 sama dengan 80.0" },
    planCard: { name: "rata-rata", lines: ["kosong? → 0.0", "total dan banyaknya", "total ÷ banyaknya"], foot: "→ sebagai pecahan" },
    intent: "Cari nilai yang mewakili sebuah koleksi: jumlahkan item, hitung banyaknya, lalu bagi, tetapi hanya jika ada setidaknya satu item.",
    analogy: { title: "Membagi potongan pizza dengan adil", text: "Kumpulkan semua potongan lalu bagi rata: bagian setiap orang adalah total dibagi banyaknya orang. Jika tidak ada orang di meja, pertanyaannya tidak masuk akal." },
    cues: ["rata-rata", "mean", "secara rata-rata", "nilai umumnya", "per item"],
    cueSummary: "Jawabannya <b>total ÷ banyaknya</b>, biasanya berupa pecahan. Tanyakan apa yang terjadi jika tidak ada item.",
    cueExamples: ["Berapa nilai rata-rata kelas?", "Berapa suhu rata-rata minggu ini?", "Rata-rata berapa langkah saya berjalan per hari?"],
    steps: [
      { title: "Penjaga: tanpa item, tanpa rata-rata", text: "Membagi dengan banyaknya 0 akan gagal atau menghasilkan omong kosong, jadi tentukan apa yang dikembalikan daftar kosong (di sini 0.0)." },
      { title: "Simpan total berjalan", text: "Ini skema Akumulasi (D2)." },
      { title: "Hitung banyaknya item", text: "Ini skema Menghitung (D1), menghitung setiap item. Keduanya berjalan dalam perulangan yang sama." },
      { title: "Bagi, dengan mempertahankan pecahan", text: "total ÷ banyaknya sebagai pembagian pecahan, sehingga 3 ÷ 2 menghasilkan 1.5, bukan 1." }
    ],
    impl: {
      python: { plain: { note: "<code>len(scores)</code> di Python sudah tahu banyaknya; perulangan menghitung secara manual untuk memperlihatkan skemanya." }, idiomatic: { note: "Daftar kosong bernilai salah di Python, jadi <code>if scores</code> adalah penjaganya." } },
      java: { plain: { note: "<code>(double) total</code> mengubah tipe lebih dulu, sehingga pembagian mempertahankan pecahannya." }, idiomatic: { note: "<code>average()</code> mengembalikan <code>OptionalDouble</code> kosong jika tanpa item; <code>orElse</code> adalah penjaganya." } },
      rust: { idiomatic: { note: "Rust tidak punya fungsi rata-rata bawaan; <code>sum</code> dan <code>len</code> yang bekerja." } },
      c: { idiomaticNote: "C tidak punya fungsi rata-rata bawaan, jadi perulangan adalah cara idiomatisnya." }
    },
    trace: {
      intro: "Contoh: <b>Berapa rata-rata nilai?</b> Daftar kosong menghasilkan 0.0.",
      input: { placeholder: "nilai Anda: 70, 80, 90" },
      presets: [{ label: "Tiga nilai" }, { label: "Bukan bilangan bulat" }, { label: "Satu nilai" }, { label: "Daftar kosong" }],
      run(list) {
        const n = list.length, ev = [], states = list.map(() => "");
        let total = 0, count = 0, avg = "?";
        const snap = (step, msg, cur = -1, tone = "") => ev.push({
          step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur },
          vars: [{ k: "total", role: "gatherer", v: total }, { k: "count", role: "count", v: count }, { k: "average", role: "result", v: avg }]
        });
        snap(null, n ? `Siap. Ada ${n} nilai yang akan dirata-ratakan.` : "Siap. Daftarnya kosong.");
        if (n === 0) {
          avg = "0.0";
          snap(1, "Penjaga: tidak ada item, jadi tidak ada rata-rata. Kembalikan 0.0 tanpa membagi.", -1, "no");
          return ev;
        }
        snap(1, `Penjaga: daftar berisi ${n} item, jadi pembagian aman. Lanjutkan.`);
        for (let i = 0; i < n; i++) {
          states[i] = "current";
          total += list[i];
          snap(2, `Kunjungi item [${i}] dan jumlahkan: total = ${total}`, i);
          count++;
          states[i] = "added";
          snap(3, `Hitung item itu: count = ${count}`, i);
        }
        avg = f(total / count);
        snap(4, `Bagi: ${total} / ${count} = ${avg}`, -1, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Pembagian bilangan bulat", text: "Di Java, C dan C++, <code>int</code> dibagi <code>int</code> membuang pecahan: rata-rata 1 dan 2 menjadi 1.0, bukan 1.5. <code>//</code> di Python juga begitu.", take: "Ubah ke tipe pecahan sebelum membagi." },
      { title: "Tanpa penjaga untuk daftar kosong", text: "Tanpa item, banyaknya 0. Python memunculkan <code>ZeroDivisionError</code>, Java melempar galat untuk bilangan bulat, dan perilaku C tidak terdefinisi.", take: "Tentukan apa yang dikembalikan untuk “tanpa item”, dan periksa lebih dulu." },
      { title: "Menghitung mulai dari 1", text: "Memulai banyaknya dari 1 membagi dengan satu terlalu banyak, sehingga setiap rata-rata terlalu kecil.", take: "Penghitung dimulai dari 0." },
      { title: "Kerjakan dalam satu putaran", text: "Total dan banyaknya bisa berbagi satu perulangan. Dua perulangan terpisah pada data yang sama juga benar, tetapi menelusuri dua kali." },
      { title: "Uji kasus yang menghasilkan pecahan", text: "[1, 2] → 1.5 langsung menangkap pembagian bulat. Rata-rata seperti [70, 80, 90] → 80.0 menyembunyikannya." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}([1, 2, 3, 4])?", explain: "Totalnya 10 dan banyaknya 4, jadi rata-ratanya 10 ÷ 4 = 2.5." },
      { q: "Mengapa penjaga diletakkan sebelum perulangan?", options: ["Agar perulangan lebih cepat", "Agar kita tidak pernah membagi dengan banyaknya 0", "Karena daftarnya mungkin terurut"], explain: "Daftar kosong punya banyaknya 0, dan membagi dengan 0 gagal. Penjaga menjawab kasus itu sebelum pembagian apa pun terjadi." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk [2, 4]?", explain: "count dimulai dari 1 dan menjadi 3 setelah dua item, jadi yang dihitung 6 ÷ 3 = 2.0, bukan 6 ÷ 2 = 3.0." }
    ],
    exercise: {
      title: "Giliran Anda: rata-rata bilangan positif",
      task: "Tulis <code>average_positive(numbers)</code> yang mengembalikan rata-rata dari bilangan yang lebih besar dari 0 saja. Jika tidak ada, kembalikan 0.0.",
      plan: ["Simpan total dan banyaknya, keduanya mulai dari 0", "Kunjungi setiap bilangan", "Jika positif, jumlahkan ke total dan hitung", "Jika banyaknya 0, kembalikan 0.0; jika tidak, kembalikan total ÷ banyaknya sebagai pecahan"]
    },
    compare: {
      intro: "Rata-rata adalah dua skema dalam satu perulangan. Begini hubungannya dengan bagian-bagiannya, pada <code>[70, 80, 90]</code>.",
      rows: [
        { name: "Rata-rata", question: "Berapa rata-ratanya?" },
        { name: "Akumulasi", question: "Berapa totalnya?" },
        { name: "Menghitung", question: "Ada berapa item?" }
      ],
      table: {
        head: ["Skema", "Perlu penjaga?", "Tipe hasil", "Menggabungkan"],
        rows: [
          ["Rata-rata", "ya, untuk daftar kosong", "pecahan", "Akumulasi + Menghitung"],
          ["Akumulasi", "tidak (kosong menghasilkan 0)", "sama dengan itemnya", "—"],
          ["Menghitung", "tidak (kosong menghasilkan 0)", "bilangan bulat", "—"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "total berjalan" }, { why: "banyaknya item" }, { why: "penjaga terhadap daftar kosong" }],
      leadsTo: [{ why: "rangkuman satu angka lain dari sebuah daftar" }, { why: "rata-ratakan hanya item yang lolos saringan" }]
    }
  };
})();
