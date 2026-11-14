/* Bahasa Indonesia overlay for data/plans/input-process-output.js (A1). Text only. */
(function () {
  const f = (x) => (Number.isInteger(x) ? x.toFixed(1) : String(+x.toFixed(6)));

  window.PLAN_ID = {
    title: "Baca–Proses–Hasilkan",
    highlight: "Hasilkan",
    aka: ["masukan–proses–keluaran (IPO)", "skema rumus", "perhitungan lurus"],
    hero: { tag: "km / jam", alt: "Dua kubus masukan kecil, 1500 m dan 6 menit, masuk ke kubus proses biru, yang menghasilkan kubus keluaran kuning, 15.0" },
    planCard: { name: "baca → proses → hasil", lines: ["kenali masukannya", "ubah satuannya", "terapkan rumusnya"], foot: "→ kembalikan hasilnya" },
    intent: "Ubah masukan menjadi hasil dengan rumus yang tetap: kenali apa yang diberikan, ubah ke satuan yang dibutuhkan rumus, hitung, lalu kembalikan jawabannya.",
    analogy: { title: "Memanggang dengan resep luar negeri", text: "Resep dari luar negeri meminta 8 ons tepung dan oven 350 °F. Sebelum memanggang, Anda mengubahnya ke gram dan °C, lalu mengikuti langkahnya, lalu menyajikan kuenya. Ubah satuan dulu, lalu hitung, lalu serahkan hasilnya." },
    cues: ["hitunglah …", "ubah / konversi …", "berapa cepat / berapa banyak …", "diketahui … tentukan …", "per jam / per km", "rumus"],
    cueSummary: "Ada <b>rumus</b>, tanpa pengulangan dan tanpa memilih kasus. Sering kali masukan datang dalam satuan yang salah.",
    cueExamples: ["Diketahui jarak dalam meter dan waktu dalam menit, tentukan kecepatan dalam km/jam.", "Ubah suhu dari Fahrenheit ke Celsius.", "Hitung harga n barang termasuk pajak 11%."],
    steps: [
      { title: "Kenali masukan dan keluarannya", text: "Tentukan apa yang diberikan (meter, menit) dan apa yang harus dikembalikan (km/jam). Kepala fungsi menyatakan persis hal ini." },
      { title: "Ubah ke satuan yang dibutuhkan rumus", text: "Meter ke kilometer, menit ke jam. Beri setiap nilai hasil konversi namanya sendiri." },
      { title: "Terapkan rumusnya", text: "kecepatan = jarak ÷ waktu, memakai nilai yang sudah dikonversi." },
      { title: "Kembalikan hasilnya", text: "Serahkan jawaban kepada pemanggil. Mencetaknya adalah tugas pemanggil." }
    ],
    impl: {
      python: { plain: { note: "Di Python 3, <code>/</code> selalu menghasilkan float, bahkan untuk dua bilangan bulat." }, idiomatic: { note: "Satu ekspresi memang lebih pendek, tetapi versi bernama memperlihatkan setiap konversi satuan. Pakai nama selama belajar." } },
      java: { plain: { note: "<code>1000.0</code>, bukan <code>1000</code>: membagi dua <code>int</code> di Java membuang pecahannya." }, idiomatic: { note: "Rumus yang sama dalam satu ekspresi." } },
      rust: { plain: { note: "Rust tidak pernah mencampur bilangan bulat dan pecahan diam-diam. <code>as f64</code> mengubahnya dengan sengaja, sehingga pembagian bulat tidak bisa menyelinap." }, idiomatic: { note: "Rumus yang sama dalam satu ekspresi. Ekspresi terakhir adalah nilai kembalian." } },
      c: { plain: { note: "<code>1000.0</code>, bukan <code>1000</code>: <code>int / int</code> di C membuang pecahannya." }, idiomatic: { note: "Rumus yang sama dalam satu ekspresi." } },
      cpp: { plain: { note: "Aturannya sama dengan C: jadikan salah satu sisi pembagian <code>double</code>." }, idiomatic: { note: "Rumus yang sama dalam satu ekspresi." } }
    },
    trace: {
      intro: "Contoh: <b>Diketahui jarak dalam meter dan waktu dalam menit, seberapa cepat larinya dalam km/jam?</b>",
      presets: [{ label: "1,5 km dalam 6 menit" }, { label: "5 km dalam 30 menit" }, { label: "Maraton dalam 3 jam" }, { label: "Nol menit" }],
      run({ distance_m: d, minutes: m }) {
        const ev = [];
        const v = { distance_m: undefined, minutes: undefined, km: undefined, hours: undefined, speed: undefined, ret: undefined };
        const push = (step, msg, active, fresh = [], extra = {}) => {
          const st = (name, stepNo, vars) => ({
            label: name, step: stepNo,
            state: extra.error === stepNo ? "error" : active === stepNo ? "active" : (extra.done || []).includes(stepNo) ? "done" : "",
            vars: vars.map((k) => ({ k: k === "ret" ? "return" : k, v: ["km", "hours", "speed"].includes(k) && typeof v[k] === "number" ? f(v[k]) : v[k], fresh: fresh.includes(k) }))
          });
          const stages = [st("Masukan", 1, ["distance_m", "minutes"]), st("Ubah satuan", 2, ["km", "hours"]), st("Hitung", 3, ["speed"]), st("Keluaran", 4, ["ret"])];
          if (extra.result) stages[3].state = "result";
          ev.push({ step, msg, tone: extra.tone || "", view: { stages }, vars: [] });
        };
        push(null, "Siap. Belum ada yang dihitung.", 0);
        v.distance_m = d; v.minutes = m;
        push(1, `Masukan diterima: distance_m = ${d} meter, minutes = ${m}. Keluarannya nanti kecepatan dalam km/jam.`, 1, ["distance_m", "minutes"]);
        v.km = d / 1000;
        push(2, `Ubah meter ke kilometer: ${d} / 1000 = ${f(v.km)}`, 2, ["km"], { done: [1] });
        v.hours = m / 60;
        push(2, `Ubah menit ke jam: ${m} / 60 = ${f(v.hours)}`, 2, ["hours"], { done: [1] });
        if (m === 0) {
          v.speed = "÷ 0!";
          push(3, "Pembagian dengan nol: hours bernilai 0. Python memunculkan ZeroDivisionError; Java, C, C++ dan Rust menghasilkan tak hingga. Penjaga (skema B1) seharusnya menolak masukan ini sebelum rumus dijalankan.", 3, ["speed"], { done: [1, 2], error: 3, tone: "no" });
          return ev;
        }
        v.speed = v.km / v.hours;
        push(3, `Terapkan rumus: speed = km / hours = ${f(v.km)} / ${f(v.hours)} = ${f(v.speed)}`, 3, ["speed"], { done: [1, 2] });
        v.ret = f(v.speed);
        push(4, `Kembalikan ${f(v.speed)} km/jam kepada pemanggil.`, 4, ["ret"], { done: [1, 2, 3], result: true, tone: "yes" });
        return ev;
      }
    },
    pitfalls: [
      { title: "Pembagian bilangan bulat", text: "Di Java, C dan C++, <code>1500 / 1000</code> hasilnya <code>1</code>, bukan <code>1.5</code>: membagi dua bilangan bulat membuang pecahannya. <code>//</code> di Python dan <code>/</code> bilangan bulat di Rust juga begitu.", take: "Jadikan salah satu sisi bilangan pecahan (1000.0), atau ubah dulu sebelum membagi." },
      { title: "Mengonversi ke arah yang salah", text: "<code>minutes * 60</code> menghasilkan detik, bukan jam. Kodenya tetap berjalan, hanya jawabannya salah.", take: "Periksa setiap konversi: 60 menit harus menjadi 1 jam." },
      { title: "Membagi dengan masukan yang bisa nol", text: "Dengan <code>minutes = 0</code>, Python berhenti dengan galat dan bahasa lain mengembalikan tak hingga. Coba contoh <b>Nol menit</b> di penelusuran di atas.", take: "Periksa masukannya dulu. Itulah skema B1, Penjaga." },
      { title: "Beri nama nilai antaranya", text: "<code>km</code> dan <code>hours</code> memperlihatkan setiap satuan, sehingga konversi yang salah mudah terlihat saat membaca kode." },
      { title: "Uji dengan angka yang bisa dihitung di kepala", text: "6 km dalam 60 menit pasti 6 km/jam. Kalau fungsi Anda tidak setuju, bug-nya ada di konversi." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}(3000, 20)?", explain: "3000 m adalah 3 km dan 20 menit adalah 1/3 jam. 3 ÷ (1/3) = 9 km/jam." },
      { q: "Di Java, C atau C++, berapa nilai 1500 / 1000?", explain: "Kedua bilangan adalah bilangan bulat, jadi hasilnya bilangan bulat dan ,5-nya dibuang. / di Python menghasilkan 1.5; // menghasilkan 1." },
      { q: "Versi ini punya bug. Kira-kira apa yang dikembalikan untuk (1500, 6)?", options: ["15.0", "0.004", "900.0"], explain: "minutes * 60 mengubah 6 menit menjadi 360 “jam”, sehingga kecepatannya 1.5 / 360 ≈ 0.004. Mengubah menit ke jam berarti membagi dengan 60." }
    ],
    exercise: {
      title: "Giliran Anda: indeks massa tubuh",
      task: "Tulis <code>bmi(weight_kg, height_cm)</code> yang mengembalikan berat ÷ tinggi², dengan tinggi dalam <b>meter</b>. Ikuti keempat langkah skemanya.",
      plan: ["Masukan: berat dalam kg, tinggi dalam cm. Keluaran: BMI", "Ubah tinggi dari cm ke meter", "Terapkan rumus: berat / (tinggi * tinggi)", "Kembalikan hasilnya"]
    },
    compare: {
      intro: "Tiga skema yang sama-sama menghasilkan satu nilai. Pertanyaannya: perlukah perulangan atau pemeriksaan lebih dulu?",
      rows: [
        { name: "Baca–Proses–Hasilkan", question: "Hitung satu jawaban dari rumus", shape: "masukan → ubah satuan → rumus → kembalikan. Tanpa perulangan, tanpa keputusan.", result: "satu nilai" },
        { name: "Penjaga", question: "Tolak masukan buruk sebelum rumus", shape: "periksa masukannya dulu dan kembali lebih awal jika tidak valid", result: "nilai galat, atau jawabannya" },
        { name: "Akumulasi", question: "Gabungkan banyak item menjadi satu total", shape: "perulangan menambahkan setiap item ke total berjalan", result: "satu total" }
      ],
      table: {
        head: ["Skema", "Perulangan?", "Keputusan?", "Pertanyaan khas"],
        rows: [
          ["Baca–Proses–Hasilkan", "tidak", "tidak", "Seberapa cepat larinya?"],
          ["Penjaga", "tidak", "ya, di awal", "Bagaimana jika waktunya 0?"],
          ["Akumulasi", "ya", "tidak", "Berapa total semua lari?"]
        ]
      }
    },
    related: {
      buildsOnNote: "Ini titik awal. Hanya perlu variabel dan aritmetika.",
      leadsTo: [{ why: "lindungi rumus dari masukan seperti 0" }, { why: "pilih di antara dua rumus" }, { why: "terapkan perhitungan pada banyak item" }]
    }
  };
})();
