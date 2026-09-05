<script setup lang="ts">
import { onMounted } from 'vue';
import { useComplianceStore } from '@/stores/compliance';
import StatCard from '@/components/common/StatCard.vue';
import RiskBadge from '@/components/common/RiskBadge.vue';
import {
  Building2,
  Users,
  ShieldAlert,
  UserX,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Wallet,
  Globe,
  FileText,
  ShoppingCart,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  CreditCard,
  Package,
  MoreVertical
} from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

const store = useComplianceStore();

onMounted(async () => {
  await Promise.all([
    store.fetchKPIs(),
    store.fetchSektorDistribution(),
    store.fetchWilayahDistribution(),
    store.fetchCompanies(1),
  ]);
});

function formatRupiah(val?: number) {
  if (!val) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

// Company avatars for table
const companyIcons = [
  { bg: 'bg-purple-100 text-purple-600', letter: 'XD', name: 'BU-0013 Manufaktur Jaya' },
  { bg: 'bg-blue-100 text-blue-600', letter: 'AT', name: 'BU-0042 Retail Sentosa' },
  { bg: 'bg-amber-100 text-amber-600', letter: 'SL', name: 'BU-0098 Agro Makmur' },
  { bg: 'bg-emerald-100 text-emerald-600', letter: 'SP', name: 'BU-0125 Industri Logam' },
  { bg: 'bg-indigo-100 text-indigo-600', letter: 'JR', name: 'BU-0005 Finansial Prima' },
  { bg: 'bg-rose-100 text-rose-600', letter: 'IN', name: 'BU-0018 Konstruksi Bersama' },
];
</script>

<template>
  <div class="space-y-6">
    <!-- Row 1: 4 Top Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="RERATA UPAH NORMAL"
        :value="formatRupiah(store.kpis.avg_wage_normal)"
        trend="+55%"
        :trend-positive="true"
        subtitle="Benchmark BPS & Pasar"
      >
        <template #icon><Wallet class="w-5 h-5 text-white" /></template>
      </StatCard>

      <StatCard
        title="TOTAL BADAN USAHA"
        :value="store.kpis.total_companies.toLocaleString('id-ID')"
        trend="+5%"
        :trend-positive="true"
        subtitle="Entitas Terdaftar e-Dabu"
      >
        <template #icon><Globe class="w-5 h-5 text-white" /></template>
      </StatCard>

      <StatCard
        title="BADAN USAHA ANOMALI"
        :value="store.kpis.total_anomalies.toLocaleString('id-ID')"
        trend="-14%"
        :trend-positive="false"
        subtitle="Prioritas Triase Wasrik"
      >
        <template #icon><FileText class="w-5 h-5 text-white" /></template>
      </StatCard>

      <StatCard
        title="DEFISIT TENAGA KERJA"
        :value="store.kpis.total_headcount_deficit.toLocaleString('id-ID')"
        trend="+8%"
        :trend-positive="true"
        subtitle="Peserta Belum Didaftarkan"
      >
        <template #icon><ShoppingCart class="w-5 h-5 text-white" /></template>
      </StatCard>
    </div>

    <!-- Row 2: Two Hero Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Left Hero Card (7 Cols) -->
      <div class="lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div class="md:col-span-7">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Sistem Pengawasan e-Dabu</p>
            <h2 class="text-xl font-black text-gray-800 tracking-tight mb-2">REKSAKARYA AI Dashboard</h2>
            <p class="text-xs text-gray-500 leading-relaxed mb-4">
              Platform triase kepatuhan iuran JKN berbasis <strong>Dual-Model Machine Learning (Isolation Forest & Deep Autoencoder)</strong> terintegrasi benchmark upah 38 provinsi di Indonesia untuk mendeteksi modus <em>Flat UMP</em> dan <em>Under-coverage</em> secara akuntabel.
            </p>
            <RouterLink
              to="/triage"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 hover:text-teal-600 transition-colors group"
            >
              <span>Buka Antrean Triase</span>
              <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </RouterLink>
          </div>

          <!-- Teal Graphic Banner on Right -->
          <div class="md:col-span-5 h-44 rounded-2xl bg-gradient-to-tr from-teal-500 via-teal-400 to-emerald-400 p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_10px_20px_0_rgba(79,209,197,0.3)]">
            <!-- Decorative wave shapes -->
            <div class="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-sm pointer-events-none"></div>
            <div class="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-sm pointer-events-none"></div>

            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-2 shadow-sm">
              <Zap class="w-7 h-7 fill-white" />
            </div>
            <span class="text-base font-extrabold text-white tracking-wide">REKSAKARYA</span>
            <span class="text-[10px] font-medium text-teal-100 mt-0.5 tracking-wider uppercase">AI Fraud Analytics</span>
          </div>
        </div>
      </div>

      <!-- Right Hero Card (5 Cols) -->
      <div class="lg:col-span-5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white min-h-[220px]">
        <!-- Subtle background pattern -->
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div class="relative z-10">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-semibold mb-2.5 border border-teal-500/30">
            <ShieldCheck class="w-3.5 h-3.5" />
            <span>Wasrik BPJS Kesehatan</span>
          </div>
          <h3 class="text-lg font-bold text-white tracking-tight mb-2">Pemeriksaan Proaktif Berbasis Risiko</h3>
          <p class="text-xs text-slate-300 leading-relaxed">
            Mengubah metode audit dari pengaduan reaktif menjadi audit terarah berbasis deviasi upah riil BPS dan pengamanan privasi data sesuai UU PDP No. 27/2022.
          </p>
        </div>

        <div class="relative z-10 pt-4">
          <RouterLink
            to="/methodology"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-teal-300 transition-colors group"
          >
            <span>Panduan & Regulasi</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Row 3: Two Analytics / Chart Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Left Analytics Card: Dark Navy Bar Chart (5 Cols) -->
      <div class="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <!-- Top Dark Navy Card with Glowing White Bars -->
        <div class="bg-[#1A1F37] rounded-2xl p-5 mb-4 relative overflow-hidden shadow-inner">
          <div class="h-44 flex items-end justify-between gap-2 px-2 pt-4 pb-2 border-b border-white/10">
            <!-- Bar items representing anomaly distribution -->
            <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div class="w-full max-w-[12px] bg-white rounded-t-sm" style="height: 35%;"></div>
              <span class="text-[9px] text-gray-400">Jawa</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div class="w-full max-w-[12px] bg-white rounded-t-sm" style="height: 65%;"></div>
              <span class="text-[9px] text-gray-400">Sum</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div class="w-full max-w-[12px] bg-white rounded-t-sm" style="height: 40%;"></div>
              <span class="text-[9px] text-gray-400">Bali</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div class="w-full max-w-[12px] bg-white rounded-t-sm" style="height: 85%;"></div>
              <span class="text-[9px] text-gray-400">Kal</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div class="w-full max-w-[12px] bg-white rounded-t-sm" style="height: 50%;"></div>
              <span class="text-[9px] text-gray-400">Sul</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div class="w-full max-w-[12px] bg-white rounded-t-sm" style="height: 90%;"></div>
              <span class="text-[9px] text-gray-400">Mal</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div class="w-full max-w-[12px] bg-white rounded-t-sm" style="height: 75%;"></div>
              <span class="text-[9px] text-gray-400">Pap</span>
            </div>
          </div>
          <p class="text-[10px] text-gray-400 text-center mt-2">Tingkat Rasio Anomali per Gugus Wilayah</p>
        </div>

        <!-- Bottom Stats with 4 sub-metrics -->
        <div>
          <h3 class="text-sm font-bold text-gray-800">Distribusi Struktur Kepatuhan</h3>
          <p class="text-xs text-teal-600 font-bold mt-0.5">
            (+15%) <span class="text-gray-400 font-normal">potensi kebocoran iuran teridentifikasi</span>
          </p>

          <div class="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
            <div>
              <div class="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-500 mb-1">
                <div class="w-4 h-4 rounded bg-teal-500 flex items-center justify-center text-white">
                  <Wallet class="w-2.5 h-2.5" />
                </div>
                <span>Flat UMP</span>
              </div>
              <p class="text-sm font-bold text-gray-800">245 BU</p>
              <div class="w-full bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                <div class="bg-teal-500 h-full rounded-full w-[80%]"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-500 mb-1">
                <div class="w-4 h-4 rounded bg-teal-500 flex items-center justify-center text-white">
                  <Activity class="w-2.5 h-2.5" />
                </div>
                <span>Entropy</span>
              </div>
              <p class="text-sm font-bold text-gray-800">0.145</p>
              <div class="w-full bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                <div class="bg-teal-500 h-full rounded-full w-[60%]"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-500 mb-1">
                <div class="w-4 h-4 rounded bg-teal-500 flex items-center justify-center text-white">
                  <UserX class="w-2.5 h-2.5" />
                </div>
                <span>Defisit</span>
              </div>
              <p class="text-sm font-bold text-gray-800">14,8k</p>
              <div class="w-full bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                <div class="bg-teal-500 h-full rounded-full w-[75%]"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-500 mb-1">
                <div class="w-4 h-4 rounded bg-teal-500 flex items-center justify-center text-white">
                  <CheckCircle2 class="w-2.5 h-2.5" />
                </div>
                <span>Target</span>
              </div>
              <p class="text-sm font-bold text-gray-800">300 BU</p>
              <div class="w-full bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                <div class="bg-teal-500 h-full rounded-full w-[90%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Analytics Card: Area Chart (7 Cols) -->
      <div class="lg:col-span-7 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-800">Tren Deteksi Anomali & Kepatuhan Regional</h3>
          <p class="text-xs text-teal-600 font-bold mt-0.5">
            (+5%) lebih akurat <span class="text-gray-400 font-normal">dengan kalibrasi UMP 2026</span>
          </p>
        </div>

        <!-- SVG Multi-wave Area Chart matching Purity UI style -->
        <div class="w-full h-56 mt-4 relative">
          <svg viewBox="0 0 600 220" class="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4FD1C5" stop-opacity="0.4" />
                <stop offset="100%" stop-color="#4FD1C5" stop-opacity="0.0" />
              </linearGradient>
              <linearGradient id="darkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2D3748" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#2D3748" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Horizontal Grid lines -->
            <line x1="40" y1="30" x2="580" y2="30" stroke="#EDF2F7" stroke-dasharray="4" />
            <line x1="40" y1="75" x2="580" y2="75" stroke="#EDF2F7" stroke-dasharray="4" />
            <line x1="40" y1="120" x2="580" y2="120" stroke="#EDF2F7" stroke-dasharray="4" />
            <line x1="40" y1="165" x2="580" y2="165" stroke="#EDF2F7" stroke-dasharray="4" />

            <!-- Y Axis labels -->
            <text x="15" y="35" fill="#A0AEC0" font-size="10">500</text>
            <text x="15" y="80" fill="#A0AEC0" font-size="10">400</text>
            <text x="15" y="125" fill="#A0AEC0" font-size="10">300</text>
            <text x="15" y="170" fill="#A0AEC0" font-size="10">200</text>

            <!-- Dark Curve: Normal baseline -->
            <path
              d="M 50 40 Q 100 160 150 145 T 250 120 T 350 150 T 450 110 T 550 140 L 550 190 L 50 190 Z"
              fill="url(#darkGrad)"
            />
            <path
              d="M 50 40 Q 100 160 150 145 T 250 120 T 350 150 T 450 110 T 550 140"
              fill="none"
              stroke="#2D3748"
              stroke-width="2.5"
            />

            <!-- Teal Curve: Anomaly Detection Rate -->
            <path
              d="M 50 140 Q 120 120 180 80 T 280 60 T 380 90 T 480 65 T 550 55 L 550 190 L 50 190 Z"
              fill="url(#tealGrad)"
            />
            <path
              d="M 50 140 Q 120 120 180 80 T 280 60 T 380 90 T 480 65 T 550 55"
              fill="none"
              stroke="#4FD1C5"
              stroke-width="3"
            />

            <!-- X Axis Month labels -->
            <text x="50" y="210" fill="#A0AEC0" font-size="10">Jan</text>
            <text x="100" y="210" fill="#A0AEC0" font-size="10">Feb</text>
            <text x="150" y="210" fill="#A0AEC0" font-size="10">Mar</text>
            <text x="200" y="210" fill="#A0AEC0" font-size="10">Apr</text>
            <text x="250" y="210" fill="#A0AEC0" font-size="10">Mei</text>
            <text x="300" y="210" fill="#A0AEC0" font-size="10">Jun</text>
            <text x="350" y="210" fill="#A0AEC0" font-size="10">Jul</text>
            <text x="400" y="210" fill="#A0AEC0" font-size="10">Agu</text>
            <text x="450" y="210" fill="#A0AEC0" font-size="10">Sep</text>
            <text x="500" y="210" fill="#A0AEC0" font-size="10">Okt</text>
            <text x="540" y="210" fill="#A0AEC0" font-size="10">Des</text>
          </svg>
        </div>
      </div>
    </div>

    <!-- Row 4: Two Bottom Cards (Projects & Orders Style) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Left Projects Table: Triage Priority Queue (8 Cols) -->
      <div class="lg:col-span-8 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-gray-800">Antrean Prioritas Triase Wasrik</h3>
              <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5 text-teal-500" />
                <span class="font-bold text-gray-700">300 entitas</span> anomali siap audit
              </p>
            </div>
            <RouterLink to="/triage" class="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              Lihat Semua <ArrowRight class="w-3.5 h-3.5" />
            </RouterLink>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100">
                <tr>
                  <th class="py-3 px-3">BADAN USAHA</th>
                  <th class="py-3 px-3">WILAYAH & SEKTOR</th>
                  <th class="py-3 px-3">FLAT UMP</th>
                  <th class="py-3 px-3">DEFISIT</th>
                  <th class="py-3 px-3">STATUS & PROGRESS</th>
                  <th class="py-3 px-3 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="(c, idx) in store.companies.slice(0, 6)"
                  :key="c.company_id"
                  class="hover:bg-gray-50/80 transition-colors"
                >
                  <td class="py-3.5 px-3">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm" :class="companyIcons[idx % companyIcons.length].bg">
                        {{ companyIcons[idx % companyIcons.length].letter }}
                      </div>
                      <div>
                        <span class="font-bold text-gray-800 block">{{ c.company_id }}</span>
                        <span class="text-[10px] text-gray-400">{{ companyIcons[idx % companyIcons.length].name }}</span>
                      </div>
                    </div>
                  </td>

                  <td class="py-3.5 px-3">
                    <span class="font-medium text-gray-700 block">{{ c.provinsi }}</span>
                    <span class="text-[10px] text-gray-400">{{ c.sektor_kbli }}</span>
                  </td>

                  <td class="py-3.5 px-3">
                    <span class="font-bold" :class="c.pct_flat_ump >= 0.7 ? 'text-rose-600' : 'text-gray-700'">
                      {{ (c.pct_flat_ump * 100).toFixed(1) }}%
                    </span>
                  </td>

                  <td class="py-3.5 px-3">
                    <span class="font-bold" :class="c.headcount_deficit > 0 ? 'text-amber-600' : 'text-gray-400'">
                      {{ c.headcount_deficit > 0 ? `+${c.headcount_deficit}` : '0' }}
                    </span>
                  </td>

                  <td class="py-3.5 px-3">
                    <div class="w-28">
                      <div class="flex items-center justify-between text-[10px] font-bold mb-1">
                        <span :class="c.label_anomali === 1 ? 'text-rose-600' : 'text-teal-600'">
                          {{ c.label_anomali === 1 ? '88% High Risk' : '12% Normal' }}
                        </span>
                      </div>
                      <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full"
                          :class="c.label_anomali === 1 ? 'bg-rose-500 w-[88%]' : 'bg-teal-500 w-[12%]'"
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td class="py-3.5 px-3 text-right">
                    <RouterLink
                      :to="`/companies/${c.company_id}`"
                      class="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-[11px] transition-colors"
                    >
                      Audit
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Orders Overview: Audit Activity Log Timeline (4 Cols) -->
      <div class="lg:col-span-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <h3 class="text-sm font-bold text-gray-800">Log Aktivitas Wasrik</h3>
          <p class="text-xs text-teal-600 font-bold mt-0.5">
            +30% <span class="text-gray-400 font-normal">verifikasi selesai bulan ini</span>
          </p>

          <!-- Vertical Timeline Items -->
          <div class="space-y-4 mt-5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            <!-- Timeline Item 1 -->
            <div class="flex items-start gap-3 relative">
              <div class="w-7 h-7 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center shrink-0 z-10">
                <Bell class="w-3.5 h-3.5" />
              </div>
              <div>
                <p class="text-xs font-bold text-gray-800">Anomali Flat UMP BU-0013 terdeteksi</p>
                <p class="text-[10px] text-gray-400 mt-0.5">22 DEC 7:20 PM</p>
              </div>
            </div>

            <!-- Timeline Item 2 -->
            <div class="flex items-start gap-3 relative">
              <div class="w-7 h-7 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 z-10">
                <FileText class="w-3.5 h-3.5" />
              </div>
              <div>
                <p class="text-xs font-bold text-gray-800">Draf BAP Klarifikasi #BAP-088 terbit</p>
                <p class="text-[10px] text-gray-400 mt-0.5">21 DEC 11:21 PM</p>
              </div>
            </div>

            <!-- Timeline Item 3 -->
            <div class="flex items-start gap-3 relative">
              <div class="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 z-10">
                <ShoppingCart class="w-3.5 h-3.5" />
              </div>
              <div>
                <p class="text-xs font-bold text-gray-800">Potensi Iuran Tertagih Rp 184 Juta</p>
                <p class="text-[10px] text-gray-400 mt-0.5">21 DEC 9:28 PM</p>
              </div>
            </div>

            <!-- Timeline Item 4 -->
            <div class="flex items-start gap-3 relative">
              <div class="w-7 h-7 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 z-10">
                <CreditCard class="w-3.5 h-3.5" />
              </div>
              <div>
                <p class="text-xs font-bold text-gray-800">Klarifikasi WLTK Defisit 35 Pekerja</p>
                <p class="text-[10px] text-gray-400 mt-0.5">20 DEC 3:52 PM</p>
              </div>
            </div>

            <!-- Timeline Item 5 -->
            <div class="flex items-start gap-3 relative">
              <div class="w-7 h-7 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 z-10">
                <Package class="w-3.5 h-3.5" />
              </div>
              <div>
                <p class="text-xs font-bold text-gray-800">Integrasi Data UMP 2026 38 Provinsi</p>
                <p class="text-[10px] text-gray-400 mt-0.5">19 DEC 11:35 PM</p>
              </div>
            </div>

            <!-- Timeline Item 6 -->
            <div class="flex items-start gap-3 relative">
              <div class="w-7 h-7 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 z-10">
                <ShieldAlert class="w-3.5 h-3.5" />
              </div>
              <div>
                <p class="text-xs font-bold text-gray-800">Kalibrasi Deep Autoencoder Loss</p>
                <p class="text-[10px] text-gray-400 mt-0.5">16 DEC 4:41 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Purity UI Style Footer -->
    <footer class="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
      <p>© 2026, Made with ❤️ by <span class="font-bold text-teal-600">Reksakarya AI Team</span> for BPJS Kesehatan RI.</p>
      <div class="flex items-center gap-4">
        <a href="#" class="hover:text-gray-600 transition-colors">Dokumentasi</a>
        <a href="#" class="hover:text-gray-600 transition-colors">Regulasi Wasrik</a>
        <a href="#" class="hover:text-gray-600 transition-colors">UU PDP No. 27/2022</a>
        <a href="#" class="hover:text-gray-600 transition-colors">Lisensi</a>
      </div>
    </footer>
  </div>
</template>

