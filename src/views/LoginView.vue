<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore, type UserRole } from '@/stores/auth';
import {
  ShieldAlert,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Users,
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const selectedRole = ref<UserRole>('admin');
const email = ref('wasrik@bpjs-kesehatan.go.id');
const password = ref('admin123');
const isSubmitting = ref(false);
const errorMessage = ref('');
const availableAccounts = ref<any[]>([]);

onMounted(async () => {
  const accounts = await authStore.fetchDemoAccounts();
  if (accounts && accounts.length > 0) {
    availableAccounts.value = accounts;
  }
});

function selectRole(role: UserRole) {
  selectedRole.value = role;
  errorMessage.value = '';
  if (role === 'admin') {
    email.value = 'wasrik@bpjs-kesehatan.go.id';
    password.value = 'admin123';
  } else {
    email.value = 'hr@nusantaratech.co.id';
    password.value = 'user123';
  }
}

function selectSpecificAccount(acc: any) {
  selectedRole.value = acc.role as UserRole;
  email.value = acc.email;
  password.value = acc.role === 'admin' ? 'admin123' : 'user123';
  errorMessage.value = '';
}

async function handleLogin() {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const result = await authStore.login(email.value, password.value);
    if (result.success) {
      if (authStore.role === 'admin') {
        router.push('/');
      } else {
        router.push('/portal-bu');
      }
    } else {
      errorMessage.value = result.message || 'Email atau kata sandi salah. Silakan coba lagi.';
    }
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.detail || err?.message || 'Terjadi kesalahan saat otentikasi.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex items-center justify-center p-4 selection:bg-teal-500 selection:text-white relative overflow-hidden">
    <!-- Ambient Background Glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden relative z-10">
      
      <!-- Left Hero Panel -->
      <div class="md:col-span-5 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 p-8 text-white flex flex-col justify-between relative">
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30">
              🛡️
            </div>
            <div>
              <h1 class="text-sm font-extrabold tracking-widest uppercase">REKSAKARYA AI</h1>
              <p class="text-[11px] text-teal-100 font-medium">Database-Driven Auth & Compliance</p>
            </div>
          </div>

          <div class="pt-4 space-y-4">
            <h2 class="text-xl font-bold leading-tight">
              Sistem Triase Risiko & Otomasi Kepatuhan e-Dabu
            </h2>
            <p class="text-xs text-teal-100/90 leading-relaxed">
              Platform kecerdasan buatan terintegrasi untuk pengawasan kepatuhan pelaporan upah dan jumlah pekerja Badan Usaha BPJS Kesehatan RI.
            </p>
          </div>

          <!-- Feature Bullets -->
          <div class="space-y-2.5 pt-2">
            <div class="flex items-center gap-2.5 text-xs text-teal-100">
              <CheckCircle2 class="w-4 h-4 text-teal-300 shrink-0" />
              <span>Database MySQL Terintegrasi (`users` table)</span>
            </div>
            <div class="flex items-center gap-2.5 text-xs text-teal-100">
              <CheckCircle2 class="w-4 h-4 text-teal-300 shrink-0" />
              <span>Dual-Model ML Anomaly Detection</span>
            </div>
            <div class="flex items-center gap-2.5 text-xs text-teal-100">
              <CheckCircle2 class="w-4 h-4 text-teal-300 shrink-0" />
              <span>UU PDP No. 27/2022 PII Masking Safe</span>
            </div>
          </div>
        </div>

        <!-- Footer Tag -->
        <div class="pt-8 border-t border-white/10 text-[10px] text-teal-200/80 flex items-center justify-between">
          <span>Kedeputian Wasrik BPJS</span>
          <span class="font-mono">MySQL Live Auth</span>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="md:col-span-7 bg-white p-8 md:p-10 flex flex-col justify-between">
        <div class="space-y-5">
          <div>
            <span class="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2.5 py-1 rounded-md">
              Autentikasi Pengguna
            </span>
            <h2 class="text-xl font-bold text-gray-800 mt-2">Selamat Datang di REKSAKARYA</h2>
            <p class="text-xs text-gray-500 mt-1">Pilih role akses Anda untuk masuk ke sistem.</p>
          </div>

          <!-- Role Selector Cards -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Role Admin Wasrik -->
            <button
              type="button"
              @click="selectRole('admin')"
              :class="[
                'p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer',
                selectedRole === 'admin'
                  ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <div :class="['w-8 h-8 rounded-xl flex items-center justify-center text-sm', selectedRole === 'admin' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600']">
                  <ShieldAlert class="w-4 h-4" />
                </div>
                <span v-if="selectedRole === 'admin'" class="w-2 h-2 rounded-full bg-teal-500"></span>
              </div>
              <h3 class="text-xs font-bold text-gray-800">Petugas Wasrik</h3>
              <p class="text-[10px] text-gray-500 mt-0.5">Admin & Audit BPJS</p>
            </button>

            <!-- Role User Badan Usaha -->
            <button
              type="button"
              @click="selectRole('user')"
              :class="[
                'p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer',
                selectedRole === 'user'
                  ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <div :class="['w-8 h-8 rounded-xl flex items-center justify-center text-sm', selectedRole === 'user' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600']">
                  <Building2 class="w-4 h-4" />
                </div>
                <span v-if="selectedRole === 'user'" class="w-2 h-2 rounded-full bg-teal-500"></span>
              </div>
              <h3 class="text-xs font-bold text-gray-800">Badan Usaha</h3>
              <p class="text-[10px] text-gray-500 mt-0.5">HR & Input Payroll</p>
            </button>
          </div>

          <!-- Error Alert -->
          <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Email Terdaftar</label>
              <div class="relative">
                <Mail class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="nama@perusahaan.co.id"
                  class="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Kata Sandi</label>
              <div class="relative">
                <Lock class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  v-model="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  class="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full mt-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span v-if="isSubmitting">Memverifikasi ke Database...</span>
              <template v-else>
                <span>Masuk ke {{ selectedRole === 'admin' ? 'Command Center Wasrik' : 'Portal Badan Usaha' }}</span>
                <ArrowRight class="w-4 h-4" />
              </template>
            </button>
          </form>

          <!-- Quick Database Account Chips -->
          <div v-if="availableAccounts.length > 0" class="pt-2 border-t border-gray-100 space-y-1.5">
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pilih Akun dari Database MySQL:</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="acc in availableAccounts"
                :key="acc.id"
                type="button"
                @click="selectSpecificAccount(acc)"
                :class="[
                  'px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer flex items-center gap-1',
                  email === acc.email
                    ? 'bg-teal-50 border-teal-400 text-teal-800 font-bold ring-1 ring-teal-400'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                ]"
              >
                <span>{{ acc.role === 'admin' ? '🛡️' : '🏢' }}</span>
                <span>{{ acc.company_name || acc.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
