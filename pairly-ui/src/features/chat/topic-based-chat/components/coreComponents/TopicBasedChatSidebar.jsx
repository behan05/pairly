import {
  Box,
  Stack,
  useTheme,
  useMediaQuery,
} from '@/MUI/MuiComponents';
import ChatSidebarHeader from '../../../common/ChatSidebarHeader';
import SettingsAction from '@/components/private/SettingsAction';

function TopicBasedChatSidebar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      display="flex"
      flexDirection="column"
      minWidth={isSm ? '100%' : 380}
      position="relative"
      sx={{
        height: 'calc(var(--vh, 1vh) * 100)',
        background: theme.palette.background.paper,
        overflow: 'hidden',
      }}
    >

      {/* Header */}
      <Stack sx={{ px: 1.5 }}>
        <ChatSidebarHeader />
      </Stack>

      {/* Settings */}
      <SettingsAction />
    </Box>
  );
}

export default TopicBasedChatSidebar;
