import React, { useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Avatar,
  Divider,
  Tooltip,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme
} from '@/MUI/MuiComponents';
import {
  SearchIcon,
  LockIcon,
  KeyIcon,
  NotificationsIcon,
  SosIcon,
  ChatIcon,
  LogoutIcon,
  ShareIcon,
  BlockIcon,
  StarIcon,
  PaymentIcon
} from '@/MUI/MuiIcons';
import { Link, useNavigate } from 'react-router-dom';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import { logout } from '@/redux/slices/auth/authAction';
import { getProfile } from '@/redux/slices/profile/profileAction';
import { useDispatch, useSelector } from 'react-redux';
import { keyframes } from '@emotion/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toCapitalCase from '@/utils/textFormatting';

function Settings() {
  const [searchValue, setSearchValue] = React.useState('');
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch profile and settings data on component mount
  // This will ensure that the profile and settings data are available when the component renders
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const settingItems = [
    {
      path: 'account',
      icon: <KeyIcon sx={{ mr: 1.1, color: 'warning.main' }} />,
      title: 'Account',
      subTitle: 'Login, security alerts, account details'
    },
    {
      path: 'privacy',
      icon: <LockIcon sx={{ mr: 1.1, color: 'info.main' }} />,
      title: 'Privacy',
      subTitle: 'Blocked users, visibility, data controls'
    },
    {
      path: 'chats',
      icon: <ChatIcon sx={{ mr: 1.1, color: 'success.main' }} />,
      title: 'Chats',
      subTitle: 'Themes, wallpapers, chat preferences'
    },
    {
      path: 'notifications',
      icon: <NotificationsIcon sx={{ mr: 1.1, color: 'primary.main' }} />,
      title: 'Notifications',
      subTitle: 'Message alerts, sound, vibration'
    },
    {
      path: 'blocked-users',
      icon: <BlockIcon sx={{ color: theme.palette.error.main }} />,
      title: 'Blocked',
      subTitle: 'Manage blocked users'
    },
    {
      path: 'premium',
      icon: <StarIcon sx={{ mr: 1.1, color: 'warning.main' }} />,
      title: 'Premium',
      subTitle: 'Upgrade plan, pricing, exclusive features'
    },
    {
      path: 'payments',
      icon: <PaymentIcon sx={{ mr: 1.1, color: 'success.main' }} />, // or another icon you prefer
      title: 'Payments',
      subTitle: 'Manage subscriptions, invoices, transactions'
    },
    {
      path: 'help',
      icon: <SosIcon sx={{ mr: 1.1, color: 'error.main' }} />,
      title: 'Help',
      subTitle: 'FAQs, contact support, policies'
    }
  ];

  let filterSettings = settingItems.filter((setting) => setting.path.includes(searchValue));

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

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
      navigator.share(shareData);
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
    <Box component={'section'}
      sx={{ minWidth: '290px', p: 2 }}>

      {/* Header with arrow back icon */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly'} text={'Settings'} />
      </Stack>
      {/* Search keywords */}
      <Box component={'section'} mt={1}>
        <TextField
          size="small"
          fullWidth
          placeholder={'Search settings...'}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
          }}
        />
      </Box>

      {/* Profile avatar */}
      <Stack
        component={Link}
        to={'/pairly/profile/general-info'}
        my={4}
        flexDirection={'row'}
        gap={2}
      >
        <Stack background={'red'} alignItems={'center'} justifyContent={'center'}>
          <Tooltip title="Profile">
            <Avatar
              src={profileData?.profileImage}
              alt="user profile image"
              aria-level="user profile image"
              sx={{
                width: 100,
                height: 100
              }}
            />
          </Tooltip>
        </Stack>

        <Stack justifyContent="center">
          <Typography variant="body1" color={'text.primary'}>
            {toCapitalCase(profileData?.fullName)} ({profileData?.age})
          </Typography>
          <Stack direction="row" alignItems={'center'} gap={1}>
            <Typography variant="body2" letterSpacing={1} color={'success.main'}>
              Online
            </Typography>
            <Stack
              sx={{
                background: 'green',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                boxShadow: theme.shadows[8],
                transition: 'all 0.3s ease',
                animation: `${glowDot} 1.5s infinite ease-in-out`
              }}
            />
          </Stack>
          <Typography variant="body2" color={'text.secondary'}>
            {shortBioPreview || 'Empty Bio (Please add bio.)'}
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ bgcolor: theme.palette.divider }} />

      {/* Setting items */}

      {filterSettings.length === 0 ? (
        <Typography
          variant="body2"
          sx={{
            width: '100%',
            fontWeight: 600,
            letterSpacing: 0.5,
            mt: 8,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '1rem',
            lineHeight: 1.6,
          }}
        >
          Hmm… nothing here. Try searching differently.
        </Typography>

      ) : (
        <List>
          {filterSettings.map((item, i) => (
            <ListItemButton
              key={i}
              aria-level={item.title}
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Stack>
                <ListItemText primary={item.title} sx={{ m: 0 }} />
                <ListItemText secondary={item.subTitle} sx={{ m: 0 }} />
              </Stack>
            </ListItemButton>
          ))}

          <Divider sx={{ bgcolor: theme.palette.divider, mt: 2 }} />
          <ListItemButton
            onClick={handleShareClick}
            sx={{
              borderRadius: 1,
              px: 2,
              mt: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <ListItemIcon>
              <ShareIcon sx={{ mr: 1.1, color: 'success.main' }} />
            </ListItemIcon>
            <ListItemText primary="Invite a Friend" />
          </ListItemButton>

          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              px: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ mr: 1.1, color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </List>
      )}

    </Box>
  );
}

export default Settings;
