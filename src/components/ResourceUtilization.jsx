/* eslint-disable no-unused-vars */
import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Avatar, 
  Chip, 
  Divider,
  useTheme,
  styled,
  LinearProgress
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from 'recharts';

// Sample data - replace with your actual data
const teamMembers = [
  {
    id: 1,
    name: 'Lwin Kyaw Myat',
    avatar: '/avatars/lwin.jpg',
    role: 'Senior Mobile Developer',
    projects: ['MBX', 'AYAP', 'MMQR'],
    workload: 85, // percentage
    skills: ['React Native', 'Flutter', 'iOS', 'Android'],
    utilization: [
      { project: 'MBX', hours: 30 },
      { project: 'AYAP', hours: 40 },
      { project: 'MMQR', hours: 15 }
    ]
  },
  {
    id: 2,
    name: 'Saw Nay Thu Aung',
    avatar: '/avatars/john.jpg',
    role: 'Senior Backend Developer',
    projects: ['MBX', 'AB'],
    workload: 65,
    skills: ['Node.js', 'Python', 'AWS', 'Microservices'],
    utilization: [
      { project: 'MBX', hours: 25 },
      { project: 'AB', hours: 40 }
    ]
  },
  {
    id: 3,
    name: 'Khin Myo Win',
    avatar: '/avatars/sarah.jpg',
    role: 'QA Engineer',
    projects: ['AYAP', 'APG', 'MA'],
    workload: 75,
    skills: ['Automation', 'Manual Testing', 'Selenium', 'Jest'],
    utilization: [
      { project: 'AYAP', hours: 35 },
      { project: 'APG', hours: 25 },
      { project: 'MA', hours: 15 }
    ]
  },
  {
    id: 4,
    name: 'Santi',
    avatar: '/avatars/michael.jpg',
    role: 'DevOps Engineer',
    projects: ['MBX', 'AYAP', 'AB', 'APG'],
    workload: 90,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    utilization: [
      { project: 'MBX', hours: 20 },
      { project: 'AYAP', hours: 30 },
      { project: 'AB', hours: 25 },
      { project: 'APG', hours: 15 }
    ]
  }
];

const projectTeams = {
  MBX: {
    name: "Mobile Banking 3.0",
    developers: 3,
    designers: 1,
    qa: 2,
    devops: 1,
    status: 'active',
    progress: 65,
    startDate: '2023-01-15',
    endDate: '2023-09-30',
    
  },
  AYAPAY: {
    name: "AYA Pay",
    developers: 4,
    designers: 2,
    qa: 3,
    devops: 1,
    status: 'active',
    progress: 42,
    startDate: '2023-03-10',
    endDate: '2023-11-15',
   
  },
  AGENCY: {
    name: "Agency Banking",
    developers: 2,
    designers: 1,
    qa: 1,
    devops: 1,
    status: 'active',
    progress: 18,
    startDate: '2023-05-01',
    endDate: '2023-12-20',
  }
};

