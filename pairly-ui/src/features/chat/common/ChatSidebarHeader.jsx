import React, { useEffect, useState } from 'react';
import {
  Box,
  MenuItem,
  IconButton,
  InputAdornment,
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
  SearchIcon,
  SendIcon
} from '@/MUI/MuiIcons';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

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
import { toggleTheme } from '@/redux/slices/theme/themeSlice';

import { totalNumberOfUnreadMessages } from '@/redux/slices/privateChat/privateChatSlice';
import UserSuggestionBox from '@/pages/feedback/UserSuggestionBox';
import { USERS_API } from "@/api/config";
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders'
import { socket } from '@/services/socket';

const ChatSidebarHeader = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state?.profile);
  const { publicId } = useSelector((state) => state.auth?.user);
  const { plan, status } = useSelector((state) => state?.auth?.user?.subscription);
  const hasPremiumAccess = plan !== 'free' && status === 'active';
  const isFreeUser = !hasPremiumAccess;

  const pendingCount = useSelector(pendingFriendRequestCount);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isCustomXs = useMediaQuery('(max-width:411px)');

  const [openUserSuggestionBox, setOpenUserSuggestionBox] = useState(false)

  const [themeMode, setThemeMode] = React.useState(
    localStorage.getItem('theme') || 'dark'
  );

  const [copied, setCopied] = React.useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const [userId, setUserId] = React.useState('');
  const [isRequestSent, setIsRequestSent] = React.useState(false);
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchError, setSearchError] = useState("");

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
    // {
    //   path: '/pairly/virtual-standup-hall',
    //   icon: <TheaterComedyIcon  sx={{ color: theme.palette.secondary.main }} />,
    //   label: 'Virtual Comedy Hall'
    // },
    {
      path: '/pairly/friend-requests',
      icon: (
        <Badge badgeContent={pendingCount} color="error" invisible={pendingCount === 0}>
          <PersonAddIcon sx={{ color: theme.palette.success.main }} />
        </Badge>
      ),
      label: 'Friend Requests'
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

  const handleUserSuggestionClick = () => {
    setOpenUserSuggestionBox(true);
  }

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
      box-shadow: 0 0 0px 0px ${theme.palette.success.main}aa;
    }
    50% {
      box-shadow: 0 0 5px 1px ${theme.palette.success.main}bb;
    }
    100% {
      box-shadow: 0 0 0px 0px ${theme.palette.success.main}cc;
    }
  `;

  const handleChange = (e) => {
    const value = e.target.value;

    if (!value.trim()) {
      setSearchError('');
      setSearchedUser(null);
      setUserId('');
    }

    setUserId(value);
  };

  const handlePublicUserId = async () => {
    if (!userId.trim()) {
      setSearchedUser(null);
      setSearchError("");
      return;
    }

    try {
      const response = await axios.get(
        `${USERS_API}/publicId/${userId}`,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setSearchedUser(response.data.user);
        setSearchError("");
      } else {
        setSearchedUser(null);
        setSearchError("User not found");
      }
    } catch (error) {
      setSearchedUser(null);
      setSearchError(error?.response?.data?.error || "User not found");
    }
  };

  // toggle Theme Mode
  const toggleThemeMode = () => {
    dispatch(toggleTheme());

    if (themeMode === 'light') {
      setThemeMode('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setThemeMode('light');
      localStorage.setItem('theme', 'light');
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(publicId);
    setCopied(true);
  };

  useEffect(() => {
    const resetSetCopied = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(resetSetCopied);
  }, [copied]);

  const handleFriendRequest = (partnerUserId) => {
    socket.emit('friendRequest:directly', partnerUserId);
    setIsRequestSent(true)
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
          gap={isSm ? 1 : 3.5}
        >
          {navItems.map(({ path, icon, label }) => {

            return (
              <Tooltip key={label} title={label} arrow>
                <IconButton
                  component={NavLink}
                  to={path}
                  end={path === '/pairly'}
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 0.8,
                    transition: 'background 0.3s ease, box-shadow 0.3s ease',
                    backdropFilter: 'blur(6px)',
                    background: `${theme.palette.background.paper}66`,
                    boxShadow: `0 0 4px ${theme.palette.primary.main}22`,
                    '&:hover': {
                      background: `linear-gradient(135deg,
          ${theme.palette.primary.light}55,
          ${theme.palette.background.paper}99)`,
                      boxShadow: `0 0 8px ${theme.palette.primary.main}55`,
                    },
                    '&.active': {
                      background: `linear-gradient(135deg,
          ${theme.palette.primary.main}88,
          ${theme.palette.secondary.main}55)`,
                      boxShadow: `0 0 10px ${theme.palette.primary.main}99`,
                    },
                  }}
                >
                  {React.cloneElement(icon, {
                    sx: {
                      fontSize: 22, // fixed font size
                      color: theme.palette.text.primary,
                      transition: 'color 0.3s ease',
                      ...(icon.props.sx || {}),
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
                borderRadius: 0.8,
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

      <Divider sx={{ mt: 1 }} />

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
            background: theme.palette.background.default,
            boxShadow: theme.shadows[12],
            minWidth: 260,
            maxWidth: 300,
            p: '0px 10px',
            overflow: 'auto',
          },
        }}
      >
        {/* Profile Card */}
        <Stack
          direction='column'
          alignItems="center"
          spacing={1.5}
          sx={{
            my: 1.5,
            p: isCustomXs ? 1 : 2,
            borderRadius: 1,
            position: 'relative',
            background: theme.palette.background.paper,
            border: `1px dashed ${theme.palette.divider}`,
            boxShadow: `0 2px 10px ${theme.palette.primary.main}20`,
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Theme Toggle */}
          <Tooltip title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <IconButton
              onClick={toggleThemeMode}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 30,
                height: 30,
                bgcolor: 'background.paper',
                boxShadow: 2,
                zIndex: 2,
              }}
            >
              {themeMode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Avatar */}
          <Box
            component={Link}
            to="/pairly/profile/general-info"
            sx={{
              position: 'relative',
              mx: isCustomXs ? 'auto' : 0,
              border: `2px solid ${theme.palette.primary.dark}`,
              p: 0.2,
              overflow: 'hidden',
              borderRadius: '50%',
              '&::after':
              {
                content: '""',
                position: 'absolute',
                borderRadius: '50%',
                filter: 'blur(6px)',
                opacity: 0.5,
                zIndex: 0,
              }
            }}
          >
            <Avatar
              src={profileData?.profileImage || defaultAvatar}
              alt={profileData?.fullName}
              sx={{
                width: isCustomXs ? 72 : 80,
                height: isCustomXs ? 72 : 80,
                zIndex: 1,
                position: 'relative',
                transition: 'transform .2s',
                "&:hover": {
                  transform: 'scale(1.1)'
                },

              }}
            />
          </Box>

          {/* User Info */}
          <Stack
            spacing={0.2}
            zIndex={1}
            sx={{
              textAlign: 'center',
              width: '100%'
            }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="text.primary"
              sx={{
                letterSpacing: 0.5
              }}>
              {profileData?.fullName?.toUpperCase()}
            </Typography>

            {/* ID + Copy */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={'center'}
              spacing={0.5}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontStyle: 'italic',
                  letterSpacing: 0.3
                }}>
                Public ID: {publicId || 'N/A'}
              </Typography>
              <Tooltip title={copied ? 'User ID copied!' : 'Copy User ID'} arrow>
                <IconButton
                  onClick={handleCopy}
                  size="small"
                  sx={{ p: 0.4 }}
                >
                  {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Online Status */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              justifyContent={'center'}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'linear-gradient(90deg, limegreen, #00ff99)',
                  animation: `${glowDot} 1.5s infinite ease-in-out`
                }} />
              <Typography variant="body2" color="success.main">Online</Typography>
            </Stack>

            {/* Bio */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontStyle: 'italic',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
              {shortBioPreview || 'Add your bio to personalize your profile'}
            </Typography>

            {/* Plan Badge */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                mt: 0.6,
                px: 1.4,
                py: 0.5,
                borderRadius: 999,
                alignSelf: 'center',
                background:
                  plan === 'free'
                    ? `${theme.palette.grey[700]}44`
                    : status === 'active'
                      ? `linear-gradient(90deg, #ffb300, #ff9800)`
                      : `${theme.palette.grey[700]}44`,
                boxShadow:
                  plan !== 'free'
                    ? `0 0 2px ${status === 'active' ? theme.palette.warning.main : theme.palette.grey[600]
                    }66`
                    : `0 0 2px ${theme.palette.divider}`,
              }}
            >
              <StarIcon sx={{ fontSize: 18, color: plan === 'free' ? theme.palette.text.secondary : '#fff' }} />
              <Typography variant="caption" fontWeight={600} color={plan === 'free' ? 'text.secondary' : '#fff'}>
                {status === 'active' ? `${toCapitalCase(plan)} Plan` : `${toCapitalCase(plan)} (Pending)`}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Search by User ID */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2
          }}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="Search by user ID"
            value={userId}
            name="userId"
            onChange={handleChange}
            autoComplete="off"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px 0 0 10px',
                background: `${theme.palette.background.paper}`,
                transition: "all .3s ease",
                "&:hover fieldset":
                {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
              }
            }}
          />

          <IconButton
            onClick={handlePublicUserId}
            sx={{
              height: 40,
              width: 40,
              borderRadius: '0 10px 10px 0',
              border: `1px dashed ${theme.palette.divider}`,
              background: theme.palette.background.paper,
              transition: "all .25s ease",
              "&:hover": {
                background: theme.palette.background.paper,
                border: `1px dashed ${theme.palette.success.dark}`,
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <SearchIcon
              sx={{
                color: theme.palette.success.main,
                fontSize: 22,
              }}
            />
          </IconButton>
        </Box>


        <Divider sx={{
          bgcolor: theme.palette.divider,
          height: 2
        }} />

        {searchError && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              textAlign: "center",
              color: theme.palette.error.main,
              backgroundColor: theme.palette.error.light + "22",
              border: `1px solid ${theme.palette.error.main}44`,
              display: "inline-block",
              px: 1.5,
              py: 0.6,
              borderRadius: 1.5,
              fontWeight: 500,
            }}
          >
            {searchError}
          </Typography>
        )}

        {searchedUser && (
          <Box sx={{ py: 0.5 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                p: 0.5,
                borderRadius: 1,
                background: theme.palette.background.default,
                border: `1px dashed ${theme.palette.divider}`,
                boxShadow: `0 2px 10px ${theme.palette.primary.main}30`,
              }}
            >
              <Stack direction="row" gap={0.5} alignItems="center" flex={1}>
                <Avatar
                  src={searchedUser?.profileImage || defaultAvatar}
                  alt={searchedUser?.fullName}
                  sx={{
                    width: 36,
                    height: 36,
                    border: `1px solid ${theme.palette.divider}`,
                    p: 0.1,
                  }}
                />
                <Stack>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {toCapitalCase(searchedUser?.fullName)}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Public ID: {searchedUser?.publicId}
                  </Typography>
                </Stack>
              </Stack>

              <Tooltip title={isRequestSent ? "Request Sent" : "Add Friend"}>
                <IconButton
                  onClick={() =>
                    !isRequestSent && handleFriendRequest(searchedUser?.searchUserId)
                  }
                  sx={{
                    border: !isRequestSent
                      ? `1px solid ${theme.palette.success.main}`
                      : `1px solid ${theme.palette.divider}`,
                    background: theme.palette.background.paper,
                    transition: "all .2s",
                    "&:hover": { transform: "scale(1.08)" },
                  }}
                >
                  <PersonAddIcon
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: "medium",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        )}

        {!searchError && !searchedUser && (
          <>
            {/* Menu Items */}
            {[
              { label: 'Profile', to: '/pairly/profile', icon: <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} /> },
              { label: 'Settings', to: '/pairly/settings', icon: <SettingsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} /> },
              {
                to: '/pairly/alerts',
                icon: (
                  <Tooltip title={hasNewAlert ? 'You have new alerts' : 'No new alerts'}>
                    {hasNewAlert ? (
                      <MarkunreadIcon fontSize="small" sx={{ color: theme.palette.warning.main, mr: 1 }} />
                    ) : (
                      <DraftsIcon fontSize="small" sx={{ color: theme.palette.text.disabled, mr: 1 }} />
                    )}
                  </Tooltip>
                ),
                label: 'Alert Messages',
              },
              { label: 'Help | Support', to: '/pairly/settings/help', icon: <HelpOutlineIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.dark }} /> },
              { label: 'Upgrade plan', to: '/pairly/settings/premium', icon: <StarIcon fontSize="small" sx={{ mr: 1, color: theme.palette.warning.main }} /> },
              { label: 'Refer & Earn', onClick: handleShareClick, icon: <ShareIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} /> },
              { label: 'Your Suggestions', onClick: handleUserSuggestionClick, icon: <TipsAndUpdatesIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} /> },
            ].map(({ label, to, onClick, icon }) => (
              <MenuItem
                key={label}
                component={NavLink}
                to={to}
                onClick={() => {
                  if (label === "Your Suggestions" && (onClick)) {
                    onClick();
                    return;
                  }
                  else if (onClick) onClick(); setMenuAnchorEl(null);
                }}
                sx={{
                  borderRadius: 0.5,
                  p: '8px 10px',
                  mt: 0.5,
                  transition: 'all 0.3s ease-out',
                  color: 'text.secondary',
                  '&:hover': { transform: `translate(1px, -1px) scale(0.99)`, filter: `drop-shadow(0 20px 1rem ${theme.palette.primary.main})` },
                }}
              >
                {icon}{label}
              </MenuItem>
            ))}

            <Divider sx={{ my: 0.5, height: 2 }} />

            {/* Logout */}
            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: 0.5,
                p: '8px 10px',
                color: 'error.main',
                transition: 'all 0.3s ease-out',
                '&:hover': { transform: `translate(1px, -1px) scale(0.99)`, filter: `drop-shadow(0 20px 1rem ${theme.palette.error.main})` },
              }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} />
              Logout
            </MenuItem>
          </>
        )}
        <UserSuggestionBox
          open={openUserSuggestionBox}
          onClose={() => setOpenUserSuggestionBox(false)}
        />
      </Drawer>
    </Box>
  );
};

export default ChatSidebarHeader;
