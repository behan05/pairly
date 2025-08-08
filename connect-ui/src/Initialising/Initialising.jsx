import { Box, Typography, useMediaQuery, useTheme } from '@/MUI/MuiComponents';
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
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        m: 0,
        p: 0,
        position: 'relative'
      }}
    >
      <video
        src={currentVideo}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: isSm ? 'center' : 'flex-end',
          zIndex: 1,
          backdropFilter: 'brightness(0.8)'
        }}
      >
        <Typography
          variant={isSm ? 'h5' : 'h2'}
          letterSpacing={1.5}
          sx={{
            color: 'text.primary',
            textAlign: 'center'
          }}
        >
          <strong>
            <i>
              Floating through the stars to <StyledText text="Connect" />
            </i>
          </strong>
          <br />
          Searching the galaxy for someone special...
        </Typography>
      </Box>
    </Box>
  );
}

export default Initialising;
