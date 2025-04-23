import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area
} from 'recharts';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
  Chip,
  Box,
  Collapse,
  IconButton,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Timeline,
  Assignment,
  LocalAtm,
  GroupWork,
  CalendarToday,
  Block,
  Bolt,
  BugReport,
  Code,
  DesignServices,
  Security,
  VerifiedUser
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DoughnutChart, MiniTimelineChart } from './Charts'; // Assume these are custom chart components

// Styled components
const StatusBadge = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  ...(status === 'on-track' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark
  }),
  ...(status === 'at-risk' && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark
  }),
  ...(status === 'off-track' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark
  })
}));

const ProjectTypeChip = styled(Chip)(({ theme, type }) => ({
  marginLeft: theme.spacing(1),
  ...(type === 'progressive' && {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.dark
  }),
  ...(type === 'one-time' && {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark
  })
}));

// Sample data with enhanced structure
const projects = [
  {
    id: 'MBX',
    name: 'Mobile Banking 3.0',
    type: 'one-time',
    status: 'on-track',
    progress: 75,
    deadline: '2025-8-31',
    roadblock: 'None',
    businessImpact: 'Critical',
    tasks: [
      {
        phase: 'Design',
        status: 'completed',
        timeline: '2023-01-15 to 2023-02-28',
        deliverable: 'UX Prototypes',
        progress: 100
      },
      {
        phase: 'Development',
        status: 'in-progress',
        timeline: '2023-03-01 to 2023-08-15',
        deliverable: 'Core Features',
        progress: 80
      },
      {
        phase: 'Testing',
        status: 'in-started',
        timeline: '2023-08-16 to 2023-09-30',
        deliverable: 'QA Reports',
        progress: 0
      }
    ]
  },
  {
    id: 'AB',
    name: 'Agency Banking',
    type: 'one-time',
    status: 'off-track',
    progress: 78,
    deadline: '2025-09-15',
    roadblock: 'Regulatory approval pending',
    businessImpact: 'Critical',
    tasks: [
      {
        phase: 'Planning',
        status: 'completed',
        timeline: '2023-01-01 to 2023-01-31',
        deliverable: 'Project Charter',
        progress: 100
      },
      {
        phase: 'Implementation',
        status: 'in-progress',
        timeline: '2023-02-01 to 2023-08-31',
        deliverable: 'Deployed Solution',
        progress: 75
      }
    ]
  },
  {
    id: 'AYAP',
    name: 'AYA Pay Progressive',
    type: 'progressive',
    status: 'on-track',
    progress: 45,
    deadline: '2025-5-31', // Ongoing progressive project
    roadblock: 'Third-party API delays',
    businessImpact: 'High',
    methodology: 'agile',
    sprintDuration: '2 weeks',
    currentSprint: 'Sprint 7 of 12',
    tasks: [
      {
        phase: 'Sprint 7 (Current)',
        status: 'in-progress',
        timeline: '2023-08-14 to 2023-08-27',
        deliverable: 'QR Payment Enhancements',
        progress: 60,
        sprintItems: [
          {
            id: 'AYAP-7-1',
            name: 'Dynamic QR Code Generation',
            status: 'in-progress',
            assignee: 'Dev Team A',
            storyPoints: 5,
            type: 'feature'
          },
          {
            id: 'AYAP-7-2',
            name: 'QR Payment Analytics Dashboard',
            status: 'not-started',
            assignee: 'Dev Team B',
            storyPoints: 8,
            type: 'feature'
          },
          {
            id: 'AYAP-7-3',
            name: 'Fix QR Scan Performance Issues',
            status: 'completed',
            assignee: 'Dev Team C',
            storyPoints: 3,
            type: 'bug'
          }
        ]
      },
      {
        phase: 'Sprint 6',
        status: 'completed',
        timeline: '2023-07-31 to 2023-08-13',
        deliverable: 'Biometric Authentication',
        progress: 100,
        sprintItems: [
          {
            id: 'AYAP-6-1',
            name: 'Facial Recognition Integration',
            status: 'completed',
            assignee: 'Dev Team A',
            storyPoints: 5,
            type: 'feature'
          },
          {
            id: 'AYAP-6-2',
            name: 'Fingerprint Auth on iOS',
            status: 'completed',
            assignee: 'Dev Team B',
            storyPoints: 3,
            type: 'feature'
          }
        ]
      },
      {
        phase: 'Sprint 5',
        status: 'completed',
        timeline: '2023-07-17 to 2023-07-30',
        deliverable: 'Bill Payment Features',
        progress: 100,
        sprintItems: [
          {
            id: 'AYAP-5-1',
            name: 'Utility Bill Payments',
            status: 'completed',
            assignee: 'Dev Team C',
            storyPoints: 8,
            type: 'feature'
          },
          {
            id: 'AYAP-5-2',
            name: 'Payment Scheduling',
            status: 'completed',
            assignee: 'Dev Team A',
            storyPoints: 5,
            type: 'feature'
          }
        ]
      },
      {
        phase: 'Backlog',
        status: 'not-started',
        timeline: 'Future sprints',
        deliverable: 'Upcoming features',
        progress: 0,
        sprintItems: [
          {
            id: 'AYAP-B-1',
            name: 'Peer-to-Peer Lending',
            status: 'backlog',
            assignee: 'TBD',
            storyPoints: 13,
            type: 'feature'
          },
          {
            id: 'AYAP-B-2',
            name: 'Cryptocurrency Wallet',
            status: 'backlog',
            assignee: 'TBD',
            storyPoints: 20,
            type: 'feature'
          }
        ]
      }
    ],
    velocity: {
      current: 18,
      average: 16,
      target: 20
    },
    burndown: [22, 20, 18, 15, 12, 10, 8, 6] // Example burndown data for current sprint
  },
  // More projects with similar structure...
];

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CheckCircle fontSize="small" color="success" />;
    case 'in-progress':
      return <Timeline fontSize="small" color="info" />;
    case 'not-started':
      return <CalendarToday fontSize="small" color="action" />;
    case 'blocked':
      return <Block fontSize="small" color="error" />;
    default:
      return <Assignment fontSize="small" color="action" />;
  }
};

const BusinessImpactIndicator = ({ impact }) => {
  const theme = useTheme();
  const impactColors = {
    Critical: theme.palette.error.main,
    High: theme.palette.warning.main,
    Medium: theme.palette.info.main,
    Low: theme.palette.success.main
  };

  return (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: impactColors[impact] || theme.palette.grey[500],
        display: 'inline-block',
        mr: 1
      }}
    />
  );
};

const SprintItemsTable = ({ items }) => {
  const theme = useTheme();
  
  const getItemIcon = (type) => {
    switch (type) {
      case 'feature':
        return <Bolt color="primary" fontSize="small" />;
      case 'bug':
        return <BugReport color="error" fontSize="small" />;
      case 'tech-debt':
        return <Code color="warning" fontSize="small" />;
      case 'design':
        return <DesignServices color="info" fontSize="small" />;
      case 'security':
        return <Security color="success" fontSize="small" />;
      default:
        return <Assignment fontSize="small" />;
    }
  };

  return (
    <Table size="small" sx={{ mt: 1 }}>
      <TableHead>
        <TableRow>
          <TableCell width={40}></TableCell>
          <TableCell>Item</TableCell>
          <TableCell>Assignee</TableCell>
          <TableCell align="center">Status</TableCell>
          <TableCell align="center">Story Points</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{getItemIcon(item.type)}</TableCell>
            <TableCell>
              <Typography variant="body2">{item.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {item.id}
              </Typography>
            </TableCell>
            <TableCell>
              <Chip label={item.assignee} size="small" variant="outlined" />
            </TableCell>
            <TableCell align="center">
              <Chip
                label={item.status.replace('-', ' ')}
                size="small"
                variant="outlined"
                color={
                  item.status === 'completed'
                    ? 'success'
                    : item.status === 'in-progress'
                    ? 'info'
                    : 'default'
                }
              />
            </TableCell>
            <TableCell align="center">
              <Avatar sx={{ width: 24, height: 24, bgcolor: theme.palette.primary.main }}>
                {item.storyPoints}
              </Avatar>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ProjectRow = ({ project }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
              {project.name.charAt(0)}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1">{project.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {project.id}
              </Typography>
            </Box>
            <ProjectTypeChip
              label={project.type === 'progressive' ? 'Progressive' : 'One-time'}
              size="small"
              type={project.type}
            />
          </Box>
        </TableCell>
        <TableCell align="center">
          <StatusBadge
            icon={project.status === 'on-track' ? <CheckCircle /> : project.status === 'at-risk' ? <Warning /> : <Error />}
            label={project.status.replace('-', ' ')}
            status={project.status}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={project.progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor:
                      project.status === 'on-track'
                        ? theme.palette.success.main
                        : project.status === 'at-risk'
                        ? theme.palette.warning.main
                        : theme.palette.error.main
                  }
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {`${project.progress}%`}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BusinessImpactIndicator impact={project.businessImpact} />
            <Typography variant="body2">{project.businessImpact}</Typography>
          </Box>
        </TableCell>
        <TableCell>{project.deadline}</TableCell>
        <TableCell>
          <Chip
            label={project.roadblock === 'None' ? 'No blockers' : project.roadblock}
            size="small"
            color={project.roadblock === 'None' ? 'default' : 'error'}
            variant={project.roadblock === 'None' ? 'filled' : 'outlined'}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" gutterBottom>
                    Task Breakdown
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Phase</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell>Timeline</TableCell>
                        <TableCell>Deliverable</TableCell>
                        <TableCell>Progress</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {project.tasks.map((task, index) => (
                        <TableRow key={index}>
                          <TableCell>{task.phase}</TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={getStatusIcon(task.status)}
                              label={task.status.replace('-', ' ')}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{task.timeline}</TableCell>
                          <TableCell>{task.deliverable}</TableCell>
                          <TableCell>
                            <LinearProgress
                              variant="determinate"
                              value={task.progress}
                              sx={{
                                height: 6,
                                borderRadius: 3
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Project Insights
                  </Typography>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Timeline Overview
                      </Typography>
                      <MiniTimelineChart project={project} />
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Phase Distribution
                      </Typography>
                      <Box sx={{ height: 150 }}>
                        <DoughnutChart tasks={project.tasks} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" gutterBottom>
                    Sprint Breakdown
                  </Typography>
                  
                  {project.methodology === 'agile' && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="caption">Current Sprint</Typography>
                          <Typography>{project.currentSprint}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption">Sprint Duration</Typography>
                          <Typography>{project.sprintDuration}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption">Team Velocity</Typography>
                          <Typography>
                            {project.velocity.current} (Avg: {project.velocity.average}, Target: {project.velocity.target})
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sprint/Phase</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell>Timeline</TableCell>
                        <TableCell>Deliverable</TableCell>
                        <TableCell>Progress</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {project.tasks.map((task, index) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{task.phase}</TableCell>
                            <TableCell align="center">
                              <Chip
                                icon={getStatusIcon(task.status)}
                                label={task.status.replace('-', ' ')}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{task.timeline}</TableCell>
                            <TableCell>{task.deliverable}</TableCell>
                            <TableCell>
                              <LinearProgress
                                variant="determinate"
                                value={task.progress}
                                sx={{
                                  height: 6,
                                  borderRadius: 3
                                }}
                              />
                            </TableCell>
                          </TableRow>
                          {task.sprintItems && (
                            <TableRow>
                              <TableCell colSpan={5} sx={{ py: 0, borderBottom: 0 }}>
                                <SprintItemsTable items={task.sprintItems} />
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Agile Metrics
                  </Typography>
                  
                  {project.methodology === 'agile' && (
                    <>
                      <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Current Sprint Burndown
                          </Typography>
                          <Box sx={{ height: 150 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={project.burndown.map((value, index) => ({ day: index + 1, points: value }))}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                  type="monotone"
                                  dataKey="points"
                                  stroke={theme.palette.primary.main}
                                  fill={theme.palette.primary.light}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </Box>
                        </CardContent>
                      </Card>
                      
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Feature Distribution
                          </Typography>
                          <Box sx={{ height: 150 }}>
                            <DoughnutChart tasks={project.tasks} />
                          </Box>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const ProjectProgressDashboard = () => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        background: theme.palette.background.paper
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="600">
          Project Progress Tracker
        </Typography>
        <Box>
          <Chip label="All Projects" variant="outlined" sx={{ mr: 1 }} />
          <Chip label="One-time" color="primary" sx={{ mr: 1 }} />
          <Chip label="Progressive" color="info" />
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableCell width={40} />
              <TableCell>Project</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Business Impact</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Roadblocks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProjectProgressDashboard;