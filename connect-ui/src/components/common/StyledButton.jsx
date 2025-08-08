import { Button, useTheme } from '@/MUI/MuiComponents';
import { Link } from 'react-router-dom';

// StyledButton component for navigation and consistent styling
function StyledButton({ icon, variant = 'outlined', type, text, redirectUrl, ...props }) {
  const theme = useTheme();

  return (
    <Button
      component={Link} // Use react-router Link for navigation
      to={redirectUrl} // Destination URL
      startIcon={icon} // Optional icon at the start
      type={type} // Button type (submit, button, etc.)
      variant={variant} // Button variant (outlined by default)
      sx={{
        px: { xs: 2, sm: 3 }, // Responsive horizontal padding
        py: { xs: 1, sm: 1 }, // Responsive vertical padding
        background: 'transparent', // Transparent background
        backdropFilter: 'blur(14px)', // Blur effect
        border: 'none', // Remove border
        borderTopRightRadius: '6px', // Rounded top right corner
        borderBottomRightRadius: '6px', // Rounded bottom right corner
        borderBottom: `1px dotted ${theme.palette.success.main}`, // Dotted bottom border
        textTransform: 'none', // No uppercase transformation
        color: 'primary.contrastText', // Text color
        letterSpacing: 0.2, // Letter spacing
        textDecoration: 'none', // Remove underline
        transition: 'all 0.3s ease', // Smooth transition
        '&:hover': {
          transform: 'translateY(-5px)' // Move up on hover
        }
      }}
      {...props} // Spread any additional props
    >
      {text}
    </Button>
  );
}

export default StyledButton;
