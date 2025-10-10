import { Box, useTheme, keyframes } from '@mui/system'; // <-- important

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

function StyledText({ text, sx = {} }) {
  const theme = useTheme();

  const gradientColors =
    theme.palette.mode === 'dark'
      ? [
        theme.palette.primary.main, // rich purple
        theme.palette.info.main,    // cyan accent
        theme.palette.success.main  // subtle green
      ]
      : [
        theme.palette.primary.dark, // darker purple for light background
        theme.palette.info.dark,    // darker cyan
        theme.palette.success.dark  // darker green
      ];


  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        background: `linear-gradient(270deg, ${gradientColors.join(', ')})`,
        backgroundSize: '400% 400%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
        animation: `${shimmer} 4s ease infinite`,
        ...sx,
      }}
    >
      {text}
    </Box>
  );
}

export default StyledText;
