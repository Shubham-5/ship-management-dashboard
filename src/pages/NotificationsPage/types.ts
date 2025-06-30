import type { Notification } from '../../store/notificationStore';

export interface NotificationStatsProps {
  totalCount: number;
  unreadCount: number;
  highPriorityCount: number;
  maintenanceAlertsCount: number;
}

export interface NotificationTabsProps {
  selectedTab: number;
  notifications: Notification[];
  unreadCount: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export interface NotificationListProps {
  notifications: Notification[];
  selectedTab: number;
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
}

export interface ClearConfirmDialogProps {
  open: boolean;
  notificationCount: number;
  onClose: () => void;
  onConfirm: () => void;
}
