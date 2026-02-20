import { Box, Stack, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';
import GroupChatWindow from './components/coreComponents/GroupChatWindow';
import GroupChatController from './GroupChatController';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

/**
 * GroupChatLayout component
 * - Main layout for Group chat page
 * - Handles responsive sidebar and chat window display
 * - Passes state to child components via Outlet context
 * - Includes GroupController for socket/event logic
 */

function GroupChatLayout() {
  const theme = useTheme();
  const isMd = useMediaQuery('(max-width:936px)');
  const [showChatWindow, setShowChatWindow] = useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    document.title = 'Pairly - Start a Group Chat';

  }, [dispatch]);

  return (
    <Box
      sx={{
        minHeight: 'calc(var(--vh, 1vh) * 100)',
        maxHeight: 'calc(var(--vh, 1vh) * 100)',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      {/* Left Sidebar: visible on desktop, toggled on mobile */}
      <Stack
        flex={1}
        sx={{
          background: theme.palette.background.paper,
          display: isMd ? (showChatWindow ? 'none' : 'flex') : 'flex'
        }}
      >
        {/* Pass sidebar state to child components */}
        <Outlet context={{ setShowChatWindow, showChatWindow }} />
      </Stack>

      {/* Right Chat Area: hidden on small screens unless chat window is open */}
      <Stack
        flex={2.5}
        sx={{
          display: !isMd || showChatWindow ? 'block' : 'none'
        }}
      >
        <GroupChatWindow setShowChatWindow={setShowChatWindow} />
      </Stack>

      {/* GroupController: handles socket events and chat logic in background */}
      <GroupChatController />
    </Box>
  );
}

export default GroupChatLayout;
