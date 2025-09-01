import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
  Tooltip,
  Divider,
  useMediaQuery
} from '@/MUI/MuiComponents';
import {
  MoreVertIcon,
  BlockIcon,
  ReportIcon,
  NotificationsOffIcon,
  PersonIcon,
  DeleteIcon,
  ClearAllIcon,
  FavoriteIcon,
  CloseIcon,
  defaultAvatar,
  ArrowBackIcon,
} from '@/MUI/MuiIcons';

// Components
import TypingIndicator from '@/components/private/randomChat/TypingIndicator';
import WaitingIndicator from '@/components/private/randomChat/WaitingIndicator';
import StyledText from '@/components/common/StyledText';
import textFormater from '@/utils/textFormatting';
import PrivatePartnerProfileModel from '../supportComponents/PrivatePartnerProfileModel';

import { useSelector } from "react-redux";

function PrivateChatHeader({ userId, onBack, onCloseChatWindow, clearActiveChat }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isTabletOrBelow = useMediaQuery('(max-width:775px)');

  // local state
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const open = Boolean(anchorEl);

  // get all users from redux
  const users = useSelector(state => state.privateChat.allUsers);

  // fallback if not found
  const partnerProfile = useMemo(() => {
    return users.find((u) => u.userId === userId)?.profile || {};
  }, [users, userId]);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Common menu item styling
   */
  const menuItemStyle = {
    borderRadius: 0.5,
    transition: 'all 0.2s',
    '&:hover': {
      transform: `translateY(-5px)`
    }
  };

  const handleAction = (action) => {
    handleMenuClose();

    switch (action) {
      case 'viewProfile':
        setOpenProfileModal(true);
        break;

      case 'proposeToPartner':
        // your logic here
        break;

      case 'closeChat':
        onCloseChatWindow(null);
        clearActiveChat(null);
        break;

      case 'muteNotification':
        // your logic here
        break;

      case 'report':
        // your logic here
        break;

      case 'block':
        // your logic here
        break;

      case 'clearChat':
        // your logic here
        break;

      case 'deleteChat':
        // your logic here
        break;

      default:
        break;
    }
  };

  return (
    <Box position={'relative'}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        px={isSm ? 0.5 : 2}
        py={1}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        {/* Back Button only for small screens */}
        {isTabletOrBelow && (
          <IconButton onClick={onBack} sx={{ mr: 0 }}>
            <ArrowBackIcon />
          </IconButton>
        )}

        {/* Left Section: Avatar + Name */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ cursor: 'pointer', flexGrow: 1 }}
          onClick={() => setOpenProfileModal(true)}
        >
          <Tooltip title={<StyledText text={'Partner Profile'} />}>
            <Avatar
              alt={partnerProfile?.fullName ?? 'Stranger'}
              src={partnerProfile?.profileImage || defaultAvatar}
            />
          </Tooltip>
          <Box>
            <Tooltip title={<StyledText text={'Partner Profile'} />}>
              <Typography variant="body2" fontWeight={600}>
                {textFormater(partnerProfile?.fullName) ?? 'Stranger'}
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                online
              </Typography>
            </Tooltip>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: isSm ? '0.8rem' : '0.9rem'
              }}
            >
              {/* {fullStateName} {fullCountryName} */}
            </Typography>
          </Box>
        </Stack>

        {/* Right Section: Typing Indicator + Menu */}
        <Stack direction="row" alignItems="center" justifyContent="center">
          {/* {partnerTyping ? <TypingIndicator /> : <WaitingIndicator />} */}

          {/* Action Menu Icon */}
          <IconButton onClick={handleMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>

          {/* Dropdown Menu */}
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
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                minWidth: 200,
                mb: 1,
                px: 1,
                py: 0.75,
                overflow: 'hidden',
              },
            }}
          >
            {[
              {
                icon: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />,
                label: 'View Profile',
                onClick: () => handleAction('viewProfile'),
              },
              {
                icon: <FavoriteIcon fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />,
                label: 'Send Proposal',
                onClick: () => handleAction('proposeToPartner'),
              },
              {
                icon: <CloseIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />,
                label: 'Close Chat',
                onClick: () => handleAction('closeChat'),
              },
              {
                icon: <NotificationsOffIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />,
                label: 'Mute Notifications',
                onClick: () => handleAction('muteNotification'),
              },
            ].map((item, index) => (
              <MenuItem key={index} onClick={item.onClick} sx={menuItemStyle}>
                {item.icon}
                {item.label}
              </MenuItem>
            ))}

            <Divider sx={{ my: 1 }} />

            {[
              {
                icon: <ReportIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />,
                label: 'Report',
                onClick: () => handleAction('report'),
              },
              {
                icon: <BlockIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />,
                label: 'Block',
                onClick: () => handleAction('block'),
              },
              {
                icon: <ClearAllIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />,
                label: 'Clear Chat',
                onClick: () => handleAction('clearChat'),
              },
              {
                icon: <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />,
                label: 'Delete Chat',
                onClick: () => handleAction('deleteChat'),
              },
            ].map((item, index) => (
              <MenuItem key={index} onClick={item.onClick} sx={menuItemStyle}>
                {item.icon}
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Stack>

      <PrivatePartnerProfileModel
        userId={userId}
        partnerProfile={partnerProfile}
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
      />
    </Box>
  )
}

export default PrivateChatHeader;
