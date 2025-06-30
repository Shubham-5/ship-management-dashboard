import React, { useEffect, useState } from 'react';
import { Box, Badge, CardContent } from '@mui/material';
import { DoneAll, Clear, Notifications } from '@mui/icons-material';
import { PageHeader, Button, Card } from '../../components';
import { useNotificationStore } from '../../store/notificationStore';
import NotificationStats from './components/NotificationStats';
import NotificationTabs from './components/NotificationTabs';
import NotificationList from './components/NotificationList';
import ClearConfirmDialog from './components/ClearConfirmDialog';

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadNotifications,
    initializeNotifications
  } = useNotificationStore();

  const [selectedTab, setSelectedTab] = useState(0);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  useEffect(() => {
    initializeNotifications();
  }, [initializeNotifications]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getFilteredNotifications = () => {
    switch (selectedTab) {
      case 1:
        return getUnreadNotifications();
      case 2:
        return notifications.filter(n => n.type.includes('job'));
      case 3:
        return notifications.filter(n => n.type === 'maintenance_overdue');
      default:
        return notifications;
    }
  };

  const handleNotificationClick = (notification: { id: string; read: boolean }) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setClearConfirmOpen(false);
  };

  const filteredNotifications = getFilteredNotifications();
  const highPriorityCount = notifications.filter(n => n.priority === 'critical' || n.priority === 'high').length;
  const maintenanceAlertsCount = notifications.filter(n => n.type === 'maintenance_overdue').length;

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 0,
      overflow: 'hidden',
    }}>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with all system alerts and maintenance updates"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 600,
                },
              }}
            >
              <Box sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: '#eff6ff',
                color: '#3b82f6',
              }}>
                <Notifications sx={{ fontSize: 24 }} />
              </Box>
            </Badge>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DoneAll />}
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark All Read
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Clear />}
                onClick={() => setClearConfirmOpen(true)}
                disabled={notifications.length === 0}
              >
                Clear All
              </Button>
            </Box>
          </Box>
        }
      />

      <Box sx={{ 
        p: 3, 
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>
        <NotificationStats
          totalCount={notifications.length}
          unreadCount={unreadCount}
          highPriorityCount={highPriorityCount}
          maintenanceAlertsCount={maintenanceAlertsCount}
        />

        <Card>
          <CardContent>
            <NotificationTabs
              selectedTab={selectedTab}
              notifications={notifications}
              unreadCount={unreadCount}
              onTabChange={handleTabChange}
            />

            <NotificationList
              notifications={filteredNotifications}
              selectedTab={selectedTab}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={markAsRead}
              onDeleteNotification={deleteNotification}
            />
          </CardContent>
        </Card>
      </Box>

      <ClearConfirmDialog
        open={clearConfirmOpen}
        notificationCount={notifications.length}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={handleClearAll}
      />
    </Box>
  );
};

export default NotificationsPage;
