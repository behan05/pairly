import React, { useState } from 'react';
import { Box, Stack, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NormalChatController from './NormalChatController'
import PrivateChatWindow from './components/coreComponents/PrivateChatWindow';
import NotConnectedWindow from '../common/NotConnectedWindow';
import ChatBgStyle from '../common/chat-background-effect/ChatBgStyle';

/**
 * NormalChatLayout component
 * Main layout for the chat page
 * - Handles responsive layout for sidebar & chat window
 * - Displays chat background images
 * - Integrates PrivateChatWindow & socket/controller logic
 */

function NormalChatLayout() {
  const theme = useTheme();
  const isTabletOrBelow = useMediaQuery('(max-width:775px)');
  const dispatch = useDispatch();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);

  // Set page title when component mounts
  React.useEffect(() => {
    document.title = 'Pairly - Private Space';
  }, [dispatch]);

  const handleBackToSidebar = () => {
    // go back to sidebar on small screen
    setSelectedUserId(null);
  };

  // Select background image based on theme
  let bgChatImg =
    localStorage.getItem('theme') === 'dark'
      ? <ChatBgStyle mode='dark' />
      : <ChatBgStyle mode='light' />

  return (
    <Box
      sx={{
        minHeight: 'calc(var(--vh, 1vh) * 100)',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      {/* Mobile / tablet view */}
      {isTabletOrBelow ? (
        selectedUserId ? (
          // Show chat window if a user is selected
          <Stack sx={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
          }}>
            {bgChatImg}
            <PrivateChatWindow
              selectedUserId={selectedUserId}
              onBack={handleBackToSidebar} // back button on mobile
              onCloseChatWindow={setSelectedUserId}
              clearActiveChat={setActiveUserId}
            />
          </Stack>
        ) :
          // Show user list (Outlet) if no chat selected
          <Stack
            flex={1}
            sx={{
              background: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Outlet context={{ setSelectedUserId, activeUserId, setActiveUserId }} />
          </Stack>
      ) : (
        // Desktop / large screen view
        <>
          {/* Sidebar for user list */}
          <Stack
            flex={1}
            sx={{
              background: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Outlet context={{ setSelectedUserId, activeUserId, setActiveUserId }} />
          </Stack>

          {/* Chat window */}
          <Stack flex={2.5}>
            {selectedUserId ? (
              // Show chat if a user is selected
              <Stack sx={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
              }}>
                {bgChatImg}

                <PrivateChatWindow
                  selectedUserId={selectedUserId}
                  onCloseChatWindow={setSelectedUserId}
                  clearActiveChat={setActiveUserId}
                />
              </Stack>
            ) : (
              // Default empty chat window placeholder
              <NotConnectedWindow
                title="Private Messages"
                subTitle="No conversation selected"
                description={`Pick a friend from the left to begin chatting securely.`}
              />
            )}
          </Stack>
        </>
      )}

      {/* Controller handles background chat/socket logic */}
      <NormalChatController />
    </Box>
  )
}

export default NormalChatLayout;
