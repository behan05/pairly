import { useMemo, useState, useEffect } from 'react';
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
  useMediaQuery,
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
  MusicNoteIcon,
} from '@/MUI/MuiIcons';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

// Components
import TypingIndicator from '@/components/private/randomChat/TypingIndicator';
import WaitingIndicator from '@/components/private/randomChat/WaitingIndicator';
import StyledText from '@/components/common/StyledText';
import textFormater from '@/utils/textFormatting';
import PrivatePartnerProfileModel from '../supportComponents/PrivatePartnerProfileModel';
import ProposeToPartnerModel from '../supportComponents/ProposeToPartnerModel';
import ReportUserModal from '../supportComponents/ReportUserModal';
import BlockUserModal from '../supportComponents/BlockUsermodal'
import formatMessageTime from '@/utils/formatMessageTime';
import ActionConfirm from '@/components/private/actionConfirmation/ActionConfirm';
import SilentFeelModeModel from '../../../common/SilentFeelModeModal';
import HearTogherModel from '../../../common/HearTogetherModel';

import { updateSettingsNotification } from '@/redux/slices/settings/settingsAction';
import { useDispatch, useSelector } from 'react-redux'

function PrivateChatHeader({ userId, onBack, onCloseChatWindow, clearActiveChat }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isTabletOrBelow = useMediaQuery('(max-width:775px)');
  const [proposeModel, setProposeModel] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);

  const dispatch = useDispatch();

  // local state
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openSlientFeelModeModal, setOpenSlientFeelModeModal] = useState(false);
  const [openHearTogetherModal, setOpenHearTogetherModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openClearModal, setOpenClearModal] = useState(false);

  const open = Boolean(anchorEl);

  // get all users from redux
  const { allUsers: users, chatUsers, activeChat } = useSelector(state => state.privateChat);
  const { notificationSettings } = useSelector((state) => state.settings);
  const [notification, setNotification] = useState(notificationSettings?.newMessage ?? false);

  useEffect(() => {
    setNotification(notificationSettings?.newMessage ?? false);
  }, [notificationSettings]);

  // fallback if not found
  const partnerProfile = useMemo(() => {
    return users.find((u) => u.userId === userId)?.profile || {};
  }, [users, userId]);

  const isPartnerOnline = useMemo(() => {
    const user = chatUsers.find((u) => u.partnerId === userId) || {};
    const settings = users.find((s) => s.userId === userId)?.settings || {};
    const showOnlineStatus = settings.showOnlineStatus;
    const showLastSeen = settings.showLastSeen;

    return {
      isOnline: user.isOnline && showOnlineStatus,
      lastSeen: user.lastSeen && showLastSeen ? user.lastSeen : null,
    };
  }, [userId, chatUsers, users]);

  const isPartnerTyping = useSelector(
    (state) => state.privateChat.partnerTyping[userId] ?? false
  );

  const partnerSettings = useMemo(() => {
    return users.find((u) => u.userId === userId)?.settings || {}
  }, [users, userId]);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /** Handle Report Partner */
  const handleReportPartner = () => {
    setOpenReportDialog(true);
  };

  /** Handle Report Partner */
  const handleBlockPartner = () => {
    setOpenBlockDialog(true);
  };

  /** Handle notification */
  const handleNotification = async () => {
    if (!notificationSettings) return;

    try {
      // Determine the new value by toggling the current 'newMessage' setting
      const newValue = !notificationSettings.newMessage;

      const updatedSettings = {
        ...notificationSettings,
        newMessage: newValue,
      };

      // Dispatch the updated settings to Redux
      const response = await dispatch(updateSettingsNotification(updatedSettings));

      if (response?.success) {
        // Update local state to reflect the actual toggle
        setNotification(newValue);
      }
    } catch (_) {
    }
  };

  /** Handle handleSilentFeelMode */
  const handleSilentFeelMode = () => {
    setOpenSlientFeelModeModal(true)
  };

  /** Handle HearTogetherModal */
  const handleHearTogether = () => {
    setOpenHearTogetherModal(true);
  };

  /**
   * Common menu item styling
   */
  const menuItemStyle = {
    borderRadius: 0.5,
    px: 1,
    py: 0.7,
    minHeight: 'unset',
    transition: 'all 0.3s ease-out',
    color: 'text.secondary',
    fontSize: '0.875rem',
    '&:hover': {
      transform: `translate(1px, -1px) scale(0.99)`,
      filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
    },
  };

  const menuItemRedStyle = {
    borderRadius: 0.5,
    px: 1,
    py: 0.7,
    fontSize: '0.875rem',
    minHeight: 'unset',
    transition: 'all 0.3s ease-out',
    color: 'text.secondary',
    '&:hover': {
      transform: `translate(1px, -1px) scale(0.99)`,
      filter: `drop-shadow(0 20px 1rem ${theme.palette.error.main})`
    },
  };

  const handleAction = (action) => {
    handleMenuClose();

    switch (action) {
      case 'viewProfile':
        setOpenProfileModal(true);
        break;

      case 'proposeToPartner':
        setProposeModel((prev) => !prev);
        break;

      case 'inviteToSilentFeelMode':
        handleSilentFeelMode();
        break;

      case 'inviteToHearTogether':
        handleHearTogether();
        break;

      case 'closeChat':
        onCloseChatWindow(null);
        clearActiveChat(null);
        break;

      case 'muteNotification':
        handleNotification();
        break;

      case 'report':
        handleReportPartner();
        break;

      case 'block':
        handleBlockPartner();
        break;

      case 'clearChat':
        setOpenClearModal(true);
        break;

      case 'deleteChat':
        setOpenDeleteModal(true);
        break;

      default:
        break;
    }
  };

  return (
    <Box position="sticky" top={0} zIndex={20}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={isSm ? 0.2 : 2}
        px={isSm ? 0.5 : 2}
        py={1}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
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
          spacing={1.2}
          alignItems="center"
          sx={{ cursor: 'pointer', flexGrow: 1 }}
          onClick={() => setOpenProfileModal(true)}
        >
          <Tooltip title={<StyledText text={`User Info`} />}>
            <Avatar
              alt={partnerProfile?.fullName ?? 'Stranger'}
              src={partnerSettings.showProfilePic ? partnerProfile?.profileImage || defaultAvatar : defaultAvatar}
            />
          </Tooltip>
          <Box>
            <Tooltip title={<StyledText text={'User Info'} />}>
              <Typography variant="body2" fontWeight={600}>
                {textFormater(partnerProfile?.fullName) ?? 'Stranger'}
              </Typography>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isPartnerOnline.isOnline && partnerSettings?.showOnlineStatus ? (
                <Stack justifyContent="center" direction="row" alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.success.main,
                      mr: 0.5,
                      mt: '2px',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: isSm ? '0.8rem' : '0.9rem' }}>
                    Online
                  </Typography>
                </Stack>
              ) : partnerSettings?.showLastSeen ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: isSm ? '0.8rem' : '0.9rem' }}>
                  Last active {formatMessageTime(isPartnerOnline.lastSeen)}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: isSm ? '0.8rem' : '0.9rem' }}>
                  Last seen hidden
                </Typography>
              )}
            </Box>

          </Box>
        </Stack>

        {/* Right Section: Typing Indicator + Menu */}
        <Stack direction="row" alignItems="center" justifyContent="center" gap={0.5}>
          <Stack direction="row" alignItems="center" justifyContent="center" gap={0.5}>
            {partnerSettings?.showTypingStatus ?
              (isPartnerTyping ? <TypingIndicator /> : <WaitingIndicator />)
              : <WaitingIndicator />}
          </Stack>
          {/* Action Menu Icon */}
          <Tooltip title='Menu'>
            <IconButton onClick={handleMenuOpen} size="small">
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                background: `linear-gradient(130deg,
             ${theme.palette.primary.dark} 0%, 
            ${theme.palette.background.paper} 30%,
             ${theme.palette.background.paper} 100%)`,
                boxShadow: theme.shadows[6],
                borderRadius: 1,
                minWidth: 200,
                mt: 1,
                p: '0px 10px',
                py: 0.75,
                overflow: 'hidden'
              }
            }}
          >
            {[
              {
                icon: <PersonIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />,
                label: 'View Profile',
                onClick: () => handleAction('viewProfile'),
              },
              {
                icon: <CloseIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />,
                label: 'Close Chat',
                onClick: () => handleAction('closeChat'),
              },
              {
                icon: (
                  <NotificationsOffIcon
                    fontSize="small"
                    sx={{ mr: 1, color: notification ? 'warning.main' : 'text.disabled' }}
                  />
                ),
                label: notification ? 'Mute Notifications' : 'Notifications Muted',
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
                icon: <FavoriteIcon fontSize='small' sx={{ mr: 1, color: 'error.main' }} />,
                label: 'Create Proposal',
                onClick: () => handleAction('proposeToPartner'),
              },
              {
                label: 'Silent Feel Mode',
                icon: <SelfImprovementIcon fontSize='small' sx={{ mr: 1, color: theme.palette.primary.main }} />,
                onClick: () => handleAction('inviteToSilentFeelMode'),
              },
              {
                label: 'Hear Together',
                icon: <MusicNoteIcon fontSize='small' sx={{ mr: 1, color: theme.palette.info.main }} />,
                onClick: () => handleAction('inviteToHearTogether'),
              }
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
                label: 'Delete User',
                onClick: () => handleAction('deleteChat'),
              },
            ].map((item, index) => (
              <MenuItem key={index} onClick={item.onClick} sx={menuItemRedStyle}>
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
        onCloseChatWindow={onCloseChatWindow}
        clearActiveChat={clearActiveChat}
      />

      <ProposeToPartnerModel
        open={proposeModel}
        onClose={setProposeModel}
        partnerId={userId}
      />

      <BlockUserModal
        open={openBlockDialog}
        onClose={() => setOpenBlockDialog(false)}
        partner={partnerProfile}
        partnerId={userId}
        onCloseChatWindow={onCloseChatWindow}
        clearActiveChat={clearActiveChat}
      />

      <ReportUserModal
        open={openReportDialog}
        onClose={() => setOpenReportDialog(false)}
        partner={partnerProfile}
        partnerId={userId}
      />

      <SilentFeelModeModel
        open={openSlientFeelModeModal}
        onClose={() => setOpenSlientFeelModeModal(false)}
        partner={partnerProfile}
        partnerId={userId}
      />

      <HearTogherModel
        open={openHearTogetherModal}
        onClose={() => setOpenHearTogetherModal(false)}
        partner={partnerProfile}
        partnerId={userId}
      />

      {/* Delete Chat Modal */}
      <ActionConfirm
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        activeChat={activeChat}
        onCloseChatWindow={onCloseChatWindow}
        clearActiveChat={clearActiveChat}
        title="Delete Chat"
        actionType="delete"
        description="Are you sure you want to delete this chat? This action cannot be undone."
      />

      {/* Clear Chat Modal */}
      <ActionConfirm
        open={openClearModal}
        onClose={() => setOpenClearModal(false)}
        activeChat={activeChat}
        onCloseChatWindow={onCloseChatWindow}
        clearActiveChat={clearActiveChat}
        title="Clear Chat"
        actionType="clear"
        description="Are you sure you want to clear this chat history? This action cannot be undone."
      />

    </Box>
  )
}

export default PrivateChatHeader;
