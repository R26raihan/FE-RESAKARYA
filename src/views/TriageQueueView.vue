<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useComplianceStore } from '@/stores/compliance';
import RiskBadge from '@/components/common/RiskBadge.vue';
import {
  ShieldAlert,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
  AlertTriangle,
  Clock,
  Coins,
  ArrowRight,
  Sparkles
} from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const store = useComplianceStore();

onMounted(async () => {
  store.filterLabelAnomali = 1; // Khusus antrean anomali untuk audit Wasrik
  await store.fetchCompanies(1);
});

function handleFilterChange() {
  store.fetchCompanies(1);
}

function formatRupiah(val?: number) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

function calculateEstimatedLeakage(company: any) {
  // Estimasi kebocoran iuran 5% per bulan akibat under-reporting & headcount deficit
  const wageGap = Math.max(0, 5850000 - company.mean_gaji_lapor);
  const underReportLeakage = company.total_workers_edabu * wageGap * 0.05;
  const underCoverageLeakage = company.headcount_deficit * 5850000 * 0.05;
  return underReportLeakage + underCoverageLeakage;
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-1.5 border border-rose-200">
          <ShieldAlert class="w-3.5 h-3.5" />
          <span>Antrean Prioritas Audit Wasrik BPJS</span>
        </div>
        <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          Antrean Triase Risiko Kepatuhan (Risk Triage Queue)
        </h2>
        <p class="text-xs text-gray-400 mt-0.5">
          Pemeringkatan otomatis badan usaha berisiko tinggi (*High Risk Anomaly*) hasil deteksi *Isolation Forest & Deep Autoencoder* yang memerlukan klarifikasi lapangan.
        </p>
      </div>

      <!-- Action Refresh -->
      <button
        @click="store.fetchCompanies(store.currentPage)"
        class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors border border-gray-200 shadow-sm self-start md:self-auto"
      >
        <RefreshCw class="w-3.5 h-3.5 text-teal-600" :class="{ 'animate-spin': store.isLoading }" />
        Segarkan Antrean
      </button>
    </div>

    <!-- Triage KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Antrean High Risk</p>
          <h3 class="text-lg font-bold text-rose-600 mt-0.5">300 Entitas</h3>
          <p class="text-[10px] text-gray-400 font-medium mt-0.5">15% dari Total Populasi</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
          <ShieldAlert class="w-5 h-5" />
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Modus Flat UMP Ekstrem</p>
          <h3 class="text-lg font-bold text-gray-800 mt-0.5">245 Entitas (81%)</h3>
          <p class="text-[10px] text-rose-500 font-medium mt-0.5">Shannon Entropy &lt; 0.3</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <AlertTriangle class="w-5 h-5" />
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Potensi Iuran Tertagih</p>
          <h3 class="text-lg font-bold text-teal-600 mt-0.5">Rp 4,35 Miliar / bln</h3>
          <p class="text-[10px] text-teal-600 font-medium mt-0.5">Kekurangan Bayar 5%</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
          <Coins class="w-5 h-5" />
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SOP Audit Lapangan</p>
          <h3 class="text-lg font-bold text-gray-800 mt-0.5">Maks. 7 Hari Kerja</h3>
          <p class="text-[10px] text-gray-400 font-medium mt-0.5">Klarifikasi & BAP</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Clock class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Filters Row Card -->
    <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <!-- Search -->
      <div class="relative">
        <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="store.searchQuery"
          @keyup.enter="handleFilterChange"
          type="text"
          placeholder="Cari ID BU (BU-0013)..."
          class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
      </div>

      <!-- Sektor Filter -->
      <select
        v-model="store.filterSektor"
        @change="handleFilterChange"
        class="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
      >
        <option value="">Semua Sektor KBLI</option>
        <option value="Manufaktur">Manufaktur</option>
        <option value="Jasa Keuangan">Jasa Keuangan</option>
        <option value="Retail">Retail</option>
        <option value="Perkebunan">Perkebunan</option>
        <option value="Konstruksi">Konstruksi</option>
      </select>

      <!-- Skala Filter -->
      <select
        v-model="store.filterSkala"
        @change="handleFilterChange"
        class="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
      >
        <option value="">Semua Skala Usaha</option>
        <option value="Kecil">Kecil</option>
        <option value="Menengah">Menengah</option>
        <option value="Besar">Besar</option>
      </select>

      <!-- Urgensi Filter -->
      <select
        class="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
      >
        <option value="">Semua Tingkat Urgensi</option>
        <option value="urgent">🔴 Prioritas Sangat Tinggi (Flat UMP &gt; 80%)</option>
        <option value="moderate">🟡 Prioritas Sedang</option>
      </select>

      <!-- Button Reset -->
      <button
        @click="
          store.filterProvinsi = '';
          store.filterSektor = '';
          store.filterSkala = '';
          store.filterLabelAnomali = 1;
          store.searchQuery = '';
          handleFilterChange();
        "
        class="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
      >
        Reset Filter
      </button>
    </div>

    <!-- Triage Table Card -->
    <div class="rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 bg-gray-50/50">
            <tr>
              <th class="py-3 px-4">BADAN USAHA</th>
              <th class="py-3 px-4">PROVINSI & SEKTOR</th>
              <th class="py-3 px-4">RASIO FLAT UMP</th>
              <th class="py-3 px-4">DEFISIT PEKERJA</th>
              <th class="py-3 px-4">SHANNON ENTROPY</th>
              <th class="py-3 px-4">ESTIMASI KEBOCORAN (5%)</th>
              <th class="py-3 px-4">URGENSI AUDIT</th>
              <th class="py-3 px-4 text-center">AKSI WASRIK</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="c in store.companies"
              :key="c.company_id"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                    <ShieldAlert class="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span class="font-bold text-gray-800 block">{{ c.company_id }}</span>
                    <span class="text-[10px] text-gray-400">{{ c.skala_usaha }} • {{ c.total_workers_edabu }} Pekerja</span>
                  </div>
                </div>
              </td>

              <td class="py-3 px-4">
                <span class="font-medium text-gray-800 block">{{ c.provinsi }}</span>
                <span class="text-[10px] text-gray-400">{{ c.sektor_kbli }}</span>
              </td>

              <td class="py-3 px-4">
                <div class="flex items-baseline gap-1.5">
                  <span class="font-bold text-rose-600">{{ (c.pct_flat_ump * 100).toFixed(1) }}%</span>
                  <span class="text-[10px] text-gray-400">Flat UMP</span>
                </div>
              </td>

              <td class="py-3 px-4">
                <span class="font-bold" :class="c.headcount_deficit > 0 ? 'text-amber-600' : 'text-gray-400'">
                  {{ c.headcount_deficit > 0 ? `+${c.headcount_deficit} Org` : '0 (Lengkap)' }}
                </span>
              </td>

              <td class="py-3 px-4">
                <span class="font-semibold" :class="c.shannon_entropy < 0.3 ? 'text-rose-600 font-bold' : 'text-gray-700'">
                  {{ c.shannon_entropy.toFixed(3) }}
                </span>
                <span class="text-[10px] text-gray-400 block">{{ c.shannon_entropy < 0.3 ? 'Sangat Seragam' : 'Cukup Variatif' }}</span>
              </td>

              <td class="py-3 px-4 font-bold text-teal-600">
                {{ formatRupiah(calculateEstimatedLeakage(c)) }} / bln
              </td>

              <td class="py-3 px-4">
                <span
                  v-if="c.pct_flat_ump >= 0.8 || c.headcount_deficit >= 30"
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 inline-flex items-center gap-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  🔴 7 Hari Kerja
                </span>
                <span
                  v-else
                  class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 inline-flex items-center gap-1"
                >
                  🟡 14 Hari Kerja
                </span>
              </td>

              <td class="py-3 px-4 text-center">
                <div class="inline-flex items-center gap-1.5">
                  <RouterLink
                    :to="`/companies/${c.company_id}`"
                    class="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-[11px] font-bold transition-colors"
                  >
                    Investigasi
                  </RouterLink>
                  <RouterLink
                    :to="`/bap-generator?company_id=${c.company_id}`"
                    class="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Buat Draf Berita Acara (BAP)"
                  >
                    <FileText class="w-3.5 h-3.5" />
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
        <div>
          Menampilkan <span class="font-bold text-gray-800">{{ store.companies.length }}</span> dari
          <span class="font-bold text-gray-800">{{ store.totalCompanies }}</span> antrean anomali
        </div>
        <div class="flex items-center gap-2">
          <button
            :disabled="store.currentPage <= 1"
            @click="store.fetchCompanies(store.currentPage - 1)"
            class="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none text-gray-700"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="px-2">Halaman {{ store.currentPage }} dari {{ store.totalPages }}</span>
          <button
            :disabled="store.currentPage >= store.totalPages"
            @click="store.fetchCompanies(store.currentPage + 1)"
            class="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none text-gray-700"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


