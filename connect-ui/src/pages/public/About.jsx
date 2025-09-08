import React from 'react';
import { Box, Typography, Stack, useTheme } from '@/MUI/MuiComponents';
import VerifiedIcon from '@mui/icons-material/Verified';

// Assets
import about1 from '@/assets/images/about1.jpg';
import about2 from '@/assets/images/about2.jpg';
import about3 from '@/assets/images/about3.jpg';
import chatBrand1 from '@/assets/images/trustedStartup1.png';
import chatBrand2 from '@/assets/images/trustedStartup2.png';
import chatBrand3 from '@/assets/images/trustedStartup3.png';
import chattingVideo from '@/assets/videos/chattingVideo.mp4';

// Components
import StyledText from '@/components/common/StyledText';
import Contact from './Contact';
import { InfoOutlinedIcon } from '@/MUI/MuiIcons';

function About() {
  const theme = useTheme();

  React.useEffect(() => {
    document.title = 'Pairly - About';
  }, []);

  // Partner logos with descriptions
  const brandCard = [
    {
      brandLogo: chatBrand1,
      brandName: 'Chatly',
      content: `Partnered with us to test real-time algorithms in real-world environments.`
    },
    {
      brandLogo: chatBrand2,
      brandName: 'StreamConnect',
      content: `Integrated our secure video and chat SDKs for ultra-low latency connections.`
    },
    {
      brandLogo: chatBrand3,
      brandName: 'SocialLink',
      content: `Collaborated to explore AI-based interest matching and safety filters.`
    }
  ];

  // Reusable styles
  const labelNumStyle = {
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bgcolor: theme.palette.background.paper,
    borderRadius: 3,
    borderRight: 5,
    transition: `all 0.2s`,
    '&:hover': {
      borderRight: 0
    }
  };

  const imgSx = {
    width: '100%',
    maxWidth: 500,
    borderRadius: 1,
    objectFit: 'cover',
    filter: 'brightness(90%)',
    transition: '0.3s',
    p: 0.09,
    borderBottom: `1px dotted ${theme.palette.text.secondary}`,
    '&:hover': { filter: 'saturate(120%)' }
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 8 } }}>
      {/* SECTION: Intro Heading - Top Left */}
      <Stack>
        <Typography
          variant="h5"
          fontWeight={600}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          gap={1}
          gutterBottom
        >
          <InfoOutlinedIcon size="medium" sx={{ color: theme.palette.success.main }} />
          WHAT IS <StyledText text="Pairly" />?
        </Typography>

        <Typography variant="body2" color="text.secondary" maxWidth={700}>
          Pairly is a modern real-time video and text chat platform designed for meaningful and
          instant human interactions. Whether you're looking to meet new people, learn languages, or
          simply enjoy a conversation, we make it simple and secure.
        </Typography>
      </Stack>

      {/* SECTION: Video and Tagline */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'column', lg: 'row' },
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 4, md: 8 },
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 6 },
          width: '100%',
          minHeight: { xs: 'auto', md: '60vh' }
        }}
      >
        {/* Left Video */}
        <Box
          component="video"
          src={chattingVideo}
          loading="lazy"
          autoPlay
          muted
          loop
          aria-label="about section video"
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 500, md: 600 },
            borderRadius: 2,
            objectFit: 'cover',
            borderBottom: `1px dotted ${theme.palette.text.secondary}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              filter: 'brightness(120%) saturate(120%)'
            }
          }}
        />

        {/* Right Content */}
        <Stack
          flex={1}
          justifyContent="center"
          spacing={2}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 500 },
            textAlign: { xs: 'center', lg: 'left' }
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            color="text.primary"
            lineHeight={1.4}
            letterSpacing={0.8}
          >
            Real <StyledText text="People" />.<br />
            Real <StyledText text="Conversations" />.<br />
            In Just <StyledText text="One Click" />.
          </Typography>

          <Typography variant="subtitle1" color="text.primary" sx={{ letterSpacing: 0.5 }}>
            <b>Pairly</b> lets you instantly start random video chats with people around the world
            — no sign-up, no waiting, just genuine human connection.
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
            <StyledText text="❝" /> With Pairly, I made friends globally and had conversations that
            truly mattered. It’s fast, fun, and feels safe. <StyledText text="❝" />
          </Typography>
        </Stack>
      </Box>

      {/* SECTION: Why Choose Us - Centered Text */}
      <Stack spacing={3} alignItems="center" textAlign="center" mt={6}>
        <Typography
          variant="h5"
          fontWeight={600}
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          <InfoOutlinedIcon size="medium" sx={{ color: theme.palette.info.main }} />
          WHY CHOOSE <StyledText text="Pairly" />?
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" maxWidth={700}>
          We’re more than just a chat app. With instant pairing, secure conversations, and a growing
          global community — Pairly is where real conversations begin and boundaries disappear.
        </Typography>
      </Stack>

      {/* SECTION: Features - Instant Matchmaking, Video, Privacy */}
      <Box component="section" maxWidth={1100} mx="auto">
        {/* Feature 1: Matchmaking */}
        <Stack my={8} direction={{ xs: 'column', lg: 'row' }} spacing={5} alignItems="center">
          <Box component="img" src={about1} alt="instant matching" sx={imgSx} />
          <Stack spacing={2}>
            <Typography
              variant="h6"
              fontWeight={800}
              letterSpacing={2}
              color="text.secondary"
              sx={labelNumStyle}
            >
              01
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              Instant <StyledText text="Matchmaking" />
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our algorithm pairs users within seconds based on interest, language, and location
              preferences, ensuring relevant and exciting conversations every time.
            </Typography>
          </Stack>
        </Stack>

        {/* Feature 2: Real-time Messaging */}
        <Stack
          my={8}
          direction={{ xs: 'column-reverse', lg: 'row' }}
          spacing={5}
          alignItems="center"
        >
          <Stack spacing={2}>
            <Typography
              variant="h6"
              fontWeight={800}
              letterSpacing={2}
              color="text.secondary"
              sx={labelNumStyle}
            >
              02
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              <StyledText text="Real-Time Video" /> & Messaging
            </Typography>
            <Typography variant="body1" color="text.secondary">
              From smooth video calls to real-time chats, enjoy a seamless, high-quality
              communication experience. Our infrastructure supports thousands of users
              simultaneously.
            </Typography>
          </Stack>
          <Box component="img" src={about2} alt="real-time chat" sx={imgSx} />
        </Stack>

        {/* Feature 3: Safety */}
        <Stack my={8} direction={{ xs: 'column', lg: 'row' }} spacing={5} alignItems="center">
          <Box component="img" src={about3} alt="safe connection" sx={imgSx} />
          <Stack spacing={2}>
            <Typography
              variant="h6"
              fontWeight={800}
              letterSpacing={2}
              color="text.secondary"
              sx={labelNumStyle}
            >
              03
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              Privacy & <StyledText text="Safety First" />
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We use end-to-end encryption, moderation tools, and user reporting to ensure a
              respectful and secure environment for everyone. Your data is always protected.
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* SECTION: Trusted by Startups */}
      <Stack mt={6} spacing={2} textAlign="center">
        <Stack direction="row" justifyContent="center" gap={1} alignItems="center">
          <VerifiedIcon color="primary" />
          <Typography variant="h5" fontWeight={600} color="text.secondary">
            TRUSTED <StyledText text="BY TEAMS" />
          </Typography>
        </Stack>
        <Typography variant="body2" gutterBottom fontWeight={500}>
          Our technology is trusted by social platforms, startups, and learning communities.
        </Typography>

        <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={3} mt={4}>
          {brandCard.map((card, i) => (
            <Box
              key={i}
              p={3}
              maxWidth={300}
              borderRadius={1}
              boxShadow={2}
              sx={{
                bgcolor: 'inherit',
                backdropFilter: 'blur(14px)',
                transition: 'all 0.3s ease',
                borderBottom: `1px dotted ${theme.palette.text.secondary}`,
                '&:hover': { transform: 'translateY(-10px)' }
              }}
            >
              <Box component="img" src={card.brandLogo} alt={card.brandName} width={110} mb={2} />
              <Typography variant="subtitle1" fontWeight={600}>
                {card.brandName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.content}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>

      {/* SECTION: Contact Form */}
      <Box mt={10}>
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
          GOT QUESTIONS? <StyledText text="WE’RE HERE TO HELP" />.
        </Typography>
        <Contact />
      </Box>
    </Box>
  );
}

export default About;
