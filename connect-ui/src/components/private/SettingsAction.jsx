import React from 'react';
import { Box, Tooltip, IconButton } from '@/MUI/MuiComponents';
import { SettingsIcon } from '@/MUI/MuiIcons';
import { Link } from 'react-router-dom';

{
  /* Floating Settings icon at bottom of sidebar */
}
function SettingsAction() {
  return (
    <Box
      sx={{
        p: 1.5,
        position: 'sticky',
        bottom: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 'fit-content',
        ml: '82%'
      }}
    >
      <Tooltip title="Settings">
        <IconButton
          component={Link}
          to="/pairly/settings"
          sx={{
            boxShadow: 3,
            '&:hover .rotate-icon': {
              transform: 'rotate(230deg)',
              transition: 'transform 0.4s ease-in-out'
            }
          }}
        >
          <SettingsIcon className="rotate-icon" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default SettingsAction;
