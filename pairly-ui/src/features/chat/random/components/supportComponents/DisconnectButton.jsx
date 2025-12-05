import { Button } from '@/MUI/MuiComponents';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

function DisconnectButton({ onClick, disabled = false }) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      startIcon={<PowerSettingsNewIcon sx={{ color: 'error.main' }} />}
      sx={(theme) => ({
        fontSize: '0.95rem',
        borderRadius: 20,
        padding: '6px 16px',
        textTransform: 'none',
        fontWeight: 600,

        boxShadow: `inset 0 0 0.2em ${theme.palette.error.main}`,
        border: 'none',
        color: theme.palette.error.main,

        transition: 'all 0.3s ease',

        background:
          theme.palette.mode === 'dark'
            ? theme.palette.background.default
            : theme.palette.background.paper,

        '&:hover': {
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 4px 12px ${theme.palette.error.dark}80`
              : `0 4px 12px ${theme.palette.error.light}80`,
          border: 'none',
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
      Disconnect
    </Button>
  );
}

export default DisconnectButton;
