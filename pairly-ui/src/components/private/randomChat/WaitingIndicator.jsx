import { Player } from '@lottiefiles/react-lottie-player';
import waitingAnimation from '@/assets/lottie/waiting.json';
import { Box } from '@mui/material';

const WaitingIndicator = () => {
  const size = '60';

  return (
    <Box
      sx={{
        width: `${size}px`,
        height: `${40}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'hidden',
        position: 'relative'
      }}
    >
      <Player
        autoplay
        loop
        src={waitingAnimation}
        style={{
          width: '100%',
          height: '100%',
          marginTop: '1rem',
          objectFit: 'contain',
          display: 'block'
        }}
        renderer="svg"
      />
    </Box>
  );
};

export default WaitingIndicator;
