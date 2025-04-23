/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  AccountCircle as ProfileIcon,
  Security as SecurityIcon,
  Cloud as BackupIcon,
  Info as AboutIcon,
  Lock as PasswordIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';

const SettingsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeSection, setActiveSection] = useState('general');
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC+6:30');
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@ayapay.com',
    avatar: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordChangeRequired: false,
    sessionTimeout: 30
  });

  const handleBackClick = () => {
    if (isMobile && activeSection !== 'general') {
      setActiveSection('general');
    }
  };

  const handleSaveSettings = () => {
    // Implement save logic here
    console.log('Settings saved');
  };

  const renderGeneralSettings = () => (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        General Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="language-label">Language</InputLabel>
            <Select
              labelId="language-label"
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
              startAdornment={
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LanguageIcon />
                </ListItemIcon>
              }
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="mm">မြန်မာ (Burmese)</MenuItem>
              <MenuItem value="zh">中文 (Chinese)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="timezone-label">Timezone</InputLabel>
            <Select
              labelId="timezone-label"
              value={timezone}
              label="Timezone"
              onChange={(e) => setTimezone(e.target.value)}
            >
              <MenuItem value="UTC+6:30">Yangon (UTC+6:30)</MenuItem>
              <MenuItem value="UTC+8">Singapore (UTC+8)</MenuItem>
              <MenuItem value="UTC+0">London (UTC+0)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <List>
        <ListItem>
          <ListItemIcon>
            <ThemeIcon />
          </ListItemIcon>
          <ListItemText primary="Dark Mode" />
          <Switch 
            checked={darkMode} 
            onChange={() => setDarkMode(!darkMode)} 
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Notifications" 
            secondary="Enable system notifications" 
          />
          <Switch 
            checked={notificationsEnabled} 
            onChange={() => setNotificationsEnabled(!notificationsEnabled)} 
          />
        </ListItem>
      </List>
    </Box>
  );

  const renderProfileSettings = () => (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Profile Settings
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{ 
            width: 80, 
            height: 80, 
            mb: 2,
            bgcolor: theme.palette.primary.main
          }}
        >
          {profileData.name.charAt(0)}
        </Avatar>
        <Button variant="outlined" size="small">
          Change Avatar
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
      
      <Button 
        variant="contained" 
        startIcon={<SaveIcon />}
        onClick={handleSaveSettings}
        sx={{ mt: 2 }}
      >
        Save Profile
      </Button>
    </Box>
  );

  const renderSecuritySettings = () => (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Security Settings
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon>
            <PasswordIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Change Password" 
            secondary="Last changed 3 months ago" 
          />
          <Button variant="outlined" size="small">
            Change
          </Button>
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Two-Factor Authentication" 
            secondary="Add an extra layer of security" 
          />
          <Switch 
            checked={securitySettings.twoFactorAuth} 
            onChange={() => setSecuritySettings({
              ...securitySettings, 
              twoFactorAuth: !securitySettings.twoFactorAuth
            })} 
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Delete Account" 
            secondary="Permanently remove your account" 
          />
          <Button variant="outlined" color="error" size="small">
            Delete
          </Button>
        </ListItem>
      </List>
      
      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel id="session-timeout-label">Session Timeout</InputLabel>
        <Select
          labelId="session-timeout-label"
          value={securitySettings.sessionTimeout}
          label="Session Timeout"
          onChange={(e) => setSecuritySettings({
            ...securitySettings, 
            sessionTimeout: e.target.value
          })}
        >
          <MenuItem value={15}>15 minutes</MenuItem>
          <MenuItem value={30}>30 minutes</MenuItem>
          <MenuItem value={60}>1 hour</MenuItem>
          <MenuItem value={0}>Never</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const renderAboutSection = () => (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        About Project Dashboard
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" paragraph>
          Project Dashboard v1.0.0
        </Typography>
        <Typography variant="body2" paragraph>
          © {new Date().getFullYear()} AYA Bank. All rights reserved.
        </Typography>
        <Typography variant="body2" paragraph>
          The Project Dashboard provides comprehensive tools for managing your financial services and monitoring transactions.
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        System Information
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Last Updated" secondary="April 23, 2025" />
        </ListItem>
        <ListItem>
          <ListItemText primary="License" secondary="Proprietary" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Support" secondary="support@ayapay.com" />
        </ListItem>
      </List>
    </Box>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'security':
        return renderSecuritySettings();
      case 'about':
        return renderAboutSection();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <Paper sx={{ 
      borderRadius: 2,
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      {!isMobile && (
        <Box sx={{ 
          width: 240,
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <SettingsIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Settings</Typography>
          </Box>
          <Divider />
          <List>
            <ListItem 
              button 
              selected={activeSection === 'general'}
              onClick={() => setActiveSection('general')}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="General" />
            </ListItem>
            <ListItem 
              button 
              selected={activeSection === 'profile'}
              onClick={() => setActiveSection('profile')}
            >
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem 
              button 
              selected={activeSection === 'security'}
              onClick={() => setActiveSection('security')}
            >
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Security" />
            </ListItem>
            <ListItem 
              button 
              selected={activeSection === 'about'}
              onClick={() => setActiveSection('about')}
            >
              <ListItemIcon>
                <AboutIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
          </List>
        </Box>
      )}
      
      <Box sx={{ 
        flex: 1,
        position: 'relative',
        overflowY: 'auto'
      }}>
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 1,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}>
            {activeSection !== 'general' && (
              <Tooltip title="Back">
                <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
                  <BackIcon />
                </IconButton>
              </Tooltip>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {activeSection === 'general' && 'Settings'}
              {activeSection === 'profile' && 'Profile Settings'}
              {activeSection === 'security' && 'Security Settings'}
              {activeSection === 'about' && 'About'}
            </Typography>
          </Box>
        )}
        
        {isMobile && activeSection === 'general' && (
          <List>
            <ListItem 
              button 
              onClick={() => setActiveSection('profile')}
            >
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile Settings" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => setActiveSection('security')}
            >
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Security Settings" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => setActiveSection('about')}
            >
              <ListItemIcon>
                <AboutIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
          </List>
        )}
        
        {renderSectionContent()}
      </Box>
    </Paper>
  );
};

export default SettingsPage;