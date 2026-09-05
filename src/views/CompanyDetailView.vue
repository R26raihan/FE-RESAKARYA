<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useComplianceStore } from '@/stores/compliance';
import RiskBadge from '@/components/common/RiskBadge.vue';
import XAIExplainerCard from '@/components/common/XAIExplainerCard.vue';
import {
  Building2,
  MapPin,
  ArrowLeft,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
  Coins,
  Scale,
  BrainCircuit,
  Lock
} from 'lucide-vue-next';

const route = useRoute();
const store = useComplianceStore();
const companyId = route.params.id as string;

onMounted(async () => {
  if (companyId) {
    await store.fetchCompanyDetail(companyId);
  }
});

function formatRupiah(val?: number) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}
</script>

<template>
  <div class="space-y-6" v-if="store.selectedCompany">
    <!-- Breadcrumb & Back -->
    <div class="flex items-center justify-between">
      <RouterLink
        to="/triage"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" /> Kembali ke Antrean Triase
      </RouterLink>

      <RouterLink
        :to="`/bap-generator?company_id=${store.selectedCompany.company_id}`"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-white text-xs font-bold shadow-[0_4px_12px_0_rgba(79,209,197,0.35)] transition-all"
      >
        <FileText class="w-4 h-4" />
        Generate Draf Berita Acara (BAP)
      </RouterLink>
    </div>

    <!-- Company Header Card -->
    <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-[0_4px_12px_0_rgba(79,209,197,0.35)]">
          <Building2 class="w-7 h-7" />
        </div>
        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold text-gray-800 tracking-tight">{{ store.selectedCompany.company_id }}</h2>
            <RiskBadge :label-anomali="store.selectedCompany.label_anomali" />
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-400 mt-1 font-medium">
            <span class="flex items-center gap-1.5"><MapPin class="w-3.5 h-3.5 text-gray-400" /> {{ store.selectedCompany.provinsi }}</span>
            <span>• Sektor: <strong class="text-gray-700">{{ store.selectedCompany.sektor_kbli }}</strong></span>
            <span>• Skala: <strong class="text-gray-700">{{ store.selectedCompany.skala_usaha }}</strong></span>
          </div>
        </div>
      </div>

      <!-- Compliance Risk Score Badge -->
      <div class="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100 self-start md:self-auto">
        <div class="text-right">
          <p class="text-[10px] uppercase font-bold text-gray-400">Compliance Risk Score</p>
          <p class="text-lg font-bold" :class="store.selectedCompany.label_anomali === 1 ? 'text-rose-600' : 'text-teal-600'">
            {{ store.selectedCompany.label_anomali === 1 ? '88.5 / 100' : '14.2 / 100' }}
          </p>
        </div>
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
          :class="store.selectedCompany.label_anomali === 1 ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-teal-50 text-teal-600 border border-teal-200'"
        >
          {{ store.selectedCompany.label_anomali === 1 ? 'HIGH' : 'LOW' }}
        </div>
      </div>
    </div>

    <!-- Diagnostic Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)]">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pekerja Terdaftar e-Dabu</p>
        <p class="text-lg font-bold text-gray-800 mt-1">{{ store.selectedCompany.total_workers_edabu }} Orang</p>
        <p class="text-[11px] text-gray-400 mt-0.5">Total kepesertaan aktif di BPJS</p>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)]">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Defisit Pekerja (vs WLTK Kemnaker)</p>
        <p class="text-lg font-bold mt-1" :class="store.selectedCompany.headcount_deficit > 0 ? 'text-amber-600' : 'text-gray-700'">
          {{ store.selectedCompany.headcount_deficit > 0 ? `+${store.selectedCompany.headcount_deficit} Orang` : '0 (Lengkap)' }}
        </p>
        <p class="text-[11px] text-gray-400 mt-0.5">Indikasi under-coverage (pekerja belum terdaftar)</p>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)]">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rasio Flat UMP (Pas Batas UMP)</p>
        <p class="text-lg font-bold mt-1" :class="store.selectedCompany.pct_flat_ump >= 0.8 ? 'text-rose-600' : 'text-gray-700'">
          {{ (store.selectedCompany.pct_flat_ump * 100).toFixed(1) }}%
        </p>
        <p class="text-[11px] text-gray-400 mt-0.5">Karyawan bergaji tepat batas bawah UMP</p>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)]">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shannon Entropy (Keragaman Upah)</p>
        <p class="text-lg font-bold mt-1" :class="store.selectedCompany.shannon_entropy < 0.3 ? 'text-rose-600' : 'text-gray-700'">
          {{ store.selectedCompany.shannon_entropy.toFixed(3) }}
        </p>
        <p class="text-[11px] text-gray-400 mt-0.5">{{ store.selectedCompany.shannon_entropy < 0.3 ? 'Sangat Seragam (Anomali Fraud)' : 'Keragaman Upah Wajar' }}</p>
      </div>
    </div>

    <!-- XAI & RAG Root Cause Attribution -->
    <XAIExplainerCard :company-id="store.selectedCompany.company_id" />


    <!-- Micro Workers Table (Privacy / PII Masked) -->
    <div class="p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)]">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Users class="w-4 h-4 text-teal-500" />
            Data Mikro Tenaga Kerja Terdaftar (e-Dabu)
          </h3>
          <p class="text-xs text-gray-400 mt-0.5">Data disamarkan (PII - Personally Identifiable Information Masked) mematuhi UU PDP (Perlindungan Data Pribadi No. 27/2022).</p>
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-gray-100">
        <table class="w-full text-left text-xs">
          <thead class="text-[10px] uppercase font-bold text-gray-400 bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th class="py-2.5 px-3">WORKER ID</th>
              <th class="py-2.5 px-3">TINGKAT JABATAN (KBJI)</th>
              <th class="py-2.5 px-3">GAJI DILAPORKAN</th>
              <th class="py-2.5 px-3">ACUAN UMP 2026</th>
              <th class="py-2.5 px-3">ACUAN UPAH BPS</th>
              <th class="py-2.5 px-3 text-center">STATUS FLAT UMP</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="w in store.selectedCompany.workers"
              :key="w.worker_id"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="py-2.5 px-3 font-bold text-gray-800">{{ w.worker_id }}</td>
              <td class="py-2.5 px-3 font-medium text-gray-700">{{ w.jabatan }}</td>
              <td class="py-2.5 px-3 font-bold" :class="w.is_flat_ump ? 'text-rose-600' : 'text-teal-600'">
                {{ formatRupiah(w.gaji_lapor) }}
              </td>
              <td class="py-2.5 px-3 text-gray-500">{{ formatRupiah(w.ref_ump_2026) }}</td>
              <td class="py-2.5 px-3 text-gray-500">{{ formatRupiah(w.ref_upah_bps) }}</td>
              <td class="py-2.5 px-3 text-center">
                <span
                  v-if="w.is_flat_ump"
                  class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200"
                >
                  FLAT UMP
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-200"
                >
                  Wajar
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

