/* Bahasa Indonesia overlay for data/plans/menu-loop.js (C5). Text only. */
(function () {
  const NAMES = { 0: "keluar", 1: "setor 10", 2: "tarik 5" };

  window.PLAN_ID = {
    title: "Perulangan menu",
    highlight: "menu",
    aka: ["perulangan perintah", "event loop (sederhana)", "perulangan dispatch"],
    hero: { tag: "0 = keluar", alt: "Sederet pilihan menu: setor, setor, tarik sudah dikerjakan, 0 berwarna kuning sebagai keluar, dan pilihan sesudahnya tidak pernah dibaca" },
    planCard: { name: "menu", lines: ["tampilkan menu, baca pilihan", "selama bukan keluar", "jalankan, baca lagi"], foot: "→ selesaikan" },
    intent: "Tampilkan menu, jalankan pilihan pengguna, lalu kembali ke menu, berulang-ulang sampai pengguna memilih keluar.",
    analogy: { title: "Mesin ATM", text: "Layarnya menawarkan: 1) setor, 2) tarik, 0) keluar. Anda memilih, mesin mengerjakannya, dan menu muncul lagi. Itu terus berulang sampai Anda menekan keluar; baru saat itu kartu Anda dikembalikan." },
    cues: ["menu", "1) … 2) … 0) keluar", "sampai pengguna memilih keluar", "berulang kali bertanya apa yang harus dilakukan", "perintah"],
    cueSummary: "Program menawarkan <b>beberapa aksi</b> dan terus menawarkannya sampai pengguna memilih “keluar”.",
    cueExamples: ["Menu rekening bank: setor, tarik, lihat saldo, keluar.", "Aplikasi daftar tugas: tambah, lihat, hapus, keluar.", "Kuis yang bertanya “main lagi?” setelah setiap ronde."],
    steps: [
      { title: "Tampilkan menu dan baca pilihan", text: "Sebelum perulangan, agar ujinya punya pilihan untuk diperiksa." },
      { title: "Selama pilihannya bukan keluar", text: "Di sini 0 berarti keluar." },
      { title: "Jalankan pilihannya", text: "Satu cabang per opsi: 1 menyetor 10, 2 menarik 5 jika uangnya cukup. Pilihan yang tidak dikenal diabaikan." },
      { title: "Tampilkan menu lagi dan baca pilihan berikutnya", text: "Di akhir badan perulangan." },
      { title: "Selesaikan", text: "Setelah keluar: di sini, kembalikan saldo akhir." }
    ],
    impl: {
      python: { plain: { note: "Program sungguhan mencetak menu dan membaca <code>int(input(\"Choice: \"))</code> di langkah 1 dan 4." }, idiomatic: { note: "<code>match</code> (Python 3.10+) mendaftar opsi seperti menunya; <code>case 2 if …</code> menambahkan kondisi." } },
      java: { idiomatic: { note: "<code>switch</code> gaya panah (Java 14+) tidak punya fall-through, jadi tidak perlu <code>break</code>." } },
      c: { idiomatic: { note: "Setiap <code>case</code> diakhiri <code>break</code>; tanpa itu, C jatuh terus ke case berikutnya." } }
    },
    trace: {
      intro: "Contoh: <b>Menu bank mungil.</b> 1) setor 10, 2) tarik 5 (hanya jika saldo setidaknya 5), 0) keluar. Setiap kotak adalah satu pilihan yang diketik pengguna.",
      input: { placeholder: "pilihan: 1, 1, 2, 0" },
      presets: [{ label: "Setor, setor, tarik" }, { label: "Langsung keluar" }, { label: "Menarik terlalu dini" }],
      run(raw) {
        const list = raw.includes(0) ? raw : raw.concat([0]);
        const ev = [], states = list.map(() => ""), badges = list.map(() => "");
        let balance = 0, choice = "—";
        const snap = (step, msg, cur = -1, tone = "") => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur, badges: badges.slice() },
          vars: [{ k: "choice", role: "walker", v: choice }, { k: "balance", role: "gatherer", v: balance }] });
        snap(null, raw.includes(0) ? "Siap. Menu tampil di layar." : "Daftar Anda tidak memuat 0 (keluar), jadi 0 ditambahkan di akhir.");
        let i = 0; choice = list[0]; states[0] = "current";
        snap(1, `Tampilkan menu dan baca pilihan: ${choice} (${NAMES[choice] || "bukan opsi"}).`, 0);
        while (choice !== 0) {
          snap(2, `Apakah ${choice} opsi keluar? Bukan, jadi jalankan.`, i);
          if (choice === 1) { balance += 10; badges[i] = "+10"; states[i] = "added"; snap(3, `Setor 10: balance = ${balance}.`, i); }
          else if (choice === 2 && balance >= 5) { balance -= 5; badges[i] = "−5"; states[i] = "added"; snap(3, `Tarik 5: balance = ${balance}.`, i); }
          else if (choice === 2) { badges[i] = "ditolak"; states[i] = "miss"; snap(3, `Tarik 5? Uangnya tidak cukup (saldo ${balance}), jadi tidak terjadi apa-apa.`, i); }
          else { badges[i] = "tak dikenal"; states[i] = "miss"; snap(3, `${choice} tidak ada di menu, jadi diabaikan. (Program sungguhan akan memberi tahu.)`, i); }
          i++; choice = list[i]; states[i] = "current";
          snap(4, `Tampilkan menu lagi dan baca pilihan berikutnya: ${choice} (${NAMES[choice] || "bukan opsi"}).`, i);
        }
        states[i] = "stop"; badges[i] = "keluar"; for (let j = i + 1; j < list.length; j++) states[j] = "skipped";
        snap(2, "Apakah 0 opsi keluar? Ya, jadi perulangan selesai.", i);
        snap(5, `Selesaikan: kembalikan saldonya, ${balance}.`, -1, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Tidak memeriksa sebelum menjalankan", text: "Penarikan tanpa pemeriksaan saldo membuat rekening bisa negatif: memilih 2 lebih dulu menyisakan -5.", take: "Setiap opsi memeriksa syaratnya sendiri sebelum dijalankan." },
      { title: "Mengabaikan opsi keluar", text: "Menelusuri setiap pilihan, alih-alih berhenti di 0, tetap memproses perintah yang tidak dimaksudkan pengguna setelah ia keluar.", take: "Kondisi perulangannya adalah “bukan keluar”." },
      { title: "Fall-through di C dan C++", text: "<code>case</code> tanpa <code>break</code> langsung jatuh ke case berikutnya: setoran juga akan ikut menarik.", take: "Akhiri setiap case dengan break (atau pakai switch panah di Java, match di Rust atau Python)." },
      { title: "Tangani pilihan yang tidak dikenal", text: "Pengguna mengetik hal yang tidak ada di menu. Cabang else / default sebaiknya berkata “opsi tidak dikenal” dan menampilkan menu lagi." },
      { title: "Taruh setiap aksi di fungsinya sendiri", text: "Setelah opsinya mengerjakan hal sungguhan, <code>deposit()</code>, <code>withdraw()</code> dan seterusnya menjaga perulangannya tetap pendek dan mudah dibaca." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}([1, 2, 2, 0])?", explain: "Setor 10 (10), tarik 5 (5), tarik 5 (0), lalu keluar." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk [1, 0, 1, 0]?", explain: "Ia menelusuri setiap pilihan dan tidak berhenti di 0 pertama, jadi setoran yang diketik setelah keluar ikut diproses." },
      { q: "Di mana program membaca pilihan berikutnya?", options: ["Di awal badan perulangan", "Di akhir badan perulangan", "Hanya sebelum perulangan"], explain: "Sekali sebelum perulangan, lalu di akhir setiap putaran, agar setiap pilihan diperiksa terhadap “keluar” sebelum dijalankan." }
    ],
    exercise: {
      title: "Giliran Anda: menu penghitung",
      task: "Tulis <code>run_counter(commands)</code>: 1 menambah satu ke penghitung, 2 mengurangi satu (tetapi tidak pernah di bawah 0), 3 mengatur ulang ke 0, dan 0 keluar. Kembalikan penghitung setelah keluar.",
      plan: ["Baca perintah pertama", "Selama bukan 0", "Jalankan: 1 menambah, 2 mengurangi jika di atas 0, 3 mengatur ulang", "Baca perintah berikutnya, dan kembalikan penghitung di akhir"]
    },
    compare: {
      intro: "Tiga perulangan masukan dengan bentuk baca–uji–baca yang sama.",
      rows: [
        { name: "Perulangan menu", question: "1) setor 2) tarik 0) keluar", shape: "selama bukan keluar: jalankan pilihannya, baca berikutnya", result: "keadaan setelah keluar" },
        { name: "Baca sampai tanda berhenti", question: "Jumlahkan angka sampai -1", shape: "selama bukan tanda berhenti: proses, baca berikutnya", result: "sebuah total" },
        { name: "Tabel rujukan", question: "Apa arti pilihan 2?", shape: "tabel dari opsi ke aksi", result: "satu aksi" }
      ],
      table: {
        head: ["Skema", "Setiap nilai yang dibaca adalah", "Berakhir pada", "Di dalam perulangan"],
        rows: [
          ["Perulangan menu", "sebuah perintah", "opsi keluar", "satu cabang per opsi"],
          ["Baca sampai tanda berhenti", "data", "tanda berhenti", "pemrosesan yang sama setiap kali"],
          ["Tabel rujukan", "sebuah kunci", "—", "tanpa perulangan"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "baca, uji tanda berhenti, baca lagi" }, { why: "satu cabang per opsi menu" }],
      leadsTo: [{ why: "pindahkan setiap aksi ke fungsinya sendiri" }, { why: "petakan opsi ke aksi dengan tabel" }]
    }
  };
})();
