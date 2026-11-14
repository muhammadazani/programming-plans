/* Bahasa Indonesia overlay for data/plans/compare-with-previous.js (D12). Text only. */
window.PLAN_ID = {
  title: "Bandingkan dengan sebelumnya",
  highlight: "sebelumnya",
  aka: ["tetangga", "berpasangan", "variabel pengikut"],
  hero: { tag: "2 kenaikan", alt: "Lima kubus harga harian; 12 dan 15 berwarna kuning karena masing-masing lebih tinggi dari hari sebelumnya" },
  planCard: { name: "tetangga", lines: ["count = 0", "mulai dari item kedua", "bandingkan dengan sebelumnya"], foot: "→ kembalikan hitungannya" },
  intent: "Lihat setiap item bersama item tepat sebelumnya, untuk menemukan kenaikan, penurunan, pengulangan atau perubahan.",
  analogy: { title: "Membaca catatan suhu", text: "Untuk tahu apakah hari ini lebih hangat, Anda tidak melihat hari ini saja: Anda membandingkannya dengan kemarin. Menyusuri catatan ke bawah, setiap baris dinilai terhadap baris tepat di atasnya. Baris pertama tidak punya pembanding." },
  cues: ["naik / turun", "dibandingkan dengan hari sebelumnya", "perubahan", "berturut-turut", "kenaikan / penurunan", "berulang"],
  cueSummary: "Pertanyaannya tentang <b>pasangan tetangga</b>: setiap item dan item tepat sebelumnya.",
  cueExamples: ["Berapa hari harganya naik?", "Cari lonjakan terbesar antara dua data yang bersebelahan.", "Apakah daftarnya terurut dari terkecil ke terbesar?"],
  steps: [
    { title: "Mulai penghitung dari 0", text: "Belum ada yang dibandingkan." },
    { title: "Kunjungi setiap item mulai dari yang kedua", text: "Item pertama tidak punya item sebelumnya, jadi tidak bisa dibandingkan." },
    { title: "Bandingkan dengan item tepat sebelumnya", text: "prices[i] terhadap prices[i - 1]." },
    { title: "Naik? Hitung", text: "Hanya kenaikan yang dihitung; sama atau lebih rendah tidak." },
    { title: "Kembalikan hitungannya", text: "Daftar berisi n item punya n − 1 pasangan tetangga." }
  ],
  impl: {
    python: { idiomatic: { note: "<code>pairwise</code> (Python 3.10+) memberikan setiap pasangan tetangga (a, b)." } },
    rust: { idiomatic: { note: "<code>windows(2)</code> menggeser jendela dua item sepanjang slice: tepat pasangan-pasangan tetangga." } },
    c: { idiomaticNote: "Perulangan indeks yang dimulai dari 1 adalah cara C yang idiomatis." },
    cpp: { idiomaticNote: "C++23 menambahkan <code>std::views::adjacent</code>; sebelum itu, perulangan indeks yang paling jelas." }
  },
  trace: {
    intro: "Contoh: <b>Berapa hari harganya naik dibandingkan hari sebelumnya?</b>",
    input: { placeholder: "harga: 10, 12, 11, 15" },
    presets: [{ label: "Naik turun" }, { label: "Selalu naik" }, { label: "Satu hari" }],
    run(list) {
      const ev = [], states = list.map(() => ""), badges = list.map(() => "");
      let count = 0;
      const snap = (step, msg, ptr = -1, tone = "") => ev.push({ step, msg, tone,
        view: { values: list, states: states.slice(), ptr, badges: badges.slice() },
        vars: [{ k: "prices[i-1]", role: "walker", v: Array.isArray(ptr) ? list[ptr[0]] : "—" }, { k: "prices[i]", role: "walker", v: Array.isArray(ptr) ? list[ptr[1]] : "—" }, { k: "count", role: "count", v: count }] });
      snap(null, list.length ? `Siap. Ada ${list.length} hari, jadi ${Math.max(0, list.length - 1)} pasangan tetangga.` : "Siap. Tidak ada hari.");
      snap(1, "Mulai penghitung: count = 0.");
      if (list.length) states[0] = "miss";
      for (let i = 1; i < list.length; i++) {
        states[i] = "current";
        snap(2, `Kunjungi hari [${i}], dan lihat kembali hari [${i - 1}].`, [i - 1, i]);
        const up = list[i] > list[i - 1];
        states[i] = up ? "hit" : "miss";
        snap(3, `Apakah ${list[i]} > ${list[i - 1]}? ${up ? "Ya, harganya naik." : list[i] === list[i - 1] ? "Tidak, harganya tetap." : "Tidak, harganya turun."}`, [i - 1, i]);
        if (up) { count++; badges[i] = "↑"; snap(4, `Hitung kenaikannya: count = ${count}.`, [i - 1, i]); }
      }
      snap(5, `Kembalikan ${count}.`, -1, "yes");
      return ev;
    }
  },
  pitfalls: [
    { title: "Berhenti satu pasangan terlalu dini", text: "Mulai dari 1 <em>dan</em> berhenti sebelum indeks terakhir melewatkan pasangan terakhir: [1, 2, 3] punya dua kenaikan, tetapi hanya satu yang terhitung.", take: "Dari indeks 1 sampai dan termasuk indeks terakhir." },
    { title: "Membandingkan dengan item pertama", text: "<code>prices[i] &gt; prices[0]</code> bertanya “lebih tinggi dari hari pertama?”, bukan “lebih tinggi dari kemarin?”.", take: "Tetangga dari i adalah i − 1." },
    { title: "Mulai dari indeks 0", text: "Saat i = 0 tidak ada item sebelumnya. Di Python, <code>prices[-1]</code> diam-diam berarti item <em>terakhir</em>; di bahasa lain, ia membaca di luar array.", take: "Mulai dari 1." },
    { title: "Atau simpan variabel pengikut", text: "Alih-alih indeks, simpan <code>previous</code>: bandingkan item sekarang dengannya, lalu atur <code>previous = current</code>. Cara ini juga bekerja untuk aliran masukan." },
    { title: "Uji daftar dengan panjang 0, 1 dan 2", text: "Masing-masing punya 0, 0 dan 1 pasangan: tepi tempat galat selisih satu bersembunyi." }
  ],
  quiz: [
    { q: "Apa yang dikembalikan {fn}([4, 4, 6, 5, 9])?", explain: "4→4 bukan kenaikan, 4→6 kenaikan, 6→5 bukan, 5→9 kenaikan. Dua kenaikan." },
    { q: "Versi ini punya bug. Apa yang dikembalikan untuk [5, 3, 4]?", explain: "Ia membandingkan setiap hari dengan hari pertama (5). 3 dan 4 sama-sama lebih rendah dari 5, jadi tidak ada yang terhitung, padahal 3 → 4 adalah kenaikan." },
    { q: "Berapa pasangan tetangga dalam daftar berisi 6 item?", explain: "Setiap pasangan dimulai di satu item dan berakhir di item berikutnya, dan item terakhir tidak memulai pasangan: 6 − 1 = 5." }
  ],
  exercise: {
    title: "Giliran Anda: lonjakan terbesar",
    task: "Tulis <code>largest_jump(numbers)</code> yang mengembalikan kenaikan terbesar dari satu item ke item berikutnya. Jika tidak ada kenaikan sama sekali (atau kurang dari dua item), kembalikan 0.",
    plan: ["Mulai lonjakan terbaik dari 0", "Kunjungi setiap item mulai dari yang kedua", "Hitung lonjakannya: item ini dikurangi item sebelumnya", "Lebih besar dari lonjakan terbaik? Simpan", "Kembalikan lonjakan terbaik"]
  },
  compare: {
    intro: "Skema yang melihat item dalam konteksnya, pada <code>[10, 12, 11, 15, 15]</code>.",
    rows: [
      { name: "Bandingkan dengan sebelumnya", question: "Berapa kenaikan?" },
      { name: "Rangkaian terpanjang", question: "Rangkaian kenaikan berturut-turut terpanjang?" },
      { name: "Menghitung", question: "Berapa harga di atas 11?" }
    ],
    table: {
      head: ["Skema", "Melihat", "Mulai dari indeks", "Pertanyaan khas"],
      rows: [
        ["Bandingkan dengan sebelumnya", "setiap item dan item sebelumnya", "1", "apakah naik?"],
        ["Rangkaian terpanjang", "apakah rangkaian sekarang berlanjut", "0", "berapa yang berturut-turut?"],
        ["Menghitung", "setiap item sendiri-sendiri", "0", "berapa yang lolos?"]
      ]
    }
  },
  related: {
    buildsOn: [{ why: "menghitung pasangan yang lolos" }],
    leadsTo: [{ why: "lacak rangkaian item yang bersebelahan" }, { why: "bandingkan setiap pasangan, bukan hanya tetangga" }]
  }
};
