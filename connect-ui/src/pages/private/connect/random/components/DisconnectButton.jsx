import { Button } from '@/MUI/MuiComponents';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

function DisconnectButton({ onClick, disabled = false }) {
  return (
    <Button
      variant="outlined"
      color="error"
      fullWidth
      startIcon={<PowerSettingsNewIcon sx={{ color: 'error.main' }} />}
      onClick={onClick}
      disabled={disabled}
      sx={{ width: 'fit-content', color: 'text.primary' }}
    >
      Disconnect
    </Button>
  );
}

export default DisconnectButton;
