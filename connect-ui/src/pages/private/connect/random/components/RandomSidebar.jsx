import React from 'react';
import {
    Box,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from '@/MUI/MuiComponents';
import ChatSidebarHeader from '@/components/private/ChatSidebarHeader';
import ConnectButton from './ConnectButton';
import DisconnectButton from './DisconnectButton';
import NextButton from './NextButton';
import StyledText from '@/components/common/StyledText';
import SettingsAction from '@/components/private/SettingsAction';

import CountdownTimer from './CountdownTimer';
import RandomLandingLottie from '@/components/private/chat/RandomLandingPageLottie';

// we can read from Redux state (like connected, partnerId)
import { useDispatch, useSelector } from "react-redux";
import { socket } from '@/services/socket';
import { resetRandomChat, setWaiting } from '@/redux/slices/chat/randomChatSlice';

function RandomSidebar() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { waiting: isWaiting, connected: isConnected } = useSelector(state => state.randomChat);

    // === Handler Functions ===
    const handleConnect = () => {
        if (!socket.connected) {
            socket.connect();
        }

        // Prevent re-trigger if already in a match
        if (isConnected) {
            console.log("Already connected. Ignoring connect request.");
            return;
        }

        dispatch(setWaiting(true));
        socket.emit("join-random");
    };

    const handleNext = () => {
        // emit next-request
        socket.emit("random:next");
    };

    const handleDisconnect = () => {
        // emit disconnect-request
        socket.emit("random:disconnect");
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
                overflowY: 'auto',
            }}
        >
            <ChatSidebarHeader />

            <Stack
                spacing={3}
                px={2}
                pt={isSm ? 2 : 10}
                sx={{
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%'
                }}
            >
                {/* Chat image display. and Waiting circle dispaly */}
                {isWaiting ? (
                    <Stack
                        sx={{
                            minWidth: '100%',
                            maxHeight: '100%',
                            width: '100%',
                        }}
                    >
                        <CountdownTimer startFrom={10} autoRestart={true} />
                    </Stack>
                ) : (
                    <RandomLandingLottie />
                )}

                <Typography
                    variant="h6"
                    fontWeight={500}
                    textAlign={'justify'}
                    color='text.secondary'
                    py={7}
                >
                    Click <StyledText text={"Connect"} /> to instantly match with a random user from around the world.
                    Chat anonymously, safely, and enjoy real-time conversations!
                </Typography>

                {/* CTA Buttons */}
                <Stack
                    gap={2}
                    direction={'row'}
                    flexWrap={'wrap'}
                    justifyContent={'center'}
                    alignSelf={'center'}
                    pt={4}
                >
                    <ConnectButton onClick={handleConnect} />
                    <NextButton onClick={handleNext} />
                    <DisconnectButton onClick={handleDisconnect} />
                </Stack>
            </Stack>

            {/* Floating Settings icon at bottom of sidebar */}
            <Stack sx={{ position: 'relative' }}>
                <SettingsAction />
            </Stack>

        </Box>
    )
}

export default RandomSidebar;