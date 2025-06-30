import type { Ship } from '../../store/shipStore';

export interface ShipFormData {
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  description?: string;
  yearBuilt?: number;
  owner?: string;
}

export interface ShipTableProps {
  ships: Ship[];
  onView: (ship: Ship) => void;
  onEdit: (ship: Ship) => void;
  onDelete: (ship: Ship) => void;
}

export interface ShipFormDialogProps {
  open: boolean;
  editingShip: Ship | null;
  onClose: () => void;
  onSubmit: (data: ShipFormData) => void;
}

export interface ShipDeleteDialogProps {
  open: boolean;
  shipToDelete: Ship | null;
  onClose: () => void;
  onConfirm: () => void;
}
