import { Box, Stack, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import RandomChatWindow from './components/RandomChatWindow';
import RandomController from './RandomController';

function RandomChatLayout() {
    const theme = useTheme(); // Access theme (for breakpoints, colors, etc.)
    const isMd = useMediaQuery('(max-width:663px)'); // custom breakpoint

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
                }}
            >
                <Outlet /> {/* This will render RandomSidebar based on route */}
            </Stack>

            {/* Right Chat Area (hidden on small screens) */}
            <Stack
                flex={2.5}
                sx={{
                    display: isMd ? 'none' : 'block',
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
