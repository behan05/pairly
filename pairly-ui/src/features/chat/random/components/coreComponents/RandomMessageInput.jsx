import { useRef, useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
  useTheme,
  Stack,
  useMediaQuery
} from '@/MUI/MuiComponents';
import {
  CloseIcon,
  SendIcon,
  AttachFileIcon,
  InsertEmoticonIcon,
  PhotoCameraBackIcon,
  MusicNoteIcon,
  DescriptionIcon,
  LocationOnIcon,
  MicIcon
} from '@/MUI/MuiIcons';

// Emoji Picker and Toast Notifications
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClickAwayListener from '@mui/material/ClickAwayListener';

// Redux and Socket
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '@/redux/slices/randomChat/randomChatSlice';
import { socket } from '@/services/socket';

// Axios for media upload and API calls
import axios from 'axios';
import { RANDOM_API } from '@/api/config';

// Audio recored
import RecordRTC from 'recordrtc';

// Premium Model 
import PremiumFeatureModel from '@/components/private/premium/PremiumFeatureModal';
import LimitReachedModal from '../../../common/LimitReachedModal';
import AudioErrorModal from '../../../common/AudioErrorModal';

/**
 * RandomMessageInput component
 * - Handles text and media input for random chat
 * - Supports emoji picker, file/media preview, and optimistic UI updates
 * - Uploads media to server and emits messages via socket
 * @returns {JSX.Element} The rendered component.
 */

