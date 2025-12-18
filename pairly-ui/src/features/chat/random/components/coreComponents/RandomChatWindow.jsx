import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@/MUI/MuiComponents';
import { ForumRoundedIcon, DownloadIcon, LocationOnIcon } from '@/MUI/MuiIcons';

// Custom Components
import RandomChatHeader from './RandomChatHeader';
import RandomMessageInput from './RandomMessageInput';
import NextButton from '../supportComponents/NextButton';
import DisconnectButton from '../supportComponents/DisconnectButton';
import CountdownTimer from '../supportComponents/CountdownTimer';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';

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
  const isTabletOrBelow = useMediaQuery('(max-width:775px)');
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  const { plan, status } = useSelector((state) => state?.auth?.user?.subscription);
  const isFreeUser = status === 'active' && plan === 'free';

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
    const emojiElements = Array.from({ length: isTabletOrBelow ? 200 : 400 }, () => {
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

  // Redux state
  const userId = useSelector((state) => state.profile.profileData?._id);

  const {
    messages,
    connected: isConnected,
    waiting: isWaiting
  } = useSelector((state) => state.randomChat);
  const [isTyping, setIsTyping] = useState(false);

  const { chatSettings } = useSelector((state) => state.settings);
  const chatFontSize = chatSettings?.chatFontSize;

  // Font size mapping (slightly larger)
  const fontSizeMap = {
    small: '0.875rem',   // was 0.75rem
    medium: '1rem',      // was 0.875rem
    large: '1.125rem'    // was 1rem
  };

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
    // No-op: rely on parent layout and CSS variables for height.
    // Left intentionally empty to avoid forcing pixel heights on chat container.
    return () => {};
  }, []);

  // Ensure we jump to the last message when opening/connecting
  useEffect(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    } catch (e) {}
  }, [isConnected]);

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

  // Ads
  useEffect(() => {
    if (isFreeUser && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense push error", e);
      }
    }
  }, [isFreeUser]);

  return (
    <Stack sx={{
      position: "relative",
      overflow: "hidden",
      width: "100%",
      height: '100%',
      borderLeft: `1px solid ${theme.palette.divider}`
    }}>
      {isConnected && bgChatImg}

      {/* === Connected State: Chat Window === */}
      {isConnected ? (
        <>
          {/* Header */}
          <RandomChatHeader />

          {/* Messages Area */}
          <Box
            id="chat-messages"
            flex={1}
            p={2}
            sx={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              maxHeight: `calc(var(--vh, 1vh) * 100 - 160px)`
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

                    {/* Text Message */}
                    {msg.type === 'text' && (() => {
                      const isShort = msg.message?.length < (isSm ? 10 : 35);
                      return (
                        <Stack
                          sx={{
                            display: 'flex',
                            flexDirection: isShort ? 'row' : 'column',
                            alignItems: isShort ? 'center' : 'flex-end',
                            gap: isShort ? 1 : 0,
                            fontSize: fontSizeMap[chatFontSize] || '0.875rem',
                            textAlign: 'start'
                          }}
                        >
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
                                textDecoration: 'underline',
                                fontSize: '0.775rem'
                              }}
                            >
                              {msg.message}
                            </Typography>
                          ) : (
                            <Typography variant="body1" sx={{ wordBreak: 'break-word', fontSize: fontSizeMap[chatFontSize] || '0.875rem' }}>
                              {msg.message}
                            </Typography>
                          )}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              textAlign: 'right',
                              mt: 0.5,
                              fontSize: '0.775rem'
                            }}
                          >
                            {msg.timestamp}
                          </Typography>
                        </Stack>
                      )
                    })()}

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
                            py: 0.25,
                            fontSize: fontSizeMap[chatFontSize] || '0.875rem'
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
                            py: 0.25,
                            fontSize: fontSizeMap[chatFontSize] || '0.875rem'
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

                    {/* Location Message */}
                    {msg.type === 'location' && (
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: isSm ? '80vw' : '480px',
                          maxHeight: isSm ? '40vh' : '60vh',
                          borderRadius: 2
                        }}
                        component="a"
                        href={msg.message}
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
                              display: 'block',
                              textAlign: 'right',
                              mt: 0.5,
                              fontSize: '0.775rem'
                            }}
                          >
                            {msg.timestamp}
                          </Typography>
                        </Stack>
                      </Box>
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
                            py: 0.25,
                            fontSize: fontSizeMap[chatFontSize] || '0.875rem'
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
                            py: 0.25,
                            fontSize: fontSizeMap[chatFontSize] || '0.875rem'
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
              NextButton={isSm && <NextButton
                onClick={() => {
                  handleMenuClose();
                  handleNext();
                }}
              />}
              DisconnectButton={isSm && <DisconnectButton
                onClick={() => {
                  handleMenuClose();
                  handleDisconnect();
                }}
              />}
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
                position: "relative",
                overflow: "hidden",
                borderRadius: 1,
                width: '100%',
                maxWidth: 300,
                p: 2,
                border: `1px solid ${theme.palette.success.light}`
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
                <Tooltip title="Your chat will appear here once you're matched">
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

                {/* === Free User Ad === */}
                {isFreeUser && (
                  <Box sx={{ width: '100%', mt: 2, textAlign: 'center' }}>
                    <ins className="adsbygoogle"
                      style={{ display: 'block' }}
                      data-ad-client="ca-pub-8711176865382424"
                      data-ad-slot="3527563531"
                      data-ad-format="auto"
                      data-full-width-responsive="true"></ins>
                  </Box>
                )}
              </Box>

              {!isConnected && isSm && (
                <Button
                  onClick={() => handleDisconnectOnSmallScreen()}
                  variant={'contained'}
                  fontWeight={900}
                  p={'1rem 2rem'}
                  color={theme.palette.text.secondary}
                  letterSpacing={1.4}
                  startIcon={<NavigateWithArrow />}
                  sx={{
                    mt: 2,
                    borderRadius: 1,
                    cursor: 'pointer',
                    background: theme.palette.primary.main,
                    boxShadow: '0 8px 1rem',
                    fontStyle: 'oblique',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px) scale(1.1)',
                      boxShadow: 'inset 0 8px 1rem',
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
