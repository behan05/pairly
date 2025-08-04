import { Button, useTheme } from '@/MUI/MuiComponents';

// StyledActionButton component for consistent action button styling
const StyledActionButton = ({
  children,      // Button label/content
  endIcon,       // Optional icon at the end
  onClick,       // Click handler
  type = 'button', // Button type
  disabled = false, // Disabled state
  sx = {}        // Custom styles
}) => {
  const theme = useTheme();

  return (
    <Button
      variant="outlined"         // Outlined button style
      type={type}                // Button type (submit, button, etc.)
      endIcon={endIcon}          // Icon at the end of button
      disabled={disabled}        // Disable button if true
      onClick={onClick}          // Click event handler
      sx={{
        mt: 2,                   // Margin top
        alignSelf: 'center',     // Center align
        border: 'none',          // Remove border
        borderTopRightRadius: '6px',    // Rounded top right corner
        borderBottomRightRadius: '6px', // Rounded bottom right corner
        borderBottom: `1px dotted ${theme.palette.success.main}`, // Dotted bottom border
        backdropFilter: 'blur(14px)',   // Blur effect
        backgroundColor: 'transparent', // Transparent background
        color: 'primary.contrastText',  // Text color
        textTransform: 'none',          // No uppercase transformation
        letterSpacing: 2,               // Letter spacing
        transition: 'all 0.3s ease',    // Smooth transition
        '&:hover': {
          transform: 'translateY(-5px)' // Move up on hover
        },
        ...sx                           // Allow custom styles to override
      }}
    >
      {children}
    </Button>
  );
};

export default StyledActionButton;
