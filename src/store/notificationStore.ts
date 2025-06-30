import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/localStorage';

export interface Notification {
  id: string;
  type: 'job_created' | 'job_updated' | 'job_completed' | 'maintenance_overdue' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  relatedEntityId?: string; // Could be job ID, ship ID, etc.
  relatedEntityType?: 'job' | 'ship' | 'component';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getUnreadNotifications: () => Notification[];
  initializeNotifications: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const createJobNotification = (
  type: 'job_created' | 'job_updated' | 'job_completed',
  jobType: string,
  shipName: string,
  componentName: string,
  jobId: string,
  priority: Notification['priority'] = 'medium'
): Omit<Notification, 'id' | 'timestamp' | 'read'> => {
  const messages = {
    job_created: {
      title: 'New Maintenance Job Created',
      message: `${jobType} job created for ${componentName} on ${shipName}`
    },
    job_updated: {
      title: 'Maintenance Job Updated',
      message: `${jobType} job for ${componentName} on ${shipName} has been updated`
    },
    job_completed: {
      title: 'Maintenance Job Completed',
      message: `${jobType} job for ${componentName} on ${shipName} has been completed`
    }
  };

  return {
    type,
    title: messages[type].title,
    message: messages[type].message,
    priority,
    relatedEntityId: jobId,
    relatedEntityType: 'job'
  };
};

export const createMaintenanceOverdueNotification = (
  componentName: string,
  shipName: string,
  componentId: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> => ({
  type: 'maintenance_overdue',
  title: 'Maintenance Overdue',
  message: `${componentName} on ${shipName} is overdue for maintenance`,
  priority: 'high',
  relatedEntityId: componentId,
  relatedEntityType: 'component'
});

const initializeDefaultNotifications = () => {
  const existingNotifications = getFromStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
  if (!existingNotifications) {
    const defaultNotifications: Notification[] = [
      {
        id: 'n1',
        type: 'job_created',
        title: 'New Maintenance Job Created',
        message: 'Inspection job created for Main Engine on Ever Given',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium',
        relatedEntityId: 'j1',
        relatedEntityType: 'job'
      },
      {
        id: 'n2',
        type: 'maintenance_overdue',
        title: 'Maintenance Overdue',
        message: 'Radar on Maersk Alabama is overdue for maintenance',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        priority: 'high',
        relatedEntityId: 'c2',
        relatedEntityType: 'component'
      },
      {
        id: 'n3',
        type: 'job_updated',
        title: 'Maintenance Job Updated',
        message: 'Repair job for Radar on Maersk Alabama status changed to In Progress',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        read: true,
        priority: 'medium',
        relatedEntityId: 'j2',
        relatedEntityType: 'job'
      },
      {
        id: 'n4',
        type: 'system',
        title: 'Welcome to Ship Management Dashboard',
        message: 'Your dashboard has been set up successfully. You can now manage your fleet and maintenance schedules.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
        priority: 'low'
      }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, defaultNotifications);
  }
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: generateId(),
          timestamp: new Date().toISOString(),
          read: false
        };
        
        const notifications = [newNotification, ...get().notifications];
        const unreadCount = notifications.filter(n => !n.read).length;
        
        set({ notifications, unreadCount });
        saveToStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, notifications);
      },

      markAsRead: (id) => {
        const notifications = get().notifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        );
        const unreadCount = notifications.filter(n => !n.read).length;
        
        set({ notifications, unreadCount });
        saveToStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, notifications);
      },

      markAllAsRead: () => {
        const notifications = get().notifications.map(notification => ({
          ...notification,
          read: true
        }));
        
        set({ notifications, unreadCount: 0 });
        saveToStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, notifications);
      },

      deleteNotification: (id) => {
        const notifications = get().notifications.filter(n => n.id !== id);
        const unreadCount = notifications.filter(n => !n.read).length;
        
        set({ notifications, unreadCount });
        saveToStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, notifications);
      },

      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
        saveToStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
      },

      getUnreadNotifications: () => {
        return get().notifications.filter(n => !n.read);
      },

      initializeNotifications: () => {
        initializeDefaultNotifications();
        const notifications = getFromStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS) || [];
        const unreadCount = notifications.filter((n: Notification) => !n.read).length;
        set({ notifications, unreadCount });
      }
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({ 
        notifications: state.notifications,
        unreadCount: state.unreadCount 
      }),
    }
  )
);
