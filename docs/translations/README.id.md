---

# Aplikasi Chat Waktu Nyata (Real-Time Chat App) 🇮🇩

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](#kontribusi)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)
![Status](https://img.shields.io/badge/status-active-success)
![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)
![Backend: Node](https://img.shields.io/badge/Backend-Express%20%7C%20MongoDB-brightgreen?logo=node.js)
![Issues](https://img.shields.io/github/issues/behan05/real-time-chat-app)
![Forks](https://img.shields.io/github/forks/behan05/real-time-chat-app)
![Stars](https://img.shields.io/github/stars/behan05/real-time-chat-app)
![Last Commit](https://img.shields.io/github/last-commit/behan05/real-time-chat-app)

Aplikasi chat full-stack waktu nyata dengan autentikasi pengguna, pesan privat, dan komunikasi instan menggunakan **React**, **Node.js**, **Express**, **Socket.IO**, dan **MongoDB**.

---

## 📚 Daftar Isi

* [Pratinjau](#️-pratinjau)
* [Fitur](#-fitur)
* [Prasyarat](#-prasyarat)
* [Langkah Instalasi](#️-langkah-instalasi)
* [Teknologi Digunakan](#-teknologi-digunakan)
* [Struktur Proyek](#-struktur-proyek)
* [Deployment](#-deployment)
* [Kontribusi](#-kontribusi)
* [Dibuat oleh Kontributor](#️-dibuat-oleh-kontributor)
* [Penghargaan](#️-🙏-Penghargaan)
* [Kontak](#-kontak)
* [Lisensi](#-lisensi)

---

## 🖼️ Pratinjau

| Halaman Login                                  | Daftar Akun                                     | Halaman Aplikasi                              |
| ---------------------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| ![](../screenshot/Login-page.png) | ![](../screenshot/Signup-page.png) | ![](../screenshot/apps-page.png) |

---

## 🚀 Fitur

* 🔐 Autentikasi Pengguna (Login/Daftar)
* 💬 Pesan Privat satu-ke-satu
* 📡 Pembaruan Pesan Waktu Nyata dengan Socket.IO
* 📜 Riwayat Chat Persisten (MongoDB)
* ✏️ Indikator Mengetik (Opsional)
* 📱 Antarmuka Responsif & UX modern
* 🕵️‍♂️ Rute Terproteksi untuk Pengguna Tertentu
* 🕒 Pesan dengan Timestamp

---

## 📦 Prasyarat

Pastikan kamu telah menginstal:

* [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
* [Git](https://git-scm.com/)
* Akun [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (atau MongoDB lokal)

> **Butuh bantuan setup MongoDB Atlas?** Ikuti panduan ini: [Deploy Cluster Gratis](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
>
> Setelah deploy:
>
> 1. Klik **Connect** → **Drivers**
> 2. Pilih **Node.js** sebagai driver
> 3. Salin string koneksi dan gunakan pada `MONGO_URI` di file `.env`

Contoh string koneksi:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
```

---

## ⚙️ Langkah Instalasi

Ikuti langkah berikut untuk menjalankan aplikasi secara lokal:

### 1. Clone Repositori

```bash
git clone https://github.com/behan05/real-time-chat-app.git
cd real-time-chat-app
```

---

### 2. Siapkan Backend

Masuk ke direktori server:

```bash
cd connect-server
```

Instal dependensi:

```bash
npm install
```

Buat file environment:

```bash
cp .env.example .env
```

Edit file `.env` dan isi:

```env
PORT=5000
MONGO_URI=isi_mongo_uri_kamu
JWT_SECRET=isi_jwt_secret_kamu
```

Jalankan server backend:

```bash
npm start
```

Kamu akan melihat log seperti:

```
Server running on port 5000...
Connected to MongoDB
```

---

### 3. Siapkan Frontend

Buka terminal baru:

```bash
cd ../connect-ui
npm install
npm run dev
```

Aplikasi akan berjalan di: [http://localhost:5173/](http://localhost:5173)

---

## 🧯 Pemecahan Masalah

Beberapa masalah umum dan solusinya:

* **MongooseServerSelectionError**: Periksa kembali URI MongoDB dan koneksi internet.
* **Port sedang digunakan**: Ganti nilai `PORT` di `.env`, atau hentikan proses yang bentrok.
* **Frontend tidak muncul**: Pastikan backend berjalan dengan benar.

---

## 🧱 Teknologi Digunakan

**Frontend:**

* ⚛️ React + Vite
* 💅 Material UI (MUI)
* 🔁 React Router
* 📦 Redux atau Context API
* 📢 Toastify
* 🌐 Socket.IO Client

**Backend:**

* 🟩 Node.js + Express
* 🛢️ MongoDB + Mongoose
* 🔐 JWT untuk Autentikasi
* 🔒 bcrypt untuk Enkripsi
* 📡 Socket.IO untuk komunikasi real-time

---

## 📁 Struktur Proyek

```
real-time-chat-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── redux/ atau context/
│   │   └── App.jsx
│   └── package.json
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── server.js
├── .env
└── README.md
```

---

## 🚀 Deployment

* **Frontend**: \[[Vercel](https://connect-link-three.vercel.app/)]\([https://connect-link-three.vercel.app](https://connect-link-three.vercel.app))
* **Backend**: Render

---

## 🤝 Kontribusi

### Ingin berkontribusi?

Jangan khawatir jika kamu baru di open source — kami dengan senang hati akan membimbingmu! 😄
Cukup buka issue atau komentar pada salah satu yang ingin kamu kerjakan.

### Kami menyambut semua kontribusi!

Jika kamu baru memulai, berikut beberapa tugas pertama yang bagus:

### 🔧 Tugas Pertama yang Cocok

* Perbaiki pesan error atau feedback pengguna
* Setup GitHub Actions untuk CI
* Tambahkan unit test atau end-to-end test
* Tingkatkan aksesibilitas
* Tulis dokumentasi

### Langkahnya:

* 🌱 Fork repo ini
* 🛠️ Buat branch baru untuk fiturmu
* 🔃 Kirim Pull Request
* ❤️ Jangan lupa ⭐ repo ini ya!

Baca juga [panduan kontribusi](CONTRIBUTING.md) jika tersedia.

---

## ❤️ Dibuat oleh Kontributor

Kami berterima kasih kepada semua kontributor yang terus membuat proyek ini lebih baik.
Tambahkan namamu di `CONTRIBUTORS.md` setelah berkontribusi!

---

## 🙏 Penghargaan

Terima kasih kepada semua kontributor dan pustaka open-source yang digunakan dalam proyek ini.
Tanpa mereka, proyek ini tidak akan mungkin ada.

---

## 📬 Kontak

Untuk pertanyaan atau kolaborasi, hubungi:
[behankrbth@outlook.com](mailto:behankrbth@outlook.com)

---

## 📄 Lisensi

Proyek ini berlisensi [MIT License](./LICENSE)

---



