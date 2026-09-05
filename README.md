# 🎨 Reksakarya Frontend — Wasrik Compliance Dashboard

> **Modern Web Application untuk Petugas Pengawasan dan Pemeriksaan (Wasrik) BPJS Kesehatan RI, dibangun dengan Vue 3, TypeScript, dan Tailwind CSS.**

[![Vue 3](https://img.shields.io/badge/Vue.js-3.5+-4FC08D.svg?logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Pinia](https://img.shields.io/badge/Pinia-2.2+-FFE57F.svg?logo=vuedotjs&logoColor=black)](https://pinia.vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)

---

## 📋 Daftar Isi
- [Gambaran Umum Antarmuka](#-gambaran-umum-antarmuka)
- [Teknologi & Ekosistem](#-teknologi--ekosistem)
- [Struktur Direktori Frontend](#-struktur-direktori-frontend)
- [Fitur Utama & Halaman Aplikasi](#-fitur-utama--halaman-aplikasi)
- [Manajemen State & Integrasi API](#-manajemen-state--integrasi-api)
- [Panduan Menjalankan & Build Produksi](#-panduan-menjalankan--build-produksi)

---

## 🌟 Gambaran Umum Antarmuka

Frontend **Reksakarya** dirancang khusus untuk mempermudah alur kerja auditor Wasrik BPJS Kesehatan:
- **Design System Premium**: Mengadopsi palet warna resmi BPJS Kesehatan (Emerald, Teal, Navy Slate) dengan tata letak modern, bersih, dan informatif.
- **Explainable AI (XAI) Visualization**: Kartu atribusi SHAP interaktif dengan interpretasi deviasi upah dan integrasi model LLM Gemini 3.6 Flash.
- **Dynamic Risk Triage Queue**: Tabel antrean badan usaha berisiko dengan filter multi-parameter real-time dan pagination asinkron.
- **One-Click Auto-BAP Generator**: Pembuatan draf dokumen Berita Acara Pemeriksaan (BAP) dan lembar pemanggilan audit yang dapat langsung dicetak atau disalin.

---

## 🛠️ Teknologi & Ekosistem

- **Framework**: Vue 3 (Composition API dengan sintaks `<script setup>`).
- **Type System**: TypeScript (Strongly Typed interfaces untuk Company, Worker, Regional, XAI, dan BAP).
- **Styling**: Tailwind CSS v3 dengan custom tokens dan glassmorphism effects.
- **State Management**: Pinia Store (`compliance.ts`) untuk sentralisasi data, filter, dan caching.
- **Routing**: Vue Router 4 dengan active route indicator dan breadcrumbs.
- **Icons**: Lucide Icons (`lucide-vue-next`).
- **Markdown Renderer**: `marked` library untuk rendering laporan narasi investigasi AI.
- **HTTP Client**: Axios dengan konfigurasi timeout adaptif 60 detik.
- **Bundler & Build Tool**: Vite 6 dengan API proxy ke backend FastAPI (`localhost:8000`).

---

## 📁 Struktur Direktori Frontend

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts              # Axios instance (Base URL /api/v1, 60s Timeout)
│   ├── types/
│   │   └── index.ts               # Type definitions (Company, Worker, XAI, KPI, BAP)
│   ├── stores/
│   │   └── compliance.ts          # Pinia store untuk state agregat & query API
│   ├── router/
│   │   └── index.ts               # Konfigurasi Vue Router 4
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.vue        # Navigasi utama Wasrik
│   │   │   └── Navbar.vue         # Header, pencarian global, & status sistem
│   │   └── common/
│   │       ├── RiskBadge.vue      # Badge visual indikator risiko kepatuhan
│   │       ├── StatCard.vue       # Kartu metrik KPI kepatuhan
│   │       ├── XAIExplainerCard.vue # Kartu visualisasi SHAP & narasi Gemini AI
│   │       └── WorkerDetailModal.vue # Modal rincian pekerja (PII Masked)
│   ├── views/
│   │   ├── DashboardView.vue      # Ringkasan KPI nasional, grafik, & heatmap
│   │   ├── TriageQueueView.vue    # Daftar antrean triase prioritas pemeriksaan
│   │   ├── CompanyListView.vue    # Direktori pencarian 2.000 Badan Usaha
│   │   ├── CompanyDetailView.vue  # Investigasi mendalam profil BU & XAI report
│   │   ├── RegionalBenchmarkView.vue # Tabel acuan 38 Provinsi UMP & upah BPS
│   │   ├── BapGeneratorView.vue   # Auto-BAP Generator siap cetak/unduh
│   │   └── RegulationView.vue     # Kompilasi regulasi JKN & UU Ketenagakerjaan
│   ├── App.vue                    # Root application component
│   ├── main.ts                    # Bootstrap Vue application & plugins
│   └── style.css                  # Master CSS & styling tokens
├── index.html
├── tailwind.config.js             # Konfigurasi theme & token warna BPJS
├── vite.config.ts                 # Konfigurasi Vite & reverse proxy backend
├── tsconfig.json
└── package.json
```

---

## 🖥️ Fitur Utama & Halaman Aplikasi

### 1. Dashboard Utama (`/dashboard`)
- Menampilkan total potensi kebocoran penerimaan iuran (*Revenue Leakage*), persentase anomali nasional, total defisit pekerja, serta grafik distribusi per wilayah dan sektor usaha.

### 2. Antrean Triase Risiko (`/triage`)
- Mengurutkan badan usaha berdasarkan urgensi audit (*High, Medium, Low*), dilengkapi estimasi kerugian bulanan dan tombol aksi cepat investigasi.

### 3. Detail Investigasi Entitas (`/companies/:id`)
- Menyajikan perbandingan data e-Dabu vs WLTK, analisis dekomposisi SHAP per variabel, ringkasan eksekutif AI, serta daftar seluruh tenaga kerja dengan penyamaran NIK sesuai UU PDP.

### 4. Auto-BAP Generator (`/bap-generator`)
- Menghasilkan dokumen hukum Berita Acara Pemeriksaan otomatis yang memuat data temuan anomali, estimasi kerugian iuran 5%, dasar pasal pelanggaran, dan daftar dokumen wajib bawa (Slip Gaji Asli, SPT PPh 21, Rekening Koran).

### 5. Regulasi & Benchmark Wilayah (`/regulations` & `/regional`)
- Memberikan transparansi landasan yuridis pemeriksaan dan acuan standar upah minimum 38 provinsi di Indonesia.

---

## ⚡ Panduan Menjalankan & Build Produksi

### 1. Instalasi Dependensi
```bash
cd frontend
npm install
```

### 2. Menjalankan Mode Development
```bash
npm run dev
```
Aplikasi dapat diakses pada browser di [http://localhost:5173](http://localhost:5173).  
Permintaan API ke `/api/v1/*` akan diteruskan secara otomatis ke backend FastAPI di `http://localhost:8000`.

### 3. Verifikasi Build & Produksi
```bash
npm run build
```
Hasil kompilasi siap *deploy* akan berada pada folder `dist/` dan siap diunggah ke Vercel atau Cloudflare Pages.
