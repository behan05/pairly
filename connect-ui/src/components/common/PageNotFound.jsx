import { useEffect } from 'react';
import { Box, Typography, Button, Container, useTheme } from '@/MUI/MuiComponents';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

// PageNotFound component displays a styled 404 error page with animation and a redirect button.
const PageNotFound = ({ redirectTo }) => {
  const theme = useTheme();

  // Set the document title when the component mounts
  useEffect(() => {
    document.title = 'PAGE NOT FOUND';
  }, []);

  // Animate the title, text, and button using GSAP when the component mounts
  useEffect(() => {
    gsap.fromTo(
      '.notfound-title',
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.notfound-text',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo(
      '.notfound-btn',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.4 }
    );
  }, []);

  return (
    <Box
      sx={{
        height: '70vh', // Set height of the container
        display: 'flex', // Use flexbox for layout
        flexDirection: 'column', // Stack children vertically
        alignItems: 'center', // Center children horizontally
        justifyContent: 'center', // Center children vertically
        backdropFilter: 'blur(14px)', // Apply blur effect to background
        color: 'text.primary', // Set text color
        textAlign: 'center', // Center text
        borderRadius: 2, // Rounded corners
        boxShadow: `inset 0 10px 1rem ${theme.palette.text.secondary}` // Inner shadow
      }}
    >
      <Container>
        {/* 404 Title */}
        <Typography
          variant="h1"
          component="h2"
          className="notfound-title"
          sx={{ fontWeight: 'bold', fontSize: { xs: '4rem', md: '5rem' } }}
        >
          404
        </Typography>
        {/* Subtitle */}
        <Typography variant="h4" className="notfound-text" sx={{ fontStyle: 'italic', mb: 3 }}>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        {/* Description */}
        <Typography variant="body1" className="notfound-text" sx={{ mb: 4 }}>
          Sorry, we couldn't find the page you're looking for. Maybe the URL is incorrect, or the
          page has been moved.
        </Typography>
        {/* Redirect Button */}
        <Link to={redirectTo} style={{ textDecoration: 'none' }}>
          <Button
            variant="outlined"
            color="primary"
            className="notfound-btn"
            sx={{
              px: 4,
              py: 2,
              mt: 2,
              fontSize: '1.2rem',
              borderRadius: '50px',
              boxShadow: 'inset 0 4px 8px',
              color: 'text.secondary',
              letterSpacing: 2,
              '&:hover': {
                boxShadow: 'inset 0 6px 12px'
              }
            }}
          >
            Go Back Home
          </Button>
        </Link>
      </Container>
    </Box>
  );
};

export default PageNotFound;
