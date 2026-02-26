import {
    Box,
    useTheme
} from '@/MUI/MuiComponents';
import { keyframes } from '@emotion/react';

function FloatShape() {
    const theme = useTheme();

    const floatShape = keyframes`
               0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }`;

    return (
        <Box>
            {Array.from({ length: 15 }).map((_, i) => {
                const size = Math.random() * 30 + 20;
                const duration = Math.random() * 8 + 4;
                const delay = Math.random() * 5;
                const rotate = Math.random() * 360;

                return (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: size,
                            height: size,
                            borderRadius: '12px',
                            background: `linear-gradient(185deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            opacity: 0.01,
                            transform: `rotate(${rotate}deg)`,
                            filter: 'blur(2px)',
                            animation: `${floatShape} ${duration}s ease-in-out ${delay}s infinite alternate`,
                            pointerEvents: 'none',
                            boxShadow: `0 0 ${size / 3}px ${theme.palette.primary.main}80, 0 0 ${size / 2}px ${theme.palette.secondary.main}50`,
                        }}
                    />
                );
            })}
        </Box>
    )
}

export default FloatShape