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
  ChatIcon,
  ShareIcon,
  ShuffleIcon,
  defaultAvatar,
  StarIcon,
  MarkunreadIcon,
  DraftsIcon,
} from '@/MUI/MuiIcons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/auth/authAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// friend request selector
import { getProfile } from '@/redux/slices/profile/profileAction';
import { pendingFriendRequestCount } from '@/redux/slices/randomChat/friendRequestSlice'
import { getChatSettings } from '@/redux/slices/settings/settingsAction';
import { getSettingsNotification } from '@/redux/slices/settings/settingsAction';
import { getSettingsPrivacy } from '@/redux/slices/settings/settingsAction';

import { totalNumberOfUnreadMessages } from '@/redux/slices/privateChat/privateChatSlice';

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
    dispatch(getChatSettings());
    dispatch(getSettingsNotification());
    dispatch(getSettingsPrivacy());
  }, [dispatch]);

  const hasNewAlert = 0 > 0;
  // const unreadTotal = useSelector(totalNumberOfUnreadMessages);

  const navItems = [
    {
      path: '/pairly',
      icon: <ShuffleIcon sx={{ color: theme.palette.info.main }} />,
      label: 'Random Chat'
    },
    {
      path: '/pairly/chat',
      icon: (
        // <Badge badgeContent={unreadTotal} color="error" invisible={unreadTotal === 0}>
        <ChatIcon sx={{ color: theme.palette.text.primary }} />
        // </Badge>
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
      path: '/pairly/alerts',
      icon: hasNewAlert ? (
        <MarkunreadIcon sx={{ color: theme.palette.warning.main }} />
      ) : (
        <DraftsIcon sx={{ color: theme.palette.text.disabled }} />
      ),
      label: 'Alert Messages',
    },
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
              filter: `brightness(120%) `,
            }}
          />
        </Link>

        {/* Action Icons */}
        <Stack
          direction="row"
          alignItems="center"
          gap={isSm ? 2 : 3.5}
        >
          {navItems.map(({ path, icon, label }) => {

            return (
              <Tooltip key={label} title={label} arrow>
                <IconButton
                  component={NavLink}
                  to={path}
                  end={path === '/pairly'}
                  sx={{
                    transition: 'all 0.4s ease',
                    borderRadius: '50%',
                    backdropFilter: 'blur(8px)',
                    background: `${theme.palette.background.paper}44`,
                    boxShadow: `0 0 4px ${theme.palette.primary.main}22`,
                    '&:hover': {
                      transform: 'scale(1.15)',
                      background: `linear-gradient(135deg, 
        ${theme.palette.primary.light}55, 
        ${theme.palette.background.paper}99)`,
                      boxShadow: `0 0 12px ${theme.palette.primary.main}66`,
                    },
                    '&.active': {
                      background: `linear-gradient(135deg, 
        ${theme.palette.primary.main}88, 
        ${theme.palette.secondary.main}55)`,
                      boxShadow: `0 0 12px ${theme.palette.primary.main}99`,
                    },
                  }}
                >
                  {React.cloneElement(icon, {
                    sx: {
                      fontSize: 24,
                      transition: 'color 0.3s ease',
                      color: theme.palette.text.primary,
                      '&:hover': { color: theme.palette.primary.main },
                    },
                  })}
                </IconButton>

              </Tooltip>
            );
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
            background: `linear-gradient(130deg,
             ${theme.palette.primary.dark} 0%, 
            ${theme.palette.background.paper} 30%,
             ${theme.palette.background.paper} 100%)`,
            boxShadow: theme.shadows[6],
            borderRadius: 1,
            minWidth: 200,
            mt: 1,
            p: '0px 10px',
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
            label: 'Help | Support',
            to: '/pairly/settings/help',
            icon: (
              <HelpOutlineIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.dark }} />
            )
          },
          {
            label: 'Upgrade plan',
            to: '/pairly/settings/premium',
            icon: (
              <StarIcon fontSize="small" sx={{ mr: 1, color: theme.palette.warning.main }} />
            )
          },
          {
            label: 'Invite a Friend',
            onClick: handleShareClick,
            icon: <ShareIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
          },
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
              borderRadius: 0.5,
              p: '8px 10px',
              transition: 'all 0.3s ease-out',
              color: 'text.secondary',
              '&:hover': {
                transform: `translate(1px, -1px) scale(0.99)`,
                filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})`
              },
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
            borderRadius: 0.5,
            p: '8px 10px',
            color: 'error.main',
            transition: 'all 0.3s ease-out',
            '&:hover': {
              transform: `translate(1px, -1px) scale(0.99)`,
              filter: `drop-shadow(0 20px 1rem ${theme.palette.error.main})`
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
