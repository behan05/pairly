import { Button, useTheme } from '@/MUI/MuiComponents';
import { Link } from 'react-router-dom';

function SecondaryButton({
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
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        fontWeight: 600,

        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.primary}`,
        boxShadow: `inset 0 0 20px ${theme.palette.text.primary}40`,
        background: 'transparent',
        backdropFilter: 'blur(8px)',

        transition: 'all 0.3s ease',

        '&:hover': {
          borderColor: `${theme.palette.text.secondary}60`,
          boxShadow: `none`,
        },

        ...sx,
      }}
      {...props}
    >
      {text}
    </Button>
  );
}

export default SecondaryButton;
