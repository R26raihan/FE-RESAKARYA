<script setup lang="ts">
import { Bell, Search, Settings, User, ShieldCheck, Building2, LogOut } from 'lucide-vue-next';
import { useComplianceStore } from '@/stores/compliance';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const store = useComplianceStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const pageTitle = computed(() => {
  switch (route.name) {
    case 'portal-bu':
      return 'Portal Mandiri Pelaporan Badan Usaha';
    case 'triage':
      return 'Antrean Triase Wasrik';
    case 'companies':
      return 'Direktori Master Badan Usaha';
    case 'company-detail':
      return 'Detail Investigasi Entitas';
    case 'benchmark':
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

function handleProfileClick() {
  if (!authStore.isAuthenticated) {
    router.push('/login');
  }
}
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
      <!-- Search Input Pill (Only for Admin) -->
      <div v-if="authStore.isAdmin" class="relative w-56 sm:w-64">
        <Search class="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="store.searchQuery"
          @keyup.enter="store.fetchCompanies(1)"
          type="text"
          placeholder="Cari ID BU (BU-0013)..."
          class="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent shadow-sm transition-all"
        />
      </div>

      <!-- Active User / Role Badge -->
      <button
        @click="handleProfileClick"
        class="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-100 shadow-sm px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div class="w-5 h-5 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-[10px]">
          <span v-if="authStore.isAdmin">🛡️</span>
          <span v-else>🏢</span>
        </div>
        <span class="hidden sm:inline">{{ authStore.currentUser?.name || 'Pengguna' }}</span>
        <span
          :class="[
            'text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider',
            authStore.isAdmin ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
          ]"
        >
          {{ authStore.role }}
        </span>
      </button>

      <!-- Settings Icon -->
      <button class="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors">
        <Settings class="w-3.5 h-3.5" />
      </button>

      <!-- Notification Bell -->
      <button class="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors relative">
        <Bell class="w-3.5 h-3.5" />
        <span class="w-2 h-2 rounded-full bg-teal-500 absolute top-2 right-2 ring-2 ring-white"></span>
      </button>
    </div>
  </header>
</template>


