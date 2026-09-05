<script setup lang="ts">
import { Bell, Search, Settings, User, ShieldCheck } from 'lucide-vue-next';
import { useComplianceStore } from '@/stores/compliance';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const store = useComplianceStore();
const route = useRoute();

const pageTitle = computed(() => {
  switch (route.name) {
    case 'triage':
      return 'Antrean Triase Wasrik';
    case 'companies':
      return 'Direktori Master Badan Usaha';
    case 'company-detail':
      return 'Detail Investigasi Entitas';
    case 'regional':
      return 'Benchmark Regional 38 Provinsi';
    case 'bap-generator':
      return 'Auto-BAP Generator';
    case 'regulation':
    case 'methodology':
      return 'Landasan Regulasi & SOP Wasrik';
    default:
      return 'Dashboard';
  }
});
</script>

<template>
  <header class="py-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md bg-[#F8F9FA]/80">
    <!-- Breadcrumb & Page Title -->
    <div>
      <nav class="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
        <span>Pages</span>
        <span>/</span>
        <span class="text-gray-700 capitalize">{{ pageTitle }}</span>
      </nav>
      <h1 class="text-base font-bold text-gray-800 tracking-tight mt-0.5">
        {{ pageTitle }}
      </h1>
    </div>

    <!-- Right Controls: Search, Sign In, Settings, Notifications -->
    <div class="flex items-center gap-3">
      <!-- Search Input Pill -->
      <div class="relative w-56 sm:w-64">
        <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="store.searchQuery"
          @keyup.enter="store.fetchCompanies(1)"
          type="text"
          placeholder="Cari ID BU (BU-0013)..."
          class="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm transition-all"
        />
      </div>

      <!-- Sign In / User Pill -->
      <button class="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-teal-600 transition-colors px-2 py-1.5 rounded-lg">
        <User class="w-3.5 h-3.5 text-gray-500" />
        <span class="hidden sm:inline">Wasrik BPJS</span>
      </button>

      <!-- Settings Icon -->
      <button class="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors">
        <Settings class="w-3.5 h-3.5" />
      </button>

      <!-- Notification Bell -->
      <button class="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors relative">
        <Bell class="w-3.5 h-3.5" />
        <span class="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white"></span>
      </button>
    </div>
  </header>
</template>

