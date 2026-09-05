<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useComplianceStore } from '@/stores/compliance';
import { MapPin, TrendingUp, Search } from 'lucide-vue-next';

const store = useComplianceStore();
const selectedWilayah = ref('');
const searchProv = ref('');

onMounted(async () => {
  await store.fetchRegionalUMP();
});

const filteredRegional = computed(() => {
  let list = store.regionalData;
  if (selectedWilayah.value) {
    list = list.filter((r) => r.wilayah.toLowerCase() === selectedWilayah.value.toLowerCase());
  }
  if (searchProv.value) {
    list = list.filter((r) => r.provinsi.toLowerCase().includes(searchProv.value.toLowerCase()));
  }
  return list;
});

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
          <MapPin class="w-5 h-5 text-teal-500" />
          Benchmark Standar Upah Regional 38 Provinsi di Indonesia
        </h2>
        <p class="text-xs text-gray-400 mt-1">
          Tabel acuan terintegrasi Regulasi UMP 2026 (Kemnaker RI) dan Survei Upah Riil Buruh (BPS) sebagai jangkar normalisasi sistem triase.
        </p>
      </div>
    </div>

    <!-- Filter Bar Card -->
    <div class="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div class="relative w-full sm:w-72">
        <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchProv"
          type="text"
          placeholder="Cari nama provinsi..."
          class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
      </div>

      <div class="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
        <button
          v-for="w in ['', 'Sumatera', 'Jawa', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku & Papua']"
          :key="w"
          @click="selectedWilayah = w"
          :class="[
            'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
            selectedWilayah === w
              ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30'
              : 'bg-gray-50 text-gray-500 hover:text-gray-800 hover:bg-gray-100'
          ]"
        >
          {{ w || 'Semua Wilayah' }}
        </button>
      </div>
    </div>

    <!-- Regional Table Card -->
    <div class="rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100 bg-gray-50/50">
            <tr>
              <th class="py-3 px-4">NO</th>
              <th class="py-3 px-4">PROVINSI</th>
              <th class="py-3 px-4">GUGUS WILAYAH</th>
              <th class="py-3 px-4 text-right">UMP 2026 (UPAH MINIMUM PROVINSI)</th>
              <th class="py-3 px-4 text-right">UPAH RIIL BPS (BADAN PUSAT STATISTIK)</th>
              <th class="py-3 px-4 text-right">KENAIKAN NOMINAL</th>
              <th class="py-3 px-4 text-center">RASIO UMP/BPS</th>
              <th class="py-3 px-4 text-right">ESTIMASI CAGR (PERTUMBUHAN TAHUNAN)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="r in filteredRegional"
              :key="r.no"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="py-3 px-4 text-gray-400">{{ r.no }}</td>
              <td class="py-3 px-4 font-bold text-gray-800">{{ r.provinsi }}</td>
              <td class="py-3 px-4">
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gray-100 text-gray-600">
                  {{ r.wilayah }}
                </span>
              </td>
              <td class="py-3 px-4 text-right font-bold text-teal-600">{{ formatRupiah(r.ump_2026) }}</td>
              <td class="py-3 px-4 text-right font-medium text-gray-700">{{ formatRupiah(r.upah_riil_rata_bps) }}</td>
              <td class="py-3 px-4 text-right font-bold" :class="r.pertumbuhan_nominal >= 0 ? 'text-teal-600' : 'text-rose-600'">
                {{ r.pertumbuhan_nominal >= 0 ? `+${formatRupiah(r.pertumbuhan_nominal)}` : formatRupiah(r.pertumbuhan_nominal) }}
              </td>
              <td class="py-3 px-4 text-center font-bold text-gray-800">{{ r.rasio_ump_vs_upah_bps.toFixed(2) }}x</td>
              <td class="py-3 px-4 text-right font-bold" :class="r.estimasi_cagr_persen >= 0 ? 'text-teal-600' : 'text-rose-600'">
                {{ r.estimasi_cagr_persen.toFixed(2) }}% / thn
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

