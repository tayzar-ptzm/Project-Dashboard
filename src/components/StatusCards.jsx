/* eslint-disable no-unused-vars */
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  styled,
  keyframes 
} from '@mui/material';

// Soft pulse animation
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const StatusCard = styled(Card)(({ theme, status }) => ({
  minWidth: 240,
  padding: theme.spacing(2),
  borderRadius: 16,
  transition: 'all 0.4s ease',
  animation: `${pulseAnimation} 4s ease-in-out infinite`,
  background: 
    status === 'on-track' ? 'linear-gradient(135deg, #a8e063, #56ab2f)' :
    status === 'at-risk' ? 'linear-gradient(135deg, #fceabb, #f8b500)' :
    'linear-gradient(135deg, #ff758c, #ff7eb3)',
  color: theme.palette.getContrastText(
    status === 'on-track' ? '#56ab2f' :
    status === 'at-risk' ? '#f8b500' :
    '#ff7eb3'
  ),
  boxShadow: `0 4px 20px rgba(0,0,0,0.1)`,
  '&:hover': {
    transform: 'translateY(-6px) scale(1.02)',
    boxShadow: theme.shadows[10],
  },
}));

export default StatusCard;
