import { useRef, useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton
} from '@/MUI/MuiComponents';
import { DownloadIcon, DoneIcon, DoneAllIcon } from '@/MUI/MuiIcons';
import PrivateChatHeader from './PrivateChatHeader';
import PrivateMessageInput from './PrivateMessageInput';
import formatMessageTime from '@/utils/formatMessageTime';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { socket } from '@/services/socket';

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
  const [isTyping, setIsTyping] = useState(false);

  const currentUserId = useSelector((state) => state.profile.profileData?.user);
  const { chatUsers, conversations } = useSelector((state) => state.privateChat);

  // Find the conversation for the selected partner
  const user = chatUsers.find(u => u.partnerId === selectedUserId);
  const conversationId = user?.conversationId;

  // Use messages directly from redux, keep `seen`
  const messages = conversationId && conversations[conversationId]?.messages
    ? conversations[conversationId].messages
    : [];

  // Emit read event when opening chat
  useEffect(() => {
    const handleFocus = () => {
      if (!conversationId) return;
      socket.emit('privateChat:readMessage', { conversationId });
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [conversationId, socket]);

  // Download handler
  const handleDownload = (url, fileName = 'file') => {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const isValidURL = (text) => {
    try { new URL(text); return true; } catch { return false; }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <Stack
      height="100dvh"
      width="100%"
      justifyContent="space-between"
      sx={{
        position: 'relative',
      }}
      id='chat-window'
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
                {msg.messageType === 'text' && (
                  <>
                    {isValidURL(msg.content) ? (
                      <Typography
                        variant="body1"
                        component="a"
                        href={msg.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'success.main', wordBreak: 'break-word', textDecoration: 'underline' }}
                      >
                        {msg.content}
                      </Typography>
                    ) : (
                      <Typography variant="body1">{msg.content}</Typography>
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}
                    >
                      {formatMessageTime(msg.createdAt)}
                      {isOwnMessage && (msg.seen ? <DoneAllIcon sx={{ fontSize: 16, color: "success.main" }} /> : <DoneIcon sx={{ fontSize: 16, color: "grey" }} />)}
                    </Typography>
                  </>
                )}

                {/* Image */}
                {msg.messageType === 'image' && (
                  <Box sx={{ position: 'relative', maxWidth: '100%' }}>
                    <Box
                      component="img"
                      src={msg.content}
                      alt="sent"
                      sx={{
                        width: '100%',
                        maxWidth: isSm ? '80vw' : '480px', // responsive max width
                        maxHeight: isSm ? '40vh' : '60vh', // responsive max height
                        borderRadius: 1,
                        objectFit: 'cover'
                      }}
                    />
                    <IconButton
                      onClick={() => handleDownload(msg.content, msg.fileName || 'image')}
                      sx={{ position: 'absolute', top: 4, right: 2 }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        right: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      {formatMessageTime(msg.createdAt)}
                      {isOwnMessage &&
                        (msg.seen ? (
                          <DoneAllIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        ) : (
                          <DoneIcon sx={{ fontSize: 16, color: 'grey' }} />
                        ))}
                    </Typography>
                  </Box>
                )}

                {/* Video */}
                {msg.messageType === 'video' && (
                  <Stack sx={{ position: 'relative', maxWidth: '100%' }}>
                    <Box
                      component="video"
                      src={msg.content}
                      controls
                      sx={{
                        width: '100%',
                        maxWidth: isSm ? '80vw' : '480px',
                        maxHeight: isSm ? '40vh' : '60vh',
                        borderRadius: 1
                      }}
                    />
                    <IconButton
                      onClick={() => handleDownload(msg.content, msg.fileName || 'video.mp4')}
                      aria-label={`Download ${msg.fileName || 'video'}`}
                      sx={{ position: 'absolute', top: 4, right: 2 }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      {formatMessageTime(msg.createdAt)}
                      {isOwnMessage &&
                        (msg.seen ? (
                          <DoneAllIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        ) : (
                          <DoneIcon sx={{ fontSize: 16, color: 'grey' }} />
                        ))}
                    </Typography>
                  </Stack>
                )}

                {/* Audio */}
                {msg.messageType === 'audio' && (
                  <Stack sx={{ position: 'relative' }}>
                    <StyledAudio
                      src={msg.content}
                      controls />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        alignSelf: 'flex-end',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      {formatMessageTime(msg.createdAt)}
                      {isOwnMessage &&
                        (msg.seen ? <DoneAllIcon
                          sx={{ fontSize: 16, color: "success.main" }} />
                          : <DoneIcon sx={{ fontSize: 16, color: "grey" }} />)}
                    </Typography> </Stack>)}

                {/* File */}
                {msg.messageType === 'file' && (
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    gap={0.5}
                    sx={{ maxWidth: isSm ? '90vw' : '480px', flexWrap: 'wrap' }}
                  >
                    <Typography variant="body2">{msg.fileName || 'file'}</Typography>
                    <IconButton
                      onClick={() => handleDownload(msg.content, msg.fileName || 'file')}
                    >
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
      <Stack
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
        }}
      >
        <PrivateMessageInput
          conversationId={conversationId}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
        />
      </Stack>

    </Stack>
  );
}

export default PrivateChatWindow;
