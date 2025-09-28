import { Button } from '@/MUI/MuiComponents';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { styled } from '@mui/system';

// Styled button with zanina-yassine CSS
const CustomButton = styled(Button)(({ theme }) => ({
  minWidth: '120px',
  position: 'relative',
  cursor: 'pointer',
  padding: '12px 17px',
  border: 0,
  borderRadius: '7px',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
  background: 'radial-gradient(ellipse at bottom, rgba(71, 81, 92, 1) 0%, rgba(11, 21, 30, 1) 45%)',
  color: 'rgba(255, 255, 255, 0.66)',
  transition: 'all 1s cubic-bezier(0.15, 0.83, 0.66, 1)',
  '&::before': {
    content: '""',
    width: '70%',
    height: '1px',
    position: 'absolute',
    bottom: 0,
    left: '15%',
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)',
    opacity: 0.2,
    transition: 'all 1s cubic-bezier(0.15, 0.83, 0.66, 1)',
  },
  '&:hover': {
    color: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1) translateY(-3px)',
    '&::before': {
      opacity: 1,
    },
  },
}));

function DisconnectButton({ onClick, disabled = false }) {
  return (
    <CustomButton
      variant="outlined"
      startIcon={<PowerSettingsNewIcon sx={{ color: 'error.main' }} />}
      onClick={onClick}
      disabled={disabled}
    >
      Disconnect
    </CustomButton>
  );
}

export default DisconnectButton;
