import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Player } from '@lottiefiles/react-lottie-player';
import FireWorks from '@/assets/lottie/FireWorks.json';

function FireWork({ width = '100%', height = '100%', maxWidth = 500, maxHeight = 500 }) {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                width: width,
                height: height,
                maxWidth: isSm ? maxWidth * 0.6 : maxWidth,
                maxHeight: isSm ? maxHeight * 0.6 : maxHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                overflow: 'visible',
                borderRadius: 2,
                p: 1,
                position: 'relative',
                pointerEvents: 'none',
                zIndex: 1,
            }}
        >
            <Player
                autoplay
                loop={isSm ? false : true}
                src={FireWorks}
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                }}
            />
        </Box>
    );
}

export default FireWork;
