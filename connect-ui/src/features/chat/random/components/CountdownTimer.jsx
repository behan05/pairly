import { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography, useTheme } from '@/MUI/MuiComponents';
import gsap from 'gsap';

/**
 * CountdownTimer Component
 *
 * Displays a countdown with animation, optionally auto-restarting.
 *
 * @param {number} startFrom - The number to start counting down from (default: 10)
 * @param {boolean} autoRestart - Whether to restart countdown after reaching 0 (default: false)
 */

const CountdownTimer = ({ startFrom = 10, autoRestart = false }) => {
  const [time, setTime] = useState(startFrom);
  const numberRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    let timer;

    // Animate countdown number using GSAP
    const animate = () => {
      gsap.fromTo(
        numberRef.current,
        { scale: 0.7, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        }
      );
    };

    if (time > 0) {
      // Animate each number
      animate();
      // Decrease time every second
      timer = setTimeout(() => setTime((prev) => prev - 1), 1000);
    } else if (autoRestart) {
      setTimeout(() => setTime(startFrom), 1000);
    }

    // Restart countdown if autoRestart is true
    return () => clearTimeout(timer);
  }, [time, startFrom, autoRestart]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="250px"
      borderRadius={1}
      boxShadow={`inset 2px 2px 3px ${theme.palette.success.main}`}
      bgcolor={theme.palette.background.default}
    >
      <Stack
        elevation={6}
        sx={{
          padding: '2rem 4rem',
          borderRadius: '16px',
          backgroundColor: theme.palette.background.paper,
          boxShadow: `inset -2px -2px 3px ${theme.palette.success.main}`,
          textAlign: 'center'
        }}
      >
        <Typography
          ref={numberRef}
          variant="h2"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            fontFamily: 'monospace'
          }}
        >
          {time > 0 ? time : '🚀'}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ marginTop: '0.5rem', color: theme.palette.text.secondary }}
        >
          {time > 0 ? 'Finding best match...' : 'Time’s up!'}
        </Typography>
      </Stack>
    </Box>
  );
};

export default CountdownTimer;
