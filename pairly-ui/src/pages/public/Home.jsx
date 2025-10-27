import React from 'react';
import { Box, Stack, Typography, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import StyledButton from '@/components/common/StyledButton';
import StyledText from '@/components/common/StyledText';
import Tagline from '@/components/public/Tagline';
import {
  BoltOutlinedIcon,
  HelpOutlineIcon,
  PersonIcon,
  PsychologyIcon,
  TuneIcon,
  AccountBoxIcon,
  InterestsIcon,
  ChatIcon,
  SmsIcon,
  ShieldIcon,
  ReportProblemIcon,
  BrushIcon,
  FilterAltIcon,
  TravelExploreIcon
} from '@/MUI/MuiIcons';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

const iconMap = {
  Psychology: <PsychologyIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
  Tune: <TuneIcon sx={{ fontSize: 36, color: 'secondary.main' }} />,
  AccountBox: <AccountBoxIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
  Interests: <InterestsIcon sx={{ fontSize: 36, color: 'secondary.main' }} />,
  Chat: <ChatIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
  Sms: <SmsIcon sx={{ fontSize: 36, color: 'secondary.main' }} />,
  Shield: <ShieldIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
  ReportProblem: <ReportProblemIcon sx={{ fontSize: 36, color: 'secondary.main' }} />,
  Person: <PersonIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
  Brush: <BrushIcon sx={{ fontSize: 36, color: 'secondary.main' }} />,
  FilterAlt: <FilterAltIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
  TravelExplore: <TravelExploreIcon sx={{ fontSize: 36, color: 'secondary.main' }} />
};

import HowItWorks from '@/components/public/HowItWorks';
import WhyChooseUs from '@/components/public/WhyChooseUs';
import FAQ from '@/components/public/FAQ';
import { Link } from 'react-router-dom';

function Home() {
  React.useEffect(() => {
    document.title = 'Pairly - Mini Social Universe';
  }, []);

  const features = [
    {
      label: '01',
      title: 'Smart ',
      highlightText: 'Matching',
      description:
        'Our intelligent algorithm connects you with like-minded individuals based on your interests, preferences, and location.',
      icon1: 'Psychology',
      title1: 'Intelligent Algorithm',
      icon2: 'Tune',
      title2: 'Personalized Filters'
    },
    {
      label: '02',
      title: 'Instant ',
      highlightText: 'Connection',
      description:
        'Connect face-to-face in real-time without delays. Just click and start a conversation instantly.',
      icon1: 'AccountBox',
      title1: 'One-Click Start',
      icon2: 'Interests',
      title2: 'Shared Topics'
    },
    {
      label: '03',
      title: 'Real-Time ',
      highlightText: 'Messaging',
      description:
        'Send and receive messages while on a video call or offline. Keep the conversation alive beyond the call.',
      icon1: 'Chat',
      title1: 'In-Call Chat',
      icon2: 'Sms',
      title2: 'Offline Messaging'
    },
    {
      label: '04',
      title: 'Privacy & ',
      highlightText: 'Safety',
      description:
        'Your safety matters. Manage who connects with you, report issues, and enjoy end-to-end encrypted calls.',
      icon1: 'Shield',
      title1: 'End-to-End Encryption',
      icon2: 'ReportProblem',
      title2: 'Report & Block'
    },
    {
      label: '05',
      title: 'Customizable ',
      highlightText: 'Profiles',
      description:
        'Make your profile truly yours. Add a bio, interests, and photos to express yourself and attract genuine connections.',
      icon1: 'Person',
      title1: 'Add Photos & Bio',
      icon2: 'Brush',
      title2: 'Personalize Profile'
    },
    {
      label: '06',
      title: 'Filter by ',
      highlightText: 'Preferences',
      description:
        'Easily filter who you want to connect with by age, location, language, gender, and interests for a better experience.',
      icon1: 'FilterAlt',
      title1: 'Smart Filters',
      icon2: 'TravelExplore',
      title2: 'Global or Nearby'
    }
  ];

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));

  const coreFeature = [
    'Emotionally intelligent random chat modes like Chill Vibe, Deep Talk, Just Laugh, and more',
    'Private chat with partner or known users via unique user ID search (bypass random match)',
    'Custom proposal system for love, marriage, fun, or long-distance relationship invitations',
    'Silent Feel Mode — stay connected quietly with your partner, no words needed, just presence',
    'Virtual Stand-Up Comedy stage with animated avatars for users who are shy to perform live',
    'Emotion-based AI chat suggestions for deeper, more human-like conversations',
    'User mood detection and adaptive conversation topics for better emotional syncing',
    'Seamless match and re-connect system that blends fun with genuine bonding',
    'Secure, private chat environment with optional anonymity in random modes',
    'Community-driven event rooms for laughter, romance, and shared experiences',
    'Modern, minimal design with focus on emotional comfort and authentic connection',
    'AI-enhanced moderation and context-aware safety tools',
    'Multi-purpose use — casual chat, dating, friendship, entertainment, and expression'
  ];

  return (
    <React.Fragment>
      {/* === Hero / Slogan Section === */}
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexGrow: 1,
          py: isMd ? 4 : 8,
          alignItems: 'center',
        }}
      >
        {/* Left Side – Text */}
        <Stack justifyContent="center" spacing={3}>
          {/* Headline */}
          <Typography
            variant={isMd ? 'h3' : 'h2'}
            fontWeight={700}
            sx={{ color: 'text.primary', lineHeight: 1.2 }}
          >
            Say What You Feel.{' '}
          </Typography>

          {/* Hook line (Tags) */}
          <Typography
            variant="subtitle2"
            sx={{
              px: 2.5,
              pt: 1.5,
              pb: 1,
              fontSize: isMd ? '0.70rem' : '0.85rem',
              width: 'fit-content',
              mt: 1,
              mx: 'auto',
              color: theme.palette.text.secondary,
              borderRadius: '12px',
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.08))'
                  : 'linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.05))',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? 'inset 0 0 10px rgba(255,255,255,0.04)'
                  : 'inset 0 0 8px rgba(0,0,0,0.05)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              textAlign: 'center',
              gap: 0.5,
              transition: 'all 0.3s ease',

              '& a': {
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontStyle: 'italic',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: theme.palette.primary.dark,
                  textDecoration: 'underline',
                },
              },

              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? 'inset 0 0 10px rgba(255,255,255,0.08), 0 2px 6px rgba(0,0,0,0.4)'
                    : 'inset 0 0 8px rgba(0,0,0,0.05), 0 2px 6px rgba(0,0,0,0.08)',
              },
            }}
          >
            Welcome to{' '}
            <Link to="nextGenerationChat">
              next generation chat
            </Link>
          </Typography>

          {/* Short Description */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 640, lineHeight: 1.6, mt: 2 }}
          >
            Pairly pairs you with real users worldwide in seconds, prioritizing matches based on your interests.
            Even with few users online, you'll always chat with a genuine person—never a bot. Designed to protect
            human emotions, Pairly helps you connect meaningfully.
          </Typography>

          {/* Core Feature Flow */}
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Typography variant={isMd ? 'h5' : 'h4'} fontWeight={700} sx={{ color: 'text.primary' }}>
              Core{' '} <StyledText text='Feature Flow' />
            </Typography>

            <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {['Random Chats', 'Friend Requests', 'Private Chats', 'Propose to partner', 'Couple Features Activated'].map(
                (step, index) => (
                  <Stack
                    key={step}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ pl: 1 }}
                  >
                    {index < 4 && <KeyboardDoubleArrowDownIcon sx={{ color: 'primary.main', fontSize: 28 }} />}
                    {index === 4 && <VolunteerActivismIcon sx={{ color: 'error.main', fontSize: 28 }} />}
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {step}
                    </Typography>
                  </Stack>
                )
              )}
            </Stack>
          </Stack>

          {/* Emotion Protection */}
          <Typography
            variant="body1"
            sx={{ mt: 3, color: 'text.secondary', fontStyle: 'italic', maxWidth: 600 }}
          >
            <StyledText text={'“'} />We protect your emotions until couple mode. Pairly helps you know each other clearly before taking the next step.<StyledText text={'”'} />
          </Typography>

          {/* CTA Buttons */}
          <Stack direction="row" gap={2} sx={{ mt: 3, flexWrap: 'wrap' }}>
            <StyledButton text={'Connect Instantly'} redirectUrl={'/register'} />
            <StyledButton text={'How It Works'} redirectUrl={'/about'} />
          </Stack>

          {/* Tagline / animation below CTA */}
          <Tagline />
        </Stack>

      </Box>

      {/* ===  How It Works Section === */}
      <HowItWorks />

      {/* ===  Pairly Features Section === */}
      <Box mx={'auto'} maxWidth={1200} position="relative">
        {/* Section Heading */}
        <Stack alignItems="center" justifyContent="center" my={6}>
          <Typography
            variant="h5"
            fontWeight={600}
            display="flex"
            alignItems="center"
            gap={1}
            color="text.primary"
            textTransform="uppercase"
            flexWrap="wrap"
          >
            <BoltOutlinedIcon fontSize="large" sx={{ color: 'error.main' }} />
            Pairly <StyledText text="Features" />
          </Typography>

          <Typography
            variant="body2"
            maxWidth="800px"
            color="text.secondary"
            textAlign="center"
            fontSize={{ xs: 14, md: 16 }}
          >
            Discover how we bring people together. Our platform features smart matching,
            personalized profiles, real-time messaging, and privacy-first controls all designed to
            create safe and meaningful conversations.
          </Typography>
        </Stack>

        {/* Features Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMd ? '1fr' : isLg ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: 1,
            rowGap: 2,
            mx: 'auto'
          }}
        >
          {features.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                bgcolor: theme.palette.background.paper,
                backdropFilter: 'blur(6px)',
                borderRadius: 1,
                cursor: 'pointer',
                p: 2,
                gap: 3,
                boxShadow: '0 0 12px rgba(0,0,0,0.05)',
                transition: '0.3s',
                borderBottom: `1px dotted ${theme.palette.text.secondary}`,
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              {/* Header */}
              <Stack direction="row" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    borderRight: `4px solid ${theme.palette.text.secondary}`,
                    bgcolor: `transparent`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.1s ease',
                    '&:hover': {
                      borderRight: 0
                    }
                  }}
                >
                  {item.label}
                </Box>
                <Typography variant="h6" letterSpacing={1} fontWeight={600}>
                  {item.title}
                  <StyledText text={item.highlightText} />
                </Typography>
              </Stack>

              {/* Icons & Steps */}
              <Stack spacing={3}>
                {/* Step 1 */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(10, 86, 109, 0.09)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    boxShadow: 1
                  }}
                >
                  {iconMap[item.icon1]}
                  <Typography fontWeight={500}>{item.title1}</Typography>
                </Box>

                {/* Connector */}
                <Box display="flex" justifyContent="center">
                  <Typography color="primary">⚡</Typography>
                </Box>

                {/* Step 2 */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(10, 86, 109, 0.09)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    boxShadow: 1
                  }}
                >
                  {iconMap[item.icon2]}
                  <Typography fontWeight={500}>{item.title2}</Typography>
                </Box>
              </Stack>

              {/* Description */}
              <Typography variant="body2" color="text.secondary" mt={2}>
                {item.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* === Why Choose Us? Section === */}
      <WhyChooseUs />

      {/* === Frequently Asked Questions FAQ Section === */}
      <Box
        mt={6}
        sx={{
          maxWidth: 1000,
          mx: 'auto'
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          textTransform={'uppercase'}
          display="flex"
          alignItems="center"
          justifyContent={'center'}
          gap={1}
          gutterBottom
        >
          <HelpOutlineIcon fontSize="medium" sx={{ color: 'success.main' }} />
          {<StyledText text={'FAQ'} />}
        </Typography>
        <Typography
          variant="body2"
          maxWidth="800px"
          color="text.secondary"
          mx="auto"
          textAlign={'center'}
          fontSize={{ xs: 14, md: 16 }}
          mb={3}
        >
          Got questions? We've answered the most common things you might wonder about from how
          Pairly works to how we keep your experience safe and smooth.
        </Typography>

        <FAQ />
      </Box>
    </React.Fragment>
  );
}

export default Home;
