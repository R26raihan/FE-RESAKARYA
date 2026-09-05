# 🎨 Reksakarya Frontend (Vue 3 + TypeScript + Tailwind CSS)

Modern Web Dashboard untuk **Petugas Pengawasan dan Pemeriksaan (Wasrik) BPJS Kesehatan RI** dalam platform **Reksakarya AI**.

---

## 🛠️ Tech Stack & Ekosistem
- **Framework**: Vue 3 (Composition API `<script setup>`)
- **Language**: TypeScript (Type-Safe & Scalable)
- **Styling**: Tailwind CSS v3 (Custom Dark Mode & Design Tokens BPJS)
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Icons**: Lucide Icons (`lucide-vue-next`)
- **HTTP Client**: Axios
- **Bundler / Dev Server**: Vite 6

---

## 📁 Struktur Direktori
```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts              # Axios instance dengan base URL /api/v1
│   ├── types/
│   │   └── index.ts               # Interface TypeScript (Company, Worker, Regional, KPI)
│   ├── stores/
│   │   └── compliance.ts          # Pinia store untuk manajemen state & filter
│   ├── router/
│   │   └── index.ts               # Vue Router configuration
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.vue        # Navigasi sidebar Wasrik
│   │   │   └── Navbar.vue         # Header, pencarian & governance badge
│   │   └── common/
│   │       ├── RiskBadge.vue      # Badge status risiko (High / Low Risk)
│   │       └── StatCard.vue       # Kartu KPI metrik kepatuhan
│   ├── views/
│   │   ├── DashboardView.vue      # Ringkasan analitik, KPI, & heatmap sektoral
│   │   ├── TriageQueueView.vue    # Antrean triase prioritas pemeriksaan Wasrik
│   │   ├── CompanyDetailView.vue  # Investigasi mendalam BU & SHAP XAI attribution
│   │   ├── RegionalBenchmarkView.vue # Tabel acuan 38 Provinsi UMP & BPS
│   │   └── BapGeneratorView.vue   # Auto-BAP Generator (Berita Acara Pemeriksaan)
│   ├── App.vue                    # Root component dengan master layout
│   ├── main.ts                    # Application bootstrap
│   └── style.css                  # Global Tailwind imports & custom scrollbars
├── index.html
├── tailwind.config.js             # Token warna khusus BPJS (Green, Blue, Risk)
├── vite.config.ts                 # Proxy API backend ke port 8000
└── package.json
```

---

## ⚡ Cara Menjalankan Frontend

### 1. Masuk ke Folder Frontend
```bash
cd frontend
```

### 2. Jalankan Development Server
```bash
npm run dev
```
Buka browser di [http://localhost:5173](http://localhost:5173).  
Permintaan API ke `/api/*` akan secara otomatis di-*proxy* ke backend FastAPI di `http://localhost:8000`.

### 3. Build untuk Produksi
```bash
npm run build
```
Hasil build siap produksi akan berada di folder `dist/`.
# FE-RESAKARYA
