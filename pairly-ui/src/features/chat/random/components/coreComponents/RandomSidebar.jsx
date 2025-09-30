import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip
} from '@/MUI/MuiComponents';
import { ArrowBackIcon, GroupIcon } from '@/MUI/MuiIcons';

// Components
import ChatSidebarHeader from '../../../common/ChatSidebarHeader';
import ConnectButton from '../supportComponents/ConnectButton';
import DisconnectButton from '../supportComponents/DisconnectButton';
import NextButton from '../supportComponents/NextButton';
import SettingsAction from '@/components/private/SettingsAction';
import CountdownTimer from '../supportComponents/CountdownTimer';
import RandomLandingLottie from '../supportComponents/RandomLandingPageLottie';
import StyledText from '@/components/common/StyledText';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '@/services/socket';
import { resetRandomChat, setWaiting } from '@/redux/slices/randomChat/randomChatSlice';
import { useOutletContext } from 'react-router-dom';

function RandomSidebar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { waiting: isWaiting, connected: isConnected } = useSelector(
    (state) => state.randomChat
  );
  const { setShowChatWindow, showChatWindow } = useOutletContext();
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(0);

  useEffect(() => {
    if (!isConnected && isSm) {
      setShowChatWindow(false);
    }
  }, [isConnected, isSm, setShowChatWindow]);

  const handleConnect = () => {
    if (!socket.connected) socket.connect();
    if (isConnected) return;

    dispatch(setWaiting(true));
    socket.emit('join-random');
    setShowChatWindow(true);
  };

  const handleNext = () => {
    socket.emit('random:next');
  };

  const handleDisconnect = () => {
    socket.emit('random:disconnect');
    dispatch(resetRandomChat());
  };

  useEffect(() => {
    socket.emit('getOnlineCount');

    socket.on('onlineCount', (count) => {
      setNumberOfActiveUsers(count);
    });

    return () => {
      socket.off('onlineCount');
    };
  }, []);

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      bgcolor="background.paper"
      minWidth={isSm ? '100%' : 380}
      px={1.5}
      sx={{
        minHeight: '100vh',
        maxHeight: '100vh',
        overflowY: 'auto'
      }}
    >
      {/* Sidebar header */}
      <ChatSidebarHeader />

      {/* Back button for mobile */}
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

      {/* Main Hero Section */}
      <Stack
        flex={1}
        alignItems="center"
        justifyContent="center"
        spacing={isSm ? 4 : 6}
        textAlign="center"
        pt={2}
      >
        {/* Heading ABOVE the image */}
        <Typography
          variant={isSm ? 'h4' : 'h3'}
          fontWeight={700}
          letterSpacing={1}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap', gap: 1 }}
        >
          Ready To Meet
          <Typography
            variant={'subtitle1'}
            sx={{ fontStyle: 'italic', textShadow: `0 0 1rem ${theme.palette.success.main}` }}
          >
            ❝<StyledText text={'someone new?'} />❞
          </Typography>
        </Typography>

        {/* Animation or countdown */}
        {isWaiting ? (
          <CountdownTimer startFrom={10} autoRestart />
        ) : (
          <RandomLandingLottie />
        )}

        {/* Action Buttons */}
        <Stack
          spacing={isSm ? 2 : 3}
          direction={isSm ? 'column' : 'row'}
          justifyContent="center"
          alignItems="center"
          mt={2}
          width="100%"
        >
          {isWaiting || isConnected ? (
            <>
              {isConnected && (
                <Tooltip title="Skip to the next user">
                  <NextButton onClick={handleNext} />
                </Tooltip>
              )}
              <Tooltip title="Say goodbye to your chat buddy 😢">
                <DisconnectButton onClick={handleDisconnect} />
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Start a new chat with someone">
              <Box width={isSm ? '100%' : 'auto'}>
                <ConnectButton
                  onClick={handleConnect}
                  fullWidth={isSm}
                />
              </Box>
            </Tooltip>
          )}
        </Stack>

        {/* Subtext + users online */}
        <Stack spacing={2} px={isSm ? 1 : 2}>
          <Typography
            variant="subtitle1"
            fontWeight={500}
            color="text.secondary"
          >
            Jump into real-time chats with people worldwide.
          </Typography>

          {/* Static users online (replace with real logic later) */}
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="text.secondary"
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}
          >
            <GroupIcon sx={{ fontSize: 'medium', color: 'info.main' }} />
            {numberOfActiveUsers === 1
              ? `${numberOfActiveUsers} person is online right now!`
              : `${numberOfActiveUsers} people are online right now!`
            }
          </Typography>
        </Stack>
      </Stack>

      {/* Settings action */}
      <Stack sx={{ position: 'relative', mt: isSm ? 0 : 4 }} alignItems="center">
        <SettingsAction />
      </Stack>
    </Box>
  );
}

export default RandomSidebar;
