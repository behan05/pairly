import { Box, useTheme, useMediaQuery } from '@/MUI/MuiComponents';

function ConnectButton({ onClick, disabled = false }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      onClick={!disabled ? onClick : undefined}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: isSm ? 4 : 2,
        py: 1.4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        overflow: 'hidden',
        border: '1px solid rgba(0,255,180,0.4)',
        borderRadius: 0.2,
        background: 'rgba(10,15,20,0.6)',
        backdropFilter: 'blur(10px)',
        letterSpacing: '0.25em',
        fontFamily: 'monospace',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        color: 'rgba(0,255,180,0.9)',
        transition: 'all 0.3s ease',

        '&:hover': {
          borderColor: 'rgba(0,255,180,0.8)',
          boxShadow: '0 0 25px rgba(0,255,180,0.25)',
        },

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          height: '100%',
          width: '100%',
          background:
            'linear-gradient(90deg, transparent, rgba(0,255,180,0.2), transparent)',
          animation: 'scan 2.8s linear infinite',
        },

        '@keyframes scan': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      }}
    >
      {isSm ? 'CONNECT' : 'INITIATE RANDOM CHAT'}
    </Box>
  );

}

export default ConnectButton;
