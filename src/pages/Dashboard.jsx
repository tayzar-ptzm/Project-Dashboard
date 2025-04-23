/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ProjectStatusCards from '../components/ProjectStatusCards';
import MilestoneGantt from '../components/MilestoneGantt';
import ProjectProgressTable from '../components/ProjectProgressTable';
import BudgetVsActual from '../components/BudgetVsActual';
import ResourceUtilization from '../components/ResourceUtilization';
import SettingPage from '../components/SettingPage';
import { Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const tabContent = [
    <ProjectStatusCards key="overview" />,
    <MilestoneGantt key="milestones" />,
    <ProjectProgressTable key="progress" />,
    <BudgetVsActual key="budget" />,
    <ResourceUtilization key="resources" />,
    <SettingPage key="settingpage" />
    ];

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      onTabChange={handleTabChange}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Paper sx={{
            p: isMobile ? 2 : 3,
            borderRadius: 4,
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.background.paper,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${theme.palette.divider}`,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            overflowX: 'auto'
          }}>
            {tabContent[activeTab]}
          </Paper>
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;