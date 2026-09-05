<script setup lang="ts">
import { onMounted } from 'vue';
import { useComplianceStore } from '@/stores/compliance';
import RiskBadge from '@/components/common/RiskBadge.vue';
import { ShieldAlert, Filter, Search, ChevronLeft, ChevronRight, RefreshCw, FileText, ArrowRight } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const store = useComplianceStore();

onMounted(async () => {
  store.filterLabelAnomali = 1; // Default to Anomaly Queue for Wasrik
  await store.fetchCompanies(1);
});

function handleFilterChange() {
  store.fetchCompanies(1);
}

function formatRupiah(val?: number) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          <ShieldAlert class="w-5 h-5 text-rose-500" />
          Antrean Triase Pemeriksaan Wasrik (Risk Queue)
        </h2>
        <p class="text-xs text-gray-400 mt-1">
          Daftar entitas badan usaha terindikasi <em>Flat UMP</em> & <em>Under-coverage</em> prioritas audit kepatuhan BPJS Kesehatan.
        </p>
      </div>

      <!-- Action Refresh -->
      <button
        @click="store.fetchCompanies(store.currentPage)"
        class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors border border-gray-200 shadow-sm self-start md:self-auto"
      >
        <RefreshCw class="w-3.5 h-3.5 text-teal-600" :class="{ 'animate-spin': store.isLoading }" />
        Segarkan Data
      </button>
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
          placeholder="ID BU (BU-0013)..."
          class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
      </div>

      <!-- Status Filter -->
      <select
        v-model="store.filterLabelAnomali"
        @change="handleFilterChange"
        class="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
      >
        <option :value="null">Semua Status Kepatuhan</option>
        <option :value="1">🚨 Prioritas Tinggi (Anomali)</option>
        <option :value="0">✅ Normal / Patuh</option>
      </select>

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

      <!-- Button Reset -->
      <button
        @click="
          store.filterProvinsi = '';
          store.filterSektor = '';
          store.filterSkala = '';
          store.filterLabelAnomali = null;
          store.searchQuery = '';
          handleFilterChange();
        "
        class="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
      >
        Reset Filter
      </button>
    </div>

    <!-- Table Container Card -->
    <div class="rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 bg-gray-50/50">
            <tr>
              <th class="py-3 px-4">ID BADAN USAHA</th>
              <th class="py-3 px-4">PROVINSI</th>
              <th class="py-3 px-4">SEKTOR / SKALA</th>
              <th class="py-3 px-4">PEKERJA E-DABU</th>
              <th class="py-3 px-4">DEFISIT WLTK</th>
              <th class="py-3 px-4">RASIO FLAT UMP</th>
              <th class="py-3 px-4">SHANNON ENTROPY</th>
              <th class="py-3 px-4">RERATA GAJI</th>
              <th class="py-3 px-4">STATUS RISIKO</th>
              <th class="py-3 px-4 text-center">TINDAKAN WASRIK</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="c in store.companies"
              :key="c.company_id"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="py-3 px-4 font-bold text-gray-800">{{ c.company_id }}</td>
              <td class="py-3 px-4 font-medium text-gray-700">{{ c.provinsi }}</td>
              <td class="py-3 px-4">
                <span class="text-gray-800 font-medium">{{ c.sektor_kbli }}</span>
                <span class="text-[10px] text-gray-400 block">{{ c.skala_usaha }}</span>
              </td>
              <td class="py-3 px-4 font-semibold text-gray-800">{{ c.total_workers_edabu }}</td>
              <td class="py-3 px-4 font-bold" :class="c.headcount_deficit > 0 ? 'text-amber-600' : 'text-gray-400'">
                {{ c.headcount_deficit > 0 ? `+${c.headcount_deficit}` : '0' }}
              </td>
              <td class="py-3 px-4 font-bold" :class="c.pct_flat_ump >= 0.8 ? 'text-rose-600' : 'text-gray-700'">
                {{ (c.pct_flat_ump * 100).toFixed(1) }}%
              </td>
              <td class="py-3 px-4 font-semibold" :class="c.shannon_entropy < 0.3 ? 'text-rose-600 font-bold' : 'text-gray-700'">
                {{ c.shannon_entropy.toFixed(3) }}
              </td>
              <td class="py-3 px-4 font-medium text-gray-700">{{ formatRupiah(c.mean_gaji_lapor) }}</td>
              <td class="py-3 px-4">
                <RiskBadge :label-anomali="c.label_anomali" />
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
          <span class="font-bold text-gray-800">{{ store.totalCompanies }}</span> entitas
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

