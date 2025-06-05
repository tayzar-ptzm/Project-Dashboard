/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Box, styled, useTheme,
  CssBaseline, Avatar, Badge, IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText, useMediaQuery, Divider, Tooltip, Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Mail as MessageIcon,
  Task as TaskIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Settings as SettingsIcon,
  ArrowForward as ViewAllIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import VerticalTabs from './VerticalTabs';
import { ThemeContext } from '../ThemeContext';
import { motion } from 'framer-motion';
import logo from '../images/nexovate.svg';

const DashboardLayout = ({ children, activeTab, onTabChange }) => {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuEl, setUserMenuEl] = useState(null);
  const open = Boolean(anchorEl);
  const userMenuOpen = Boolean(userMenuEl);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New message', description: 'You have new messages.', icon: <MessageIcon />, time: '10 min ago', read: false },
    { id: 2, title: 'Task completed', description: 'Project approved.', icon: <TaskIcon color="success" />, time: '1 hour ago', read: false },
    { id: 3, title: 'Warning', description: 'Scheduled maintenance.', icon: <WarningIcon color="warning" />, time: '3 hours ago', read: true },
    { id: 4, title: 'Payment received', description: 'Invoice #123 paid.', icon: <SuccessIcon color="success" />, time: '1 day ago', read: true }
  ]);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
    if (!user) {
      setUser(null);
    }
  }, []);

  const handleLogin = () => {
    navigate('/admin/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleNotificationsClick = (event) => setAnchorEl(event.currentTarget);
  const handleNotificationsClose = () => setAnchorEl(null);
  const handleUserMenuClick = (event) => setUserMenuEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuEl(null);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    handleNotificationsClose();
  };

  const handleAdminNavigate = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home instead of login
    handleUserMenuClose();
  };

  const GlassAppBar = styled(AppBar)(({ theme }) => ({
    backdropFilter: 'blur(12px)',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)',
    boxShadow: theme.shadows[1],
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer + 1
  }));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <CssBaseline />
      <GlassAppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', gap: 1.5 }}>
            <img src={logo} alt="Logo" style={{ height: 40, borderRadius: 8 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ display: 'inline-block' }}
              >
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  sx={{
                    fontWeight: 700,
                    fontFamily: `'Poppins', sans-serif`,
                    background: 'linear-gradient(270deg, #0f62fe, #42be65, #0f62fe)',
                    backgroundSize: '400% 400%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                    lineHeight: 1.1,
                    mb: 0.25,
                    animation: 'gradientMove 8s ease infinite',
                    transition: 'background-position 0.5s ease-in-out',
                    cursor: 'pointer',
                    
                    '@keyframes gradientMove': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                      '100%': { backgroundPosition: '0% 50%' },
                    }
                  }}
                  onClick={handleAdminNavigate}
                >
                  nexovate
                </Typography>
              </motion.div>

              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ mt: 0.1, fontSize: '0.72rem', lineHeight: 1}}
              >
                A centralized view of departmental operations, built for executive insight.
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={toggleDarkMode}
            sx={{
              color: theme.palette.mode === 'dark' ? '#fff' : '#333'
            }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <IconButton
            onClick={handleNotificationsClick}
            sx={{
              color: theme.palette.mode === 'dark' ? '#fff' : '#333'
            }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              overlap="circular"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleNotificationsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1,
                minWidth: 280,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2
              }
            }}
          >
            {notifications.map((n) => (
              <MenuItem
                key={n.id}
                onClick={() => setNotifications(notifications.map(no => no.id === n.id ? { ...no, read: true } : no))}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{n.icon}</ListItemIcon>
                <ListItemText primary={n.title} secondary={n.description} />
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={markAllAsRead}>
              <ListItemIcon><ViewAllIcon /></ListItemIcon>
              <ListItemText primary="Mark all as read" />
            </MenuItem>
          </Menu>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              {isLoggedIn ? (
                <>
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleUserMenuClick} size="small">
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          width: 32,
                          height: 32,
                          fontSize: '0.9rem'
                        }}
                      >
                        {user?.name?.charAt(0) || 'A'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  
                  <Menu
                    anchorEl={userMenuEl}
                    open={userMenuOpen}
                    onClose={handleUserMenuClose}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        minWidth: 180,
                        mt: 1.5,
                      },
                    }}
                  >
                    {user?.role === 'admin' && (
                      <MenuItem onClick={handleAdminNavigate}>
                        <ListItemIcon>
                          <AdminPanelSettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Admin Panel</ListItemText>
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>

                  <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
                    {user?.name || 'User'}
                  </Typography>
                  {user?.role === 'admin' && (
                    <AdminPanelSettingsIcon
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
                      onClick={handleAdminNavigate}
                    />
                  )}
                </>
              ) : (
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={handleLogin}
                  sx={{
                    ml: 1,
                    px: 2,
                    textTransform: 'none',
                    borderRadius: 2
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </GlassAppBar>

      <Box component="nav" sx={{ width: { sm: 200 }, flexShrink: { sm: 0 } }}>
        <VerticalTabs
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 2, width: { sm: `calc(100% - 200px)` }, mt: 8 }}>
        {children}

        {!isMobile && (
          <Box component="footer" sx={{ mt: 2, py: 2, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}`, backdropFilter: 'blur(8px)' }}>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} AYA Bank - All rights reserved
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardLayout;