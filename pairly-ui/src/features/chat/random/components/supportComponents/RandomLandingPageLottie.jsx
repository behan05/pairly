import { useMediaQuery, useTheme, Box } from '@/MUI/MuiComponents';
import video from '@/assets/videos/landingPageSidebarVideo.mp4';

const RandomLandingVideo = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Set max size relative to viewport to prevent scrollbar
  const maxSize = isXs ? '80vw' : isMd ? '60vw' : '50vw';
  const maxHeight = isXs ? '50vh' : isMd ? '55vh' : '60vh';

  return (
    <Box
      sx={{
        maxWidth: maxSize,
        height: 'auto',
        maxHeight: maxHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        overflow: 'hidden',
        filter: `drop-shadow(20px 10px 6px ${theme.palette.divider})`,
        borderRadius: 1.5,
      }}
    >
      <video
        src={video}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',

        }}
      />
    </Box>
  );
};

export default RandomLandingVideo;
