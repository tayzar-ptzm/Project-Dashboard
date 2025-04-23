import React, { useState, useContext } from 'react';
import { 
  AppBar, Toolbar, Typography, Box, styled, useTheme, 
  CssBaseline, Avatar, Badge, IconButton, Divider, useMediaQuery,
  Menu, MenuItem, ListItemIcon, ListItemText, Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Mail as MessageIcon,
  Task as TaskIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Settings as SettingsIcon,
  ArrowForward as ViewAllIcon
} from '@mui/icons-material';
import VerticalTabs from './VerticalTabs';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import logo from '../images/ayapay.jpeg';
import { ThemeContext } from '../ThemeContext';

const DashboardLayout = ({ children, activeTab, onTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  // Sample notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New message received',
      description: 'You have 3 unread messages from your team',
      icon: <MessageIcon color="primary" />,
      time: '10 min ago',
      read: false
    },
    {
      id: 2,
      title: 'Task completed',
      description: 'Your project MBX has been approved',
      icon: <TaskIcon color="success" />,
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'System warning',
      description: 'Server maintenance scheduled for tonight',
      icon: <WarningIcon color="warning" />,
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      title: 'Payment processed',
      description: 'Your invoice #12345 has been paid',
      icon: <SuccessIcon color="success" />,
      time: '1 day ago',
      read: true
    }
  ]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const GlassAppBar = styled(AppBar)(({ theme }) => ({
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer + 1
  }));

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      <CssBaseline />
      
      <GlassAppBar position="fixed" elevation={0}>
        <Toolbar sx={{ 
          minHeight: 64,
          paddingLeft: { xs: 1.5, sm: 3 },
          paddingRight: { xs: 1.5, sm: 3 }
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 1, 
              display: { sm: 'none' },
              color: theme.palette.primary.main
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexGrow: 1,
            gap: 1.5
          }}>
            <img 
              src={logo}
              alt="AYA Pay"
              style={{
                height: isMobile ? 32 : 40,
                borderRadius: 8,
                display: 'block'
              }}
            />
            {!isMobile && (
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                PROJECT DASHBOARD
              </Typography>
            )}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            position: 'relative',
            alignItems: 'center', 
            gap: 1
          }}>
            <IconButton onClick={toggleDarkMode} color="inherit" size={isMobile ? 'small' : 'medium'}>
              {darkMode ? <Brightness7Icon fontSize={isMobile ? 'small' : 'medium'} /> : <Brightness4Icon fontSize={isMobile ? 'small' : 'medium'} />}
            </IconButton>
            
            {/* Notification Icon with Dropdown */}
            <IconButton 
              color="inherit" 
              size={isMobile ? 'small' : 'medium'}
              onClick={handleNotificationsClick}
              aria-controls={open ? 'notification-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Badge badgeContent={unreadCount} color="error" size={isMobile ? 'small' : 'medium'}>
                <NotificationsIcon fontSize={isMobile ? 'small' : 'medium'} />
              </Badge>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              id="notification-menu"
              open={open}
              onClose={handleNotificationsClose}
              onClick={handleNotificationsClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  width: 350,
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {unreadCount} new notifications
                </Typography>
              </Box>
              
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <MenuItem 
                      key={notification.id} 
                      sx={{
                        backgroundColor: !notification.read ? theme.palette.action.selected : 'inherit',
                        borderLeft: !notification.read ? `3px solid ${theme.palette.primary.main}` : 'none',
                        py: 1.5,
                        px: 2
                      }}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {notification.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              display="block"
                            >
                              {notification.description}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {notification.time}
                            </Typography>
                          </>
                        }
                      />
                    </MenuItem>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No new notifications
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ 
                p: 1, 
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <Button 
                  size="small" 
                  startIcon={<SettingsIcon />}
                  onClick={() => {
                    handleNotificationsClose();
                    // Navigate to notification settings
                  }}
                >
                  Settings
                </Button>
                <Button 
                  size="small" 
                  endIcon={<ViewAllIcon />}
                  onClick={() => {
                    markAllAsRead();
                    handleNotificationsClose();
                    // Navigate to all notifications page
                  }}
                >
                  View All
                </Button>
              </Box>
            </Menu>

            {!isMobile && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1,
                padding: '4px 8px',
                borderRadius: '12px',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: `1px solid ${theme.palette.divider}`
              }}>
                <Avatar 
                  sx={{ 
                    width: 30, 
                    height: 30,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600
                  }}
                >
                  A
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Admin User
                </Typography>
              </Box>
            )}
          </Box>
        </Toolbar>
      </GlassAppBar>

      <Box 
        component="nav"
        sx={{
          width: { sm: 200 },
          flexShrink: { sm: 0 },
          zIndex: theme.zIndex.drawer,
        }}
      >
        <VerticalTabs 
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2 },
          width: { sm: `calc(100% - 200px)` },
          marginLeft: { sm: '30px' },
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      >
        <Box sx={{ 
          flex: 1, 
          mb: 1,
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto'
        }}>
          {children}
        </Box>
        
        {!isMobile && (
          <Box 
            component="footer"
            sx={{ 
              mt: 'auto',
              py: 1,
              px: 2,
              textAlign: 'center',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
              borderTop: `1px solid ${theme.palette.divider}`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            <Typography variant="caption" sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              © {new Date().getFullYear()} AYA Bank - All rights reserved
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardLayout;