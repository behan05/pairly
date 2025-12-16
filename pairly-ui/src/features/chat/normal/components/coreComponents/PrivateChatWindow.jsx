import { useRef, useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton
} from '@/MUI/MuiComponents';
import { DownloadIcon, DoneIcon, DoneAllIcon, LocationOnIcon } from '@/MUI/MuiIcons';
import Loading from '@/components/common/Loading';
import PrivateChatHeader from './PrivateChatHeader';
import PrivateMessageInput from './PrivateMessageInput';
import formatBubbleTime from '@/utils/formatBubbleTime';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import { socket } from '@/services/socket';
import { fetchConversationMessages } from '@/redux/slices/privateChat/privateChatAction'
import { setActivePartnerId } from '@/redux/slices/privateChat/privateChatSlice';

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
  const dispatch = useDispatch();

  // Fix: Dynamic viewport height to handle keyboard on mobile
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(vh);
    };
    window.visualViewport?.addEventListener('resize', updateHeight);
    updateHeight();
    return () => {
      window.visualViewport?.removeEventListener('resize', updateHeight);
    };
  }, []);

  const currentUserId = useSelector((state) => state.profile.profileData?.user);
  const { chatUsers, conversations, loading } = useSelector((state) => state.privateChat);
  const { chatSettings } = useSelector((state) => state.settings);
  const chatFontSize = chatSettings?.chatFontSize;

  const fontSizeMap = {
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem'
  };

  const user = chatUsers.find(u => u.partnerId === selectedUserId);
  const conversationId = user?.conversationId;

  const messages = conversationId && conversations[conversationId]?.messages
    ? conversations[conversationId].messages
    : [];

  useEffect(() => {
    if (!conversationId || !messages.length) return;

    const lastMessage = messages[messages.length - 1];
    const isFromPartner = lastMessage?.sender?.toString() === selectedUserId?.toString();

    if (isFromPartner) {
      socket.emit('privateChat:readMessage', { conversationId });
    }
  }, [conversationId, messages, selectedUserId]);

  useEffect(() => {
    return () => {
      dispatch(setActivePartnerId(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectedUserId && !messages.length && conversationId) {
      dispatch(fetchConversationMessages(conversationId));
    }
  }, [conversationId, selectedUserId, messages.length, dispatch]);

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
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer || !messagesEndRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold

    if (isNearBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <Stack
      height={viewportHeight}
      width="100%"
      justifyContent="space-between"
      sx={{
        position: 'relative',
        overflow: 'hidden'
      }}
      id='chat-window'
    >
      {/* Header */}
      <PrivateChatHeader
        userId={selectedUserId}
        onBack={onBack}
        onCloseChatWindow={onCloseChatWindow}
        clearActiveChat={clearActiveChat}
        sx={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: theme.palette.background.paper }} // ✅ sticky header
      />

      {loading ? <Loading /> : (
        <>
          {/* Messages */}
          <Box id="chat-messages" flex={1} px={isSm ? 1.5 : 2} pt={0.5} sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
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
                      background: isOwnMessage
                        ? theme.palette.mode === "dark"
                          ? "#075E54"
                          : "#DCF8C6"
                        : theme.palette.background.paper,

                      color: theme.palette.text.primary,
                      px: 1.6,
                      py: 1.2,
                      maxWidth: "72%",
                      borderRadius: isOwnMessage
                        ? "1rem 1rem 0.2rem 1rem"
                        : "1rem 1rem 1rem 0.2rem",

                      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",

                      fontSize: "0.95rem",
                      lineHeight: 1.4,

                      wordBreak: "break-word",
                      position: "relative",
                    }}
                  >

                    {/* Text message */}
                    {msg.messageType === 'text' && (() => {
                      const isShort = msg.content.length < (isSm ? 10 : 35); // tweak threshold

                      return (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: isShort ? 'row' : 'column',
                            alignItems: isShort ? 'center' : 'flex-end',
                            gap: isShort ? 1 : 0,
                            fontSize: fontSizeMap[chatFontSize] || '0.875rem',
                            textAlign: 'start'
                          }}
                        >
                          <Typography
                            sx={{
                              wordBreak: 'break-word',
                            }}
                          >
                            {msg.content}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              fontSize: '0.65rem',
                              pt: 0.8
                            }}
                          >
                            {formatBubbleTime(msg.createdAt)}
                            {isOwnMessage &&
                              (msg.seen ? (
                                <DoneAllIcon sx={{ fontSize: 16, color: 'info.main' }} />
                              ) : (
                                <DoneIcon sx={{ fontSize: 16, color: 'grey' }} />
                              ))}
                          </Typography>
                        </Box>
                      );
                    })()}

                    {/* Image */}
                    {msg.messageType === 'image' && (
                      <Box sx={{ position: 'relative', maxWidth: '100%' }}>
                        <Box
                          component="img"
                          src={msg.content}
                          alt="sent"
                          sx={{
                            width: '100%',
                            maxWidth: isSm ? '80vw' : '480px',
                            maxHeight: isSm ? '40vh' : '60vh',
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
                          color="#ddd"
                          sx={{
                            position: 'absolute',
                            bottom: 5,
                            right: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontSize: fontSizeMap[chatFontSize] || '0.875rem'
                          }}
                        >
                          {formatBubbleTime(msg.createdAt)}
                          {isOwnMessage &&
                            (msg.seen ? (
                              <DoneAllIcon sx={{ fontSize: 16, color: 'info.main' }} />
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
                          color="#ddd"
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontSize: fontSizeMap[chatFontSize] || '0.875rem'
                          }}
                        >
                          {formatBubbleTime(msg.createdAt)}
                          {isOwnMessage &&
                            (msg.seen ? (
                              <DoneAllIcon sx={{ fontSize: 16, color: 'info.main' }} />
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
                            gap: 0.5,
                            fontSize: fontSizeMap[chatFontSize] || '0.875rem'
                          }}
                        >
                          {formatBubbleTime(msg.createdAt)}
                          {isOwnMessage &&
                            (msg.seen ? <DoneAllIcon
                              sx={{ fontSize: 16, color: "info.main" }} />
                              : <DoneIcon sx={{ fontSize: 16, color: "grey" }} />)}
                        </Typography>
                      </Stack>
                    )}

                    {/* Location Message */}
                    {msg.messageType === 'location' && (
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: isSm ? '80vw' : '480px',
                          maxHeight: isSm ? '40vh' : '60vh',
                          borderRadius: 2
                        }}
                        component="a"
                        href={msg.content}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* Fake map preview */}
                        <Box
                          sx={{
                            width: '100%',
                            height: 120,
                            position: 'relative',
                            backgroundColor: theme.palette.grey[200],
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundSize: '20px 20px',
                            backgroundImage: `
                             linear-gradient(to right, ${theme.palette.grey[300]} 1px, transparent 1px),
                             linear-gradient(to left, ${theme.palette.grey[300]} 1px, transparent 1px),
                             linear-gradient(to top, ${theme.palette.grey[300]} 1px, transparent 1px),
                          linear-gradient(to bottom, ${theme.palette.grey[300]} 1px, transparent 1px)
                            `,
                          }}
                        >
                          <Typography
                            sx={{
                              position: 'absolute',
                              color: 'gray',
                              fontSize: '0.75rem'
                            }}
                          >
                            Map preview
                          </Typography>
                          <LocationOnIcon sx={{ fontSize: 40, color: 'error.main' }} />
                        </Box>

                        {/* Label */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          px={1}
                          py={0.5}
                          gap={1}
                          sx={{ backgroundColor: theme.palette.background.paper }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: theme.palette.text.primary,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <LocationOnIcon sx={{ fontSize: 'medium', color: 'error.main' }} />
                            Shared Location
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              fontSize: '0.65rem',
                              pt: 0.4
                            }}
                          >
                            {formatBubbleTime(msg.createdAt)}
                            {isOwnMessage &&
                              (msg.seen ? (
                                <DoneAllIcon sx={{ fontSize: 16, color: 'info.main' }} />
                              ) : (
                                <DoneIcon sx={{ fontSize: 16, color: 'grey' }} />
                              ))}
                          </Typography>
                        </Stack>
                      </Box>
                    )}

                    {/* File */}
                    {msg.messageType === 'file' && (
                      <Stack sx={{ maxWidth: isSm ? '90vw' : '480px', flexWrap: 'wrap', gap: 0.5 }}>
                        <Stack flexDirection="row" alignItems="center" gap={0.3}>
                          <Typography variant="body2" sx={{ wordBreak: 'break-word', fontSize: fontSizeMap[chatFontSize] || '0.875rem' }}>
                            {msg.fileName || 'file'}
                          </Typography>
                          <IconButton
                            onClick={() => handleDownload(msg.content, msg.fileName || 'file')}
                            aria-label={`Download ${msg.fileName || 'file'}`}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            position: 'absolute',
                            bottom: 1,
                            right: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontSize: fontSizeMap[chatFontSize] || '0.875rem'
                          }}
                        >
                          {formatBubbleTime(msg.createdAt)}
                          {isOwnMessage &&
                            (msg.seen ? (
                              <DoneAllIcon sx={{ fontSize: 16, color: 'info.main' }} />
                            ) : (
                              <DoneIcon sx={{ fontSize: 16, color: 'grey' }} />
                            ))}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                );
              })}

              <Stack ref={messagesEndRef} />
            </Stack>
          </Box>
        </>
      )}

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
