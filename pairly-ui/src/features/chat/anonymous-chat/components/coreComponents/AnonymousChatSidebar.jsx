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

// Action Button
import ConnectButton from '../../../common/buttons/ConnectButton';
import NextButton from '../../../common/buttons/NextButton';
import DisconnectButton from '../../../common/buttons/DisconnectButton';

// Search Indicator Tottie
import CountdownTimer from '../../../common/finding-users/CountdownTimer';
import FloatShape from '../../../common/backgroud-effect/FloatShape';

import ChatSidebarHeader from '../../../common/ChatSidebarHeader';
import AnonymousChatLottie from '../supportComponents/AnonymousChatLottiePage';

import SettingsAction from '@/components/private/SettingsAction';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '@/services/socket';
import { resetAnonymousState, setWaiting } from '@/redux/slices/anonymousChat/anonymousSlice';
import { useOutletContext } from 'react-router-dom';

function AnonymousChatSidebar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { waiting: isWaiting, connected: isConnected } = useSelector(state => state.anonymousChat);
  const { setShowChatWindow, showChatWindow } = useOutletContext();
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(0);
  const { subscription } = useSelector((state) => state?.auth?.user);
  const { plan, status } = subscription;
  const hasPremiumAccess = plan !== 'free' && status === 'active';
  const isFreeUser = !hasPremiumAccess; // use for adsense

  useEffect(() => {
    if (!isConnected && isSm) setShowChatWindow(false);
  }, [isConnected, isSm, setShowChatWindow]);

  const handleConnect = () => {
    if (!socket.connected) socket.connect();
    if (isConnected) return;

    dispatch(setWaiting(true));
    socket.emit('join:anonymous');
    setShowChatWindow(true);
  };

  const handleNext = () => socket.emit('anonymous:next');
  const handleDisconnect = () => {
    socket.emit('anonymous:disconnect');
    dispatch(resetAnonymousState());
  };

  // TODO: Getting anonymous waiting users count
  useEffect(() => {
    socket.emit('getOnlineCount');
    socket.on('onlineCount', (count) => setNumberOfActiveUsers(count));
    return () => socket.off('onlineCount');
  }, []);

  // Button text
  const connectButtonText = {
    smallScreenText: "CONNECT",
    largeScreenText: "START ANONYMOUS CHAT"
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
              Safe Anonymous Space
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: `${theme.palette.text.secondary}`,
              }}
            >
              Chat without sharing your identity
            </Typography>
          </Stack>

          {isWaiting ? (
            <Box sx={{ width: '100%', maxWidth: 250, mx: 'auto' }}>
              <CountdownTimer startFrom={10} autoRestart />
            </Box>
          ) : (
            <Box sx={{ width: '80%', maxWidth: 200, mx: 'auto' }}>
              <AnonymousChatLottie />
            </Box>
          )}

          {/* Need to fixed  */}
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
              <Tooltip title="Start Anonymous Chat">
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

export default AnonymousChatSidebar;
