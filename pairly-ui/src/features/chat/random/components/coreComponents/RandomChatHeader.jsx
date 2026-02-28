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
import { alpha } from '@mui/material/styles';

// Components
import TypingIndicator from '@/components/private/randomChat/TypingIndicator';
import WaitingIndicator from '@/components/private/randomChat/WaitingIndicator';
import PartnerProfileModal from '../../components/supportComponents/PartnerProfileModal';
import StyledText from '@/components/common/StyledText';
import BlockUserModal from '../supportComponents/BlockUserModal';
import ReportUserModal from '../supportComponents/ReportUserModal';
import PrivateChatRequestPopupModal from '../supportComponents/PrivateChatRequestPopupModal';
import { updateSettingsNotification } from '@/redux/slices/settings/settingsAction';

// Work active tab only "Erotic mode"
import ToggleErotic from '../../../common/erotic-toggle/ToggleErotic';

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
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",

          backgroundColor: alpha(
            theme.palette.background.paper,
            0.85
          ),

          borderBottom: `1px solid ${alpha(
            theme.palette.divider,
            0.6
          )}`,
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
              alt={partnerProfile?.fullName ?? "Stranger"}
              src={partnerProfile?.profileImage || defaultAvatar}
              sx={(theme) => ({
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `1px solid ${theme.palette.divider}`,

                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.4)"
                    : "0 2px 8px rgba(0,0,0,0.1)",

                transition: "all 0.25s ease",

                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 6px 16px rgba(0,0,0,0.55)"
                      : "0 4px 12px rgba(0,0,0,0.15)",
                },
              })}
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
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    fontSize: '0.9em',
                    color: theme.palette.text.primary,
                  }}
                >
                  {partnerProfile?.fullName ?? 'Stranger'}
                </Typography>
              </Tooltip>
              {partnerProfile.isUserVerifiedByEmail && (
                <>
                  {isPartnerPremium ? (
                    <Tooltip title="Premium User">
                      <Box
                        sx={(theme) => ({
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 18,
                          height: 18,
                          ml: 0.6,
                          borderRadius: 0.2,
                          border: `1px solid ${theme.palette.primary.main}`,
                          color: theme.palette.primary.main,
                          boxShadow: `0 0 8px ${theme.palette.primary.main}44`,
                          transition: "all .25s",
                        })}
                      >
                        <StarIcon sx={{ fontSize: 14 }} />
                      </Box>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Verified User">
                      <Box
                        sx={(theme) => ({
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 18,
                          height: 18,
                          ml: 0.6,
                          borderRadius: 0.2,
                          border: `1px solid ${theme.palette.primary.main}`,
                          color: theme.palette.primary.main,
                          opacity: 0.8,
                          transition: "all .25s",
                        })}
                      >
                        <CheckCircleIcon sx={{ fontSize: 14 }} />
                      </Box>
                    </Tooltip>
                  )}
                </>
              )}
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.68rem",
                letterSpacing: 0.6,
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

          <ToggleErotic />

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
