/* Bahasa Indonesia overlay for data/plans/binary-search.js (F2). Text only. */
window.PLAN_ID = {
  title: "Bagi dua",
  highlight: "Bagi dua",
  aka: ["pencarian biner", "bisection", "pencarian divide and conquer"],
  hero: { tag: "7 ketemu di [3]", alt: "Sederet kubus terurut; separuh kiri diredupkan karena sudah dicoret, dan 7 berwarna kuning karena ditemukan" },
  planCard: { name: "bagi dua", lines: ["low = awal, high = akhir", "lihat yang di tengah", "coret separuhnya"], foot: "↻ sampai ketemu atau habis" },
  intent: "Cari item dalam data terurut dengan melihat bagian tengah rentang yang tersisa dan mencoret separuh tempat item itu tidak mungkin berada, berulang-ulang.",
  analogy: { title: "Mencari nama di buku telepon", text: "Anda membuka buku di sekitar tengah. Nama-nama di sana datang setelah nama yang Anda cari, jadi seluruh separuh kedua dicoret. Anda membuka separuh pertama di tengahnya dan mengulanginya. Seribu halaman hanya butuh sekitar sepuluh kali melihat." },
  cues: ["daftar terurut", "cari dengan cepat", "berurutan", "tebak angka (lebih besar / lebih kecil)", "data besar"],
  cueSummary: "Datanya <b>terurut</b>, dan Anda perlu menemukan sesuatu di dalamnya dengan cepat.",
  cueExamples: ["Di mana 7 dalam [1, 3, 5, 7, 9, 11]?", "Tebak angka dari 1 sampai 100 dengan petunjuk “lebih besar” dan “lebih kecil”.", "Cari sebuah kata di kamus yang terurut."],
  steps: [
    { title: "Rentang pencarian adalah seluruh daftar", text: "low = 0, high = posisi terakhir." },
    { title: "Selama rentangnya tidak kosong", text: "low ≤ high. Rentang berisi satu item tetap perlu diperiksa." },
    { title: "Lihat item di tengah", text: "mid = (low + high) // 2, posisi di tengah rentang." },
    { title: "Ketemu? Kembalikan posisinya", text: "Item di mid adalah targetnya." },
    { title: "Jika tidak, coret separuhnya", text: "Target lebih besar: hanya mungkin di kanan mid (low = mid + 1). Lebih kecil: di kiri mid (high = mid − 1)." },
    { title: "Rentangnya habis: kembalikan -1", text: "Targetnya tidak ada dalam daftar." }
  ],
  impl: {
    python: { idiomatic: { note: "<code>bisect_left</code> mengembalikan letak target, atau tempat ia akan disisipkan; baris kedua memastikan target memang ada." } },
    java: { plain: { note: "Untuk array yang sangat besar, <code>low + (high - low) / 2</code> menghindari <code>low + high</code> meluap." }, idiomatic: { note: "<code>Arrays.binarySearch</code> mengembalikan bilangan negatif (tidak selalu -1) jika target tidak ada." } },
    rust: { plain: { note: "Posisi bertipe <code>i32</code> bertanda, karena <code>high</code> bisa turun ke -1, yang tidak bisa ditampung <code>usize</code>." }, idiomatic: { note: "<code>binary_search</code> mengembalikan <code>Ok(posisi)</code> atau <code>Err(posisi sisip)</code>." } },
    c: { idiomatic: { note: "<code>bsearch</code> dari pustaka standar butuh fungsi pembanding." } },
    cpp: { idiomatic: { note: "<code>lower_bound</code> mencari item pertama yang tidak lebih kecil dari target. (<code>std::binary_search</code> hanya menjawab ya atau tidak.)" } }
  },
  trace: {
    intro: "Contoh: <b>Cari posisi sebuah bilangan dalam daftar terurut</b>, atau -1 jika tidak ada.",
    presets: [{ label: "Cari 7" }, { label: "Cari 1 (pertama)" }, { label: "Cari 4 (tidak ada)" }],
    run({ numbers: list, target }) {
      const ev = [];
      let low = 0, high = list.length - 1, mid = -1;
      const view = (found = -1) => ({
        values: list, ptr: mid,
        states: list.map((_, i) => (i === found ? "hit" : i < low || i > high ? "skipped" : i === mid ? "current" : "")),
        badges: list.map((_, i) => [i === low && low <= high ? "low" : "", i === mid ? "mid" : "", i === high && low <= high ? "high" : ""].filter(Boolean).join(" "))
      });
      const snap = (step, msg, found = -1, tone = "") => ev.push({ step, msg, tone, view: view(found),
        vars: [{ k: "low", role: "stepper", v: low }, { k: "high", role: "stepper", v: high }, { k: "mid", role: "temp", v: mid >= 0 ? mid : "—" }, { k: "target", role: "fixed", v: target }] });
      snap(null, `Siap. Cari ${target} dalam daftar terurut berisi ${list.length}.`);
      snap(1, `Rentangnya seluruh daftar: low = 0, high = ${high}.`);
      let looks = 0;
      while (low <= high) {
        snap(2, `low (${low}) ≤ high (${high}): masih ada ${high - low + 1} item untuk dicari.`);
        mid = Math.floor((low + high) / 2); looks++;
        snap(3, `Tengah: mid = (${low} + ${high}) // 2 = ${mid}, itemnya ${list[mid]}.`);
        if (list[mid] === target) { snap(4, `${list[mid]} adalah targetnya. Kembalikan ${mid}, setelah ${looks} kali melihat.`, mid, "yes"); return ev; }
        if (list[mid] < target) { low = mid + 1; snap(5, `${list[mid]} < ${target}, jadi target hanya mungkin di kanan: low = ${low}.`); }
        else { high = mid - 1; snap(5, `${list[mid]} > ${target}, jadi target hanya mungkin di kiri: high = ${high}.`); }
        mid = -1;
      }
      snap(6, `low (${low}) > high (${high}): rentangnya habis. ${target} tidak ada dalam daftar. Kembalikan -1.`, -1, "no");
      return ev;
    }
  },
  pitfalls: [
    { title: "< alih-alih <=", text: "Dengan <code>while low &lt; high</code>, rentang berisi tepat satu item tidak pernah diperiksa. Daftar berisi satu item, atau target di paling akhir, kembali sebagai -1.", take: "Lanjutkan selama low ≤ high." },
    { title: "Mencoret separuh yang salah", text: "Jika item di tengah lebih kecil dari target, target ada di <em>kanan</em>. Menukar kedua pembaruan membuang separuh yang memuat target.", take: "Tengah lebih kecil → naikkan low; lebih besar → turunkan high." },
    { title: "Mencari di data yang tidak terurut", text: "Bagi dua hanya bekerja jika itemnya berurutan. Pada data tak terurut, hasilnya diam-diam salah.", take: "Urutkan dulu, atau pakai Cari yang pertama (D6)." },
    { title: "Rasakan kecepatannya", text: "Setiap kali melihat, rentangnya terbagi dua: 1 000 item butuh paling banyak 10 kali melihat, sejuta paling banyak 20. Pencarian linear bisa butuh semuanya." },
    { title: "Pakai versi pustaka", text: "<code>bisect</code>, <code>Arrays.binarySearch</code>, <code>slice::binary_search</code>, <code>bsearch</code> dan <code>lower_bound</code> sudah teruji; ketahui apa yang dikembalikan masing-masing jika item tidak ada." }
  ],
  quiz: [
    { q: "Mencari 9 dalam [1, 3, 5, 7, 9, 11, 13], posisi mana yang dilihat pertama?", explain: "mid = (0 + 6) // 2 = 3, itemnya 7. Karena 7 < 9, separuh kiri dicoret." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk 7 dalam [1, 3, 5, 7, 9]?", explain: "Item tengah 5 lebih kecil dari 7, tetapi kodenya menurunkan high, membuang separuh kanan tempat 7 berada." },
    { q: "Kira-kira berapa kali melihat yang dibutuhkan bagi dua untuk 1 000 item terurut?", explain: "Setiap kali melihat, rentangnya terbagi dua: 1000 → 500 → 250 → … → 1 butuh sekitar 10 kali pembagian." }
  ],
  exercise: {
    title: "Giliran Anda: di mana tempatnya?",
    task: "Tulis <code>insert_position(numbers, target)</code> untuk daftar terurut: kembalikan posisi tempat <code>target</code> harus disisipkan agar daftar tetap terurut (sebelum item yang sama).",
    plan: ["Rentang: low = 0, high = panjang (satu setelah akhir)", "Selama low < high", "Lihat item di tengah", "Lebih kecil dari target? low = mid + 1; jika tidak, high = mid", "Kembalikan low"]
  },
  compare: {
    intro: "Dua pencarian 7 dalam <code>[1, 3, 5, 7, 9, 11]</code>. Item yang pudar tidak pernah dilihat; warna kuning menandai tempat masing-masing berhenti.",
    rows: [
      { name: "Bagi dua", question: "Lihat yang di tengah, coret separuhnya", result: "2 kali melihat" },
      { name: "Cari yang pertama", question: "Lihat setiap item dari kiri", result: "4 kali melihat" }
    ],
    table: {
      head: ["Skema", "Butuh data terurut?", "Kali melihat untuk n item", "Untuk 1 000 000 item"],
      rows: [
        ["Bagi dua", "ya", "sekitar log₂ n", "sekitar 20"],
        ["Cari yang pertama", "tidak", "sampai n", "sampai 1 000 000"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "pertanyaan yang sama, dijawab dengan membagi dua" }, { why: "dua posisi yang saling mendekat" }],
    leadsTo: [{ why: "urutkan datanya dulu" }]
  }
};
