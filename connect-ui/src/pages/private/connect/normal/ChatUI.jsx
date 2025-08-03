import React, { useState } from 'react';
import { Box, Stack, useMediaQuery, useTheme } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';
import ChatWindow from './ChatWindow';

function ChatUI() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const theme = useTheme();
  const isTabletOrBelow = useMediaQuery(theme.breakpoints.down('sm'));

  const handleBackToSidebar = () => {
    setSelectedUserId(null);
  };

  return (
    <Box display="flex" height="100vh" bgcolor="background.default">
      {/* Sidebar or ChatWindow based on screen size */}
      {isTabletOrBelow ? (
        selectedUserId ? (
          <ChatWindow selectedUserId={selectedUserId} onBack={handleBackToSidebar} />
        ) : (
          <Stack flex={1}>
            <Outlet context={{ setSelectedUserId }} />
          </Stack>
        )
      ) : (
        <>
          <Stack flex={1}>
            <Outlet context={{ setSelectedUserId }} />
          </Stack>
          <Stack flex={2.5} sx={{ display: 'flex', flexDirection: 'column' }}>
            <ChatWindow selectedUserId={selectedUserId} />
          </Stack>
        </>
      )}
    </Box>
  );
}

export default ChatUI;
