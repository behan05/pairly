import React, { useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Divider,
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
  PaymentIcon,
  PersonIcon,
  EmojiEventsIcon,
  MonetizationOnIcon,
  LanguageIcon
} from '@/MUI/MuiIcons';

import { Link, useNavigate } from 'react-router-dom';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import { logout } from '@/redux/slices/auth/authAction';
import { getProfile } from '@/redux/slices/profile/profileAction';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { alpha } from '@mui/material/styles';

function Settings() {
  const [searchValue, setSearchValue] = React.useState('');
  const dispatch = useDispatch();
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
      path: 'profile',
      icon: <PersonIcon sx={{ mr: 1.1, color: 'secondary.main' }} />,
      title: 'Profile',
      subTitle: 'Manage profile, bio, and match preferences'
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
      icon: <PaymentIcon sx={{ mr: 1.1, color: 'success.main' }} />,
      title: 'Payments',
      subTitle: 'Manage subscriptions, invoices, transactions'
    },
    {
      path: 'achievements',
      icon: <EmojiEventsIcon sx={{ mr: 1.1, color: 'secondary.main' }} />,
      title: 'Achievements',
      subTitle: 'View badges and milestones you earned'
    },
    {
      path: 'rewards',
      icon: <MonetizationOnIcon sx={{ mr: 1.1, color: 'warning.main' }} />,
      title: 'Rewards',
      subTitle: 'Coins, referral bonuses, in-app perks'
    },
    {
      path: 'language',
      icon: <LanguageIcon sx={{ mr: 1.1, color: 'info.main' }} />,
      title: 'Language / Region',
      subTitle: 'Change app language and regional settings'
    },
    {
      path: 'help',
      icon: <SosIcon sx={{ mr: 1.1, color: 'error.main' }} />,
      title: 'Help | Support',
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

  return (
    <Box component={'section'}
      sx={{ minWidth: '290px', p: 2 }}>

      {/* Header with arrow back icon */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly'} text={'Settings'} />
      </Stack>

      {/* Search keywords */}
      <Box component={'section'} my={2.5}>
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
                borderRadius: 1.5,
                py: 0.7,
                px: 1.6,
                mb: 0.4,
                alignItems: 'flex-start',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: '36px',
                  color: theme.palette.text.secondary,
                  mt: 0.3,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <Stack spacing={0.2}>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                />
                <ListItemText
                  secondary={item.subTitle}
                  secondaryTypographyProps={{
                    fontSize: '0.78rem',
                    color: theme.palette.text.secondary,
                  }}
                />
              </Stack>
            </ListItemButton>
          ))}

          <Divider sx={{ bgcolor: theme.palette.divider, mt: 2 }} />

          {/* Invite a Friend */}
          <ListItemButton
            onClick={handleShareClick}
            sx={{
              borderRadius: 1.5,
              px: 1.6,
              py: 0.8,
              mt: 2,
              transition: 'all 0.25s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                backgroundColor: alpha(theme.palette.success.main, 0.05),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: '36px' }}>
              <ShareIcon sx={{ mr: 1.1, color: 'success.main' }} />
            </ListItemIcon>
            <ListItemText
              primary="Refer & Earn"
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            />
          </ListItemButton>

          {/* Logout */}
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1.5,
              px: 1.6,
              py: 0.8,
              transition: 'all 0.25s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                backgroundColor: alpha(theme.palette.error.main, 0.05),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: '36px' }}>
              <LogoutIcon sx={{ mr: 1.1, color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: theme.palette.error.main,
              }}
            />
          </ListItemButton>
        </List>
      )}

    </Box>
  );
}

export default Settings;
