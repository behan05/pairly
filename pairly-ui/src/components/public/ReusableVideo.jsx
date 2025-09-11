import { Box, Stack, useTheme } from '@/MUI/MuiComponents';
import socialVideo from '@/assets/videos/socialVideo.mp4';

function ReusableVideo() {
  const theme = useTheme();
  return (
    <Stack flex={1} justifyContent={'center'} alignItems={'center'}>
      <Box
        component={'video'}
        src={socialVideo}
        aria-label="social video on landing page"
        autoPlay
        loop
        muted
        sx={{
          maxWidth: '100%',
          maxHeight: '100%',
          bgcolor: 'transparent',
          backdropFilter: 'blur(14px)',
          objectFit: 'cover',
          borderRadius: 2,
          boxShadow: 3,
          borderBottom: `1px dotted ${theme.palette.text.secondary}`
        }}
      />
    </Stack>
  );
}

export default ReusableVideo;
