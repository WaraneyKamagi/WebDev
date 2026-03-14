# 🌱 WebDev — Web Development Projects

<div align="center">

![WebDev Banner](https://img.shields.io/badge/Semester_6-Web_Development-4f46e5?style=for-the-badge&logoColor=white)

Kumpulan proyek Web Development untuk mata kuliah **Semester 6**.  
Dibangun menggunakan teknologi modern seperti **React**, **Vite**, dan **JavaScript**.

</div>

---

## 📦 Daftar Proyek

### 🌿 [AgriScan AI](./agriscan/)

> Aplikasi deteksi penyakit tanaman tomat berbasis kecerdasan buatan.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

**Upload foto tanaman tomat → AI menganalisis → Dapatkan diagnosis & rekomendasi perawatan dalam hitungan detik.**

#### ✨ Fitur Unggulan

| Fitur | Deskripsi |
|---|---|
| 🎯 **Akurasi Tinggi** | Dilatih dengan 500K+ gambar berlabel, akurasi mencapai **98.4%** |
| ⚡ **Hasil Instan** | Analisis selesai dalam **< 3 detik** |
| 🌿 **32+ Penyakit** | Mencakup *early blight*, *bacterial spot*, dan penyakit lainnya |
| 💊 **Rencana Perawatan** | Setiap diagnosis dilengkapi protokol perawatan dari para ahli |
| 📊 **Confidence Score** | Tingkat keyakinan AI ditampilkan secara detail |
| � **Analisis Keparahan** | Menghitung persentase area daun terinfeksi dengan analisis piksel |
| �🔒 **Privacy First** | Gambar tidak disimpan — data pertanian Anda sepenuhnya aman |

#### 📱 Halaman Aplikasi

```
🏠 Landing Page  →  📷 Scan Upload  →  ⚡ AI Scanning  →  ✅ Results Page
                                                          ↘️  ⚠️  Error Page
```

#### 🗂️ Struktur Folder

```
agriscan/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Navbar.jsx       # Navigasi utama
│   ├── pages/
│   │   ├── HomePage.jsx     # Landing page + upload cepat
│   │   ├── ScanPage.jsx     # Upload & proses scanning
│   │   ├── ResultsPage.jsx  # Hasil diagnosis
│   │   └── ErrorPage.jsx    # Halaman error
│   ├── icons.jsx            # Kumpulan ikon SVG
│   ├── App.jsx              # Root component + routing
│   ├── App.css              # Design system & stylesheet
│   └── main.jsx             # Entry point React
├── index.html
├── package.json
└── vite.config.js
```

#### 🚀 Cara Menjalankan

```bash
# Masuk ke folder proyek
cd agriscan

# Install dependensi
npm install

# Jalankan development server
npm run dev
```

Buka **[http://localhost:5173](http://localhost:5173)** di browser. 🎉

| Script | Perintah | Keterangan |
|---|---|---|
| `dev` | `npm run dev` | Development server (hot reload) |
| `build` | `npm run build` | Build untuk production |
| `preview` | `npm run preview` | Preview build production |
| `lint` | `npm run lint` | Jalankan ESLint |

---

## 🛠️ Tech Stack Keseluruhan

| Teknologi | Kegunaan |
|---|---|
| [React 19](https://react.dev/) | UI library |
| [Vite 7](https://vitejs.dev/) | Build tool & dev server |
| JavaScript (ESM) | Bahasa pemrograman |
| Vanilla CSS | Styling & design system |
| [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | Tipografi |

---

## 📄 Lisensi

Repositori ini dibuat untuk keperluan akademis — **Semester 6, Mata Kuliah Web Development**.

---

<div align="center">

Dibuat dengan ❤️ menggunakan **React + Vite**

</div>
