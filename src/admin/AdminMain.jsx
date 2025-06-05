import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography,
  Divider 
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MonetizationOn as BudgetIcon,
  People as UserIcon,
  Settings as ResourceIcon,
  ExitToApp as LogoutIcon,
  Work as ProjectIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminMain = () => {
  const [activeTab, setActiveTab] = useState('');
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '' },
    { text: 'Projects', icon: <ProjectIcon />, path: 'projects' },
    { text: 'Budgets', icon: <BudgetIcon />, path: 'budgets' },
    { text: 'Users', icon: <UserIcon />, path: 'users' },
    { text: 'Resources', icon: <ResourceIcon />, path: 'resources' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box' 
          },
        }}
      >
        <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">Admin Portal</Typography>
        </Toolbar>
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                selected={activeTab === item.path}
                component={Link}
                to={`/admin/${item.path}`}
                onClick={() => setActiveTab(item.path)}
              >
                <ListItemIcon sx={{ 
                  color: activeTab === item.path ? 'primary.main' : 'inherit' 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminMain;