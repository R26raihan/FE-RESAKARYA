<script setup lang="ts">
import { ref } from 'vue';
import {
  Scale,
  BookOpen,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Printer,
  ChevronRight,
  Lock,
  Layers,
  FileText,
  Clock,
  Sparkles
} from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

// Checklist state for interactive SOP simulation
const checklist = ref([
  { id: 'susu', label: 'Dokumen Struktur dan Skala Upah (SUSU) yang disahkan Disnaker', checked: true },
  { id: 'payroll', label: 'Rekapitulasi daftar gaji (payroll) asli 3 bulan terakhir', checked: true },
  { id: 'spt', label: 'Bukti Potong & Pelaporan SPT Masa PPh Pasal 21 Tahun Berjalan', checked: false },
  { id: 'bank', label: 'Rekening koran penyaluran gaji bank (payroll disbursement)', checked: false },
  { id: 'wltk', label: 'Buku Induk Karyawan & Dokumen Wajib Lapor Ketenagakerjaan (WLTK)', checked: true },
]);

const activeTab = ref<'regulasi' | 'sop'>('regulasi');

const regulations = [
  {
    title: 'UU No. 24 Tahun 2011',
    subtitle: 'Tentang Badan Penyelenggara Jaminan Sosial (BPJS)',
    badge: 'Kewajiban Kepesertaan',
    badgeColor: 'bg-teal-50 text-teal-600 border-teal-200',
    pasal: 'Pasal 15 ayat (1) & (2), Pasal 17, Pasal 19 & 55',
    implikasi: 'Landasan hukum utama modul Headcount Deficit Detector dan dasar penerbitan berkas teguran kepatuhan dalam BAP otomatis.',
    sanksi: 'Sanksi administratif (teguran, denda, penghentian layanan publik) hingga pidana penjara maks. 8 tahun atau denda maks. Rp 1 Miliar.',
    icon: Scale
  },
  {
    title: 'UU No. 6 Tahun 2023 & PP No. 36/2021',
    subtitle: 'Cipta Kerja & Regulasi Pengupahan Nasional',
    badge: 'Struktur & Skala Upah (SUSU)',
    badgeColor: 'bg-rose-50 text-rose-600 border-rose-200',
    pasal: 'Kewajiban Struktur & Skala Upah Proporsional',
    implikasi: 'Dasar justifikasi model AI menandai Flat UMP Ekstrem sebagai pelanggaran. Entitas dilarang menggaji posisi manajerial/ahli setara batas upah minimum.',
    sanksi: 'Kewajiban penyesuaian upah berdasar golongan, jabatan, masa kerja, pendidikan, dan kompetensi.',
    icon: Layers
  },
  {
    title: 'Perpres No. 82/2018 jo. Perpres No. 64/2020',
    subtitle: 'Jaminan Kesehatan Nasional (JKN)',
    badge: 'Formula Iuran 5%',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
    pasal: 'Pasal 30 - 32: Iuran Pekerja Penerima Upah (PPU)',
    implikasi: 'Formula dasar yang ditanamkan pada Revenue Leakage Calculator: Iuran 5% per bulan (4% Pemberi Kerja, 1% Pekerja) dengan cap Rp 12.000.000.',
    sanksi: 'Penetapan tagihan susulan dan denda keterlambatan pembayaran iuran.',
    icon: ShieldCheck
  },
  {
    title: 'UU No. 7 Tahun 1981',
    subtitle: 'Wajib Lapor Ketenagakerjaan di Perusahaan (WLTK)',
    badge: 'Data Cross-Check',
    badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
    pasal: 'Kewajiban Pelaporan Ketenagakerjaan Berkala',
    implikasi: 'Menjadi acuan data pembanding validasi silang antara jumlah pekerja di portal e-Dabu dan data WLTK Kementerian Ketenagakerjaan.',
    sanksi: 'Verifikasi defisit headcount riil di lapangan.',
    icon: FileCheck2
  },
  {
    title: 'UU No. 27 Tahun 2022',
    subtitle: 'Pelindungan Data Pribadi (UU PDP)',
    badge: 'Governance & Privacy',
    badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
    pasal: 'Prinsip Pemrosesan Data Pribadi Terbatas & Sah',
    implikasi: 'Menjadi protokol privasi sistem: modul mikrodata menjalankan PII Hashing dan Masking NIK serta nama pekerja demi kepatuhan hukum penuh.',
    sanksi: 'Kewajiban enkripsi data dan audit trail.',
    icon: Lock
  }
];

