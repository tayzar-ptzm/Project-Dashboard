import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  LinearProgress, 
  Chip,
  Divider,
  useTheme,
  Paper,
  Avatar,
  Stack
} from '@mui/material';
import { 
  CheckCircle, 
  Warning, 
  Error,
  ArrowUpward,
  ArrowDownward,
  TrendingFlat
} from '@mui/icons-material';

// Modern color palette with cool blue for on-track
const statusColors = {
  'on-track': {
    main: '#2196f3',  // Cool blue
    light: '#e3f2fd', // Very light blue
    dark: '#1565c0'   // Darker blue
  },
  'at-risk': {
    main: '#ff9800',
    light: '#fff3e0',
    dark: '#ef6c00'
  },
  'off-track': {
    main: '#f44336',
    light: '#ffebee',
    dark: '#c62828'
  }
};

// Modern styled components
const StatusCard = ({ project }) => {
  const theme = useTheme();
  const status = statusColors[project.status];
  
  return (
    <Card sx={{ 
      height: '100%',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
      borderLeft: `4px solid ${status.main}`,
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 30px 0 rgba(0, 0, 0, 0.1)',
        borderLeft: `4px solid ${status.dark}`
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ 
            bgcolor: status.light, 
            color: status.main,
            width: 40,
            height: 40
          }}>
            {project.status === 'on-track' && <CheckCircle />}
            {project.status === 'at-risk' && <Warning />}
            {project.status === 'off-track' && <Error />}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              {project.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {project.id}
            </Typography>
          </Box>
        </Stack>
        
        <LinearProgress
          variant="determinate"
          value={project.progress}
          sx={{
            height: 8,
            borderRadius: 4,
            mb: 2,
            backgroundColor: status.light,
            '& .MuiLinearProgress-bar': {
              backgroundColor: status.main,
              borderRadius: 4
            }
          }}
        />
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight="500">
            Progress
          </Typography>
          <Box display="flex" alignItems="center">
            {project.trend === 'up' && <ArrowUpward sx={{ color: status.main, fontSize: 16 }} />}
            {project.trend === 'down' && <ArrowDownward sx={{ color: status.main, fontSize: 16 }} />}
            {project.trend === 'neutral' && <TrendingFlat sx={{ color: status.main, fontSize: 16 }} />}
            <Typography 
              variant="body2" 
              fontWeight="700"
              ml={0.5}
              color={status.main}
            >
              {project.progress}%
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const StatusSummaryCard = ({ status, count }) => {
  const config = {
    'on-track': {
      title: 'On Track',
      icon: <CheckCircle />,
      color: statusColors['on-track']
    },
    'at-risk': {
      title: 'At Risk',
      icon: <Warning />,
      color: statusColors['at-risk']
    },
    'off-track': {
      title: 'Off Track',
      icon: <Error />,
      color: statusColors['off-track']
    }
  };
  
  return (
    <Paper sx={{
      p: 3,
      borderRadius: 2,
      background: `linear-gradient(135deg, ${config[status].color.light} 0%, rgba(255,255,255,1) 100%)`,
      borderLeft: `4px solid ${config[status].color.main}`,
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)'
      }
    }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary">
            {config[status].title} 
          </Typography>
          <Typography variant="h4" fontWeight="700" color={config[status].color.dark}>
            {count}
          </Typography>
        </Box>
        <Avatar sx={{ 
          bgcolor: config[status].color.light, 
          color: config[status].color.main,
          width: 48,
          height: 48
        }}>
          {config[status].icon}
        </Avatar>
      </Stack>
    </Paper>
  );
};

const ProjectStatusCards = () => {
  const theme = useTheme();
  
  const projectData = [
    { 
      id: 'MBX', 
      name: 'Mobile Banking 3.0', 
      status: 'on-track', 
      progress: 75,
      trend: 'up'
    },
    { 
      id: 'AB', 
      name: 'Agency Banking', 
      status: 'off-track', 
      progress: 78,
      trend: 'up'
    },
    { 
      id: 'AP', 
      name: 'AYA Pay', 
      status: 'on-track', 
      progress: 65,
      trend: 'neutral'
    },
    { 
      id: 'MP', 
      name: 'Merchant Portal', 
      status: 'at-risk', 
      progress: 30,
      trend: 'down'
    },
    { 
      id: 'APG', 
      name: 'Payment Gateway', 
      status: 'on-track', 
      progress: 52,
      trend: 'neutral'
    },
    { 
      id: 'PA', 
      name: 'Partner App', 
      status: 'on-track', 
      progress: 50,
      trend: 'neutral'
    },
    { 
      id: 'TA', 
      name: 'Teller App', 
      status: 'on-track', 
      progress: 90,
      trend: 'up'
    },
    { 
      id: 'MMQR', 
      name: 'MMQR (Myanmar Pay)', 
      status: 'on-track', 
      progress: 90,
      trend: 'up'
    },
  ];

  // Calculate status counts
  const statusCounts = projectData.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  // Filter projects by status
  const getProjectsByStatus = (status) => 
    projectData.filter(project => project.status === status);

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.keys(statusCounts).map((status) => (
          <Grid item xs={12} md={4} key={status}>
            <StatusSummaryCard status={status} count={statusCounts[status]} />
          </Grid>
        ))}
      </Grid>

      {/* Status Sections */}
      {['on-track', 'at-risk', 'off-track'].map((status) => {
        const projects = getProjectsByStatus(status);
        if (projects.length === 0) return null;
        
        return (
          <Box key={status} sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="700" sx={{ 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              color: statusColors[status].dark
            }}>
              {status === 'on-track' && <CheckCircle sx={{ mr: 1 }} />}
              {status === 'at-risk' && <Warning sx={{ mr: 1 }} />}
              {status === 'off-track' && <Error sx={{ mr: 1 }} />}
              {status === 'on-track' ? 'On Track' : status === 'at-risk' ? 'At Risk' : 'Off Track'} 
              <Chip 
                label={projects.length}
                size="small"
                sx={{ 
                  ml: 1.5,
                  backgroundColor: statusColors[status].light,
                  color: statusColors[status].dark,
                  fontWeight: '700'
                }}
              />
            </Typography>
            
            <Divider sx={{ 
              mb: 3,
              borderColor: statusColors[status].light,
              borderWidth: 1
            }} />
            
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                  <StatusCard project={project} />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProjectStatusCards;