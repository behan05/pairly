import {
  AppBar,
  Box,
  Toolbar,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider
} from '../../MUI/MuiComponents';
import {
  MenuIcon,
  LockOpenIcon,
  LockIcon,
  CloseIcon,
  KeyboardArrowDownIcon
} from '@/MUI/MuiIcons';
import { Link } from 'react-router-dom';
import BgToggle from './BgToggle';
import { useState } from 'react';
import StyledActionButton from '@/components/common/StyledActionButton';
import StyledButton from '@/components/common/StyledButton';

const navListBtn = [
  { path: '/login', text: 'Login', icon: <LockOpenIcon sx={{ color: 'text.disabled' }} /> },
  { path: '/register', text: 'Create Account', icon: <LockIcon sx={{ color: 'text.disabled' }} /> },
];

const centerNav = [
  { path: '/about', text: 'About Us' },
  { path: '/features', text: 'Features', hasDropdown: true },
  { path: '/pricing', text: 'Pricing', hasDropdown: true },
  { path: '/community', text: 'Community', hasDropdown: true },
  { path: '/contact', text: 'Support', hasDropdown: true },
];

function Navbar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isXl = useMediaQuery(theme.breakpoints.down('xl'));
  const custome = useMediaQuery('(max-width:1019px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        userSelect: 'none',
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '20%',
        py: 0.5,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          wordBreak: 'keep-all',
          whiteSpace: 'nowrap',
        }}
      >
        {/* === Left: Logo === */}
        <Stack component={Link} to="/" sx={{ textDecoration: 'none' }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Pairly logo"
            maxWidth={isSm ? 48 : 55}
            sx={{ filter: 'brightness(120%) drop-shadow(0 4px 2px rgba(0,0,0,0.2))' }}
          />
        </Stack>

        {/* === Center Nav (hidden on mobile) === */}
        {!custome && (
          <Stack direction="row" spacing={1} alignItems="center">
            {centerNav.map((item, index) => (
              <Stack
                key={index}
                component={Link}
                to={item.path}
                direction={'row'}
                alignItems={'center'}
                gap={0.5}
                sx={{
                  borderRadius: 0.4,
                  p: '4px 1rem',
                  '&:hover': {
                    background: `${theme.palette.primary.dark}20`
                  },
                }}
              >
                <Typography sx={{
                  fontSize: '0.9rem',
                  color: theme.palette.text.primary,
                }}>{item.text}</Typography>
                {/* {item.hasDropdown ? <KeyboardArrowDownIcon fontSize="small" sx={{ color: theme.palette.divider }} /> : null} */}
              </Stack>
            ))}
          </Stack>
        )}

        {/* === Right: Buttons / Drawer Toggle === */}
        {custome ? (
          <Stack direction="row" gap={1}>
            <BgToggle />
            <Tooltip title="Menu">
              <IconButton onClick={toggleDrawer(true)}>
                <MenuIcon fontSize='small' sx={{ color: `${theme.palette.text.primary}50` }} />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <BgToggle />
            {navListBtn.map((cta, i) => (
              <Typography
                component={Link}
                to={cta.path}
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 900,
                  fontSize: '1rem',
                  p: '4px 8px',
                  borderRadius: 0.4,
                  textTransform: 'none',
                  color: theme.palette.text.primary,
                  '&:hover': {
                    background: `${theme.palette.primary.dark}20`
                  },
                }}
              >
                {cta.text}
              </Typography>
            ))}
          </Box>
        )}
      </Toolbar>

      {/* === Drawer for mobile === */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            maxWidth: '100%',
            background: theme.palette.background.default,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* === Drawer Header === */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Box
            component="img"
            src="/logo.png"
            alt="Pairly logo"
            maxWidth={40}
            sx={{ filter: 'brightness(120%)' }}
          />
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {/* === Drawer Body: fills remaining height === */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* === Top Nav Section === */}
          <Stack>
            {centerNav.map((item, index) => (
              <ListItemButton
                key={index}
                component={Link}
                to={item.path}
                onClick={toggleDrawer(false)}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 900,
                  fontSize: '1rem',
                  p: '4px 8px',
                  borderRadius: 0.4,
                  textTransform: 'none',
                  color: theme.palette.text.primary,
                  '&:hover': {
                    background: `${theme.palette.primary.dark}20`
                  },
                }}
              >
                <ListItemText primary={item.text} />
                {/* {item.hasDropdown && <KeyboardArrowDownIcon fontSize="small" />} */}
              </ListItemButton>
            ))}
          </Stack>

          {/* === Bottom Auth Buttons Section === */}
          <Stack sx={{ mt: 'auto', pt: 2 }}>
            <Divider sx={{ border: `1px solid ${theme.palette.divider}` }} />
            <Stack direction="row" mt={2} gap={1}>
              {navListBtn.map((item, index) =>
                item.text === 'Login' ? (
                  <StyledButton
                    key={index + 'auth'}
                    onClick={toggleDrawer(false)}
                    text={item.text}
                    redirectUrl={item.path}
                    sx={{
                      fontSize: '1em',
                      fontWeight: 600,
                      py: 1.2,
                    }}
                  />
                ) : (
                  <StyledActionButton
                    flex={1}
                    key={index + 'auth'}
                    onClick={toggleDrawer(false)}
                    text={item.text}
                    redirectUrl={item.path}
                    sx={{
                      fontSize: '1em',
                      fontWeight: 600,
                      py: 1.2,
                      textShadow: '0 0 2px #000',
                    }}
                  />
                )
              )}
            </Stack>
          </Stack>
        </Box>
      </Drawer>

    </AppBar>
  );
}

export default Navbar;
