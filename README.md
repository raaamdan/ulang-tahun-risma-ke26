# Kartu Ulang Tahun untuk Risma 💌

Website kartu ucapan: amplop dengan segel → kartu yang terbuka seperti buku → surat yang
diketik otomatis → galeri foto polaroid → kue dengan lilin "26" yang bisa ditiup.

## Melihat di komputer
Klik dua kali `index.html`. Semua fitur jalan, kecuali "Tiup lewat mikrofon"
(fitur mikrofon butuh alamat https, jadi baru aktif setelah online).

## Yang bisa diubah (semua di `pengaturan.js`)
| Yang ingin diubah | Bagian di pengaturan.js |
|---|---|
| Isi surat | `salam`, `pesan` (satu "..." = satu paragraf), `penutup`, `tandaTangan` |
| Tulisan sampul | `judulSampul`, `kutipanSampul` |
| Foto halaman kiri kartu | `fotoUtama` |
| Foto galeri + keterangan | `foto` |
| Tulisan di adegan kue | `ajakanKue`, `ajakanKue2`, `ucapanAkhir`, `ucapanAkhirKecil` |
| Musik | `musik`, `volumeMusik` |
| Kecepatan mengetik | `kecepatanKetik` |

### Mengganti foto
1. Masukkan foto ke folder `assets/foto` (jpg/png/webp).
2. Perkecil dulu ke lebar sekitar 1200 piksel supaya cepat dibuka di HP.
3. Tulis nama file-nya di `pengaturan.js`. Nama harus sama persis, termasuk huruf besar/kecil
   (`Foto1.JPG` berbeda dengan `foto1.jpg` saat sudah online).
4. Kalau ada foto yang tidak ketemu, galeri akan menampilkan nama file yang dicari.

### Menambahkan musik
Taruh lagu di `assets/musik/lagu.mp3`. Kalau belum ada, kartu memutar alunan kotak musik bawaan.
Catatan: di iPhone, alunan bawaan ikut senyap jika tombol silent aktif, jadi lebih baik pakai MP3.

## Online-kan (pilih salah satu)

### A. GitHub Pages (gratis, paling disarankan)
1. Buat akun di github.com, lalu klik **New repository**. Beri nama, misalnya `ulang-tahun-risma`, pilih **Public**, klik **Create repository**.
2. Di halaman repo, klik **uploading an existing file**. Seret **isi** folder ini (bukan foldernya) ke kotak upload, lalu klik **Commit changes**.
   File `.nojekyll` dan `.gitlab-ci.yml` tersembunyi di sebagian komputer; tidak apa-apa jika tidak ikut.
3. Buka **Settings → Pages**. Pada **Source** pilih **Deploy from a branch**, branch **main**, folder **/(root)**, klik **Save**.
4. Tunggu 1–2 menit, alamatnya muncul di halaman itu: `https://USERNAME.github.io/ulang-tahun-risma/`
5. Mengubah teks nanti: buka `pengaturan.js` di GitHub → ikon pensil → edit → **Commit changes**. Situs ikut berubah dalam 1–2 menit.

Penting: di akun gratis, repo harus Public, artinya foto bisa dilihat siapa pun yang menemukan repo atau link-nya.

### B. GitLab Pages
Buat project baru, upload semua file **termasuk `.gitlab-ci.yml`**, lalu tunggu pipeline selesai.
Alamatnya ada di **Deploy → Pages**.

### C. AWS Amplify (kalau ingin tetap di AWS)
1. Pilih semua file **di dalam** folder ini → kompres jadi .zip (`index.html` harus ada di paling luar zip, bukan di dalam subfolder).
2. Buka konsol AWS Amplify → **Deploy without Git** → metode **Drag and drop** → pilih zip → **Save and deploy**.
3. Untuk update, ulangi dengan zip baru. Hapus app-nya setelah tidak dipakai supaya tidak ada tagihan.

## Pratinjau saat dibagikan ke WhatsApp
Setelah online, buka `index.html`, hapus tanda komentar pada baris `og:image`, dan isi dengan URL lengkap foto,
contoh: `https://USERNAME.github.io/ulang-tahun-risma/assets/foto/foto-1.jpg`
