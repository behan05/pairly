import { Button } from '@/MUI/MuiComponents';
import SkipNextIcon from '@mui/icons-material/SkipNext';

/**
 * NextButton component renders a button to proceed to the next chat.
 * @param {Function} onClick - Function to execute when the button is clicked.
 * @param {boolean} [disabled=false] - If true, disables the button.
 * @return {JSX.Element} A button with an icon and text.
*/
function NextButton({ onClick, disabled = false }) {
  return (
    <Button
      variant="outlined"
      color="info"
      fullWidth
      startIcon={<SkipNextIcon sx={{ color: 'info.main' }} />}
      onClick={onClick}
      disabled={disabled}
      sx={{ width: 'fit-content', color: 'text.primary' }}
    >
      Next Chat
    </Button>
  );
}

export default NextButton;
