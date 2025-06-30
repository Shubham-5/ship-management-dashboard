import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  DirectionsBoat,
  Build,
  CalendarToday,
  Notifications,
  Assessment,
  Logout
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useShipStore } from '../../store/shipStore';
import type { MenuItemType } from './types';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { unreadCount, initializeNotifications } = useNotificationStore();
  const { checkOverdueJobs } = useShipStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    initializeNotifications();
    checkOverdueJobs();
    
    const interval = setInterval(() => {
      checkOverdueJobs();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [initializeNotifications, checkOverdueJobs]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const getMenuIcon = (item: MenuItemType) => {
    if (item.path === '/notifications') {
      return (
        <Badge badgeContent={unreadCount} color="error">
          {item.icon}
        </Badge>
      );
    }
    return item.icon;
  };

  const menuItems: MenuItemType[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Ships', icon: <DirectionsBoat />, path: '/ships' },
    { text: 'Maintenance Jobs', icon: <Build />, path: '/jobs' },
    { text: 'Calendar', icon: <CalendarToday />, path: '/calendar' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: '#1e293b' }}>
      <Toolbar 
        sx={{ 
          minHeight: '64px !important',
          height: 64,
          paddingY: 0,
          paddingX: 3,
          borderBottom: '1px solid #334155',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              backgroundColor: '#3b82f6',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DirectionsBoat sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              lineHeight: 1,
              color: '#ffffff',
              letterSpacing: '-0.025em',
            }}
          >
            FleetSync
          </Typography>
        </Box>
      </Toolbar>
      
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#94a3b8',
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: 2,
            display: 'block',
          }}
        >
          Navigation
        </Typography>
        
        <List sx={{ paddingTop: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  minHeight: 48,
                  paddingY: 2,
                  paddingX: 2,
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  color: '#cbd5e1',
                  '&:hover': {
                    backgroundColor: '#334155',
                    color: '#ffffff',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  {getMenuIcon(item)}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          height: 64,
          minHeight: 64,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          color: '#1e293b',
        }}
      >
        <Toolbar 
          sx={{ 
            paddingY: 0,
            paddingX: 3,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' }, 
              padding: 1,
              color: '#64748b'
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography 
              variant="h5" 
              noWrap 
              component="div" 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 700,
                lineHeight: 1,
                color: '#0f172a',
                letterSpacing: '-0.025em',
              }}
            >
              {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.875rem',
                    lineHeight: 1.2,
                    color: '#1e293b',
                    fontWeight: 500,
                  }}
                >
                  {user?.name || user?.email}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '0.75rem',
                  }}
                >
                  Fleet Manager
                </Typography>
              </Box>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                sx={{ 
                  padding: 0.5,
                  '&:hover': { 
                    backgroundColor: '#f1f5f9',
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    backgroundColor: '#3b82f6',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          width: { sm: `calc(100vw - ${drawerWidth}px)` },
          minHeight: '100vh',
          paddingTop: '64px',
          backgroundColor: '#f8fafc',
        }}
      >
        <Box sx={{ 
          padding: 4, 
          height: 'calc(100vh - 64px)', 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f5f9',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: '#94a3b8',
            },
          },
        }}>
          <Outlet />
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="profile-menu"
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{ py: 1.5, px: 2 }}>
          <Avatar sx={{ width: 36, height: 36, mr: 2, backgroundColor: '#3b82f6' }}>
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Profile Settings
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Manage your account
            </Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2, color: '#dc2626' }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: '#dc2626' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Sign Out
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout;
