import { Button, useTheme } from '@/MUI/MuiComponents';
import { Link } from 'react-router-dom';

function StyledButton({
  icon,
  variant = 'outlined',
  sx = {},
  type,
  text,
  redirectUrl,
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

        px: 2,
        py: 1,
        borderRadius: 0.2,

        fontFamily: 'monospace',
        fontSize: '0.8rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        fontWeight: 600,

        color: theme.palette.primary.light,
        border: `1px solid ${theme.palette.primary.dark}80`,
        background: 'rgba(15,20,30,0.6)',
        backdropFilter: 'blur(8px)',

        transition: 'all 0.3s ease',

        '& .MuiButton-startIcon': {
          color: theme.palette.primary.light,
        },

        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
          background: 'rgba(15,20,30,0.8)',
        },

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-120%',
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
          animation: 'scanLine 3s linear infinite',
        },

        '@keyframes scanLine': {
          '0%': { left: '-120%' },
          '100%': { left: '120%' },
        },

        ...sx,
      }}
      {...props}
    >
      {text}
    </Button>
  );
}

export default StyledButton;
