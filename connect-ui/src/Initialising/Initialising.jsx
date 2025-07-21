import { Box, Typography, useMediaQuery, useTheme } from '@/MUI/MuiComponents';
import StyledText from '@/components/common/StyledText';
import intro from '../assets/intro/intro.mp4';
import intro2 from '../assets/intro/intro2.mp4';
import intro3 from '../assets/intro/intro3.mp4';
import intro4 from '../assets/intro/intro4.mp4';
import intro5 from '../assets/intro/intro5.mp4';

import vertical_intro from '../assets/intro/vertical-intro.mp4';
import vertical_intro2 from '../assets/intro/vertical-intro2.mp4';
import vertical_intro3 from '../assets/intro/vertical-intro3.mp4';
import vertical_intro4 from '../assets/intro/vertical-intro4.mp4';
import vertical_intro5 from '../assets/intro/vertical-intro5.mp4';

const videoList = [intro, intro2, intro3, intro4, intro5];
const smallScreenvideoList = [
  vertical_intro,
  vertical_intro,
  vertical_intro2,
  vertical_intro,
  vertical_intro,
  vertical_intro,
  vertical_intro3,
  vertical_intro,
  vertical_intro,
  vertical_intro4,
  vertical_intro,
  vertical_intro5,
  vertical_intro,
];

function Initialising() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const currentVideo = isSm
    ? smallScreenvideoList[Math.floor(Math.random() * smallScreenvideoList.length)]
    : videoList[Math.floor(Math.random() * videoList.length)];

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
          alignItems: 'center',
          zIndex: 1,
          backdropFilter: 'brightness(0.8)'
        }}
      >
        <Typography
          variant="h1"
          letterSpacing={2}
          sx={{
            color: 'text.primary', textAlign: 'center'
          }}>
          <strong>
            <i>Welcome to <StyledText text="Connect" /></i>
          </strong>
          <br />
          Getting things ready...
        </Typography>
      </Box>
    </Box>
  );
}

export default Initialising;
