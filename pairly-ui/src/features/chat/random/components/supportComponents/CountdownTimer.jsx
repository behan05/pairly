import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery, Box, Typography, Stack } from '@/MUI/MuiComponents';
import { Player } from '@lottiefiles/react-lottie-player';
import searchingUsersInLightMode from '@/assets/lottie/searchingUsersInLightMode.json';
import searchingUsersInDarkMode from '@/assets/lottie/searchingUsersInDarkMode.json';

const messages = [
  'Finding your best match…',
  'Be kind',
  'Respect everyone',
  'Have fun!',
  'Chat safely'
];

const CountdownTimer = ({ startFrom = 10, autoRestart = true }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [count, setCount] = useState(startFrom);
  const [msgIndex, setMsgIndex] = useState(0);

  const getTheme = localStorage.getItem('theme');
  const searchingUsers = getTheme === 'dark' ? searchingUsersInDarkMode : searchingUsersInLightMode

  // Countdown logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (count <= 0) {
        if (autoRestart) setCount(startFrom);
        return;
      }
      setCount(c => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, startFrom, autoRestart]);

  // Message rotation logic
  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(msgTimer);
  }, []);

  const maxSize = isXs ? '80vw' : isMd ? '60vw' : '50vw';
  const maxHeight = isXs ? '50vh' : isMd ? '55vh' : '60vh';

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ position: 'relative', width: '100%' }}
    >
      {/* Lottie Animation */}
      <Box
        sx={{
          maxWidth: maxSize,
          maxHeight: maxHeight,
          width: '100%',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          overflow: 'hidden',
          filter: `drop-shadow(20px 10px 6px ${theme.palette.divider})`,
          borderRadius: 1.5,
          position: 'relative',
        }}
      >
        <Player
          autoplay
          loop
          src={searchingUsers}
          style={{ width: '70%', height: '70%', maxHeight }}
        />
      </Box>

      {/* Rotating messages */}
      <Typography
        variant="subtitle1"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 600,
          textAlign: 'center',
          fontStyle: 'italic',
          fontSize: isXs ? '0.9rem' : '1rem',
          textShadow: `0 0 6px ${theme.palette.primary.main}33, 0 0 2px ${theme.palette.info.main}33`, // subtle glow
          transition: 'all 0.3s ease-in-out',
          mx: 2,
          letterSpacing: 0.5,
        }}
      >
        {messages[msgIndex]}
      </Typography>

    </Stack>
  );
};

export default CountdownTimer;
