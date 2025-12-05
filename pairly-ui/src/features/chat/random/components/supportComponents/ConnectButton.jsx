import { Button } from '@/MUI/MuiComponents';
import BoltIcon from '@mui/icons-material/Bolt';

function ConnectButton({ onClick, disabled = false }) {

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      sx={(theme) => ({
        fontSize: '1rem',
        borderRadius: 50,
        height: '3.2rem',
        width: '3.2rem',
        minWidth: 0,
        padding: 0,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 2,
        borderColor: theme.palette.success.main,

        background:
          theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : theme.palette.background.default,

        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 4px 12px ${theme.palette.success.dark}40`
            : `0 4px 12px ${theme.palette.success.light}40`,

        transition: 'all 0.25s ease',

        '&:hover': {
          transform: 'scale(1.08) translateY(-2px)',
          background:
            theme.palette.mode === 'dark'
              ? theme.palette.background.paper
              : theme.palette.action.hover,

          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 6px 16px ${theme.palette.success.main}60`
              : `0 6px 16px ${theme.palette.success.light}60`,
        },

        '&:active': {
          transform: 'scale(0.95)',
        },

        '&.Mui-disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      })}
    >
      <BoltIcon
        sx={(theme) => ({
          color: theme.palette.success.main,
          fontSize: '2rem',
          animation: 'pulseBolt 1.6s infinite ease-in-out',

          '@keyframes pulseBolt': {
            '0%': { transform: 'scale(1)', opacity: 0.9 },
            '50%': { transform: 'scale(1.25)', opacity: 1 },
            '100%': { transform: 'scale(1)', opacity: 0.9 },
          },
        })}
      />
    </Button>
  );
}

export default ConnectButton;
