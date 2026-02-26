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

// Action button
import ConnectButton from '../../../common/buttons/ConnectButton';
import DisconnectButton from '../../../common/buttons/DisconnectButton';
import NextButton from '../../../common/buttons/NextButton';

// Search Indicator Tottie
import CountdownTimer from '../../../common/finding-users/CountdownTimer';
import FloatShape from '../../../common/backgroud-effect/FloatShape';

import ChatSidebarHeader from '../../../common/ChatSidebarHeader';
import SettingsAction from '@/components/private/SettingsAction';
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

  // Button text
  const connectButtonText = {
    smallScreenText: "CONNECT",
    largeScreenText: "INITIATE RANDOM CHAT"
  }

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

      {/* Float Shape Background */}
      <FloatShape />

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
                fontSize: 16,
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
                    <NextButton
                      onClick={handleNext}
                      text={'NEXT'}
                    />
                  </Tooltip>
                )}
                <Tooltip title="End chat">
                  <DisconnectButton
                    onClick={handleDisconnect}
                    text={'DISCONNECT'}
                  />
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Start Chat">
                <ConnectButton
                  onClick={handleConnect}
                  fullWidth={isSm}
                  textAsObject={connectButtonText}
                />
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Settings */}
      <SettingsAction />

    </Box>
  );
}

export default RandomSidebar;
