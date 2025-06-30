import React from 'react';
import { Tabs, Tab } from '@mui/material';
import type { NotificationTabsProps } from '../../types';

const NotificationTabs: React.FC<NotificationTabsProps> = ({
  selectedTab,
  notifications,
  unreadCount,
  onTabChange
}) => {
  const jobNotificationsCount = notifications.filter(n => n.type.includes('job')).length;
  const alertsCount = notifications.filter(n => n.type === 'maintenance_overdue').length;

  return (
    <Tabs 
      value={selectedTab} 
      onChange={onTabChange} 
      sx={{ 
        mb: 2,
        '& .MuiTab-root': {
          fontWeight: 500,
          textTransform: 'none',
          color: '#64748b',
          '&.Mui-selected': {
            color: '#3b82f6',
            fontWeight: 600,
          },
        },
        '& .MuiTabs-indicator': {
          backgroundColor: '#3b82f6',
        },
      }}
    >
      <Tab label={`All (${notifications.length})`} />
      <Tab label={`Unread (${unreadCount})`} />
      <Tab label={`Jobs (${jobNotificationsCount})`} />
      <Tab label={`Alerts (${alertsCount})`} />
    </Tabs>
  );
};

export default NotificationTabs;
