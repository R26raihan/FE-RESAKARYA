<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useComplianceStore } from '@/stores/compliance';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Scale,
  DollarSign,
  ShieldAlert,
  FolderCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-vue-next';

const props = defineProps<{
  companyId: string;
}>();

const store = useComplianceStore();
const copied = ref(false);
const showAllRegulations = ref(false);

onMounted(async () => {
  if (props.companyId && (!store.selectedCompanyXAI || store.selectedCompanyXAI.company_id !== props.companyId)) {
    await store.fetchCompanyXAI(props.companyId);
  }
});

async function handleRefresh() {
  await store.fetchCompanyXAI(props.companyId);
}

const xaiData = computed(() => store.selectedCompanyXAI);

function formatRupiah(val?: number) {
  if (!val || val === 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

async function copyNarrative() {
  if (!xaiData.value?.ai_audit_narrative) return;
  try {
    await navigator.clipboard.writeText(xaiData.value.ai_audit_narrative);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2500);
  } catch (err) {
    console.error('Failed to copy', err);
  }
}
</script>

<template>
  <div class="rounded-2xl bg-white border border-gray-100 shadow-[0_20px_27px_0_rgba(0,0,0,0.05)] overflow-hidden">
    <!-- Header Banner -->
    <div class="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 shadow-[0_4px_16px_0_rgba(45,212,191,0.4)]">
          <BrainCircuit class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-black tracking-tight">Explainable AI (XAI) & RAG Audit Engine</h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
              <Sparkles class="w-3 h-3" /> Gemini 2.5 Flash
            </span>
          </div>
          <p class="text-xs text-slate-300 mt-0.5">
            Dekomposisi atribusi fitur (SHAP) & Rekonstruksi Narasi Audit Investigasi Wasrik
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="handleRefresh"
          :disabled="store.isGeneratingXAI"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-50"
          title="Hitung Ulang Analisis AI"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': store.isGeneratingXAI }" />
          {{ store.isGeneratingXAI ? 'Menganalisis...' : 'Re-Generate AI' }}
        </button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="store.isGeneratingXAI && !xaiData" class="p-8 text-center space-y-3">
      <div class="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs font-bold text-gray-700">Menghitung Nilai SHAP & Menghasilkan Narasi Audit via Gemini Flash...</p>
      <p class="text-[11px] text-gray-400">Menyusun dasar hukum dan rekomendasi dokumen audit</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="xaiData" class="p-6 space-y-6">
      <!-- 1. Risk Score & Urgency Banner -->
      <div
        class="p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border"
        :class="xaiData.is_anomaly ? 'bg-rose-50/70 border-rose-200' : 'bg-teal-50/70 border-teal-200'"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            :class="xaiData.is_anomaly ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'"
          >
            <ShieldAlert v-if="xaiData.is_anomaly" class="w-5 h-5" />
            <CheckCircle2 v-else class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase tracking-wider" :class="xaiData.is_anomaly ? 'text-rose-800' : 'text-teal-800'">
                {{ xaiData.prediction_label }}
              </span>
              <span class="text-xs font-bold text-gray-500">• {{ xaiData.triage_urgency }}</span>
            </div>
            <p class="text-xs text-gray-600 mt-1">
              {{ xaiData.ai_summary }}
            </p>
          </div>
        </div>

        <div class="text-right shrink-0">
          <p class="text-[10px] uppercase font-bold text-gray-500">Compliance Risk Score</p>
          <p class="text-2xl font-black" :class="xaiData.is_anomaly ? 'text-rose-600' : 'text-teal-600'">
            {{ xaiData.compliance_risk_score.toFixed(1) }} <span class="text-xs font-normal text-gray-400">/ 100</span>
          </p>
        </div>
      </div>

      <!-- 2. SHAP Feature Attribution Decomposition (Bar Chart) -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-teal-600" />
            <h4 class="text-xs font-black text-gray-800 uppercase tracking-wider">
              Dekomposisi Kontribusi Faktor Anomali (SHAP Attribution)
            </h4>
          </div>
          <span class="text-[11px] text-gray-400 font-medium">Model: Random Forest Triager v{{ xaiData.model_version }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="feat in xaiData.shap_features"
            :key="feat.feature_name"
            class="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="text-xs font-bold text-gray-800">{{ feat.display_name }}</p>
                <p class="text-[11px] text-gray-500 mt-0.5">{{ feat.interpretation }}</p>
              </div>
              <span
                class="px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0"
                :class="feat.direction === 'increases_risk' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'"
              >
                {{ feat.direction === 'increases_risk' ? '+' : '-' }}{{ feat.contribution_pct }}%
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="mt-2.5 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="feat.direction === 'increases_risk' ? 'bg-rose-500' : 'bg-emerald-500'"
                :style="{ width: `${Math.min(100, Math.max(5, feat.contribution_pct))}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Financial Revenue Leakage Summary -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80">
          <div class="flex items-center gap-2 text-amber-800">
            <DollarSign class="w-4 h-4" />
            <p class="text-[11px] font-bold uppercase tracking-wider">Estimasi Kebocoran Iuran / Bulan (5%)</p>
          </div>
          <p class="text-xl font-black text-amber-900 mt-1">
            {{ formatRupiah(xaiData.estimated_monthly_leakage) }}
          </p>
          <p class="text-[11px] text-amber-700 mt-0.5">Potensi iuran JKN yang tidak disetorkan setiap bulan</p>
        </div>

        <div class="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-red-50/50 border border-rose-200/80">
          <div class="flex items-center gap-2 text-rose-800">
            <DollarSign class="w-4 h-4" />
            <p class="text-[11px] font-bold uppercase tracking-wider">Proyeksi Tunggakan / Tahun</p>
          </div>
          <p class="text-xl font-black text-rose-900 mt-1">
            {{ formatRupiah(xaiData.estimated_annual_leakage) }}
          </p>
          <p class="text-[11px] text-rose-700 mt-0.5">Akumulasi 12 bulan potensi penerimaan kembali (recovery)</p>
        </div>
      </div>

      <!-- 4. GenAI Generated Audit Narrative -->
      <div class="p-5 rounded-xl bg-slate-50 border border-slate-200">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 text-slate-800">
            <FileText class="w-4 h-4 text-teal-600" />
            <h4 class="text-xs font-black uppercase tracking-wider">
              Draf Laporan Investigasi AI (Legal-Ready Audit Narrative)
            </h4>
          </div>
          <button
            @click="copyNarrative"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-sm transition-all"
          >
            <Check v-if="copied" class="w-3.5 h-3.5 text-teal-600" />
            <Copy v-else class="w-3.5 h-3.5" />
            {{ copied ? 'Tersalin!' : 'Salin Laporan' }}
          </button>
        </div>

        <div class="prose prose-xs max-w-none text-xs text-gray-700 whitespace-pre-line leading-relaxed font-sans bg-white p-4 rounded-xl border border-gray-200">
          {{ xaiData.ai_audit_narrative }}
        </div>
      </div>

      <!-- 5. Recommendations & Evidence Checklist for Wasrik -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Action items -->
        <div class="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div class="flex items-center gap-2">
            <FolderCheck class="w-4 h-4 text-teal-600" />
            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Tindakan Prioritas Pemeriksaan
            </h4>
          </div>

          <div class="space-y-2">
            <div
              v-for="(rec, idx) in xaiData.recommendations"
              :key="idx"
              class="p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div class="flex items-center justify-between">
                <p class="text-xs font-bold text-gray-800">{{ rec.action }}</p>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {{ rec.priority }}
                </span>
              </div>
              <p class="text-[11px] text-gray-500 mt-1">Fokus: {{ rec.focus_area }}</p>
            </div>
          </div>
        </div>

        <!-- Evidence Checklist -->
        <div class="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div class="flex items-center gap-2">
            <Scale class="w-4 h-4 text-teal-600" />
            <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Daftar Bukti Wajib Klarifikasi (Wasrik Summons)
            </h4>
          </div>

          <ul class="space-y-2 text-xs text-gray-700">
            <li class="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
              <CheckCircle2 class="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>Rekapitulasi Payroll & Slip Gaji Asli 12 Bulan Terakhir</span>
            </li>
            <li class="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
              <CheckCircle2 class="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>Surat Pemberitahuan Tahunan (SPT Masa PPh 21) Formulir 1721</span>
            </li>
            <li class="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
              <CheckCircle2 class="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>Rekening Koran Payroll Bank Pembayaran Upah Pekerja</span>
            </li>
            <li class="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
              <CheckCircle2 class="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
              <span>Bukti Lapor Wajib Ketenagakerjaan Perusahaan (WLTK) Terbaru</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 6. Legal Grounds Grounding Reference (Expandable) -->
      <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
        <button
          @click="showAllRegulations = !showAllRegulations"
          class="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-900"
        >
          <span class="flex items-center gap-2">
            <Scale class="w-4 h-4 text-teal-600" />
            Landasan Yuridis Regulasi Kepatuhan (UU & PP Terkait)
          </span>
          <component :is="showAllRegulations ? ChevronUp : ChevronDown" class="w-4 h-4 text-gray-400" />
        </button>

        <div v-if="showAllRegulations" class="mt-4 space-y-3 pt-3 border-t border-gray-200">
          <div
            v-for="(leg, idx) in xaiData.legal_grounds"
            :key="idx"
            class="p-3 rounded-lg bg-white border border-gray-200 text-xs space-y-1"
          >
            <div class="flex items-center justify-between font-bold text-gray-800">
              <span>{{ leg.act_name }}</span>
              <span class="text-teal-600 font-mono text-[11px]">{{ leg.article }}</span>
            </div>
            <p class="text-gray-600 text-[11px]">{{ leg.description }}</p>
            <p class="text-rose-700 text-[11px] font-medium"><strong class="text-rose-800">Sanksi:</strong> {{ leg.sanction }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
