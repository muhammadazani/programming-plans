/* Bahasa Indonesia overlay for data/plans/repeat-until-target.js (C4). Text only. */
(function () {
  const RATE = 1.05, MAX_YEARS = 60;

  window.PLAN_ID = {
    title: "Ulangi sampai tercapai",
    highlight: "tercapai",
    aka: ["perulangan berbasis tujuan", "selama belum tercapai", "hitung putarannya"],
    hero: { tag: "tujuan tercapai", alt: "Sederet kubus tahun; yang terakhir berwarna kuning karena tujuan tercapai pada tahun itu" },
    planCard: { name: "sampai tercapai", lines: ["count = 0", "selama tujuan belum tercapai", "satu putaran, count + 1"], foot: "→ kembalikan hitungannya" },
    intent: "Ulangi sebuah langkah sampai tujuan tercapai, sambil menghitung putarannya: banyaknya putaran adalah jawabannya, jadi tidak bisa diketahui sebelumnya.",
    analogy: { title: "Mengisi ember dengan cangkir", text: "Anda menuang cangkir demi cangkir ke ember sambil menghitung. Anda tidak tahu sebelumnya berapa cangkir yang dibutuhkan; Anda berhenti saat ember penuh, dan hitungan Anda adalah jawabannya." },
    cues: ["berapa tahun sampai …", "berapa lama sebelum …", "sampai mencapai …", "setidaknya …", "terus sampai"],
    cueSummary: "Jawabannya adalah <b>berapa putaran</b> yang dibutuhkan untuk mencapai tujuan. Perulangan berhenti karena tujuan, bukan karena hitungan.",
    cueExamples: ["Berapa tahun sampai tabungan mencapai 2000?", "Berapa kali sebuah bilangan harus dibagi dua sampai menjadi 1?", "Berapa hari sampai tanaman setinggi 30 cm?"],
    steps: [
      { title: "Siapkan: mulai penghitung dari 0", text: "Dan nilai awalnya: di sini saldo dimulai dari jumlah awal." },
      { title: "Selama tujuan belum tercapai", text: "Di sini: selama saldo masih di bawah target. Jika sudah tercapai, perulangan tidak pernah berjalan." },
      { title: "Kerjakan satu putaran dan hitung", text: "Tambahkan bunga setahun, lalu tambah satu ke penghitung tahun." },
      { title: "Kembalikan hitungannya", text: "Banyaknya putaran yang dibutuhkan." }
    ],
    impl: {
      python: { plain: { note: "Jika <code>start</code> bernilai 0, saldo tidak pernah bertambah dan perulangan tidak pernah selesai. Lihat jebakannya." }, idiomaticNote: "Perulangan <code>while</code> adalah Python yang idiomatis di sini. (Ada rumus logaritma, tetapi pembulatannya membuat hasil yang tepat sulit didapat.)" },
      java: { idiomaticNote: "Perulangan <code>while</code> adalah Java yang idiomatis di sini." },
      rust: { idiomaticNote: "Perulangan <code>while</code> adalah Rust yang idiomatis di sini." },
      c: { idiomaticNote: "Perulangan <code>while</code> adalah C yang idiomatis di sini." },
      cpp: { idiomaticNote: "Perulangan <code>while</code> adalah C++ yang idiomatis di sini." }
    },
    trace: {
      intro: "Contoh: <b>Tabungan bertambah 5% per tahun. Berapa tahun sampai mencapai target?</b> Kotak baru muncul untuk setiap tahun.",
      presets: [{ label: "1000 → 1300" }, { label: "Sudah tercapai" }, { label: "500 → 800" }],
      run({ start, target }) {
        const ev = [], years = [], states = [];
        let balance = start, count = 0;
        const snap = (step, msg, cur = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: years.slice(), states: states.slice(), ptr: cur, emptyNote: "belum ada tahun" },
          vars: [{ k: "balance", role: "gatherer", v: balance.toFixed(2) }, { k: "target", role: "fixed", v: target }, { k: "years", role: "count", v: count }] });
        snap(null, `Siap. Mulai dari ${start}, tujuannya ${target}.`);
        snap(1, `Siapkan: balance = ${start}, years = 0.`);
        while (balance < target) {
          if (count >= MAX_YEARS) { snap(2, `Penelusuran dihentikan setelah ${MAX_YEARS} tahun: tujuannya masih sangat jauh.`, -1, "no"); return ev; }
          snap(2, `Apakah ${balance.toFixed(2)} < ${target}? Ya, tujuannya belum tercapai.`);
          balance *= RATE; count++;
          years.push(Math.round(balance)); states.forEach((_, i) => { states[i] = "miss"; }); states.push("current");
          snap(3, `Tahun ${count}: balance = ${balance.toFixed(2)}.`, years.length - 1);
        }
        if (states.length) states[states.length - 1] = "hit";
        snap(2, `Apakah ${balance.toFixed(2)} < ${target}? Tidak, tujuannya tercapai.`, years.length - 1);
        snap(4, `Kembalikan ${count} tahun.`, -1, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Mengerjakan putaran sebelum memeriksa", text: "Jika putaran berjalan sebelum diuji, tujuan yang sudah tercapai tetap memakan satu putaran: 1000 → 1000 memberi 1 tahun, bukan 0.", take: "Uji dulu, di atas perulangan." },
      { title: "Tujuan yang tidak mungkin tercapai", text: "Dengan saldo awal 0 (atau pertumbuhan negatif), saldo tidak pernah mencapai target dan perulangan berjalan selamanya.", take: "Pasang penjaga dulu (B1): pastikan kemajuan mungkin terjadi, atau tetapkan batas putaran." },
      { title: "Membandingkan terbalik", text: "<code>while balance &gt; target</code> langsung berhenti jika saldo dimulai di bawah target, dan melaporkan 0 tahun.", take: "Ulangi selama tujuan <em>belum</em> tercapai." },
      { title: "Hitung di tempat yang sama dengan perubahan nilainya", text: "Ubah saldo dan tambah satu ke penghitung berdampingan, agar keduanya tidak berselisih." },
      { title: "Pakai ulangi-n-kali jika jumlahnya diketahui", text: "Jika soalnya berkata “selama 10 tahun”, banyaknya putaran sudah diberikan: itu C1, bukan skema ini." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}(1000, 1100)?", explain: "Setelah 1 tahun: 1050 (masih di bawah 1100). Setelah 2 tahun: 1102.50, yang sudah mencapainya. Jadi 2." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk (1000, 1000)?", explain: "Ia menambah satu tahun sebelum memeriksa, jadi tujuan yang sudah tercapai pun memakan satu tahun." },
      { q: "Skema mana yang cocok untuk “cetak saldo untuk setiap 10 tahun ke depan”?", options: ["Ulangi sampai tercapai", "Ulangi n kali"], explain: "Banyaknya putaran (10) sudah diberikan sejak awal, jadi ini perulangan terhitung, C1." }
    ],
    exercise: {
      title: "Giliran Anda: bagi dua sampai 1",
      task: "Tulis <code>halvings(n)</code> yang mengembalikan berapa kali <code>n</code> harus dibagi dua (dengan pembagian bilangan bulat) sampai bernilai 1 atau kurang.",
      plan: ["Mulai penghitung dari 0", "Selama n lebih besar dari 1", "Bagi dua n (n = n // 2) dan hitung", "Kembalikan hitungannya"]
    },
    compare: {
      intro: "Skema perulangan, dibedakan dari apa yang menghentikan perulangan.",
      rows: [
        { name: "Ulangi sampai tercapai", question: "Berapa tahun sampai tabungan mencapai 2000?", shape: "selama tujuan belum tercapai: satu putaran, hitung", result: "hitungannya adalah jawaban" },
        { name: "Ulangi n kali", question: "Saldo setelah 10 tahun?", result: "hitungannya diberikan" },
        { name: "Coba semua kemungkinan", question: "Pembagi terkecil dari 91?", shape: "coba kandidat berurutan sampai ada yang lolos", result: "kandidatnya adalah jawaban" }
      ],
      table: {
        head: ["Skema", "Diketahui sejak awal", "Berhenti saat", "Jawaban"],
        rows: [
          ["Ulangi sampai tercapai", "tujuannya", "tujuan tercapai", "berapa putaran"],
          ["Ulangi n kali", "banyaknya putaran", "penghitung mencapai n", "keadaan setelah n putaran"],
          ["Coba semua kemungkinan", "ujinya", "ada kandidat yang lolos", "kandidat itu"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "penghitung dan langkah yang diulang" }, { why: "jaga dari tujuan yang tidak mungkin tercapai" }],
      leadsTo: [{ why: "berhenti pada kandidat pertama yang berhasil" }, { why: "terus membagi bilangan sampai mencapai 0" }]
    }
  };
})();
