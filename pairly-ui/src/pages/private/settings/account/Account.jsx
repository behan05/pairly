import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack
} from '@/MUI/MuiComponents';
import { LockResetIcon, InfoIcon, DeleteForeverIcon, InfoOutlinedIcon } from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';

import { Link } from 'react-router-dom';

function Account() {
  const accountItems = [
    {
      icon: <LockResetIcon fontSize="medium" sx={{ color: 'warning.main' }} />,
      label: 'Change Email / Password',
      path: 'change-credentials'
    },
    {
      icon: <InfoIcon fontSize="medium" sx={{ color: 'info.main' }} />,
      label: 'Request account info',
      path: 'request-info'
    },
    {
      icon: <InfoOutlinedIcon fontSize="medium" sx={{ color: 'error.main' }} />,
      label: 'How to delete my data',
      path: 'data-deletion'
    },
  ];

  return (
    <Box component={'section'}>
      {/* Header with arrow back icon */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly/settings'} text={'Account'} />
      </Stack>

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {accountItems.map((item, i) => (
          <ListItemButton
            key={i}
            disableGutters
            component={Link}
            to={item.path}
            sx={{
              p: 2,
              borderRadius: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        <ListItemButton
          component={Link}
          to={'delete-account'}
          sx={{
            borderRadius: 1,
            p: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}
        >
          <ListItemIcon>{<DeleteForeverIcon sx={{ mr: 1.1, color: 'error.main' }} />}</ListItemIcon>
          <ListItemText primary="Deactivate my account" sx={{ color: 'error.main' }} />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

export default Account;
