import type { MaintenanceJob, Ship, Component } from '../../store/shipStore';

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
}

export interface RecentActivityProps {
  jobs: MaintenanceJob[];
  ships: Ship[];
  components: Component[];
}

export interface ShipStatusOverviewProps {
  ships: Ship[];
  components: Component[];
  jobs: MaintenanceJob[];
}
