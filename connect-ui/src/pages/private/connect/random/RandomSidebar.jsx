import React from 'react';
import {
    Box,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from '../../../../MUI/MuiComponents';
import ChatSidebarHeader from '@/components/private/ChatSidebarHeader';
import ConnectButton from './components/ConnectButton';
import DisconnectButton from './components/DisconnectButton';
import NextButton from './components/NextButton';
import StyledText from '@/components/common/StyledText';
import SettingsAction from '@/components/private/SettingsAction';

// Images
import friendsChatBigScreen from '@/assets/images/friends-chat-bigScreen.png'
import friendsChatSmallScreen from '@/assets/images/friends-chat-smallScreen.png'

function RandomSidebar() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

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
                }}
            >
                {/* Chat image display. */}
                <Stack
                    component={'img'}
                    src={isSm ? friendsChatSmallScreen : friendsChatBigScreen}
                    alt='random chat screen illustrations'
                    aria-label='random chat screen illustrations'
                    sx={{
                        minWidth: '100%',
                        maxHeight: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        filter: ' contrast(110%) brightness(110%)',
                    }}
                />

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
                    <ConnectButton />
                    <NextButton />
                    <DisconnectButton />
                </Stack>
            </Stack>

            {/* Floating Settings icon at bottom of sidebar */}
            <SettingsAction />

        </Box>
    )
}

export default RandomSidebar;