import { Box, Typography, useMediaQuery, useTheme, Stack } from '@/MUI/MuiComponents';
import StyledText from '@/components/common/StyledText';
import intro3 from '../assets/intro/intro3.mp4';
import vertical_intro from '../assets/intro/vertical-intro.mp4';

function Initialising() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const currentVideo = isSm ? vertical_intro : intro3;

  return (

    <Box
      sx={{
        position: 'relative',
        zIndex: 1
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
          filter: 'brightness(0.40)',
          zIndex: -2
        }}
      />

      {/* === Optional Dark Overlay === */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          backgroundColor: 'transparent',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)'
        }}
      />

      <Stack
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography
          variant={isSm ? 'h6' : 'h3'}
          letterSpacing={1.5}
          sx={{
            color: 'text.primary',
            textAlign: 'center'
          }}
        >
          <i>
            <StyledText text="Floating through the stars to Connect" />
          </i>
          <br />
          Searching the galaxy for someone special...
        </Typography>
      </Stack>
    </Box>
  );
}

export default Initialising;
