import type { MaintenanceJob } from '../../store/shipStore';

export interface JobFormData {
  componentId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Preventive';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedEngineerId: string;
  scheduledDate: string;
  description?: string;
  notes?: string;
}

export interface FilterState {
  shipId: string;
  status: string;
  priority: string;
}


export interface JobFormDialogProps {
  open: boolean;
  editingJob: MaintenanceJob | null;
  onClose: () => void;
  onSubmit: (data: JobFormData) => void;
}

export interface DeleteConfirmDialogProps {
  open: boolean;
  jobToDelete: MaintenanceJob | null;
  onClose: () => void;
  onConfirm: () => void;
}

export interface JobFiltersProps {
  filters: FilterState;
  onFilterChange: (field: keyof FilterState) => (event: { target: { value: string } }) => void;
  onClearFilters: () => void;
}

export interface JobsTableProps {
  jobs: MaintenanceJob[];
  onEdit: (job: MaintenanceJob) => void;
  onDelete: (job: MaintenanceJob) => void;
}
