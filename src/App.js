import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContextProvider } from './ThemeContext';
import { CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import AdminMain from './admin/AdminMain';
import BudgetAdmin from './admin/BudgetAdmin';
import ProjectAdmin from './admin/ProjectAdmin';
import ResourcesAdmin from './admin/ResourcesAdmin';
import UserAdmin from './admin/UserAdmin';
import Login from './admin/auth/Login';

// Authentication wrapper component
const RequireAuth = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          
          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/admin" element={
            <RequireAuth requiredRole="admin">
              <AdminMain />
            </RequireAuth>
          }>
            <Route index element={<Navigate to="budgets" replace />} />
            <Route path="budgets" element={<BudgetAdmin />} />
            <Route path="projects" element={<ProjectAdmin />} />
            <Route path="resources" element={<ResourcesAdmin />} />
            <Route path="users" element={<UserAdmin />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;