const ResourceUtilization = () => {
  const theme = useTheme();

  // Chart data
  const roleDistribution = [
    { name: 'Developers', value: teamMembers.filter(m => m.role.includes('Developer')).length },
    { name: 'QA', value: teamMembers.filter(m => m.role.includes('QA')).length },
    { name: 'DevOps', value: teamMembers.filter(m => m.role.includes('DevOps')).length }
  ];

  const projectWorkload = Object.keys(projectTeams).map(project => ({
    name: project,
    developers: projectTeams[project].developers,
    qa: projectTeams[project].qa,
    devops: projectTeams[project].devops
  }));

  const COLORS = {
    developers: '#4e79a7',
    designers: '#f28e2b',
    qa: '#e15759',
    devops: '#76b7b2',
    active: '#59a14f',
    planning: '#edc948',
    completed: '#af7aa1'
  };

  // Styled components
  const MemberCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    transition: 'all 0.3s ease',
    background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[6]
    }
  }));

  const ProjectCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    height: '100%',
    background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
    borderLeft: `4px solid ${theme.palette.primary.main}`
  }));

  const StatusBadge = styled(Chip)(({ status, theme }) => ({
    backgroundColor: COLORS[status] || theme.palette.grey[300],
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.7rem'
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Overview Section */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 4,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 700, 
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <span style={{ color: theme.palette.primary.main }}>Team</span> Resource Utilization
        </Typography>
        
        <Grid container spacing={3}>
          {/* Role Distribution Radial Chart */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
              Team Composition
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="20%"
                  outerRadius="100%"
                  data={roleDistribution.map((entry, index) => ({
                    ...entry,
                    fill: Object.values(COLORS)[index]
                  }))}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis 
                    type="number" 
                    domain={[0, 100]} 
                    angleAxisId={0} 
                    tick={false}
                  />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    label={renderCustomizedLabel}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    formatter={(value, entry, index) => (
                      <span style={{ color: theme.palette.text.primary }}>
                        {value} ({roleDistribution[index].value})
                      </span>
                    )}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} members`]}
                    labelFormatter={(name) => <strong>{name}</strong>}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Workload Bar Chart */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
              Workload Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={teamMembers}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  barCategoryGap={15}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Workload']}
                    contentStyle={{
                      borderRadius: 12,
                      boxShadow: theme.shadows[3],
                      border: 'none'
                    }}
                  />
                  <Bar dataKey="workload" name="Workload %" radius={[0, 4, 4, 0]}>
                    {teamMembers.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.workload > 85 ? COLORS.qa : 
                          entry.workload > 70 ? COLORS.designers : COLORS.developers
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Project Allocation */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
              Project Allocation
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectWorkload}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  stackOffset="expand"
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value} ${name}`]}
                    contentStyle={{
                      borderRadius: 12,
                      boxShadow: theme.shadows[3],
                      border: 'none'
                    }}
                  />
                  <Bar dataKey="developers" name="Developers" stackId="a" fill={COLORS.developers} />
                  <Bar dataKey="qa" name="QA" stackId="a" fill={COLORS.qa} />
                  <Bar dataKey="devops" name="DevOps" stackId="a" fill={COLORS.devops} />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: 20
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Project Teams Section */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 4,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 700, 
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <span style={{ color: theme.palette.primary.main }}>Project</span> Team Structures
        </Typography>
        
        <Grid container spacing={3}>
          {Object.entries(projectTeams).map(([projectKey, project]) => (
            <Grid item xs={12} md={4} key={projectKey}>
              <ProjectCard elevation={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                    {project.name} ({projectKey})
                  </Typography>
                  <StatusBadge 
                    status={project.status} 
                    label={project.status.toUpperCase()} 
                    size="small"
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Project Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={project.progress} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        flexGrow: 1,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: 
                            project.progress > 70 ? COLORS.active :
                            project.progress > 30 ? COLORS.designers : COLORS.qa
                        }
                      }} 
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {project.progress}%
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label={`${project.developers} Developers`} 
                    sx={{ 
                      backgroundColor: `${COLORS.developers}20`,
                      color: COLORS.developers,
                      fontWeight: 600
                    }} 
                    size="small"
                  />
                  <Chip 
                    label={`${project.qa} QA`} 
                    sx={{ 
                      backgroundColor: `${COLORS.qa}20`,
                      color: COLORS.qa,
                      fontWeight: 600
                    }} 
                    size="small"
                  />
                  <Chip 
                    label={`${project.devops} DevOps`} 
                    sx={{ 
                      backgroundColor: `${COLORS.devops}20`,
                      color: COLORS.devops,
                      fontWeight: 600
                    }} 
                    size="small"
                  />
                </Box>
                
              </ProjectCard>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Team Members Section */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 4,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 700, 
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <span style={{ color: theme.palette.primary.main }}>Team</span> Members
        </Typography>
        
        <Grid container spacing={3}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={3} key={member.id}>
              <MemberCard elevation={0}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={member.avatar} 
                    alt={member.name}
                    sx={{ 
                      width: 56, 
                      height: 56,
                      mr: 2,
                      border: `3px solid ${
                        member.workload > 85 ? COLORS.qa : 
                        member.workload > 70 ? COLORS.designers : COLORS.developers
                      }`,
                      boxShadow: theme.shadows[2]
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Workload Progress */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Workload
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {member.workload}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={member.workload} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: 
                          member.workload > 85 ? COLORS.qa : 
                          member.workload > 70 ? COLORS.designers : COLORS.developers
                      }
                    }} 
                  />
                </Box>
                
                {/* Project Utilization */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Project Allocation (hours/week)
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: theme.palette.grey[50],
                    borderRadius: 2,
                    p: 1.5
                  }}>
                    {member.utilization.map((proj, i) => (
                      <Box key={i} sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {proj.project}
                          </Typography>
                          <Typography variant="body2">
                            {proj.hours}h
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(proj.hours / member.workload) * 100} 
                          sx={{ 
                            height: 4, 
                            mt: 0.5,
                            borderRadius: 2,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 2,
                              backgroundColor: Object.values(COLORS)[i % Object.values(COLORS).length]
                            }
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                {/* Skills */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {member.skills.map((skill, i) => (
                      <Chip 
                        key={skill} 
                        label={skill} 
                        size="small"
                        sx={{ 
                          backgroundColor: `${Object.values(COLORS)[i % Object.values(COLORS).length]}20`,
                          color: Object.values(COLORS)[i % Object.values(COLORS).length],
                          fontWeight: 500
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </MemberCard>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ResourceUtilization;