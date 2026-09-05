<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useComplianceStore } from '@/stores/compliance';
import { apiClient } from '@/api/client';
import * as XLSX from 'xlsx';
import {
  Building2,
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  RefreshCw,
  Info,
  Users,
  DollarSign,
  Printer,
  ChevronRight,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const compStore = useComplianceStore();

// Step indicator
const currentStep = ref<number>(1);

// Step 1: Profil Badan Usaha
const formProfile = ref({
  company_id: authStore.currentUser?.company_id || 'BU-0013',
  company_name: authStore.currentUser?.companyName || 'PT Nusantara Tech Solusindo',
  provinsi: authStore.currentUser?.companyProvinsi || 'DKI Jakarta',
  sektor_kbli: authStore.currentUser?.companySektor || 'J - Informasi & Komunikasi',
  skala_usaha: 'Menengah',
  wltk_headcount: 85,
});

// Step 2 & 3: File & Parsed Data
interface ParsedWorker {
  no?: number;
  nik: string;
  nama: string;
  jabatan: string;
  gaji_pokok: number;
  tunjangan_tetap: number;
  total_gaji: number;
  status_ump?: 'NORMAL' | 'FLAT_UMP' | 'BELOW_UMP';
}

const uploadedFileName = ref<string>('');
const parsedWorkers = ref<ParsedWorker[]>([]);
const isParsing = ref<boolean>(false);
const parseError = ref<string>('');
const isSubmitting = ref<boolean>(false);
const submissionReceipt = ref<any>(null);

// Dropdown Sektor Options
const sektorOptions = [
  'A - Pertanian, Kehutanan & Perikanan',
  'C - Industri Pengolahan',
  'D - Pengadaan Listrik & Gas',
  'F - Konstruksi',
  'G - Perdagangan Besar & Eceran',
  'H - Transportasi & Pergudangan',
  'I - Penyediaan Akomodasi & Makan Minum',
  'J - Informasi & Komunikasi',
  'K - Jasa Keuangan & Asuransi',
  'M - Jasa Profesional, Ilmiah & Teknis',
  'N - Jasa Persewaan & Ketenagakerjaan',
  'Q - Jasa Kesehatan & Kegiatan Sosial',
];

// Reference UMP from regional benchmark store
const currentUmp = computed(() => {
  const prov = formProfile.value.provinsi.toLowerCase();
  const match = compStore.regionalData.find(
    (r: any) => r.provinsi.toLowerCase() === prov
  );
  return match ? match.ump_2026 : 5250000;
});

// Summary stats of parsed workers
const stats = computed(() => {
  if (parsedWorkers.value.length === 0) {
    return {
      totalWorkers: 0,
      meanSalary: 0,
      flatUmpCount: 0,
      belowUmpCount: 0,
      headcountDeficit: formProfile.value.wltk_headcount,
    };
  }

  const total = parsedWorkers.value.length;
  const sum = parsedWorkers.value.reduce((acc, w) => acc + w.total_gaji, 0);
  const mean = total > 0 ? sum / total : 0;
  const ump = currentUmp.value;

  const flatCount = parsedWorkers.value.filter(
    (w) => Math.abs(w.total_gaji - ump) < 50000 || (w.total_gaji <= ump * 1.02 && w.total_gaji >= ump * 0.98)
  ).length;

  const belowCount = parsedWorkers.value.filter((w) => w.total_gaji < ump * 0.95).length;
  const deficit = Math.max(0, formProfile.value.wltk_headcount - total);

  return {
    totalWorkers: total,
    meanSalary: mean,
    flatUmpCount: flatCount,
    belowUmpCount: belowCount,
    headcountDeficit: deficit,
  };
});

onMounted(async () => {
  if (compStore.regionalData.length === 0) {
    await compStore.fetchRegionalUMP();
  }
});

// 1. Download Excel Template
function downloadExcelTemplate() {
  const headers = ['No', 'NIK_Karyawan', 'Nama_Karyawan', 'Jabatan', 'Gaji_Pokok_Lapor', 'Tunjangan_Tetap'];
  const sampleData = [
    [1, '3171012345670001', 'Budi Santoso', 'Manajer Operasional', 15000000, 2000000],
    [2, '3171012345670002', 'Siti Aminah', 'Staf Ahli IT', 12500000, 1500000],
    [3, '3171012345670003', 'Ahmad Fauzi', 'Supervisor Keuangan', 8500000, 1000000],
    [4, '3171012345670004', 'Dewi Sartika', 'Staf Administrasi', 5400000, 500000],
    [5, '3171012345670005', 'Rian Hidayat', 'Operator / Penunjang', 5250000, 0],
    [6, '3171012345670006', 'Hendra Wijaya', 'Staf IT Support', 7000000, 800000],
    [7, '3171012345670007', 'Nurul Hikmah', 'Staf HRD', 6500000, 500000],
    [8, '3171012345670008', 'Bambang Irawan', 'Satpam / Security', 5250000, 0],
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template_Payroll_eDabu');
  XLSX.writeFile(wb, 'Template_Payroll_REKSAKARYA_BPJS.xlsx');
}

// 2. Download CSV Template
function downloadCsvTemplate() {
  const csvContent =
    'No,NIK_Karyawan,Nama_Karyawan,Jabatan,Gaji_Pokok_Lapor,Tunjangan_Tetap\n' +
    '1,3171012345670001,Budi Santoso,Manajer Operasional,15000000,2000000\n' +
    '2,3171012345670002,Siti Aminah,Staf Ahli IT,12500000,1500000\n' +
    '3,3171012345670003,Ahmad Fauzi,Supervisor Keuangan,8500000,1000000\n' +
    '4,3171012345670004,Dewi Sartika,Staf Administrasi,5400000,500000\n' +
    '5,3171012345670005,Rian Hidayat,Operator / Penunjang,5250000,0\n';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Template_Payroll_REKSAKARYA_BPJS.csv');
  link.click();
}

// 3. Load Sample Demo Data
function loadDemoSample() {
  uploadedFileName.value = 'Demo_Payroll_NusantaraTech_Aug2026.xlsx';
  const sample: ParsedWorker[] = [
    { no: 1, nik: '3171012345670001', nama: 'Budi Santoso', jabatan: 'Direktur Utama', gaji_pokok: 25000000, tunjangan_tetap: 5000000, total_gaji: 30000000, status_ump: 'NORMAL' },
    { no: 2, nik: '3171012345670002', nama: 'Dimas Prabowo', jabatan: 'Manajer HRD', gaji_pokok: 16000000, tunjangan_tetap: 2000000, total_gaji: 18000000, status_ump: 'NORMAL' },
    { no: 3, nik: '3171012345670003', nama: 'Siti Aminah', jabatan: 'Lead Software Engineer', gaji_pokok: 18000000, tunjangan_tetap: 2000000, total_gaji: 20000000, status_ump: 'NORMAL' },
    { no: 4, nik: '3171012345670004', nama: 'Ahmad Fauzi', jabatan: 'Senior Data Scientist', gaji_pokok: 15000000, tunjangan_tetap: 1500000, total_gaji: 16500000, status_ump: 'NORMAL' },
    { no: 5, nik: '3171012345670005', nama: 'Dewi Sartika', jabatan: 'Staf Administrasi', gaji_pokok: 5500000, tunjangan_tetap: 500000, total_gaji: 6000000, status_ump: 'NORMAL' },
    { no: 6, nik: '3171012345670006', nama: 'Rian Hidayat', jabatan: 'UI/UX Designer', gaji_pokok: 10000000, tunjangan_tetap: 1000000, total_gaji: 11000000, status_ump: 'NORMAL' },
    { no: 7, nik: '3171012345670007', nama: 'Nurul Hikmah', jabatan: 'Staf Accounting', gaji_pokok: 6000000, tunjangan_tetap: 500000, total_gaji: 6500000, status_ump: 'NORMAL' },
    { no: 8, nik: '3171012345670008', nama: 'Bambang Irawan', jabatan: 'Security Staff', gaji_pokok: 5250000, tunjangan_tetap: 0, total_gaji: 5250000, status_ump: 'FLAT_UMP' },
    { no: 9, nik: '3171012345670009', nama: 'Agus Salim', jabatan: 'Office Boy / Cleaning', gaji_pokok: 5250000, tunjangan_tetap: 0, total_gaji: 5250000, status_ump: 'FLAT_UMP' },
    { no: 10, nik: '3171012345670010', nama: 'Farhan Maulana', jabatan: 'Technical Support', gaji_pokok: 6500000, tunjangan_tetap: 500000, total_gaji: 7000000, status_ump: 'NORMAL' },
  ];
  parsedWorkers.value = sample;
  currentStep.value = 3;
}

// 4. Handle File Upload (Drag & Drop or Input)
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  processFile(file);
}

function handleFileDrop(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length === 0) return;
  const file = event.dataTransfer.files[0];
  processFile(file);
}

