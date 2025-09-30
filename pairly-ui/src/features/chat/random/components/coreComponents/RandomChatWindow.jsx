import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem
} from '@/MUI/MuiComponents';
import { ArrowDropDownIcon, ForumRoundedIcon, DownloadIcon } from '@/MUI/MuiIcons';

// Custom Components
import RandomChatHeader from './RandomChatHeader';
import RandomMessageInput from './RandomMessageInput';
import NextButton from '../supportComponents/NextButton';
import DisconnectButton from '../supportComponents/DisconnectButton';
import CountdownTimer from '../supportComponents/CountdownTimer';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import chatWindowBackgroundDarkImage from '@/assets/images/chatWindowBackgroundDarkImage.png';
import chatWindowBackgroundLightImage from '@/assets/images/chatWindowBackgroundLightImage.png';

// Socket and Redux actions
import { socket } from '@/services/socket';
import { resetRandomChat } from '@/redux/slices/randomChat/randomChatSlice';
import { useDispatch, useSelector } from 'react-redux';

// Styled components
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import randomChatWindowImage from '@/assets/images/chatWindowImage1.png'
import randomChatWindowImage2 from '@/assets/images/chatWindowImage.png'

/**
 * RandomChatWindow component
 * - Displays chat messages, input, and controls for random chat
 * - Handles media download, play/pause for video/audio, and responsive UI
 */

