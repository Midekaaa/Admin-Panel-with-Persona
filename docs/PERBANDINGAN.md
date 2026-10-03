# Perbandingan: Admin Lama → new-admin.html (Tim Marketing)

File utama: `new-admin.html` (satu file, tanpa build).
Cara buka: buka file di browser, pilih peran **Tim Marketing** (tombol angka `2`).

## 1. Artikel

| Before (admin lama) | After (new-admin.html) |
|---|---|
| ![Artikel before](images/before/before-artikel.png) | ![Artikel after](images/after/after-artikel.png) |

* Konfigurasi portal tetap sama: URL API, Domain portal, API key (sembunyi/tampil + salin), tombol Simpan.
* Bedanya: config sekarang dalam satu kartu. Dulu header dan field terpisah.
* Tombol reload sekarang berlabel jelas: **Muat ulang artikel** (dulu: Muat ulang).
* Daftar artikel tetap kartu: tanggal, judul, ringkasan, slug, status, tombol Detail.
* Salin slug dihapus. Slug cukup tampil sebagai teks.
* Dashboard Marketing dapat kartu baru **Artikel portal** (3 artikel terbaru + tombol Kelola artikel).

## 2. Iklan

| Before (admin lama) | After (new-admin.html) |
|---|---|
| ![Iklan before](images/before/before-iklan.png) | ![Iklan after](images/after/after-iklan.png) |

* Dulu: halaman workspace dengan 3 angka ringkasan + 1 kartu contoh.
* Sekarang: filter chip (Semua, Tayang, Menunggu, Draft, Selesai) + pencarian + kartu per iklan.
* Tiap kartu: jadwal Mulai/Selesai, ubah status langsung dari dropdown, Ubah, Duplikat, Hapus (ada Urungkan).
* Status Tayang meminta konfirmasi dulu.

## 3. Media

| Before (admin lama) | After (new-admin.html) |
|---|---|
| ![Media before](images/before/before-media.png) | ![Media after](images/after/after-media.png) |

* Dulu: tabel (ID, preview, nama file, tipe, ukuran, tanggal, aksi).
* Sekarang: grid tile dengan chip tipe (Semua, Avatar, Banner, Soal, Logo, Iklan, Lainnya) + pencarian.
* Tiap tile: preview ekstensi, nama, kategori + ukuran, status Dipakai/Belum dipakai, tombol export.

## 4. Media Sosial

| Before (admin lama) | After (new-admin.html) |
|---|---|
| ![Media sosial before](images/before/before-media-sosial.png) | ![Media sosial after](images/after/after-media-sosial.png) |

* Dulu: tabel dengan aksi teks (Edit, Nonaktifkan, Naik, Turun, Hapus).
* Sekarang: daftar geser (drag handle) untuk urutan tampil.
* Status jadi pill (Aktif/Nonaktif) yang bisa diketuk. Salin dan hapus jadi tombol ikon.
* Ada kartu **Pratinjau tautan** di kanan: tampil persis seperti dilihat pelajar.

## 5. Tugas Streak

| Before (admin lama) | After (new-admin.html) |
|---|---|
| ![Tugas streak before](images/before/before-tugas-streak.png) | ![Tugas streak after](images/after/after-tugas-streak.png) |

* Dulu: monitoring masih nol + tabel urutan.
* Sekarang: kartu Monitoring Tugas (Selesai 30 hari, Selesai hari ini, Task aktif) dengan pilihan 7/30/90 hari.
* Daftar jadi kartu geser dengan garis status di kiri.
* Ubah status tidak langsung tayang. Masuk antrean **Tinjau & terbitkan** dulu.

## 6. Baru (tidak ada before = standalone)

* **Dashboard** — Halo Marketing, 3 KPI, Tugas Streak, Kanal aktif, Artikel portal, Perlu perhatian, Aktivitas terbaru.
  ![Dashboard](images/after/after-dashboard.png)
* **Voucher** — kartu kode diskon (kode besar + salin), pill Persen/Nominal, pemakaian kuota, jadwal, penerima (Semua/Acak/Pilihan). Alur Draft → Siap → Aktif → Kedaluwarsa. Ada **Tambah cepat** (cukup isi nama) dan form lengkap (Buat voucher).
  ![Voucher](images/after/after-voucher.png)
* **Referral** — kartu tautan (`tryoutku.id/r/...` + salin), pill +koin, pemakaian, kedaluwarsa. Alur Aktif → Jeda → Kedaluwarsa. Ada **Tambah cepat** dan form lengkap.
  ![Referral](images/after/after-referral.png)
* **Notifikasi** — daftar belum/sudah dibaca, Tandai semua dibaca.
  ![Notifikasi](images/after/after-notifikasi.png)
* **Pengaturan** — mode Terang/Gelap, notifikasi, pasang aplikasi, export, cadangan, reset lokal.
  ![Pengaturan](images/after/after-pengaturan.png)
* **Profil** — data diri + daftar halaman yang boleh dibuka peran ini.
  ![Profil](images/after/after-profil.png)

## 7. Catatan kecil sesi ini

* Header Konfigurasi portal tanpa ikon. Aturan baru di `.opencode/AGENTS.md`: jangan tambah ikon hiasan sembarangan. Cek fitur terkait dulu. Kalau di sana tidak ada ikon, jangan tambah.
* Tab drawer **Media & versi** ditulis ulang: versi per baris (Aktif/Arsip), seksi Pratinjau siswa sendiri, peringatan gambar rusak dengan ikon.
* Screenshot di dokumen ini diambil sebelum tombol **Tambah cepat** ada. Tombolnya ada di file terbaru, di samping Buat voucher / Buat referral.
