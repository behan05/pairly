import { Box, useTheme } from '@/MUI/MuiComponents';

// StyledText component for rendering gradient-colored, bold text
function StyledText({ text }) {
  const theme = useTheme();
  return (
    <Box
      component={'span'} // Render as a span element
      sx={{
        background: `
                linear-gradient(270deg, #b355d1, #ccc, 
                ${theme.palette.warning.main}, #B047ED)`, // Gradient background
        WebkitBackgroundClip: 'text',      // Clip background to text
        WebkitTextFillColor: 'transparent',// Make text fill transparent for gradient effect
        fontWeight: 'bold'                 // Bold font weight
      }}
    >
      {text}
    </Box>
  );
}

export default StyledText;
