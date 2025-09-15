import { useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip
} from '@/MUI/MuiComponents';
import { ArrowBackIcon } from '@/MUI/MuiIcons';

// Components
import ChatSidebarHeader from '../../../common/ChatSidebarHeader';
import ConnectButton from '../supportComponents/ConnectButton';
import DisconnectButton from '../supportComponents/DisconnectButton';
import NextButton from '../supportComponents/NextButton';
import StyledText from '@/components/common/StyledText';
import SettingsAction from '@/components/private/SettingsAction';
import CountdownTimer from '../supportComponents/CountdownTimer';
import RandomLandingLottie from '../supportComponents/RandomLandingPageLottie';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '@/services/socket';
import { resetRandomChat, setWaiting } from '@/redux/slices/randomChat/randomChatSlice';
import { useOutletContext } from 'react-router-dom';

/**
 * RandomSidebar component
 * - Displays sidebar for random chat feature
 * - Handles connect, next, and disconnect actions
 * - Shows landing animation, instructions, and action buttons
 * - Responsive for mobile and desktop
 */
function RandomSidebar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { waiting: isWaiting, connected: isConnected } = useSelector((state) => state.randomChat);
  const { setShowChatWindow, showChatWindow } = useOutletContext();

  // Auto return to sidebar when disconnected (on small screen only)
  useEffect(() => {
    if (!isConnected && isSm) {
      setShowChatWindow(false);
    }
  }, [isConnected, isSm, setShowChatWindow]);

  // Handler: Connect to random chat
  const handleConnect = () => {
    if (!socket.connected) socket.connect();
    if (isConnected) return;

    dispatch(setWaiting(true));
    socket.emit('join-random');
    setShowChatWindow(true); // Open chat window on connect
  };

  // Handler: Go to next random user
  const handleNext = () => {
    socket.emit('random:next');
  };

  // Handler: Disconnect from chat
  const handleDisconnect = () => {
    socket.emit('random:disconnect');
    dispatch(resetRandomChat());
  };

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      bgcolor="background.paper"
      minWidth={300}
      px={2}
      sx={{
        minHeight: '100vh',
        maxHeight: '100vh',
        overflowY: 'auto'
      }}
    >
      {/* Sidebar header */}
      <ChatSidebarHeader />

      {/* Back Button: only on small screen + chat window is open */}
      {isSm && showChatWindow && (
        <IconButton
          onClick={() => setShowChatWindow(false)}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 10,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}

      <Stack
        px={2}
        pt={isSm ? 3 : 6}
        sx={{
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        {/* Waiting animation or landing animation */}
        {isWaiting ? (
          <Stack sx={{ minWidth: '100%', maxHeight: '100%', width: '100%' }}>
            <CountdownTimer startFrom={10} autoRestart={true} />
          </Stack>
        ) : (
          <RandomLandingLottie />
        )}

        {/* Tag Lines and instructions */}
        <Stack spacing={2.5}>
          <Typography
            variant={isSm ? 'h3' : 'h4'}
            fontWeight={700}
            letterSpacing={0.8}
            gutterBottom
          >
            <StyledText text="Meet Someone" /> New Instantly.
          </Typography>

          <Typography
            variant="subtitle1"
            fontWeight={500}
            textAlign="start"
            color="text.secondary"
            letterSpacing={0.4}
          >
            Tap <strong style={{ fontWeight: 700, color:theme.palette.text.primary }}>Connect</strong> to jump into a real-time, anonymous chat with someone
            across the world. Safe, spontaneous, and surprisingly fun.
          </Typography>

          <Typography
            variant="body2"
            fontWeight={400}
            textAlign="justify"
            color="text.secondary"
            letterSpacing={0.3}
          >
            Just a simple profile. Better matches, better chats.
          </Typography>
        </Stack>

        {/* Action Buttons: Connect, Next, Disconnect */}
        <Stack
          gap={2}
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          alignSelf="center"
          mt={2}
        >
          <Tooltip
            title={isConnected ? 'You’re already connected' : 'Start a new chat with someone'}
          >
            <Typography variant={'label1'}>
              <ConnectButton onClick={handleConnect} disabled={isConnected} />
            </Typography>
          </Tooltip>

          <Tooltip
            title={isConnected ? 'Skip to the next user' : 'You must be connected to use Next 😔'}
          >
            <Typography variant={'label1'}>
              <NextButton onClick={handleNext} disabled={!isConnected} />
            </Typography>
          </Tooltip>

          <Tooltip
            title={
              isConnected ? 'Say goodbye to your chat buddy 😢' : 'You’re not connected yet 😔'
            }
          >
            <Typography variant={'label1'}>
              <DisconnectButton onClick={handleDisconnect} />
            </Typography>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Settings action button */}
      <Stack sx={{ position: 'relative' }}>
        <SettingsAction />
      </Stack>
    </Box>
  );
}

export default RandomSidebar;
