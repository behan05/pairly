import { Box, useMediaQuery, useTheme, Tooltip, IconButton } from '@/MUI/MuiComponents';
import { useSelector } from 'react-redux';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

function DisconnectButton({ onClick, disabled = false }) {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    connected: isConnected,
  } = useSelector((state) => state.randomChat);

return (
    <>
      {isLg && isConnected ? (
        <Tooltip title="Disconnect">
          <IconButton
            onClick={onClick}
            disabled={disabled}
            sx={{
              width: 35,
              height: 35,
              background:
                'linear-gradient(90deg, transparent, rgba(255,60,60,0.25), transparent)',
              border: '1px solid rgba(255,60,60,0.4)',
              transition: 'all 0.3s ease',

              '&:hover': {
                borderColor: 'rgba(255,60,60,0.9)',
                boxShadow: '0 0 30px rgba(255,60,60,0.35)',
              },

              '&:active': {
                transform: 'scale(0.9)',
              },
            }}
          >
            <PowerSettingsNewIcon sx={{ color: 'error.main', fontSize: '0.9em' }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Box
          onClick={!disabled ? onClick : undefined}
          sx={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: 1.3,
            cursor: disabled ? 'not-allowed' : 'pointer',
            overflow: 'hidden',
            border: '1px solid rgba(255,60,60,0.4)',
            borderRadius: 0.2,
            background: 'rgba(20,10,10,0.6)',
            color: 'rgba(255,80,80,0.95)',
            backdropFilter: 'blur(10px)',
            letterSpacing: '0.25em',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',

            '&:hover': {
              borderColor: 'rgba(255,60,60,0.9)',
              boxShadow: '0 0 25px rgba(255,60,60,0.3)',
            },

            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              height: '100%',
              width: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255,60,60,0.25), transparent)',
              animation: 'scanDisconnect 2.8s linear infinite',
            },

            '@keyframes scanDisconnect': {
              '0%': { left: '-100%' },
              '100%': { left: '100%' },
            },
          }}
        >
          <PowerSettingsNewIcon sx={{ fontSize: 16, mr: 0.5, color: 'error.main' }} />
          DISCONNECT
        </Box>
      )}
    </>
  );
}

export default DisconnectButton;
