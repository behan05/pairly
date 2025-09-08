import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack
} from '@/MUI/MuiComponents';

import { HelpOutlineIcon, SupportAgentIcon, GavelIcon, BugReportIcon } from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';

import { Link } from 'react-router-dom';

function Help() {
  const helpItems = [
    {
      icon: <HelpOutlineIcon fontSize="medium" sx={{ color: 'info.main' }} />,
      label: 'FAQs (Frequently Asked Questions)',
      path: 'faqs-help'
    },
    {
      icon: <SupportAgentIcon fontSize="medium" sx={{ color: 'success.main' }} />,
      label: 'Contact Support',
      path: 'contact-help'
    },
    {
      icon: <GavelIcon fontSize="medium" sx={{ color: 'warning.main' }} />,
      label: 'Terms & Policies',
      path: 'privacy-policy'
    },
    {
      icon: <BugReportIcon fontSize="medium" sx={{ color: 'error.main' }} />,
      label: 'Report a Problem',
      path: 'report-problem'
    }
  ];

  return (
    <Box component={'section'}>
      {/* Header with arrow back icon */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly/settings'} text={'Help'} />
      </Stack>

      <List>
        {helpItems.map((item, i) => (
          <ListItemButton
            key={i}
            disableGutters
            component={Link}
            to={item.path}
            sx={{
              borderRadius: 1,
              p: 2,
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
      </List>
      <Divider sx={{ my: 3 }} />
    </Box>
  );
}

export default Help;
