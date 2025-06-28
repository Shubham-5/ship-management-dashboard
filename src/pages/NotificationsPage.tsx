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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ mr: 2 }}>
            Notifications
          </Typography>
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
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

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main">
              {notifications.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Notifications
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="error.main">
              {unreadCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unread
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {notifications.filter(n => n.priority === 'critical' || n.priority === 'high').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High Priority
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              {notifications.filter(n => n.type === 'maintenance_overdue').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
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
