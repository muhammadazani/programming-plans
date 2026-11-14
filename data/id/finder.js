/* Pencari skema (Bahasa Indonesia): the same decision tree as data/finder.js,
   with the questions, answers and reasons translated. tools/check_i18n.js checks
   that every node, option and result matches the English tree. */
window.FINDER_ID = {
  start: "root",
  nodes: {
    root: {
      q: "Soal ini meminta Anda melakukan apa?",
      options: [
        { label: "Menghitung nilai dengan rumus", hint: "kecepatan dari jarak dan waktu, harga setelah pajak…", next: "formula" },
        { label: "Memilih di antara beberapa hasil", hint: "lulus atau tidak, nilai huruf, harga yang mana…", next: "choice" },
        { label: "Mengulang sesuatu", hint: "n kali, sampai pengguna mengetik -1, sampai valid…", next: "repeat" },
        { label: "Menelusuri daftar item", hint: "nilai, harga, data sensor, angka…", next: "list" },
        { label: "Mengolah teks", hint: "email, nama berkas, kalimat…", next: "text" },
        { label: "Mencetak pola 2D, atau membandingkan pasangan", hint: "segitiga bintang, tabel, setiap pasangan…", next: "twoD" },
        { label: "Saya tidak yakin", hint: "mulai dari bentuk jawaban yang diminta", next: "shape" }
      ]
    },

    shape: {
      q: "Jawabannya berbentuk apa?",
      options: [
        { label: "Ya atau tidak", hint: "benar / salah", next: "yesno" },
        { label: "Sebuah hitungan", hint: "berapa banyak …", next: "howmany" },
        { label: "Satu angka", hint: "total, rata-rata, kecepatan…", next: "oneNumber" },
        { label: "Sebuah posisi", hint: "di mana sesuatu berada", next: "where" },
        { label: "Daftar baru", hint: "sebagian atau semua item, mungkin diubah", next: "newList" },
        { label: "Teks baru atau lebih pendek", hint: "string yang dirapikan atau diubah", next: "text" },
        { label: "Baris-baris yang dicetak", hint: "sebuah pola atau tabel", result: "E1", why: "Keluaran dua dimensi berarti perulangan luar untuk baris dan perulangan dalam untuk kolom." }
      ]
    },

    oneNumber: {
      q: "Angka itu berasal dari mana?",
      options: [
        { label: "Dari beberapa nilai masukan", hint: "tidak ada daftar", next: "formula" },
        { label: "Dari semua item sebuah daftar", hint: "total, rata-rata, terbesar…", next: "summary" }
      ]
    },

    formula: {
      q: "Mungkinkah ada masukan yang membuat rumusnya gagal atau tidak bermakna?",
      options: [
        { label: "Ya", hint: "nol, bilangan negatif, daftar kosong…", result: "B1", why: "Tangani dulu masukan itu dengan penjaga, lalu lakukan perhitungan (A1) untuk masukan yang tersisa." },
        { label: "Tidak: langsung hitung", hint: "ubah satuan bila perlu, lalu terapkan rumusnya", result: "A1", why: "Kenali masukannya, ubah satuannya, terapkan rumus, kembalikan hasilnya." },
        { label: "Memecah jumlah menjadi satuan", hint: "detik menjadi jam, menit dan detik", result: "A3", alt: "A1", why: "Pembagian bilangan bulat memberi satuan besar, sisa bagi memberi sisanya." },
        { label: "Menukar dua nilai", hint: "tukar a dan b", result: "A2", alt: "A1", why: "Pakai variabel sementara agar tidak ada nilai yang hilang." },
        { label: "Mengolah digit sebuah bilangan", hint: "jumlah digit, banyaknya digit", result: "D16", why: "% 10 memberi digit terakhir dan pembagian bulat dengan 10 membuangnya; ulangi sampai habis." }
      ]
    },

    choice: {
      q: "Apa yang menentukan hasilnya?",
      options: [
        { label: "Satu syarat, dua kemungkinan", hint: "gratis ongkir atau tidak", result: "B2", why: "Satu pertanyaan ya/tidak memilih salah satu dari tepat dua hasil." },
        { label: "Rentang satu nilai, tiga hasil atau lebih", hint: "nilai angka menjadi A, B, C atau D", result: "B3", why: "Uji rentangnya dari satu ujung; uji pertama yang benar yang menentukan." },
        { label: "Dua fakta terpisah sekaligus", hint: "anggota dan lebih dari 4 kg", result: "B4", alt: "B2", why: "Gabungkan kedua syarat dengan and / or, atau sarangkan if di dalam if." },
        { label: "Banyak nilai yang persis", hint: "harga untuk ukuran “S”, “M” atau “L”", result: "B5", alt: "B3", why: "Kamus atau map dari setiap nilai ke hasilnya menggantikan rantai if yang panjang." },
        { label: "Apakah masukannya layak dipakai", hint: "tolak masukan 0 atau negatif", result: "B1", why: "Penjaga menangani masukan yang buruk lebih dulu dan kembali lebih awal." },
        { label: "Uji ya/tidak yang sama, di beberapa tempat", hint: "“apakah bilangan prima?” dipakai berulang-ulang", result: "G1", alt: "B2", why: "Taruh ujinya dalam fungsi tersendiri yang mengembalikan benar atau salah, lalu pakai ulang." }
      ]
    },

    repeat: {
      q: "Apakah banyaknya pengulangan sudah diketahui sebelum perulangan dimulai?",
      options: [
        { label: "Ya", hint: "n kali, setiap tahun selama 10 tahun", result: "C1", why: "Perulangan terhitung berjalan tepat n kali." },
        { label: "Tidak: berhenti saat nilai khusus dibaca", hint: "sampai pengguna mengetik -1", result: "C2", why: "Baca dulu, lalu: selama bukan nilai berhenti, proses dan baca nilai berikutnya." },
        { label: "Tidak: minta ulang sampai masukannya valid", hint: "angka dari 1 sampai 10", result: "C3", alt: "C2", why: "Baca, dan selama masukannya tidak valid, jelaskan lalu baca lagi." },
        { label: "Tidak: berhenti saat target tercapai", hint: "berapa tahun sampai tabungan berlipat dua?", result: "C4", alt: "C1", why: "Ulangi selama target belum tercapai, sambil menghitung putarannya." },
        { label: "Tampilkan menu sampai pengguna keluar", hint: "1) setor  2) lihat  0) keluar", result: "C5", alt: "C2", why: "Tampilkan menu, jalankan pilihan, dan ulangi sampai pilihan keluar." },
        { label: "Coba kandidat sampai ada yang berhasil", hint: "bilangan terkecil yang…", result: "G2", alt: "D6", why: "Buat kandidat secara berurutan dan uji satu per satu; berhenti pada yang pertama lolos." },
        { label: "Selesaikan versi lebih kecil dari masalah yang sama", hint: "n! = n × (n − 1)!, folder di dalam folder", result: "G3", alt: "D2", why: "Kasus dasar menjawab masukan terkecil; kasus lainnya memanggil dirinya sendiri pada sesuatu yang lebih kecil lalu membangun dari jawabannya." }
      ]
    },

    list: {
      q: "Jawabannya seharusnya apa?",
      options: [
        { label: "Ya atau tidak", hint: "adakah…? semuakah…?", next: "yesno" },
        { label: "Sebuah hitungan", hint: "berapa banyak…", next: "howmany" },
        { label: "Satu angka yang merangkum item", hint: "total, rata-rata, terbesar…", next: "summary" },
        { label: "Di mana sebuah item berada", hint: "posisinya", next: "where" },
        { label: "Daftar baru", hint: "sebagian item, atau setiap item diubah", next: "newList" },
        { label: "Sesuatu tentang item bertetangga", hint: "setiap item dibandingkan dengan sebelumnya", next: "neighbours" }
      ]
    },

    yesno: {
      q: "Kapan jawabannya ya?",
      options: [
        { label: "Jika setidaknya satu item cocok", hint: "adakah bilangan negatif?", result: "D7", why: "Berhenti dengan ya pada kecocokan pertama; jawab tidak hanya setelah memeriksa semuanya." },
        { label: "Jika setiap item cocok", hint: "apakah semua nilai antara 0 dan 100?", result: "D8", why: "Berhenti dengan tidak pada item pertama yang gagal; jawab ya hanya jika tidak ada yang gagal." },
        { label: "Satu nilai lolos sebuah pemeriksaan", hint: "apakah bilangan ini prima?", result: "G1", alt: "D8", why: "Fungsi ya/tidak membungkus ujinya agar bisa dipakai ulang." }
      ]
    },

    howmany: {
      q: "Menghitung apa?",
      options: [
        { label: "Item yang lolos uji", hint: "berapa nilai yang minimal 50?", result: "D1", why: "Mulai penghitung dari 0 dan tambah satu untuk setiap item yang lolos." },
        { label: "Item di setiap kategori", hint: "berapa banyak nilai A, B, C dan D?", result: "D14", alt: "D1", why: "Simpan satu penghitung per kategori." },
        { label: "Seberapa sering setiap nilai muncul", hint: "berapa kali setiap kata muncul?", result: "D15", alt: "D1", why: "Kamus memetakan setiap nilai ke hitungannya." },
        { label: "Nilai sebelum tanda berhenti", hint: "angka yang diketik sampai -1", result: "C2", why: "Baca sampai nilai berhenti, sambil menghitung." }
      ]
    },

    summary: {
      q: "Rangkuman yang mana?",
      options: [
        { label: "Total (atau hasil kali)", hint: "jumlahkan semuanya", result: "D2", why: "Mulai dari 0 (atau 1 untuk perkalian) dan lipat setiap item ke total berjalan." },
        { label: "Rata-rata", hint: "nilai tengah (mean)", result: "D3", why: "Total dan jumlah item dalam satu perulangan, dijaga dari daftar kosong, lalu dibagi." },
        { label: "Nilai terbesar atau terkecil", hint: "suhu tertinggi", result: "D4", why: "Mulai dengan item pertama sebagai terbaik sejauh ini dan biarkan setiap item menantangnya." },
        { label: "Posisi yang terbesar", hint: "hari apa yang paling panas?", result: "D5", alt: "D4", why: "Seperti terbesar, tetapi ingat indeks yang terbaik sejauh ini." },
        { label: "Rangkaian terpanjang", hint: "paling banyak hari berturut-turut di atas 30 °C", result: "D13", alt: "D1", why: "Lacak rangkaian saat ini dan rangkaian terpanjang sejauh ini." }
      ]
    },

    where: {
      q: "Apakah itemnya sudah terurut?",
      options: [
        { label: "Belum, atau saya tidak tahu", hint: "telusuri satu per satu", result: "D6", why: "Kunjungi setiap posisi dan kembalikan kecocokan pertama, atau -1." },
        { label: "Ya", hint: "dari terkecil ke terbesar", result: "F2", alt: "D6", why: "Bagi dua membelah rentang di setiap langkah, sehingga perbandingannya sangat sedikit." }
      ]
    },

    newList: {
      q: "Item mana yang masuk ke daftar baru?",
      options: [
        { label: "Hanya yang lolos uji", hint: "nilai yang lulus", result: "D9", why: "Mulai dengan daftar kosong dan tambahkan setiap item yang lolos." },
        { label: "Semuanya, masing-masing diubah", hint: "tambah 5 poin bonus ke setiap nilai", result: "D10", alt: "D9", why: "Tambahkan salinan yang sudah diubah dari setiap item ke daftar baru." },
        { label: "Semuanya, tanpa duplikat", hint: "setiap nama sekali", result: "F4", alt: "D9", why: "Ingat apa yang sudah ditemui, dan hanya tambahkan item yang belum pernah ditemui." },
        { label: "Semuanya, terurut", hint: "terkecil lebih dulu", result: "F3", alt: "D4", why: "Berulang kali cari item terkecil yang tersisa dan pindahkan ke depan." }
      ]
    },

    neighbours: {
      q: "Tentang item bertetangga, apa yang dicari?",
      options: [
        { label: "Bandingkan setiap item dengan sebelumnya", hint: "apakah harganya naik?", result: "D12", alt: "D4", why: "Simpan item sebelumnya dalam variabel sambil menelusuri daftar." },
        { label: "Rangkaian item berturut-turut yang terpanjang", hint: "rangkaian kemenangan terpanjang", result: "D13", alt: "D1", why: "Lacak rangkaian saat ini dan rangkaian terpanjang sejauh ini." }
      ]
    },

    text: {
      q: "Apa yang Anda perlukan dari teks itu?",
      options: [
        { label: "Satu bagiannya", hint: "domain sebuah email, ekstensi sebuah berkas", result: "A4", why: "Rapikan, cari penandanya, pastikan ada, lalu ambil bagian yang diperlukan." },
        { label: "Teks baru, dibangun karakter demi karakter", hint: "sembunyikan digit, hapus spasi", result: "D11", why: "Telusuri karakternya dan tambahkan potongan ke akhir string baru untuk setiap karakter." },
        { label: "Berapa karakter yang lolos uji", hint: "berapa huruf vokalnya?", result: "D1", why: "String adalah daftar karakter: hitung yang lolos, mulai dari 0." },
        { label: "Apakah ada karakter yang lolos uji", hint: "adakah digit dalam kata sandi?", result: "D7", why: "Telusuri karakternya dan berhenti dengan ya pada karakter pertama yang cocok." },
        { label: "Bandingkan dari kedua ujung", hint: "apakah ini palindrom?", result: "F1", alt: "D11", why: "Dua posisi bergerak ke dalam dari kedua ujung, sambil membandingkan." }
      ]
    },

    twoD: {
      q: "Yang mana di antara ini?",
      options: [
        { label: "Mencetak baris dan kolom", hint: "segitiga bintang, tabel perkalian", result: "E1", why: "Perulangan luar untuk baris dan perulangan dalam untuk kolom pada setiap baris." },
        { label: "Memeriksa setiap pasangan item", hint: "adakah dua bilangan yang jumlahnya 10?", result: "E2", alt: "E1", why: "Perulangan dalam dimulai tepat setelah indeks luar, sehingga setiap pasangan dikunjungi sekali." },
        { label: "Data yang disimpan sebagai tabel", hint: "tabel nilai per mahasiswa per mata kuliah", result: "E3", alt: "E1", why: "Untuk setiap baris tabel, telusuri setiap selnya dengan skema satu kali telusur mana pun." }
      ]
    }
  }
};
