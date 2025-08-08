import { Player } from '@lottiefiles/react-lottie-player'; // Lottie animation player
import landingLottieJson from '@/assets/lottie/RandomLandingPageMessage'; // Animation JSON file
import { useMediaQuery, useTheme, Box } from '@/MUI/MuiComponents'; // MUI hooks and Box

// RandomLandingLottie component displays a responsive Lottie animation on the landing page
const RandomLandingLottie = () => {
  const theme = useTheme(); // Get theme for breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is extra small
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Check if screen is medium

  // Set animation size based on screen size
  const size = isXs ? 300 : isMd ? 350 : 400;

  return (
    <Box
      sx={{
        width: `${size}px`, // Responsive width
        height: `${size}px`, // Responsive height
        display: 'flex', // Flexbox for centering
        alignItems: 'center', // Center vertically
        justifyContent: 'center', // Center horizontally
        mx: 'auto', // Center in parent horizontally
        overflow: 'hidden' // Hide overflow
      }}
    >
      {/* Lottie Player for animation */}
      <Player
        autoplay // Play animation automatically
        loop // Loop animation
        src={landingLottieJson} // Animation source
        style={{
          width: '100%', // Fill container width
          height: '100%', // Fill container height
          objectFit: 'contain', // Contain animation in box
          display: 'block' // Block display
        }}
        renderer="svg" // Use SVG renderer for crisp animation
      />
    </Box>
  );
};

export default RandomLandingLottie;
