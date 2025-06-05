/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
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
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Typography,
  Avatar,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  CheckCircle, 
  Cancel,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import axios from 'axios';

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    email: '',
    password: '',
    role: 'manager'
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      showSnackbar('Error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`/api/users/${formData._id}`, formData, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        showSnackbar('User updated successfully', 'success');
      } else {
        await axios.post('/api/users', formData, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        showSnackbar('User created successfully', 'success');
      }
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving user:', err);
      showSnackbar(err.response?.data?.message || 'Error saving user', 'error');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        showSnackbar('User deleted successfully', 'success');
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        showSnackbar('Error deleting user', 'error');
      }
    }
  };

  const handleEdit = (user) => {
    setFormData({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setFormData({
      _id: '',
      name: '',
      email: '',
      password: '',
      role: 'manager'
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => { 
    fetchUsers(); 
  }, [fetchUsers]);

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'error.main';
      case 'manager': return 'warning.main';
      case 'viewer': return 'success.main';
      default: return 'text.primary';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="600">
          User Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddNew}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }}
        >
          Add User
        </Button>
      </Stack>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
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
                <TableCell sx={{ fontWeight: '600' }}>User</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: '600', width: '120px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user._id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" fontWeight="500">
                        {user.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      size="small"
                      sx={{ 
                        backgroundColor: getRoleColor(user.role) + '20',
                        color: getRoleColor(user.role),
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(user)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(user._id)}
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

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: '600' }}>
          {isEditing ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Full Name"
              fullWidth
              size="small"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              sx={{ mb: 1 }}
            />
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              size="small"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              sx={{ mb: 1 }}
            />
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              size="small"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              InputProps={{
                endAdornment: (
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                )
              }}
            />
            {isEditing && (
              <Typography variant="caption" color="text.secondary">
                Leave password blank to keep current password
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            startIcon={<Cancel />}
            sx={{ borderRadius: '6px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{ borderRadius: '6px' }}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserAdmin;