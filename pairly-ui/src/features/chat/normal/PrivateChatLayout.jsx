import React, { useState } from 'react';
import { Box, Stack, useTheme, useMediaQuery, Typography, Tooltip } from '@/MUI/MuiComponents';
import { ForumRoundedIcon } from '@/MUI/MuiIcons';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NormalChatController from './NormalChatController'
import PrivateChatWindow from './components/coreComponents/PrivateChatWindow';
import privateChatWindowImage from '@/assets/images/chatWindowImage1.png'
import privateChatWindowImage2 from '@/assets/images/chatWindowImage.png'
import chatWindowBackgroundDarkImage from '@/assets/images/chatWindowBackgroundDarkImage.png';
import chatWindowBackgroundLightImage from '@/assets/images/chatWindowBackgroundLightImage.png';

/**
 * NormalChatLayout component
 * Main layout for the chat page
 * - Handles responsive layout for sidebar & chat window
 * - Displays chat background images
 * - Integrates PrivateChatWindow & socket/controller logic
 */

function NormalChatLayout() {
  const theme = useTheme();
  const isTabletOrBelow = useMediaQuery('(max-width:775px)'); // small screen check
  const isLg = useMediaQuery(theme.breakpoints.down('lg')); // medium screen check
  const dispatch = useDispatch();

  const [selectedUserId, setSelectedUserId] = useState(null); // currently open chat user
  const [activeUserId, setActiveUserId] = useState(null); // tracks active chat

  // Set page title when component mounts
  React.useEffect(() => {
    document.title = 'Pairly - private worlds';
  }, [dispatch]);

  const handleBackToSidebar = () => {
    setSelectedUserId(null); // go back to sidebar on small screen
  };

  // Select background image based on theme
  let bgChatImg =
    localStorage.getItem('theme') === 'dark'
      ? chatWindowBackgroundDarkImage
      : chatWindowBackgroundLightImage;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      {/* Mobile / tablet view */}
      {isTabletOrBelow ? (
        selectedUserId ? (
          // Show chat window if a user is selected
          <Stack sx={{
            backgroundImage: `url(${bgChatImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            width: '100%',
          }}>
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
              borderRight: `2px solid ${theme.palette.divider}`,
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
              borderRight: `2px solid ${theme.palette.divider}`,
            }}
          >
            <Outlet context={{ setSelectedUserId, activeUserId, setActiveUserId }} />
          </Stack>

          {/* Chat window */}
          <Stack flex={2.5}>
            {selectedUserId ? (
              // Show chat if a user is selected
              <Stack sx={{
                backgroundImage: `url(${bgChatImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                width: '100%',
              }}>
                <PrivateChatWindow
                  selectedUserId={selectedUserId}
                  onCloseChatWindow={setSelectedUserId}
                  clearActiveChat={setActiveUserId}
                />
              </Stack>
            ) : (
              // Default empty chat window placeholder
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                color="text.secondary"
                sx={{
                  userSelect: 'none',
                  backgroundImage: isLg ? `url(${privateChatWindowImage2})` : `url(${privateChatWindowImage})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  minHeight: "100dvh",
                  width: "100%",
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Box sx={{
                  mb: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Tooltip
                    title="Your chat will appear here once you're clicked on user">
                    <ForumRoundedIcon
                      sx={{
                        fontSize: 80,
                        color: 'info.main',
                      }}
                    />
                  </Tooltip>
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
              </Box>
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
