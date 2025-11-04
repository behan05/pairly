import { Button, useTheme } from '@/MUI/MuiComponents';
import { Link } from 'react-router-dom';

// StyledButton component for navigation and consistent styling
function StyledActionButton({ icon, variant = 'outlined', type, text, redirectUrl, sx = {}, ...props }) {
  const theme = useTheme();

  return (
    <Button
      component={Link} // Use react-router Link for navigation
      to={redirectUrl} // Destination URL
      startIcon={icon} // Optional icon at the start
      type={type} // Button type (submit, button, etc.)
      variant={variant} // Button variant (outlined by default)
      sx={{
        // maxWidth: 'fit-content',
        borderRadius: 0.4,
        textTransform: "none",
        fontWeight: 700,
        px: 3,
        py: 0.8,
        fontSize: "1rem",
        color: theme.palette.common.white,
        background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        boxShadow: `0 6px 20px ${theme.palette.secondary.main}99`,
        "&:hover": {
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main}, ${theme.palette.secondary.main})`,
          boxShadow: `0 5px 15px ${theme.palette.primary.main}90`,
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

