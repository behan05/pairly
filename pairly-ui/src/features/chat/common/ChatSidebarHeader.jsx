import React, { useEffect } from 'react';
import {
  Box,
  Menu,
  MenuItem,
  IconButton,
  Stack,
  Tooltip,
  Divider,
  useTheme,
  Avatar,
  Badge,
  useMediaQuery
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
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/auth/authAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// friend request selector
import { fetchFriendRequests } from '@/redux/slices/randomChat/friendRequestAction';
import { getProfile } from '@/redux/slices/profile/profileAction';
import { pendingFriendRequestCount } from '@/redux/slices/randomChat/friendRequestSlice'
import { getChatSettings } from '@/redux/slices/settings/settingsAction';
import { getSettingsNotification } from '@/redux/slices/settings/settingsAction';
import { getSettingsPrivacy } from '@/redux/slices/settings/settingsAction';

const ChatSidebarHeader = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.profile);

  const pendingCount = useSelector(pendingFriendRequestCount);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  // Fetch initial settings | Preferences data
  useEffect(() => {
    dispatch(getProfile());
    dispatch(fetchFriendRequests());
    dispatch(getChatSettings());
    dispatch(getSettingsNotification());
    dispatch(getSettingsPrivacy());
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

  const currentUrlPath = location.pathname;

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
          background: theme.palette.background.paper,
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
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }
    });
    setTimeout(() => navigate('/login', { replace: true }), 1000);
  };

  return (
    <Box
      pt={1}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        backgroundColor: 'background.paper',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
    >

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {/* Logo */}
        <Link to={'/pairly'}>
          <Stack
            component={'img'}
            src={'/logo.png'}
            alt="Pairly logo"
            aria-label="Pairly logo"
            maxWidth={isSm ? 48 : 55}
            sx={{
              filter: 'brightness(120%) drop-shadow(0 4px 2px',
            }}
          />
        </Link>

        {/* Action Icons */}
        <Stack
          direction="row"
          alignItems="center"
          gap={3.5}
        >
          {navItems.map(({ path, icon, label }) => {
            if (path === currentUrlPath) return;

            return (
              <Tooltip key={label} title={label} arrow >
                <IconButton component={NavLink} to={path}
                  sx={{
                    transition: 'all 0.3s linear',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}>
                  {icon}
                </IconButton>
              </Tooltip>
            )
          })}

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
