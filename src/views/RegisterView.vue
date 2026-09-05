<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useComplianceStore } from '@/stores/compliance';
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const compStore = useComplianceStore();

// Form Model
const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  company_name: '',
  company_provinsi: 'DKI Jakarta',
  company_sektor: 'J - Informasi & Komunikasi',
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Sektor options
const sektorOptions = [
  'A - Pertanian, Kehutanan & Perikanan',
  'C - Industri Pengolahan',
  'D - Pengadaan Listrik & Gas',
  'F - Konstruksi',
  'G - Perdagangan Besar & Eceran',
  'H - Transportasi & Pergudangan',
  'I - Penyediaan Akomodasi & Makan Minum',
  'J - Informasi & Komunikasi',
  'K - Jasa Keuangan & Asuransi',
  'M - Jasa Profesional, Ilmiah & Teknis',
  'N - Jasa Persewaan & Ketenagakerjaan',
  'Q - Jasa Kesehatan & Kegiatan Sosial',
];

onMounted(async () => {
  if (compStore.regionalData.length === 0) {
    await compStore.fetchRegionalUMP();
  }
});

// Reference UMP for selected province
const currentUmp = computed(() => {
  const prov = form.value.company_provinsi.toLowerCase();
  const match = compStore.regionalData.find(
    (r: any) => r.provinsi.toLowerCase() === prov
  );
  return match ? match.ump_2026 : 5250000;
});

// Quick demo filler
function fillDemoData() {
  form.value = {
    name: 'Sarah Wijaya',
    email: `pic.hrd_${Date.now().toString().slice(-4)}@inovasidigital.co.id`,
    phone: '081298765432',
    password: 'password123',
    confirmPassword: 'password123',
    company_name: 'PT Inovasi Digital Mandiri',
    company_provinsi: 'DKI Jakarta',
    company_sektor: 'J - Informasi & Komunikasi',
  };
  errorMessage.value = '';
}

