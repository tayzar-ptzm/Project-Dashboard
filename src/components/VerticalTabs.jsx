/* eslint-disable no-unused-vars */
import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  styled, 
  useTheme,
  Typography,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Timeline as MilestonesIcon,
  ListAlt as ProgressIcon,
  AttachMoney as BudgetIcon,
  People as ResourcesIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';


const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  borderRadius: 8,
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(1, 1.5),
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(210, 165, 169, 0.16)' 
      : 'rgba(114, 47, 55, 0.08)',
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: theme.palette.primary.main
    }
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(210, 165, 169, 0.08)' 
      : 'rgba(114, 47, 55, 0.04)'
  }
}));

const VerticalTabs = ({ mobileOpen, handleDrawerToggle, activeTab, onTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tabs = [
    { label: 'Dashboard', icon: <DashboardIcon /> },
    { label: 'Milestones', icon: <MilestonesIcon /> },
    { label: 'Progress', icon: <ProgressIcon /> },
    { label: 'Budget', icon: <BudgetIcon /> },
    { label: 'Resources', icon: <ResourcesIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> }
  ];

  const drawerContent = (
    <Box sx={{ 
      overflow: 'auto',
      pt: 8,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper
    }}>
      <List sx={{ flex: 1 }}>
        {tabs.map((tab, index) => (
          <ListItem key={tab.label} disablePadding>
            <StyledListItemButton
              selected={activeTab === index}
              onClick={(e) => {
                onTabChange(e, index);
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 36,
                color: activeTab === index 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary
              }}>
                {tab.icon}
              </ListItemIcon>
              <ListItemText 
                primary={tab.label} 
                primaryTypographyProps={{ 
                  variant: isMobile ? 'body2' : 'body1',
                  fontWeight: activeTab === index ? 600 : 500,
                  noWrap: true
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ 
        p: 1.5,
        textAlign: 'center',
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="caption" color="text.secondary">
          v1.0.0
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
        <LightbulbOutlinedIcon fontSize="small" color="warning" />
        <Typography variant="caption" color="text.secondary">
          powered by <strong>Innovation Labs</strong>
        </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ 
          keepMounted: true,
          BackdropProps: {
            style: {
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(0, 0, 0, 0.7)' 
                : 'rgba(0, 0, 0, 0.5)'
            }
          }
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            width: 220,
            borderRight: 'none',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[16],
            top: '14px',
            height: 'calc(100vh - 64px)'
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            width: 220,
            borderRight: 'none',
            backgroundColor: theme.palette.background.paper,
            position: 'fixed',
            top: '14px',
            height: 'calc(100vh - 64px)'
          }
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default VerticalTabs;