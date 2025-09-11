import { Box, useTheme } from '@/MUI/MuiComponents';

// BlurWrapper component adds a blurred background and styled container around its children.
// Accepts custom component type, styles, and other props.
const BlurWrapper = ({ children, component = 'div', onSubmit, sx = {}, ...rest }) => {
  const theme = useTheme();

  return (
    <Box
      component={component} // The HTML element type to render
      onSubmit={onSubmit} // Optional submit handler for forms
      mt={4} // Margin top
      display="flex" // Flexbox layout
      flexDirection="column" // Stack children vertically
      gap={4} // Gap between children
      maxWidth={800} // Maximum width of the container
      minWidth={300} // Minimum width of the container
      mx="auto" // Center horizontally
      px={2} // Padding left/right
      py={3} // Padding top/bottom
      borderRadius={1} // Rounded corners
      sx={{
        backdropFilter: 'blur(14px)', // Apply blur effect to background
        backgroundColor: 'inherit', // Inherit background color
        boxShadow: `inset 1px 1px 0.2rem ${theme.palette.divider}`, // Inner shadow
        ...sx // Allow custom styles to override defaults
      }}
      {...rest} // Spread any additional props
    >
      {children}
    </Box>
  );
};

export default BlurWrapper;
