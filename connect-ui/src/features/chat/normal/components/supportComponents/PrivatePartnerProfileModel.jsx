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
  SendIcon,
  MoreVertIcon
} from "@/MUI/MuiIcons";

import { useSelector } from "react-redux";
import { Country, State } from "country-state-city";

function PrivatePartnerProfileModel({ userId, open, onClose }) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [requestingCouple, setRequestingCouple] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const users = useSelector((state) => state.privateChat.allUsers);

  const partnerProfile = useMemo(() => {
    return users.find((u) => u.userId === userId)?.profile || {};
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

  const handleCoupleRequest = () => {
    setRequestingCouple(true);
  };

  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  /**
 * Common menu item styling
 */
  const menuItemStyle = {
    borderRadius: 0.5,
    transition: 'all 0.2s',
    '&:hover': {
      transform: `translateY(-5px)`
    }
  }

  return (
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
          sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`}}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            User Info
          </Typography>

          <Stack direction="row" alignItems="center">
            <IconButton onClick={handleMenuOpen} sx={{ color: "white" }}>
              <MoreVertIcon />
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
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
              icon: <FavoriteIcon fontSize="small" sx={{ mr: 1, color: 'text.primary' }} />,
              label: 'Send Proposal',
              onClick: () => handleAction('proposeToPartner'),
            },
            {
              icon: <CloseIcon fontSize="small" sx={{ mr: 1, color: 'text.primary' }} />,
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
              icon: <ReportIcon fontSize="small" sx={{ mr: 1, color: 'text.primary' }} />,
              label: 'Report',
              onClick: () => handleAction('report'),
            },
            {
              icon: <BlockIcon fontSize="small" sx={{ mr: 1, color: 'text.primary' }} />,
              label: 'Block',
              onClick: () => handleAction('block'),
            },
            {
              icon: <ClearAllIcon fontSize="small" sx={{ mr: 1, color: 'text.primary' }} />,
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

        {/* Profile Section */}
        <Stack alignItems="center" spacing={1} sx={{ py: 3 }}>
          <Box
            component="img"
            src={partnerProfile?.profileImage || defaultAvatar}
            alt="Partner"
            sx={{
              width: isSm ? 90 : 120,
              height: isSm ? 90 : 120,
              borderRadius: "50%",
              objectFit: "cover",
              mb: 1,
            }}
          />
          <Typography variant="h6">{partnerProfile?.fullName || "Stranger"}</Typography>
          <Typography variant="body2" color="gray">
            {location || "Unknown Location"}
          </Typography>
        </Stack>

        <Divider sx={{ bgcolor: theme.palette.divider, height: '4px' }} />

        {/* Notifications */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1 }}
        >
          <Typography variant="body2">Notifications</Typography>
          <Switch defaultChecked />
        </Stack>

        <Divider sx={{ bgcolor: theme.palette.divider, height: '4px' }} />

        {/* Action List */}
        <List>
          <ListItemButton>
            <ListItemIcon>
              <FavoriteIcon sx={{ color: theme.palette.secondary.main }} />
            </ListItemIcon>
            <ListItemText primary="Propose for Relationship" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <BlockIcon sx={{ color: "orange" }} />
            </ListItemIcon>
            <ListItemText primary="Block User" />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <DeleteIcon sx={{ color: "red" }} />
            </ListItemIcon>
            <ListItemText primary="Delete Contact" sx={{ color: "red" }} />
          </ListItemButton>
        </List>
      </Box>
    </Modal>
  );
}

export default PrivatePartnerProfileModel;
