import { Box } from '@mui/material';
import { Player } from '@lottiefiles/react-lottie-player';
import DiyaLottie from '@/assets/lottie/Diya.json';

function Diya() {

    return (
        <Box
            sx={{
                width: 65,          // Fixed small width (you can tweak this)
                height: 40,         // Fixed small height
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                overflow: 'hidden',
                borderRadius: 2,
                p: 1,                        // small padding
            }}
        >
            <Player
                autoplay
                loop
                src={DiyaLottie}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </Box>
    );
}

export default Diya;
