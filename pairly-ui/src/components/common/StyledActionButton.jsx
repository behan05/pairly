import { Button, useTheme } from '@/MUI/MuiComponents';
import { Link } from 'react-router-dom';

function StyledActionButton({ icon, variant = 'outlined', type, text, redirectUrl, sx = {}, ...props }) {
  const theme = useTheme();

  return (
    <Button
      component={Link}
      to={redirectUrl}
      startIcon={icon}
      type={type}
      variant={variant}
      sx={{
        maxWidth: 'fit-content',
        alignSelf: 'flex-end',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 0.5,
        fontWeight: 700,
        px: 3,
        py: 0.8,
        fontSize: "1rem",
        color: theme.palette.text.primary,
        textShadow: `0 0 1px #3b3535ff`,
        background: theme.palette.background.paper,
        "&:hover": {
          background: theme.palette.background.default,
        },
        ...sx
      }}
      {...props}
    >
      {text}
    </Button>
  );
}

export default StyledActionButton;

