export interface RegionalUMP {
  no: number;
  provinsi: string;
  wilayah: string;
  ump_2026: number;
  upah_riil_rata_bps: number;
  pertumbuhan_nominal: number;
  rasio_ump_vs_upah_bps: number;
  estimasi_cagr_persen: number;
}

export interface SektoralWage {
  provinsi: string;
  sektor_id: number;
  sektor: string;
  upah_rata_bps: number;
  rasio_pertumbuhan_ump: number;
  estimasi_upah_sektoral_2026: number;
}

export interface WorkerMicro {
  worker_id: string;
  company_id: string;
  provinsi: string;
  jabatan: string;
  gaji_lapor: number;
  ref_ump_2026: number;
  ref_upah_bps: number;
  is_flat_ump: number;
}

export interface CompanySummary {
  company_id: string;
  provinsi: string;
  sektor_kbli: string;
  skala_usaha: string;
  total_workers_edabu: number;
  headcount_deficit: number;
  mean_gaji_lapor: number;
  median_gaji_lapor: number;
  pct_flat_ump: number;
  wage_gap_ratio_bps: number;
  shannon_entropy: number;
  label_anomali: number;
}

export interface CompanyDetail extends CompanySummary {
  workers?: WorkerMicro[];
}

export interface ComplianceKPI {
  total_companies: number;
  total_workers: number;
  total_anomalies: number;
  anomaly_rate_percent: number;
  total_headcount_deficit: number;
  avg_wage_normal: number;
  avg_wage_anomaly: number;
  avg_entropy_normal: number;
  avg_entropy_anomaly: number;
}

export interface SektorDistribution {
  sektor: string;
  total_companies: number;
  anomalies: number;
  anomaly_rate_pct: number;
  avg_salary: number;
}

export interface WilayahDistribution {
  wilayah: string;
  total_provinces: number;
  avg_ump_2026: number;
  min_ump_2026: number;
  max_ump_2026: number;
}
