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
import OnboardingFeedback from '@/pages/feedback/OnboardingFeedback'

function RandomSidebar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { waiting: isWaiting, connected: isConnected } = useSelector((state) => state.randomChat);
  const { setShowChatWindow, showChatWindow } = useOutletContext();
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(0);
  const { subscription, hasGivenOnboardingFeedback } = useSelector((state) => state?.auth?.user);
  const { plan, status } = subscription;
  const isFreeUser = status === 'active' && plan === 'free';

  const [openOnboardingFeedback, setOpenOnboardingFeedback] = useState(false);

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

  useEffect(() => {
    if (!hasGivenOnboardingFeedback) {
      const lastSkipped = localStorage.getItem("onboardingFeedbackSkippedAt");
      const completed = localStorage.getItem("onboardingFeedbackDoneAt");

      const oneWeek = 7 * 24 * 60 * 60 * 1000;      // 7 days
      const twoMonths = 60 * 24 * 60 * 60 * 1000;   // ~60 days

      // If user skipped — show again after a week
      if (lastSkipped && Date.now() - lastSkipped > oneWeek) {
        setOpenOnboardingFeedback(true);
      }

      // If user has given feedback — show again after 2 months
      if (completed && Date.now() - completed > twoMonths) {
        setOpenOnboardingFeedback(true);
      }

      // If user never skipped or gave feedback before — show immediately
      if (!lastSkipped && !completed) {
        setOpenOnboardingFeedback(true);
      }
    }
  }, []);

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

  return (
    <Box
      display="flex"
      flexDirection="column"
      minWidth={isSm ? '100%' : 380}
      height="100vh"
      position="relative"
      sx={{
        background: theme.palette.background.paper,
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
        <Stack
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 1,
            p: 2,
            transition: "0.3s",
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant='h2'
            sx={{
              fontSize: isSm ? '1.5rem' : '2rem',
              textAlign: 'center'
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

      {/* Onboarding Feedback */}
      <OnboardingFeedback
        open={openOnboardingFeedback}
        onClose={() => setOpenOnboardingFeedback(false)}
      />
    </Box>
  );
}

export default RandomSidebar;
