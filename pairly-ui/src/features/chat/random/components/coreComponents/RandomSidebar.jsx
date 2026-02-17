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

  const twinkle = keyframes`
      0% { opacity: 0.2; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 0.2; transform: scale(0.8); }`

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
      {Array.from({ length: 100 }).map((_, i) => {
        const size = Math.random() * 3 + 1
        const duration = Math.random() * 5 + 3
        const delay = Math.random() * 5

        return (
          <Stack
            key={i}
            sx={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `${theme.palette.secondary.dark}`,
              boxShadow: `0 20px 50px ${theme.palette.primary.main}40`,
              opacity: Math.random(),
              animation: `${twinkle} ${duration}s ease-in-out ${delay}s infinite`,
              pointerEvents: 'none',
            }}
          />
        )
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
            padding: 4,
            background: theme.palette.background.paper,
            overflow: 'hidden',
            zIndex: 1,
            minWidth: '360px',

            // Animated border layer
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -2,
              background: `conic-gradient(
        from 0deg,
        ${theme.palette.primary.dark},
        ${theme.palette.secondary.dark},
        ${theme.palette.primary.dark}
      )`,
              animation: 'rotateBorder 8s linear infinite',
              zIndex: -2,
            },

            // Inner mask to create border thickness
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 2,
              background: theme.palette.background.paper,
              zIndex: -1,
              boxShadow: `0 0 10rem ${theme.palette.primary.dark}`
            },

            backdropFilter: 'blur(12px)',
            transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',

            '&:hover': {
              boxShadow: `0 0 2rem ${theme.palette.primary.dark}`
            },

            '@keyframes rotateBorder': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        >

          <Typography
            variant="h2"
            sx={{
              fontSize: isSm ? "1.8rem" : "2.4rem",
              fontWeight: 700,
              letterSpacing: "1px",
              background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Random Chat
          </Typography>

          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              mb: 1,
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            Meet someone new instantly
          </Typography>

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

          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: theme.palette.text.secondary,
              gap: 0.6,
              borderRadius: 0.5,
              p: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItem: 'center',
              background: `linear-gradient(180deg,
      ${theme.palette.background.paper},
      ${theme.palette.info.dark}10)`,
            }}
          >
            <GroupIcon sx={{ fontSize: 18, color: 'info.main' }} />
            {numberOfActiveUsers === 1
              ? `${numberOfActiveUsers} people online`
              : `${numberOfActiveUsers} peoples online`}
          </Typography>
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
