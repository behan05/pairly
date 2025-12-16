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
 * Main layout for the chat page
 * - Handles responsive layout for sidebar & chat window
 * - Displays chat background images
 * - Integrates PrivateChatWindow & socket/controller logic
 */

function NormalChatLayout() {
  const theme = useTheme();
  const isTabletOrBelow = useMediaQuery('(max-width:775px)');
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);

  // Set page title when component mounts
  React.useEffect(() => {
    document.title = 'Pairly - private worlds';
  }, [dispatch]);

  // Set a CSS variable `--vh` to represent 1% of the viewport height.
  // This avoids mobile keyboard/100vh issues where 100vh doesn't reflect
  // the visual viewport when the keyboard appears.
  React.useEffect(() => {
    const setVh = () => {
      const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
    };

    setVh();
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setVh);
      window.visualViewport.addEventListener('scroll', setVh);
    } else {
      window.addEventListener('resize', setVh);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setVh);
        window.visualViewport.removeEventListener('scroll', setVh);
      } else {
        window.removeEventListener('resize', setVh);
      }
    };
  }, []);

  const handleBackToSidebar = () => {
    // go back to sidebar on small screen
    setSelectedUserId(null);
  };

  const chatBgStyle = (currentTheme) => {
    const emojis = [
      "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
      "😋", "😛", "😝", "😜", "🤪", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖",
      "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "😳", "🫣", "🫢", "🤯", "😱", "😨", "😰", "😥", "😓", "🤗",
      "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😮‍💨", "😴", "🤤", "😪", "😵", "😵‍💫", "🤢", "🤮", "🤧", "😷", "🤒", "🤕",
      "🤑", "🤠", "😈", "👿", "👻", "💀", "☠️", "👽", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾",
      "🦊", "🐶", "🐱", "🐹", "🐰",
      "❤️", "💛", "💚", "💙", "💜", "💯", "✨", "⭐", "⚡", "🔥",
    ];

    // generate 120 random emojis
    const emojiElements = Array.from({ length: isTabletOrBelow ? 200 :  400 }, () => {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      return (
        <Stack
          component='span'
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,

            // random sizes: small OR medium OR large
            fontSize: `${Math.floor(Math.random() * 20) + 12}px`,

            // very light opacity to look like background
            opacity: Math.random() * 0.1 + 0.02,

            transform: `rotate(${Math.random() * 30 - 15}deg)`,
            pointerEvents: "none",
          }}
        >
          {emoji}
        </Stack>
      );
    });

    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: currentTheme === "dark"
            ? `${theme.palette.background.paper}` : `${theme.palette.background.default}`,
        }}
      >
        {emojiElements}
      </Box>
    );
  };

  // Select background image based on theme
  let bgChatImg =
    localStorage.getItem('theme') === 'dark'
      ? chatBgStyle('dark')
      : chatBgStyle('light');

  return (
    <Box
      sx={{
        minHeight: 'calc(var(--vh, 1vh) * 100)',
        maxHeight: 'calc(var(--vh, 1vh) * 100)',
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
