import React, { useEffect } from 'react';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme
} from '@/MUI/MuiComponents';
import { alpha } from '@mui/material/styles';
import {
  PersonOutlineIcon,
  FavoriteBorderIcon,
  LocalOfferIcon,
  QueryStatsIcon
} from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';

import { Link } from 'react-router-dom';

import { getProfile } from '@/redux/slices/profile/profileAction';
import { useDispatch } from 'react-redux';

function Profile() {
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  const ProfileItems = [
    {
      icon: <PersonOutlineIcon sx={{ color: 'info.main' }} />,
      label: 'General Info',
      path: 'general-info'
    },
    {
      icon: <FavoriteBorderIcon sx={{ color: 'error.main' }} />,
      label: 'Matching Preferences',
      path: 'matching-preferences'
    },
    {
      icon: <LocalOfferIcon sx={{ color: 'warning.main' }} />,
      label: 'Tags & Interests',
      path: 'interests'
    },
    {
      icon: <QueryStatsIcon sx={{ color: 'success.main' }} />,
      label: 'Completion & Activity',
      path: 'activity'
    }
  ];

  return (
    <Box component={'section'} sx={{ p: 2 }}>
      {/* Header with arrow back icon */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly'} text={'Profile'} />
      </Stack>

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {ProfileItems.map((item, i) => (
          <ListItemButton
            key={i}
            disableGutters
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
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

export default Profile;
