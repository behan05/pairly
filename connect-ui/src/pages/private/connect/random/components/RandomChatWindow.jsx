import React from 'react';
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import RandomChatHeader from './RandomChatHeader';
import RandomMessageInput from './RandomMessageInput';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';

function RandomChatWindow() {
  const theme = useTheme();
  const userId = useSelector((state) => state.profile.profileData?._id);
  const { messages, connected: isConnected } = useSelector((state) => state.randomChat);

  return (
    <Stack
      height="100%"
      justifyContent="space-between"
      sx={{
        borderLeft: `2px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
      }}
    >
      {isConnected ? (
        <React.Fragment>

          {/* Chat Header */}
          <RandomChatHeader />

          {/* Messages Display Area */}
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
                const isOwnMessage = msg.senderId === userId;

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
                      border: isOwnMessage
                        ? `1px solid ${theme.palette.success.main}`
                        : `1px solid ${theme.palette.info.main}`,
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

          {/* Message Input */}
          <RandomMessageInput />
        </React.Fragment>
      ) : (
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
          <Tooltip title="Your chat will appear here once you're matched">
            <ForumRoundedIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          </Tooltip>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            You're not connected yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Click <strong>“Connect”</strong> to meet someone new and start a random chat!
          </Typography>
        </Box>
      )}

    </Stack>
  );
}

export default RandomChatWindow;
