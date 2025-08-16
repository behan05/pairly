import { useRef, useState } from 'react';
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
  Stack
} from '@/MUI/MuiComponents';
import {
  CloseIcon,
  SendIcon,
  AttachFileIcon,
  InsertEmoticonIcon,
  PhotoCameraBackIcon,
  MusicNoteIcon,
  DescriptionIcon
} from '@/MUI/MuiIcons';

// Emoji Picker and Toast Notifications
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Redux and Socket
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '@/redux/slices/randomChat/randomChatSlice';
import { socket } from '@/services/socket';

// Axios for media upload and API calls
import axios from 'axios';
import { RANDOM_API } from '@/api/config';

/**
 * RandomMessageInput component
 * - Handles text and media input for random chat
 * - Supports emoji picker, file/media preview, and optimistic UI updates
 * - Uploads media to server and emits messages via socket
 * @returns {JSX.Element} The rendered component.
 */

function RandomMessageInput() {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Local state for message, media previews, emoji picker, and file menu
  const [message, setMessage] = useState('');
  const [previews, setPreviews] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Redux state for user and partner IDs
  const userId = useSelector((state) => state.profile.profileData?._id);
  const partnerId = useSelector((state) => state.randomChat?.partnerId);
  const open = Boolean(anchorEl);

  // Reference to hidden file input
  const fileInputRef = useRef(null);

  // Handle attach button click (open file menu)
  const handleAttachClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close file menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Handle typing status with socket events
  let typingTimeout;
  const handleInputChange = (e) => {
    const { value } = e.target;
    setMessage(value);

    socket.emit('random:typing');

    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socket.emit('random:stop-typing');
    }, 1000);
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
    borderRadius: 1,
    transition: 'all 0.2s',
    '&:hover': {
      transform: `translateY(-5px)`
    }
  };

  return (
    <Box position="relative">
      {/* Toast notifications for feedback */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      {/* Media preview area */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          px: 3,
          py: 1
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
          p: 1.5,
          mx: 2,
          mb: 1,
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper
        }}
      >
        {/* Attach Button */}
        <Tooltip title="Attach">
          <IconButton onClick={handleAttachClick}>
            <AttachFileIcon />
          </IconButton>
        </Tooltip>

        {/* File Attach Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'bottom' }}
          PaperProps={{
            sx: {
              background: `${theme.palette.background.paper}`,
              boxShadow: theme.shadows[6],
              border: `1px solid ${theme.palette.success.main}`,
              borderRadius: 1,
              minWidth: 200,
              mb: 1,
              px: 1,
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
            sx={menuCommonStyle}
          >
            <PhotoCameraBackIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography>Photo & Video</Typography>
          </MenuItem>

          {/* Audio */}
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

          {/* Document */}
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
        </Menu>

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
          maxRows={4}
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          sx={{ mx: 2 }}
        />

        {/* Emoji Button */}
        <Tooltip title="Emoji">
          <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
            <InsertEmoticonIcon />
          </IconButton>
        </Tooltip>

        {/* Send Button */}
        <Tooltip title="Send">
          <IconButton onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '72px',
            right: 24,
            zIndex: 1000
          }}
        >
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme={theme.palette.mode} />
        </Box>
      )}
    </Box>
  );
}

export default RandomMessageInput;
