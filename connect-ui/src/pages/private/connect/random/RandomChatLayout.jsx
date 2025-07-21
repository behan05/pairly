import {
    Box,
    Stack,
    useTheme,
    useMediaQuery,
} from '../../../../MUI/MuiComponents';
import { Outlet } from 'react-router-dom';
import RandomChatWindow from './RandomChatWindow';

function RandomChatLayout() {

    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{
            minHeight: '100vh',
            maxHeight: '100vh',
            display: 'flex',
            flexDirection: 'row',
        }}>
            {/* Sidebar panel */}

            <Stack flex={1} sx={{
                background: `${theme.palette.background.paper}`,
                borderRight: `2px solid ${theme.palette.divider}`,
            }}>
                <Outlet />
            </Stack>

            {/* chat Window */}
            <Stack flex={2.5} sx={{display: isSM ? 'none' : 'block'}}>
                <RandomChatWindow />
            </Stack>

        </Box>
    )
}

export default RandomChatLayout; 