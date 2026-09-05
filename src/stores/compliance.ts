import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/api/client';
import type {
  CompanySummary,
  CompanyDetail,
  ComplianceKPI,
  RegionalUMP,
  SektorDistribution,
  WilayahDistribution
} from '@/types';

// Default initial mock data for immediate instant rendering
const initialKpis: ComplianceKPI = {
  total_companies: 2000,
  total_workers: 54300,
  total_anomalies: 300,
  anomaly_rate_percent: 15.0,
  total_headcount_deficit: 14850,
  avg_wage_normal: 5850000,
  avg_wage_anomaly: 3620000,
  avg_entropy_normal: 0.825,
  avg_entropy_anomaly: 0.165,
};

const initialSektor: SektorDistribution[] = [
  { sektor: 'Manufaktur', total_companies: 620, anomalies: 112, anomaly_rate_pct: 18.1, avg_salary: 4320000 },
  { sektor: 'Jasa Keuangan', total_companies: 380, anomalies: 28, anomaly_rate_pct: 7.4, avg_salary: 8750000 },
  { sektor: 'Retail', total_companies: 450, anomalies: 84, anomaly_rate_pct: 18.7, avg_salary: 3950000 },
  { sektor: 'Perkebunan', total_companies: 310, anomalies: 52, anomaly_rate_pct: 16.8, avg_salary: 3450000 },
  { sektor: 'Konstruksi', total_companies: 240, anomalies: 24, anomaly_rate_pct: 10.0, avg_salary: 5120000 },
];

const initialCompanies: CompanySummary[] = [
  {
    company_id: 'BU-0013',
    provinsi: 'DKI Jakarta',
    sektor_kbli: 'Manufaktur',
    skala_usaha: 'Besar',
    total_workers_edabu: 125,
    headcount_deficit: 35,
    mean_gaji_lapor: 5410000,
    median_gaji_lapor: 5410000,
    pct_flat_ump: 0.88,
    wage_gap_ratio_bps: 0.52,
    shannon_entropy: 0.145,
    label_anomali: 1,
  },
  {
    company_id: 'BU-0042',
    provinsi: 'Jawa Barat',
    sektor_kbli: 'Retail',
    skala_usaha: 'Menengah',
    total_workers_edabu: 82,
    headcount_deficit: 18,
    mean_gaji_lapor: 2280000,
    median_gaji_lapor: 2280000,
    pct_flat_ump: 0.79,
    wage_gap_ratio_bps: 0.48,
    shannon_entropy: 0.210,
    label_anomali: 1,
  },
  {
    company_id: 'BU-0098',
    provinsi: 'Jawa Timur',
    sektor_kbli: 'Perkebunan',
    skala_usaha: 'Besar',
    total_workers_edabu: 210,
    headcount_deficit: 42,
    mean_gaji_lapor: 2320000,
    median_gaji_lapor: 2320000,
    pct_flat_ump: 0.85,
    wage_gap_ratio_bps: 0.55,
    shannon_entropy: 0.180,
    label_anomali: 1,
  },
  {
    company_id: 'BU-0125',
    provinsi: 'Banten',
    sektor_kbli: 'Manufaktur',
    skala_usaha: 'Menengah',
    total_workers_edabu: 64,
    headcount_deficit: 12,
    mean_gaji_lapor: 3100000,
    median_gaji_lapor: 3100000,
    pct_flat_ump: 0.72,
    wage_gap_ratio_bps: 0.42,
    shannon_entropy: 0.280,
    label_anomali: 1,
  },
  {
    company_id: 'BU-0005',
    provinsi: 'DKI Jakarta',
    sektor_kbli: 'Jasa Keuangan',
    skala_usaha: 'Besar',
    total_workers_edabu: 150,
    headcount_deficit: 0,
    mean_gaji_lapor: 11200000,
    median_gaji_lapor: 10500000,
    pct_flat_ump: 0.05,
    wage_gap_ratio_bps: 0.08,
    shannon_entropy: 0.892,
    label_anomali: 0,
  },
  {
    company_id: 'BU-0018',
    provinsi: 'Jawa Tengah',
    sektor_kbli: 'Konstruksi',
    skala_usaha: 'Kecil',
    total_workers_edabu: 28,
    headcount_deficit: 0,
    mean_gaji_lapor: 3650000,
    median_gaji_lapor: 3500000,
    pct_flat_ump: 0.12,
    wage_gap_ratio_bps: 0.15,
    shannon_entropy: 0.745,
    label_anomali: 0,
  }
];


