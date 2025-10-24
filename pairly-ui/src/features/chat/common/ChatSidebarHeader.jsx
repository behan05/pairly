import React, { useEffect } from 'react';
import {
  Box,
  MenuItem,
  IconButton,
  Button,
  Stack,
  Tooltip,
  Divider,
  useTheme,
  Avatar,
  Badge,
  useMediaQuery,
  Drawer,
  Typography,
  TextField
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
  SearchIcon
} from '@/MUI/MuiIcons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/auth/authAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { keyframes } from '@emotion/react';
import toCapitalCase from '@/utils/textFormatting';

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
  const { plan, status } = useSelector((state) => state?.auth?.user?.subscription);
  const isFreeUser = status === 'active' && plan === 'free';

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

  // split bio
  const userBio = profileData?.shortBio.split(' ');

  // Get the first 6 words only for settings profile bio
  const shortBioPreview = userBio?.slice(0, 6).join(' ');

  // glow animation
  const glowDot = keyframes`
    0% {
      box-shadow: 0 0 0px 0px rgba(0, 255, 0, 0.51);
    }
    50% {
      box-shadow: 0 0 5px 1px rgba(0, 255, 0, 0.4);
    }
    100% {
      box-shadow: 0 0 0px 0px rgba(0, 255, 0, 0.44);
    }
  `;

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

      {/* Drawer Menu */}

      <Drawer
        open={isMenuOpen}
        onClose={() => setMenuAnchorEl(null)}
        variant="temporary"
        ModalProps={{ keepMounted: false }}
        PaperProps={{
          sx: {
            background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            boxShadow: theme.shadows[6],
            minWidth: 280,
            p: '0px 10px',
            overflow: 'hidden',
          },
        }}
      >

        {/* Profile avatar */}
        <Stack
          component={Link}
          to="/pairly/profile/general-info"
          direction="row"
          alignItems="center"
          gap={2.5}
          sx={{
            my: 2,
            p: 1.5,
            borderRadius: 1,
            position: 'relative',
            background: `linear-gradient(135deg, ${theme.palette.background.paper}ff, ${theme.palette.primary.main}04)`,
            boxShadow: `0 4px 20px ${theme.palette.primary.main}22`,
            textDecoration: 'none',
            transition: 'boxShadow 0.3s ease',
            '&:hover': { boxShadow: `inset 0 4px 20px ${theme.palette.primary.main}22`, },
          }}
        >
          {/* Avatar with glow ring */}
          <Box
            sx={{
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: -3,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
                filter: 'blur(4px)',
                opacity: 0.6,
              },
            }}
          >
            <Avatar
              src={profileData?.profileImage || defaultAvatar}
              alt="user"
              sx={{
                width: 78,
                height: 78,
                border: `2px solid ${theme.palette.background.paper}`,
              }}
            />
          </Box>

          {/* User Info */}
          <Stack spacing={0.6} zIndex={1}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
              sx={{ letterSpacing: 0.4 }}
            >
              {toCapitalCase(profileData?.fullName)} ({profileData?.age})
            </Typography>

            <Stack direction="row" alignItems="center" gap={0.7}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'linear-gradient(90deg, limegreen, #00ff99)',
                  animation: `${glowDot} 1.5s infinite ease-in-out`,
                }}
              />
              <Typography variant="body2" color="success.main">
                Online
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontStyle: 'italic',
                maxWidth: 210,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {shortBioPreview || 'Add your bio to personalize your profile'}
            </Typography>

            {/* Plan Badge */}
            <Stack
              direction="row"
              alignItems="center"
              gap={0.6}
              sx={{
                mt: 0.4,
                alignSelf: 'flex-start',
                px: 1.2,
                py: 0.4,
                borderRadius: 999,
                background:
                  plan === 'free'
                    ? `${theme.palette.grey[800]}55`
                    : `linear-gradient(90deg, #ffb300, #ff9800)`,
                boxShadow:
                  plan !== 'free'
                    ? `0 0 10px ${theme.palette.warning.main}66`
                    : `0 0 4px ${theme.palette.divider}`,
              }}
            >
              <StarIcon
                sx={{
                  fontSize: 18,
                  color: plan === 'free' ? theme.palette.text.secondary : '#fff',
                }}
              />
              <Typography
                variant="caption"
                color={plan === 'free' ? 'text.secondary' : '#fff'}
                fontWeight={600}
              >
                {toCapitalCase(plan)} Plan
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Find User by userId */}
        <Box component={'section'} mt={1}>
          <TextField
            size="small"
            fullWidth
            placeholder={'Search userId...'}
            value={''}
            onChange={''}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: `${theme.palette.background.paper}aa`,
                transition: 'all 0.3s ease',
                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
              },
            }}
          />
        </Box>
        <Divider sx={{ bgcolor: theme.palette.divider, height: 2 }} />

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
              mt: 0.5,
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

        <Divider sx={{ my: 0.5, height: 2 }} />

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

        <Stack
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: 320,
          }}
        >
          {isFreeUser ? (
            // --- Shiny Upgrade Button for Free Users ---
            <Button
              component={Link}
              to="/pairly/settings/premium"
              startIcon={<StarIcon sx={{ fontSize: 20 }} />}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                height: 52,
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: 0.4,
                color: '#fff',
                textTransform: 'none',
                background: `linear-gradient(135deg, #7a5af8, #df71ff)`,
                boxShadow: '0 0 18px rgba(122, 90, 248, 0.4)',
                transition: 'all 0.35s ease',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 0 25px rgba(223, 113, 255, 0.6)',
                  background: `linear-gradient(135deg, #8b6bff, #e782ff)`,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-75%',
                  width: '50%',
                  height: '100%',
                  background:
                    'linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent)',
                  transform: 'skewX(-20deg)',
                  animation: 'shine 2.8s infinite ease-in-out',
                },
                '@keyframes shine': {
                  '0%': { left: '-75%' },
                  '60%': { left: '125%' },
                  '100%': { left: '125%' },
                },
              }}
            >
              Level Up Your Chat
            </Button>
          ) : (
            // --- Premium Users: Compact Badge or Info Strip ---
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              gap={1}
              sx={{
                py: 1.3,
                borderRadius: 3,
                background: `linear-gradient(90deg, #ffb300, #ff9800)`,
                color: '#fff',
                boxShadow: '0 0 18px rgba(255, 193, 7, 0.4)',
              }}
            >
              <StarIcon sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textShadow: '0 0 5px rgba(0,0,0,0.2)' }}
              >
                You’re enjoying Premium Features ✨
              </Typography>
            </Stack>
          )}
        </Stack>

      </Drawer>
    </Box>
  );
};

export default ChatSidebarHeader;
