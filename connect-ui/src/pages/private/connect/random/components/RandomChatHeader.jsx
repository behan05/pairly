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

import { useSelector } from 'react-redux';
import { Country, State } from 'country-state-city';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TypingIndicator from '@/components/private/chat/TypingIndicator';
import WaitingIndicator from '@/components/private/chat/WaitingIndicator';

function RandomChatHeader() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { partnerProfile, partnerId, partnerTyping } = useSelector(state => state.randomChat);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleAction = (action) => {
    handleMenuClose();

    if (action === 'copy') {
      navigator.clipboard.writeText(partnerId)
      toast.success('Partner ID copied!')
    }
    // TODO: Add actual logic for each action
  };

  // Convert ISO codes to full names
  const fullStateName = partnerProfile?.location?.state
    ? State.getStateByCodeAndCountry(partnerProfile.location.state, partnerProfile.location.country)?.name
    : '';
  const fullCountryName = partnerProfile?.location?.country
    ? Country.getCountryByCode(partnerProfile.location.country)?.name
    : '';

  return (
    <Box position={'relative'}>
      <ToastContainer position="top-right" autoClose={1000} theme="colored" />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        px={2}
        py={0}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Left: Avatar + Info */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            alt={partnerProfile?.fullName || 'Stranger'}
            src={partnerProfile?.profileImage || '/dummy-avatar.jpg'}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {partnerProfile?.fullName || 'Stranger'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {fullStateName}, {fullCountryName}
            </Typography>
          </Box>
        </Stack>

        {/* Right: Typing + Menu */}
        <Stack direction="row" alignItems="center" justifyContent={'center'}>
          {partnerTyping ? <TypingIndicator /> : <WaitingIndicator />}

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
            <MenuItem onClick={() => handleAction('block')} sx={menuItemStyle}>
              <BlockIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
              Block User
            </MenuItem>
            <MenuItem onClick={() => handleAction('report')} sx={menuItemStyle}>
              <ReportIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
              Report
            </MenuItem>
            <MenuItem onClick={() => handleAction('copy')} sx={menuItemStyle}>
              <ContentCopyIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
              Copy Partner ID
            </MenuItem>
            <MenuItem onClick={() => handleAction('mute')} sx={menuItemStyle}>
              <NotificationsOffIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
              Mute Notifications
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Box>

  );
}

const menuItemStyle = {
  borderRadius: 1,
  transition: 'all 0.2s',
  '&:hover': {
    transform: `translateY(-5px)`,
  },
};

export default RandomChatHeader;
