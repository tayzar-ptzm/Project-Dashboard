// theme.js
import { createTheme } from '@mui/material/styles';

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 500, background: 'linear-gradient(to right, #1E90FF, #32CD32)', WebkitBackgroundClip: 'text', color: 'transparent' },
    h2: { fontSize: '1.75rem', fontWeight: 500, background: 'linear-gradient(to right, #1E90FF, #32CD32)', WebkitBackgroundClip: 'text', color: 'transparent' },
    h3: { fontSize: '1.5rem', fontWeight: 400 },
    h4: { fontSize: '1.25rem', fontWeight: 400 },
    h5: { fontSize: '1.125rem', fontWeight: 400 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    subtitle1: { fontSize: '0.8125rem', fontWeight: 400 },
    body1: { fontSize: '0.9375rem', fontWeight: 400 },
    body2: { fontSize: '0.8125rem', fontWeight: 400 },
    button: { textTransform: 'none', fontWeight: 500 }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }
      }
    }
  }
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#722F37', // AYA brand wine red
      light: '#8C434D',
      dark: '#5A252D'
    },
    secondary: {
      main: '#5F6A7D', // Cool gray
      light: '#7F8A9D',
      dark: '#3F4A5D'
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1A202C',
      secondary: '#4A5568'
    },
    success: {
      main: '#38A169',
      light: '#C6F6D5',
      dark: '#25855A'
    },
    warning: {
      main: '#DD6B20',
      light: '#FEEBC8',
      dark: '#C05621'
    },
    error: {
      main: '#E53E3E',
      light: '#FED7D7',
      dark: '#C53030'
    },
    info: {
      main: '#3182CE',
      light: '#BEE3F8',
      dark: '#2C5282'
    }
  }
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#D1A5A9', // Lighter wine red
      light: '#E8D2D5',
      dark: '#BA8A8F'
    },
    secondary: {
      main: '#9FA8BA', // Light gray
      light: '#BFC8DA',
      dark: '#7F889A'
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E'
    },
    text: {
      primary: '#EDF2F7',
      secondary: '#CBD5E0'
    },
    success: {
      main: '#68D391',
      light: '#9AE6B4',
      dark: '#48BB78'
    },
    warning: {
      main: '#F6AD55',
      light: '#FBD38D',
      dark: '#ED8936'
    },
    error: {
      main: '#FC8181',
      light: '#FEB2B2',
      dark: '#F56565'
    },
    info: {
      main: '#63B3ED',
      light: '#90CDF4',
      dark: '#4299E1'
    }
  }
});
