import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Badge,
  Paper,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Delete,
  MarkEmailRead,
  DoneAll,
  Clear,
  Build,
  Settings,
  Warning,
  Info,
  Error
} from '@mui/icons-material';
import { useNotificationStore, type Notification } from '../store/notificationStore';

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
      case 1: // Unread
        return getUnreadNotifications();
      case 2: // Job Related
        return notifications.filter(n => n.type.includes('job'));
      case 3: // Maintenance Alerts
        return notifications.filter(n => n.type === 'maintenance_overdue');
      default: // All
        return notifications;
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
      case 'job_created':
      case 'job_updated':
      case 'job_completed':
        return <Build color={notification.read ? 'disabled' : 'primary'} />;
      case 'maintenance_overdue':
        return <Warning color={notification.read ? 'disabled' : 'error'} />;
      case 'system':
        return <Settings color={notification.read ? 'disabled' : 'info'} />;
      default:
        return <Info color={notification.read ? 'disabled' : 'primary'} />;
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#0f172a',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  letterSpacing: '-0.025em',
                }}
              >
                Notifications
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#64748b',
                  fontWeight: 400,
                  fontSize: '1.125rem',
                }}
              >
                Stay updated with all system alerts and maintenance updates
              </Typography>
            </Box>
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
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DoneAll />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              sx={{
                borderColor: '#e2e8f0',
                color: '#475569',
                fontWeight: 500,
                px: 3,
                py: 1,
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  borderColor: '#cbd5e1',
                },
                '&:disabled': {
                  borderColor: '#f1f5f9',
                  color: '#cbd5e1',
                },
              }}
            >
              Mark All Read
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Clear />}
              onClick={() => setClearConfirmOpen(true)}
              disabled={notifications.length === 0}
              sx={{
                borderColor: '#fecaca',
                color: '#dc2626',
                fontWeight: 500,
                px: 3,
                py: 1,
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: '#fef2f2',
                  borderColor: '#f87171',
                },
                '&:disabled': {
                  borderColor: '#f1f5f9',
                  color: '#cbd5e1',
                },
              }}
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        <Card sx={{ 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 2,
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#3b82f6', mb: 1 }}>
              {notifications.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Total Notifications
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 2,
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#ef4444', mb: 1 }}>
              {unreadCount}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Unread
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 2,
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b', mb: 1 }}>
              {notifications.filter(n => n.priority === 'critical' || n.priority === 'high').length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              High Priority
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 2,
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#06b6d4', mb: 1 }}>
              {notifications.filter(n => n.type === 'maintenance_overdue').length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              Maintenance Alerts
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          {/* Filter Tabs */}
          <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label={`All (${notifications.length})`} />
            <Tab label={`Unread (${unreadCount})`} />
            <Tab label={`Jobs (${notifications.filter(n => n.type.includes('job')).length})`} />
            <Tab label={`Alerts (${notifications.filter(n => n.type === 'maintenance_overdue').length})`} />
          </Tabs>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {selectedTab === 1 ? 'No unread notifications' : 'No notifications found'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTab === 1 
                  ? 'You\'re all caught up!' 
                  : 'Notifications will appear here when there are updates to your fleet.'
                }
              </Typography>
            </Paper>
          ) : (
            <List>
              {filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.selected'
                      }
                    }}
                    onClick={() => handleNotificationClick(notification)}
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
                            sx={{ flexGrow: 1 }}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.priority}
                            color={getPriorityColor(notification.priority)}
                            size="small"
                            icon={getPriorityIcon(notification.priority)}
                          />
                          {!notification.read && (
                            <Chip
                              label="New"
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
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
                            markAsRead(notification.id);
                          }}
                          title="Mark as read"
                        >
                          <MarkEmailRead />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        title="Delete notification"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Clear All Confirmation Dialog */}
      <Dialog
        open={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
      >
        <DialogTitle>Clear All Notifications</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography>
            Are you sure you want to delete all notifications? This will permanently remove all {notifications.length} notifications.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              clearAllNotifications();
              setClearConfirmOpen(false);
            }} 
            color="error" 
            variant="contained"
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsPage;
