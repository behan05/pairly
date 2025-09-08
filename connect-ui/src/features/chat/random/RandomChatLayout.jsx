import { Box, Stack, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';
import RandomChatWindow from './components/coreComponents/RandomChatWindow';
import RandomChatController from './RandomChatController';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

/**
 * RandomChatLayout component
 * - Main layout for random chat page
 * - Handles responsive sidebar and chat window display
 * - Passes state to child components via Outlet context
 * - Includes RandomController for socket/event logic
 */

function RandomChatLayout() {
  const theme = useTheme();
  const isMd = useMediaQuery('(max-width:936px)');
  const [showChatWindow, setShowChatWindow] = useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    document.title = 'Connect - Start a Random Chat';

  }, [dispatch]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      {/* Left Sidebar: visible on desktop, toggled on mobile */}
      <Stack
        flex={1}
        sx={{
          background: theme.palette.background.paper,
          // borderRight: `2px solid ${theme.palette.divider}`,
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
        <RandomChatWindow setShowChatWindow={setShowChatWindow} />
      </Stack>

      {/* RandomController: handles socket events and chat logic in background */}
      <RandomChatController />
    </Box>
  );
}

export default RandomChatLayout;
