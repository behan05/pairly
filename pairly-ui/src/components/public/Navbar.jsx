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
  Menu,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from '../../MUI/MuiComponents';
import {
  MenuIcon,
  LockOpenIcon,
  LockIcon,
  CloseIcon,
  KeyboardArrowDownIcon,
  XIcon,
  InstagramIcon,
  LinkedInIcon,
  FacebookIcon,
  KeyboardArrowUpIcon,
} from '@/MUI/MuiIcons';
import { Link } from 'react-router-dom';
import BgToggle from './BgToggle';
import { useState, useLayoutEffect, useRef } from 'react';
import StyledActionButton from '@/components/common/StyledActionButton';
import StyledButton from '@/components/common/StyledButton';

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const navListBtn = [
  { path: '/login', text: 'Login', icon: <LockOpenIcon sx={{ color: 'text.disabled' }} /> },
  { path: '/register', text: 'Create Account', icon: <LockIcon sx={{ color: 'text.disabled' }} /> },
];

const centerNav = [
  { path: '/about', text: 'About Us' },
  { path: '/features', text: 'Features' },
  { path: '/pricing', text: 'Pricing' },
  { text: 'Community', hasDropdown: true },
  { path: '/contact', text: 'Support' },
];

function Navbar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isXl = useMediaQuery(theme.breakpoints.down('xl'));
  const custome = useMediaQuery('(max-width:1019px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleSubMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const navRef = useRef(null);
  const subMenuRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

      tl.from(".nav-logo", { y: -40, opacity: 0 })
        .from(".nav-link", { y: -30, opacity: 0, stagger: 0.1 }, "-=0.3")
        .from(".nav-action", { y: -30, opacity: 0, stagger: 0.15 }, "-=0.4");

      // Submenu animation (whenever it opens)
      gsap.fromTo(
        subMenuRef.current?.querySelectorAll(".submenu-item"),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.1,
          scrollTrigger: {
            trigger: subMenuRef.current,
            start: "top 90%",
          },
        }
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <AppBar
      ref={navRef}
      position="sticky"
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
        <Stack className="nav-logo" component={Link} to="/" sx={{ textDecoration: 'none' }}>
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
                className="nav-link"
                key={index}
                component={Link}
                onMouseEnter={item?.hasDropdown ? (e) => handleSubMenu(e) : null}
                to={item?.path}
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
                <Typography
                  sx={{
                    fontSize: '0.9rem',
                    color: theme.palette.text.primary,
                  }}>
                  {item.text}
                </Typography>
                {item.hasDropdown
                  ? open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" sx={{ color: theme.palette.divider }} />
                  : null}
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
            <Stack component={'span'} className="nav-action">
              <BgToggle />
            </Stack>
            {navListBtn.map((cta, i) => (
              <Typography
                className="nav-action"
                component={Link}
                to={cta?.path}
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
                {cta?.text}
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
                to={item?.path}
                onClick={toggleDrawer(false)}
                onMouseEnter={item?.hasDropdown ? (e) => handleSubMenu(e) : null}
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
                <ListItemText primary={item?.text} />
                {item?.hasDropdown
                  ? open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" sx={{ color: theme.palette.divider }} />
                  : null}
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

      {/* === Sub Menu (Community Dropdown) === */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        ref={subMenuRef}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            background: `${theme.palette.background.default}`,
            borderRadius: 1,
            border: `1px dashed ${theme.palette.divider}`,
            minWidth: 260,
            mt: 1.5,
            p: 2,
            overflow: 'hidden',
            backdropFilter: 'blur(8px)',
          },
        }}
      >
        <Stack
          className="submenu-item"
          direction="column"
          spacing={2}
          sx={{
            px: 1,
          }}
        >
          {/* Info Section */}
          <Stack spacing={1}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              Stay Connected
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.9rem',
                mb: 1,
              }}
            >
              Read the latest Pairly updates and stories.
            </Typography>

            <Stack direction="row" spacing={1}>
              <StyledButton
                className="submenu-item"
                text="Press"
                redirectUrl="/press"
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                }}
              />
              <StyledActionButton
                className="submenu-item"
                text="Blog"
                redirectUrl="/blog"
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                }}
              />
            </Stack>
          </Stack>

          <Divider sx={{ my: 1 }} className="submenu-item" />

          {/* Social Icons Section */}
          <Stack
            className="submenu-item"
            direction="row"
            spacing={1.5}
            justifyContent="center"
            alignItems="center"
          >
            {[
              { label: 'Instagram', icon: <InstagramIcon />, href: 'https://www.instagram.com/pairlychat/' },
              { label: 'X (formerly Twitter)', icon: <XIcon />, href: 'https://x.com/Pairlychat' },
              { label: 'LinkedIn', icon: <LinkedInIcon />, href: 'https://www.linkedin.com/company/pairlychat' },
              { label: 'Facebook', icon: <FacebookIcon />, href: 'https://www.facebook.com/profile.php?id=61583490932857' },
            ].map((item, i) => (
              <Tooltip key={i} title={item.label}>
                <IconButton
                  component="a"
                  href={item?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: theme.palette.text.secondary,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {item?.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Stack>
        </Stack>
      </Menu>
    </AppBar>
  );
}

export default Navbar;