function RandomMessageInput({ NextButton, DisconnectButton }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [premiumFeatureName, setPremiumFeatureName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { plan, status } = useSelector((state) => state?.auth?.user?.subscription);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [limitType, setLimitType] = useState(null);
  const hasPremiumAccess = plan !== 'free' && status === 'active';
  const isFreeUser = !hasPremiumAccess;

  // Local state for message, media previews, emoji picker, and file menu
  const [message, setMessage] = useState('');
  const [previews, setPreviews] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Redux state for user and partner IDs
  const userId = useSelector((state) => state.profile.profileData?._id);
  const partnerId = useSelector((state) => state.randomChat?.partnerId);
  const open = Boolean(anchorEl);

  const { chatSettings } = useSelector((state) => state.settings);
  const enterToSend = chatSettings?.enterToSend;

  const [isRecording, setIsRecording] = useState(false);
  const [micErrorModalOpen, setMicErrorModalOpen] = useState(false);
  const recorderRef = useRef(null);

  // Reference to hidden file input
  const fileInputRef = useRef(null);
  const inputContainerRef = useRef(null);

  // Handle attach button click (open file menu)
  const handleAttachClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close file menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Typing indicator logic
  const typingTimeout = useRef(null);
  const lastTypingTime = useRef(0);
  const TYPING_DELAY = 1000;

  const handleInputChange = (e) => {
    const { value } = e.target;
    setMessage(value);

    const now = Date.now();
    if (now - lastTypingTime.current > TYPING_DELAY) {
      socket.emit('random:typing');
      lastTypingTime.current = now;
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('random:stop-typing');
    }, TYPING_DELAY + 500);
  };

  // Handle file selection and preview
  const handleFileClick = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (file.size === 0) return toast.error('File is empty, please select a valid file.');

      const reader = new FileReader();
      reader.onload = () => {
        const sanitizedName = file.name
          .replace(/\(\d+\)(?=\.[^/.]+$)/, '')
          .replace(/[^a-zA-Z0-9_.-]/g, '_')
          .replace(/_+(?=\.[^.]+$)/, '');

        const sanitizedFile = new File([file], sanitizedName, {
          type: file.type,
          lastModified: file.lastModified
        });

        const filePreview = {
          file: sanitizedFile,
          name: sanitizedName,
          type: file.type,
          data: reader.result
        };

        setPreviews((prev) => [...prev, filePreview]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Delete selected media preview
  const handleMediaDeleteClick = (indexToDelete) => {
    setPreviews((prev) => {
      const updatePreview = prev.filter((_, i) => i !== indexToDelete);
      return updatePreview;
    });
  };

  // Determine content type for message/media
  const getContentType = (file) => {
    if (!file) return 'text';

    if (typeof file === 'object' && file.type) {
      if (file.type.startsWith('image/')) return 'image';
      if (file.type.startsWith('video/')) return 'video';
      if (file.type.startsWith('audio/')) return 'audio';
      if (
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type.includes('officedocument') ||
        file.type === 'text/plain'
      ) {
        return 'file';
      }
    }

    return 'text';
  };

  // --- Audio Recording ---
  const startRecording = async () => {
    try {
      // Check if any audio input device exists
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(d => d.kind === 'audioinput');

      if (!hasMic) {
        setMicErrorModalOpen(true);
        return;
      }

      // Ask for microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      });

      recorderRef.current.startRecording();
      setIsRecording(true);

    } catch (err) {
      console.error('Recording start failed:', err);
      setMicErrorModalOpen(true);
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(async () => {
      const blob = recorderRef.current.getBlob();
      const file = new File([blob], `audio_${Date.now()}.webm`, { type: blob.type });

      setIsRecording(false);
      recorderRef.current = null; // clear recorder
      await handleAudioSend(file);
    });
  };

  const handleAudioSend = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);
    formData.append('messageType', 'audio');

    // Optimistic UI
    dispatch(
      addMessage({
        sender: String(userId),
        message: URL.createObjectURL(file),
        fileName: file.name,
        type: 'audio',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seen: false,
      })
    );

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      await axios.post(`${RANDOM_API}/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Audio upload failed:', err);
      toast.error('Audio upload failed! Please try again.');
    }
  };

  /**
   * Handles sending text and media messages.
   * - Optimistically updates UI for text/media
   * - Uploads media to server
   * - Emits socket events for text
   */
  const handleSend = async () => {
    const hasText = message.trim() !== '';
    const hasMedia = previews.length > 0;
    if (!hasText && !hasMedia) return;

    // ---- Free user limits ----
    if (isFreeUser) {
      const today = new Date().toDateString();

      // Get counts from localStorage or reset if a new day
      const storedDate = localStorage.getItem('messageLimitDate');
      if (storedDate !== today) {
        localStorage.setItem('messageLimitDate', today);
        localStorage.setItem('textMessageCount', '0');
        localStorage.setItem('mediaCount', '0');
      }

      let textCount = parseInt(localStorage.getItem('textMessageCount') || '0', 10);
      let mediaCount = parseInt(localStorage.getItem('mediaCount') || '0', 10);

      // Check limits
      if (hasText && textCount >= 100) {
        setLimitType('text');
        setLimitModalOpen(true);
        return;
      }

      if (hasMedia && mediaCount >= 5) {
        setLimitType('media');
        setLimitModalOpen(true);
        return;
      }

      // Increment counters after send
      if (hasText) {
        textCount += 1;
        localStorage.setItem('textMessageCount', textCount.toString());
      }
      if (hasMedia) {
        mediaCount += previews.length;
        localStorage.setItem('mediaCount', mediaCount.toString());
      }

    }

    // ---- Sending text messages ----
    // Optimistic UI update for text
    if (hasText) {
      socket.emit('random:message', {
        message,
        senderId: userId,
        type: 'text'
      });

      dispatch(
        addMessage({
          message,
          senderId: userId,
          type: getContentType(message),
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        })
      );
    }

    // Optimistic UI update for media
    if (hasMedia) {
      previews.forEach((file) => {
        dispatch(
          addMessage({
            senderId: userId,
            message: file.data,
            fileName: file.name,
            type: getContentType(file),
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          })
        );
      });

      setPreviews([]);
    }

    // Upload actual media to server
    try {
      if (hasMedia) {
        for (let file of previews) {
          const formData = new FormData();
          formData.append('media', file.file);
          formData.append('partnerSocketId', String(partnerId));

          const token = localStorage.getItem('token');
          if (!token) {
            toast.error('You must be logged in to send media.');
            return;
          }

          await axios.post(`${RANDOM_API}/media`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
        }
      }
    } catch (err) {
      toast.error('Upload failed. Try again.', err.message);
    }

    setMessage('');
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  // Common style for file menu items
  const menuCommonStyle = {
    borderRadius: 0.5,
    transition: 'all 0.3s ease-out',
    color: 'text.secondary',
    px: 1,
    py: 0.5,
    minHeight: 'unset',
    '&:hover': {
      transform: `translate(1px, -1px) scale(0.99)`,
      filter: `drop-shadow(0 0 0.5px ${theme.palette.primary.main})`
    },
  };

  // Adding this useEffect to handle mobile keyboard resizing
  useEffect(() => {
    const restoreStyles = () => {
      const el = inputContainerRef.current;
      if (!el || !originalStyleRef.current) return;
      const s = originalStyleRef.current;
      el.style.position = s.position || '';
      el.style.left = s.left || '';
      el.style.right = s.right || '';
      el.style.bottom = s.bottom || '';
      el.style.width = s.width || '';
      el.style.zIndex = s.zIndex || '';
      el.style.marginBottom = s.marginBottom || '';
      pinnedRef.current = false;
    };

    const applyPinned = (offset) => {
      const el = inputContainerRef.current;
      if (!el) return;
      if (!originalStyleRef.current) {
        originalStyleRef.current = {
          position: el.style.position,
          left: el.style.left,
          right: el.style.right,
          bottom: el.style.bottom,
          width: el.style.width,
          zIndex: el.style.zIndex,
          marginBottom: el.style.marginBottom,
        };
      }

      el.style.position = 'fixed';
      el.style.left = 0;
      el.style.right = 0;
      el.style.bottom = `${offset}px`;
      el.style.width = '100%';
      el.style.zIndex = 1500;
      // keep a small bottom spacing so element isn't flush to keyboard
      el.style.marginBottom = '8px';
      pinnedRef.current = true;
    };

    const handleViewportChange = () => {
      if (!inputContainerRef.current || !window.visualViewport) return;
      const offset = window.innerHeight - window.visualViewport.height;
      if (offset > 0) {
        applyPinned(offset + 6);
      } else if (pinnedRef.current) {
        restoreStyles();
      } else {
        // ensure no extra bottom margin when keyboard closed
        inputContainerRef.current.style.marginBottom = '0px';
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
      handleViewportChange();
    } else {
      // fallback for browsers without visualViewport
      window.addEventListener('resize', handleViewportChange);
      handleViewportChange();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  const handleLocationClick = () => {
    if (isFreeUser) {
      setPremiumFeatureName('Location exchange');
      setModalOpen(true);
      handleCloseMenu();
      return;
    } else {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser.");
        handleCloseMenu();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

          // Emit via socket
          socket.emit("random:message", {
            message: locationUrl,
            senderId: userId,
            type: "location"
          });

          // Optimistic UI update
          dispatch(
            addMessage({
              senderId: userId,
              message: locationUrl,
              type: "location",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            })
          );
        },
        () => {
          toast.error("Unable to retrieve your location.");
        }
      );
      handleCloseMenu();
    }
  };

  // Audio chat handle
  const handleAudioChat = () => {

  };

  return (
    <Box
      ref={inputContainerRef}
      width="100%"
      zIndex={10}
      sx={{
        transition: 'bottom 0.25s ease',
        pb: isSm ? 'env(safe-area-inset-bottom)' : 0
      }}
    >

      {/* Media preview area */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'center',
          px: 1,
          py: 1,
          overflowX: 'auto',
          maxHeight: '35vh',
          zIndex: 999,
          "&::-webkit-scrollbar": {
            display: isSm ? 'none' : 'block'
          },
        }}
      >
        {previews.map((file, index) => {
          const type = file?.type || '';

          // Image preview
          if (type.startsWith('image')) {
            return (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  boxShadow: `inset 0 0 0.2rem ${theme.palette.info.main}`,
                  p: 0.2,
                  borderRadius: 1
                }}
              >
                <Stack
                  component="img"
                  src={file.data}
                  alt={file.name}
                  aria-label={file.name}
                  sx={{
                    maxWidth: 120,
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 1
                  }}
                />

                <IconButton
                  size="small"
                  onClick={() => handleMediaDeleteClick(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.8)'
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          }
          // Video preview
          if (type.startsWith('video')) {
            return (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  maxWidth: 120
                }}
              >
                <Stack
                  component="video"
                  src={file.data}
                  controls
                  maxWidth={'100%'}
                  sx={{
                    borderRadius: 1,
                    objectFit: 'cover'
                  }}
                />

                <IconButton
                  fontSize={'small'}
                  onClick={() => handleMediaDeleteClick(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.8)'
                    }
                  }}
                >
                  <CloseIcon size="small" />
                </IconButton>
              </Box>
            );
          }
          // Audio preview
          if (type.includes('audio')) {
            return (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                <audio controls src={file.data} />
                <IconButton
                  onClick={() => handleMediaDeleteClick(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
                  }}
                >
                  <CloseIcon size="small" />
                </IconButton>
              </Box>
            );
          }
          // Document preview
          if (
            type === 'application/pdf' ||
            type === 'application/msword' ||
            type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ) {
            return (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  backgroundColor: theme.palette.background.paper,
                  p: 2,
                  borderRadius: 1,
                  mb: 2,
                  maxWidth: 200
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {file.name}
                </Typography>

                <IconButton
                  onClick={() => handleMediaDeleteClick(index)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.8)'
                    }
                  }}
                >
                  <CloseIcon size="small" />
                </IconButton>
              </Box>
            );
          }
          // Unsupported file type
          return (
            <Box key={index}>
              <Typography variant="caption" color="text.secondary">
                Unsupported file
                <br />
                {file.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Main input area */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          p: 1.2,
          mx: 1,
          mb: 1,
          borderRadius: 1,
          border: `1px dashed ${theme.palette.text.secondary}40`
        }}
      >
        {/* Attach Button */}
        <Tooltip title="Attach">
          <IconButton onClick={handleAttachClick}>
            <AttachFileIcon sx={{ fontSize: '0.8em' }} />
          </IconButton>
        </Tooltip>

        {/* File Attach Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'end' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'bottom' }}
          PaperProps={{
            sx: {
              background: theme.palette.background.paper,
              boxShadow: theme.shadows[6],
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              minWidth: 200,
              p: '0px 10px',
              py: 0.75,
              overflow: 'hidden'
            }
          }}
        >
          {/* Photo & Video */}
          <MenuItem
            onClick={() => {
              fileInputRef.current.value = null;
              fileInputRef.current.click();
              handleCloseMenu();
            }}
            sx={{ ...menuCommonStyle, display: 'flex', alignItems: 'center' }}
          >
            <PhotoCameraBackIcon sx={{ mr: 1, fontSize: '1.3rem', color: 'primary.main' }} />
            <Typography variant="subtitle2">Photo & Video</Typography>
          </MenuItem>

          {/* Audio */}
          <MenuItem
            onClick={() => {
              fileInputRef.current.value = null;
              fileInputRef.current.click();
              handleCloseMenu();
            }}
            sx={{ ...menuCommonStyle, display: 'flex', alignItems: 'center' }}
          >
            <MusicNoteIcon sx={{ mr: 1, fontSize: '1.3rem', color: 'secondary.main' }} />
            <Typography variant="subtitle2">Audio</Typography>
          </MenuItem>

          {/* Document */}
          <MenuItem
            onClick={() => {
              fileInputRef.current.value = null;
              fileInputRef.current.click();
              handleCloseMenu();
            }}
            sx={{ ...menuCommonStyle, display: 'flex', alignItems: 'center' }}
          >
            <DescriptionIcon sx={{ mr: 1, fontSize: '1.3rem', color: 'success.main' }} />
            <Typography variant="subtitle2">Document</Typography>
          </MenuItem>

          {/* Location */}
          <MenuItem
            onClick={handleLocationClick}
            sx={{ ...menuCommonStyle, display: 'flex', alignItems: 'center' }}
          >
            <LocationOnIcon sx={{ color: 'error.main', fontSize: '1.3rem', mr: 1 }} />
            <Typography variant="subtitle2">
              Send Location
            </Typography>
          </MenuItem>

        </Menu>
        {/* Emoji Button */}
        <Tooltip title="Emoji">
          <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
            <InsertEmoticonIcon sx={{ fontSize: '0.8em' }} />
          </IconButton>
        </Tooltip>

        {/* Hidden Input for file selection */}
        <input
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.ppt,.pptx"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileClick}
        />

        {/* Message Input */}
        <InputBase
          fullWidth
          multiline
          maxRows={2}
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (enterToSend && e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          sx={{ mx: 2 }}
        />

        {message.trim() || previews.length > 0 ? (
          <Tooltip title="Send">
            <IconButton
              onClick={handleSend}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.mode === "dark" ? '#ddd' : '#000',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: theme.palette.success.main,
                  color: theme.palette.mode === "dark" ? '#000' : '#ddd',
                  transform: 'scale(1.1)',
                  boxShadow: `0 4px 12px ${theme.palette.success.main}60`
                },
              }}
            >
              <SendIcon sx={{ fontSize: '0.8em' }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={isRecording ? 'Recording...' : 'Hold to Record'}>
            <IconButton
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                '&:hover': { bgcolor: theme.palette.success.main },
              }}
            >
              <MicIcon sx={{ fontSize: '0.8em' }} />
            </IconButton>
          </Tooltip>
        )}

        {!message.trim() && (
          <Stack
            direction='row'
            ml={1}
            border={`0.5px solid ${theme.palette.divider}`}
            borderRadius={1}
          >
            {NextButton}
            {DisconnectButton}
          </Stack>
        )}
      </Paper>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 72,
              right: 24,
              zIndex: 1000
            }}
          >
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme={theme.palette.mode}
              style={{
                background: theme.palette.background.paper,
                borderRadius: 8,
                boxShadow: theme.shadows[6],
                color: theme.palette.text.primary
              }}
            />
          </Box>
        </ClickAwayListener>
      )}

      <PremiumFeatureModel
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        featureName={premiumFeatureName}
      />
      <LimitReachedModal
        open={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
        type={limitType}
      />
      <AudioErrorModal
        open={micErrorModalOpen}
        onClose={() => setMicErrorModalOpen(false)}
        type={limitType}
      />
    </Box>
  );
}

export default RandomMessageInput;
