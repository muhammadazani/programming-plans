/* Bahasa Indonesia overlay for data/plans/two-pointers.js (F1). Text only. */
(function () {
  const show = (ch) => (ch === " " ? "␣" : ch);

  window.PLAN_ID = {
    title: "Dua penunjuk",
    highlight: "penunjuk",
    aka: ["indeks kiri dan kanan", "bertemu di tengah", "dari kedua ujung"],
    hero: { tag: "kiri ↔ kanan", alt: "Huruf-huruf racecar; kedua ujungnya berwarna kuning, dibandingkan dari luar ke dalam" },
    planCard: { name: "dua penunjuk", lines: ["left = awal, right = akhir", "selama left < right: bandingkan", "geser keduanya ke dalam"], foot: "→ bertemu di tengah" },
    intent: "Telusuri sebuah urutan dari kedua ujung sekaligus: satu posisi dimulai dari kiri, satu dari kanan, dan keduanya bergerak saling mendekat sampai bertemu.",
    analogy: { title: "Memeriksa untaian bendera", text: "Untuk memeriksa apakah untaian bendera simetris, dua orang mulai dari ujung yang berlawanan, membandingkan bendera di tangan masing-masing, lalu masing-masing bergeser satu bendera ke tengah. Begitu ada dua bendera yang berbeda, untaian itu tidak simetris; jika mereka bertemu di tengah, untaian itu simetris." },
    cues: ["palindrom", "terbaca sama dari belakang", "balik di tempat", "dari kedua ujung", "pasangan dari luar ke dalam"],
    cueSummary: "Soalnya memasangkan <b>item pertama dengan yang terakhir</b>, item kedua dengan yang kedua dari akhir, dan seterusnya.",
    cueExamples: ["Apakah “katak” sebuah palindrom?", "Balik sebuah daftar tanpa membuat salinan.", "Dalam daftar terurut, cari dua bilangan yang jumlahnya sama dengan target."],
    steps: [
      { title: "Mulai satu penunjuk di setiap ujung", text: "left = 0, right = posisi terakhir." },
      { title: "Selama penunjuknya belum bertemu", text: "left < right. Di tengah teks yang panjangnya ganjil, satu karakter tersisa, dan ia tidak mungkin berbeda dengan apa pun." },
      { title: "Bandingkan item di kedua penunjuk", text: "Di sini: karakter di left dan karakter di right." },
      { title: "Berbeda? Jawab tidak dan berhenti", text: "Satu pasangan yang tidak cocok sudah cukup." },
      { title: "Sama? Geser kedua penunjuk ke dalam", text: "left bergeser satu ke kanan, right satu ke kiri." },
      { title: "Penunjuknya bertemu: jawab ya", text: "Setiap pasangan cocok." }
    ],
    impl: {
      python: { idiomatic: { note: "<code>text[::-1]</code> adalah teks yang dibalik. Sederhana, tetapi membangun salinan utuh dan membandingkan semuanya." } },
      rust: { plain: { note: "Indeks Rust bertipe <code>usize</code>, yang tidak bisa di bawah 0, jadi <code>right</code> menunjuk satu setelah byte terakhir dan kodenya membandingkan <code>b[right - 1]</code>. Versi ini menganggap teksnya ASCII biasa." }, idiomatic: { note: "Membandingkan karakter maju dan mundur, dan bekerja untuk teks Unicode apa pun." } },
      c: { plain: { note: "<code>int</code> alih-alih <code>size_t</code>, agar <code>right</code> bisa bernilai -1 untuk teks kosong tanpa melingkar." }, idiomaticNote: "Perulangan dua indeks adalah C yang idiomatis." },
      cpp: { idiomatic: { note: "<code>rbegin()</code> berjalan mundur dari akhir; membandingkan setengah teks sudah cukup." } }
    },
    trace: {
      intro: "Contoh: <b>Apakah teksnya palindrom</b> (terbaca sama dari belakang)?",
      presets: [{ label: "\"racecar\"" }, { label: "\"abba\"" }, { label: "\"abca\"" }],
      run({ text }) {
        const ch = [...text], ev = [], states = ch.map(() => "");
        let left = 0, right = ch.length - 1;
        const snap = (step, msg, tone = "") => ev.push({ step, msg, tone,
          view: { values: ch.map(show), states: states.slice(), ptr: left < right ? [left, right] : [], badges: ch.map((_, i) => (i === left && left < right ? "left" : i === right && left < right ? "right" : "")), emptyNote: "\"\"  (teks kosong)" },
          vars: [{ k: "left", role: "stepper", v: left }, { k: "right", role: "stepper", v: right }] });
        snap(null, `Siap. Apakah "${text}" palindrom?`);
        snap(1, `Mulai: left = 0, right = ${right}.`);
        while (left < right) {
          snap(2, `left (${left}) < right (${right}): penunjuknya belum bertemu.`);
          if (ch[left] !== ch[right]) {
            states[left] = states[right] = "hit";
            snap(3, `'${ch[left]}' dan '${ch[right]}' berbeda.`);
            snap(4, "Jawab False dan berhenti.", "no");
            return ev;
          }
          states[left] = states[right] = "added";
          snap(3, `'${ch[left]}' dan '${ch[right]}' cocok.`);
          left++; right--;
          snap(5, `Geser keduanya ke dalam: left = ${left}, right = ${right}.`);
        }
        snap(2, ch.length > 1 ? `left (${left}) tidak lagi < right (${right}): penunjuknya sudah bertemu.` : "Tidak ada pasangan untuk dibandingkan.");
        snap(6, "Setiap pasangan cocok. Jawab True.", "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Menjawab ya setelah satu pasangan cocok", text: "Mengembalikan true begitu pasangan terluar cocok mengabaikan semua yang di dalam: “abca” diawali dan diakhiri a, tetapi bukan palindrom.", take: "Jawab ya hanya setelah penunjuknya bertemu." },
      { title: "Hanya menggeser satu penunjuk", text: "Jika hanya <code>left</code> yang bergeser, karakter kedua dibandingkan lagi dengan yang terakhir, sehingga “abba” tampak salah.", take: "Kedua penunjuk bergeser ke dalam bersama-sama." },
      { title: "Memulai right dari panjangnya", text: "Posisi terakhir adalah panjang − 1. <code>right = len(text)</code> membaca satu setelah akhir.", take: "right = panjang − 1 (atau biarkan satu setelahnya dan bandingkan right − 1, seperti versi Rust)." },
      { title: "Pakai bentuk yang sama untuk membalik", text: "Menukar item di left dan right, lalu bergeser ke dalam, membalik daftar di tempat (lihat latihannya)." },
      { title: "Pakai pada data terurut", text: "Dalam daftar terurut, dua penunjuk menemukan pasangan dengan jumlah tertentu dalam satu telusur: geser left ke atas jika jumlahnya terlalu kecil, right ke bawah jika terlalu besar." }
    ],
    quiz: [
      { q: "Berapa pasangan yang dibandingkan {fn}(\"racecar\") sebelum menjawab?", explain: "r–r, a–a, c–c. Lalu kedua penunjuk sampai di 'e' di tengah dan berhenti. Tiga perbandingan untuk tujuh huruf." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk \"abba\"?", explain: "Hanya left yang bergeser, jadi perbandingan kedua adalah 'b' dengan 'a' terakhir. Keduanya berbeda, dan ia keliru menjawab tidak." },
      { q: "Mengapa perulangan menguji left < right, bukan left <= right?", options: ["Saat bertemu di satu karakter, tidak ada yang bisa dibandingkan dengannya", "Untuk menghindari perulangan tanpa akhir", "Karena string dimulai dari 1"], explain: "Satu karakter di tengah selalu cocok dengan dirinya sendiri, jadi perulangan bisa berhenti saat penunjuknya bertemu." }
    ],
    exercise: {
      title: "Giliran Anda: balik sebuah daftar",
      task: "Tulis <code>reversed_list(numbers)</code> yang mengembalikan salinan daftar yang dibalik, dengan menukar item dari kedua ujung salinan menuju tengah.",
      plan: ["Salin daftarnya; left = 0, right = posisi terakhir", "Selama left < right", "Tukar item di left dan right", "Geser kedua penunjuk ke dalam", "Kembalikan salinannya"]
    },
    compare: {
      intro: "Skema yang menggerakkan posisi melalui sebuah urutan dengan cara berbeda.",
      rows: [
        { name: "Dua penunjuk", question: "Apakah palindrom?", shape: "left dari awal, right dari akhir, bertemu di tengah", result: "sekitar n/2 langkah" },
        { name: "Bagi dua", question: "Di mana 7 dalam daftar terurut?", shape: "low dan high menyempit ke tengah setiap langkah", result: "sekitar log₂ n langkah" },
        { name: "Cari yang pertama", question: "Di mana bilangan negatif pertama?", shape: "satu posisi dari kiri ke kanan", result: "sampai n langkah" }
      ],
      table: {
        head: ["Skema", "Posisi", "Bergeser dengan", "Butuh data terurut?"],
        rows: [
          ["Dua penunjuk", "2, dari kedua ujung", "masing-masing satu langkah ke dalam", "hanya untuk soal jumlah pasangan"],
          ["Bagi dua", "low, high, mid", "membagi dua rentangnya", "ya"],
          ["Cari yang pertama", "1", "satu langkah ke kanan", "tidak"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "menukar kedua ujung saat membalik" }, { why: "berhenti dengan jawaban tidak pada ketidakcocokan pertama" }],
      leadsTo: [{ why: "dua posisi yang menyempit dengan membagi dua" }]
    }
  };
})();
