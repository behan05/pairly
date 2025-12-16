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
  useMediaQuery
} from '@/MUI/MuiComponents';
import {
  MoreVertIcon,
  BlockIcon,
  ReportIcon,
  HandshakeIcon,
  ContentCopyIcon,
  NotificationsOffIcon,
  defaultAvatar,
  CheckCircleIcon,
  StarIcon,
  PersonAddAltOutlinedIcon
} from '@/MUI/MuiIcons';

// Components
import TypingIndicator from '@/components/private/randomChat/TypingIndicator';
import WaitingIndicator from '@/components/private/randomChat/WaitingIndicator';
import PartnerProfileModal from '../../components/supportComponents/PartnerProfileModal';
import StyledText from '@/components/common/StyledText';
import BlockUserModal from '../supportComponents/BlockUserModal';
import ReportUserModal from '../supportComponents/ReportUserModal';
import PrivateChatRequestPopupModal from '../supportComponents/PrivateChatRequestPopupModal';
import { updateSettingsNotification } from '@/redux/slices/settings/settingsAction';

// Redux
import { useDispatch, useSelector } from 'react-redux'
// Country and State utilities
import { Country, State } from 'country-state-city';
// Toast notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// socket instance
import { socket } from '@/services/socket';
import { Divider } from '@mui/material';
/**
 * RandomChatHeader component
 *
 * Displays:
 * Partner's avatar, name, and location
 * Typing or waiting indicator
 * Options menu for block, report, copy ID, and mute
 * Modal for viewing full partner profile
 *
 * @component
 * @returns {JSX.Element}
 */

