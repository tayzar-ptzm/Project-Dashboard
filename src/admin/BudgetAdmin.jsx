/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Typography, 
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  CircularProgress,
  Box,
  Avatar,
  Chip,
  Tooltip
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  CheckCircle, 
  Warning,
  Autorenew 
} from '@mui/icons-material';
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';

// MUI Date Pickers imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Service configuration with icons and colors
const SERVICE_CONFIG = {
  'AWS': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg',
    color: '#00000000'
  },
  'MongoDB': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mongodb.svg',
    color: '#00000000'
  },
  'Elastic': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/elastic.svg',
    color: '#00000000'
  },
  'Jira': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jira.svg',
    color: '#00000000'
  },
  'Figma': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/figma.svg',
    color: '#00000000'
  },
  'Office365': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftoffice.svg',
    color: '#00000000'
  },
  'Slack': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg',
    color: ''
  },
  'Google Cloud': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecloud.svg',
    color: '#00000000'
  },
  'Azure': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftazure.svg',
    color: '#00000000'
  },
  'GitHub': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg',
    color: '#00000000'
  }
};

// Styled components
const ServiceCell = styled(TableCell)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});

const StatusBadge = ({ status }) => {
  const config = {
    Active: { icon: <CheckCircle fontSize="small" />, color: 'success' },
    Archived: { icon: <Warning fontSize="small" />, color: 'warning' },
    'Pending Review': { icon: <Autorenew fontSize="small" />, color: 'info' }
  };

  return (
    <Chip
      icon={config[status].icon}
      label={status}
      size="small"
      color={config[status].color}
      variant="outlined"
      sx={{ borderRadius: 1 }}
    />
  );
};

const BudgetAdmin = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [formData, setFormData] = useState({
    service: 'AWS',
    type: 'Compute',
    usageValue: 0,
    usageUnit: 'GB',
    periodStart: new Date(),
    periodEnd: new Date(),
    monthlyCost: 0,
    actualCost: 0,
    notes: '',
    status: 'Active'
  });

  const services = Object.keys(SERVICE_CONFIG);
  const types = ['Compute', 'Storage', 'Database', 'Network', 'Software', 'Support'];
  const units = ['GB', 'TB', 'Hours', 'Users', 'Licenses'];
  const statuses = ['Active', 'Archived', 'Pending Review'];
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/budgets', {
        headers: { 'x-auth-token': token }
      });
      setBudgets(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async () => {
    try {
      // 1. Properly define budgetData
        const budgetData = {
          service: formData.service,
          type: formData.type,
          usage: {
            value: Number(formData.usageValue),
            unit: formData.usageUnit
          },
          period: {
            start: new Date(formData.periodStart).toISOString(),
            end: new Date(formData.periodEnd).toISOString()
          },
          monthlyCost: Number(formData.monthlyCost),
          actualCost: Number(formData.actualCost),
          notes: formData.notes || undefined,
          status: formData.status || 'Active'
        };

        console.log("Submitting:", budgetData); // 👈 Log the payload


        // 2. Get authentication token
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          navigate('/login');
          return;
        }

        const response = currentBudget
        ? await axios.put(`/api/budgets/${currentBudget._id}`, budgetData, {
            headers: { "x-auth-token": token },
          })
        : await axios.post("/api/budgets", budgetData, {
            headers: { "x-auth-token": token },
          });

      // 4. Handle success
        fetchBudgets();
        handleCloseDialog();
        //setError(null);

    } catch (err) {
      console.error("Full error:", err);
      console.error("Server response:", err.response?.data); // 👈 Log server error details
      setError(err.response?.data?.message || "Failed to save budget");
    }
  };

  const handleEdit = (budget) => {
    setCurrentBudget(budget);
    setFormData({
      service: budget.service,
      type: budget.type,
      usageValue: budget.usage.value,
      usageUnit: budget.usage.unit,
      periodStart: new Date(budget.period.start),
      periodEnd: new Date(budget.period.end),
      monthlyCost: budget.monthlyCost,
      actualCost: budget.actualCost,
      notes: budget.notes || '',
      status: budget.status || 'Active'
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/budgets/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchBudgets();
      } catch (err) {
        console.error('Error deleting budget:', err);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBudget(null);
    setFormData({
      service: 'AWS',
      type: 'Compute',
      usageValue: 0,
      usageUnit: 'GB',
      periodStart: new Date(),
      periodEnd: new Date(),
      monthlyCost: 0,
      actualCost: 0,
      notes: '',
      status: 'Active'
    });
  };

  const calculateVariance = (budget) => {
    return budget.actualCost - budget.monthlyCost;
  };

  const getVarianceColor = (variance) => {
    return variance >= 0 ? '#10B981' : '#EF4444';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Budget Management
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Add Budget
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell>Period</TableCell>
                <TableCell align="right">Monthly ($)</TableCell>
                <TableCell align="right">Actual ($)</TableCell>
                <TableCell align="right">Variance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets.map((budget) => {
                const variance = calculateVariance(budget);
                const varianceColor = getVarianceColor(variance);
                const serviceConfig = SERVICE_CONFIG[budget.service] || { 
                  icon: '/icons/default-icon.svg', 
                  color: '#666666' 
                };

                return (
                  <TableRow key={budget._id} hover>
                    <ServiceCell>
                      <Avatar 
                        src={serviceConfig.icon} 
                        sx={{ 
                          width: 24, 
                          height: 24,
                          bgcolor: serviceConfig.color,
                          '& img': { width: '60%', height: '60%' }
                        }}
                      />
                      {budget.service}
                    </ServiceCell>
                    <TableCell>{budget.type}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`${budget.usage.value} ${budget.usage.unit}`} 
                        size="small"
                        sx={{ bgcolor: '#F3F4F6' }}
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(budget.period.start), 'MMM d, yyyy')} -{' '}
                      {format(new Date(budget.period.end), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell align="right">
                      ${budget.monthlyCost.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ${budget.actualCost.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: varianceColor }}>
                      ${variance.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={budget.status} />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(budget)}>
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(budget._id)}>
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            {currentBudget ? 'Edit Budget' : 'Add New Budget'}
          </DialogTitle>
          <DialogContent dividers sx={{ py: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Service</InputLabel>
                  <Select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    label="Service"
                  >
                    {services.map((service) => (
                      <MenuItem key={service} value={service}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar 
                            src={SERVICE_CONFIG[service].icon}
                            sx={{ 
                              width: 24, 
                              height: 24,
                              bgcolor: SERVICE_CONFIG[service].color
                            }}
                          />
                          {service}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type"
                  >
                    {types.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Usage Value"
                  name="usageValue"
                  type="number"
                  value={formData.usageValue}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="usageUnit"
                    value={formData.usageUnit}
                    onChange={handleChange}
                    label="Unit"
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.periodStart}
                  onChange={(newValue) => handleDateChange(newValue, 'periodStart')}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={formData.periodEnd}
                  onChange={(newValue) => handleDateChange(newValue, 'periodEnd')}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Monthly Budget ($)"
                  name="monthlyCost"
                  type="number"
                  value={formData.monthlyCost}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Actual Cost ($)"
                  name="actualCost"
                  type="number"
                  value={formData.actualCost}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: '#F9FAFB' }}>
            <Button onClick={handleCloseDialog} sx={{ borderRadius: 1 }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              color="primary" 
              variant="contained"
              sx={{ borderRadius: 1 }}
            >
              {currentBudget ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default BudgetAdmin;