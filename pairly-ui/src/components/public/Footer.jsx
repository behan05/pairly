import {
  Box,
  Typography,
  Stack,
  Divider,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  IconButton,
  Toolbar
} from '@mui/material';

import {
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  FacebookIcon,
} from '../../MUI/MuiIcons';
import { Link as RouterLink } from 'react-router-dom';
import logo from '@/assets/logo/logo.png';
import StyledText from '../common/StyledText';

function Footer() {

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const socialLinks = [
    { icon: <FacebookIcon fontSize="small" />, color: '#1877F2', to: '#' },
    { icon: <InstagramIcon fontSize="small" />, color: '#E4405F', to: '#' },
    { icon: <TwitterIcon fontSize="small" />, color: '#1DA1F2', to: '#' },
    { icon: <LinkedInIcon fontSize="small" />, color: '#0077B5', to: '#' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        px: { xs: 2, sm: 4, md: 12 },
        py: 4,
        bgcolor: 'transparent',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Divider sx={{ my: 4 }} />

      {/* Top section */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        spacing={4}
      >
        {/* Logo and description */}
        <Stack
          spacing={2}
          alignItems={{ xs: 'center', md: 'flex-start' }}
          textAlign={{ xs: 'center', md: 'left' }}
          sx={{ maxWidth: 360 }}
        >
          <Box
            component="img"
            src={logo}
            alt="Pairly Logo"
            sx={{
              height: { xs: 40, md: 52 },
              userSelect: 'none',
              filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.1))',
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            lineHeight={1.6}
            sx={{ fontSize: { xs: '0.85rem', md: '0.9rem' } }}
          >
            <StyledText text={'Pairly'} /> is a real-time random chat platform built for global
            connections, meaningful conversations, and privacy-first experiences.
          </Typography>
        </Stack>

        {/* Important links */}
        <Stack
          direction="row"
          columnGap={4}
          rowGap={2}
          flexWrap="wrap"
          justifyContent={isSm ? 'space-evenly' : 'flex-start'}
        >

          {/* Explore */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              Explore
            </Typography>
            {[
              { label: 'Home', to: '/' },
              { label: 'Features', to: '/features' },
              { label: 'About Us', to: '/about' },
            ].map((link) => (
              <MuiLink
                key={link.label}
                component={RouterLink}
                to={link.to}
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.8rem' }}
              >
                {link.label}
              </MuiLink>
            ))}
          </Stack>

          {/* Support */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              Support
            </Typography>
            {[
              { label: 'FAQs', to: '/faq' },
              { label: 'Report Issue', to: '/report' },
              { label: 'Contact Us', to: '/contact' },
            ].map((link) => (
              <MuiLink
                key={link.label}
                component={RouterLink}
                to={link.to}
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.8rem' }}
              >
                {link.label}
              </MuiLink>
            ))}
          </Stack>

          {/* Community */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              Community
            </Typography>
            {[
              { label: 'Blog', to: '/blog' },
              { label: 'Press', to: '/press' },
              { label: 'Next Gen Chat', to: '/nextgenerationchat' },
            ].map((link) => (
              <MuiLink
                key={link.label}
                component={RouterLink}
                to={link.to}
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.8rem' }}
              >
                {link.label}
              </MuiLink>
            ))}
          </Stack>

          {/* Legal */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              Legal
            </Typography>
            {[
              { label: 'Privacy Policy', to: '/privacy-policy' },
              { label: 'Terms of Use', to: '/terms-of-use' },
              { label: 'Playbook', to: '/playbook' },
              { label: 'Cookies Policy', to: '/cookies-policy' },
            ].map((link) => (
              <MuiLink
                key={link.label}
                component={RouterLink}
                to={link.to}
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.8rem' }}
              >
                {link.label}
              </MuiLink>
            ))}
          </Stack>
        </Stack>

      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Bottom section */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        textAlign="center"
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Pairly. All rights reserved.
        </Typography>

        <Stack direction="row" gap={1}>
          {socialLinks.map((link, i) => (
            <MuiLink
              key={i}
              href={link.to}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <IconButton
                sx={{
                  color: link.color,
                  transition: 'transform 0.2s, opacity 0.2s',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    opacity: 0.8,
                  },
                }}
              >
                {link.icon}
              </IconButton>
            </MuiLink>
          ))}
        </Stack>

      </Stack>
    </Box>
  );
}

export default Footer;
