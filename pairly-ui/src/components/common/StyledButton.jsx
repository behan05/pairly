import { Button, useTheme } from '@/MUI/MuiComponents';
import { Link } from 'react-router-dom';

// StyledButton component for navigation and consistent styling
function StyledButton({ icon, variant = 'outlined', sx = {}, type, text, redirectUrl, ...props }) {
  const theme = useTheme();

  return (
    <Button
      component={Link}
      to={redirectUrl}
      startIcon={icon}
      type={type}
      variant={variant}
      sx={{
        borderRadius: 0.4,
        px: 3,
        py: 0.8,
        fontSize: "1rem",
        textTransform: 'none',
        fontWeight: 600,
        color: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        '&:hover': { background: theme.palette.action.hover },
        ...sx
      }}
      {...props}
    >
      {text}
    </Button>
  );
}

export default StyledButton;
