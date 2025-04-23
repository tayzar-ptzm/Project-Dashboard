import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useTheme } from '@mui/material';

// Doughnut Chart Component
export const DoughnutChart = ({ tasks }) => {
  const theme = useTheme();
  
  // Transform task data for the chart
  const chartData = tasks.map(task => ({
    name: task.phase,
    value: task.progress,
    status: task.status
  }));

  // Color mapping based on status
  const getColorByStatus = (status) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'in-progress':
        return theme.palette.info.main;
      case 'not-started':
        return theme.palette.grey[300];
      case 'blocked':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColorByStatus(entry.status)} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Progress']}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Mini Timeline Chart Component
export const MiniTimelineChart = ({ project }) => {
  const theme = useTheme();
  
  // Transform project data for the timeline
  const timelineData = [
    {
      name: 'Start',
      date: new Date(project.deadline).setMonth(new Date(project.deadline).getMonth() - 6),
      progress: 0
    },
    ...project.tasks.map(task => ({
      name: task.phase,
      date: new Date(task.timeline.split(' to ')[0]),
      progress: task.progress
    })),
    {
      name: 'Deadline',
      date: new Date(project.deadline),
      progress: 100
    }
  ].sort((a, b) => a.date - b.date);

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart
        data={timelineData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis 
          type="number" 
          domain={[0, 100]}
          hide 
        />
        <YAxis 
          dataKey="name"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          width={80}
        />
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Progress']}
          labelFormatter={(name) => {
            const item = timelineData.find(item => item.name === name);
            return `${name} (${formatDate(item.date)})`;
          }}
        />
        <Bar
          dataKey="progress"
          barSize={20}
          radius={[0, 4, 4, 0]}
          background={{ fill: theme.palette.grey[100], radius: 4 }}
        >
          {timelineData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.name === 'Deadline'
                  ? theme.palette.error.main
                  : entry.progress === 100
                  ? theme.palette.success.main
                  : theme.palette.primary.main
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};