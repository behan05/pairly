import React, { useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

function RandomChatHeader() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleAction = (action) => {
    handleMenuClose();
    console.log('Selected action:', action);
    // TODO: Add actual logic for each action
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      px={2}
      py={1}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Left: Avatar + Info */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar alt="User" src="/dummy-avatar.jpg" />
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Stranger
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📍 New York, USA
          </Typography>
        </Box>
      </Stack>

      {/* Right: Typing + Menu */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: 'italic' }}
        >
          typing...
        </Typography>

        <IconButton onClick={handleMenuOpen} size="small">
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'right', horizontal: 'right' }}
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
          <MenuItem
            onClick={() => handleAction('block')}
            sx={{
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': {
                transform: `translateY(-5px)`,
              },
            }}
          >
            <BlockIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
            Block User
          </MenuItem>
          <MenuItem
            onClick={() => handleAction('report')}
            sx={{
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': {
                transform: `translateY(-5px)`,
              },
            }}
          >
            <ReportIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
            Report
          </MenuItem>
          <MenuItem
            onClick={() => handleAction('copy')}
            sx={{
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': {
                transform: `translateY(-5px)`,
              },
            }}
          >
            <ContentCopyIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
            Copy User ID
          </MenuItem>
          <MenuItem
            onClick={() => handleAction('mute')}
            sx={{
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': {
                transform: `translateY(-5px)`,
              },
            }}
          >
            <NotificationsOffIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
            Mute Notifications
          </MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
}

export default RandomChatHeader;
