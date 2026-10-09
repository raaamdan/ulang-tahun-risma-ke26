/* ==========================================================================
   PENGATURAN KARTU ULANG TAHUN
   --------------------------------------------------------------------------
   Semua teks, foto, dan musik diatur di file ini saja.
   Cara edit: buka file ini dengan Notepad / VS Code, ubah teks di antara
   tanda kutip "...", simpan, lalu buka ulang index.html di browser.

   Aturan kecil supaya tidak error:
   - Teks selalu di dalam tanda kutip:  "seperti ini"
   - Kalau di dalam teks butuh tanda kutip, pakai kutip satu: 'begini'
   - Setiap baris diakhiri koma, kecuali baris terakhir di dalam [ ] atau { }
   ========================================================================== */

window.PENGATURAN = {

  /* ---------- Identitas ---------- */
  namaPanggilan: "Risma",
  namaLengkap: "Risma Nuryanti",
  usiaKe: 26,                          // angka ini juga jadi lilin di kue
  tanggalUlangTahun: "2026-10-11",     // format: TAHUN-BULAN-TANGGAL
  inisialSegel: "R",                   // huruf di segel lilin amplop

  /* ---------- Sampul kartu ---------- */
  judulSampul: "Selamat ulang tahun",
  kutipanSampul: "Untuk perempuan yang membuatku jatuh cinta lagi, setiap hari.",
  fotoUtama: "assets/foto/foto-1.jpg", // foto di halaman kiri kartu

  /* ---------- Isi surat (diketik otomatis satu per satu) ----------
     Setiap "..." adalah satu paragraf. Boleh ditambah atau dikurangi. */
  salam: "Risma sayang,",
  pesan: [
    "Selamat ulang tahun yang ke-26. Hari ini aku ingin berhenti sebentar dari semua kesibukan, hanya untuk bilang betapa beruntungnya aku punya kamu.",
    "Terima kasih sudah memilih berjalan bersamaku. Untuk pagi-pagi yang kamu buat hangat, untuk sabarmu menghadapi aku yang tidak selalu mudah, dan untuk tawamu yang selalu berhasil membuat hari terberatku terasa ringan.",
    "Di usiamu yang baru ini, aku berdoa semoga kamu selalu sehat, hatimu selalu lapang, dan semua mimpi yang diam-diam kamu simpan satu per satu menjadi nyata. Aku akan ada di sana, menyemangatimu di setiap langkahnya.",
    "Aku tidak bisa menjanjikan hidup yang selalu mudah. Tapi aku janji akan selalu menggenggam tanganmu, di hari yang cerah maupun yang hujan, hari ini, besok, dan seterusnya.",
    "Aku mencintaimu, lebih dari yang bisa ditulis di kartu sekecil ini."
  ],
  penutup: "Selamanya milikmu,",
  tandaTangan: "Suamimu",              // ganti dengan nama atau panggilan sayangmu

  /* ---------- Galeri foto ----------
     Taruh foto di folder assets/foto, lalu tulis nama file-nya di sini.
     Jumlah foto bebas. Format: jpg, jpeg, png, atau webp.
     Nama file harus sama persis (huruf besar/kecil berpengaruh saat online). */
  judulGaleri: "Kenangan kita",
  subjudulGaleri: "Potongan kecil cerita kita yang ingin selalu kuingat.",
  foto: [
    { src: "assets/foto/foto-1.jpg", keterangan: "Awal cerita kita" },
    { src: "assets/foto/foto-2.jpg", keterangan: "Perjalanan pertama berdua" },
    { src: "assets/foto/foto-3.jpg", keterangan: "Hari kita resmi menjadi satu" },
    { src: "assets/foto/foto-4.jpg", keterangan: "Senyum favoritku" },
    { src: "assets/foto/foto-5.jpg", keterangan: "Rumah adalah di mana pun ada kamu" },
    { src: "assets/foto/foto-6.jpg", keterangan: "Dan masih banyak halaman yang akan kita tulis" }
  ],

  /* ---------- Kue & penutup ---------- */
  ajakanKue: "Pejamkan mata, buat permohonan,",
  ajakanKue2: "lalu tiup lilinnya.",
  ucapanAkhir: "Semoga semua permohonanmu terkabul",
  ucapanAkhirKecil: "Selamat ulang tahun, sayang. Aku sayang kamu, hari ini dan setiap hari setelahnya.",

  /* ---------- Musik latar ----------
     Taruh lagu MP3 favorit kalian di folder assets/musik dengan nama lagu.mp3
     Kalau file belum ada, kartu otomatis memutar alunan kotak musik bawaan. */
  musik: "assets/musik/lagu.mp3",
  volumeMusik: 0.7,                    // 0 (senyap) sampai 1 (paling keras)

  /* ---------- Lain-lain ---------- */
  kecepatanKetik: 24,                  // makin kecil makin cepat (milidetik per huruf)
  tampilkanHitungMundur: true          // tampilkan "x hari lagi" di halaman amplop
};
