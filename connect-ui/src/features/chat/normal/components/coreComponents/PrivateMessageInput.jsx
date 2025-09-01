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
  useMediaQuery,
  Stack
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
} from '@/MUI/MuiIcons';

// Emoji Picker and Toast Notifications
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Redux and Socket
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '@/redux/slices/privateChat/privateChatSlice';
import { socket } from '@/services/socket';

/**
 * PrivateMessageInput component
 * - Handles text and media input for private chat
 * - Supports emoji picker, file/media preview, and optimistic UI updates
 * - Uploads media to server and emits messages via socket
 * @returns {JSX.Element} The rendered component.
 */

function PrivateMessageInput() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  // Local state for message, media previews, emoji picker, and file menu
  const [message, setMessage] = useState('');
  const [previews, setPreviews] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Redux state for user and partner IDs
  const currentUserId = useSelector((state) => state.profile.profileData?._id);
  const partnerId = useSelector((state) => state.privayeChat?.chatUsers?.userId);
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
  };

  // Handle file selection and preview
  const handleFileClick = (e) => {

  };

  // Delete selected media preview
  const handleMediaDeleteClick = (indexToDelete) => {

  };

  // Determine content type for message/media
  const getContentType = (file) => {

  };

  // handle submit
  // handle submit
  const handleSend = async () => {
    const hasText = message.trim() !== '';

    if (hasText) {
      // Emit to socket
      socket.emit('privateChat:message', {
        message,
        senderId: currentUserId,
        receiverId: partnerId,
        type: 'text'
      });

      // Optimistic UI update
      dispatch(
        addMessage({
          message,
          senderId: currentUserId,
          receiverId: partnerId,
          type: 'text',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        })
      );

      // Clear input
      setMessage('');
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {

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
      {/* Main input area */}
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.2,
          mx: 1,
          mb: 1,
          borderRadius: 0.5,
          backgroundColor: theme.palette.background.paper
        }}
      >
        {/* Attach Button */}
        <Tooltip title="Attach">
          <IconButton onClick={handleAttachClick}>
            <AttachFileIcon />
          </IconButton>
        </Tooltip>

        {/* File Attach Menu for small screen*/}
        {isSm ? (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            PaperProps={{
              sx: {
                background: theme.palette.background.paper,
                boxShadow: theme.shadows[6],
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                minWidth: 250,
                p: 2,
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
              <Stack alignItems="center" spacing={1}>
                <IconButton
                  sx={{
                    bgcolor: theme.palette.action.hover,
                    p: 1.5,
                    borderRadius: 2
                  }}
                >
                  <PhotoCameraBackIcon sx={{ color: 'primary.main', fontSize: '1.8rem' }} />
                </IconButton>
                <Typography variant="caption">Gallery</Typography>
              </Stack>

              {/* Audio */}
              <Stack alignItems="center" spacing={1}>
                <IconButton
                  sx={{
                    bgcolor: theme.palette.action.hover,
                    p: 1.5,
                    borderRadius: 2
                  }}
                >
                  <MusicNoteIcon sx={{ color: 'secondary.main', fontSize: '1.8rem' }} />
                </IconButton>
                <Typography variant="caption">Audio</Typography>
              </Stack>

              {/* Document */}
              <Stack alignItems="center" spacing={1}>
                <IconButton
                  sx={{
                    bgcolor: theme.palette.action.hover,
                    p: 1.5,
                    borderRadius: 2
                  }}
                >
                  <DescriptionIcon sx={{ color: 'success.main', fontSize: '1.8rem' }} />
                </IconButton>
                <Typography variant="caption">Document</Typography>
              </Stack>

              {/* Notes */}
              <Stack alignItems="center" spacing={1}>
                <IconButton
                  sx={{
                    bgcolor: theme.palette.action.hover,
                    p: 1.5,
                    borderRadius: 2
                  }}
                >
                  <NoteAltIcon sx={{ color: 'info.main', fontSize: '1.8rem' }} />
                </IconButton>
                <Typography variant="caption">Notes</Typography>
              </Stack>

              {/* Location */}
              <Stack alignItems="center" spacing={1}>
                <IconButton
                  sx={{
                    bgcolor: theme.palette.action.hover,
                    p: 1.5,
                    borderRadius: 2
                  }}
                >
                  <LocationOnIcon sx={{ color: 'error.main', fontSize: '1.8rem' }} />
                </IconButton>
                <Typography variant="caption">Location</Typography>
              </Stack>

              {/* Secret */}
              <Stack alignItems="center" spacing={1}>
                <IconButton
                  sx={{
                    bgcolor: theme.palette.action.hover,
                    p: 1.5,
                    borderRadius: 2
                  }}
                >
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

            {/* Private Note */}
            <MenuItem sx={menuCommonStyle}>
              <NoteAltIcon sx={{ mr: 1, color: 'info.main' }} />
              <Typography>Private Notes</Typography>
            </MenuItem>

            {/* Secret Messages */}
            <MenuItem sx={menuCommonStyle}>
              <LockIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography>Secret Messages</Typography>
            </MenuItem>

            {/* Send Location */}
            <MenuItem sx={menuCommonStyle}>
              <LocationOnIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography>Send Location</Typography>
            </MenuItem>
          </Menu>
        )}

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
          sx={{ mx: 2 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
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

export default PrivateMessageInput;
