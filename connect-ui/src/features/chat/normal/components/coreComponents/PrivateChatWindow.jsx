import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton
} from '../../../../../MUI/MuiComponents';
import { DownloadIcon } from '../../../../../MUI/MuiIcons';
import PrivateChatHeader from './PrivateChatHeader';
import PrivateMessageInput from './PrivateMessageInput';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';

// Styled audio element
const StyledAudio = styled('audio')(({ theme }) => ({
  maxWidth: '100%',
  borderRadius: 8,
  '::-webkit-media-controls-panel': {
    backgroundColor: `${theme.palette.text.secondary}`,
    borderRadius: '8px'
  },
  '::-webkit-media-controls-play-button': {
    backgroundColor: `${theme.palette.success.main}`,
    borderRadius: '50%'
  }
}));

function PrivateChatWindow({ selectedUserId, onBack, onCloseChatWindow, clearActiveChat }) {
  const theme = useTheme();
  const isSm = useMediaQuery('(max-width:936px)');
  const messagesEndRef = useRef(null);

  const currentUserId = useSelector((state) => state.profile.profileData?.user);
  const { chatUsers, conversations } = useSelector((state) => state.privateChat);

  // Find the conversation for the selected partner
  const user = chatUsers.find(u => u.partnerId === selectedUserId);
  const conversationId = user?.conversationId;

  // Map content/messageType to text/type for rendering
  const messages = conversationId && conversations[conversationId]?.messages
    ? conversations[conversationId].messages.map(msg => ({
        ...msg,
        text: msg.content,
        type: msg.messageType
      }))
    : [];

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Download handler
  const handleDownload = (url, fileName = 'file') => {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  const isValidURL = (text) => {
    try {
      const url = new URL(text);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  return (
    <Stack
      height="100vh"
      width="100%"
      justifyContent="space-between"
      sx={{
        backgroundColor: theme.palette.background.default,
        position: 'relative'
      }}
    >
      {/* Header */}
      <PrivateChatHeader
        userId={selectedUserId}
        onBack={onBack}
        onCloseChatWindow={onCloseChatWindow}
        clearActiveChat={clearActiveChat}
      />

      {/* Messages */}
      <Box flex={1} p={2} sx={{ overflowY: 'auto', maxHeight: `calc(100vh - 160px)` }}>
        <Stack spacing={1.5}>
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
              No messages yet. Start the conversation!
            </Box>
          )}

          {messages.map((msg, index) => {
            const isOwnMessage = msg.sender === currentUserId;

            return (
              <Box
                key={index}
                alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  color: isOwnMessage ? 'text.primary' : 'text.secondary',
                  px: 2,
                  py: 1,
                  maxWidth: '70%',
                  borderRadius: isOwnMessage
                    ? '1.2rem 0 1.2rem 1.2rem'
                    : '0 1.2rem 1.2rem 1.2rem',
                  position: 'relative',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  },
                }}
              >
                {/* Text message */}
                {msg.type === 'text' && (
                  <>
                    {isValidURL(msg.text) ? (
                      <Typography
                        variant="body1"
                        component="a"
                        href={msg.text}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'success.main', wordBreak: 'break-word', textDecoration: 'underline' }}
                      >
                        {msg.text}
                      </Typography>
                    ) : (
                      <Typography variant="body1">{msg.text}</Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </>
                )}

                {/* Image */}
                {msg.type === 'image' && (
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={msg.text}
                      alt="sent"
                      sx={{ maxWidth: isSm ? 280 : 480, maxHeight: 320, borderRadius: 1, objectFit: 'cover', width: '100%', height: 'auto' }}
                    />
                    <IconButton onClick={() => handleDownload(msg.text, msg.fileName || 'image')} sx={{ position: 'absolute', top: 4, right: 2 }}>
                      <DownloadIcon />
                    </IconButton>
                    <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', bottom: 4, right: 8 }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                )}

                {/* Video */}
                {msg.type === 'video' && (
                  <Box sx={{ position: 'relative' }}>
                    <Box component="video" src={msg.text} controls sx={{ maxWidth: 320, maxHeight: 240, borderRadius: 1 }} />
                    <IconButton onClick={() => handleDownload(msg.text, msg.fileName || 'video.mp4')} sx={{ position: 'absolute', top: 4, right: 2 }}>
                      <DownloadIcon />
                    </IconButton>
                    <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                )}

                {/* Audio */}
                {msg.type === 'audio' && (
                  <Stack sx={{ position: 'relative' }}>
                    <StyledAudio src={msg.text} controls />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, alignSelf: 'flex-end' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Stack>
                )}

                {/* File */}
                {msg.type === 'file' && (
                  <Stack flexDirection="row" alignItems="center" gap={0.5}>
                    <Typography variant="body2">{msg.fileName || 'file'}</Typography>
                    <IconButton onClick={() => handleDownload(msg.text, msg.fileName || 'file')}>
                      <DownloadIcon />
                    </IconButton>
                  </Stack>
                )}
              </Box>
            );
          })}

          <Stack ref={messagesEndRef} />
        </Stack>
      </Box>

      {/* Message Input */}
      <PrivateMessageInput conversationId={conversationId} />
    </Stack>
  );
}

export default PrivateChatWindow;
