import { Button } from '@/MUI/MuiComponents';
import BoltIcon from '@mui/icons-material/Bolt';
import StyledText from '@/components/common/StyledText';
/**
 * ConnectButton component renders a button to initiate a connection.
 * @param {Function} onClick - Function to execute when the button is clicked.
 * @param {boolean} [disabled=false] - If true, disables the button.
 * @return {JSX.Element} A button with an icon and text.
 */

function ConnectButton({ onClick, disabled = false }) {
  return (
    <Button
      variant="outlined"
      fullWidth
      startIcon={<BoltIcon sx={{ color: 'success.main' }} fontSize={'medium'} />}
      onClick={onClick}
      disabled={disabled}
      sx={{ width: 'fit-content', color: 'text.primary', fontSize: '1.2rem' }}
    >
      {<StyledText text={'Start Random Chat'} />}{' '}
    </Button>
  );
}

export default ConnectButton;
