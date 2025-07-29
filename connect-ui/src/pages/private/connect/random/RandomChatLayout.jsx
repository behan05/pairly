import { Box, Stack, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';
import RandomChatWindow from './components/RandomChatWindow';
import RandomController from './RandomController';
import { useState } from 'react';

function RandomChatLayout() {
    const theme = useTheme();
    const isMd = useMediaQuery('(max-width:663px)');
    const [showChatWindow, setShowChatWindow] = useState(false);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                maxHeight: '100vh',
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            {/* Left Sidebar */}
            <Stack
                flex={1}
                sx={{
                    background: theme.palette.background.paper,
                    borderRight: `2px solid ${theme.palette.divider}`,
                    display: isMd ? (showChatWindow ? 'none' : 'flex') : 'flex',
                }}
            >
                <Outlet context={{ setShowChatWindow, showChatWindow }} />
            </Stack>

            {/* Right Chat Area (hidden on small screens) */}
            <Stack
                flex={2.5}
                sx={{
                    display: !isMd || showChatWindow ? 'block' : 'none',
                }}
            >
                <RandomChatWindow />
            </Stack>

            {
                /* brain (not seen on screen),
                 Because RandomController is the brain that runs the random chat logic silently in the background like connecting to server, listening to events, etc.
                 */
            }
            <RandomController />
        </Box>
    );
}

export default RandomChatLayout;
