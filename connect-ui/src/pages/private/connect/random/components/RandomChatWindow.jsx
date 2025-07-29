import React, { useState } from 'react';
import {
  Box,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from '@/MUI/MuiComponents';
import {
  ArrowDropDownIcon, ForumRoundedIcon
} from '@/MUI/MuiIcons';
import { useDispatch, useSelector } from "react-redux";

// Custom Components
import RandomChatHeader from './RandomChatHeader';
import RandomMessageInput from './RandomMessageInput';
import NextButton from './NextButton';
import DisconnectButton from './DisconnectButton';
import { socket } from '@/services/socket';
import { resetRandomChat } from '@/redux/slices/chat/randomChatSlice';
import CountdownTimer from './CountdownTimer';

function RandomChatWindow() {
  const theme = useTheme();
  const isSm = useMediaQuery('(max-width:663px)');
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.profile.profileData?._id);
  const { messages, connected: isConnected, waiting: isWaiting, } = useSelector((state) => state.randomChat);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // === Socket Event Handlers ===
  const handleNext = () => {
    socket.emit("random:next");
  };

  const handleDisconnect = () => {
    socket.emit("random:disconnect");
    dispatch(resetRandomChat());
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      height="100%"
      justifyContent="space-between"
      sx={{
        borderLeft: `2px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        position: 'relative',
      }}
    >
      {/* === Mobile Only: Floating menu for Next/Disconnect === */}
      {isSm && isConnected && (
        <>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ position: 'absolute', top: 58, right: 0, zIndex: 10 }}
          >
            <ArrowDropDownIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                background: theme.palette.background.paper,
                boxShadow: theme.shadows[6],
                border: `1px solid ${theme.palette.success.main}`,
                borderRadius: 1,
                minWidth: 180,
                mb: 1,
                px: 1,
                py: 0.75,
              },
            }}
          >
            <MenuItem>
              <NextButton onClick={() => { handleMenuClose(); handleNext(); }} />
            </MenuItem>
            <MenuItem>
              <DisconnectButton onClick={() => { handleMenuClose(); handleDisconnect(); }} />
            </MenuItem>
          </Menu>
        </>
      )}

      {/* === Connected State: Chat Window === */}
      {isConnected ? (
        <>
          {/* Header */}
          <RandomChatHeader />

          {/* Messages Area */}
          <Box
            flex={1}
            p={2}
            sx={{
              overflowY: 'auto',
              maxHeight: `calc(100vh - 160px)`,
            }}
          >
            <Stack spacing={1}>
              {messages.map((msg, index) => {
                const isOwnMessage = String(msg.senderId) === String(userId);
                return (
                  <Box
                    key={index}
                    alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
                    sx={{
                      backgroundColor: isOwnMessage
                        ? theme.palette.background.default
                        : theme.palette.background.paper,
                      color: isOwnMessage
                        ? 'text.primary'
                        : theme.palette.text.secondary,
                      borderRadius: 1,
                      px: 2,
                      py: 1,
                      maxWidth: '70%',
                      border: `1px solid ${isOwnMessage
                        ? theme.palette.success.main
                        : theme.palette.info.main
                        }`,
                    }}
                  >
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                      {msg.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
                    >
                      {msg.timestamp}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* Input */}
          <RandomMessageInput />
        </>
      ) : (
        // === Not Connected Placeholder ===
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100%',
            px: 2,
            textAlign: 'center',
          }}
        >
          {(isSm && isWaiting) ? (
            <Stack sx={{ minWidth: '100%', maxHeight: '100%', width: '100%' }}>
              <CountdownTimer startFrom={10} autoRestart={true} />
            </Stack>
          ) : (
            <>
              <Tooltip title="Your chat will appear here once you're matched">
                <ForumRoundedIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              </Tooltip>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                You're not connected yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Click <strong>“Connect”</strong> to meet someone new and start a random chat!
              </Typography>
            </>
          )}
        </Box>
      )}
    </Stack>
  );
}

export default RandomChatWindow;
