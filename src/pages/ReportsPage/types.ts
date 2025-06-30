import type { Ship, MaintenanceJob, Component } from '../../store/shipStore';

export interface ReportFormData {
  type: 'fleet_status' | 'maintenance_summary' | 'performance_analysis' | 'cost_analysis';
  startDate: string;
  endDate: string;
  shipIds: string[];
  includeDetails: boolean;
}

export interface ReportData {
  title: string;
  generatedAt: string;
  period: string;
  summary: Record<string, unknown>;
  details?: unknown[];
  jobsByType?: Record<string, number>;
  recommendations?: string[];
}

export interface ReportGeneratorDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ReportFormData) => void;
}

export interface ReportDisplayProps {
  report: ReportData | null;
  onExport: (format: 'pdf' | 'excel' | 'csv') => void;
}

export interface QuickStatsProps {
  ships: Ship[];
  jobs: MaintenanceJob[];
  components: Component[];
}
