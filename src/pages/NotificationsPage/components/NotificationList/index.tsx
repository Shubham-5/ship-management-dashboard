import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  Notifications,
  Delete,
  MarkEmailRead,
  Build,
  Settings,
  Warning,
  Info,
  Error,
  NotificationsActive
} from '@mui/icons-material';
import type { NotificationListProps } from '../../types';
import type { Notification } from '../../../../store/notificationStore';

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  selectedTab,
  onNotificationClick,
  onMarkAsRead,
  onDeleteNotification
}) => {
  const getNotificationIcon = (notification: Notification) => {
    const colorProp = notification.read ? 'disabled' : 'primary';
    
    switch (notification.type) {
      case 'job_created':
      case 'job_updated':
      case 'job_completed':
        return <Build color={colorProp} />;
      case 'maintenance_overdue':
        return <Warning color={notification.read ? 'disabled' : 'error'} />;
      case 'system':
        return <Settings color={notification.read ? 'disabled' : 'info'} />;
      default:
        return <Info color={colorProp} />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical': return <Error />;
      case 'high': return <Warning />;
      case 'medium': return <Info />;
      case 'low': return <NotificationsActive />;
      default: return <Notifications />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (notifications.length === 0) {
    return (
      <Paper sx={{ 
        p: 4, 
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
      }}>
        <Notifications sx={{ 
          fontSize: 64, 
          color: '#9ca3af', 
          mb: 2 
        }} />
        <Typography 
          variant="h6" 
          sx={{
            color: '#374151',
            fontWeight: 600,
            mb: 1,
          }}
        >
          {selectedTab === 1 ? 'No unread notifications' : 'No notifications found'}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#64748b',
          }}
        >
          {selectedTab === 1 
            ? 'You\'re all caught up!' 
            : 'Notifications will appear here when there are updates to your fleet.'
          }
        </Typography>
      </Paper>
    );
  }

  return (
    <List sx={{overflowY: 'auto', maxHeight: 'calc(90vh - 400px)', pb: 10}}>
      {notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          <ListItem
            sx={{
              bgcolor: notification.read ? 'transparent' : '#f8fafc',
              borderRadius: 2,
              mb: 1,
              cursor: 'pointer',
              border: '1px solid #f1f5f9',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: '#f1f5f9',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
              }
            }}
            onClick={() => onNotificationClick(notification)}
          >
            <ListItemIcon>
              {getNotificationIcon(notification)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography 
                    variant="body1" 
                    fontWeight={notification.read ? 'normal' : 'bold'}
                    sx={{ 
                      flexGrow: 1,
                      color: notification.read ? '#64748b' : '#0f172a',
                    }}
                  >
                    {notification.title}
                  </Typography>
                  <Chip
                    label={notification.priority}
                    color={getPriorityColor(notification.priority)}
                    size="small"
                    icon={getPriorityIcon(notification.priority)}
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  />
                  {!notification.read && (
                    <Chip
                      label="New"
                      color="primary"
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
              }
              secondary={
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: '#64748b',
                      mb: 0.5,
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{
                      color: '#9ca3af',
                      fontSize: '0.75rem',
                    }}
                  >
                    {formatTimestamp(notification.timestamp)}
                  </Typography>
                </Box>
              }
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {!notification.read && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  title="Mark as read"
                  sx={{
                    color: '#3b82f6',
                    '&:hover': {
                      backgroundColor: '#eff6ff',
                    },
                  }}
                >
                  <MarkEmailRead />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNotification(notification.id);
                }}
                title="Delete notification"
                sx={{
                  color: '#dc2626',
                  '&:hover': {
                    backgroundColor: '#fef2f2',
                  },
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          </ListItem>
          {index < notifications.length - 1 && (
            <Divider sx={{ my: 1, backgroundColor: '#f1f5f9' }} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default NotificationList;
