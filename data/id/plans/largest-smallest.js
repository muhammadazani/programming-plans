/* Bahasa Indonesia overlay for data/plans/largest-smallest.js (D4). Text only. */
window.PLAN_ID = {
  title: "Nilai terbesar / terkecil",
  highlight: "terbesar",
  aka: ["maksimum / minimum", "terbaik sejauh ini", "nilai ekstrem"],
  hero: { tag: "best = 9", alt: "Lima kubus, 4, 9, 2, 9 dan 7; angka 9 yang pertama berwarna kuning sebagai yang terbaik sejauh ini" },
  planCard: { name: "terbesar", lines: ["best = item pertama", "untuk setiap item lain", "lebih besar? best baru"], foot: "→ kembalikan best" },
  intent: "Cari nilai paling ekstrem: jadikan item pertama sebagai yang terbaik sejauh ini, lalu biarkan setiap item berikutnya menantangnya.",
  analogy: { title: "Raja bukit", text: "Pemain pertama berdiri di atas bukit. Setiap pemain baru menantang siapa pun yang ada di atas, dan merebut bukit hanya jika lebih kuat. Setelah penantang terakhir selesai, siapa pun yang berdiri di bukit adalah yang terkuat." },
  cues: ["terbesar / tertinggi", "terkecil / terendah", "maksimum / minimum", "paling …", "rekor", "terbaik"],
  cueSummary: "Jawabannya <b>salah satu item</b>: yang mengalahkan semua item lain. Setiap item harus dibandingkan.",
  cueExamples: ["Berapa suhu tertinggi minggu ini?", "Berapa harga termurah dalam daftar?", "Kata mana yang paling panjang dalam sebuah kalimat?"],
  steps: [
    { title: "Mulai dengan item pertama sebagai terbaik sejauh ini", text: "Bukan dengan 0: jika semua nilai negatif, 0 akan menang secara keliru." },
    { title: "Kunjungi setiap item lainnya", text: "Item pertama sudah menjadi yang terbaik sejauh ini." },
    { title: "Bandingkan dengan yang terbaik sejauh ini", text: "Untuk terbesar, apakah lebih besar? Untuk terkecil, apakah lebih kecil?" },
    { title: "Lebih baik? Jadikan terbaik yang baru", text: "Jika tidak, yang terbaik sejauh ini tetap." },
    { title: "Kembalikan yang terbaik", text: "Setelah perulangan, terbaik sejauh ini adalah yang terbaik dari semuanya." }
  ],
  impl: {
    python: { plain: { note: "Daftar harus berisi setidaknya satu item: <code>numbers[0]</code> gagal pada daftar kosong. Pasang penjaga lebih dulu (B1) jika daftar bisa kosong." }, idiomatic: { note: "<code>max()</code> memunculkan <code>ValueError</code> untuk daftar kosong; <code>max(numbers, default=None)</code> menghindarinya." } },
    java: { plain: { note: "Perulangan dimulai dari indeks 1, karena item 0 sudah menjadi yang terbaik sejauh ini." }, idiomatic: { note: "<code>max()</code> mengembalikan <code>OptionalInt</code>, yang kosong untuk array kosong." } },
    rust: { idiomatic: { note: "<code>max()</code> mengembalikan <code>Option</code>: <code>None</code> untuk slice kosong, yang diubah <code>unwrap</code> menjadi panic." } },
    c: { idiomaticNote: "C tidak punya fungsi maksimum bawaan untuk array, jadi perulangan adalah cara idiomatisnya." },
    cpp: { idiomatic: { note: "<code>std::ranges::max</code> (C++20) tidak boleh dipanggil pada rentang kosong." } }
  },
  trace: {
    intro: "Contoh: <b>Berapa bilangan terbesar dalam daftar?</b> Daftar berisi setidaknya satu item.",
    input: { placeholder: "daftar Anda: 4, 9, 2" },
    presets: [{ label: "Campuran" }, { label: "Semua negatif" }, { label: "Naik" }, { label: "Satu item" }],
    run(raw) {
      const list = raw.length ? raw : [0];
      const n = list.length, ev = [], states = list.map(() => "");
      let best = list[0], bestAt = 0;
      const snap = (step, msg, cur = -1, tone = "") => {
        const st = states.slice(); st[bestAt] = st[bestAt] === "current" ? "current" : "best";
        const badges = list.map((_, i) => (i === bestAt ? "best" : ""));
        ev.push({ step, msg, tone, view: { values: list, states: st, ptr: cur, badges },
          vars: [{ k: "x", role: "walker", v: cur > 0 ? list[cur] : "—" }, { k: "best", role: "best", v: best }] });
      };
      ev.push({ step: null, msg: raw.length ? "Siap. Bilangan mana yang terbesar?" : "Daftar tidak boleh kosong, jadi penelusuran ini memakai [0].", view: { values: list, states: states.slice(), ptr: -1 }, vars: [{ k: "x", role: "walker", v: "—" }, { k: "best", role: "best", v: "?" }] });
      snap(1, `Mulai dengan item pertama: best = ${best}.`, 0);
      for (let i = 1; i < n; i++) {
        states[i] = "current";
        snap(2, `Kunjungi item [${i}]: x = ${list[i]}`, i);
        const better = list[i] > best;
        states[i] = "miss";
        if (better) {
          snap(3, `Apakah ${list[i]} > ${best}? Ya, ia mengalahkan yang terbaik sejauh ini.`, i);
          best = list[i]; bestAt = i;
          snap(4, `Terbaik baru: best = ${best}.`, i);
        } else {
          snap(3, `Apakah ${list[i]} > ${best}? Tidak${list[i] === best ? " (sama besar bukan lebih besar)" : ""}, jadi best tetap ${best}.`, i);
        }
      }
      snap(5, n === 1 ? `Hanya ada satu item, jadi itulah yang terbesar. Kembalikan ${best}.` : `Semua ${n} item sudah dibandingkan. Kembalikan ${best}.`, -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Memulai terbaik dari 0", text: "Benar untuk bilangan positif, jadi lolos pengujian sekilas. Tetapi dengan [-5, -2, -9], tidak ada yang mengalahkan 0, dan fungsi mengembalikan 0, bilangan yang bahkan tidak ada dalam daftar.", take: "Mulai dengan item pertama. Ia selalu kandidat yang sah." },
    { title: "Membandingkan terbalik", text: "<code>x &lt; best</code> mencari yang terkecil, bukan yang terbesar. Kodenya hampir sama, jadi kesalahannya mudah terlewat.", take: "Ucapkan perbandingannya: “apakah lebih besar dari yang terbaik sejauh ini?”" },
    { title: "Melupakan daftar kosong", text: "Daftar kosong tidak punya nilai terbesar. <code>numbers[0]</code> gagal (atau membaca sampah di C).", take: "Jika daftar bisa kosong, pasang penjaga lebih dulu (B1) dan tentukan apa yang dikembalikan." },
    { title: "Tentukan apa yang terjadi jika seri", text: "Dengan <code>&gt;</code>, yang pertama dari dua nilai sama tetap menjadi terbaik. Dengan <code>&gt;=</code>, yang terakhir menang. Ini penting jika Anda butuh posisinya (D5)." },
    { title: "Pakai fungsi bawaan setelah paham", text: "<code>max()</code>, <code>stream().max()</code>, <code>.iter().max()</code> dan <code>std::ranges::max</code> adalah skema ini." }
  ],
  quiz: [
    { q: "Dalam {fn}([3, 8, 5, 10, 1]), berapa kali best berubah setelah dimulai dari 3?", explain: "8 mengalahkan 3 (perubahan pertama), 5 tidak mengalahkan 8, 10 mengalahkan 8 (perubahan kedua), 1 tidak mengalahkan 10. Dua perubahan." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [3, 9, 4]?", explain: "Perbandingannya x < best, jadi yang disimpan nilai terkecil: 3. Balik menjadi x > best untuk yang terbesar." },
    { q: "Mengapa tidak memulai dengan best = 0?", options: ["Lebih lambat", "Semua item mungkin negatif", "0 bukan bilangan bulat"], explain: "Untuk [-5, -2, -9], tidak ada item yang mengalahkan 0, jadi jawabannya 0, yang tidak ada dalam daftar. Item pertama selalu kandidat yang sah." }
  ],
  exercise: {
    title: "Giliran Anda: cari yang terkecil",
    task: "Tulis <code>smallest(numbers)</code> yang mengembalikan bilangan terkecil dalam daftar yang tidak kosong.",
    plan: ["Mulai dengan bilangan pertama sebagai terbaik sejauh ini", "Kunjungi setiap bilangan lainnya", "Apakah lebih kecil dari yang terbaik sejauh ini?", "Jika ya, jadikan terbaik yang baru", "Kembalikan yang terbaik"]
  },
  compare: {
    intro: "Tiga skema yang merangkum <code>[4, 9, 2, 9, 7]</code> dengan mengunjungi setiap item.",
    rows: [
      { name: "Nilai terbesar / terkecil", question: "Berapa nilai terbesarnya?" },
      { name: "Posisi terbesar", question: "Di mana nilai terbesarnya?", result: "indeks 1" },
      { name: "Akumulasi", question: "Berapa totalnya?" }
    ],
    table: {
      head: ["Skema", "Mengingat", "Mulai dengan", "Mengembalikan"],
      rows: [
        ["Nilai terbesar / terkecil", "nilai terbaik sejauh ini", "item pertama", "sebuah nilai dari daftar"],
        ["Posisi terbesar", "indeks terbaik sejauh ini", "indeks 0", "sebuah indeks"],
        ["Akumulasi", "total berjalan", "0", "nilai gabungan"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "perulangan atas item" }, { why: "perbandingan “apakah lebih baik?”" }],
    leadsTo: [{ why: "ingat di mana yang terbaik, bukan hanya nilainya" }, { why: "pengurutan dengan memilih terkecil mengulang skema ini" }]
  }
};
