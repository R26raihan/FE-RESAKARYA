<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import {
  LayoutDashboard,
  ShieldAlert,
  Building2,
  MapPin,
  FileText,
  HelpCircle,
  Sparkles,
} from 'lucide-vue-next';

const route = useRoute();
const currentPath = computed(() => route.path);

const mainNavItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Antrean Triase', path: '/triage', icon: ShieldAlert },
  { name: 'Daftar Badan Usaha', path: '/companies', icon: Building2 },
  { name: 'Benchmark Regional', path: '/benchmark', icon: MapPin },
];

const auditNavItems = [
  { name: 'Auto-BAP Generator', path: '/bap-generator', icon: FileText },
];
</script>

<template>
  <aside class="w-64 bg-white shrink-0 h-screen sticky top-0 flex flex-col justify-between p-4 border-r border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.02)]">
    <div class="space-y-6">
      <!-- Brand Logo -->
      <div class="flex items-center gap-3 px-3 py-3 border-b border-gray-100">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-teal">
          🛡️
        </div>
        <div>
          <h1 class="text-xs font-bold text-gray-800 tracking-wider uppercase">
            REKSAKARYA AI
          </h1>
          <p class="text-[10px] text-gray-400 font-medium">Wasrik BPJS Kesehatan</p>
        </div>
      </div>

      <!-- Main Navigation -->
      <div class="space-y-1">
        <RouterLink
          v-for="item in mainNavItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-3 rounded-2xl text-xs font-bold transition-all duration-200',
            currentPath === item.path
              ? 'bg-white shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] text-gray-800 border border-gray-100/80'
              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
          ]"
        >
          <div
            :class="[
              'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
              currentPath === item.path
                ? 'bg-teal-400 text-white shadow-teal'
                : 'bg-white text-teal-500 shadow-sm border border-gray-100'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4" />
          </div>
          <span class="tracking-tight">{{ item.name }}</span>
        </RouterLink>

        <!-- Section Header -->
        <div class="pt-4 px-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Otomasi Wasrik
        </div>

        <RouterLink
          v-for="item in auditNavItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-3 rounded-2xl text-xs font-bold transition-all duration-200',
            currentPath === item.path
              ? 'bg-white shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] text-gray-800 border border-gray-100/80'
              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
          ]"
        >
          <div
            :class="[
              'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
              currentPath === item.path
                ? 'bg-teal-400 text-white shadow-teal'
                : 'bg-white text-teal-500 shadow-sm border border-gray-100'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4" />
          </div>
          <span class="tracking-tight">{{ item.name }}</span>
        </RouterLink>
      </div>
    </div>

    <!-- Bottom Help Card (Purity UI signature card) -->
    <div class="p-4 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white relative overflow-hidden shadow-teal">
      <div class="w-7 h-7 rounded-lg bg-white text-teal-600 flex items-center justify-center font-bold text-xs mb-3 shadow-sm">
        <HelpCircle class="w-4 h-4" />
      </div>
      <h3 class="text-xs font-bold leading-tight">Butuh Bantuan Audit?</h3>
      <p class="text-[10px] text-teal-50 mt-1 opacity-90">Panduan regulasi & manual triase kepatuhan Wasrik.</p>
      <RouterLink
        to="/benchmark"
        class="mt-3 w-full py-1.5 px-3 bg-white text-teal-800 rounded-xl text-[10px] font-bold text-center block uppercase tracking-wider shadow-sm hover:bg-gray-50 transition-colors"
      >
        Lihat Panduan
      </RouterLink>
    </div>
  </aside>
</template>
