import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import { ThemeContextProvider } from './ThemeContext';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline /> {/* This helps with consistent styling in Material-UI */}
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;