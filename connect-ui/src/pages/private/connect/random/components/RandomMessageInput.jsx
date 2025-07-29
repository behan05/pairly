import React, { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  useTheme,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DescriptionIcon from '@mui/icons-material/Description';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '@/redux/slices/chat/randomChatSlice';
import { socket } from '@/services/socket';

function RandomMessageInput() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const userId = useSelector(state => state.profile.profileData?._id);
  const open = Boolean(anchorEl);

  const handleAttachClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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

  const handleSend = () => {
    if (message.trim() === '') return;

    // Emit to backend
    socket.emit('random:message', {
      message,
      senderId: userId,
      type: 'text' // temp text
    });

    // Update local Redux
    dispatch(
      addMessage({
        message,
        senderId: userId,
        type: 'text',// temp text
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
    );

    // Clear input
    setMessage('');
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  return (
    <Box position="relative">
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          mx: 2,
          mb: 1,
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Attach File Button */}
        <Tooltip title="Attach">
          <IconButton onClick={handleAttachClick}>
            <AttachFileIcon />
          </IconButton>
        </Tooltip>

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
              overflow: 'hidden',
            },
          }}
        >
          <MenuItem onClick={handleCloseMenu}
            sx={{
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': {
                transform: `translateY(-5px)`,
              },
            }}>
            <PhotoCameraBackIcon sx={{ mr: 1, color: 'primary.main' }} />
            Photo & Video
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}
            sx={{
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': {
                transform: `translateY(-5px)`,
              },
            }}>
            <MusicNoteIcon sx={{ mr: 1, color: 'secondary.main' }} />
            Audio
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}
            sx={{
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': {
                transform: `translateY(-5px)`,
              },
            }}>
            <DescriptionIcon sx={{ mr: 1, color: 'success.main' }} />
            Document
          </MenuItem>
        </Menu>

        {/* Text Input */}
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

        {/* Emoji and Send */}
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

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '72px',
            right: 24,
            zIndex: 1000,
          }}
        >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme={theme.palette.mode}
          />
        </Box>
      )}
    </Box>
  );
}

export default RandomMessageInput;
