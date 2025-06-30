import type { MaintenanceJob, Ship, Component } from '../../../../store/shipStore';

export interface JobsTableProps {
  jobs: MaintenanceJob[];
  ships: Ship[];
  components: Component[];
  onEditJob: (job: MaintenanceJob) => void;
  onDeleteJob: (job: MaintenanceJob) => void;
}
