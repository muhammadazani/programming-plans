/* Bahasa Indonesia overlay for data/plans/read-until-stop-value.js (C2). Text only. */
(function () {
  const STOP = -1;

  window.PLAN_ID = {
    title: "Baca sampai tanda berhenti",
    highlight: "tanda berhenti",
    aka: ["perulangan sentinel", "perulangan baca–proses", "ulangi sampai selesai"],
    hero: { tag: "-1 = berhenti", alt: "Lima kubus: 5, 3 dan 8 diproses, -1 berwarna kuning sebagai tanda berhenti, dan 99 sesudahnya diredupkan karena tidak pernah dibaca" },
    planCard: { name: "sampai berhenti", lines: ["baca nilai pertama", "selama bukan tanda berhenti", "proses, baca berikutnya"], foot: "→ tanda berhenti tidak pernah diproses" },
    intent: "Terus membaca dan memproses nilai sampai tanda berhenti khusus datang, tanpa tahu sebelumnya berapa banyak nilainya.",
    analogy: { title: "Sekat di meja kasir", text: "Kasir memindai barang di ban berjalan satu per satu. Ketika sekat plastik tiba, belanjaan Anda selesai: sekatnya tidak pernah dipindai dan tidak pernah ditagih. Tidak ada yang memberi tahu kasir berapa banyak barang Anda." },
    cues: ["sampai pengguna memasukkan …", "berhenti jika … diketik", "masukkan -1 untuk selesai", "terus membaca …", "banyak nilai yang tidak diketahui"],
    cueSummary: "Nilai terus berdatangan, dan <b>satu nilai khusus berarti berhenti</b>. Tanda berhenti itu sendiri tidak pernah diproses.",
    cueExamples: ["Jumlahkan harga yang diketik pengguna sampai ia mengetik 0.", "Baca kata sampai kata “end”.", "Proses data sensor sampai data -1 menandai akhirnya."],
    steps: [
      { title: "Baca nilai pertama", text: "Sebelum perulangan, agar uji perulangan punya sesuatu untuk diperiksa." },
      { title: "Selama bukan tanda berhenti", text: "Ujinya ada di atas: jika nilai pertama sudah tanda berhenti, perulangan tidak pernah berjalan." },
      { title: "Proses nilainya", text: "Di sini: tambahkan ke total." },
      { title: "Baca nilai berikutnya", text: "Di akhir badan perulangan, agar diperiksa dulu sebelum diproses." },
      { title: "Pakai hasilnya", text: "Tanda berhenti sudah dibaca tetapi tidak pernah diproses." }
    ],
    impl: {
      python: { plain: { note: "Dalam program sungguhan setiap pembacaan adalah <code>int(input())</code>; di sini nilainya berasal dari daftar agar bisa diuji." }, idiomatic: { note: "<code>takewhile</code> memberikan nilai sampai nilai pertama yang gagal uji." } },
      java: { plain: { note: "Dengan masukan sungguhan, setiap pembacaan adalah <code>scanner.nextInt()</code>." }, idiomatic: { note: "<code>takeWhile</code> (Java 9+) menghentikan stream pada nilai pertama yang gagal uji." } },
      c: { plain: { note: "Dengan masukan sungguhan, setiap pembacaan adalah <code>scanf(\"%d\", &amp;value)</code>." }, idiomaticNote: "C tidak punya take-while; perulangan baca–uji–proses–baca adalah cara idiomatisnya." },
      cpp: { plain: { note: "Dengan masukan sungguhan, perulangannya sering ditulis <code>while (std::cin &gt;&gt; value &amp;&amp; value != -1)</code>." }, idiomaticNote: "C++20 punya <code>std::views::take_while</code>, tetapi menjumlahkan view butuh persiapan lebih banyak daripada perulangan biasa; perulangan lebih jelas di sini." }
    },
    trace: {
      intro: "Contoh: <b>Jumlahkan angka sampai tanda berhenti -1.</b> Apa pun setelah -1 tidak pernah dibaca.",
      input: { placeholder: "nilai Anda: 5, 3, -1" },
      presets: [{ label: "Tiga nilai" }, { label: "Langsung berhenti" }, { label: "Satu nilai" }],
      run(raw) {
        const list = raw.includes(STOP) ? raw : raw.concat([STOP]);
        const n = list.length, ev = [], states = list.map(() => "");
        let total = 0, value = "—";
        const snap = (step, msg, cur = -1, tone = "") => ev.push({
          step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur },
          vars: [{ k: "value", role: "walker", v: value }, { k: "total", role: "gatherer", v: total }]
        });
        snap(null, raw.includes(STOP) ? "Siap. Nilai terus berdatangan sampai -1." : "Siap. Daftar Anda tidak memuat -1, jadi -1 ditambahkan di akhir.");
        let i = 0;
        value = list[i]; states[i] = "current";
        snap(1, `Baca nilai pertama: ${value}.`, i);
        for (;;) {
          if (value === STOP) {
            states[i] = "stop";
            for (let j = i + 1; j < n; j++) states[j] = "skipped";
            snap(2, `Apakah ${value} tanda berhenti? Ya, jadi perulangan selesai. -1 tidak ditambahkan.`, i);
            break;
          }
          snap(2, `Apakah ${value} tanda berhenti? Bukan, jadi proses.`, i);
          total += value; states[i] = "added";
          snap(3, `Proses: total = ${total}.`, i);
          i++; value = list[i]; states[i] = "current";
          snap(4, `Baca nilai berikutnya: ${value}.`, i);
        }
        snap(5, `Kembalikan ${total}.`, -1, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Memproses tanda berhenti", text: "Jika nilai diproses sebelum diuji, -1 ikut ditambahkan ke total. Setiap jawaban meleset satu.", take: "Uji dulu (di atas perulangan), baru proses." },
      { title: "Membaca di tempat yang salah", text: "Membaca nilai berikutnya <em>sebelum</em> memproses nilai sekarang melewatkan nilai pertama dan justru memproses tanda berhenti.", take: "Baca sekali sebelum perulangan, lalu sekali di paling akhir badan perulangan." },
      { title: "Lupa membaca lagi", text: "Tanpa pembacaan di akhir badan, nilainya tidak pernah berubah, jadi perulangan tidak pernah selesai.", take: "Setiap jalur di badan perulangan harus sampai ke pembacaan berikutnya." },
      { title: "Pilih tanda berhenti yang tidak mungkin jadi data", text: "-1 cocok untuk jumlah yang tidak pernah negatif. Jika semua bilangan mungkin, pakai kata seperti “done” atau sinyal akhir masukan." },
      { title: "Uji “langsung berhenti”", text: "Jika nilai pertama adalah tanda berhenti, badan perulangan tidak boleh berjalan sama sekali. Karena itulah ujinya ada di atas." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}([4, 4, -1, 4])?", explain: "4 + 4 = 8. -1 menghentikan perulangan dan tidak ditambahkan; 4 sesudahnya tidak pernah dibaca." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk [5, 3, -1]?", explain: "Ia membaca nilai berikutnya sebelum menambah, jadi 5 terlewat dan yang ditambahkan 3 lalu -1: 3 + (-1) = 2." },
      { q: "Jika nilai pertama adalah -1, berapa kali badan perulangan berjalan?", explain: "Ujinya ada di atas perulangan, jadi langsung gagal dan badan perulangan tidak pernah berjalan. Totalnya tetap 0." }
    ],
    exercise: {
      title: "Giliran Anda: hitung sampai tanda berhenti",
      task: "Tulis <code>count_until_stop(values)</code> yang mengembalikan berapa banyak nilai sebelum -1 pertama.",
      plan: ["Baca nilai pertama", "Selama bukan -1", "Hitung", "Baca nilai berikutnya", "Kembalikan hitungannya"]
    },
    compare: {
      intro: "Tiga skema kendali perulangan. Bedanya ada pada <b>apa yang menyuruh perulangan berhenti</b>.",
      rows: [
        { name: "Baca sampai tanda berhenti", question: "Jumlahkan angka sampai -1", shape: "baca dulu; selama bukan tanda berhenti: proses, baca berikutnya", result: "banyaknya tidak diketahui" },
        { name: "Ulangi n kali", question: "Tambahkan bunga selama 3 tahun", result: "tepat n putaran" },
        { name: "Minta ulang sampai benar", question: "Minta bilangan antara 1 dan 10", shape: "baca; selama tidak valid: tegur, baca lagi", result: "satu nilai valid" }
      ],
      table: {
        head: ["Skema", "Berhenti saat", "Memproses nilai terakhir yang dibaca?", "Pemakaian khas"],
        rows: [
          ["Baca sampai tanda berhenti", "tanda berhenti terbaca", "tidak", "menjumlahkan atau menghitung masukan"],
          ["Ulangi n kali", "penghitung mencapai n", "—", "jumlah putaran yang diketahui"],
          ["Minta ulang sampai benar", "nilai valid terbaca", "ya, itulah jawabannya", "memeriksa masukan pengguna"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "total berjalan di dalam perulangan" }],
      leadsTo: [{ why: "bentuk yang sama, dipakai untuk meminta ulang masukan yang tidak valid" }, { why: "menu yang berulang sampai pengguna memilih “keluar”" }]
    }
  };
})();