const sopStages = [
  {
    step: '01',
    title: 'Prapemeriksaan & Triase Otomatis (Pre-Audit Triage)',
    desc: 'Sistem menganalisis data e-Dabu dan memeringkat entitas ke dalam 3 zona risiko kepatuhan.',
    items: [
      { level: 'High Risk (Skor > 70)', text: 'Diberi bendera merah, dijadwalkan audit lapangan dalam 7 hari kerja.', color: 'text-rose-600 bg-rose-50' },
      { level: 'Medium Risk (Skor 40–70)', text: 'Diberi surat notifikasi konfirmasi data mandiri (self-service e-clearing).', color: 'text-amber-600 bg-amber-50' },
      { level: 'Low Risk (Skor < 40)', text: 'Masuk dalam pengawasan kepatuhan berkala reguler.', color: 'text-teal-600 bg-teal-50' }
    ]
  },
  {
    step: '02',
    title: 'Eksplorasi Akar Masalah (XAI Deep Dive)',
    desc: 'Petugas Wasrik meninjau dossier kepatuhan digital dan kontribusi fitur anomali (SHAP Attribution).',
    items: [
      { level: '% Flat UMP & Shannon Entropy', text: 'Menilai apakah struktur upah disamaratakan secara tidak wajar pada batas bawah regional.', color: 'text-gray-800 bg-gray-50' },
      { level: 'Regional Wage Gap Ratio', text: 'Membandingkan deviasi upah lapor terhadap standar upah riil BPS 38 provinsi.', color: 'text-gray-800 bg-gray-50' },
      { level: 'Headcount Deficit', text: 'Menganalisis selisih jumlah pekerja terdaftar e-Dabu vs WLTK Kemnaker.', color: 'text-gray-800 bg-gray-50' }
    ]
  },
  {
    step: '03',
    title: 'Pemanggilan & Klarifikasi Lapangan',
    desc: 'Petugas Wasrik memanggil pimpinan Badan Usaha dengan membawa daftar bukti wajib bawa (Evidence Checklist).',
    items: [
      { level: 'Verifikasi Dokumen SUSU', text: 'Pemeriksaan struktur upah berjenjang yang sah dari Disnaker.', color: 'text-gray-800 bg-gray-50' },
      { level: 'Rekap Payroll & SPT PPh 21', text: 'Pencocokan slip gaji riil vs data pelaporan e-Dabu.', color: 'text-gray-800 bg-gray-50' },
      { level: 'Simulation Adjustment Tool', text: 'Kalkulasi kekurangan iuran 5% jika terbukti ada under-reporting atau under-coverage.', color: 'text-teal-600 bg-teal-50' }
    ]
  },
  {
    step: '04',
    title: 'Penerbitan Berita Acara Pemeriksaan (BAP)',
    desc: 'Penerbitan dokumen hukum BAP formal siap cetak dan penandatanganan kesepakatan pemenuhan kewajiban.',
    items: [
      { level: 'Auto-BAP Generation', text: 'Sistem menyusun draf dokumen hukum lengkap dengan nomor register dan rincian anomali.', color: 'text-gray-800 bg-gray-50' },
      { level: 'Tanda Tangan Dua Pihak', text: 'Ditandatangani bersama oleh Petugas Wasrik dan Direksi/HRD Badan Usaha.', color: 'text-gray-800 bg-gray-50' },
      { level: 'Grace Period 14 Hari', text: 'Tenggat waktu perbaikan data dan penyetoran kekurangan iuran maksimal 14 hari kalender.', color: 'text-rose-600 bg-rose-50' }
    ]
  }
];
</script>

<template>
  <div class="space-y-6">
    <!-- Top Hero Header Card -->
    <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold mb-2 border border-teal-200">
          <Scale class="w-3.5 h-3.5" />
          <span>Payung Hukum & SOP Pengawasan Wasrik</span>
        </div>
        <h2 class="text-xl font-black text-gray-800 tracking-tight">
          Landasan Regulasi Hukum & Panduan Operasional Standar (SOP)
        </h2>
        <p class="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed">
          Pedoman formal pemeriksaan kepatuhan kepesertaan dan iuran JKN Badan Usaha berbasis Artificial Intelligence, terintegrasi dengan hukum ketenagakerjaan RI dan UU Pelindungan Data Pribadi (UU PDP No. 27/2022).
        </p>
      </div>

      <!-- Action Button to BAP Generator -->
      <RouterLink
        to="/bap-generator"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white text-xs font-bold shadow-[0_4px_12px_0_rgba(79,209,197,0.35)] transition-all shrink-0 self-start md:self-auto"
      >
        <FileText class="w-4 h-4" />
        Buka Auto-BAP Generator
      </RouterLink>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl w-fit">
      <button
        @click="activeTab = 'regulasi'"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition-all',
          activeTab === 'regulasi'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-500 hover:text-gray-800'
        ]"
      >
        ⚖️ Bagian I: Landasan Payung Hukum (5 Regulasi)
      </button>
      <button
        @click="activeTab = 'sop'"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition-all',
          activeTab === 'sop'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-500 hover:text-gray-800'
        ]"
      >
        📋 Bagian II: Alur SOP Wasrik 4 Tahap
      </button>
    </div>

    <!-- TAB 1: LANDASAN REGULASI & PAYUNG HUKUM -->
    <div v-if="activeTab === 'regulasi'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="reg in regulations"
          :key="reg.title"
          class="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shadow-sm">
                <component :is="reg.icon" class="w-5 h-5" />
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold border" :class="reg.badgeColor">
                {{ reg.badge }}
              </span>
            </div>

            <h3 class="text-sm font-bold text-gray-800 tracking-tight">{{ reg.title }}</h3>
            <p class="text-[11px] text-gray-400 font-medium mb-3">{{ reg.subtitle }}</p>

            <div class="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div>
                <span class="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Pasal / Ketentuan:</span>
                <p class="font-semibold text-gray-700">{{ reg.pasal }}</p>
              </div>

              <div>
                <span class="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Implikasi Sistem AI:</span>
                <p class="text-gray-600 leading-relaxed">{{ reg.implikasi }}</p>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100/80 bg-gray-50/50 p-2.5 rounded-xl text-[11px]">
            <span class="text-[10px] font-bold text-rose-600 block uppercase mb-0.5">Penetapan / Sanksi:</span>
            <p class="text-gray-700 leading-relaxed">{{ reg.sanksi }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: PANDUAN OPERASIONAL STANDAR (SOP) -->
    <div v-if="activeTab === 'sop'" class="space-y-6">
      <!-- 4 Stages Workflow Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div
          v-for="stage in sopStages"
          :key="stage.step"
          class="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 text-white font-black text-xs flex items-center justify-center shadow-teal">
                {{ stage.step }}
              </span>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tahap {{ stage.step }}</span>
            </div>

            <h3 class="text-xs font-bold text-gray-800 leading-snug mb-1.5">{{ stage.title }}</h3>
            <p class="text-[11px] text-gray-400 leading-relaxed mb-4">{{ stage.desc }}</p>

            <div class="space-y-2">
              <div
                v-for="(item, idx) in stage.items"
                :key="idx"
                class="p-2.5 rounded-xl border border-gray-100 text-[11px]"
                :class="item.color"
              >
                <p class="font-bold text-[11px] mb-0.5">{{ item.level }}</p>
                <p class="text-gray-600 text-[10px] leading-relaxed">{{ item.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Dynamic Evidence Checklist & Simulation -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <!-- Left: Evidence Checklist (7 Cols) -->
        <div class="lg:col-span-7 p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                <FileCheck2 class="w-4 h-4 text-teal-500" />
                Dynamic Evidence Checklist (Berkas Wajib Verifikasi)
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">Daftar dokumen wajib serah saat proses klarifikasi langsung.</p>
            </div>
          </div>

          <div class="space-y-2.5">
            <label
              v-for="item in checklist"
              :key="item.id"
              class="flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer"
              :class="item.checked ? 'bg-teal-50/50 border-teal-200' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-50'"
            >
              <input
                type="checkbox"
                v-model="item.checked"
                class="w-4 h-4 mt-0.5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
              />
              <div class="text-xs">
                <span :class="item.checked ? 'font-bold text-teal-900' : 'font-medium text-gray-700'">
                  {{ item.label }}
                </span>
              </div>
            </label>
          </div>
        </div>

        <!-- Right: SOP Summary Banner (5 Cols) -->
        <div class="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold mb-3 border border-teal-500/30">
              <Sparkles class="w-3.5 h-3.5" />
              <span>Standar Operasional Prosedur</span>
            </div>
            <h3 class="text-base font-bold text-white tracking-tight mb-2">Tenggat Waktu & Sanksi Kepatuhan</h3>
            <p class="text-xs text-slate-300 leading-relaxed mb-4">
              Apabila Badan Usaha terbukti melakukan <em>under-reporting</em> upah atau <em>under-coverage</em> tenaga kerja:
            </p>

            <ul class="text-xs text-slate-300 space-y-2">
              <li class="flex items-start gap-2">
                <CheckCircle2 class="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Penerbitan tagihan susulan iuran 5% (4% Pemberi Kerja + 1% Pekerja).</span>
              </li>
              <li class="flex items-start gap-2">
                <Clock class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Grace period perbaikan data maksimal <strong>14 hari kalender</strong> sejak BAP ditandatangani.</span>
              </li>
              <li class="flex items-start gap-2">
                <AlertTriangle class="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Eskalasi ke Dinas Tenaga Kerja & Kejaksaan Negeri jika tidak ada itikad baik perbaikan.</span>
              </li>
            </ul>
          </div>

          <div class="pt-5 border-t border-white/10 mt-5">
            <RouterLink
              to="/triage"
              class="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs text-center block shadow-md transition-colors"
            >
              Mulai Triase Kasus Lapangan
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
