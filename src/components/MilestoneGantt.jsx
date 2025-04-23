import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Avatar,
  Stack,
  useTheme,
  LinearProgress,
  Grid,
  IconButton,
  Collapse
} from '@mui/material';
import {
  AccountBalance as BankingIcon,
  Payment as PaymentIcon,
  Smartphone as AppIcon,
  CheckCircle,
  Warning,
  Error,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';

const ModernGanttDashboard = () => {
  const theme = useTheme();
  const [expandedProject, setExpandedProject] = React.useState(null);

  // Project data
  const projects = {
    oneTime: [
      {
        id: 'MBX',
        name: 'Mobile Banking 3.0',
        icon: <BankingIcon />,
        color: theme.palette.primary.main,
        phases: [
          { 
            name: 'Beta Launch with all BAU', 
            status: 'completed', 
            date: 'Mar 31, 2025',
            progress: 100,
            subTasks: ['API', 'Core Modules', 'Mobile', 'UI/UX', 'Backend', 'QA']
          },
          { 
            name: 'Interbank Transfer', 
            status: 'in-progress', 
            date: 'Apr 30, 2025', 
            progress: 85,
            subTasks: ['Faster', 'Priority', 'Report', 'Bug Fix']
          },
          { 
            name: 'Loan Repayment', 
            status: 'planned', 
            date: 'May 31, 2025',
            progress: 5,
            subTasks: ['Enquiry', 'Schedule', 'Make payment']
          }
        ]
      },
      {
        id: 'AB',
        name: 'Agency Banking',
        icon: <PaymentIcon />,
        color: theme.palette.success.main,
        phases: [
          { 
            name: 'Core System', 
            status: 'completed', 
            date: 'Feb 1 - Apr 30, 2023',
            progress: 100,
            subTasks: ['Transaction Engine', 'User Management']
          },
          { 
            name: 'Partner Integration', 
            status: 'in-progress', 
            date: 'May 1 - Aug 31, 2023', 
            progress: 45,
            subTasks: ['API Gateway', 'Partner Portal']
          }
        ]
      }
    ],
    progressive: [
      {
        id: 'AYAP',
        name: 'AYA Pay',
        icon: <PaymentIcon />,
        color: theme.palette.warning.main,
        sprints: [
          { 
            name: 'Sprint 1: Core', 
            status: 'completed', 
            date: 'Feb 15 - Mar 15, 2023',
            progress: 100,
            features: ['Payment Processing', 'User Auth', 'Basic UI']
          },
          { 
            name: 'Sprint 2: Features', 
            status: 'in-progress', 
            date: 'Mar 16 - Apr 30, 2023',
            progress: 60,
            features: ['Bill Pay', 'QR Code', 'Notifications']
          },
          { 
            name: 'Sprint 3: Enhancements', 
            status: 'planned', 
            date: 'May 1 - Jun 15, 2023',
            progress: 0,
            features: ['Rewards', 'Analytics', 'Dark Mode']
          }
        ]
      },
      {
        id: 'PA',
        name: 'Partner App',
        icon: <AppIcon />,
        color: theme.palette.secondary.main,
        sprints: [
          { 
            name: 'Sprint 1: Foundation', 
            status: 'in-progress', 
            date: 'Mar 1 - Apr 15, 2023',
            progress: 30,
            features: ['Onboarding', 'Dashboard', 'Auth']
          },
          { 
            name: 'Sprint 2: Transactions', 
            status: 'planned', 
            date: 'Apr 16 - May 31, 2023',
            progress: 0,
            features: ['Payment Flow', 'Reporting', 'Settings']
          }
        ]
      }
    ]
  };

  const StatusBadge = ({ status }) => {
    const config = {
      completed: { icon: <CheckCircle fontSize="small" />, color: 'success', label: 'Done' },
      'in-progress': { icon: <Warning fontSize="small" />, color: 'warning', label: 'In Progress' },
      planned: { icon: <Error fontSize="small" />, color: 'info', label: 'Planned' }
    };

    return (
      <Chip
        icon={config[status].icon}
        label={config[status].label}
        size="small"
        color={config[status].color}
        variant="outlined"
        sx={{ borderRadius: 1, fontSize: '0.75rem' }}
      />
    );
  };

  const GanttBar = ({ progress, color, dateRange }) => {
    return (
      <Box sx={{ 
        width: '100%',
        position: 'relative',
        height: 24,
        bgcolor: theme.palette.grey[100],
        borderRadius: 12,
        overflow: 'hidden'
      }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: '100%',
            bgcolor: 'transparent',
            '.MuiLinearProgress-bar': {
              bgcolor: color,
              borderRadius: 12
            }
          }}
        />
        <Typography variant="caption" sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: theme.palette.getContrastText(color),
          fontWeight: 'bold',
          fontSize: '0.65rem'
        }}>
          {dateRange}
        </Typography>
      </Box>
    );
  };

  const toggleExpand = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const ProjectCard = ({ project, type }) => {
    const items = type === 'oneTime' ? project.phases : project.sprints;
    
    return (
      <Paper sx={{ 
        mb: 2, 
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          boxShadow: theme.shadows[2]
        }
      }}>
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            p: 2,
            cursor: 'pointer',
            bgcolor: theme.palette.background.paper
          }}
          onClick={() => toggleExpand(project.id)}
        >
          <Avatar sx={{ 
            bgcolor: project.color, 
            mr: 2, 
            width: 36, 
            height: 36,
            color: theme.palette.getContrastText(project.color)
          }}>
            {project.icon}
          </Avatar>
          <Typography fontWeight="600" flexGrow={1}>{project.name}</Typography>
          <IconButton size="small">
            {expandedProject === project.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </Box>

        <Collapse in={expandedProject === project.id}>
          <Box sx={{ p: 2, pt: 0 }}>
            <Grid container spacing={2}>
              {(type === 'oneTime' ? project.phases : project.sprints).map((item, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Box sx={{ 
                    height: '100%',
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    bgcolor: theme.palette.background.default
                  }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      {item.name}
                    </Typography>
                    
                    <GanttBar 
                      progress={item.progress} 
                      color={project.color} 
                      dateRange={item.date.split(' - ')[0].replace(', 2023', '')} 
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, mb: 1.5 }}>
                      <StatusBadge status={item.status} />
                      <Chip 
                        label={`${item.progress}%`} 
                        size="small" 
                        sx={{ 
                          ml: 1,
                          bgcolor: theme.palette.grey[100],
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        }} 
                      />
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      {type === 'oneTime' ? 'TASKS:' : 'FEATURES:'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(type === 'oneTime' ? item.subTasks : item.features).map((task, i) => (
                        <Chip
                          key={i}
                          label={task}
                          size="small"
                          sx={{ 
                            bgcolor: theme.palette.grey[100],
                            fontSize: '0.7rem',
                            height: 24
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Collapse>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* One-Time Projects Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ 
            bgcolor: theme.palette.primary.main, 
            width: 40, 
            height: 40,
            color: theme.palette.primary.contrastText
          }}>
            <BankingIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="700">
            One-Time Development
          </Typography>
        </Stack>

        {projects.oneTime.map((project) => (
          <ProjectCard key={project.id} project={project} type="oneTime" />
        ))}
      </Box>

      {/* Progressive Projects Section */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ 
            bgcolor: theme.palette.secondary.main, 
            width: 40, 
            height: 40,
            color: theme.palette.secondary.contrastText
          }}>
            <AppIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="700">
            Progressive Development
          </Typography>
        </Stack>

        {projects.progressive.map((project) => (
          <ProjectCard key={project.id} project={project} type="progressive" />
        ))}
      </Box>
    </Box>
  );
};

export default ModernGanttDashboard;