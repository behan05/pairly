import { Button } from '@/MUI/MuiComponents';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

/**
 * DisconnectButton component renders a button to disconnect a service.
 * @param {Function} onClick - Function to call when the button is clicked.
 * @param {Boolean} [disabled=false] - Whether the button is disabled.
 * @returns {JSX.Element} A button with an icon and text.
*/
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
