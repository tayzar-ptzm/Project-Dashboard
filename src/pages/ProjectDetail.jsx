import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Typography, Paper, Box, Grid, LinearProgress, Divider } from '@mui/material';
import { CheckCircle, Warning, Error } from '@mui/icons-material';

const ProjectDetail = () => {
  const { id } = useParams();
  
  // Mock project data - in a real app, this would come from an API
  const projects = {
    MBX: {
      name: 'mBanking 3.0 (MBX)',
      status: 'on-track',
      progress: 75,
      budget: 1200000,
      spent: 950000,
      startDate: '2023-01-01',
      deadline: '2023-10-31',
      manager: 'John Doe',
      teamSize: 15,
      description: 'Next generation mobile banking platform with enhanced features and security',
      milestones: [
        { name: 'Phase 1 - Core Features', completed: true, date: '2023-03-15' },
        { name: 'Phase 2 - Payment Features', completed: true, date: '2023-06-30' },
        { name: 'Phase 3 - Security Enhancements', completed: false, date: '2023-10-31' },
      ],
      risks: [
        { description: 'Regulatory compliance changes', impact: 'Medium', mitigation: 'Regular compliance reviews' },
      ],
    },
    // Add similar data for other projects
  };

  const project = projects[id] || {
    name: 'Project Not Found',
    status: 'unknown',
    progress: 0,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle color="success" />;
      case 'at-risk':
        return <Warning color="warning" />;
      case 'off-track':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          {getStatusIcon(project.status)}
          <Typography variant="h4" ml={1}>
            {project.name}
          </Typography>
        </Box>
        
        <Typography variant="body1" mb={3}>
          {project.description}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Project Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    color={
                      project.status === 'on-track'
                        ? 'success'
                        : project.status === 'at-risk'
                        ? 'warning'
                        : 'error'
                    }
                    sx={{ height: 10 }}
                  />
                </Box>
                <Typography variant="body1">
                  {project.progress}%
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Budget Status
              </Typography>
              <Typography variant="body1">
                Budget: ${project.budget?.toLocaleString() || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Spent: ${project.spent?.toLocaleString() || 'N/A'}
              </Typography>
              {project.budget && project.spent && (
                <Typography variant="body1">
                  Remaining: ${(project.budget - project.spent).toLocaleString()}
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Timeline
              </Typography>
              <Typography variant="body1">
                Start Date: {project.startDate || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Deadline: {project.deadline || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Team Size: {project.teamSize || 'N/A'} FTEs
              </Typography>
              <Typography variant="body1">
                Project Manager: {project.manager || 'N/A'}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Key Milestones
              </Typography>
              {project.milestones?.map((milestone, index) => (
                <Box key={index} mb={1}>
                  <Typography variant="body1">
                    {milestone.name} - {milestone.date}
                    {milestone.completed && (
                      <CheckCircle color="success" sx={{ ml: 1, fontSize: '1rem' }} />
                    )}
                  </Typography>
                </Box>
              )) || <Typography>No milestones defined</Typography>}
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Risks & Issues
              </Typography>
              {project.risks?.map((risk, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body1" fontWeight="bold">
                    {risk.description}
                  </Typography>
                  <Typography variant="body2">
                    Impact: {risk.impact}
                  </Typography>
                  <Typography variant="body2">
                    Mitigation: {risk.mitigation}
                  </Typography>
                  {index < project.risks.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              )) || <Typography>No risks identified</Typography>}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </DashboardLayout>
  );
};

export default ProjectDetail;