function processFile(file: File) {
  uploadedFileName.value = file.name;
  isParsing.value = true;
  parseError.value = '';

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (json.length < 2) {
        throw new Error('File kosong atau tidak memiliki baris data.');
      }

      // Headers row 0
      const rows = json.slice(1);
      const workers: ParsedWorker[] = [];
      const ump = currentUmp.value;

      rows.forEach((row, index) => {
        if (!row || row.length === 0 || !row[1]) return;
        const nik = String(row[1] || `31710000${index + 1}`).trim();
        const nama = String(row[2] || `Karyawan ${index + 1}`).trim();
        const jabatan = String(row[3] || 'Staf').trim();
        const gajiPokok = Number(row[4]) || ump;
        const tunjangan = Number(row[5]) || 0;
        const total = gajiPokok + tunjangan;

        let status: 'NORMAL' | 'FLAT_UMP' | 'BELOW_UMP' = 'NORMAL';
        if (total < ump * 0.95) {
          status = 'BELOW_UMP';
        } else if (Math.abs(total - ump) < 50000 || total <= ump * 1.02) {
          status = 'FLAT_UMP';
        }

        workers.push({
          no: index + 1,
          nik,
          nama,
          jabatan,
          gaji_pokok: gajiPokok,
          tunjangan_tetap: tunjangan,
          total_gaji: total,
          status_ump: status,
        });
      });

      if (workers.length === 0) {
        throw new Error('Tidak ditemukan data karyawan yang valid di dalam file.');
      }

      parsedWorkers.value = workers;
      currentStep.value = 3;
    } catch (err: any) {
      parseError.value = `Gagal membaca file: ${err.message || 'Format tidak didukung'}`;
    } finally {
      isParsing.value = false;
    }
  };

  reader.readAsArrayBuffer(file);
}

const submissionHistory = ref<any[]>([]);
const isLoadingHistory = ref<boolean>(false);

async function fetchSubmissionHistory() {
  isLoadingHistory.value = true;
  try {
    const cId = formProfile.value.company_id || authStore.currentUser?.company_id || '';
    const res = await apiClient.get(`/submission/history?company_id=${encodeURIComponent(cId)}`);
    if (res.data && Array.isArray(res.data)) {
      submissionHistory.value = res.data;
    }
  } catch (e: any) {
    console.warn('[History] Gagal memuat riwayat:', e?.message);
  } finally {
    isLoadingHistory.value = false;
  }
}

onMounted(async () => {
  if (compStore.regionalData.length === 0) {
    await compStore.fetchRegionalUMP();
  }
  await fetchSubmissionHistory();
});

// 5. Submit to Backend
async function submitToBackend() {
  if (parsedWorkers.value.length === 0) return;
  isSubmitting.value = true;

  try {
    const payload = {
      company_id: formProfile.value.company_id,
      company_name: formProfile.value.company_name,
      user_id: authStore.currentUser?.id,
      user_email: authStore.currentUser?.email,
      file_name: uploadedFileName.value || 'Payroll_Upload_eDabu.xlsx',
      provinsi: formProfile.value.provinsi,
      sektor_kbli: formProfile.value.sektor_kbli,
      skala_usaha: formProfile.value.skala_usaha,
      wltk_headcount: formProfile.value.wltk_headcount,
      workers: parsedWorkers.value.map((w) => ({
        nik: w.nik,
        nama: w.nama,
        jabatan: w.jabatan,
        gaji_pokok: w.gaji_pokok,
        tunjangan_tetap: w.tunjangan_tetap,
      })),
    };

    const res = await apiClient.post('/submission/upload', payload);
    submissionReceipt.value = res.data.receipt;
    currentStep.value = 4;
    await fetchSubmissionHistory();
  } catch (err: any) {
    alert(`Terjadi kesalahan saat submit data: ${err?.response?.data?.detail || err.message}`);
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  currentStep.value = 1;
  parsedWorkers.value = [];
  uploadedFileName.value = '';
  submissionReceipt.value = null;
  fetchSubmissionHistory();
}

function printReceipt() {
  window.print();
}
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Header Banner -->
    <div class="p-6 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs text-teal-200 font-semibold mb-1">
            <Building2 class="w-4 h-4" />
            <span>Portal Mandiri Badan Usaha • Pelaporan e-Dabu JKN</span>
          </div>
          <h1 class="text-xl md:text-2xl font-extrabold tracking-tight">
            Input & Rekonsiliasi Upah Tenaga Kerja
          </h1>
          <p class="text-xs text-teal-100/90 mt-1 max-w-2xl leading-relaxed">
            Laporkan data gaji tenaga kerja Anda sesuai ketentuan UU BPJS Kesehatan & Perpres No. 82/2018. Data terlindungi kepatuhan UU PDP No. 27/2022 dengan enkripsi & masking otomatis.
          </p>
        </div>

        <!-- Role Badge -->
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 self-start md:self-auto">
          <div class="w-8 h-8 rounded-xl bg-teal-400 text-teal-950 flex items-center justify-center font-bold text-sm">
            🏢
          </div>
          <div>
            <p class="text-[10px] text-teal-200 font-medium">Badan Usaha Terdaftar</p>
            <p class="text-xs font-bold">{{ formProfile.company_name }}</p>
          </div>
        </div>
      </div>

      <!-- Step Indicator Bar -->
      <div class="mt-6 pt-4 border-t border-white/10 grid grid-cols-4 gap-2 text-center text-xs">
        <div
          :class="[
            'py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2',
            currentStep === 1 ? 'bg-white text-teal-900 shadow-md' : 'bg-white/10 text-teal-100'
          ]"
        >
          <span class="w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center font-bold">1</span>
          <span class="hidden sm:inline">Profil BU</span>
        </div>

        <div
          :class="[
            'py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2',
            currentStep === 2 ? 'bg-white text-teal-900 shadow-md' : 'bg-white/10 text-teal-100'
          ]"
        >
          <span class="w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center font-bold">2</span>
          <span class="hidden sm:inline">Unduh Template</span>
        </div>

        <div
          :class="[
            'py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2',
            currentStep === 3 ? 'bg-white text-teal-900 shadow-md' : 'bg-white/10 text-teal-100'
          ]"
        >
          <span class="w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center font-bold">3</span>
          <span class="hidden sm:inline">Upload & Validasi</span>
        </div>

        <div
          :class="[
            'py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2',
            currentStep === 4 ? 'bg-white text-teal-900 shadow-md' : 'bg-white/10 text-teal-100'
          ]"
        >
          <span class="w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center font-bold">4</span>
          <span class="hidden sm:inline">Tanda Terima</span>
        </div>
      </div>
    </div>

    <!-- STEP 1: Profil Badan Usaha -->
    <div v-if="currentStep === 1" class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
      <div class="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 class="text-base font-bold text-gray-800">Langkah 1: Konfirmasi Profil Badan Usaha</h2>
          <p class="text-xs text-gray-500">Pastikan wilayah operasional dan data headcount WLTK terisi dengan akurat.</p>
        </div>
        <button
          @click="loadDemoSample"
          type="button"
          class="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <span>⚡ Muat Data Demo Instan</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5">Nama Badan Usaha / Perusahaan</label>
          <input
            v-model="formProfile.company_name"
            type="text"
            required
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5">Provinsi Wilayah Kerja</label>
          <select
            v-model="formProfile.provinsi"
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option v-for="bench in compStore.regionalData" :key="bench.provinsi" :value="bench.provinsi">
              {{ bench.provinsi }} (UMP: Rp {{ bench.ump_2026.toLocaleString('id-ID') }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5">Sektor Industri (KBLI)</label>
          <select
            v-model="formProfile.sektor_kbli"
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option v-for="sek in sektorOptions" :key="sek" :value="sek">
              {{ sek }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5">Skala Usaha</label>
          <select
            v-model="formProfile.skala_usaha"
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="Kecil">Kecil (1 - 19 Karyawan)</option>
            <option value="Menengah">Menengah (20 - 99 Karyawan)</option>
            <option value="Besar">Besar (100+ Karyawan)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1.5">Jumlah Pekerja Riil Lapangan (WLTK)</label>
          <input
            v-model.number="formProfile.wltk_headcount"
            type="number"
            min="1"
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <p class="text-[10px] text-gray-400 mt-1">Sesuai laporan Wajib Lapor Ketenagakerjaan di Perusahaan (WLTK Kemnaker).</p>
        </div>

        <div class="bg-teal-50/70 border border-teal-100 rounded-2xl p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0">
            <DollarSign class="w-5 h-5" />
          </div>
          <div>
            <p class="text-[10px] text-teal-700 font-bold uppercase tracking-wider">Acuan UMP 2026 Wilayah Terpilih</p>
            <p class="text-sm font-extrabold text-teal-900">
              Rp {{ currentUmp.toLocaleString('id-ID') }}
            </p>
            <p class="text-[10px] text-teal-700 mt-0.5">Batas bawah gaji pelaporan e-Dabu regional.</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t border-gray-100">
        <button
          @click="currentStep = 2"
          class="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 cursor-pointer transition-all"
        >
          <span>Lanjutkan ke Unduh Template</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- STEP 2: Unduh Template Excel & CSV -->
    <div v-if="currentStep === 2" class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
      <div class="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 class="text-base font-bold text-gray-800">Langkah 2: Unduh Template Format Resmi</h2>
          <p class="text-xs text-gray-500">Gunakan file template terstandarisasi untuk mengisi data seluruh tenaga kerja.</p>
        </div>
        <button @click="currentStep = 1" class="text-xs font-semibold text-gray-500 hover:text-gray-800">
          ← Kembali ke Profil
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Excel Card -->
        <div class="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <FileSpreadsheet class="w-5 h-5" />
            </div>
            <h3 class="text-sm font-bold text-emerald-950">Template Excel Spreadsheet (.xlsx)</h3>
            <p class="text-xs text-emerald-800/80 leading-relaxed">
              Format standar Microsoft Excel yang sudah dilengkapi contoh data, format angka mata uang, dan struktur kolom yang kompatibel.
            </p>
          </div>

          <button
            @click="downloadExcelTemplate"
            class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Download class="w-4 h-4" />
            <span>Unduh Template Excel (.xlsx)</span>
          </button>
        </div>

        <!-- CSV Card -->
        <div class="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-md">
              <FileCheck2 class="w-5 h-5" />
            </div>
            <h3 class="text-sm font-bold text-slate-900">Template CSV Delimited (.csv)</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Format teks ringan untuk ekspor otomatis dari sistem Payroll / HRIS internal perusahaan (SAP, Talenta, Mekari, Workday).
            </p>
          </div>

          <button
            @click="downloadCsvTemplate"
            class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Download class="w-4 h-4" />
            <span>Unduh Template CSV (.csv)</span>
          </button>
        </div>
      </div>

      <!-- Format Guidance Table -->
      <div class="bg-gray-50 rounded-2xl p-5 border border-gray-200/80 space-y-3">
        <h4 class="text-xs font-bold text-gray-800 flex items-center gap-2">
          <Info class="w-4 h-4 text-teal-600" />
          <span>Petunjuk Struktur Kolom File Payroll</span>
        </h4>
        <div class="overflow-x-auto text-xs">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[11px] font-bold text-gray-500 uppercase border-b border-gray-200">
                <th class="py-2 px-3">Nama Kolom</th>
                <th class="py-2 px-3">Kewajiban</th>
                <th class="py-2 px-3">Tipe Data</th>
                <th class="py-2 px-3">Contoh Nilai</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 text-gray-700">
              <tr>
                <td class="py-2 px-3 font-mono font-bold text-teal-700">NIK_Karyawan</td>
                <td class="py-2 px-3"><span class="text-rose-600 font-semibold">Wajib</span></td>
                <td class="py-2 px-3">16 Digit Teks</td>
                <td class="py-2 px-3 font-mono">3171012345670001</td>
              </tr>
              <tr>
                <td class="py-2 px-3 font-mono font-bold text-teal-700">Nama_Karyawan</td>
                <td class="py-2 px-3"><span class="text-rose-600 font-semibold">Wajib</span></td>
                <td class="py-2 px-3">Teks Nama</td>
                <td class="py-2 px-3">Budi Santoso</td>
              </tr>
              <tr>
                <td class="py-2 px-3 font-mono font-bold text-teal-700">Jabatan</td>
                <td class="py-2 px-3"><span class="text-rose-600 font-semibold">Wajib</span></td>
                <td class="py-2 px-3">Teks Jabatan</td>
                <td class="py-2 px-3">Manajer / Staf Ahli / Operator</td>
              </tr>
              <tr>
                <td class="py-2 px-3 font-mono font-bold text-teal-700">Gaji_Pokok_Lapor</td>
                <td class="py-2 px-3"><span class="text-rose-600 font-semibold">Wajib</span></td>
                <td class="py-2 px-3">Angka (Rupiah)</td>
                <td class="py-2 px-3 font-mono">15.000.000</td>
              </tr>
              <tr>
                <td class="py-2 px-3 font-mono font-bold text-teal-700">Tunjangan_Tetap</td>
                <td class="py-2 px-3"><span class="text-gray-500">Opsional</span></td>
                <td class="py-2 px-3">Angka (Rupiah)</td>
                <td class="py-2 px-3 font-mono">2.000.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-between pt-4 border-t border-gray-100">
        <button
          @click="loadDemoSample"
          class="text-xs font-bold text-teal-700 hover:underline"
        >
          Gunakan Data Demo Bawaan Saja
        </button>
        <button
          @click="currentStep = 3"
          class="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 cursor-pointer transition-all"
        >
          <span>Lanjutkan ke Upload File</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- STEP 3: Upload & Pre-flight Table Preview -->
    <div v-if="currentStep === 3" class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
      <div class="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 class="text-base font-bold text-gray-800">Langkah 3: Unggah & Validasi Pre-Flight</h2>
          <p class="text-xs text-gray-500">Unggah file Excel/CSV yang sudah diisi untuk pemeriksaan skema otomatis.</p>
        </div>
        <button @click="currentStep = 2" class="text-xs font-semibold text-gray-500 hover:text-gray-800">
          ← Kembali ke Unduh Template
        </button>
      </div>

      <!-- Drag & Drop Upload Zone -->
      <div
        @dragover.prevent
        @drop="handleFileDrop"
        class="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/40 rounded-3xl p-8 text-center transition-all cursor-pointer relative"
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          @change="handleFileUpload"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div class="flex flex-col items-center justify-center space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md">
            <UploadCloud class="w-7 h-7" />
          </div>
          <div>
            <p class="text-sm font-bold text-gray-800">
              Drag & Drop File Payroll di Sini, atau <span class="text-teal-600 underline">Pilih Berkas</span>
            </p>
            <p class="text-xs text-gray-500 mt-1">Mendukung format .xlsx, .xls, dan .csv (Maks. 10.000 Karyawan / 25MB)</p>
          </div>
          <div v-if="uploadedFileName" class="px-3 py-1.5 rounded-xl bg-teal-100/80 text-teal-800 text-xs font-bold flex items-center gap-2">
            <FileSpreadsheet class="w-4 h-4 text-teal-600" />
            <span>File Terpilih: {{ uploadedFileName }}</span>
          </div>
        </div>
      </div>

      <!-- Parsing Status / Error -->
      <div v-if="parseError" class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
        <AlertTriangle class="w-4 h-4 shrink-0" />
        <span>{{ parseError }}</span>
      </div>

      <!-- Parsed Data Summary KPI Cards -->
      <div v-if="parsedWorkers.length > 0" class="space-y-4">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <p class="text-[10px] text-gray-500 font-bold uppercase">Total Pekerja Lapor</p>
            <p class="text-lg font-extrabold text-gray-900 mt-1">{{ stats.totalWorkers }} Jiwa</p>
            <p class="text-[10px] text-gray-400">Dari {{ formProfile.wltk_headcount }} WLTK</p>
          </div>

          <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <p class="text-[10px] text-gray-500 font-bold uppercase">Rata-rata Gaji Lapor</p>
            <p class="text-lg font-extrabold text-teal-600 mt-1">Rp {{ Math.round(stats.meanSalary).toLocaleString('id-ID') }}</p>
            <p class="text-[10px] text-gray-400">Termasuk tunjangan</p>
          </div>

          <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <p class="text-[10px] text-amber-800 font-bold uppercase">Gaji Flat UMP</p>
            <p class="text-lg font-extrabold text-amber-900 mt-1">{{ stats.flatUmpCount }} Orang</p>
            <p class="text-[10px] text-amber-700">{{ Math.round((stats.flatUmpCount / stats.totalWorkers) * 100) }}% dari total</p>
          </div>

          <div class="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
            <p class="text-[10px] text-rose-800 font-bold uppercase">Defisit Headcount</p>
            <p class="text-lg font-extrabold text-rose-900 mt-1">{{ stats.headcountDeficit }} Jiwa</p>
            <p class="text-[10px] text-rose-700">WLTK vs Lapor</p>
          </div>
        </div>

        <!-- Pre-Flight Table Preview -->
        <div class="border border-gray-200 rounded-2xl overflow-hidden">
          <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-xs font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck class="w-4 h-4 text-teal-600" />
              <span>Preview Data Payroll (10 Baris Pertama) • PII Safe Masking Aktif</span>
            </h3>
            <span class="text-[11px] text-gray-500">{{ parsedWorkers.length }} baris data siap sinkronisasi</span>
          </div>

          <div class="overflow-x-auto max-h-72">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-gray-100/80 sticky top-0 text-[10px] uppercase font-bold text-gray-600">
                <tr>
                  <th class="py-2 px-3">No</th>
                  <th class="py-2 px-3">NIK (Masked)</th>
                  <th class="py-2 px-3">Nama Pekerja</th>
                  <th class="py-2 px-3">Jabatan</th>
                  <th class="py-2 px-3">Gaji Pokok</th>
                  <th class="py-2 px-3">Tunjangan</th>
                  <th class="py-2 px-3">Total Gaji</th>
                  <th class="py-2 px-3">Status UMP</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-gray-700">
                <tr v-for="w in parsedWorkers.slice(0, 10)" :key="w.no" class="hover:bg-gray-50">
                  <td class="py-2 px-3 font-mono text-gray-500">{{ w.no }}</td>
                  <td class="py-2 px-3 font-mono text-gray-600">{{ w.nik.slice(0, 4) }}********{{ w.nik.slice(-4) }}</td>
                  <td class="py-2 px-3 font-medium">{{ w.nama }}</td>
                  <td class="py-2 px-3">{{ w.jabatan }}</td>
                  <td class="py-2 px-3 font-mono">Rp {{ w.gaji_pokok.toLocaleString('id-ID') }}</td>
                  <td class="py-2 px-3 font-mono">Rp {{ w.tunjangan_tetap.toLocaleString('id-ID') }}</td>
                  <td class="py-2 px-3 font-mono font-bold text-teal-700">Rp {{ w.total_gaji.toLocaleString('id-ID') }}</td>
                  <td class="py-2 px-3">
                    <span
                      v-if="w.status_ump === 'FLAT_UMP'"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800"
                    >
                      Flat UMP
                    </span>
                    <span
                      v-else-if="w.status_ump === 'BELOW_UMP'"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800"
                    >
                      Di bawah UMP
                    </span>
                    <span
                      v-else
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800"
                    >
                      Wajar / Sesuai
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <p class="text-xs text-gray-500 flex items-center gap-1.5">
            <ShieldCheck class="w-4 h-4 text-teal-600" />
            <span>Mematuhi UU PDP No. 27/2022 (Data tersimpan dengan enkripsi & masking)</span>
          </p>

          <button
            @click="submitToBackend"
            :disabled="isSubmitting"
            class="py-3 px-8 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
          >
            <RefreshCw v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <span v-if="isSubmitting">Mengirim & Menjalankan Validasi AI...</span>
            <template v-else>
              <span>Kirim & Sinkronisasikan e-Dabu</span>
              <ChevronRight class="w-4 h-4" />
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- STEP 4: Tanda Terima Elektronik (Receipt) -->
    <div v-if="currentStep === 4 && submissionReceipt" class="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-xl space-y-6 max-w-4xl mx-auto">
      <!-- Success Icon -->
      <div class="text-center space-y-2">
        <div class="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
          <CheckCircle2 class="w-8 h-8" />
        </div>
        <h2 class="text-xl font-extrabold text-gray-900">Pelaporan e-Dabu Berhasil Diterima!</h2>
        <p class="text-xs text-gray-500">Data telah disinkronisasikan ke sistem analitik REKSAKARYA BPJS Kesehatan.</p>
      </div>

      <!-- Formal Receipt Card (Printable) -->
      <div class="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <div>
              <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                SURAT TANDA TERIMA PELAPORAN ELEKTRONIK (e-DABU)
              </h3>
              <p class="text-[10px] text-slate-500">BPJS Kesehatan RI • REKSAKARYA AI Compliance Engine</p>
            </div>
          </div>
          <div class="text-right">
            <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">
              STATUS: TERVERIFIKASI
            </span>
          </div>
        </div>

        <!-- Receipt Details Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <p class="text-[10px] text-slate-400 font-bold uppercase">Nomor Registrasi</p>
            <p class="font-mono font-bold text-slate-800 mt-0.5">{{ submissionReceipt.registration_number }}</p>
          </div>

          <div>
            <p class="text-[10px] text-slate-400 font-bold uppercase">ID Badan Usaha</p>
            <p class="font-mono font-bold text-teal-700 mt-0.5">{{ submissionReceipt.company_id }}</p>
          </div>

          <div>
            <p class="text-[10px] text-slate-400 font-bold uppercase">Waktu Submit</p>
            <p class="font-medium text-slate-700 mt-0.5">{{ submissionReceipt.submitted_at }}</p>
          </div>

          <div>
            <p class="text-[10px] text-slate-400 font-bold uppercase">Nama Badan Usaha</p>
            <p class="font-bold text-slate-800 mt-0.5">{{ submissionReceipt.company_name }}</p>
          </div>

          <div>
            <p class="text-[10px] text-slate-400 font-bold uppercase">Provinsi / Wilayah</p>
            <p class="font-medium text-slate-700 mt-0.5">{{ submissionReceipt.provinsi }}</p>
          </div>

          <div>
            <p class="text-[10px] text-slate-400 font-bold uppercase">Sektor Usaha KBLI</p>
            <p class="font-medium text-slate-700 mt-0.5">{{ submissionReceipt.sektor_kbli }}</p>
          </div>

          <div>
            <p class="text-[10px] text-slate-400 font-bold uppercase">Pekerja Dilaporkan</p>
            <p class="font-bold text-slate-800 mt-0.5">{{ submissionReceipt.total_workers_reported }} Orang</p>
          </div>

          <div>
            <p class="text-[10px] text-slate-400 font-bold uppercase">Headcount WLTK Riil</p>
            <p class="font-medium text-slate-700 mt-0.5">{{ submissionReceipt.wltk_headcount }} Orang</p>
          </div>

          <div>
            <p class="text-[10px] text-slate-400 font-bold uppercase">Acuan UMP 2026</p>
            <p class="font-mono font-medium text-slate-700 mt-0.5">Rp {{ submissionReceipt.ref_ump_regional?.toLocaleString('id-ID') }}</p>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Kepatuhan UU PDP: {{ submissionReceipt.pii_compliance }}</span>
          <span class="font-mono text-[10px]">REKSAKARYA-DIGITAL-SIGNATURE-OK</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          @click="printReceipt"
          class="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Printer class="w-4 h-4" />
          <span>Cetak Bukti Tanda Terima</span>
        </button>

        <button
          @click="resetForm"
          class="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RefreshCw class="w-4 h-4" />
          <span>Input / Submit Data Lainnya</span>
        </button>
      </div>
    </div>

    <!-- Riwayat Pelaporan Audit Trail Section -->
    <div class="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
            <FileSpreadsheet class="w-4 h-4 text-teal-600" />
            <span>Riwayat Pelaporan Payroll Badan Usaha (Audit Trail Terverifikasi)</span>
          </h3>
          <p class="text-[11px] text-gray-500">Daftar laporan e-Dabu yang berhasil dikirim dan diverifikasi sistem REKSAKARYA BPJS Kesehatan.</p>
        </div>
        <button
          @click="fetchSubmissionHistory"
          :disabled="isLoadingHistory"
          class="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw :class="['w-3.5 h-3.5', isLoadingHistory ? 'animate-spin text-teal-600' : '']" />
          <span>Segarkan</span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="submissionHistory.length === 0" class="p-8 text-center text-xs text-gray-400">
        Belum ada riwayat pelaporan payroll dari Badan Usaha ini. Silakan lakukan upload data melalui form di atas.
      </div>

      <!-- Table History -->
      <div v-else class="overflow-x-auto border border-gray-100 rounded-2xl">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100">
            <tr>
              <th class="py-2.5 px-3">Nomor Registrasi</th>
              <th class="py-2.5 px-3">Badan Usaha</th>
              <th class="py-2.5 px-3">Nama Berkas</th>
              <th class="py-2.5 px-3">Waktu Pelaporan</th>
              <th class="py-2.5 px-3">Jumlah Pekerja</th>
              <th class="py-2.5 px-3">Rata-rata Gaji</th>
              <th class="py-2.5 px-3">Defisit WLTK</th>
              <th class="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-gray-700">
            <tr v-for="item in submissionHistory" :key="item.id" class="hover:bg-gray-50/80">
              <td class="py-2.5 px-3 font-mono font-bold text-teal-700">{{ item.id }}</td>
              <td class="py-2.5 px-3 font-medium">
                <div>{{ item.company_name }}</div>
                <div class="text-[10px] text-gray-400 font-mono">{{ item.company_id }}</div>
              </td>
              <td class="py-2.5 px-3 font-mono text-[11px] text-gray-600">{{ item.file_name || 'Payroll.xlsx' }}</td>
              <td class="py-2.5 px-3 text-[11px] text-gray-500">{{ item.submitted_at }}</td>
              <td class="py-2.5 px-3 font-bold">{{ item.total_workers_reported }} Orang</td>
              <td class="py-2.5 px-3 font-mono">Rp {{ Math.round(item.mean_gaji_lapor || 0).toLocaleString('id-ID') }}</td>
              <td class="py-2.5 px-3 font-mono">
                <span v-if="item.headcount_deficit > 0" class="text-rose-600 font-bold">-{{ item.headcount_deficit }} Jiwa</span>
                <span v-else class="text-emerald-600">Sesuai (0)</span>
              </td>
              <td class="py-2.5 px-3">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
