import { useRef, useState, useEffect } from 'react';
import {
  Box, IconButton, InputBase, Menu, MenuItem, Paper, Tooltip, Typography, useTheme, useMediaQuery, Stack
} from '../../../../../MUI/MuiComponents';
import {
  CloseIcon, SendIcon, AttachFileIcon, InsertEmoticonIcon, PhotoCameraBackIcon, MusicNoteIcon,
  DescriptionIcon, NoteAltIcon, LockIcon, LocationOnIcon,
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
import { v4 as uuidv4 } from 'uuid';

function PrivateMessageInput() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [previews, setPreviews] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const currentUserId = useSelector((state) => state.profile.profileData?.userId ?? state.profile.profileData?.user);
  const { conversationId, activePartnerId } = useSelector((state) => state.privateChat);
  const open = Boolean(anchorEl);
  const fileInputRef = useRef(null);
  const inputContainerRef = useRef(null);

  // Typing indicator logic
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
    setPreviews((prev) => prev.filter((_, i) => i !== indexToDelete));
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

    const createdAtIso = new Date().toISOString();

    // ---- Handle Text ----
    if (hasText) {

      // emit to server
      socket.emit('privateChat:message', {
        message,
        messageType: 'text',
      });

      setMessage('');
    }

    if (hasMedia) {
      previews.forEach((file) => {
        dispatch(
          addMessage({
            sender: String(currentUserId ?? ''),
            message: file.data,
            fileName: file.name,
            messageType: getContentType(file),
            createdAt: createdAtIso,
            seen: false
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
          formData.append('conversationId', String(conversationId));
          formData.append('messageType', getContentType(file));

          const token = localStorage.getItem('token');
          if (!token) {
            toast.error('You must be logged in to send media.');
            return;
          }

          await axios.post(`${PRIVATE_CHAT_API}/media`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
        }
      }
    } catch (err) {
      toast.error('Upload failed. Try again.', err?.message);
    }

  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  const menuCommonStyle = {
    borderRadius: 0.5,
    p: '8px 10px',
    transition: 'all 0.3s ease-out',
    color: 'text.secondary',
    '&:hover': {
      transform: `scale(0.99)`,
      transform: `translate(1px, -1px)`,
      filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
    },
  };

  const handleAttachClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Adding this useEffect to handle mobile keyboard resizing
  useEffect(() => {
    const handleViewportChange = () => {
      if (!inputContainerRef.current || !window.visualViewport) return;
      const vhOffset = window.visualViewport.height - window.innerHeight;
      inputContainerRef.current.style.bottom = `${vhOffset > 0 ? vhOffset + 8 : 0}px`;
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
      handleViewportChange();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
    };
  }, []);

  return (
    <Box
      ref={inputContainerRef}
      width="100%"
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
                gap: 2,
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
                    transform: `scale(0.99)`,
                    transform: `translate(1px, -2px)`,
                    filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                  }
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: theme.palette.action.hover,
                    p: 1.5,
                    borderRadius: 2,
                  }}
                  onClick={() => {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                    handleCloseMenu();
                  }}
                >
                  <PhotoCameraBackIcon sx={{ color: 'primary.main', fontSize: '1.8rem' }} />
                </IconButton>
                <Typography variant="caption">Gallery</Typography>
              </Stack>

              {/* Audio */}
              <Stack alignItems="center" spacing={1} sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: `scale(0.99)`,
                  transform: `translate(1px, -2px)`,
                  filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                }
              }}>
                <IconButton
                  sx={{ bgcolor: theme.palette.action.hover, p: 1.5, borderRadius: 2 }}
                  onClick={() => {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                    handleCloseMenu();
                  }}
                >
                  <MusicNoteIcon sx={{ color: 'secondary.main', fontSize: '1.8rem' }} />
                </IconButton>
                <Typography variant="caption">Audio</Typography>
              </Stack>

              {/* Document */}
              <Stack alignItems="center" spacing={1} sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: `scale(0.99)`,
                  transform: `translate(1px, -2px)`,
                  filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                }
              }}>
                <IconButton
                  sx={{ bgcolor: theme.palette.action.hover, p: 1.5, borderRadius: 2 }}
                  onClick={() => {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                    handleCloseMenu();
                  }}
                >
                  <DescriptionIcon sx={{ color: 'success.main', fontSize: '1.8rem' }} />
                </IconButton>
                <Typography variant="caption">Document</Typography>
              </Stack>

              {/* Notes */}
              <Stack alignItems="center" spacing={1} sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: `scale(0.99)`,
                  transform: `translate(1px, -2px)`,
                  filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                }
              }}>
                <IconButton
                  sx={{ bgcolor: theme.palette.action.hover, p: 1.5, borderRadius: 2 }}
                  onClick={() => {
                    fileInputRef.current.value = null;
                    fileInputRef.current.click();
                    handleCloseMenu();
                  }}
                >
                  <NoteAltIcon sx={{ color: 'info.main', fontSize: '1.8rem' }} />
                </IconButton>
                <Typography variant="caption">Notes</Typography>
              </Stack>

              {/* Location */}
              <Stack alignItems="center" spacing={1} sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: `scale(0.99)`,
                  transform: `translate(1px, -2px)`,
                  filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                }
              }}>
                <IconButton sx={{ bgcolor: theme.palette.action.hover, p: 1.5, borderRadius: 2 }}>
                  <LocationOnIcon sx={{ color: 'error.main', fontSize: '1.8rem' }} />
                </IconButton>
                <Typography variant="caption">Location</Typography>
              </Stack>

              {/* Secret */}
              <Stack alignItems="center" spacing={1} sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: `scale(0.99)`,
                  transform: `translate(1px, -2px)`,
                  filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
                }
              }}>
                <IconButton sx={{ bgcolor: theme.palette.action.hover, p: 1.5, borderRadius: 2 }}>
                  <LockIcon sx={{ color: 'warning.main', fontSize: '1.8rem' }} />
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
              <DescriptionIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography>Document</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                fileInputRef.current.value = null;
                fileInputRef.current.click();
                handleCloseMenu();
              }}
              sx={menuCommonStyle}
            >
              <PhotoCameraBackIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography>Photo & Video</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                fileInputRef.current.value = null;
                fileInputRef.current.click();
                handleCloseMenu();
              }}
              sx={menuCommonStyle}
            >
              <MusicNoteIcon sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography>Audio</Typography>
            </MenuItem>
            <MenuItem sx={menuCommonStyle}>
              <NoteAltIcon sx={{ mr: 1, color: 'info.main' }} />
              <Typography>Private Notes</Typography>
            </MenuItem>
            <MenuItem sx={menuCommonStyle}>
              <LockIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography>Secret Messages</Typography>
            </MenuItem>
            <MenuItem sx={menuCommonStyle}>
              <LocationOnIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography>Send Location</Typography>
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

        <InputBase
          fullWidth
          multiline
          maxRows={2}
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
          sx={{ mx: 2 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <Tooltip title="Emoji">
          <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
            <InsertEmoticonIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Send">
          <IconButton onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Tooltip>
      </Paper>

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
    </Box>
  );
}

export default PrivateMessageInput;
