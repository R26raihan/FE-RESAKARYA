<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useComplianceStore } from '@/stores/compliance';
import RiskBadge from '@/components/common/RiskBadge.vue';
import {
  Building2,
  Search,
  Filter,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowUpDown,
  Download,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Briefcase
} from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const store = useComplianceStore();

const searchKeyword = ref('');
const selectedProvinsi = ref('');
const selectedSektor = ref('');
const selectedSkala = ref('');
const selectedStatus = ref<number | null>(null);

onMounted(async () => {
  store.filterLabelAnomali = null; // Menampilkan seluruh entitas (Normal & Anomali)
  await store.fetchCompanies(1);
});

function handleFilter() {
  store.searchQuery = searchKeyword.value;
  store.filterProvinsi = selectedProvinsi.value;
  store.filterSektor = selectedSektor.value;
  store.filterSkala = selectedSkala.value;
  store.filterLabelAnomali = selectedStatus.value;
  store.fetchCompanies(1);
}

function resetFilter() {
  searchKeyword.value = '';
  selectedProvinsi.value = '';
  selectedSektor.value = '';
  selectedSkala.value = '';
  selectedStatus.value = null;
  handleFilter();
}

function formatRupiah(val?: number) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Title & Directory Summary Stats -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Building2 class="w-5 h-5 text-teal-600" />
          Direktori Master Badan Usaha (e-Dabu Database)
        </h2>
        <p class="text-xs text-gray-400 mt-1">
          Katalog lengkap seluruh entitas pemberi kerja terdaftar pada sistem e-Dabu BPJS Kesehatan di 38 provinsi.
        </p>
      </div>

      <div class="flex items-center gap-2 self-start md:self-auto">
        <button
          @click="store.fetchCompanies(store.currentPage)"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors border border-gray-200 shadow-sm"
        >
          <RefreshCw class="w-3.5 h-3.5 text-teal-600" :class="{ 'animate-spin': store.isLoading }" />
          Segarkan Data
        </button>
      </div>
    </div>

    <!-- Quick Directory Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Entitas Master</p>
          <h3 class="text-lg font-bold text-gray-800 mt-0.5">{{ store.totalCompanies.toLocaleString('id-ID') }} BU</h3>
          <p class="text-[10px] text-teal-600 font-medium mt-0.5">Tersebar di 38 Provinsi</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
          <Building2 class="w-5 h-5" />
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pekerja e-Dabu</p>
          <h3 class="text-lg font-bold text-gray-800 mt-0.5">54.300 Jiwa</h3>
          <p class="text-[10px] text-gray-400 font-medium mt-0.5">Peserta Penerima Upah (PPU)</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Users class="w-5 h-5" />
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status Patuh / Normal</p>
          <h3 class="text-lg font-bold text-teal-600 mt-0.5">1.700 BU (85%)</h3>
          <p class="text-[10px] text-gray-400 font-medium mt-0.5">Struktur Upah Sesuai SUSU</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
          <CheckCircle2 class="w-5 h-5" />
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex items-center justify-between">
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status Anomali / Audit</p>
          <h3 class="text-lg font-bold text-rose-600 mt-0.5">300 BU (15%)</h3>
          <p class="text-[10px] text-rose-500 font-medium mt-0.5">Masuk Antrean Triase</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
          <Briefcase class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Filter Control Card -->
    <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
      <!-- Search Input -->
      <div class="relative lg:col-span-2">
        <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchKeyword"
          @keyup.enter="handleFilter"
          type="text"
          placeholder="Cari ID BU (contoh: BU-0013)..."
          class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
      </div>

      <!-- Sektor Filter -->
      <select
        v-model="selectedSektor"
        @change="handleFilter"
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
        v-model="selectedSkala"
        @change="handleFilter"
        class="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
      >
        <option value="">Semua Skala Usaha</option>
        <option value="Kecil">Kecil</option>
        <option value="Menengah">Menengah</option>
        <option value="Besar">Besar</option>
      </select>

      <!-- Status Filter -->
      <select
        v-model="selectedStatus"
        @change="handleFilter"
        class="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
      >
        <option :value="null">Semua Status Kepatuhan</option>
        <option :value="0">✅ Patuh / Normal (1.700 BU)</option>
        <option :value="1">🚨 Terindikasi Anomali (300 BU)</option>
      </select>

      <!-- Reset Filter Button -->
      <button
        @click="resetFilter"
        class="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
      >
        Reset Filter
      </button>
    </div>

    <!-- Directory Master Table Card -->
    <div class="rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 bg-gray-50/50">
            <tr>
              <th class="py-3 px-4">ID BADAN USAHA</th>
              <th class="py-3 px-4">PROVINSI</th>
              <th class="py-3 px-4">SEKTOR KBLI</th>
              <th class="py-3 px-4">SKALA USAHA</th>
              <th class="py-3 px-4">TOTAL PEKERJA</th>
              <th class="py-3 px-4">RERATA GAJI LAPOR</th>
              <th class="py-3 px-4">MEDIAN GAJI</th>
              <th class="py-3 px-4">STATUS KEPATUHAN</th>
              <th class="py-3 px-4 text-center">DETAIL DOSSIER</th>
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
                  <div class="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                    <Building2 class="w-3.5 h-3.5" />
                  </div>
                  <span class="font-bold text-gray-800">{{ c.company_id }}</span>
                </div>
              </td>
              <td class="py-3 px-4 font-medium text-gray-700">{{ c.provinsi }}</td>
              <td class="py-3 px-4 text-gray-800 font-medium">{{ c.sektor_kbli }}</td>
              <td class="py-3 px-4">
                <span
                  class="px-2 py-0.5 rounded-lg text-[10px] font-bold"
                  :class="c.skala_usaha === 'Besar' ? 'bg-purple-50 text-purple-700' : c.skala_usaha === 'Menengah' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'"
                >
                  {{ c.skala_usaha }}
                </span>
              </td>
              <td class="py-3 px-4 font-bold text-gray-800">{{ c.total_workers_edabu }} Orang</td>
              <td class="py-3 px-4 font-medium text-gray-700">{{ formatRupiah(c.mean_gaji_lapor) }}</td>
              <td class="py-3 px-4 text-gray-500">{{ formatRupiah(c.median_gaji_lapor) }}</td>
              <td class="py-3 px-4">
                <RiskBadge :label-anomali="c.label_anomali" />
              </td>
              <td class="py-3 px-4 text-center">
                <RouterLink
                  :to="`/companies/${c.company_id}`"
                  class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-teal-50 hover:text-teal-700 text-gray-600 text-[11px] font-bold transition-colors"
                >
                  <Eye class="w-3.5 h-3.5" /> Profil
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
        <div>
          Menampilkan <span class="font-bold text-gray-800">{{ store.companies.length }}</span> dari
          <span class="font-bold text-gray-800">{{ store.totalCompanies }}</span> entitas master
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
