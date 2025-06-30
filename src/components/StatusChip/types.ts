export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

export interface StatusChipProps {
  label: string;
  status: StatusType;
  size?: 'small' | 'medium';
}
