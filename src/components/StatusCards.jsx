/* eslint-disable no-unused-vars */
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    styled,
    keyframes 
  } from '@mui/material';
  
  const pulseAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  `;
  
  const StatusCard = styled(Card)(({ theme, status }) => ({
    minWidth: 275,
    transition: 'all 0.3s ease',
    animation: `${pulseAnimation} 2s infinite`,
    backgroundColor: 
      status === 'on-track' ? theme.palette.success.light :
      status === 'at-risk' ? theme.palette.warning.light :
      theme.palette.error.light,
    color: theme.palette.getContrastText(
      status === 'on-track' ? theme.palette.success.light :
      status === 'at-risk' ? theme.palette.warning.light :
      theme.palette.error.light
    ),
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
    },
  }));