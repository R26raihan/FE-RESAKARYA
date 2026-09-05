<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useComplianceStore } from '@/stores/compliance';
import {
  FileText,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  Search,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Scale,
  ShieldAlert,
  Coins,
  Check,
  Info,
  Calendar,
  User,
  BadgeAlert,
} from 'lucide-vue-next';
import type { CompanySummary } from '@/types';

const route = useRoute();
const store = useComplianceStore();

const selectedCompanyId = ref((route.query.company_id as string) || 'BU-0013');
const nomorSurat = ref('BAP-WASRIK/BPJS-JKN/2026/09/088');
const tanggalAudit = ref(new Date().toISOString().split('T')[0]);
const namaPemeriksa = ref('Hendra Wijaya, S.E., C.A.');
const nipPemeriksa = ref('19880415 201201 1 002');
const namaWakilBU = ref('Budi Santoso');
const jabatanWakilBU = ref('Direktur Utama / HRD');

// Search & Dropdown State
const isDropdownOpen = ref(false);
const companySearchQuery = ref('');
const companyFilterMode = ref<'all' | 'anomaly' | 'normal'>('all');
const isRegeneratingAI = ref(false);
const customNotes = ref('');

onMounted(async () => {
  // 1. Ambil daftar companies (up to 100 entitas)
  if (store.companies.length < 20) {
    await store.fetchCompanies(1);
  }
  // 2. Load detail dan AI analysis untuk entitas terpilih
  await loadCompanyAndAI(selectedCompanyId.value);
});

async function loadCompanyAndAI(comp_id: string) {
  isRegeneratingAI.value = true;
  try {
    await store.fetchCompanyDetail(comp_id);
    await store.fetchCompanyXAI(comp_id);
  } catch (e) {
    console.error('Error loading company or XAI:', e);
  } finally {
    isRegeneratingAI.value = false;
  }
}

async function handleSelectCompany(comp: CompanySummary) {
  selectedCompanyId.value = comp.company_id;
  isDropdownOpen.value = false;
  companySearchQuery.value = '';
  await loadCompanyAndAI(comp.company_id);
}

async function handleRegenerateAI() {
  await loadCompanyAndAI(selectedCompanyId.value);
}

const company = computed(() => store.selectedCompany);
const xaiData = computed(() => store.selectedCompanyXAI);

// Filtered Companies for Dropdown
const filteredCompanies = computed(() => {
  let list = store.companies;
  if (companyFilterMode.value === 'anomaly') {
    list = list.filter((c) => c.label_anomali === 1);
  } else if (companyFilterMode.value === 'normal') {
    list = list.filter((c) => c.label_anomali === 0);
  }

  if (companySearchQuery.value.trim()) {
    const q = companySearchQuery.value.toLowerCase();
    list = list.filter(
      (c) =>
        c.company_id.toLowerCase().includes(q) ||
        c.provinsi.toLowerCase().includes(q) ||
        c.sektor_kbli.toLowerCase().includes(q)
    );
  }
  return list;
});

function formatRupiah(val?: number) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