async function handleRegister() {
  errorMessage.value = '';
  successMessage.value = '';

  // Validations
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.company_name.trim()) {
    errorMessage.value = 'Mohon lengkapi semua kolom wajib.';
    return;
  }

  if (form.value.password.length < 6) {
    errorMessage.value = 'Kata sandi minimal terdiri dari 6 karakter.';
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = 'Konfirmasi kata sandi tidak cocok.';
    return;
  }

  isSubmitting.value = true;

  try {
    const res = await authStore.register({
      name: form.value.name.trim(),
      email: form.value.email.trim().toLowerCase(),
      password: form.value.password,
      phone: form.value.phone.trim(),
      company_name: form.value.company_name.trim(),
      company_provinsi: form.value.company_provinsi,
      company_sektor: form.value.company_sektor,
    });

    if (res.success) {
      successMessage.value = 'Akun Badan Usaha berhasil didaftarkan! Mengarahkan ke Portal...';
      setTimeout(() => {
        router.push('/portal-bu');
      }, 1200);
    } else {
      errorMessage.value = res.message || 'Gagal mendaftarkan akun. Silakan coba lagi.';
    }
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.detail || err?.message || 'Terjadi kesalahan pada server.';
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

    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden relative z-10 my-6">
      
      <!-- Left Hero Panel -->
      <div class="md:col-span-5 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 p-8 text-white flex flex-col justify-between relative">
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30">
              🛡️
            </div>
            <div>
              <h1 class="text-sm font-extrabold tracking-widest uppercase">REKSAKARYA AI</h1>
              <p class="text-[11px] text-teal-100 font-medium">Registrasi Mandiri Badan Usaha</p>
            </div>
          </div>

          <div class="pt-4 space-y-4">
            <h2 class="text-xl font-bold leading-tight">
              Daftarkan Badan Usaha Anda ke Ekosistem Kepatuhan e-Dabu
            </h2>
            <p class="text-xs text-teal-100/85 leading-relaxed">
              Dapatkan akses langsung ke Portal Mandiri untuk rekonsiliasi data upah, validasi mandiri kepatuhan JKN, serta penerbitan Bukti Penerimaan Elektronik (BPE) resmi.
            </p>
          </div>

          <!-- Feature Highlights -->
          <div class="space-y-3 pt-2">
            <div class="flex items-start gap-3 text-xs bg-white/10 p-3 rounded-2xl border border-white/10">
              <CheckCircle2 class="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
              <div>
                <span class="font-bold block">ID Badan Usaha Otomatis</span>
                <span class="text-teal-100/80 text-[11px]">Sistem secara otomatis mengenerate Company ID resmi terintegrasi.</span>
              </div>
            </div>

            <div class="flex items-start gap-3 text-xs bg-white/10 p-3 rounded-2xl border border-white/10">
              <ShieldCheck class="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
              <div>
                <span class="font-bold block">Kepatuhan UU PDP No. 27/2022</span>
                <span class="text-teal-100/80 text-[11px]">Enkripsi kata sandi PBKDF2-SHA256 & masking data payroll otomatis.</span>
              </div>
            </div>

            <div class="flex items-start gap-3 text-xs bg-white/10 p-3 rounded-2xl border border-white/10">
              <Building class="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
              <div>
                <span class="font-bold block">Benchmark Regional Dinamis</span>
                <span class="text-teal-100/80 text-[11px]">Penyesuaian batas UMP 2026 & standar upah riil BPS 38 provinsi.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-white/15 text-[11px] text-teal-200">
          <span>BPJS Kesehatan RI • Kedeputan Wasrik</span>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="md:col-span-7 bg-white p-8 md:p-10 flex flex-col justify-between">
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-lg font-extrabold text-gray-900">Registrasi Akun Perusahaan</h2>
              <p class="text-xs text-gray-500 mt-0.5">Lengkapi profil PIC dan identitas Badan Usaha</p>
            </div>
            <button
              @click="fillDemoData"
              type="button"
              class="px-2.5 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              title="Isi form otomatis dengan data contoh"
            >
              <Sparkles class="w-3.5 h-3.5" />
              <span>Contoh Cepat</span>
            </button>
          </div>

          <!-- Alert Messages -->
          <div v-if="errorMessage" class="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>

          <div v-if="successMessage" class="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 shrink-0" />
            <span>{{ successMessage }}</span>
          </div>

          <!-- Registration Form -->
          <form @submit.prevent="handleRegister" class="mt-5 space-y-4 text-xs">
            
            <!-- Section 1: Data PIC -->
            <div class="space-y-3">
              <p class="text-[10px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
                <User class="w-3.5 h-3.5" />
                <span>1. Data PIC Pelapor (HRD / Finance)</span>
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-gray-700 mb-1">Nama Lengkap PIC *</label>
                  <div class="relative">
                    <User class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      placeholder="e.g. Sarah Wijaya"
                      class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-gray-700 mb-1">Nomor Telepon / WA</label>
                  <div class="relative">
                    <Phone class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      v-model="form.phone"
                      type="tel"
                      placeholder="e.g. 081298765432"
                      class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-gray-700 mb-1">Email Resmi Perusahaan *</label>
                  <div class="relative">
                    <Mail class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="e.g. hrd@perusahaan.co.id"
                      class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-gray-700 mb-1">Kata Sandi (Min. 6 Karakter) *</label>
                  <div class="relative">
                    <Lock class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      v-model="form.password"
                      type="password"
                      required
                      placeholder="••••••••••••"
                      class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-700 mb-1">Konfirmasi Kata Sandi *</label>
                <div class="relative">
                  <Lock class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    v-model="form.confirmPassword"
                    type="password"
                    required
                    placeholder="Ulangi kata sandi"
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            <!-- Section 2: Data Perusahaan -->
            <div class="space-y-3 pt-3 border-t border-gray-100">
              <p class="text-[10px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 class="w-3.5 h-3.5" />
                <span>2. Identitas Badan Usaha (Perusahaan)</span>
              </p>

              <div>
                <label class="block text-[11px] font-bold text-gray-700 mb-1">Nama Resmi Badan Usaha / Perusahaan *</label>
                <div class="relative">
                  <Building2 class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    v-model="form.company_name"
                    type="text"
                    required
                    placeholder="e.g. PT Inovasi Digital Mandiri"
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-gray-700 mb-1">Provinsi Wilayah Kerja *</label>
                  <div class="relative">
                    <MapPin class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <select
                      v-model="form.company_provinsi"
                      class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option v-for="b in compStore.regionalData" :key="b.provinsi" :value="b.provinsi">
                        {{ b.provinsi }} (UMP: Rp {{ b.ump_2026.toLocaleString('id-ID') }})
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-gray-700 mb-1">Sektor Usaha (KBLI) *</label>
                  <div class="relative">
                    <Briefcase class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <select
                      v-model="form.company_sektor"
                      class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option v-for="s in sektorOptions" :key="s" :value="s">
                        {{ s }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- UMP helper badge -->
              <div class="p-2.5 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center justify-between text-[11px] text-teal-800">
                <span>Acuan Batas Bawah UMP 2026 di {{ form.company_provinsi }}:</span>
                <span class="font-mono font-bold">Rp {{ currentUmp.toLocaleString('id-ID') }}</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full mt-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
            >
              <span v-if="isSubmitting">Mendaftarkan Akun Badan Usaha...</span>
              <template v-else>
                <span>Daftar & Masuk ke Portal Mandiri</span>
                <ArrowRight class="w-4 h-4" />
              </template>
            </button>
          </form>
        </div>

        <!-- Footer link back to login -->
        <div class="pt-4 mt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          <span>Sudah memiliki akun terdaftar?</span>
          <router-link to="/login" class="text-teal-600 font-bold hover:underline ml-1">
            Masuk ke Portal e-Dabu
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
