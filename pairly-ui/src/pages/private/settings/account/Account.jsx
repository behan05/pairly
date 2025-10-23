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
import { LockResetIcon, InfoIcon, DeleteForeverIcon, InfoOutlinedIcon } from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import { Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';

function Account() {
  const theme = useTheme();
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
              borderRadius: 1.5,
              py: 0.7, // reduced vertical padding
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

        <ListItemButton
          component={Link}
          to={'delete-account'}
          sx={{
            borderRadius: 1.5,
            py: 0.7, // reduced vertical padding
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
          <ListItemIcon>{<DeleteForeverIcon sx={{ mr: 1.1, color: 'error.main' }} />}</ListItemIcon>
          <ListItemText primary="Delete my account" sx={{ color: 'error.main' }} />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

export default Account;
