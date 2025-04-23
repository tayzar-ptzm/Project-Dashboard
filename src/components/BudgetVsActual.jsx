import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Avatar, 
  Chip,
  useTheme,
  Stack,
  Divider
} from '@mui/material';
import { 
  PieChart, 
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import awsLogo from '../images/aws.png';
import mongodbLogo from '../images/mongodb.png';
import jiraLogo from '../images/jira.png';
import otherLogo from '../images/others.png';
import elasticLogo from '../images/elastic.png';
import officeLogo from '../images/office.png';
import laptopLogo from '../images/laptop.png';
import figmaLogo from '../images/figma.png';
import { TrendingUp, TrendingDown, Equalizer } from '@mui/icons-material';

const BudgetVsActual = () => {
  const theme = useTheme();

  // Monthly costs data
  const monthlyCosts = [
    { 
      service: 'AWS', 
      currentMonth: 28970, 
      lastMonth: 27980,
      logo: awsLogo,
      color: '#FF9900'
    },
    { 
      service: 'MongoDB', 
      currentMonth: 25070, 
      lastMonth: 22360,
      logo: mongodbLogo,
      color: '#47A248'
    },
    { 
      service: 'Jira', 
      currentMonth: 1611, 
      lastMonth: 1870,
      logo: jiraLogo,
      color: '#0052CC'
    },
    { 
      service: 'Office', 
      currentMonth: 295, 
      lastMonth: 300,
      logo: officeLogo,
      color: "#40E0D0"
    },
    { 
      service: 'Elastic', 
      currentMonth: 4350, 
      lastMonth: 5490,
      logo: elasticLogo,
      color: '#8e44ad'
    },
    { 
      service: 'Figma', 
      currentMonth: 180, 
      lastMonth: 160,
      logo: figmaLogo,
      color: '#DE3163'
    }
   
  ];

  const totalCurrentMonth = monthlyCosts.reduce((sum, item) => sum + item.currentMonth, 0);
  const totalLastMonth = monthlyCosts.reduce((sum, item) => sum + item.lastMonth, 0);
  const monthlyGrowth = ((totalCurrentMonth - totalLastMonth) / totalLastMonth * 100).toFixed(1);

  // Data for radar chart
  const radarData = monthlyCosts.map(item => ({
    subject: item.service,
    current: item.currentMonth,
    last: item.lastMonth,
    fullMark: Math.max(...monthlyCosts.map(i => Math.max(i.currentMonth, i.lastMonth))) + 100
  }));

  // Data for line chart - showing trend over last 4 months (mock data)
  const lineData = [
    { month: 'Jan', AWS: 26970, MongoDB: 29070, Jira: 2571, Office: 220, Elastic: 6765, Figma: 150},
    { month: 'Feb', AWS: 25970, MongoDB: 28070, Jira: 2611, Office: 240, Elastic: 5660, Figma: 150},
    { month: 'Mar', AWS: 26070, MongoDB: 27070, Jira: 2461, Office: 260, Elastic: 4458, Figma: 160},
    { month: 'Apr', AWS: 28970, MongoDB: 25070, Jira: 1611, Office: 295, Elastic: 4350, Figma: 180},
  ];

  // Colors for line chart
  const lineColors = {
    AWS: '#FF9900',
    MongoDB: '#47A248',
    Jira: '#0052CC',
    Office: '#40E0D0',
    Elastic: '#8e44ad',
    Figma: '#DE3163'
  };

  return (
    <Paper sx={{ 
      p: 4,
      borderRadius: 4,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
      background: 'linear-gradient(to bottom right, #F8FAFF, #FFFFFF)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Equalizer sx={{ color: theme.palette.primary.main, fontSize: 30 }} />
        <Typography variant="h5" sx={{ 
          fontWeight: 600,
          color: theme.palette.primary.dark,
          letterSpacing: '-0.5px'
        }}>
          Monthly Costs Analysis
        </Typography>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #F0F7FF 0%, #D6E4FF 100%)',
            boxShadow: '0px 4px 12px rgba(0, 119, 255, 0.1)',
            border: '1px solid rgba(0, 119, 255, 0.1)'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle2" color="textSecondary" sx={{ opacity: 0.8 }}>
                  Current Month Total
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                  ${totalCurrentMonth.toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: 'rgba(0, 119, 255, 0.1)', 
                width: 48, 
                height: 48,
                color: theme.palette.primary.dark
              }}>
                <TrendingUp fontSize="medium" />
              </Avatar>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #F5F3FF 0%, #E9E0FF 100%)',
            boxShadow: '0px 4px 12px rgba(103, 58, 183, 0.1)',
            border: '1px solid rgba(103, 58, 183, 0.1)'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle2" color="textSecondary" sx={{ opacity: 0.8 }}>
                  Last Month Total
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                  ${totalLastMonth.toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: 'rgba(103, 58, 183, 0.1)', 
                width: 48, 
                height: 48,
                color: '#673AB7'
              }}>
                <TrendingDown fontSize="medium" />
              </Avatar>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 3,
            background: monthlyGrowth >= 0 
              ? 'linear-gradient(135deg, #F0FFF4 0%, #C8FACD 100%)'
              : 'linear-gradient(135deg, #FFF5F5 0%, #FFD6D6 100%)',
            boxShadow: monthlyGrowth >= 0 
              ? '0px 4px 12px rgba(56, 161, 105, 0.1)'
              : '0px 4px 12px rgba(229, 62, 62, 0.1)',
            border: monthlyGrowth >= 0 
              ? '1px solid rgba(56, 161, 105, 0.1)'
              : '1px solid rgba(229, 62, 62, 0.1)'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle2" color="textSecondary" sx={{ opacity: 0.8 }}>
                  Monthly Growth
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    mt: 1,
                    color: monthlyGrowth >= 0 ? '#38A169' : '#E53E3E'
                  }}
                >
                  {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth}%
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: monthlyGrowth >= 0 
                  ? 'rgba(56, 161, 105, 0.1)' 
                  : 'rgba(229, 62, 62, 0.1)',
                width: 48, 
                height: 48,
                color: monthlyGrowth >= 0 ? '#38A169' : '#E53E3E'
              }}>
                {monthlyGrowth >= 0 ? <TrendingUp /> : <TrendingDown />}
              </Avatar>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Radar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            height: '100%',
            width: '500px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Monthly Costs Comparison
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke={theme.palette.divider} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: theme.palette.text.primary }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 100']} />
                <Tooltip 
                  formatter={(value) => [`$${value}`]}
                  contentStyle={{
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: theme.shadows[3],
                    background: theme.palette.background.paper
                  }}
                />
                <Radar 
                  name="Current Month" 
                  dataKey="current" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6} 
                />
                <Radar 
                  name="Last Month" 
                  dataKey="last" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6} 
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            height: '100%',
            width: '560px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              6-Month Cost Trends
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: theme.palette.text.primary }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fill: theme.palette.text.primary }}
                />
                <Tooltip 
                  formatter={(value, name) => [`$${value}`, name]}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: theme.shadows[3],
                    background: theme.palette.background.paper
                  }}
                />
                <Legend />
                {Object.keys(lineColors).map((key) => (
                  <Line 
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={lineColors[key]}
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Service Breakdown */}
      <Typography variant="h6" gutterBottom sx={{ 
        fontWeight: 600,
        mb: 3,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Divider sx={{ width: 40, height: 2, bgcolor: 'primary.main', mr: 2 }} />
        Service Breakdown
      </Typography>
      <Grid container spacing={3}>
        {monthlyCosts.map((service, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ 
              p: 2.5,
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {service.logo ? (
                  <Avatar 
                    src={service.logo} 
                    alt={service.service} 
                    sx={{ 
                      width: 40, 
                      height: 40,
                      mr: 2,
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  />
                ) : (
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40,
                      mr: 2,
                      backgroundColor: service.color,
                      color: 'white'
                    }}
                  >
                    {service.service.charAt(0)}
                  </Avatar>
                )}
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {service.service}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 'auto' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    Current
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    ${service.currentMonth.toLocaleString()}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Last Month
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    ${service.lastMonth.toLocaleString()}
                  </Typography>
                </Stack>
                
                <Chip
                  label={`${((service.currentMonth - service.lastMonth) / service.lastMonth * 100).toFixed(1)}%`}
                  size="small"
                  sx={{ 
                    width: '100%',
                    backgroundColor: service.currentMonth >= service.lastMonth 
                      ? 'rgba(56, 161, 105, 0.1)' 
                      : 'rgba(229, 62, 62, 0.1)',
                    color: service.currentMonth >= service.lastMonth 
                      ? '#38A169' 
                      : '#E53E3E',
                    fontWeight: 600
                  }}
                  icon={service.currentMonth >= service.lastMonth ? 
                    <TrendingUp sx={{ fontSize: '16px !important' }} /> : 
                    <TrendingDown sx={{ fontSize: '16px !important' }} />
                  }
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default BudgetVsActual;