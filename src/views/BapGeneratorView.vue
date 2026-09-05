<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useComplianceStore } from '@/stores/compliance';
import { FileText, Download, Printer, CheckCircle2, AlertCircle, Building2 } from 'lucide-vue-next';

const route = useRoute();
const store = useComplianceStore();

const selectedCompanyId = ref((route.query.company_id as string) || 'BU-0013');
const nomorSurat = ref('BAP-WASRIK/BPJS-JKN/2026/09/088');
const tanggalAudit = ref(new Date().toISOString().split('T')[0]);
const namaPemeriksa = ref('Hendra Wijaya, S.E., C.A.');
const nipPemeriksa = ref('19880415 201201 1 002');
const namaWakilBU = ref('Budi Santoso');
const jabatanWakilBU = ref('Direktur Utama / HRD');

onMounted(async () => {
  await store.fetchCompanyDetail(selectedCompanyId.value);
});

async function handleCompanyChange() {
  await store.fetchCompanyDetail(selectedCompanyId.value);
}

const company = computed(() => store.selectedCompany);

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
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FileText class="w-5 h-5 text-teal-500" />
          Auto-BAP Generator (Berita Acara Pemeriksaan Wasrik)
        </h2>
        <p class="text-xs text-gray-400 mt-1">
          Otomasi dokumen berita acara klarifikasi audit dan penetapan sanksi ketidakpatuhan iuran JKN berbasis temuan Machine Learning.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="handlePrint"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white text-xs font-bold shadow-[0_4px_12px_0_rgba(79,209,197,0.35)] transition-all"
        >
          <Printer class="w-4 h-4" /> Cetak / Unduh Dokumen (PDF)
        </button>
      </div>
    </div>

    <!-- Parameter Config Card -->
    <div class="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Pilih Badan Usaha Terperiksa</label>
        <input
          v-model="selectedCompanyId"
          @change="handleCompanyChange"
          type="text"
          placeholder="Contoh: BU-0013"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
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

    <!-- Document Paper Preview (A4 Printable Look) -->
    <div class="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl p-10 shadow-[0_20px_27px_0_rgba(0,0,0,0.08)] border border-gray-200 print:border-none print:shadow-none font-serif leading-relaxed text-sm">
      <!-- Kop Surat -->
      <div class="text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 class="text-lg font-bold tracking-wide uppercase text-slate-900">BPJS KESEHATAN REPUBLIK INDONESIA</h1>
        <h2 class="text-sm font-semibold tracking-wider uppercase text-slate-700">KEDEPUTAN BIDANG PENGAWASAN DAN PEMERIKSAAN (WASRIK)</h2>
        <p class="text-[11px] text-slate-600 mt-1">Jl. Letjen Suprapto Kav. 20 No. 14, Cempaka Putih, Jakarta Pusat 10510 | Telp: (021) 4212938</p>
      </div>

      <!-- Judul Dokumen -->
      <div class="text-center mb-6">
        <h3 class="text-base font-bold underline uppercase tracking-wide">BERITA ACARA PEMERIKSAAN KEPATUHAN BADAN USAHA</h3>
        <p class="text-xs text-slate-600 mt-1">Nomor: {{ nomorSurat }}</p>
      </div>

      <!-- Isi Pembuka -->
      <p class="mb-4 text-justify">
        Pada hari ini, tanggal <strong>{{ tanggalAudit }}</strong>, bertempat di Kantor Cabang BPJS Kesehatan, telah dilakukan klarifikasi dan pemeriksaan kepatuhan Program Jaminan Kesehatan Nasional (JKN) terhadap Badan Usaha dengan rincian sebagai berikut:
      </p>

      <!-- Identitas Entitas -->
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
          <span class="col-span-2 text-slate-800">{{ company.sektor_kbli }} / Skala {{ company.skala_usaha }}</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="text-slate-600">Total Tenaga Kerja Terdaftar e-Dabu:</span>
          <span class="col-span-2 font-bold text-slate-900">{{ company.total_workers_edabu }} Orang</span>
        </div>
      </div>

      <!-- Poin Temuan Audit AI -->
      <h4 class="font-bold text-slate-900 mb-2">I. TEMUAN ANALISIS RISIKO KEPATUHAN (AI AUDIT TRIAGE)</h4>
      <div class="space-y-2 mb-6 text-justify text-xs" v-if="company">
        <div class="p-3 bg-red-50 border-l-4 border-red-600 rounded">
          <p class="font-bold text-red-900">1. Indikasi Ketidakpatuhan Pelaporan Upah (Under-Reporting / Flat UMP)</p>
          <p class="text-red-800 mt-1">
            Ditemukan sebanyak <strong>{{ (company.pct_flat_ump * 100).toFixed(1) }}%</strong> pekerja (termasuk jabatan staf ahli/manajerial) dilaporkan tepat pada batas Upah Minimum Provinsi (UMP) <strong>{{ company.provinsi }}</strong> dengan nilai <em>Shannon Entropy</em> <strong>{{ company.shannon_entropy.toFixed(3) }}</strong>.
          </p>
        </div>

        <div v-if="company.headcount_deficit > 0" class="p-3 bg-amber-50 border-l-4 border-amber-600 rounded">
          <p class="font-bold text-amber-900">2. Indikasi Ketidakpatuhan Pendaftaran Pekerja (Under-Coverage)</p>
          <p class="text-amber-800 mt-1">
            Terdapat defisit sebanyak <strong>{{ company.headcount_deficit }} tenaga kerja aktif</strong> yang tercatat pada basis data Wajib Lapor Ketenagakerjaan (WLTK) namun belum didaftarkan sebagai peserta JKN e-Dabu.
          </p>
        </div>
      </div>

      <!-- Tindak Lanjut dan Bukti Wajib Bawa -->
      <h4 class="font-bold text-slate-900 mb-2">II. TINDAK LANJUT & DOKUMEN WAJIB SERAH</h4>
      <p class="text-xs mb-3 text-justify">
        Badan Usaha diwajibkan untuk menyampaikan dokumen bukti sah selambat-lambatnya <strong>7 (tujuh) hari kerja</strong> sejak Berita Acara ini diterbitkan:
      </p>
      <ul class="list-disc list-inside text-xs space-y-1 mb-8 text-slate-800">
        <li>Rekapitulasi Daftar Gaji / Slip Payroll Asli 3 (tiga) bulan terakhir.</li>
        <li>Bukti Setor & Pelaporan SPT PPh Pasal 21 Tahun Berjalan.</li>
        <li>Buku Induk Karyawan & Dokumen Wajib Lapor Ketenagakerjaan (WLTK) terbaru.</li>
        <li>Surat Perjanjian Kerja Waktu Tertentu (PKWT) / PKWTT seluruh karyawan aktif.</li>
      </ul>

      <!-- Tanda Tangan -->
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

