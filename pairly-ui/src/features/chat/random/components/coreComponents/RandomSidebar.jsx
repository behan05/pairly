import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Paper
} from '@/MUI/MuiComponents';
import { ArrowBackIcon, GroupIcon } from '@/MUI/MuiIcons';
import ChatSidebarHeader from '../../../common/ChatSidebarHeader';
import ConnectButton from '../supportComponents/ConnectButton';
import DisconnectButton from '../supportComponents/DisconnectButton';
import NextButton from '../supportComponents/NextButton';
import SettingsAction from '@/components/private/SettingsAction';
import StyledText from '@/components/common/StyledText';
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

  return (
    <Box
      display="flex"
      flexDirection="column"
      minWidth={isSm ? '100%' : 380}
      height="100vh"
      bgcolor="background.default"
      position="relative"
      sx={{
        background: `linear-gradient(135deg,
        ${theme.palette.primary.light}15,
        ${theme.palette.background.default} 70%)`,
        overflow: 'hidden',
      }}
    >

      {/* Header */}
      <Stack sx={{ px: 1.5 }}>
        <ChatSidebarHeader />
      </Stack>

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
        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            p: isSm ? 3 : 4,
            width: '100%',
            maxWidth: 360,
            backdropFilter: 'blur(10px)',
            background:
              theme.palette.mode === 'dark'
                ? theme.palette.background.paper + '99'
                : theme.palette.background.default + '99',
            border: `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            transition: 'all 0.5s ease',
            position: 'relative',
            overflow: 'hidden',

            // sunlight from top
            ':before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(
                to bottom, 
                ${theme.palette.mode === 'dark'
                  ? theme.palette.primary.light + '33'
                  : theme.palette.primary.main + '55'},
                transparent 60%)`,
              opacity: 0,
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              pointerEvents: 'none',
              zIndex: 1,
              transform: 'translateY(0%)',
            },
            ':hover:before': {
              opacity: 1,
              transform: 'translateY(50%)',
              boxShadow: `inset 0 -4px 1px ${theme.palette.divider}`,
            },

            // Make inner content above the pseudo-element
            '& > *': {
              position: 'relative',
              zIndex: 2,
            },
          }}
        >

          {/* Title */}
          <StyledText text="Random Chat" sx={{ fontSize: isSm ? '1.5rem' : '2rem' }} />

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            Meet someone new instantly
          </Typography>

          {/* Lottie / Countdown */}
          {isWaiting ? (
            <CountdownTimer startFrom={10} autoRestart />
          ) : (
            <Box sx={{ width: '80%', maxWidth: 200 }}>
              <RandomLandingLottie />
            </Box>
          )}

          {/* Buttons */}
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

          {/* Online count */}
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
            }}
          >
            <GroupIcon sx={{ fontSize: 18, color: 'info.main' }} />
            {numberOfActiveUsers <= 1
              ? `${numberOfActiveUsers} person online`
              : `${numberOfActiveUsers} people online`}
          </Typography>
        </Paper>
      </Box>

      {/* Settings */}
      <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
        <SettingsAction />
      </Box>
    </Box>
  );
}

export default RandomSidebar;
