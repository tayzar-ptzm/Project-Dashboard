/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  keyframes
} from '@mui/material';
import {
  CheckCircle,
  Autorenew,
  EventNote,
  Warning,
  ExpandMore
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ReactComponent as MBXIcon } from '../images/MBX.svg';
import { ReactComponent as APIcon } from '../images/AP.svg';
import { ReactComponent as AGIcon } from '../images/AP.svg';
import { ReactComponent as MMQRIcon } from '../images/MMQR.svg';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const ProjectGanttDashboard = () => {
  const theme = useTheme();
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [hoveredPhase, setHoveredPhase] = useState(null);

  // Months for the timeline
  const currentYear = new Date().getFullYear();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Project icons mapping
  const projectIcons = {
    'mbx': <MBXIcon width={24} height={24} />,
    'agency': <APIcon width={24} height={24} />,
    'mmqr': <MMQRIcon width={24} height={24} />,
    'ag': <AGIcon width={24} height={24} />
  };

  // Sample project data with colors and icons
  const projects = [
    {
      id: 'mbx',
      name: 'Mobile Banking 3.0',
      color: '#6366F1', // Indigo
      icon: projectIcons['mbx'],
      phases: [
        {
          id: 'beta',
          name: 'Internal Beta',
          status: 'completed',
          planned: { start: 'Jan 2025', end: 'Mar 2025' },
          actual: { start: 'Jan 2025', end: 'Mar 2025' },
          progress: 100,
          tasks: ['API Integration', 'Core Modules', 'Mobile App', 'UI/UX Design']
        },
        {
          id: 'transfer',
          name: 'Interbank Transfer',
          status: 'in-progress',
          planned: { start: 'Mar 2025', end: 'May 2025' },
          actual: { start: 'Apr 2025', end: 'Jun 2025' },
          progress: 75,
          tasks: ['Faster Payments', 'Priority Processing', 'Transaction Reports']
        },
        {
          id: 'loan',
          name: 'Loan Repayment',
          status: 'in-progress',
          planned: { start: 'May 2025', end: 'Jul 2025' },
          actual: { start: 'Jun 2025', end: null },
          progress: 30,
          tasks: ['Loan Enquiry', 'Repayment Schedule', 'Payment Processing']
        }
      ]
    },
    {
      id: 'agency',
      name: 'Agency Banking',
      color: '#10B981', // Emerald
      icon: projectIcons['agency'],
      phases: [
        {
          id: 'core',
          name: 'Core System',
          status: 'completed',
          planned: { start: 'Feb 2025', end: 'Apr 2025' },
          actual: { start: 'Feb 2025', end: 'Apr 2025' },
          progress: 100,
          tasks: ['Transaction Engine', 'User Management']
        },
        {
          id: 'aml',
          name: 'AML Checking',
          status: 'in-progress',
          planned: { start: 'Apr 2025', end: 'Jun 2025' },
          actual: { start: 'May 2025', end: null },
          progress: 45,
          tasks: ['Compliance Checks', 'Risk Assessment', 'Reporting']
        }
      ]
    },
    {
      id: 'mmqr',
      name: 'MMQR Myanmar Pay',
      color: '#F59E0B', // Amber
      icon: projectIcons['mmqr'],
      phases: [
        {
          id: 'qr',
          name: 'QR Generation',
          status: 'completed',
          planned: { start: 'Jan 2025', end: 'Feb 2025' },
          actual: { start: 'Jan 2025', end: 'Feb 2025' },
          progress: 100,
          tasks: ['QR Code API', 'Merchant Portal', 'Transaction Processing']
        },
        {
          id: 'token',
          name: 'Tokenization',
          status: 'in-progress',
          planned: { start: 'Mar 2025', end: 'May 2025' },
          actual: { start: 'Apr 2025', end: 'Jun 2025' },
          progress: 65,
          tasks: ['Token Engine', 'Security Layer', 'API Integration']
        }
      ]
    }
  ];

  const StatusBadge = ({ status }) => {
    const config = {
      completed: { icon: <CheckCircle fontSize="small" />, color: '#10B981', label: 'Completed' },
      'in-progress': { icon: <Autorenew fontSize="small" />, color: '#3B82F6', label: 'In Progress' },
      planned: { icon: <EventNote fontSize="small" />, color: '#6366F1', label: 'Planned' },
      behind: { icon: <Warning fontSize="small" />, color: '#EF4444', label: 'Behind' }
    };

    return (
      <motion.div whileHover={{ scale: 1.05 }}>
        <Chip
          icon={config[status].icon}
          label={config[status].label}
          size="small"
          sx={{ 
            borderRadius: 2,
            fontSize: '0.75rem',
            bgcolor: `${config[status].color}20`,
            color: config[status].color,
            border: `1px solid ${config[status].color}`
          }}
        />
      </motion.div>
    );
  };

  const getMonthIndex = (monthYear) => {
    if (!monthYear) return null;
    const [month] = monthYear.split(' ');
    return months.indexOf(month);
  };

  const calculateBarPosition = (start, end) => {
    const startIndex = getMonthIndex(start);
    const endIndex = getMonthIndex(end);
    
    if (startIndex === null || endIndex === null) return null;
    
    return {
      left: `${(startIndex / months.length) * 100}%`,
      width: `${((endIndex - startIndex + 1) / months.length) * 100}%`
    };
  };

  const handlePhaseClick = (phase) => {
    setSelectedPhase(phase);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const isBehindSchedule = (phase) => {
    if (!phase.actual.end) return true;
    const plannedEnd = getMonthIndex(phase.planned.end);
    const actualEnd = getMonthIndex(phase.actual.end);
    return actualEnd > plannedEnd;
  };

  const AnimatedBar = ({ color, position, isActive }) => (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: position.width }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute',
        top: '50%',
        left: position.left,
        height: 8,
        transform: 'translateY(-50%)',
        backgroundColor: color,
        borderRadius: 4,
        boxShadow: isActive ? `0 0 8px ${color}` : 'none',
        zIndex: isActive ? 2 : 1
      }}
    />
  );

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 3 },
      background: 'linear-gradient(120deg, #F9FAFB 0%, #F3F4F6 100%)',
      minHeight: '100vh'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ 
          mb: 3, 
          fontWeight: 800,
          background: 'linear-gradient(90deg, #6366F1 0%, #10B981 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}>
          Project Milestones Timeline
        </Typography>
        
      </motion.div>

      {projects.map((project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * projects.indexOf(project) }}
        >
          <Paper sx={{ 
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            {/* Project Header */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              p: 2,
              bgcolor: `${project.color}10`,
              borderBottom: `1px solid ${project.color}20`
            }}>
              <Avatar sx={{ 
                bgcolor: project.color,
                color: 'white',
                mr: 2,
                width: 40,
                height: 40
              }}>
                {project.icon}
              </Avatar>
              <Typography variant="h6" fontWeight={700} sx={{ color: project.color }}>
                {project.name}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Chip 
                label={`${project.phases.length} phases`} 
                size="small" 
                sx={{ 
                  bgcolor: `${project.color}20`,
                  color: project.color,
                  fontWeight: 600
                }} 
              />
            </Box>

            {/* Months Header */}
            <Box sx={{ 
              display: 'flex',
              position: 'sticky',
              left: 0,
              bgcolor: 'background.paper',
              zIndex: 2,
              borderBottom: `2px solid ${theme.palette.divider}`
            }}>
              <Box sx={{ 
                width: 200, 
                minWidth: 200, 
                py: 2,
                pl: 3,
                fontWeight: 600,
                color: '#6B7280'
              }}>
                Phase Name
              </Box>
              {months.map((month) => (
                <Box key={month} sx={{
                  flex: 1,
                  minWidth: 80,
                  textAlign: 'center',
                  py: 2,
                  borderRight: `1px solid ${theme.palette.divider}`,
                  fontWeight: 600,
                  color: '#6B7280',
                  bgcolor: '#F9FAFB'
                }}>
                  {month}
                </Box>
              ))}
            </Box>

            {/* Phases Rows */}
            {project.phases.map((phase) => {
              const plannedPos = calculateBarPosition(phase.planned.start, phase.planned.end);
              const actualPos = calculateBarPosition(phase.actual.start, phase.actual.end);
              const isBehind = isBehindSchedule(phase);
              const isHovered = hoveredPhase === phase.id;

              return (
                <motion.div
                  key={phase.id}
                  whileHover={{ 
                    backgroundColor: `${project.color}08`,
                    transition: { duration: 0.2 }
                  }}
                  onMouseEnter={() => setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                >
                  <Box sx={{ 
                    display: 'flex',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    position: 'relative',
                    bgcolor: isHovered ? `${project.color}08` : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}>
                    {/* Phase Name Column */}
                    <Box sx={{ 
                      width: 200,
                      minWidth: 200,
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      pl: 3,
                      position: 'sticky',
                      left: 0,
                      bgcolor: isHovered ? `${project.color}08` : 'background.paper',
                      zIndex: 1,
                      cursor: 'pointer'
                    }}
                      onClick={() => handlePhaseClick(phase)}
                    >
                      <Typography sx={{ 
                        flexGrow: 1,
                        fontWeight: 600,
                        color: isHovered ? project.color : 'inherit'
                      }}>
                        {phase.name}
                      </Typography>
                      <ExpandMore sx={{ 
                        color: isHovered ? project.color : '#9CA3AF',
                        transform: isHovered ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease, color 0.2s ease'
                      }} />
                    </Box>

                    {/* Timeline Columns */}
                    <Box sx={{ 
                      position: 'relative',
                      flex: 1,
                      display: 'flex',
                      height: 60
                    }}>
                      {months.map((_, index) => (
                        <Box key={index} sx={{
                          flex: 1,
                          minWidth: 80,
                          borderRight: `1px solid ${theme.palette.divider}`
                        }}></Box>
                      ))}

                      {/* Bars Container */}
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                      }}>
                        {/* Planned Bar */}
                        {plannedPos && (
                          <AnimatedBar
                            color={`${project.color}40`}
                            position={plannedPos}
                            isActive={isHovered}
                          />
                        )}

                        {/* Actual Bar */}
                        {actualPos && (
                          <AnimatedBar
                            color={isBehind ? '#EF4444' : project.color}
                            position={actualPos}
                            isActive={isHovered}
                          />
                        )}

                        {/* Current Month Indicator */}
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: `${(new Date().getMonth() / months.length) * 100}%`,
                          width: '1px',
                          bgcolor: '#EF4444',
                          zIndex: 3
                        }} />
                      </Box>

                      {/* Progress Indicator */}
                      <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 16,
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        zIndex: 2
                      }}>
                        <StatusBadge status={isBehind ? 'behind' : phase.status} />
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Chip 
                            label={`${phase.progress}%`} 
                            size="small" 
                            sx={{ 
                              fontWeight: 700,
                              bgcolor: '#FFFFFF',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }} 
                          />
                        </motion.div>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </Paper>
        </motion.div>
      ))}

      {/* Phase Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(120deg, #F9FAFB 0%, #F3F4F6 100%)'
          }
        }}
      >
        {selectedPhase && (
          <>
            <DialogTitle sx={{ 
              bgcolor: `${projects.find(p => p.phases?.includes(selectedPhase))?.color || '#6366F1'}10`,
              borderBottom: `1px solid ${theme.palette.divider}`,
              py: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                  {selectedPhase.name}
                </Typography>
                <StatusBadge status={isBehindSchedule(selectedPhase) ? 'behind' : selectedPhase.status} />
              </Box>
              <Typography variant="subtitle2" sx={{ color: '#6B7280', mt: 0.5 }}>
                {projects.find(p => p.phases.includes(selectedPhase))?.name}
              </Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ py: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Timeline Comparison
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        width: 16, 
                        height: 8, 
                        bgcolor: '#6366F140',
                        borderRadius: 1,
                        mr: 1
                      }} />
                      <Typography variant="body2">Planned: {selectedPhase.planned.start} - {selectedPhase.planned.end}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        width: 16, 
                        height: 8, 
                        bgcolor: isBehindSchedule(selectedPhase) ? '#EF4444' : '#10B981',
                        borderRadius: 1,
                        mr: 1
                      }} />
                      <Typography variant="body2" color={isBehindSchedule(selectedPhase) ? 'error' : 'text.primary'}>
                        Actual: {selectedPhase.actual.start} - {selectedPhase.actual.end || 'Ongoing'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Progress
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedPhase.progress} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        mb: 1,
                        bgcolor: '#E5E7EB',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: isBehindSchedule(selectedPhase) ? '#EF4444' : '#10B981'
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 600 }}>
                      {selectedPhase.progress}% complete
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Tasks
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedPhase.tasks.map((task, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Chip 
                            label={task} 
                            size="small" 
                            sx={{ 
                              bgcolor: '#F3F4F6',
                              fontWeight: 500,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }} 
                          />
                        </motion.div>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#F9FAFB' }}>
              <Button 
                onClick={handleCloseDialog}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProjectGanttDashboard;