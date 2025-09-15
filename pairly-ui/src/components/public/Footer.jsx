import { Box, Typography, Stack, Divider, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import logo from '@/assets/logo/logo.png';
import StyledText from '../common/StyledText';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        px: { xs: 3, sm: 6, md: 12 },
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
        >
          <Box component="img" src={logo} alt="Pairly Logo" sx={{ height: 48, userSelect: 'none' }} />
          <Typography variant="body2" color="text.secondary" maxWidth={320}>
            {<StyledText text={'Pairly'} />} is a real-time random chat platform built for global
            connections, meaningful conversations, and privacy-first experiences.
          </Typography>
        </Stack>

        {/* Important links */}
        <Stack direction="row" spacing={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              {<StyledText text={'Explore'} />}
            </Typography>
            <MuiLink component={RouterLink} to="/" underline="hover" color="text.secondary">
              Home
            </MuiLink>
            <MuiLink component={RouterLink} to="/about" underline="hover" color="text.secondary">
              About
            </MuiLink>
            <MuiLink component={RouterLink} to="/features" underline="hover" color="text.secondary">
              Features
            </MuiLink>
            <MuiLink component={RouterLink} to="/contact" underline="hover" color="text.secondary">
              Contact
            </MuiLink>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              {<StyledText text={'Support'} />}
            </Typography>
            <MuiLink component={RouterLink} to="faq" underline="hover" color="text.secondary">
              FAQs
            </MuiLink>
            <MuiLink
              component={RouterLink}
              to="privacy-policy"
              underline="hover"
              color="text.secondary"
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              component={RouterLink}
              to="terms-of-use"
              underline="hover"
              color="text.secondary"
            >
              Terms of Use
            </MuiLink>
            <MuiLink component={RouterLink} to="report" underline="hover" color="text.secondary">
              Report Issue
            </MuiLink>
          </Stack>
        </Stack>
      </Stack>

      {/* Divider */}
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

        <Typography variant="caption" color="text.secondary">
          Built with ❤️ by{' '}
          <MuiLink
            href="https://behan-portfolio.vercel.app"
            target="_blank"
            rel="noopener"
            underline="none"
            sx={{ fontWeight: 600 }}
          >
            <StyledText text="Behan" />
          </MuiLink>
        </Typography>
      </Stack>
    </Box>
  );
}

export default Footer;
