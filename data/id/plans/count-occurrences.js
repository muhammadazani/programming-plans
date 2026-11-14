/* Bahasa Indonesia overlay for data/plans/count-occurrences.js (D15). Text only. */
window.PLAN_ID = {
  title: "Hitung kemunculan",
  highlight: "kemunculan",
  aka: ["hitung frekuensi", "hitung kata", "dictionary hitungan"],
  hero: { tag: "5 muncul 3×", alt: "Lima bilangan; ketiga angka 5 berwarna kuning karena 5 adalah nilai yang paling sering muncul" },
  planCard: { name: "frekuensi", lines: ["counts = dictionary kosong", "setiap item: counts[item] + 1", "lalu pilih hitungan terbesar"], foot: "→ kembalikan nilai itu" },
  intent: "Hitung seberapa sering setiap nilai berbeda muncul, dengan dictionary dari nilai ke hitungannya; di sini, lalu pilih nilai dengan hitungan tertinggi.",
  analogy: { title: "Memilah surat ke kotak-kotak", text: "Setiap surat masuk ke kotak bertuliskan nama penerimanya; jika kotaknya belum ada, Anda membuatnya. Di akhir, kotak yang paling penuh menunjukkan siapa yang menerima surat terbanyak. Anda tidak butuh daftar nama sebelumnya." },
  cues: ["seberapa sering setiap …", "paling umum / paling sering", "frekuensi", "hitung setiap … yang berbeda", "duplikat"],
  cueSummary: "Anda butuh hitungan untuk <b>setiap nilai yang berbeda</b>, dan nilainya tidak diketahui sebelumnya.",
  cueExamples: ["Angka mana yang paling sering muncul dalam daftar lemparan dadu?", "Berapa kali setiap kata muncul dalam sebuah teks?", "Produk mana yang paling sering dipesan?"],
  steps: [
    { title: "Mulai dengan dictionary hitungan yang kosong", text: "Belum ada nilai yang ditemui." },
    { title: "Kunjungi setiap item", text: "Setiap item dihitung." },
    { title: "Tambah satu ke hitungannya", text: "Nilai yang baru pertama kali ditemui mulai dari 0, jadi hitungannya menjadi 1." },
    { title: "Cari nilai dengan hitungan tertinggi", text: "Pencarian terbaik sejauh ini (D4) atas dictionary. Jika seri, nilai yang lebih kecil menang di sini." },
    { title: "Kembalikan nilai itu", text: "Daftarnya tidak boleh kosong." }
  ],
  impl: {
    python: { plain: { note: "<code>sorted(counts)</code> mengunjungi nilai dari terkecil ke terbesar, jadi jika seri, nilai terkecil yang disimpan." }, idiomatic: { note: "<code>Counter</code> adalah dictionary penghitung. (<code>most_common()</code> miliknya memutus seri menurut kemunculan pertama, bukan menurut besarnya.)" } },
    java: { plain: { note: "<code>merge(x, 1, Integer::sum)</code> menaruh 1 untuk kunci baru, atau menambah 1 ke hitungan lama. <code>TreeMap</code> menjaga kuncinya terurut." }, idiomaticNote: "Dengan stream: <code>Collectors.groupingBy(x -> x, Collectors.counting())</code> membangun hitungannya; memilih maksimumnya tetap langkah terpisah." },
    rust: { plain: { note: "<code>entry(x).or_insert(0)</code> memberi hitungan untuk x, mulai dari 0 untuk nilai baru. <code>BTreeMap</code> beriterasi dalam urutan terurut." }, idiomaticNote: "API <code>entry</code> adalah cara Rust yang idiomatis untuk menghitung; <code>HashMap</code> bekerja sama jika urutan tidak penting." },
    c: { plain: { note: "C tidak punya dictionary bawaan. Jika nilainya bilangan bulat kecil, array yang diindeks oleh nilai menjadi tabel hitungannya." }, idiomaticNote: "Untuk nilai apa pun, program C mengurutkan salinannya lebih dulu (nilai yang sama berakhir bersebelahan) lalu menghitung rangkaiannya, atau menulis hash table." },
    cpp: { plain: { note: "<code>counts[x]</code> membuat 0 untuk kunci baru, jadi <code>++</code> langsung bisa dipakai." }, idiomaticNote: "<code>std::map</code> atau <code>std::unordered_map</code> berisi hitungan adalah C++ yang idiomatis." }
  },
  trace: {
    intro: "Contoh: <b>Bilangan mana yang paling sering muncul?</b> Jika seri, bilangan yang lebih kecil menang.",
    input: { placeholder: "bilangan: 3, 5, 5, 1" },
    presets: [{ label: "Pemenang jelas" }, { label: "Seri" }, { label: "Satu bilangan" }],
    run(raw) {
      const list = raw.length ? raw : [0];
      const ev = [], states = list.map(() => ""), counts = new Map();
      const outItems = () => [...counts.keys()].sort((a, b) => a - b).map((v) => `${v}×${counts.get(v)}`);
      let best = "?";
      const snap = (step, msg, cur = -1, tone = "", freshVal = null) => {
        const keys = [...counts.keys()].sort((a, b) => a - b);
        ev.push({ step, msg, tone, view: { values: list, states: states.slice(), ptr: cur, out: { label: "counts", items: outItems(), fresh: freshVal === null ? -1 : keys.indexOf(freshVal), empty: "{ } kosong" } },
          vars: [{ k: "x", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "nilai berbeda", role: "count", v: counts.size }, { k: "best", role: "best", v: best }] });
      };
      snap(null, raw.length ? "Siap. Hitung setiap bilangan yang berbeda." : "Daftar tidak boleh kosong, jadi penelusuran ini memakai [0].");
      snap(1, "Mulai dengan dictionary hitungan yang kosong.");
      list.forEach((x, i) => {
        states[i] = "current"; snap(2, `Kunjungi item [${i}]: ${x}.`, i);
        const before = counts.get(x) || 0; counts.set(x, before + 1); states[i] = "added";
        snap(3, before ? `${x} sudah pernah ditemui: hitungannya naik dari ${before} ke ${before + 1}.` : `${x} baru pertama kali ditemui: hitungannya mulai dari 1.`, i, "", x);
      });
      let bestCount = 0;
      [...counts.keys()].sort((a, b) => a - b).forEach((v) => { if (counts.get(v) > bestCount) { bestCount = counts.get(v); best = v; } });
      snap(4, `Hitungan tertinggi adalah ${bestCount}, milik ${best}${[...counts.values()].filter((c) => c === bestCount).length > 1 ? " (yang terkecil dari nilai-nilai yang seri)" : ""}.`, -1, "", best);
      snap(5, `Kembalikan ${best}.`, -1, "yes", best);
      return ev;
    }
  },
  pitfalls: [
    { title: "Mengisi hitungan alih-alih menambahnya", text: "<code>counts[x] = 1</code> mencatat bahwa x muncul, tetapi melupakan berapa kali. Setiap nilai berakhir dengan hitungan 1.", take: "Tambah satu ke hitungan lama, mulai dari 0 untuk nilai baru." },
    { title: "Membaca hitungan yang belum ada", text: "Di Python, <code>counts[x] += 1</code> memunculkan <code>KeyError</code> untuk x yang baru. (<code>map</code> di C++ dan <code>entry</code> di Rust membuatkan 0 untuk Anda.)", take: "Pakai get(x, 0), Counter, merge, atau entry().or_insert(0)." },
    { title: "Menyerahkan seri pada kebetulan", text: "Dengan hash map, “nilai pertama dengan hitungan tertinggi” tergantung urutan internal map, yang bisa berubah antar-jalannya program.", take: "Tentukan aturan serinya dan tulis dalam kode: di sini, nilai terkecil." },
    { title: "Pisahkan menghitung dari memilih", text: "Bangun semua hitungan dulu, baru cari di dalamnya. Mencoba melacak pemenang sambil menghitung mudah salah." },
    { title: "Pakai ulang hitungannya", text: "Dictionary yang sama menjawab pertanyaan lain: berapa nilai berbeda (ukurannya), nilai mana yang muncul sekali, dan seterusnya." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn}([6, 1, 6, 1, 1])?", explain: "1 muncul tiga kali dan 6 dua kali, jadi 1 adalah nilai yang paling sering." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [3, 5, 5]?", explain: "Setiap hitungan diisi 1, jadi semua nilai seri, dan yang terkecil, 3, menang." },
    { q: "Setelah menghitung [4, 4, 4], apa isi dictionary-nya?", explain: "Satu kunci per nilai berbeda: 4, dengan hitungan 3." }
  ],
  exercise: {
    title: "Giliran Anda: berapa nilai yang berbeda?",
    task: "Tulis <code>count_distinct(numbers)</code> yang mengembalikan berapa banyak nilai berbeda dalam daftar. (Di C Anda boleh menganggap setiap nilai antara 0 dan 99.)",
    plan: ["Mulai dengan set (atau dictionary) kosong", "Kunjungi setiap bilangan", "Catat bahwa ia sudah ditemui", "Kembalikan berapa nilai berbeda yang tercatat"]
  },
  compare: {
    intro: "Skema menghitung, dari satu penghitung sampai penghitung untuk setiap nilai.",
    rows: [
      { name: "Hitung kemunculan", question: "Bilangan mana yang paling sering muncul?", shape: "dictionary dari setiap nilai yang ditemui ke hitungannya", result: "satu hitungan per nilai" },
      { name: "Hitung per kategori", question: "Berapa banyak A, B, C, D?", shape: "daftar penghitung yang tetap", result: "satu hitungan per kategori yang diketahui" },
      { name: "Simpan yang sudah dilihat", question: "Hapus duplikatnya", shape: "set berisi nilai yang sudah ditemui", result: "sudah ditemui atau belum, tanpa hitungan" }
    ],
    table: {
      head: ["Skema", "Diingat per nilai", "Kategori diketahui sebelumnya?", "Penyimpanan"],
      rows: [
        ["Hitung kemunculan", "berapa kali", "tidak", "dictionary / map"],
        ["Hitung per kategori", "berapa kali", "ya", "list / array"],
        ["Simpan yang sudah dilihat", "hanya apakah sudah", "tidak", "set"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "satu penghitung per nilai, dibuat saat nilainya muncul" }, { why: "dictionary sebagai tabel rujukan" }],
    leadsTo: [{ why: "hanya ingat apakah sebuah nilai sudah ditemui" }]
  }
};
