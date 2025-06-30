import type { Ship, Component, MaintenanceJob } from '../../store/shipStore';

export interface ComponentFormData {
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  status: 'Good' | 'Needs Maintenance' | 'Critical';
  description?: string;
}

export interface ShipInfoCardProps {
  ship: Ship;
  onEditShip: () => void;
}

export interface ComponentsTableProps {
  components: Component[];
  onEditComponent: (component: Component) => void;
  onDeleteComponent: (component: Component) => void;
  onAddComponent: () => void;
}

export interface MaintenanceJobsTableProps {
  jobs: MaintenanceJob[];
  components: Component[];
  onViewJob: (jobId: string) => void;
}

export interface ComponentFormDialogProps {
  open: boolean;
  editingComponent: Component | null;
  onClose: () => void;
  onSubmit: (data: ComponentFormData) => void;
}

export interface DeleteConfirmDialogProps {
  open: boolean;
  componentToDelete: Component | null;
  onClose: () => void;
  onConfirm: () => void;
}
