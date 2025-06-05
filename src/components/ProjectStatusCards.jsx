/* eslint-disable no-unused-vars */
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
  Stack,
  Tooltip,
  Zoom,
  Fade
} from '@mui/material';
import { 
  CheckCircle, 
  ReportProblem, 
  Cancel,
  ArrowUpward,
  ArrowDownward,
  TrendingFlat,
  Error,
  Warning,
  Info
} from '@mui/icons-material';

// Updated professional color palette
const statusColors = {
  'on-track': {
    main: '#4CAF50',  // Cool green
    light: '#E8F5E9', // Very light green
    dark: '#2E7D32'   // Darker green
  },
  'at-risk': {
    main: '#FFC107',  // Amber yellow
    light: '#FFF8E1', // Light amber
    dark: '#FF8F00'   // Darker amber
  },
  'off-track': {
    main: '#F44336',  // Red
    light: '#FFEBEE', // Light red
    dark: '#C62828'   // Darker red
  }
};

// Risk level colors - muted professional tones
const riskColors = {
  'high': '#D32F2F',
  'medium': '#F57C00',
  'low': '#388E3C'
};

// Risk level icons
const riskIcons = {
  'high': <Error fontSize="small" />,
  'medium': <Warning fontSize="small" />,
  'low': <Info fontSize="small" />
};

// Modern styled components
const StatusCard = ({ project }) => {
  const theme = useTheme();
  const status = statusColors[project.status];
  
  return (
    <Fade in={true} timeout={500}>
      <Card sx={{ 
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.05)',
        borderLeft: `4px solid ${status.main}`,
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.1)',
          borderLeft: `4px solid ${status.dark}`
        }
      }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" alignItems="flex-start" spacing={1.5} mb={1.5}>
            <Avatar sx={{ 
              bgcolor: status.light, 
              color: status.main,
              width: 36,
              height: 36
            }}>
              {project.status === 'on-track' && <CheckCircle fontSize="small" />}
              {project.status === 'off-track' && <Cancel fontSize="small" />}
              {project.status === 'at-risk' && <ReportProblem fontSize="small" />}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight="600" fontSize="0.875rem">
                {project.name}
              </Typography>
              <Tooltip 
                title={`Risk level: ${project.risk}`} 
                placement="top" 
                TransitionComponent={Zoom}
              >
                <Chip
                  icon={riskIcons[project.risk]}
                  label={project.risk.toUpperCase()}
                  size="small"
                  sx={{
                    mt: 0.5,
                    fontSize: '0.65rem',
                    height: '22px',
                    backgroundColor: riskColors[project.risk] + '15',
                    color: riskColors[project.risk],
                    fontWeight: '600',
                    '& .MuiChip-icon': {
                      color: riskColors[project.risk],
                      fontSize: '16px',
                      ml: '4px'
                    }
                  }}
                />
              </Tooltip>
            </Box>
          </Stack>
          
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{
              height: 6,
              borderRadius: 3,
              mb: 1.5,
              backgroundColor: status.light,
              '& .MuiLinearProgress-bar': {
                backgroundColor: status.main,
                borderRadius: 3,
                transition: 'transform 0.4s ease'
              }
            }}
          />
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" fontWeight="500" fontSize="0.75rem">
              Progress
            </Typography>
            <Box display="flex" alignItems="center">
              {project.trend === 'up' && <ArrowUpward sx={{ color: status.main, fontSize: '0.875rem' }} />}
              {project.trend === 'down' && <ArrowDownward sx={{ color: status.main, fontSize: '0.875rem' }} />}
              {project.trend === 'neutral' && <TrendingFlat sx={{ color: status.main, fontSize: '0.875rem' }} />}
              <Typography 
                variant="caption" 
                fontWeight="700"
                ml={0.3}
                color={status.main}
                fontSize="0.75rem"
              >
                {project.progress}%
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Fade>
  );
};

const StatusSummaryCard = ({ status, count }) => {
  const config = {
    'on-track': {
      title: 'On Track',
      icon: <CheckCircle fontSize="small" />,
      color: statusColors['on-track']
    },
    'at-risk': {
      title: 'At Risk',
      icon: <ReportProblem fontSize="small" />,
      color: statusColors['at-risk']
    },
    'off-track': {
      title: 'Off Track',
      icon: <Cancel fontSize="small" />,
      color: statusColors['off-track']
    }
  };
  
  return (
    <Fade in={true} timeout={800}>
      <Paper sx={{
        p: 2,
        borderRadius: 1.5,
        background: `linear-gradient(135deg, ${config[status].color.light} 0%, rgba(255,255,255,1) 100%)`,
        borderLeft: `4px solid ${config[status].color.main}`,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="caption" fontWeight="500" fontSize="0.75rem" color="text.secondary">
              {config[status].title} 
            </Typography>
            <Typography variant="h6" fontWeight="700" color={config[status].color.dark} fontSize="1.25rem">
              {count}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontSize="0.625rem">
              {count === 1 ? 'Project' : 'Projects'}
            </Typography>
          </Box>
          <Avatar sx={{ 
            bgcolor: config[status].color.light, 
            color: config[status].color.main,
            width: 40,
            height: 40,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}>
            {config[status].icon}
          </Avatar>
        </Stack>
      </Paper>
    </Fade>
  );
};

const ProjectStatusCards = () => {
  const theme = useTheme();
  
  const projectData = [
    { 
      id: 'MBX', 
      name: 'mBanking 3.0', 
      status: 'on-track', 
      progress: 75,
      trend: 'up',
      risk: 'low'
    },
    { 
      id: 'AB', 
      name: 'Agency Banking', 
      status: 'off-track', 
      progress: 78,
      trend: 'up',
      risk: 'high'
    },
    { 
      id: 'AP', 
      name: 'AYA Pay', 
      status: 'on-track', 
      progress: 65,
      trend: 'neutral',
      risk: 'medium'
    },
    { 
      id: 'MP', 
      name: 'Merchant Portal', 
      status: 'at-risk', 
      progress: 30,
      trend: 'down',
      risk: 'high'
    },
    { 
      id: 'APG', 
      name: 'Payment Gateway', 
      status: 'on-track', 
      progress: 52,
      trend: 'neutral',
      risk: 'medium'
    },
    { 
      id: 'PA', 
      name: 'Partner App', 
      status: 'on-track', 
      progress: 50,
      trend: 'neutral',
      risk: 'low'
    },
    { 
      id: 'TA', 
      name: 'Teller App', 
      status: 'on-track', 
      progress: 90,
      trend: 'up',
      risk: 'low'
    },
    { 
      id: 'MMQR', 
      name: 'MMQR', 
      status: 'on-track', 
      progress: 90,
      trend: 'up',
      risk: 'low'
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
    <Box sx={{ p: 2 }}>
      {/* Summary Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
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
          <Box key={status} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="700" sx={{ 
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              color: statusColors[status].dark,
              fontSize: '0.875rem'
            }}>
              {status === 'on-track' && <CheckCircle sx={{ mr: 1, fontSize: '1rem' }} />}
              {status === 'at-risk' && <ReportProblem sx={{ mr: 1, fontSize: '1rem' }} />}
              {status === 'off-track' && <Cancel sx={{ mr: 1, fontSize: '1rem' }} />}
              {status === 'on-track' ? 'On Track' : status === 'at-risk' ? 'At Risk' : 'Off Track'} 
              <Chip 
                label={projects.length}
                size="small"
                sx={{ 
                  ml: 1,
                  fontSize: '0.625rem',
                  height: '20px',
                  backgroundColor: statusColors[status].light,
                  color: statusColors[status].dark,
                  fontWeight: '700'
                }}
              />
            </Typography>
            
            <Divider sx={{ 
              mb: 2,
              borderColor: statusColors[status].light,
              borderWidth: 1
            }} />
            
            <Grid container spacing={2}>
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