function handlePrint() {
  window.print();
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Controls -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
      <div>
        <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FileText class="w-5 h-5 text-teal-500" />
          Auto-BAP Generator (Berita Acara Pemeriksaan Wasrik)
        </h2>
        <p class="text-xs text-gray-500 mt-1">
          Otomasi dokumen berita acara klarifikasi audit dan penetapan kepatuhan iuran JKN (Jaminan Kesehatan Nasional) dengan temuan terintegrasi Machine Learning & Explainable AI (SHAP).
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="handleRegenerateAI"
          :disabled="isRegeneratingAI"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          title="Hitung ulang temuan risiko berbasis AI & RAG"
        >
          <RefreshCw :class="['w-3.5 h-3.5', isRegeneratingAI ? 'animate-spin' : '']" />
          <span>{{ isRegeneratingAI ? 'Menganalisis AI...' : '⚡ Generate Temuan AI' }}</span>
        </button>

        <button
          @click="handlePrint"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-xs font-bold shadow-[0_4px_12px_0_rgba(79,209,197,0.35)] transition-all cursor-pointer"
        >
          <Printer class="w-4 h-4" /> Cetak / Unduh BAP Resmi (PDF)
        </button>
      </div>
    </div>

    <!-- Parameter Config Card -->
    <div class="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden relative z-30">
      
      <!-- Searchable Company Selector -->
      <div class="relative">
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
          Pilih Badan Usaha Terperiksa *
        </label>
        
        <div
          @click="isDropdownOpen = !isDropdownOpen"
          class="w-full bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div class="flex items-center gap-2 truncate">
            <Building2 class="w-4 h-4 text-teal-600 shrink-0" />
            <span class="font-bold text-gray-900">{{ selectedCompanyId }}</span>
            <span v-if="company" class="text-gray-500 truncate text-[11px]">({{ company.provinsi }})</span>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-400 shrink-0" />
        </div>

        <!-- Dropdown Popup -->
        <div
          v-if="isDropdownOpen"
          class="absolute left-0 top-full mt-1 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 z-50 space-y-2 max-h-96 flex flex-col"
        >
          <!-- Search input inside dropdown -->
          <div class="relative">
            <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              v-model="companySearchQuery"
              type="text"
              placeholder="Cari ID BU (BU-0013), Provinsi, Sektor..."
              class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              @click.stop
            />
          </div>

          <!-- Quick Filters -->
          <div class="flex items-center gap-1 text-[10px] font-bold pt-1 border-b border-gray-100 pb-2">
            <button
              @click.stop="companyFilterMode = 'all'"
              :class="['px-2 py-0.5 rounded-lg transition-colors cursor-pointer', companyFilterMode === 'all' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
            >
              Semua ({{ store.companies.length }})
            </button>
            <button
              @click.stop="companyFilterMode = 'anomaly'"
              :class="['px-2 py-0.5 rounded-lg transition-colors cursor-pointer', companyFilterMode === 'anomaly' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100']"
            >
              ⚠️ Anomali / High Risk
            </button>
            <button
              @click.stop="companyFilterMode = 'normal'"
              :class="['px-2 py-0.5 rounded-lg transition-colors cursor-pointer', companyFilterMode === 'normal' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100']"
            >
              ✓ Normal
            </button>
          </div>

          <!-- Company List -->
          <div class="overflow-y-auto space-y-1 flex-1 pr-1 custom-scrollbar max-h-64">
            <div
              v-for="c in filteredCompanies"
              :key="c.company_id"
              @click="handleSelectCompany(c)"
              :class="[
                'p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors',
                selectedCompanyId === c.company_id ? 'bg-teal-50 border border-teal-200' : 'hover:bg-gray-50'
              ]"
            >
              <div class="space-y-0.5">
                <div class="flex items-center gap-1.5 font-bold text-gray-900">
                  <span>{{ c.company_id }}</span>
                  <span
                    v-if="c.label_anomali === 1"
                    class="px-1.5 py-0.2 rounded text-[9px] bg-rose-100 text-rose-700 font-bold"
                  >
                    Anomali
                  </span>
                  <span
                    v-else
                    class="px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-700 font-bold"
                  >
                    Normal
                  </span>
                </div>
                <p class="text-[10px] text-gray-500">{{ c.sektor_kbli }} • {{ c.provinsi }}</p>
              </div>

              <Check v-if="selectedCompanyId === c.company_id" class="w-4 h-4 text-teal-600 shrink-0" />
            </div>

            <div v-if="filteredCompanies.length === 0" class="text-center py-4 text-xs text-gray-400">
              Tidak ada Badan Usaha yang cocok dengan pencarian.
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nomor Berita Acara (BAP)</label>
        <input
          v-model="nomorSurat"
          type="text"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
      </div>

      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nama Petugas Wasrik</label>
        <input
          v-model="namaPemeriksa"
          type="text"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
      </div>

      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Tanggal Pemeriksaan</label>
        <input
          v-model="tanggalAudit"
          type="date"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
      </div>
    </div>

    <!-- Document Paper Preview (A4 Printable Official Standard) -->
    <div class="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl p-10 shadow-[0_20px_27px_0_rgba(0,0,0,0.08)] border border-gray-200 print:border-none print:shadow-none font-serif leading-relaxed text-sm">
      
      <!-- Kop Surat Resmi BPJS Kesehatan -->
      <div class="text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 class="text-lg font-bold tracking-wide uppercase text-slate-900">BPJS KESEHATAN REPUBLIK INDONESIA</h1>
        <h2 class="text-sm font-semibold tracking-wider uppercase text-slate-700">KEDEPUTAN BIDANG PENGAWASAN DAN PEMERIKSAAN (WASRIK)</h2>
        <p class="text-[11px] text-slate-600 mt-1">Jl. Letjen Suprapto Kav. 20 No. 14, Cempaka Putih, Jakarta Pusat 10510 | Telp: (021) 4212938 | www.bpjs-kesehatan.go.id</p>
      </div>

      <!-- Judul Dokumen -->
      <div class="text-center mb-6">
        <h3 class="text-base font-bold underline uppercase tracking-wide">BERITA ACARA PEMERIKSAAN KEPATUHAN BADAN USAHA</h3>
        <p class="text-xs text-slate-600 mt-1 font-sans">Nomor: {{ nomorSurat }}</p>
      </div>

      <!-- Isi Pembuka -->
      <p class="mb-4 text-justify text-xs sm:text-sm">
        Pada hari ini, tanggal <strong>{{ tanggalAudit }}</strong>, bertempat di Kantor Cabang BPJS Kesehatan, telah dilakukan pemeriksaan kepatuhan Program Jaminan Kesehatan Nasional (JKN) terhadap Badan Usaha dengan rincian identitas sebagai berikut:
      </p>

      <!-- Identitas Entitas Terperiksa -->
      <div class="bg-slate-50 p-4 rounded-lg border border-slate-300 mb-6 font-sans text-xs space-y-1.5" v-if="company">
        <div class="grid grid-cols-3">
          <span class="text-slate-600">ID / Nama Badan Usaha:</span>
          <span class="col-span-2 font-bold text-slate-900">{{ company.company_id }}</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="text-slate-600">Wilayah Operasional:</span>
          <span class="col-span-2 font-semibold text-slate-800">{{ company.provinsi }}</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="text-slate-600">Sektor Usaha / Skala:</span>
          <span class="col-span-2 text-slate-800">{{ company.sektor_kbli }} (Skala {{ company.skala_usaha }})</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="text-slate-600">Tenaga Kerja Terdaftar e-Dabu:</span>
          <span class="col-span-2 font-bold text-slate-900">{{ company.total_workers_edabu }} Orang</span>
        </div>
      </div>

      <!-- I. TEMUAN ANALISIS RISIKO KEPATUHAN (AI AUDIT TRIAGE) -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold text-slate-900 text-sm">
            I. TEMUAN ANALISIS RISIKO KEPATUHAN (AI AUDIT TRIAGE)
          </h4>
          <span class="text-[10px] font-sans font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 print:hidden">
            🤖 REKSAKARYA AI Engine Grounded
          </span>
        </div>

        <p class="text-xs text-slate-600 mb-3 text-justify font-sans">
          Berdasarkan hasil analisis deteksi anomali multi-variabel (Dual-Model Machine Learning & SHAP Attribution), entitas <strong>{{ selectedCompanyId }}</strong> memperoleh <strong>Compliance Risk Score: {{ xaiData?.compliance_risk_score ?? (company?.label_anomali === 1 ? 88 : 15) }}/100</strong> dengan klasifikasi urgensi: <strong>{{ xaiData?.triage_urgency ?? (company?.label_anomali === 1 ? 'Prioritas Tinggi (Audit Khusus)' : 'Risiko Rendah (Pemeriksaan Rutin)') }}</strong>. Rincian temuan anomali kepatuhan terurai sebagai berikut:
        </p>

        <!-- Dynamic AI Anomaly Findings Cards -->
        <div class="space-y-3 font-sans text-xs" v-if="company">
          
          <!-- 1. Under-reporting Upah (Flat UMP) -->
          <div :class="['p-3.5 rounded-lg border-l-4 text-justify', company.pct_flat_ump > 0.3 ? 'bg-red-50/80 border-red-600 text-red-950' : 'bg-slate-50 border-teal-600 text-slate-900']">
            <p class="font-bold text-xs flex items-center justify-between">
              <span>1. Indikasi Ketidakpatuhan Pelaporan Upah (Under-Reporting / Flat UMP)</span>
              <span class="font-mono text-[11px] font-bold px-1.5 py-0.2 rounded bg-white border">
                {{ (company.pct_flat_ump * 100).toFixed(1) }}% Flat UMP
              </span>
            </p>
            <p class="mt-1 leading-relaxed text-[11px]">
              Ditemukan sebanyak <strong>{{ (company.pct_flat_ump * 100).toFixed(1) }}%</strong> pekerja dilaporkan tepat pada batas Upah Minimum Provinsi (UMP) di wilayah <strong>{{ company.provinsi }}</strong>. Rerata struktur upah menghasilkan skor <em>Shannon Entropy</em> <strong>{{ company.shannon_entropy.toFixed(3) }}</strong> (standar wajar: > 0.700), mengindikasikan adanya perataan gaji buatan (under-reporting) pada staf ahli dan manajerial.
            </p>
          </div>

          <!-- 2. Under-coverage (Defisit Headcount vs WLTK) -->
          <div :class="['p-3.5 rounded-lg border-l-4 text-justify', company.headcount_deficit > 0 ? 'bg-amber-50/80 border-amber-600 text-amber-950' : 'bg-slate-50 border-teal-600 text-slate-900']">
            <p class="font-bold text-xs flex items-center justify-between">
              <span>2. Indikasi Ketidakpatuhan Pendaftaran Tenaga Kerja (Under-Coverage vs WLTK Kemnaker)</span>
              <span class="font-mono text-[11px] font-bold px-1.5 py-0.2 rounded bg-white border">
                Defisit {{ company.headcount_deficit }} Pekerja
              </span>
            </p>
            <p class="mt-1 leading-relaxed text-[11px]">
              <template v-if="company.headcount_deficit > 0">
                Terdapat selisih sebanyak <strong>{{ company.headcount_deficit }} tenaga kerja aktif</strong> yang tercatat pada basis data resmi Wajib Lapor Ketenagakerjaan di Perusahaan (WLTK Kemnaker) namun belum didaftarkan ke dalam sistem kepesertaan e-Dabu BPJS Kesehatan.
              </template>
              <template v-else>
                Jumlah tenaga kerja terdaftar pada sistem e-Dabu BPJS Kesehatan telah sinkron dan sesuai dengan data Wajib Lapor Ketenagakerjaan (WLTK Kemnaker).
              </template>
            </p>
          </div>

          <!-- 3. Disparitas Upah Riil vs Tolok Ukur BPS -->
          <div class="p-3.5 rounded-lg border-l-4 bg-slate-50 border-slate-600 text-slate-900 text-justify">
            <p class="font-bold text-xs flex items-center justify-between">
              <span>3. Kesenjangan Rata-Rata Upah Lapor terhadap Tolok Ukur BPS (Wage Gap)</span>
              <span class="font-mono text-[11px] font-bold px-1.5 py-0.2 rounded bg-white border">
                {{ (company.wage_gap_ratio_bps * 100).toFixed(1) }}% Deviasi
              </span>
            </p>
            <p class="mt-1 leading-relaxed text-[11px]">
              Rata-rata gaji lapor pekerja sebesar <strong>{{ formatRupiah(company.mean_gaji_lapor) }}</strong> terpaut deviasi <strong>{{ (company.wage_gap_ratio_bps * 100).toFixed(1) }}%</strong> di bawah estimasi upah riil pasar daerah BPS pada sektor {{ company.sektor_kbli }}.
            </p>
          </div>

          <!-- 4. Estimasi Kebocoran Penerimaan Iuran (5% Revenue Leakage) -->
          <div class="p-3.5 rounded-lg bg-teal-50/60 border border-teal-200 text-teal-950 text-justify">
            <p class="font-bold text-xs flex items-center gap-1.5 text-teal-900">
              <Coins class="w-4 h-4 text-teal-700 shrink-0" />
              <span>4. Proyeksi Dampak Kebocoran Penerimaan Iuran JKN (5%)</span>
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[11px]">
              <div class="bg-white p-2.5 rounded-md border border-teal-100">
                <span class="text-slate-600 block">Estimasi Defisit Iuran Bulanan:</span>
                <span class="font-bold text-rose-700 font-mono text-xs">
                  {{ formatRupiah(xaiData?.estimated_monthly_leakage ?? (company.headcount_deficit * 250000 + 4500000)) }} / bulan
                </span>
              </div>
              <div class="bg-white p-2.5 rounded-md border border-teal-100">
                <span class="text-slate-600 block">Proyeksi Defisit Iuran Tahunan:</span>
                <span class="font-bold text-rose-700 font-mono text-xs">
                  {{ formatRupiah(xaiData?.estimated_annual_leakage ?? ((company.headcount_deficit * 250000 + 4500000) * 12)) }} / tahun
                </span>
              </div>
            </div>
          </div>

          <!-- 5. AI Narrative Summary -->
          <div v-if="xaiData?.ai_summary" class="p-3 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-700 italic">
            <strong>Ringkasan Simpulan AI:</strong> "{{ xaiData.ai_summary }}"
          </div>
        </div>
      </div>

      <!-- II. LANDASAN HUKUM & PASAL PELANGGARAN -->
      <h4 class="font-bold text-slate-900 mb-2">II. LANDASAN HUKUM & PASAL PELANGGARAN REGULASI</h4>
      <ol class="list-decimal list-inside text-xs space-y-1.5 mb-6 text-slate-800 text-justify leading-relaxed">
        <li>
          <strong>UU No. 24 Tahun 2011 Pasal 19 ayat (1) & (2)</strong>: Pemberi kerja wajib memungut dan membayar iuran yang menjadi tanggung jawabnya serta menyetorkan iuran pekerja kepada BPJS secara lengkap dan benar sesuai upah sebenarnya.
        </li>
        <li>
          <strong>PP No. 86 Tahun 2013 Pasal 5 & 8</strong>: Tata cara pengenaan sanksi administratif berupa teguran tertulis, denda, dan/atau penghentian pelayanan publik tertentu bagi pemberi kerja yang tidak patuh.
        </li>
        <li>
          <strong>Perpres No. 59 Tahun 2024 / PP No. 51 Tahun 2023</strong>: Besaran iuran JKN sebesar 5% dari total upah bulanan pekerja (4% ditanggung pemberi kerja, 1% dipotong dari pekerja).
        </li>
        <li>
          <strong>UU No. 27 Tahun 2022 (UU Perlindungan Data Pribadi)</strong>: Seluruh proses rekonsiliasi data dan pemanggilan audit mematuhi standar PII Masking pada identitas pekerja.
        </li>
      </ol>

      <!-- III. TINDAK LANJUT & DOKUMEN WAJIB SERAH -->
      <h4 class="font-bold text-slate-900 mb-2">III. TINDAK LANJUT & DOKUMEN WAJIB SERAH</h4>
      <p class="text-xs mb-3 text-justify">
        Badan Usaha diwajibkan untuk menyampaikan dokumen bukti sah kepada Petugas Wasrik BPJS Kesehatan selambat-lambatnya <strong>7 (tujuh) hari kerja</strong> sejak Berita Acara ini diterbitkan:
      </p>
      <ul class="list-disc list-inside text-xs space-y-1 mb-8 text-slate-800">
        <li>Rekapitulasi Daftar Gaji / Slip Payroll Asli 3 (tiga) bulan terakhir seluruh pekerja.</li>
        <li>Bukti Setor & Pelaporan SPT PPh Pasal 21 (Pajak Penghasilan Karyawan) Formulir 1721 Tahun Berjalan.</li>
        <li>Buku Induk Karyawan & Dokumen Wajib Lapor Ketenagakerjaan di Perusahaan (WLTK Kemnaker) terbaru.</li>
        <li>Bukti Rekening Koran Transfer Payroll Perbankan (Bank Payroll Statement).</li>
        <li>Surat Perjanjian Kerja Waktu Tertentu (PKWT) / PKWTT seluruh karyawan aktif.</li>
      </ul>

      <!-- Tanda Tangan Para Pihak -->
      <div class="grid grid-cols-2 gap-12 text-center text-xs mt-12 pt-6 border-t border-slate-300">
        <div>
          <p class="text-slate-600">Pihak Terperiksa / Wakil Badan Usaha,</p>
          <div class="h-16"></div>
          <p class="font-bold underline text-slate-900">{{ namaWakilBU }}</p>
          <p class="text-slate-500">{{ jabatanWakilBU }}</p>
        </div>
        <div>
          <p class="text-slate-600">Petugas Wasrik BPJS Kesehatan,</p>
          <div class="h-16"></div>
          <p class="font-bold underline text-slate-900">{{ namaPemeriksa }}</p>
          <p class="text-slate-500">NIP: {{ nipPemeriksa }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  body {
    background: white !important;
  }
}
</style>


