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

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(1, 1.5),
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)',
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 700,
      color: theme.palette.primary.main,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const VerticalTabs = ({ mobileOpen, handleDrawerToggle, activeTab, onTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tabs = [
    { label: 'Dashboard', icon: <DashboardIcon /> },
    { label: 'Milestones', icon: <MilestonesIcon /> },
    { label: 'Progress', icon: <ProgressIcon /> },
    { label: 'Budget (Dept)', icon: <BudgetIcon /> },
    { label: 'Budget (Project)', icon: <BudgetIcon /> },
    { label: 'Resources', icon: <ResourcesIcon /> },
    { label: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ 
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      pt: 2,
      backgroundColor: theme.palette.background.paper,
    }}>
      <List sx={{ flexGrow: 1 }}>
        {tabs.map((tab, index) => (
          <ListItem key={tab.label} disablePadding>
            <StyledListItemButton
              selected={activeTab === index}
              onClick={(e) => {
                onTabChange(e, index);
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: activeTab === index
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                }}
              >
                {tab.icon}
              </ListItemIcon>
              <ListItemText 
                primary={tab.label}
                primaryTypographyProps={{
                  variant: isMobile ? 'body2' : 'body1',
                  noWrap: true,
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>

      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          v1.0.0
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
          <LightbulbOutlinedIcon fontSize="small" color="warning" />
          <Typography variant="caption" color="text.secondary">
            Powered by <strong>Innovation Labs</strong>
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
              backdropFilter: 'blur(6px)',
              backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.7)'
                : 'rgba(0, 0, 0, 0.4)',
            },
          },
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: 240,
            top: '64px',
            height: 'calc(100% - 64px)',
            backgroundColor: theme.palette.background.paper,
            borderRight: 'none',
            boxShadow: theme.shadows[20],
          },
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
            width: 240,
            top: '64px',
            height: 'calc(100% - 64px)',
            backgroundColor: theme.palette.background.paper,
            borderRight: 'none',
            boxShadow: theme.shadows[4],
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default VerticalTabs;
