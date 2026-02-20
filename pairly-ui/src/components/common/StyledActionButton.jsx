import { Button, useTheme } from '@/MUI/MuiComponents';
import { Link } from 'react-router-dom';

function StyledActionButton({
  icon,
  variant = 'outlined',
  type,
  text,
  redirectUrl,
  sx = {},
  ...props
}) {
  const theme = useTheme();

  return (
    <Button
      component={Link}
      to={redirectUrl}
      startIcon={icon}
      type={type}
      variant={variant}
      disableElevation
      sx={{
        position: 'relative',
        overflow: 'hidden',

        maxWidth: 'fit-content',
        alignSelf: 'flex-end',

        px: 2,
        py: 1,
        borderRadius: 0.2,

        fontFamily: 'monospace',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',

        border: `1px solid rgba(0,255,180,0.4)`,

        color: 'rgba(0,255,180,0.9)',
        background: 'rgba(10,15,20,0.6)',
        backdropFilter: 'blur(10px)',

        transition: 'all 0.3s ease',

        '& .MuiButton-startIcon': {
          color: 'rgba(0,255,180,0.9)',
        },

        '&:hover': {
          borderColor: 'rgba(0,255,180,0.8)',
          background: 'rgba(10,15,20,0.75)',
          boxShadow: '0 0 25px rgba(0,255,180,0.25)',
        },

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(90deg, transparent, rgba(0,255,180,0.2), transparent)',
          animation: 'scan 2.8s linear infinite',
        },

        '@keyframes scan': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },

        ...sx,
      }}
      {...props}
    >
      {text}
    </Button>
  );
}

export default StyledActionButton;
