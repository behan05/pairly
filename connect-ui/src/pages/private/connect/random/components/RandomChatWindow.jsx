import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import RandomChatHeader from './RandomChatHeader';
import RandomMessageInput from './RandomMessageInput';

function RandomChatWindow() {
  const theme = useTheme();
  const messages = useSelector((state) => state.randomChat.messages);
  const userId = useSelector((state) => state.profile.profileData?._id);
  
  return (
    <Stack
      height="100%"
      justifyContent="space-between"
      sx={{
        borderLeft: `2px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
      }}
    >
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
        <Stack spacing={1.5}>
          {messages.map((msg, index) => {
            const isOwnMessage = msg.senderId !== userId;

            return (
              <Box
                key={index}
                alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
                sx={{
                  backgroundColor: isOwnMessage
                    ? theme.palette.background.paper
                    : theme.palette.grey[300],
                  color: isOwnMessage ? 'text.primary' : theme.palette.text.secondary,
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  maxWidth: '70%',
                  boxShadow: `inset 0 0 2px ${theme.palette.success.main}`
                }}
              >
                <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                  {msg.content}
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
    </Stack>
  );
}

export default RandomChatWindow;
