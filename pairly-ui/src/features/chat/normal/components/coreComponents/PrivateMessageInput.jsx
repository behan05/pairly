import { useRef, useState, useEffect } from 'react';
import {
  Box, IconButton, InputBase, Menu, MenuItem, Paper, Tooltip, Typography, useTheme, useMediaQuery, Stack
} from '../../../../../MUI/MuiComponents';
import {
  CloseIcon,
  SendIcon,
  AttachFileIcon,
  InsertEmoticonIcon,
  PhotoCameraBackIcon,
  MusicNoteIcon,
  DescriptionIcon,
  NoteAltIcon,
  LockIcon,
  LocationOnIcon,
  MicIcon
} from '@/MUI/MuiIcons';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '@/redux/slices/privateChat/privateChatSlice';
import { PRIVATE_CHAT_API } from '@/api/config'
import { socket } from '@/services/socket';
import axios from 'axios';
import RecordRTC from 'recordrtc';

// Premium Model 
import PremiumFeatureModel from '@/components/private/premium/PremiumFeatureModal';
import LimitReachedModal from '../../../common/LimitReachedModal';
import AudioErrorModal from '../../../common/AudioErrorModal';

function PrivateMessageInput() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [previews, setPreviews] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [premiumFeatureName, setPremiumFeatureName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { plan, status } = useSelector((state) => state?.auth?.user?.subscription);
  const currentUserId = useSelector((state) => state.profile.profileData?.userId ?? state.profile.profileData?.user);
  const { conversationId, activePartnerId } = useSelector((state) => state.privateChat);
  const open = Boolean(anchorEl);
  const fileInputRef = useRef(null);
  const inputContainerRef = useRef(null);

  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [limitType, setLimitType] = useState(null);
  const isFreeUser = status === 'active' && plan === 'free';

  const [isRecording, setIsRecording] = useState(false);
  const [micErrorModalOpen, setMicErrorModalOpen] = useState(false);
  const recorderRef = useRef(null);

  const { chatSettings } = useSelector((state) => state.settings);
  const enterToSend = chatSettings?.enterToSend;

  const typingTimeout = useRef(null);
  const lastTypingTime = useRef(0);
  const TYPING_DELAY = 1000;

  const handleInputChange = (e) => {
    const { value } = e.target;
    setMessage(value);

    const now = Date.now();
    if (now - lastTypingTime.current > TYPING_DELAY) {
      socket.emit('privateChat:typing', { from: currentUserId, to: activePartnerId });
      lastTypingTime.current = now;
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('privateChat:stop-typing', { from: currentUserId, to: activePartnerId });
    }, TYPING_DELAY + 500);
  };

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
        const sanitizedFile = new File([file], sanitizedName, { type: file.type, lastModified: file.lastModified });

        const filePreview = { file: sanitizedFile, name: sanitizedName, type: file.type, data: reader.result };
        setPreviews((prev) => [...prev, filePreview]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMediaDeleteClick = (indexToDelete) => setPreviews((prev) => prev.filter((_, i) => i !== indexToDelete));

  const getContentType = (file) => {
    if (!file) return 'text';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (['application/pdf', 'application/msword', 'text/plain'].includes(file.type) || file.type.includes('officedocument')) return 'file';
    return 'text';
  };

  // Share location
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
          socket.emit('privateChat:message', { message: locationUrl, messageType: 'location' })

          // Optimistic UI update
          dispatch(
            addMessage({
              sender: String(currentUserId ?? ''),
              message: locationUrl,
              messageType: "location",
              createdAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              }),
              seen: false
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

  // --- Audio Recording ---
  const startRecording = async () => {
    try {
      // Check if any audio input device exists
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(device => device.kind === 'audioinput');

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
      console.error(err);
      setMicErrorModalOpen(true);
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(async () => {
      const blob = recorderRef.current.getBlob();
      const file = new File([blob], `audio_${Date.now()}.webm`, { type: blob.type });

      setIsRecording(false);
      handleAudioSend(file);
    });
  };

  const handleAudioSend = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);
    formData.append('conversationId', String(conversationId));
    formData.append('messageType', 'audio');

    // Optimistic UI
    dispatch(
      addMessage({
        sender: String(currentUserId),
        message: URL.createObjectURL(file),
        fileName: file.name,
        messageType: 'audio',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seen: false,
      })
    );

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${PRIVATE_CHAT_API}/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
      toast.error('Audio upload failed!');
    }
  };

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
    if (hasText) {
      socket.emit('privateChat:message', { message, messageType: 'text' });

      dispatch(
        addMessage({
          sender: String(currentUserId ?? ''),
          message,
          messageType: 'text',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          seen: false,
        })
      );

      setMessage('');
    }

    // ---- Sending media ----
    if (hasMedia) {
      try {
        for (let file of previews) {
          const formData = new FormData();
          formData.append('media', file.file);
          formData.append('conversationId', String(conversationId));
          formData.append('messageType', getContentType(file));

          const token = localStorage.getItem('token');
          if (!token) return toast.error('You must be logged in to send media.');

          // Optimistic UI
          dispatch(
            addMessage({
              sender: String(currentUserId ?? ''),
              message: file.data,
              fileName: file.name,
              messageType: getContentType(file),
              createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              seen: false,
            })
          );

          await axios.post(`${PRIVATE_CHAT_API}/media`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
        }

        setPreviews([]);
      } catch (err) {
        console.error(err);
        toast.error('Upload failed. Please try again.');
      }
    }
  };

  const handleEmojiSelect = (emoji) => setMessage((prev) => prev + emoji.native);

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
      filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
    },
  };

  const handleAttachClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  useEffect(() => {
    const handleViewportChange = () => {
      if (!inputContainerRef.current || !window.visualViewport) return;
      const vhOffset = window.visualViewport.height - window.innerHeight;
      inputContainerRef.current.style.marginBottom = `${vhOffset > 0 ? vhOffset + 8 : 0}px`;
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
      handleViewportChange();
    };
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
    };
  }, []);

  return (
    <Box ref={inputContainerRef} width="100%" sx={{ transition: 'margin-bottom 0.25s ease', pb: isSm ? 'env(safe-area-inset-bottom)' : 0 }}>

      {/* Media preview area */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'center',
          px: 1,
          py: 0.5,
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
        elevation={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.2,
          mx: 1,
          mb: 1,
          borderRadius: 2,
        }}
      >
        {/* Attach Button */}
        <Tooltip title="Attach">
          <IconButton onClick={handleAttachClick}>
            <AttachFileIcon />
          </IconButton>
        </Tooltip>

        {/* File Menu (small & large screens) */}
        {isSm ? (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            PaperProps={{
              sx: {
                background: `linear-gradient(130deg,
             ${theme.palette.primary.dark} 0%, 
            ${theme.palette.background.paper} 30%,
             ${theme.palette.background.paper} 100%)`,
                boxShadow: theme.shadows[6],
                borderRadius: 1,
                minWidth: 200,
                p: '0px 10px',
                py: 0.75,
                overflow: 'hidden'
              }
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                rowGap: 1.2,
                textAlign: 'center'
              }}
            >
              {/* Photo & Video */}
              <Stack
                alignItems="center"
                spacing={1}
                sx={{
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: `translate(1px, -2px) scale(0.99)`,
                    filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                  }
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: theme.palette.action.hover,
                    p: 1,
                    borderRadius: 2,
                  }}
                  onClick={() => {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                    handleCloseMenu();
                  }}
                >
                  <PhotoCameraBackIcon sx={{ color: 'primary.main', fontSize: '1.4rem' }} />
                </IconButton>
                <Typography variant="caption">Gallery</Typography>
              </Stack>

              {/* Audio */}
              <Stack alignItems="center" spacing={1} sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: `translate(1px, -2px) scale(0.99)`,
                  filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                }
              }}>
                <IconButton
                  sx={{ bgcolor: theme.palette.action.hover, p: 1, borderRadius: 2 }}
                  onClick={() => {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                    handleCloseMenu();
                  }}
                >
                  <MusicNoteIcon sx={{ color: 'secondary.main', fontSize: '1.4rem' }} />
                </IconButton>
                <Typography variant="caption">Audio</Typography>
              </Stack>

              {/* Document */}
              <Stack alignItems="center" spacing={1} sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: `translate(1px, -2px) scale(0.99)`,
                  filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                }
              }}>
                <IconButton
                  sx={{ bgcolor: theme.palette.action.hover, p: 1, borderRadius: 2 }}
                  onClick={() => {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                    handleCloseMenu();
                  }}
                >
                  <DescriptionIcon sx={{ color: 'success.main', fontSize: '1.4rem' }} />
                </IconButton>
                <Typography variant="caption">Document</Typography>
              </Stack>

              {/* Notes */}
              <Stack alignItems="center" spacing={1} sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: `translate(1px, -2px) scale(0.99)`,
                  filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                }
              }}>
                <IconButton
                  sx={{ bgcolor: theme.palette.action.hover, p: 1, borderRadius: 2 }}
                  onClick={() => {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                    handleCloseMenu();
                  }}
                >
                  <NoteAltIcon sx={{ color: 'info.main', fontSize: '1.4rem' }} />
                </IconButton>
                <Typography variant="caption">Notes</Typography>
              </Stack>

              {/* Location */}
              <Stack
                onClick={handleLocationClick}
                alignItems="center"
                spacing={1}
                sx={{
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: `translate(1px, -2px) scale(0.99)`,
                    filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                  }
                }}>
                <IconButton sx={{ bgcolor: theme.palette.action.hover, p: 1, borderRadius: 2 }}>
                  <LocationOnIcon sx={{ color: 'error.main', fontSize: '1.4rem' }} />
                </IconButton>
                <Typography variant="caption">Location</Typography>
              </Stack>

              {/* Secret */}
              <Stack alignItems="center" spacing={1} sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: `translate(1px, -2px) scale(0.99)`,
                  filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                }
              }}>
                <IconButton sx={{ bgcolor: theme.palette.action.hover, p: 1, borderRadius: 2 }}>
                  <LockIcon sx={{ color: 'warning.main', fontSize: '1.4rem' }} />
                </IconButton>
                <Typography variant="caption">Secret</Typography>
              </Stack>
            </Box>
          </Menu>
        ) : (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'bottom' }}
            PaperProps={{
              sx: {
                background: `linear-gradient(130deg,
             ${theme.palette.primary.dark} 0%, 
            ${theme.palette.background.paper} 30%,
             ${theme.palette.background.paper} 100%)`,
                boxShadow: theme.shadows[6],
                borderRadius: 1,
                minWidth: 200,
                p: '0px 10px',
                py: 0.75,
                overflow: 'hidden'
              }
            }}
          >
            <MenuItem
              onClick={() => {
                fileInputRef.current.value = null;
                fileInputRef.current.click();
                handleCloseMenu();
              }}
              sx={menuCommonStyle}
            >
              <DescriptionIcon sx={{ mr: 1, color: 'success.main', fontSize: '1.3rem', }} />
              <Typography variant="subtitle2">Document</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                fileInputRef.current.value = null;
                fileInputRef.current.click();
                handleCloseMenu();
              }}
              sx={menuCommonStyle}
            >
              <PhotoCameraBackIcon sx={{ mr: 1, color: 'primary.main', fontSize: '1.3rem', }} />
              <Typography variant="subtitle2">Photo & Video</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                fileInputRef.current.value = null;
                fileInputRef.current.click();
                handleCloseMenu();
              }}
              sx={menuCommonStyle}
            >
              <MusicNoteIcon sx={{ mr: 1, color: 'secondary.main', fontSize: '1.3rem', }} />
              <Typography variant="subtitle2">Audio</Typography>
            </MenuItem>
            <MenuItem sx={menuCommonStyle}>
              <NoteAltIcon sx={{ mr: 1, color: 'info.main', fontSize: '1.3rem', }} />
              <Typography variant="subtitle2">Private Notes</Typography>
            </MenuItem>
            <MenuItem sx={menuCommonStyle}>
              <LockIcon sx={{ mr: 1, color: 'warning.main', fontSize: '1.3rem', }} />
              <Typography variant="subtitle2">Secret Messages</Typography>
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
        )}

        <input
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.ppt,.pptx"
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileClick}
        />

        <Tooltip title="Emoji">
          <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
            <InsertEmoticonIcon />
          </IconButton>
        </Tooltip>

        <InputBase
          fullWidth
          multiline
          maxRows={6}
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
          sx={{ mx: 2 }}
          onKeyDown={(e) => {
            if (enterToSend && e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
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
              <SendIcon fontSize="medium" />
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
              <MicIcon />
            </IconButton>
          </Tooltip>
        )}
      </Paper>

      {showEmojiPicker && (
        <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 72,
              left: 10,
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

export default PrivateMessageInput;
