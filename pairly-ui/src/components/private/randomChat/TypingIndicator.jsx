import { Player } from '@lottiefiles/react-lottie-player';
import typingAnimation from '@/assets/lottie/typing.json';
import { Box } from '@/MUI/MuiComponents';

const TypingAnimation = () => {
  const size = 60;

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
        src={typingAnimation}
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

export default TypingAnimation;
