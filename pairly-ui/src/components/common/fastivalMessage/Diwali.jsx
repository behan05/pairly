import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Player } from '@lottiefiles/react-lottie-player';
import HappyDiwali from '@/assets/lottie/HappyDiwali.json';

function Diwali() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                width: isSm ? 130 : 270,          // Fixed small width (you can tweak this)
                height: isSm ? 130 : 270,         // Fixed small height
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                overflow: 'hidden',
                borderRadius: 2,
                bgcolor: 'background.paper', // optional nice background
                p: 1,                        // small padding
            }}
        >
            <Player
                autoplay
                loop
                src={HappyDiwali}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </Box>
    );
}

export default Diwali;
