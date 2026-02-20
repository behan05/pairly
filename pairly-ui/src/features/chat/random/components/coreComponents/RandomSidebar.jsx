import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@/MUI/MuiComponents';
import {
  ArrowBackIcon,
  GroupIcon,
} from '@/MUI/MuiIcons';
import { keyframes } from '@emotion/react'

import ChatSidebarHeader from '../../../common/ChatSidebarHeader';
import ConnectButton from '../supportComponents/ConnectButton';
import DisconnectButton from '../supportComponents/DisconnectButton';
import NextButton from '../supportComponents/NextButton';
import SettingsAction from '@/components/private/SettingsAction';
import CountdownTimer from '../supportComponents/CountdownTimer';
import RandomLandingLottie from '../supportComponents/RandomLandingPageLottie';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '@/services/socket';
import { resetRandomChat, setWaiting } from '@/redux/slices/randomChat/randomChatSlice';
import { useOutletContext } from 'react-router-dom';

function RandomSidebar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { waiting: isWaiting, connected: isConnected } = useSelector((state) => state.randomChat);
  const { setShowChatWindow, showChatWindow } = useOutletContext();
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(0);
  const { subscription } = useSelector((state) => state?.auth?.user);
  const { plan, status } = subscription;
  const hasPremiumAccess = plan !== 'free' && status === 'active';
  const isFreeUser = !hasPremiumAccess;

  useEffect(() => {
    if (!isConnected && isSm) setShowChatWindow(false);
  }, [isConnected, isSm, setShowChatWindow]);

  const handleConnect = () => {
    if (!socket.connected) socket.connect();
    if (isConnected) return;
    dispatch(setWaiting(true));
    socket.emit('join-random');
    setShowChatWindow(true);
  };

  const handleNext = () => socket.emit('random:next');
  const handleDisconnect = () => {
    socket.emit('random:disconnect');
    dispatch(resetRandomChat());
  };

  useEffect(() => {
    socket.emit('getOnlineCount');
    socket.on('onlineCount', (count) => setNumberOfActiveUsers(count));
    return () => socket.off('onlineCount');
  }, []);

  // Ads push on mount
  useEffect(() => {
    if (isFreeUser && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense push error", e);
      }
    }
  }, [isFreeUser]);

  const floatShape = keyframes`
           0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
      100% { transform: translateY(0px) rotate(360deg); }`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      minWidth={isSm ? '100%' : 380}
      position="relative"
      sx={{
        height: 'calc(var(--vh, 1vh) * 100)',
        background: theme.palette.background.paper,
        overflow: 'hidden',
      }}
    >

      {/* Header */}
      <Stack sx={{ px: 1.5 }}>
        <ChatSidebarHeader />
      </Stack>

      {/* Stars Background */}
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

      {/* Back button (mobile) */}
      {isSm && showChatWindow && (
        <IconButton
          onClick={() => setShowChatWindow(false)}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            zIndex: 10,
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}

      {/* active user count */}
      <Stack
        alignItems="flex-end"
        mr={1}
        mt={1}
        >
        <Typography
          variant="overline"
          sx={{
            mt: 2,
            gap: 0.6,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            letterSpacing: 2,
            background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            borderBottom: `1px solid ${theme.palette.divider}`       
          }}
        >
          <GroupIcon sx={{ fontSize: 18 }} />
          {numberOfActiveUsers === 1
            ? `${numberOfActiveUsers} person online`
            : `${numberOfActiveUsers} people online`}
        </Typography>
      </Stack>

      {/* Main content */}
      <Box
        flex={1}
        overflowY="auto"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={isSm ? 3 : 4}
      >
        <Stack
          sx={{
            position: 'relative',
            borderRadius: 1,
            padding: 4,
            cursor: 'pointer',
            boxShadow: `inset 0 0 0.5rem ${theme.palette.success.dark}`,

            '&:hover': {
              boxShadow: `inset 0 0 0.7rem ${theme.palette.success.dark}`,
            },
          }}
        >
          <Stack mx="auto" textAlign="center" spacing={1}>
            <Typography
              variant="h5"
              sx={{
                color: "#00F5FF",
                letterSpacing: 3,
                fontSize: 20,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Your Next Chat Awaits
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: `${theme.palette.text.secondary}`,
              }}
            >
              Connect with random people worldwide
            </Typography>
          </Stack>

          {isWaiting ? (
            <Box sx={{ width: '100%', maxWidth: 250, mx: 'auto' }}>
              <CountdownTimer startFrom={10} autoRestart />
            </Box>
          ) : (
            <Box sx={{ width: '80%', maxWidth: 200, mx: 'auto' }}>
              <RandomLandingLottie />
            </Box>
          )}

          <Stack
            direction={isSm ? 'column' : 'row'}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            {isWaiting || isConnected ? (
              <>
                {isConnected && (
                  <Tooltip title="Next user">
                    <NextButton onClick={handleNext} />
                  </Tooltip>
                )}
                <Tooltip title="End chat">
                  <DisconnectButton onClick={handleDisconnect} />
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Start Chat">
                <ConnectButton onClick={handleConnect} fullWidth={isSm} />
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Ads for Free User */}
      {isFreeUser && (
        <Box sx={{ width: '100%', mt: 2, textAlign: 'center', position: 'absolute', bottom: 0 }}>
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-8711176865382424"
            data-ad-slot="9308698789"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </Box>
      )}

      {/* Settings */}
      <SettingsAction />

    </Box>
  );
}

export default RandomSidebar;
