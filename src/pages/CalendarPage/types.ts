import type { MaintenanceJob, Ship, Component } from '../../store/shipStore';

export type CalendarView = 'month' | 'week';

export interface CalendarProps {
  jobs: MaintenanceJob[];
  ships: Ship[];
  components: Component[];
  currentDate: Date;
  selectedDate: Date | null;
  viewType: CalendarView;
  onDateClick: (day: number, month?: number) => void;
}

export interface CalendarHeaderProps {
  viewType: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onGoToToday: () => void;
}

export interface JobDetailsDialogProps {
  open: boolean;
  selectedDate: Date | null;
  selectedJobs: MaintenanceJob[];
  onClose: () => void;
}