function RandomChatWindow({ setShowChatWindow }) {
  const theme = useTheme();
  const isSm = useMediaQuery('(max-width:936px)');
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  let bgChatImg =
    localStorage.getItem('theme') === 'dark'
      ? chatWindowBackgroundDarkImage
      : chatWindowBackgroundLightImage;

  // Redux state
  const userId = useSelector((state) => state.profile.profileData?._id);

  const {
    messages,
    connected: isConnected,
    waiting: isWaiting
  } = useSelector((state) => state.randomChat);
  const [isTyping, setIsTyping] = useState(false);

  // Local state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const messagesEndRef = useRef(null);

  // === Socket Event Handlers ===
  const handleNext = () => {
    socket.emit('random:next');
  };

  const handleDisconnectOnSmallScreen = () => {
    socket.emit('random:disconnect');
    dispatch(resetRandomChat());
    setShowChatWindow(false);
  };

  const handleDisconnect = () => {
    socket.emit('random:disconnect');
    dispatch(resetRandomChat());
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Styled audio element for custom appearance
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

  /**
   * Handles downloading media files from chat messages.
   * - Supports base64 data URLs, blob URLs, and remote URLs (e.g. Cloudinary).
   * - For data: and blob: URLs, triggers a download directly.
   * - For remote URLs, fetches the file, creates a blob, and triggers download.
   * - Cleans up created DOM elements and object URLs after download.
   * - Silently fails if any error occurs.
   * @param {string} url - Media URL
   * @param {string} fileName - Desired filename
   */

  const handleDownload = async (url, fileName = 'file') => {
    try {
      // Check if it's a base64 data URL
      if (url.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Check if it's a blob: URL (won't work with fetch, need fallback)
      if (url.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Normal fetch (for hosted files from Cloudinary, etc.)
      const res = await fetch(url);
      if (!res.ok) throw new Error('Fetch failed');

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      return;
    }
  };

  /**
   * Checks if a string is a valid URL
   * @param {string} text
   * @returns {boolean}
   */
  const isValidURL = (text) => {
    try {
      const url = new URL(text);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const chatWindow = document.getElementById("chat-window");
      if (chatWindow && window.visualViewport) {
        chatWindow.style.height = `${window.visualViewport.height}px`;
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      handleResize();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    // Scroll input into view when focused
    const input = document.querySelector("textarea, input");
    if (!input) return;

    const handleFocus = () => {
      setTimeout(() => {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    };

    input.addEventListener("focus", handleFocus);

    // Scroll messages to bottom only if NOT typing
    if (!isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    return () => {
      input.removeEventListener("focus", handleFocus);
    };
  }, [messages, isTyping]);

  return (
    <Stack
      height="100dvh"
      justifyContent="space-between"
      sx={{
        borderLeft: `2px solid ${theme.palette.divider}`,
        position: 'relative',
        backgroundImage: isConnected && `url(${bgChatImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
      id={"chat-window"}
    >
      {/* === Mobile Only: Floating menu for Next/Disconnect === */}
      {isSm && isConnected && (
        <>
          <Tooltip title={'Chat actions'}>
            <ArrowDropDownIcon
              onClick={handleMenuOpen}
              sx={{
                fontSize: '2.8rem',
                color: 'success.main',
                boxShadow: `inset 0 0 1rem ${theme.palette.info.dark}`,
                borderRadius: 2,
                position: 'absolute', top: 45, right: 15, zIndex: 10
              }}
            />
          </Tooltip>
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
                borderRadius: 1,
                minWidth: 180,
                mb: 1,
                px: 1,
                py: 0.75,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            }}
          >
            <Stack mb={1}>
              <NextButton
                onClick={() => {
                  handleMenuClose();
                  handleNext();
                }}
              />
            </Stack>
            <Stack>
              <DisconnectButton
                onClick={() => {
                  handleMenuClose();
                  handleDisconnect();
                }}
              />
            </Stack>
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
              maxHeight: `calc(100vh - 160px)`
            }}
          >
            <Stack spacing={1.5}>
              {/* Render each message */}
              {messages.map((msg, index) => {
                const isOwnMessage = String(msg.senderId) === String(userId);
                return (
                  <Box
                    key={index}
                    alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
                    sx={{
                      background: isOwnMessage
                        ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.main} 100%)`
                        : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                      color: isOwnMessage
                        ? theme.palette.text.primary
                        : theme.palette.text.primary,
                      px: 1.5,
                      py: 1,
                      maxWidth: '70%',
                      borderRadius: isOwnMessage
                        ? '1.2rem 0 1.2rem 1.2rem'
                        : '0 1.2rem 1.2rem 1.2rem',
                      position: 'relative',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      boxShadow: `0 2px 6px ${theme.palette.action.disabledBackground}`,
                      transition: 'background 0.3s ease, transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.01)',
                        background: isOwnMessage
                          ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
                          : `linear-gradient(135deg, ${theme.palette.action.hover} 0%, ${theme.palette.background.default} 100%)`,
                      },
                    }}
                  >

                    {/* Text Message */}
                    {msg.type === 'text' && (
                      <>
                        {isValidURL(msg.message) ? (
                          <Typography
                            variant="body1"
                            component="a"
                            href={msg.message}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              wordBreak: 'break-word',
                              color: 'success.main',
                              textDecoration: 'underline'
                            }}
                          >
                            {msg.message}
                          </Typography>
                        ) : (
                          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {msg.message}
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            textAlign: 'right',
                            mt: 0.5
                          }}
                        >
                          {msg.timestamp}
                        </Typography>
                      </>
                    )}

                    {/* Image Message */}
                    {msg.type === 'image' && (
                      <Stack sx={{ position: 'relative', maxWidth: '100%' }}>
                        <Box
                          component="img"
                          src={msg.message}
                          alt="sent"
                          sx={{
                            width: '100%',
                            maxWidth: isSm ? '80vw' : '480px',
                            maxHeight: isSm ? '40vh' : '60vh',
                            borderRadius: 1,
                            objectFit: 'cover'
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            textAlign: 'right',
                            position: 'absolute',
                            bottom: 4,
                            right: 8,
                            backgroundColor: 'transparent',
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                            borderRadius: 0.5,
                            px: 1,
                            py: 0.25
                          }}
                        >
                          {msg.timestamp}
                        </Typography>
                        <IconButton
                          onClick={() => handleDownload(msg.message, msg.fileName || 'image')}
                          aria-label={`Download ${msg.fileName || 'image'}`}
                          sx={{ position: 'absolute', top: 4, right: 2 }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Stack>
                    )}

                    {/* Video Message */}
                    {msg.type === 'video' && (
                      <Stack sx={{ position: 'relative', maxWidth: '100%' }}>
                        <Box
                          component="video"
                          src={msg.message}
                          controls
                          sx={{
                            width: '100%',
                            maxWidth: isSm ? '80vw' : '480px',
                            maxHeight: isSm ? '40vh' : '60vh',
                            borderRadius: 1
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            backgroundColor: 'transparent',
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                            borderRadius: 0.5,
                            px: 1,
                            py: 0.25
                          }}
                        >
                          {msg.timestamp}
                        </Typography>
                        <IconButton
                          onClick={() => handleDownload(msg.message, msg.fileName || 'video.mp4')}
                          aria-label={`Download ${msg.fileName || 'video'}`}
                          sx={{ position: 'absolute', top: 4, right: 2 }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Stack>
                    )}

                    {/* Audio Message */}
                    {msg.type === 'audio' && (
                      <Stack
                        sx={{
                          position: 'relative',
                          borderRadius: 1
                        }}
                      >
                        <StyledAudio
                          src={msg.message}
                          controls
                          controlsList="noremoteplayback"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          mt={1}
                          alignSelf="flex-end"
                          sx={{
                            backgroundColor: 'transparent',
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                            borderRadius: 0.5,
                            px: 1,
                            py: 0.25
                          }}
                        >
                          {msg.timestamp}
                        </Typography>
                      </Stack>
                    )}

                    {/* File Message */}
                    {msg.type === 'file' && (
                      <Stack sx={{ maxWidth: isSm ? '90vw' : '480px', flexWrap: 'wrap', gap: 0.5 }}>
                        <Stack flexDirection="row" alignItems="center" gap={0.3}>
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                            {msg.fileName || 'file'}
                          </Typography>
                          <IconButton
                            onClick={() => handleDownload(msg.message, msg.fileName || 'file')}
                            aria-label={`Download ${msg.fileName || 'file'}`}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            textAlign: 'right',
                            backgroundColor: 'transparent',
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                            borderRadius: 0.5,
                            px: 1,
                            py: 0.25
                          }}
                        >
                          {msg.timestamp}
                        </Typography>
                      </Stack>
                    )}

                  </Box>
                );
              })}

              {/* Scroll down anchor */}
              <Stack ref={messagesEndRef} />
            </Stack>
          </Box>

          {/* Input area for sending messages */}
          <Stack
            sx={{
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
            }}
          >
            <RandomMessageInput
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
            />
          </Stack>

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
            textAlign: 'center'
          }}
        >
          {isSm && isWaiting ? (
            <Stack
              sx={{
                minWidth: '100%',
                maxHeight: '100%',
                width: '100%',
                gap: 2
              }}
            >
              <CountdownTimer startFrom={10} autoRestart={true} />
              <Stack sx={{ mx: 'auto' }}>
                <DisconnectButton onClick={handleDisconnectOnSmallScreen} />
              </Stack>
            </Stack>
          ) : (
            <Stack
              sx={{
                backgroundImage: isLg ? `url(${randomChatWindowImage2})` : `url(${randomChatWindowImage})`,
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
              <Box sx={{ mb: 20 }}>
                <Tooltip
                  title="Your chat will appear here once you're matched">
                  <ForumRoundedIcon
                    sx={{
                      fontSize: 80,
                      color: 'info.main',
                    }}
                  />
                </Tooltip>
                <Stack sx={{
                  background: theme.palette.background.paper,
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                  userSelect: 'none'
                }}>
                  <Typography
                    variant="h5"
                    color="text.primary"
                    gutterBottom
                  >
                    You're not connected yet
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                  >
                    Click <strong>“Start random Chat”</strong> to meet someone new and start a random chat!
                  </Typography>
                </Stack>

              </Box>

              {!isConnected && isSm && (
                <Button
                  onClick={() => handleDisconnectOnSmallScreen()}
                  variant={'outlined'}
                  fontWeight={600}
                  p={'1rem 2rem'}
                  color={theme.palette.text.secondary}
                  letterSpacing={1.2}
                  startIcon={<NavigateWithArrow />}
                  sx={{
                    mt: 2,
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  Back To Home
                </Button>
              )}
            </Stack>
          )}
        </Box>
      )}
    </Stack>
  );
}

export default RandomChatWindow;
