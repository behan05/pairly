import React from 'react';
import { Button, useTheme } from '@/MUI/MuiComponents';
import { Link } from 'react-router-dom';

function StyledButton({ icon, variant = 'outlined', type, text, redirectUrl, ...props }) {
  const theme = useTheme();

  return (
    <Button
      component={Link}
      to={redirectUrl}
      startIcon={icon}
      type={type}
      variant={variant}
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 1, sm: 1 },
        background: 'transparent',
        backdropFilter: 'blur(14px)',
        border: 'none',
        borderTopRightRadius: '6px',
        borderBottomRightRadius: '6px',
        borderBottom: `1px dotted ${theme.palette.success.main}`,
        textTransform: 'none',
        color: 'primary.contrastText',
        letterSpacing: 0.2,
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)'
        }
      }}
      {...props}
    >
      {text}
    </Button>
  );
}

export default StyledButton;
