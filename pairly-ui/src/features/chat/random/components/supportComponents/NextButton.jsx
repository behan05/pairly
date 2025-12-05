import { Button } from '@/MUI/MuiComponents';
import SkipNextIcon from '@mui/icons-material/SkipNext';

function NextButton({ onClick, disabled = false }) {

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      startIcon={<SkipNextIcon sx={{ color: 'info.main' }} />}
      sx={(theme) => ({
        fontSize: '0.95rem',
        borderRadius: 20,
        padding: '6px 16px',
        textTransform: 'none',
        fontWeight: 600,

        boxShadow: `inset 0 0 0.2em ${theme.palette.info.main}`,
        border: 'none',
        color: theme.palette.info.main,

        transition: 'all 0.3s ease',

        background:
          theme.palette.mode === 'dark'
            ? theme.palette.background.default
            : theme.palette.background.paper,

        '&:hover': {
          borderColor: theme.palette.info.dark,
          boxShadow:
          theme.palette.mode === 'dark'
            ? `0 4px 12px ${theme.palette.success.dark}80`
            : `0 4px 12px ${theme.palette.success.light}80`,
          transform: 'translateY(-2px)',
        },

        '&:active': {
          transform: 'scale(0.95)',
        },

        '&.Mui-disabled': {
          opacity: 0.6,
        },
      })}
    >
      Next
    </Button>
  );
}

export default NextButton;
