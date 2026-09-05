<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  LayoutDashboard,
  ShieldAlert,
  Building2,
  MapPin,
  FileText,
  HelpCircle,
  UploadCloud,
  FileSpreadsheet,
  LogOut,
  Sparkles,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const currentPath = computed(() => route.path);

const adminMainNavItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Antrean Triase', path: '/triage', icon: ShieldAlert },
  { name: 'Daftar Badan Usaha', path: '/companies', icon: Building2 },
  { name: 'Benchmark Regional', path: '/benchmark', icon: MapPin },
];

const adminAuditNavItems = [
  { name: 'Auto-BAP Generator', path: '/bap-generator', icon: FileText },
  { name: 'Panduan & Regulasi', path: '/regulation', icon: HelpCircle },
];

const userNavItems = [
  { name: 'Portal Input Payroll', path: '/portal-bu', icon: UploadCloud },
  { name: 'Panduan & Regulasi', path: '/regulation', icon: HelpCircle },
];

function handleLogout() {
  authStore.logout();
  router.push('/login');
}

function handleSwitchRole() {
  if (authStore.isAdmin) {
    authStore.switchRole('user');
    router.push('/portal-bu');
  } else {
    authStore.switchRole('admin');
    router.push('/');
  }
}
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
          <p class="text-[10px] text-teal-600 font-semibold">
            {{ authStore.isAdmin ? 'Wasrik BPJS Kesehatan' : 'Portal Badan Usaha' }}
          </p>
        </div>
      </div>

      <!-- Navigation for Admin Role -->
      <div v-if="authStore.isAdmin" class="space-y-1">
        <RouterLink
          v-for="item in adminMainNavItems"
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
          v-for="item in adminAuditNavItems"
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

      <!-- Navigation for User Role -->
      <div v-else class="space-y-1">
        <div class="px-3 pb-1 text-[10px] font-bold text-teal-600 uppercase tracking-wider">
          Menu Pelaporan e-Dabu
        </div>

        <RouterLink
          v-for="item in userNavItems"
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

    <!-- Bottom User Profile Card & Role Switcher -->
    <div class="space-y-2">
      <div class="p-3.5 rounded-2xl bg-gradient-to-br from-gray-900 to-slate-800 text-white relative overflow-hidden shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs">👤</span>
            <div>
              <p class="text-[11px] font-bold truncate max-w-[120px]">{{ authStore.currentUser.name }}</p>
              <p class="text-[9px] text-teal-300 font-semibold">{{ authStore.currentUser.badge }}</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            title="Keluar"
            class="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/80 text-white transition-colors"
          >
            <LogOut class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Quick Switch Role Button -->
        <button
          @click="handleSwitchRole"
          class="mt-2.5 w-full py-1 px-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 text-[9px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
        >
          <Sparkles class="w-3 h-3" />
          <span>Ganti ke Mode {{ authStore.isAdmin ? 'Badan Usaha' : 'Wasrik BPJS' }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

