import React from 'react';
import { Box, Typography, CardContent } from '@mui/material';
import { Card } from '../../../../components';
import type { NotificationStatsProps } from '../../types';

const NotificationStats: React.FC<NotificationStatsProps> = ({
  totalCount,
  unreadCount,
  highPriorityCount,
  maintenanceAlertsCount
}) => {
  const stats = [
    {
      value: totalCount,
      label: 'Total Notifications',
      color: '#3b82f6'
    },
    {
      value: unreadCount,
      label: 'Unread',
      color: '#ef4444'
    },
    {
      value: highPriorityCount,
      label: 'High Priority',
      color: '#f59e0b'
    },
    {
      value: maintenanceAlertsCount,
      label: 'Maintenance Alerts',
      color: '#06b6d4'
    }
  ];

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
      gap: 3, 
    }}>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: stat.color, 
                mb: 1,
                fontSize: '2rem',
              }}
            >
              {stat.value}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b', 
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              {stat.label}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default NotificationStats;
