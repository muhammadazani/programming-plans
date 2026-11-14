/* Bahasa Indonesia overlay for data/plans/transform-each-item.js (D10). Text only. */
(function () {
  const bonus = (s) => Math.min(s + 5, 100);

  window.PLAN_ID = {
    title: "Ubah setiap elemen",
    highlight: "Ubah",
    aka: ["map", "terapkan ke setiap elemen", "per elemen"],
    hero: { tag: "[55, 100, 100]", alt: "Tiga kubus, semuanya berwarna kuning, dengan label yang memperlihatkan daftar baru 55, 100, 100" },
    planCard: { name: "map", lines: ["result = daftar kosong", "untuk setiap item", "tambahkan nilai barunya"], foot: "→ panjang sama, nilai baru" },
    intent: "Bangun daftar baru dengan setiap item diubah dengan cara yang sama. Daftar baru punya tepat sebanyak item daftar aslinya.",
    analogy: { title: "Mesin fotokopi yang diatur memperbesar", text: "Setiap halaman masuk ke mesin yang sama dan keluar lebih besar. Anda mendapat satu salinan untuk setiap halaman asli, dengan urutan yang sama, dan halaman aslinya tidak tersentuh." },
    cues: ["tambahkan … ke setiap", "ubah setiap …", "untuk setiap item, …", "daftar dari …", "gandakan / bulatkan / skalakan semua"],
    cueSummary: "Jawabannya <b>daftar baru dengan panjang yang sama</b>: setiap item diubah dengan aturan yang sama.",
    cueExamples: ["Tambahkan 5 poin bonus ke setiap nilai, tetapi tidak pernah di atas 100.", "Ubah daftar suhu dari °C ke °F.", "Bulatkan setiap harga ke bilangan bulat terdekat."],
    steps: [
      { title: "Mulai dengan daftar hasil kosong", text: "Daftar aslinya dibiarkan." },
      { title: "Kunjungi setiap item", text: "Setiap item diubah; tidak ada yang dilewati." },
      { title: "Hitung nilai barunya", text: "Di sini: tambah 5, tetapi batasi di 100." },
      { title: "Tambahkan nilai baru ke hasil", text: "Di akhir, agar urutannya terjaga." },
      { title: "Kembalikan hasilnya", text: "Panjangnya sama dengan masukan." }
    ],
    impl: {
      python: { idiomatic: { note: "List comprehension tanpa bagian <code>if</code> adalah skema map." } },
      c: { plain: { note: "Hasilnya selalu berisi n item, jadi pemanggil bisa menyiapkan <code>out</code> dengan ukuran yang tepat." }, idiomaticNote: "C tidak punya map bawaan; perulangan yang menulis ke array keluaran adalah cara idiomatisnya." }
    },
    trace: {
      intro: "Contoh: <b>Beri setiap mahasiswa 5 poin bonus, tetapi tidak pernah lebih dari 100.</b>",
      input: { placeholder: "nilai Anda: 50, 98, 100" },
      presets: [{ label: "Dekat batas" }, { label: "Semua rendah" }, { label: "Daftar kosong" }],
      run(list) {
        const ev = [], states = list.map(() => ""), result = [];
        const snap = (step, msg, cur = -1, tone = "", fresh = -1, nv = "—") => ev.push({ step, msg, tone,
          view: { values: list, states: states.slice(), ptr: cur, out: { label: "result", items: result.slice(), fresh, empty: "[ ] kosong" } },
          vars: [{ k: "s", role: "walker", v: cur >= 0 ? list[cur] : "—" }, { k: "new", role: "temp", v: nv }, { k: "len(result)", role: "gatherer", v: result.length }] });
        snap(null, list.length ? `Siap. Ada ${list.length} nilai untuk diubah.` : "Siap. Daftarnya kosong.");
        snap(1, "Mulai dengan daftar hasil kosong.");
        list.forEach((s, i) => {
          states[i] = "current"; snap(2, `Kunjungi item [${i}]: s = ${s}`, i);
          const v = bonus(s); snap(3, s + 5 > 100 ? `${s} + 5 = ${s + 5}, lebih dari 100, jadi nilai barunya 100.` : `${s} + 5 = ${v}.`, i, "", -1, v);
          result.push(v); states[i] = "added"; snap(4, `Tambahkan ${v} di akhir hasil.`, i, "", result.length - 1, v);
        });
        snap(5, `Kembalikan [${result.join(", ")}]: banyaknya item sama dengan masukan.`, -1, "yes");
        return ev;
      }
    },
    pitfalls: [
      { title: "Melupakan sebagian aturan", text: "“Tambah 5, tetapi tidak pernah di atas 100” punya dua bagian. Melupakan batasnya menghasilkan nilai 103 dan 105.", take: "Tulis aturan untuk satu item dulu, uji pada kasus tepi (95, 96, 100), baru buat perulangannya." },
      { title: "Membuat hasil di dalam perulangan", text: "Hasil baru di setiap putaran membuang item yang sudah diubah, sehingga hanya yang terakhir yang tersisa.", take: "Buat hasilnya sekali, sebelum perulangan." },
      { title: "Mengubah variabel perulangan dan berharap daftarnya berubah", text: "Di Python, for-each Java dan range-for C++, <code>s = s + 5</code> mengubah salinan. Daftarnya tetap sama.", take: "Bangun daftar baru (skema ini), atau tetapkan lewat posisi: <code>scores[i] = …</code>." },
      { title: "Periksa panjangnya", text: "Hasil harus punya tepat sebanyak item masukan. Jika lebih pendek, Anda sedang menyaring (D9), bukan mengubah." },
      { title: "Pakai map setelah paham", text: "List comprehension, <code>stream().map()</code>, <code>.iter().map().collect()</code> dan <code>std::ranges::transform</code> adalah skema ini." }
    ],
    quiz: [
      { q: "Apa yang dikembalikan {fn}([95, 96, 40])?", explain: "95 + 5 = 100, 96 + 5 = 101 dibatasi menjadi 100, dan 40 + 5 = 45. Tiga item masuk, tiga keluar." },
      { q: "Versi ini punya bug. Apa yang dikembalikan untuk [50, 60]?", explain: "Hasilnya dikosongkan di setiap putaran, jadi hanya item terakhir yang diubah yang bertahan." },
      { q: "Daftar berisi 8 item diubah. Berapa panjang hasilnya?", options: ["Sampai 8", "Tepat 8", "Tergantung nilainya"], explain: "Mengubah mengganti setiap item dan menyimpan semuanya: tepat 8. Menyaring yang bisa membuat daftar lebih pendek." }
    ],
    exercise: {
      title: "Giliran Anda: gandakan semuanya",
      task: "Tulis <code>doubled(numbers)</code> yang mengembalikan daftar baru dengan setiap bilangan dikali 2.",
      plan: ["Mulai dengan hasil kosong", "Kunjungi setiap bilangan", "Hitung nilai barunya: × 2", "Tambahkan di akhir hasil", "Kembalikan hasilnya"]
    },
    compare: {
      intro: "Tiga skema pada <code>[72, 45, 90]</code> yang mengembalikan hal berbeda.",
      rows: [
        { name: "Ubah setiap elemen", question: "Tambah 5 ke setiap nilai" },
        { name: "Saring", question: "Simpan nilai 50 atau lebih" },
        { name: "Akumulasi", question: "Jumlahkan semua nilai" }
      ],
      table: {
        head: ["Skema", "Hasil", "Panjang", "Item berubah?"],
        rows: [
          ["Ubah setiap elemen", "daftar baru", "sama dengan masukan", "ya, semuanya"],
          ["Saring", "daftar baru", "0 sampai sepanjang masukan", "tidak"],
          ["Akumulasi", "satu nilai", "—", "digabungkan"]
        ]
      }
    },
    related: {
      buildsOn: [{ why: "perulangan membangun daftar baru yang sama, tanpa uji" }, { why: "aturan untuk satu item adalah rumus kecil" }],
      leadsTo: [{ why: "ubah setiap sel sebuah tabel" }]
    }
  };
})();
