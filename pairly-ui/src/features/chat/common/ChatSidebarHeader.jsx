import React, { useEffect } from 'react';
import {
  Box,
  Menu,
  MenuItem,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Divider,
  useTheme,
  Avatar,
  Badge
} from '@/MUI/MuiComponents';
import {
  PersonAddIcon,
  PersonIcon,
  LogoutIcon,
  HelpOutlineIcon,
  SettingsIcon,
  BlockIcon,
  ChatIcon,
  ShareIcon,
  ShuffleIcon,
  defaultAvatar
} from '@/MUI/MuiIcons';
import { NavLink, useNavigate } from 'react-router-dom';
import StyledText from '@/components/common/StyledText';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/auth/authAction';
import { getProfile } from '@/redux/slices/profile/profileAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// friend request selector
import { fetchFriendRequests } from '@/redux/slices/randomChat/friendRequestAction';
import { pendingFriendRequestCount } from '@/redux/slices/randomChat/friendRequestSlice'

const ChatSidebarHeader = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.profile);

  const pendingCount = useSelector(pendingFriendRequestCount);
  const theme = useTheme();

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  useEffect(() => {
    dispatch(getProfile());
    dispatch(fetchFriendRequests());
  }, [dispatch]);

  const navItems = [
    {
      path: '/pairly',
      icon: <ShuffleIcon sx={{ color: theme.palette.info.main }} />,
      label: 'Random Chat'
    },
    {
      path: '/pairly/chat',
      icon: (
        <ChatIcon sx={{ color: theme.palette.text.primary }} />
      ),
      label: 'Private Chat'
    },
    {
      path: '/pairly/friend-requests',
      icon: (
        <Badge badgeContent={pendingCount} color="error" invisible={pendingCount === 0}>
          <PersonAddIcon sx={{ color: theme.palette.success.main }} />
        </Badge>
      ),
      label: 'Friend Requests'
    },
    {
      path: '/pairly/blocked-users',
      icon: <BlockIcon sx={{ color: theme.palette.error.main }} />,
      label: 'Blocked Users'
    }
  ];

  const handleShareClick = () => {
    const shareData = {
      title: 'Pairly App',
      text: `Join me on Pairly! 
                   Create your profile 
                   and get matched with real people for 
                   anonymous, safe, and meaningful conversations
                   worldwide.`,
      url: `${window.location.origin}/pairly`
    };

    if (navigator.share) {
      navigator.share(shareData).catch((_) => {
      });
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success('Link copied to clipboard!', {
        style: {
          backdropFilter: 'blur(14px)',
          background: theme.palette.divider,
          color: theme.palette.text.primary,
        }
      });
    }
  };
  const firstWord = profileData?.fullName?.split(' ')[0];

  const handleLogout = async () => {
    dispatch(logout());
    toast.success(`We'll miss you ${firstWord} 😔`, {
      style: {
        backdropFilter: 'blur(14px)',
        background: theme.palette.divider,
        color: theme.palette.text.primary,
      }
    });
    setTimeout(() => navigate('/login', { replace: true }), 1000);
  };

  return (
    <Box
      py={1}
      px={1}
      bgcolor="background.papar"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        backgroundColor: 'transparent',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
    >

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={700}>
          <StyledText text={'Pairly'} />
        </Typography>

        {/* Action Icons */}
        <Stack direction="row" alignItems="center" gap={2}>
          {navItems.map(({ path, icon, label }) => (
            <Tooltip key={label} title={label} arrow>
              <IconButton component={NavLink} to={path}>
                {icon}
              </IconButton>
            </Tooltip>
          ))}
          <Tooltip title="Menu" arrow>
            <Avatar
              src={profileData?.profileImage || defaultAvatar}
              alt="user profile with dropdown menu"
              onClick={(e) => setMenuAnchorEl(e.currentTarget)}
              sx={{
                width: 40,
                height: 40,
                transition: 'all 0.3s linear',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.1)'
                },
                '& img': {
                  objectFit: 'cover',
                  imageRendering: 'auto'
                }
              }}
            />
          </Tooltip>
        </Stack>
      </Stack>

      {/* Search Bar if needed */}
      {children}

      {/* Dropdown Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            background: `${theme.palette.background.paper}`,
            boxShadow: theme.shadows[6],
            border: `1px solid ${theme.palette.success.main}`,
            borderRadius: 1,
            minWidth: 200,
            mt: 1,
            px: 1,
            py: 0.75,
            overflow: 'hidden'
          }
        }}
      >
        {/* Menu Items */}
        {[
          {
            label: 'Profile',
            to: '/pairly/profile',
            icon: <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
          },
          {
            label: 'Settings',
            to: '/pairly/settings',
            icon: (
              <SettingsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
            )
          },
          {
            label: 'Help',
            to: '/pairly/settings/help',
            icon: (
              <HelpOutlineIcon fontSize="small" sx={{ mr: 1, color: theme.palette.warning.main }} />
            )
          },
          {
            label: 'Invite a Friend',
            onClick: handleShareClick,
            icon: <ShareIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
          }
        ].map(({ label, to, onClick, icon }) => (
          <MenuItem
            key={label}
            component={NavLink}
            to={to}
            onClick={() => {
              if (onClick) onClick();
              setMenuAnchorEl(null);
            }}
            sx={{
              borderRadius: 1,
              px: 1.5,
              py: 1,
              mb: 0.5,
              transition: 'all 0.2s',
              '&:hover': {
                transform: `translateY(-5px)`
              }
            }}
          >
            {icon}
            {label}
          </MenuItem>
        ))}

        <Divider sx={{ my: 0.5 }} />

        {/* Logout Item */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            px: 1.5,
            py: 1,
            transition: 'all 0.2s',
            color: theme.palette.error.main,
            '&:hover': {
              transform: `translateY(-5px)`
            }
          }}
        >
          <LogoutIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} />
          Logout
        </MenuItem>
      </Menu>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default ChatSidebarHeader;
