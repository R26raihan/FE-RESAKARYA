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

// ─── Dashboard Endpoint Types (new) ──────────────────────────────────────────

/** Response dari GET /dashboard/kpis — 4 stat card utama */
export interface DashboardKPI {
  total_companies: number;
  total_anomalies: number;
  total_headcount_deficit: number;
  avg_wage_normal: number;
  anomaly_rate_pct: number;
  avg_pct_flat_ump_anomali: number;
  total_leakage_estimate_monthly: number;
  total_leakage_estimate_annual: number;
}

/** Response dari GET /dashboard/wilayah-distribution — bar chart anomali per wilayah */
export interface DashboardWilayahItem {
  wilayah: string;
  total_companies: number;
  total_anomalies: number;
  anomaly_ratio_pct: number;
}

/** Response dari GET /dashboard/sektor-distribution — distribusi per sektor */
export interface DashboardSektorItem {
  sektor_kbli: string;
  total_companies: number;
  total_anomalies: number;
  total_normal: number;
  anomaly_rate_pct: number;
  avg_shannon_entropy: number;
  avg_pct_flat_ump: number;
}

/** Response dari GET /dashboard/compliance-stats — 4 sub-metric card */
export interface DashboardComplianceStats {
  flat_ump_extreme_count: number;
  flat_ump_extreme_pct: number;
  avg_entropy_anomali: number;
  total_headcount_deficit: number;
  target_audit_monthly: number;
}

/** Response dari GET /dashboard/triage-queue-summary — KPI cards halaman triage */
export interface TriageQueueSummary {
  total_high_risk: number;
  anomaly_rate_pct: number;
  low_entropy_flat_ump_count: number;
  low_entropy_flat_ump_pct: number;
  leakage_estimate_monthly: number;
  leakage_estimate_annual: number;
  sop_audit_days: number;
}

/** Item dari GET /dashboard/audit-activity-log — sidebar timeline */
export interface AuditActivityLogItem {
  id: number;
  type: string;
  icon_type: string;
  color: string;
  title: string;
  description: string;
  timestamp: string;
  timestamp_label: string;
}

/** Response dari POST /predict/single */
export interface PredictionResult {
  company_id?: string;
  prediction: 0 | 1;
  prediction_label: string;
  anomaly_probability: number;
  compliance_risk_score: number;
  triage_urgency: string;
  status_badge: 'Merah' | 'Kuning' | 'Hijau';
}

// ─── XAI & RAG Types ─────────────────────────────────────────────────────────

export interface FeatureContribution {
  feature_name: string;
  display_name: string;
  feature_value: any;
  shap_value: number;
  contribution_pct: number;
  direction: 'increases_risk' | 'decreases_risk';
  interpretation: string;
}

export interface LegalGround {
  act_name: string;
  article: string;
  description: string;
  sanction: string;
}

export interface InvestigationRecommendation {
  action: string;
  priority: string;
  focus_area: string;
  documents_required: string[];
}

export interface XAIExplanationResponse {
  company_id: string;
  provinsi: string;
  sektor_kbli: string;
  skala_usaha: string;
  total_workers_edabu: number;
  headcount_deficit: number;
  pct_flat_ump: number;
  shannon_entropy: number;
  wage_gap_ratio_bps: number;
  mean_gaji_lapor: number;
  median_gaji_lapor: number;
  prediction_label: string;
  is_anomaly: boolean;
  compliance_risk_score: number;
  triage_urgency: string;
  estimated_monthly_leakage: number;
  estimated_annual_leakage: number;
  shap_features: FeatureContribution[];
  ai_audit_narrative: string;
  ai_summary: string;
  legal_grounds: LegalGround[];
  recommendations: InvestigationRecommendation[];
  model_version: string;
  llm_model: string;
  generated_at: string;
}

