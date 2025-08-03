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
  Avatar
} from '@/MUI/MuiComponents';
import {
  FavoriteBorderIcon,
  PersonIcon,
  LogoutIcon,
  HelpOutlineIcon,
  SettingsIcon,
  BlockIcon,
  ChatIcon,
  ShareIcon
} from '@/MUI/MuiIcons';
import { NavLink, useNavigate } from 'react-router-dom';
import StyledText from '@/components/common/StyledText';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/auth/authAction';
import { getProfile } from '@/redux/slices/profile/profileAction';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatSidebarHeader = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.profile);
  const theme = useTheme();

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const navItems = [
    {
      path: '/connect/chat',
      icon: <ChatIcon sx={{ color: theme.palette.text.primary }} />,
      label: 'Chat'
    },
    {
      path: '/connect/favorites',
      icon: <FavoriteBorderIcon sx={{ color: theme.palette.warning.main }} />,
      label: 'Favorites'
    },
    {
      path: '/connect/blocked',
      icon: <BlockIcon sx={{ color: theme.palette.error.main }} />,
      label: 'Blocked Users'
    }
  ];

  const handleShareClick = () => {
    const shareData = {
      title: 'Connect App',
      text: `Join me on Connect! 
                   Create your profile 
                   and get matched with real people for 
                   anonymous, safe, and meaningful conversations
                   worldwide.`,
      url: `${window.location.origin}/connect`
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => {
        console.error('Share failed:', error);
      });
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleLogout = async () => {
    dispatch(logout());
    toast.success('You have been logged out 😔');
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
      <ToastContainer position="top-center" autoClose={1000} theme="colored" />

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={700}>
          <StyledText text={'Connect'} />
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
              src={profileData?.profileImage}
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
        transformOrigin={{ vertical: 'right', horizontal: 'right' }}
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
            to: '/connect/profile',
            icon: <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
          },
          {
            label: 'Settings',
            to: '/connect/settings',
            icon: (
              <SettingsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
            )
          },
          {
            label: 'Help',
            to: '/connect/settings/help',
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
