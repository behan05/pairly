import {
    Box,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
    IconButton,
} from '@/MUI/MuiComponents';
import ChatSidebarHeader from '@/components/private/ChatSidebarHeader';
import ConnectButton from './ConnectButton';
import DisconnectButton from './DisconnectButton';
import NextButton from './NextButton';
import StyledText from '@/components/common/StyledText';
import SettingsAction from '@/components/private/SettingsAction';
import CountdownTimer from './CountdownTimer';
import RandomLandingLottie from '@/components/private/chat/RandomLandingPageLottie';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useDispatch, useSelector } from 'react-redux';
import { socket } from '@/services/socket';
import { resetRandomChat, setWaiting } from '@/redux/slices/chat/randomChatSlice';
import { useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';

function RandomSidebar() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { waiting: isWaiting, connected: isConnected } = useSelector(state => state.randomChat);
    const { setShowChatWindow, showChatWindow } = useOutletContext();

    // === Auto return to sidebar when disconnected (on small screen only)
    useEffect(() => {
        if (!isConnected && isSm) {
            setShowChatWindow(false);
        }
    }, [isConnected, isSm, setShowChatWindow]);

    // === Handler Functions ===
    const handleConnect = () => {
        if (!socket.connected) socket.connect();
        if (isConnected) return;

        dispatch(setWaiting(true));
        socket.emit("join-random");

        // chat window open on connect
        setShowChatWindow(true);
    };

    const handleNext = () => {
        socket.emit("random:next");
    };

    const handleDisconnect = () => {
        socket.emit("random:disconnect");
        dispatch(resetRandomChat());

        // no need to setShowChatWindow(false) here — useEffect handles it
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
                overflowY: 'auto',
            }}
        >
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
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
            )}

            <Stack
                spacing={3}
                px={2}
                pt={isSm ? 6 : 10}
                sx={{
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                }}
            >
                {isWaiting ? (
                    <Stack sx={{ minWidth: '100%', maxHeight: '100%', width: '100%' }}>
                        <CountdownTimer startFrom={10} autoRestart={true} />
                    </Stack>
                ) : (
                    <RandomLandingLottie />
                )}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    textAlign={'justify'}
                    color="text.secondary"
                    letterSpacing={0.5}
                    py={7}
                >
                    Click <StyledText text="Connect" /> to instantly match with a random user from around the world.
                    Chat anonymously, safely, and enjoy real-time conversations!
                </Typography>

                <Stack
                    gap={2}
                    direction="row"
                    flexWrap="wrap"
                    justifyContent="center"
                    alignSelf="center"
                    pt={4}
                >
                    <ConnectButton onClick={handleConnect} />
                    <NextButton onClick={handleNext} />
                    <DisconnectButton onClick={handleDisconnect} />
                </Stack>
            </Stack>

            <Stack sx={{ position: 'relative' }}>
                <SettingsAction />
            </Stack>
        </Box>
    );
}

export default RandomSidebar;
