
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Chip,
  Avatar,
  Stack,
  LinearProgress,
  Tooltip,
  Divider,
  Badge,
  CircularProgress
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Close, 
  Save,
  CheckCircle,
  Warning,
  Error,
  Person,
  CalendarToday,
  AttachMoney,
  Timeline,
  Group,
  Flag,
  Warning as RiskIcon // Using Warning icon as RiskIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles';

// Custom styled components
const StatusBadge = styled(Badge)(({ theme, status }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: 
      status === 'Completed' ? theme.palette.success.main :
      status === 'Active' ? theme.palette.primary.main :
      status === 'On Hold' ? theme.palette.warning.main :
      status === 'Cancelled' ? theme.palette.error.main : theme.palette.grey[500],
    color: theme.palette.common.white,
    padding: '0 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600
  }
}));

const ProgressBar = styled(LinearProgress)(({ value, theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: 
      value < 30 ? theme.palette.error.main :
      value < 70 ? theme.palette.warning.main : theme.palette.success.main
  }
}));

const ProjectAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newTeamMember, setNewTeamMember] = useState({
    user: '',
    role: '',
    allocation: 100
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planning',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    budget: {
      allocated: 0,
      used: 0
    },
    progress: {
      percentage: 0
    },
    riskLevel: 'Low',
    risks: [],
    manager: '',
    team: [],
    milestones: [],
    remarks: [],
    documents: []
  });

  // Add axios request interceptor for error handling
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      // You can add auth tokens or other headers here if needed
      return config;
    }, error => {
      return Promise.reject(error);
    });

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Request failed';
        showSnackbar(errorMessage, 'error');
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/users', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Failed to fetch users', 'error');
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/projects', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      showSnackbar('Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, [fetchProjects, fetchUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleOpenCreate = () => {
    setCurrentProject(null);
    setFormData({
      name: '',
      description: '',
      status: 'Planning',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      budget: {
        allocated: 0,
        used: 0
      },
      progress: {
        percentage: 0
      },
      riskLevel: 'Low',
      risks: [],
      manager: '',
      team: [],
      milestones: [],
      remarks: [],
      documents: []
    });
    setTeamMembers([]);
    setOpenDialog(true);
  };

  const handleOpenEdit = (project) => {
    setCurrentProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: new Date(project.startDate),
      endDate: project.endDate ? new Date(project.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      budget: {
        allocated: project.budget.allocated,
        used: project.budget.used
      },
      progress: {
        percentage: project.progress.percentage
      },
      riskLevel: project.riskLevel,
      risks: project.risks || [],
      manager: project.manager,
      team: project.team || [],
      milestones: project.milestones || [],
      remarks: project.remarks || [],
      documents: project.documents || []
    });
    setTeamMembers(project.team || []);
    setOpenDialog(true);
  };

  const handleOpenDelete = (project) => {
    setCurrentProject(project);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...formData,
        team: teamMembers
      };

      if (currentProject) {
        await axios.put(`/api/projects/${currentProject._id}`, dataToSend);
        showSnackbar('Project updated successfully', 'success');
      } else {
        await axios.post('/api/projects', dataToSend);
        showSnackbar('Project created successfully', 'success');
      }
      fetchProjects();
      setOpenDialog(false);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/projects/${currentProject._id}`);
      showSnackbar('Project deleted successfully', 'success');
      fetchProjects();
      setOpenDeleteDialog(false);
    } catch (error) {
      showSnackbar('Failed to delete project', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Team management functions
  const handleAddTeamMember = () => {
    if (newTeamMember.user && newTeamMember.role) {
      setTeamMembers([...teamMembers, newTeamMember]);
      setNewTeamMember({
        user: '',
        role: '',
        allocation: 100
      });
    }
  };

  const handleRemoveTeamMember = (index) => {
    const updatedTeam = [...teamMembers];
    updatedTeam.splice(index, 1);
    setTeamMembers(updatedTeam);
  };

  const handleTeamMemberChange = (e) => {
    const { name, value } = e.target;
    setNewTeamMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Risk management functions
  const [newRisk, setNewRisk] = useState({
    description: '',
    impact: '',
    mitigation: ''
  });

  const handleAddRisk = () => {
    if (newRisk.description) {
      setFormData(prev => ({
        ...prev,
        risks: [...prev.risks, newRisk]
      }));
      setNewRisk({
        description: '',
        impact: '',
        mitigation: ''
      });
    }
  };

  const handleRemoveRisk = (index) => {
    const updatedRisks = [...formData.risks];
    updatedRisks.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      risks: updatedRisks
    }));
  };

  const handleRiskChange = (e) => {
    const { name, value } = e.target;
    setNewRisk(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Milestone management functions
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    dueDate: new Date(),
    completed: false
  });

  const handleAddMilestone = () => {
    if (newMilestone.name) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone]
      }));
      setNewMilestone({
        name: '',
        description: '',
        dueDate: new Date(),
        completed: false
      });
    }
  };

  const handleRemoveMilestone = (index) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      milestones: updatedMilestones
    }));
  };

  const handleMilestoneChange = (e) => {
    const { name, value } = e.target;
    setNewMilestone(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMilestoneDateChange = (date) => {
    setNewMilestone(prev => ({
      ...prev,
      dueDate: date
    }));
  };

  const getRiskLevelIcon = (level) => {
    switch(level) {
      case 'High': return <Error color="error" />;
      case 'Medium': return <Warning color="warning" />;
      case 'Low': return <CheckCircle color="success" />;
      default: return <RiskIcon color="info" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="600" sx={{ color: 'primary.main' }}>
          Project Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreate}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
          }}
        >
          New Project
        </Button>
      </Stack>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '600' }}>Project</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Timeline</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Progress</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Budget</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Risk</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow 
                  key={project._id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        {project.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="500">{project.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {project.description.substring(0, 50)}...
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <StatusBadge badgeContent={project.status} status={project.status} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarToday color="action" fontSize="small" />
                      <Typography variant="body2">
                        {new Date(project.startDate).toLocaleDateString()} - {' '}
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <ProgressBar variant="determinate" value={project.progress.percentage} />
                      </Box>
                      <Typography variant="body2" fontWeight="500">
                        {project.progress.percentage}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AttachMoney color="action" fontSize="small" />
                      <Typography variant="body2">
                        ${project.budget.used.toLocaleString()} / ${project.budget.allocated.toLocaleString()}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={project.riskLevel}>
                      <IconButton size="small">
                        {getRiskLevelIcon(project.riskLevel)}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenEdit(project)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDelete(project)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

     {/* Create/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            maxHeight: '90vh',
            overflow: 'auto'
          }
        }}
      >
        {/* Header */}
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          p: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {currentProject ? 'Edit Project' : 'New Project'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'white' }}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 1.5 }}>
          {/* Section 1: Basic Info */}
          <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Person fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle2" fontWeight={600}>Basic Information</Typography>
            </Box>
            
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Project Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    {['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'].map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section 2: Timeline */}
          <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarToday fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle2" fontWeight={600}>Timeline</Typography>
            </Box>
            
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(date) => setFormData({...formData, startDate: date})}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={(date) => setFormData({...formData, endDate: date})}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>

          {/* Section 3: Budget & Progress */}
          <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle2" fontWeight={600}>Budget & Progress</Typography>
            </Box>
            
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Budget ($)"
                  value={formData.budget.allocated}
                  onChange={(e) => setFormData({
                    ...formData, 
                    budget: {...formData.budget, allocated: e.target.value}
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Used ($)"
                  value={formData.budget.used}
                  onChange={(e) => setFormData({
                    ...formData, 
                    budget: {...formData.budget, used: e.target.value}
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Progress (%)"
                  value={formData.progress.percentage}
                  onChange={(e) => setFormData({
                    ...formData, 
                    progress: {...formData.progress, percentage: e.target.value}
                  })}
                  InputProps={{
                    inputProps: { min: 0, max: 100 }
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Section 4: Risk Level */}
          <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Warning fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle2" fontWeight={600}>Risk Level</Typography>
            </Box>
            
            <FormControl fullWidth size="small">
              <InputLabel>Risk Assessment</InputLabel>
              <Select
                value={formData.riskLevel}
                label="Risk Assessment"
                onChange={(e) => setFormData({...formData, riskLevel: e.target.value})}
              >
                {['Low', 'Medium', 'High', 'Critical'].map(level => (
                  <MenuItem key={level} value={level}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {level === 'High' || level === 'Critical' ? (
                        <Error color="error" fontSize="small" sx={{ mr: 1 }} />
                      ) : level === 'Medium' ? (
                        <Warning color="warning" fontSize="small" sx={{ mr: 1 }} />
                      ) : (
                        <CheckCircle color="success" fontSize="small" sx={{ mr: 1 }} />
                      )}
                      {level}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Section 5: Team Members */}
          <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Group fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle2" fontWeight={600}>Team Members</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Member</InputLabel>
                    <Select
                      value={newTeamMember.user}
                      onChange={(e) => setNewTeamMember({...newTeamMember, user: e.target.value})}
                      label="Member"
                    >
                      {users.map(user => (
                        <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
                      label="Role"
                    >
                      <MenuItem value="Developer">Developer</MenuItem>
                      <MenuItem value="Designer">Designer</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    size="small"
                    onClick={handleAddTeamMember}
                    disabled={!newTeamMember.user || !newTeamMember.role}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {teamMembers.length > 0 && (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                      <TableCell width={40}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamMembers.map((member, index) => {
                      const user = users.find(u => u._id === member.user);
                      return (
                        <TableRow key={index}>
                          <TableCell>{user?.name || 'Unknown'}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => handleRemoveTeamMember(index)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* Section 6: Milestones */}
          <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Flag fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle2" fontWeight={600}>Milestones</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Milestone Name"
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone({...newMilestone, name: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Due Date"
                      value={newMilestone.dueDate}
                      onChange={handleMilestoneDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth size="small" />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={handleAddMilestone}
                    disabled={!newMilestone.name}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {formData.milestones.length > 0 && (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                      <TableCell width={40}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.milestones.map((milestone, index) => (
                      <TableRow key={index}>
                        <TableCell>{milestone.name}</TableCell>
                        <TableCell>
                          {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveMilestone(index)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </DialogContent>

        {/* Footer Actions */}
        <DialogActions sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={handleCloseDialog}
            size="small"
            sx={{ minWidth: 80 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            size="small"
            sx={{ minWidth: 80 }}
            startIcon={<Save fontSize="small" />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: '16px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: '600' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the project "{currentProject?.name}"?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{ borderRadius: '8px', px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            sx={{ borderRadius: '8px', px: 3 }}
          >
            Delete Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectAdmin;