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
  Avatar,
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

import { deleteConversationMessage, clearConversationMessage, fetchAllUser } from '@/redux/slices/privateChat/privateChatAction';
import { useDispatch, useSelector } from 'react-redux'
import { Country, State } from "country-state-city";
import ProposeToPartnerModel from '../createProposal/ProposeToPartnerModel';
import ReportUserModal from '../supportComponents/ReportUserModal';
import BlockUserModal from '../supportComponents/BlockUsermodal'
import ActionConfirm from '@/components/private/actionConfirmation/ActionConfirm';

function PrivatePartnerProfileModel(
  { userId, open, onClose,
    onCloseChatWindow,
    clearActiveChat
  }
) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  // Local State
  const [proposeModel, setProposeModel] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openClearModal, setOpenClearModal] = useState(false);

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
    setOpenDeleteModal(true);
  };
  /** Handle Clear Message */
  const handleClearChatLog = async () => {
    if (!activeChat) return;
    setOpenClearModal(true);
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
        handleBlockPartner()
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
      filter: `drop-shadow(0 0 0.5px ${theme.palette.primary.main})`
    },
  };

  return (
    <Box>
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          px: isSm ? 1 : 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{
          overflowY: 'auto',
          maxHeight: '90vh',
          width: isSm ? '80%' : 380,
          mx: 'auto',
          borderRadius: 1,
          p: 0,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}>

          <Box
            sx={{
              background: `linear-gradient(180deg,
      ${theme.palette.background.paper},
      ${theme.palette.info.dark}10)`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              px={2}
              py={0.5}
              borderBottom={`1px solid ${theme.palette.divider}`}
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
              {[
                // {
                //   icon: <FavoriteIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />,
                //   label: 'Create Proposal',
                //   onClick: () => handleAction('proposeToPartner'),
                // },
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

              {/* <Divider sx={{ mb: 1 }} /> */}

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
            <Stack alignItems="center" spacing={1} sx={{ py: 2 }}>
              <Avatar
                src={
                  partnerSetting.showProfilePic
                    ? (partnerProfile?.profileImage || defaultAvatar)
                    : defaultAvatar
                }
                sx={{
                  width: isSm ? 88 : 110,
                  height: isSm ? 88 : 110,
                  borderRadius: '50%',
                  boxShadow: `0 4px 14px ${theme.palette.common.black}20`,
                  backgroundColor: theme.palette.background.paper,
                }}
              />

              <Stack alignItems="center" spacing={0.3}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="text.primary"
                >
                  {partnerProfile?.fullName || 'Stranger'}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {partnerSetting.showLocation
                    ? (location || 'Unknown Location')
                    : 'Location hidden'}
                </Typography>
              </Stack>

              {partnerProfile?.shortBio && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    px: 3,
                    textAlign: 'center',
                    color: 'text.secondary',
                    lineHeight: 1.5,
                  }}
                >
                  {partnerProfile.shortBio}
                </Typography>
              )}
            </Stack>

            <Divider sx={{ bgcolor: theme.palette.divider }} />

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

            {/* Action List */}
            <List
              disablePadding
              sx={{
                py: 0.5,
              }}
            >
              {/* <ListItemButton
              sx={{ mx: 1, borderRadius: 1 }}
              onClick={() => handleAction('proposeToPartner')}>
              <ListItemIcon>
                <FavoriteIcon sx={{ color: theme.palette.secondary.main }} />
              </ListItemIcon>
              <ListItemText primary="Propose for Relationship" />
            </ListItemButton> */}

              <ListItemButton
                sx={{
                  mx: 1,
                  px: 1.5,
                  py: 0.9,
                  borderRadius: 1,
                  color: theme.palette.text.primary,
                  transition: 'background-color 120ms ease',

                  '&:hover': {
                    backgroundColor: theme.palette.warning.light + '20',
                  },
                }}
                onClick={() => handleAction('block')}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <BlockIcon sx={{ color: theme.palette.warning.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Block User"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>

              <ListItemButton
                sx={{
                  mx: 1,
                  px: 1.5,
                  py: 0.9,
                  borderRadius: 1,
                  color: theme.palette.error.main,
                  transition: 'background-color 120ms ease',

                  '&:hover': {
                    backgroundColor: theme.palette.error.light + '18',
                  },
                }}
                onClick={() => handleAction('deleteChat')}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <DeleteIcon sx={{ color: theme.palette.error.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Delete Contact"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>

            </List>
          </Box>
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

  );
}

export default PrivatePartnerProfileModel;
