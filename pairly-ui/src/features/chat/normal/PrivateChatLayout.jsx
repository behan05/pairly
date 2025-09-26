import React, { useState } from 'react';
import { Box, Stack, useTheme, useMediaQuery, Typography, Tooltip } from '@/MUI/MuiComponents';
import { ForumRoundedIcon } from '@/MUI/MuiIcons';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NormalChatController from './NormalChatController'
import PrivateChatWindow from './components/coreComponents/PrivateChatWindow';
import privateChatWindowImage from '@/assets/images/chatWindowImage1.png'
import privateChatWindowImage2 from '@/assets/images/chatWindowImage.png'

/**
 * NormalChatLayout component
 * - Main layout for normal chat page
 * - Handles responsive sidebar and chat window display
 * - Passes state to child components via Outlet context
 * - Includes PRivateController for socket/event logic
 */

function NormalChatLayout() {
  const theme = useTheme();
  const isTabletOrBelow = useMediaQuery('(max-width:775px)');
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);

  React.useEffect(() => {
    document.title = 'Pairly - Private Chat';
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

      {/* RandomController: handles socket events and chat logic in background */}
      <NormalChatController />
    </Box>
  )
}

export default NormalChatLayout;