function RandomChatHeader() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  // Local state
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [isFriendRequestSend, setIsFriendRequestSend] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);

  // Redux state
  const { partnerProfile, partnerId, partnerTyping } = useSelector((state) => state.randomChat);
  const { notificationSettings } = useSelector((state) => state.settings);
  const [notification, setNotification] = useState(notificationSettings?.newMessage ?? false);

  // Partner Plan
  const partnerPlan = partnerProfile?.subscription?.plan;
  const partnerStatus = partnerProfile?.subscription?.status;

  const isPartnerPremium =
    partnerStatus === 'active' && partnerPlan !== 'free';

  useEffect(() => {
    setNotification(notificationSettings?.newMessage ?? false);
  }, [notificationSettings]);

  /**
   * Opens menu
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

  /** Closes menu */
  const handleMenuClose = () => setAnchorEl(false);

  /** Copy Partner Id */
  const copyPartnerId = () => {
    navigator.clipboard.writeText(partnerProfile.partnerPublicId);
    toast.success('Partner ID copied!', {
      style: {
        backdropFilter: 'blur(14px)',
        background: theme.palette.divider,
        color: theme.palette.text.primary,
      }
    });
  };

  /** Handle Report Partner */
  const handleReportPartner = () => {
    setOpenReportDialog(true);
  };

  /** Handle Report Partner */
  const handleBlockPartner = () => {
    setOpenBlockDialog(true);
  };

  /** Handle Private Chat Request */
  const handlePrivateChatRequest = () => {

    // Emiting parivate chat requesting.
    socket.emit('privateChat:request');
    setIsFriendRequestSend(true)
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

  /**
   * Handles action selection from menu
   * @param {'block'|'report'|'copy'|'mute'} action
   */
  const handleAction = (action) => {
    handleMenuClose();

    switch (action) {
      case 'copyPartnerId':
        copyPartnerId();
        break;

      case 'blockPartner':
        handleBlockPartner();
        break;

      case 'reportPartner':
        handleReportPartner();
        break;

      case 'requestForPrivateChat':
        handlePrivateChatRequest();
        break;

      case 'muteNotification':
        handleNotification();
        break;

      default:
        break;
    }
  };

  /**
   * Common menu item styling
   */
  const menuItemStyle = {
    borderRadius: 0.5,
    px: 1,
    py: 0.7,
    fontSize: '0.875rem',
    minHeight: 'unset',
    transition: 'all 0.3s ease-out',
    color: 'text.secondary',
    '&:hover': {
      transform: `translate(1px, -1px) scale(0.99)`,
      filter: `drop-shadow(0 0 0.5px ${theme.palette.primary.main})`
    },
  };

  /** Full readable state name */
  const fullStateName = useMemo(() => {
    return partnerProfile?.location?.state
      ? State.getStateByCodeAndCountry(
        partnerProfile.location.state,
        partnerProfile.location.country
      )?.name
      : '';
  }, [partnerProfile]);

  /** Full readable country name */
  const fullCountryName = useMemo(() => {
    return partnerProfile?.location?.country
      ? Country.getCountryByCode(partnerProfile.location.country)?.name
      : '';
  }, [partnerProfile]);

  return (
    <Box position="sticky" top={0} zIndex={20}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        px={isSm ? 0.5 : 2}
        py={1}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Left Section: Avatar + Name + Location */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={() => setOpenProfileModal(true)}
        >
          <Tooltip title={<StyledText text={'Partner Profile'} />}>
            <Avatar
              alt={partnerProfile?.fullName ?? 'Stranger'}
              src={partnerProfile?.profileImage || defaultAvatar}
            />
          </Tooltip>
          <Box>
            <Stack
              variant="h6"
              fontWeight={600}
              display="flex"
              flexDirection={'row'}
              alignItems="center"
            >
              <Tooltip title={<StyledText text={'Partner Profile'} />}>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  {partnerProfile?.fullName ?? 'Stranger'}
                </Typography>
              </Tooltip>
              {partnerProfile.isUserVerifiedByEmail && (
                <>
                  {isPartnerPremium ? (
                    <Tooltip title="Premium User">
                      <StarIcon
                        sx={{
                          color: theme.palette.warning.dark,
                          fontSize: 20,
                          ml: 0.5,
                          filter: `drop-shadow(0 0 1rem)`
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Verified User">
                      <CheckCircleIcon
                        sx={{
                          color: 'gray',
                          fontSize: 20,
                          ml: 0.5,
                          filter: `drop-shadow(0 0 1rem)`
                        }}
                      />
                    </Tooltip>
                  )}
                </>
              )}
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: isSm ? '0.8rem' : '0.9rem'
              }}
            >
              {fullStateName} {fullCountryName}
            </Typography>
          </Box>
        </Stack>

        {/* Right Section: Typing Indicator + Menu */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={'center'}
          gap={1.2}
        >
          {partnerTyping ? <TypingIndicator /> : <WaitingIndicator />}
          <Tooltip title={isFriendRequestSend ? 'Request Sent' : 'Add Friend'}>
            <IconButton
              onClick={() => !isFriendRequestSend && handleAction('requestForPrivateChat')}
              size="small"
              sx={(theme) => ({
                cursor: isFriendRequestSend ? 'not-allowed' : 'pointer',
                pointerEvents: isFriendRequestSend ? 'none' : 'auto',
                opacity: isFriendRequestSend ? 0.5 : 1,

                backgroundColor: isFriendRequestSend
                  ? theme.palette.action.disabledBackground
                  : theme.palette.success.light + '20',

                border: `1px solid ${isFriendRequestSend
                  ? theme.palette.divider
                  : theme.palette.success.main
                  }`,

                boxShadow: isFriendRequestSend
                  ? 'none'
                  : `0 0 6px ${theme.palette.success.main}40`,

                transition: 'all 0.25s ease',

                '&:hover': !isFriendRequestSend && {
                  backgroundColor: theme.palette.success.light + '40',
                  boxShadow: `0 0 12px ${theme.palette.success.main}80`,
                },

                '&:active': !isFriendRequestSend && {
                  boxShadow: `0 0 4px ${theme.palette.success.main}60`,
                },
              })}
            >

              <PersonAddAltOutlinedIcon
                sx={{
                  color: isFriendRequestSend ? 'text.disabled' : 'success.main',
                  fontSize: '1.2rem'
                }} />
            </IconButton>
          </Tooltip>

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
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                minWidth: 200,
                mt: 1,
                p: '0px 10px',
                py: 0.75,
                overflow: 'hidden'
              }
            }}
          >
            {/* User Management */}
            <MenuItem onClick={() => handleAction('blockPartner')} sx={menuItemStyle}>
              <BlockIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
              Block User
            </MenuItem>

            <MenuItem onClick={() => handleAction('reportPartner')} sx={menuItemStyle}>
              <ReportIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
              Report
            </MenuItem>

            <MenuItem
              disabled={isFriendRequestSend}
              onClick={() => handleAction('requestForPrivateChat')}
              sx={menuItemStyle}
            >
              <HandshakeIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
              {isFriendRequestSend ? 'Request Sent' : 'Add Friend'}
            </MenuItem>

            <Divider />

            {/* Utilities */}
            <MenuItem onClick={() => handleAction('copyPartnerId')} sx={menuItemStyle}>
              <ContentCopyIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
              Copy Partner ID
            </MenuItem>

            <MenuItem onClick={() => handleAction('muteNotification')} sx={menuItemStyle}>
              <NotificationsOffIcon
                fontSize="small"
                sx={{
                  mr: 1,
                  color: notification ? 'warning.main' : 'text.disabled'
                }}
              />
              {notification ? 'Mute Notifications' : 'Notifications Muted'}
            </MenuItem>
          </Menu>

        </Stack>
      </Stack>

      {/* Modal to view partner profile */}
      <PartnerProfileModal
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        partner={partnerProfile}
      />

      <BlockUserModal
        open={openBlockDialog}
        onClose={() => setOpenBlockDialog(false)}
        partner={partnerProfile}
        partnerId={partnerId}
      />

      <ReportUserModal
        open={openReportDialog}
        onClose={() => setOpenReportDialog(false)}
        partner={partnerProfile}
        partnerId={partnerId}
      />

      <PrivateChatRequestPopupModal />
    </Box>
  );
}

export default RandomChatHeader;
