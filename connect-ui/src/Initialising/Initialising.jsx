import { Box, useMediaQuery, useTheme, Stack } from '@/MUI/MuiComponents';
import intro from '../assets/intro/intro.mp4';
import vertical_intro from '../assets/intro/vertical-intro.mp4';

function Initialising() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const currentVideo = isSm ? vertical_intro : intro;

  return (

    <Box
      sx={{
        position: 'relative',
      }}
    >
      {/* === Background Video === */}
      <Stack
        component={'video'}
        src={currentVideo}
        loading="lazy"
        aria-label="background video"
        autoPlay
        muted
        loop
        playsInline
        type="video/mp4"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(100%)',
        }}
      />
    </Box>
  );
}

export default Initialising;
