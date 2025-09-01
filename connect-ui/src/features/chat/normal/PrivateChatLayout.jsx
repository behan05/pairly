import React, { useState } from 'react';
import { Box, Stack, useTheme, useMediaQuery, Typography } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NormalChatController from './NormalChatController'
import PrivateChatWindow from './components/coreComponents/PrivateChatWindow';
/**
 * NormalChatLayout component
 * - Main layout for normal chat page
 * - Handles responsive sidebar and chat window display
 * - Passes state to child components via Outlet context
 * - Includes RandomController for socket/event logic
 */

function NormalChatLayout() {
  const theme = useTheme();
  const isTabletOrBelow = useMediaQuery('(max-width:775px)');
  const dispatch = useDispatch();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);

  React.useEffect(() => {
    document.title = 'Connect - Private Chat';
  }, [dispatch]);

  const handleBackToSidebar = () => {
    setSelectedUserId(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      {isTabletOrBelow ? (
        selectedUserId ? (
          <PrivateChatWindow
            selectedUserId={selectedUserId}
            onBack={handleBackToSidebar}
            onCloseChatWindow={setSelectedUserId}
            clearActiveChat={setActiveUserId}
          />
        ) :
          <Stack
            flex={1}
            sx={{
              background: theme.palette.background.paper,
              borderRight: `2px solid ${theme.palette.divider}`,
            }}
          >
            <Outlet context={{ setSelectedUserId, activeUserId, setActiveUserId }} />
          </Stack>
      ) : (
        <>
          <Stack
            flex={1}
            sx={{
              background: theme.palette.background.paper,
              borderRight: `2px solid ${theme.palette.divider}`,
            }}
          >
            <Outlet context={{ setSelectedUserId, activeUserId, setActiveUserId }} />
          </Stack>

          <Stack flex={2.5}>
            {selectedUserId ? (
              <PrivateChatWindow
                selectedUserId={selectedUserId}
                onCloseChatWindow={setSelectedUserId}
                clearActiveChat={setActiveUserId}
              />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                color="text.secondary"
                sx={{
                  userSelect: 'none',
                }}
              >
                <Typography
                  variant={'subtitle2'}
                  color={'text.primary'}
                  sx={{
                    background: theme.palette.background.paper,
                    py: 1,
                    px: 2,
                    borderRadius: 2
                  }}>
                  Select a chat to start messaging
                </Typography>
              </Box>
            )}
          </Stack>
        </>
      )}

      {/* RandomController: handles socket events and chat logic in background */}
      <NormalChatController />
    </Box>
  )
}

export default NormalChatLayout;