export const useComplianceStore = defineStore('compliance', () => {
  const kpis = ref<ComplianceKPI>(initialKpis);
  const companies = ref<CompanySummary[]>(initialCompanies);
  const totalCompanies = ref(2000);
  const currentPage = ref(1);
  const totalPages = ref(100);
  const pageSize = ref(20);
  const selectedCompany = ref<CompanyDetail | null>(null);
  
  const regionalData = ref<RegionalUMP[]>([]);
  const sektorDistribution = ref<SektorDistribution[]>(initialSektor);
  const wilayahDistribution = ref<WilayahDistribution[]>([]);
  
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Filters
  const filterProvinsi = ref('');
  const filterSektor = ref('');
  const filterSkala = ref('');
  const filterLabelAnomali = ref<number | null>(null);
  const searchQuery = ref('');

  async function fetchKPIs() {
    try {
      const res = await apiClient.get<ComplianceKPI>('/analytics/kpi');
      if (res.data) kpis.value = res.data;
    } catch (err: any) {
      console.warn('API unavailable, keeping mock KPIs:', err.message);
    }
  }

  async function fetchSektorDistribution() {
    try {
      const res = await apiClient.get<SektorDistribution[]>('/analytics/sektor-distribution');
      if (res.data && res.data.length > 0) sektorDistribution.value = res.data;
    } catch (err: any) {
      console.warn('API unavailable, keeping mock Sektor:', err.message);
    }
  }

  async function fetchWilayahDistribution() {
    try {
      const res = await apiClient.get<WilayahDistribution[]>('/analytics/wilayah-distribution');
      if (res.data && res.data.length > 0) wilayahDistribution.value = res.data;
    } catch (err: any) {
      console.warn('API unavailable, keeping mock Wilayah:', err.message);
    }
  }

  async function fetchRegionalUMP() {
    try {
      const res = await apiClient.get<RegionalUMP[]>('/regional/ump');
      if (res.data && res.data.length > 0) regionalData.value = res.data;
    } catch (err: any) {
      console.warn('API unavailable, generating fallback Regional UMP:', err.message);
      if (regionalData.value.length === 0) {
        regionalData.value = [
          { no: 1, provinsi: 'DKI Jakarta', wilayah: 'Jawa', ump_2026: 5410000, upah_riil_rata_bps: 6150000, pertumbuhan_nominal: 350000, rasio_ump_vs_upah_bps: 0.88, estimasi_cagr_persen: 6.5 },
          { no: 2, provinsi: 'Jawa Barat', wilayah: 'Jawa', ump_2026: 2280000, upah_riil_rata_bps: 3340000, pertumbuhan_nominal: 180000, rasio_ump_vs_upah_bps: 0.68, estimasi_cagr_persen: 5.8 },
          { no: 3, provinsi: 'Jawa Timur', wilayah: 'Jawa', ump_2026: 2320000, upah_riil_rata_bps: 3100000, pertumbuhan_nominal: 195000, rasio_ump_vs_upah_bps: 0.75, estimasi_cagr_persen: 6.1 },
          { no: 4, provinsi: 'Jawa Tengah', wilayah: 'Jawa', ump_2026: 2150000, upah_riil_rata_bps: 2850000, pertumbuhan_nominal: 160000, rasio_ump_vs_upah_bps: 0.75, estimasi_cagr_persen: 5.9 },
          { no: 5, provinsi: 'Banten', wilayah: 'Jawa', ump_2026: 3100000, upah_riil_rata_bps: 4200000, pertumbuhan_nominal: 220000, rasio_ump_vs_upah_bps: 0.74, estimasi_cagr_persen: 6.2 },
          { no: 6, provinsi: 'Bali', wilayah: 'Bali & Nusa Tenggara', ump_2026: 2950000, upah_riil_rata_bps: 3750000, pertumbuhan_nominal: 210000, rasio_ump_vs_upah_bps: 0.79, estimasi_cagr_persen: 6.0 },
          { no: 7, provinsi: 'Sumatera Utara', wilayah: 'Sumatera', ump_2026: 3050000, upah_riil_rata_bps: 3600000, pertumbuhan_nominal: 200000, rasio_ump_vs_upah_bps: 0.85, estimasi_cagr_persen: 5.7 },
          { no: 8, provinsi: 'Kalimantan Timur', wilayah: 'Kalimantan', ump_2026: 3600000, upah_riil_rata_bps: 4800000, pertumbuhan_nominal: 270000, rasio_ump_vs_upah_bps: 0.75, estimasi_cagr_persen: 6.8 },
          { no: 9, provinsi: 'Sulawesi Selatan', wilayah: 'Sulawesi', ump_2026: 3650000, upah_riil_rata_bps: 4100000, pertumbuhan_nominal: 240000, rasio_ump_vs_upah_bps: 0.89, estimasi_cagr_persen: 6.3 },
          { no: 10, provinsi: 'Papua', wilayah: 'Maluku & Papua', ump_2026: 4250000, upah_riil_rata_bps: 5100000, pertumbuhan_nominal: 310000, rasio_ump_vs_upah_bps: 0.83, estimasi_cagr_persen: 6.4 },
        ];
      }
    }
  }

  async function fetchCompanies(page = 1) {
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
      console.warn('API unavailable, keeping current mock companies:', err.message);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCompanyDetail(companyId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await apiClient.get<CompanyDetail>(`/companies/${companyId}`);
      if (res.data) {
        selectedCompany.value = res.data;
        return res.data;
      }
    } catch (err: any) {
      console.warn('API unavailable, using fallback CompanyDetail for:', companyId);
      selectedCompany.value = {
        company_id: companyId || 'BU-0013',
        provinsi: 'DKI Jakarta',
        sektor_kbli: 'Manufaktur',
        skala_usaha: 'Besar',
        total_workers_edabu: 125,
        pct_flat_ump: 0.88,
        wage_gap_ratio_bps: 0.52,
        shannon_entropy: 0.145,
        headcount_deficit: 35,
        mean_gaji_lapor: 5410000,
        median_gaji_lapor: 5410000,
        label_anomali: 1,
        workers: [
          { worker_id: 'WKR-1001', company_id: companyId, provinsi: 'DKI Jakarta', jabatan: 'Operator / Pekerja Kasar', gaji_lapor: 5410000, ref_ump_2026: 5410000, ref_upah_bps: 6150000, is_flat_ump: 1 },
          { worker_id: 'WKR-1002', company_id: companyId, provinsi: 'DKI Jakarta', jabatan: 'Operator / Pekerja Kasar', gaji_lapor: 5410000, ref_ump_2026: 5410000, ref_upah_bps: 6150000, is_flat_ump: 1 },
          { worker_id: 'WKR-1003', company_id: companyId, provinsi: 'DKI Jakarta', jabatan: 'Staf Teknis / Administrasi', gaji_lapor: 5410000, ref_ump_2026: 5410000, ref_upah_bps: 6150000, is_flat_ump: 1 },
          { worker_id: 'WKR-1004', company_id: companyId, provinsi: 'DKI Jakarta', jabatan: 'Supervisor / Koordinator', gaji_lapor: 5410000, ref_ump_2026: 5410000, ref_upah_bps: 6150000, is_flat_ump: 1 },
          { worker_id: 'WKR-1005', company_id: companyId, provinsi: 'DKI Jakarta', jabatan: 'Manajerial / Direksi', gaji_lapor: 7500000, ref_ump_2026: 5410000, ref_upah_bps: 6150000, is_flat_ump: 0 },
        ]
      };
      return selectedCompany.value;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    kpis,
    companies,
    totalCompanies,
    currentPage,
    totalPages,
    pageSize,
    selectedCompany,
    regionalData,
    sektorDistribution,
    wilayahDistribution,
    isLoading,
    error,
    filterProvinsi,
    filterSektor,
    filterSkala,
    filterLabelAnomali,
    searchQuery,
    fetchKPIs,
    fetchSektorDistribution,
    fetchWilayahDistribution,
    fetchRegionalUMP,
    fetchCompanies,
    fetchCompanyDetail,
  };
});

