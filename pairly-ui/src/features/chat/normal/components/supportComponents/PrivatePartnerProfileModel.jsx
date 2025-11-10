import { useMemo, useState } from "react";
import {
  Modal,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Menu,
  MenuItem,
} from "@/MUI/MuiComponents";
import {
  defaultAvatar,
  BlockIcon,
  ReportIcon,
  DeleteIcon,
  ClearAllIcon,
  FavoriteIcon,
  CloseIcon,
  MoreVertIcon,
  CheckCircleIcon
} from "@/MUI/MuiIcons";
import { blue } from "@mui/material/colors";

import { deleteConversationMessage, clearConversationMessage, fetchAllUser } from '@/redux/slices/privateChat/privateChatAction';
import { useDispatch, useSelector } from 'react-redux'
import { Country, State } from "country-state-city";
import ProposeToPartnerModel from '../createProposal/ProposeToPartnerModel';
import ReportUserModal from '../supportComponents/ReportUserModal';
import BlockUserModal from '../supportComponents/BlockUsermodal'

function PrivatePartnerProfileModel(
  { userId, open, onClose,
    onCloseChatWindow,
    clearActiveChat
  }
) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [proposeModel, setProposeModel] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const { allUsers: users, activeChat } = useSelector(state => state.privateChat);
  const dispatch = useDispatch();

  const partnerProfile = useMemo(() => {
    return users.find((u) => u.userId === userId)?.profile || {};
  }, [users, userId]);

  const partnerSetting = useMemo(() => {
    return users.find((u) => u.userId === userId)?.settings || {};
  }, [users, userId]);

  const isPartnerVarified = useMemo(() => {
    return users.find((u) => u.userId === userId)?.isUserVerifiedByEmail || false;
  }, [users, userId]);

  const location = useMemo(() => {
    const state = partnerProfile?.state
      ? State.getStateByCodeAndCountry(
        partnerProfile.state,
        partnerProfile.country
      )?.name
      : "";

    const country = partnerProfile?.country
      ? Country.getCountryByCode(partnerProfile?.country)?.name
      : "";

    return [state, country].filter(Boolean).join(", ");
  }, [partnerProfile]);


  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  /** Handle Report Partner */
  const handleReportPartner = () => {
    setOpenReportDialog(true);
  };

  /** Handle Report Partner */
  const handleBlockPartner = () => {
    setOpenBlockDialog(true);
  };

  /** Handle delete Partner */
  const handleDeleteChat = async () => {
    if (!activeChat) return;

    const confirmed = window.confirm('Are you sure you want to delete this chat? This action cannot be undone.');
    if (!confirmed) return;

    const res = await dispatch(deleteConversationMessage(activeChat));
    if (res?.success) {
      clearActiveChat(null);
      onCloseChatWindow(null);
    }
  };
  /** Handle Clear Message */
  const handleClearChatLog = async () => {
    if (!activeChat) return;

    const res = await dispatch(clearConversationMessage(activeChat));
    if (res?.success) {
      clearActiveChat(null);
      onCloseChatWindow(null);
      dispatch(fetchAllUser())
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'proposeToPartner':
        setProposeModel((prev) => !prev);
        break;

      case 'closeChat':
        if (typeof onCloseChatWindow === 'function') onCloseChatWindow(null);
        break;
      case 'report':
        handleReportPartner()
        break;

      case 'block':
        setOpenBlockDialog(true);
        break;

      case 'clearChat':
        handleClearChatLog()
        break;

      case 'deleteChat':
        handleDeleteChat();
        break;

      case 'muteNotification':
        // your logic here
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
      filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
    },
  };

  return (
    <Box>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            width: isSm ? "95%" : 400,
            background: theme.palette.background.paper,
            borderRadius: 1,
            p: 0,
            mx: "auto",
            mt: "8vh",
            color: "text.primary",
            boxShadow: theme.shadows[10],
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, mx: 1, borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                color: theme.palette.text.primary
              }}
            >
              {partnerProfile.fullName.split(' ')[0]} Info
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              borderRadius={1}
            >
              <IconButton onClick={handleMenuOpen} sx={{ color: theme.palette.text.primary }}>
                <MoreVertIcon />
              </IconButton>
              <IconButton onClick={onClose} sx={{ color: theme.palette.text.primary }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
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
                icon: <FavoriteIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />,
                label: 'Create Proposal',
                onClick: () => handleAction('proposeToPartner'),
              },
              {
                icon: <CloseIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />,
                label: 'Close Chat',
                onClick: () => handleAction('closeChat'),
              },

            ].map((item, index) => (
              <MenuItem key={index} onClick={item.onClick} sx={menuItemStyle}>
                {item.icon}
                {item.label}
              </MenuItem>
            ))}

            <Divider sx={{ mb: 1 }} />

            {[
              {
                icon: <ReportIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />,
                label: 'Report',
                onClick: () => handleAction('report'),
              },
              {
                icon: <BlockIcon fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />,
                label: 'Block',
                onClick: () => handleAction('block'),
              },
              {
                icon: <ClearAllIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />,
                label: 'Clear Chat',
                onClick: () => handleAction('clearChat'),
              },
            ].map((item, index) => (
              <MenuItem key={index} onClick={item.onClick} sx={menuItemStyle}>
                {item.icon}
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Profile Section */}
          <Stack alignItems="center" spacing={1} sx={{ py: 3 }}>
            <Box
              component="img"
              src={partnerSetting.showProfilePic ? (partnerProfile?.profileImage || defaultAvatar) : defaultAvatar}
              alt="Partner Image"
              sx={{
                width: isSm ? 90 : 120,
                height: isSm ? 90 : 120,
                borderRadius: "50%",
                objectFit: "cover",
                mb: 1,
                transition: 'all 0.3s',
                ':hover': {
                  transform: 'scale(2.6)',
                  borderRadius: 1,
                }
              }}
            />
            <Stack textAlign="center">
              <Typography
                variant="h6"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={0.5}
              >
                {partnerProfile?.fullName || "Stranger"}
                {isPartnerVarified && (
                  <CheckCircleIcon sx={{ color: blue[500], fontSize: 22 }} />
                )}
              </Typography>

              <Typography variant="body2" color="gray" gutterBottom>
                {partnerSetting.showLocation ? (location || "Unknown Location") : 'Location hidden'}
              </Typography>
            </Stack>

            {/* Short Bio */}
            {partnerProfile?.shortBio && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  px: 3,
                  textAlign: "center",
                  color: "text.secondary",
                  fontStyle: "italic",
                }}
              >
                {partnerProfile.shortBio}
              </Typography>
            )}
          </Stack>

          <Divider sx={{ bgcolor: theme.palette.divider, height: '4px' }} />

          {/* Notifications */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, py: 1, mx: 1 }}
            onChange={() => handleAction('muteNotification')}
          >
            <Typography variant="body2">Notifications</Typography>
            <Switch defaultChecked />
          </Stack>

          <Divider sx={{ bgcolor: theme.palette.divider, height: '4px' }} />

          {/* Action List */}
          <List>
            <ListItemButton
              sx={{ mx: 1, borderRadius: 1 }}
              onClick={() => handleAction('proposeToPartner')}>
              <ListItemIcon>
                <FavoriteIcon sx={{ color: theme.palette.secondary.main }} />
              </ListItemIcon>
              <ListItemText primary="Propose for Relationship" />
            </ListItemButton>

            <ListItemButton
              sx={{ mx: 1, borderRadius: 1 }}
              onClick={() => handleAction('block')}>
              <ListItemIcon>
                <BlockIcon sx={{ color: "orange" }} />
              </ListItemIcon>
              <ListItemText primary="Block User" />
            </ListItemButton>

            <ListItemButton
              sx={{ mx: 1, borderRadius: 1 }}
              onClick={() => handleAction('deleteChat')}>
              <ListItemIcon>
                <DeleteIcon sx={{ color: "red" }} />
              </ListItemIcon>
              <ListItemText primary="Delete Contact" sx={{ color: "red" }} />
            </ListItemButton>
          </List>
        </Box>
      </Modal>

      <ProposeToPartnerModel
        open={proposeModel}
        onClose={setProposeModel}
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
    </Box>

  );
}

export default PrivatePartnerProfileModel;
