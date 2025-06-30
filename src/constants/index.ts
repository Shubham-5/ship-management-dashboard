export const APP_NAME = 'Ship Management Dashboard';
export const APP_VERSION = '1.0.0';

export const USER_ROLES = {
  ADMIN: 'Admin',
  INSPECTOR: 'Inspector',
  ENGINEER: 'Engineer'
} as const;

export const JOB_PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
} as const;

export const JOB_STATUSES = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
} as const;

export const SHIP_STATUSES = {
  ACTIVE: 'Active',
  UNDER_MAINTENANCE: 'Under Maintenance',
  INACTIVE: 'Inactive'
} as const;
