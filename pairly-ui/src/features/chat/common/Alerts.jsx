import { Box, Stack, Typography } from "@/MUI/MuiComponents";
import { NotificationsNoneIcon } from "@/MUI/MuiIcons";

// components
import ChatSidebarHeader from './ChatSidebarHeader';

function Alerts() {
  return (
    <Box sx={{ px: 1.5 }}>
      {/* Navbar */}
      <ChatSidebarHeader />

      {/* Content */}
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ height: '80%', textAlign: 'center', color: 'text.secondary' }}
      >
        <NotificationsNoneIcon sx={{ fontSize: 38, color: 'warning.main' }} />
        <Typography variant="body1">
          There are no alert messages yet.
        </Typography>
      </Stack>
    </Box>
  );
}

export default Alerts;
