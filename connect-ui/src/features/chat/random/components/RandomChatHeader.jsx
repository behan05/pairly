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
  useMediaQuery
} from '@/MUI/MuiComponents';
import {
  MoreVertIcon,
  BlockIcon,
  ReportIcon,
  ContentCopyIcon,
  NotificationsOffIcon
} from '@/MUI/MuiIcons';

// Components
import TypingIndicator from '@/components/private/randomChat/TypingIndicator';
import WaitingIndicator from '@/components/private/randomChat/WaitingIndicator';
import PartnerProfileModal from '@/components/private/randomChat/PartnerProfileModal';
import StyledText from '@/components/common/StyledText';
import BlockUserModal from '../../common/BlockUserModal';
import ReportUserModal from '../../common/ReportUserModal';

// Redux
import { useSelector } from 'react-redux';
// Country and State utilities
import { Country, State } from 'country-state-city';
// Toast notifications
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // Local state
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);

  // Redux state
  const { partnerProfile, partnerId, partnerTyping } = useSelector((state) => state.randomChat);

  /**
   * Opens menu
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

  /** Closes menu */
  const handleMenuClose = () => setAnchorEl(false);

  /** Copy Partner Id */
  const copyPartnerId = () => {
    navigator.clipboard.writeText(partnerId);
    toast.success('Partner ID copied!');
  };

  /** Handle Report Partner */
  const handleReportPartner = () => {
    setOpenReportDialog(true);
  };

  /** Handle Report Partner */
  const handleBlockPartner = () => {
    setOpenBlockDialog(true);
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

      default:
        break;
    }
  };

  /**
   * Common menu item styling
   */
  const menuItemStyle = {
    borderRadius: 1,
    transition: 'all 0.2s',
    '&:hover': {
      transform: `translateY(-5px)`
    }
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
    <Box position={'relative'}>
      {/* Header wrapper */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        px={2}
        py={0}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        {/* Left Section: Avatar + Name + Location */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={() => setOpenProfileModal(true)}
        >
          <Tooltip title={<StyledText text={'Partner Profile'} />}>
            <Avatar
              alt={partnerProfile?.fullName || 'Stranger'}
              src={partnerProfile?.profileImage}
            />
          </Tooltip>
          <Box>
            <Tooltip title={<StyledText text={'Partner Profile'} />}>
              <Typography variant="subtitle1" fontWeight={600}>
                {partnerProfile?.fullName || 'Stranger'}
              </Typography>
            </Tooltip>

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
        <Stack direction="row" alignItems="center" justifyContent={'center'}>
          {partnerTyping ? <TypingIndicator /> : <WaitingIndicator />}

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
            <MenuItem onClick={() => handleAction('blockPartner')} sx={menuItemStyle}>
              <BlockIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
              Block User
            </MenuItem>
            <MenuItem onClick={() => handleAction('reportPartner')} sx={menuItemStyle}>
              <ReportIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
              Report
            </MenuItem>
            <MenuItem onClick={() => handleAction('copyPartnerId')} sx={menuItemStyle}>
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
    </Box>
  );
}

export default RandomChatHeader;
