import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/api/client';
import type {
  CompanySummary,
  CompanyDetail,
  ComplianceKPI,
  RegionalUMP,
  SektorDistribution,
  WilayahDistribution,
  DashboardKPI,
  DashboardWilayahItem,
  DashboardSektorItem,
  DashboardComplianceStats,
  TriageQueueSummary,
  AuditActivityLogItem,
  PredictionResult,
  XAIExplanationResponse,
} from '@/types';

export const useComplianceStore = defineStore('compliance', () => {
  // ─── Core state (semua null/empty — tidak ada data dummy) ──────────────────
  const kpis = ref<ComplianceKPI | null>(null);
  const dashboardKpis = ref<DashboardKPI | null>(null);
  const companies = ref<CompanySummary[]>([]);
  const totalCompanies = ref(0);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const pageSize = ref(20);
  const selectedCompany = ref<CompanyDetail | null>(null);
  const selectedCompanyXAI = ref<XAIExplanationResponse | null>(null);
  const isGeneratingXAI = ref(false);

  const regionalData = ref<RegionalUMP[]>([]);
  const sektorDistribution = ref<SektorDistribution[]>([]);
  const wilayahDistribution = ref<WilayahDistribution[]>([]);

  // ─── Dashboard-specific state ──────────────────────────────────────────────
  const dashboardWilayah = ref<DashboardWilayahItem[]>([]);
  const dashboardSektor = ref<DashboardSektorItem[]>([]);
  const dashboardComplianceStats = ref<DashboardComplianceStats | null>(null);
  const triageQueueSummary = ref<TriageQueueSummary | null>(null);
  const auditActivityLog = ref<AuditActivityLogItem[]>([]);
  const lastPrediction = ref<PredictionResult | null>(null);

  // ─── UI state ──────────────────────────────────────────────────────────────
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // State untuk melacak error per-endpoint
  const apiErrors = ref<Record<string, string>>({});

  // ─── Filters ───────────────────────────────────────────────────────────────
  const filterProvinsi = ref('');
  const filterSektor = ref('');
  const filterSkala = ref('');
  const filterLabelAnomali = ref<number | null>(null);
  const searchQuery = ref('');

  // ─── Helper ───────────────────────────────────────────────────────────────
  function setError(key: string, message: string) {
    apiErrors.value[key] = message;
    console.error(`[API ERROR] ${key}:`, message);
  }

  function clearError(key: string) {
    delete apiErrors.value[key];
  }

  // ─── Analytics endpoints (lama, tetap ada untuk backward compat) ──────────
  async function fetchKPIs() {
    clearError('kpis');
    try {
      const res = await apiClient.get<ComplianceKPI>('/analytics/kpi');
      if (res.data) kpis.value = res.data;
    } catch (err: any) {
      setError('kpis', err.message ?? 'Gagal mengambil KPI analytics');
    }
  }

  async function fetchSektorDistribution() {
    clearError('sektor_distribution');
    try {
      const res = await apiClient.get<SektorDistribution[]>('/analytics/sektor-distribution');
      if (res.data) sektorDistribution.value = res.data;
    } catch (err: any) {
      setError('sektor_distribution', err.message ?? 'Gagal mengambil distribusi sektor');
    }
  }

  async function fetchWilayahDistribution() {
    clearError('wilayah_distribution');
    try {
      const res = await apiClient.get<WilayahDistribution[]>('/analytics/wilayah-distribution');
      if (res.data) wilayahDistribution.value = res.data;
    } catch (err: any) {
      setError('wilayah_distribution', err.message ?? 'Gagal mengambil distribusi wilayah');
    }
  }

  // ─── Dashboard dedicated endpoints ────────────────────────────────────────

  async function fetchDashboardKPIs() {
    clearError('dashboard_kpis');
    try {
      const res = await apiClient.get<DashboardKPI>('/dashboard/kpis');
      if (res.data) dashboardKpis.value = res.data;
    } catch (err: any) {
      setError('dashboard_kpis', err.message ?? 'Gagal mengambil dashboard KPI');
    }
  }

  async function fetchDashboardWilayah() {
    clearError('dashboard_wilayah');
    try {
      const res = await apiClient.get<DashboardWilayahItem[]>('/dashboard/wilayah-distribution');
      if (res.data) dashboardWilayah.value = res.data;
    } catch (err: any) {
      setError('dashboard_wilayah', err.message ?? 'Gagal mengambil distribusi wilayah dashboard');
    }
  }

  async function fetchDashboardSektor() {
    clearError('dashboard_sektor');
    try {
      const res = await apiClient.get<DashboardSektorItem[]>('/dashboard/sektor-distribution');
      if (res.data) dashboardSektor.value = res.data;
    } catch (err: any) {
      setError('dashboard_sektor', err.message ?? 'Gagal mengambil distribusi sektor dashboard');
    }
  }

  async function fetchComplianceStats() {
    clearError('compliance_stats');
    try {
      const res = await apiClient.get<DashboardComplianceStats>('/dashboard/compliance-stats');
      if (res.data) dashboardComplianceStats.value = res.data;
    } catch (err: any) {
      setError('compliance_stats', err.message ?? 'Gagal mengambil compliance stats');
    }
  }

  async function fetchTriageQueueSummary() {
    clearError('triage_summary');
    try {
      const res = await apiClient.get<TriageQueueSummary>('/dashboard/triage-queue-summary');
      if (res.data) triageQueueSummary.value = res.data;
    } catch (err: any) {
      setError('triage_summary', err.message ?? 'Gagal mengambil ringkasan triage');
    }
  }

  async function fetchAuditActivityLog() {
    clearError('audit_log');
    try {
      const res = await apiClient.get<AuditActivityLogItem[]>('/dashboard/audit-activity-log');
      if (res.data) auditActivityLog.value = res.data;
    } catch (err: any) {
      setError('audit_log', err.message ?? 'Gagal mengambil log aktivitas');
    }
  }

  async function predictCompany(companyId: string): Promise<PredictionResult | null> {
    clearError('predict');
    try {
      const res = await apiClient.post<PredictionResult>(`/predict/from-db/${companyId}`);
      if (res.data) lastPrediction.value = res.data;
      return res.data;
    } catch (err: any) {
      setError('predict', err.message ?? 'Gagal menjalankan prediksi');
      return null;
    }
  }

  // ─── Regional UMP ──────────────────────────────────────────────────────────
  async function fetchRegionalUMP() {
    clearError('regional_ump');
    try {
      const res = await apiClient.get<RegionalUMP[]>('/regional/ump');
      if (res.data) regionalData.value = res.data;
    } catch (err: any) {
      setError('regional_ump', err.message ?? 'Gagal mengambil data UMP regional');
    }
  }

  // ─── Companies ────────────────────────────────────────────────────────────
  async function fetchCompanies(page = 1) {
    clearError('companies');
    isLoading.value = true;
    error.value = null;
    currentPage.value = page;
    try {
      const params: Record<string, any> = {
        page: currentPage.value,
        page_size: pageSize.value,
      };
      if (filterProvinsi.value) params.provinsi = filterProvinsi.value;
      if (filterSektor.value) params.sektor = filterSektor.value;
      if (filterSkala.value) params.skala = filterSkala.value;
      if (filterLabelAnomali.value !== null) params.label_anomali = filterLabelAnomali.value;
      if (searchQuery.value) params.search = searchQuery.value;

      const res = await apiClient.get('/companies', { params });
      if (res.data && res.data.items) {
        companies.value = res.data.items;
        totalCompanies.value = res.data.total;
        totalPages.value = res.data.total_pages;
      }
    } catch (err: any) {
      error.value = err.message ?? 'Gagal mengambil daftar Badan Usaha';
      setError('companies', error.value!);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCompanyDetail(companyId: string) {
    clearError('company_detail');
    isLoading.value = true;
    error.value = null;
    try {
      const res = await apiClient.get<CompanyDetail>(`/companies/${companyId}`);
      if (res.data) {
        selectedCompany.value = res.data;
        return res.data;
      }
    } catch (err: any) {
      setError('fetchCompanyDetail', err.message);
      selectedCompany.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCompanyXAI(companyId: string) {
    clearError('fetchCompanyXAI');
    isGeneratingXAI.value = true;
    try {
      const { data } = await apiClient.get<XAIExplanationResponse>(`/xai/explain/${companyId}`, {
        timeout: 60000,
      });
      selectedCompanyXAI.value = data;
      return data;
    } catch (err: any) {
      setError('fetchCompanyXAI', err.message);
      return null;
    } finally {
      isGeneratingXAI.value = false;
    }
  }

  return {
    // State
    kpis,
    dashboardKpis,
    companies,
    totalCompanies,
    currentPage,
    totalPages,
    pageSize,
    selectedCompany,
    selectedCompanyXAI,
    isGeneratingXAI,
    regionalData,
    sektorDistribution,
    wilayahDistribution,
    dashboardWilayah,
    dashboardSektor,
    dashboardComplianceStats,
    triageQueueSummary,
    auditActivityLog,
    lastPrediction,
    isLoading,
    error,
    apiErrors,
    // Filters
    filterProvinsi,
    filterSektor,
    filterSkala,
    filterLabelAnomali,
    searchQuery,
    // Actions — Analytics
    fetchKPIs,
    fetchSektorDistribution,
    fetchWilayahDistribution,
    // Actions — Dashboard
    fetchDashboardKPIs,
    fetchDashboardWilayah,
    fetchDashboardSektor,
    fetchComplianceStats,
    fetchTriageQueueSummary,
    fetchAuditActivityLog,
    predictCompany,
    // Actions — Regional & Companies
    fetchRegionalUMP,
    fetchCompanies,
    fetchCompanyDetail,
    fetchCompanyXAI,
  };
});
