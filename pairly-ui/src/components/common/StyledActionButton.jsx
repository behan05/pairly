import { Button, useTheme } from '@/MUI/MuiComponents';
import { Link } from 'react-router-dom';

function PrimaryButton({
  icon,
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
      disableElevation
      sx={{
        position: 'relative',
        overflow: 'hidden',

        px: 2,
        py: 1,
        borderRadius: 0.2,

        fontFamily: 'monospace',
        fontSize: '0.8rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        fontWeight: 600,

        color: theme.palette.background.default,
        background: theme.palette.text.primary,

        border: `1px solid ${theme.palette.text.primary}`,

        boxShadow: `
          inset 0 0 10px rgba(255,255,255,0.15),
          0 2px 6px rgba(0,0,0,0.25)
        `,

        transition: 'all 0.2s ease',

        '&:hover': {
          background: theme.palette.text.secondary,
          borderColor: theme.palette.text.secondary,
          transform: 'translateY(-1px)',
        },

        '&:active': {
          transform: 'translateY(0px) scale(0.97)',
          boxShadow: `
            inset 0 0 12px rgba(0,0,0,0.4)
          `,
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '40%',
          height: '100%',
          background: `linear-gradient(
            120deg,
            transparent,
            rgba(255,255,255,0.25),
            transparent
          )`,
          transition: 'left 0.4s ease',
        },

        '&:hover::after': {
          left: '120%',
        },

        ...sx,
      }}
      {...props}
    >
      {text}
    </Button>
  );
}

export default PrimaryButton;