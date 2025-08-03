import { Button } from '@/MUI/MuiComponents';
import SkipNextIcon from '@mui/icons-material/SkipNext';

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
