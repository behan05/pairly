import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  MenuItem,
} from '../../MUI/MuiComponents';
import {
  HelpOutlineIcon,
  CloseIcon,
  MenuIcon,
  MonetizationOnIcon,
} from '../../MUI/MuiIcons';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeIcon from '@mui/icons-material/Home';
import { Link, NavLink } from 'react-router-dom';

const StandupNavbar = ({ onCreateEvent, onViewEarnings, onViewTerms }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerToggle = () => setOpenDrawer(!openDrawer);

  const navItems = [
    { label: 'Home', icon: <HomeIcon />, action: null, to: '/pairly' },
    { label: 'Create Event', icon: <AddCircleOutlineIcon />, action: onCreateEvent, to: '/pairly/virtual-standup-hall/create-event' },
    { label: 'My Earnings', icon: <MonetizationOnIcon />, action: onViewEarnings, to: '/pairly/virtual-standup-hall/my-earnings' },
    { label: 'T&C', icon: <GavelIcon />, action: onViewTerms, to: '/pairly/virtual-standup-hall/terms-of-use' },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={4}
        sx={{
          top: 0,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Stack flexGrow={1}>
            <Link to={'/pairly'}>
              <Stack
                component={'img'}
                src={'/logo.png'}
                alt="Pairly logo"
                maxWidth={isSm ? 48 : 55}
                sx={{ filter: 'brightness(120%)', cursor: 'pointer' }}
              />
            </Link>
          </Stack>

          {/* Desktop Buttons */}
          {!isSm && (
            <Stack direction="row" alignItems="center" >
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  startIcon={item.icon}
                  color="inherit"
                  component={item.to ? Link : 'button'}
                  to={item.to}
                  onClick={item.action || null}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}

          {/* Mobile Menu Button */}
          {isSm && (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              {openDrawer ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        open={openDrawer}
        onClose={handleDrawerToggle}
        variant="temporary"
        ModalProps={{ keepMounted: false }}
        PaperProps={{
          sx: {
            background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            boxShadow: theme.shadows[6],
            minWidth: 260,
            p: '0px 10px',
            overflow: 'hidden',
          },
        }}
      >
        {/* Menu Items */}
        {[
          { label: 'Home', to: '/pairly', icon: <HomeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} /> },
          { label: 'Create Event', to: '/pairly/virtual-standup-hall/create-event', icon: <AddCircleOutlineIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} /> },
          { label: 'My Earnings', to: '/pairly/virtual-standup-hall/my-earnings', icon: <MonetizationOnIcon fontSize="small" sx={{ mr: 1, color: theme.palette.warning.main }} /> },
          { label: 'T&C', to: '/pairly/virtual-standup-hall/terms-of-use', icon: <GavelIcon fontSize="small" sx={{ mr: 1, color: theme.palette.warning.main }} /> },
          { label: 'Help | Support', to: '/pairly/settings/help', icon: <HelpOutlineIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.dark }} /> },
        ].map(({ label, to, onClick, icon }) => (

          <MenuItem
            key={label}
            component={NavLink}
            to={to}
            onClick={() => { if (onClick) onClick(); setMenuAnchorEl(null); }}
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
      </Drawer>
    </>
  );
};

export default StandupNavbar;
