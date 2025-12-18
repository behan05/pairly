import { useEffect, useRef } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Stack } from '@/MUI/MuiComponents';
import gsap from 'gsap';
import {
  Psychology,
  Tune,
  Chat,
  Lock,
  Favorite,
  Diversity2,
  SelfImprovement,
  MusicNote,
  MicExternalOn,
  TheaterComedy,
  PersonSearch,
  QrCode2,
  SmartToy,
  PsychologyAlt,
  FlashOn,
  Palette,
  Shield,
  Security,
  WorkspacePremium,
  Stars
} from '@mui/icons-material';

const icons = {
  Psychology,
  Tune,
  Chat,
  Lock,
  Favorite,
  Diversity2,
  SelfImprovement,
  MusicNote,
  MicExternalOn,
  TheaterComedy,
  PersonSearch,
  QrCode2,
  SmartToy,
  PsychologyAlt,
  FlashOn,
  Palette,
  Shield,
  Security,
  WorkspacePremium,
  Stars
};

const features = [
  {
    label: '01',
    title: 'Smart',
    highlightText: 'Matching',
    description:
      'Pairly’s AI-driven Smart Matching instantly connects you with people who truly vibe with your energy. The algorithm studies interests, intent, and conversation tone to build meaningful first encounters not random noise.',
    icon1: 'Psychology',
    icon2: 'Tune'
  },
  {
    label: '02',
    title: 'Private',
    highlightText: 'Chat System',
    description:
      'Your personal space to talk, laugh, or bond. Once a friend request is accepted, enjoy private and unlimited one-to-one chats with media sharing, real-time status, and mood-based themes all end-to-end protected.',
    icon1: 'Chat',
    icon2: 'Lock'
  },
  {
    label: '03',
    title: 'Proposal',
    highlightText: 'System',
    description:
      'Go beyond ordinary chats with expressive proposals. Send customized invitations for love, friendship, marriage, or fun each wrapped with your emotions and creative templates inside Pairly private chat.',
    icon1: 'Favorite',
    icon2: 'Diversity2'
  },
  {
    label: '04',
    title: 'Silent',
    highlightText: 'Feel Mode',
    description:
      'When words fall short, Feel Mode speaks for you. Share emotions silently using gestures, music, reactions, or subtle animations creating deeper, wordless emotional connections between users.',
    icon1: 'SelfImprovement',
    icon2: 'MusicNote'
  },
  {
    label: '05',
    title: 'Stand-Up',
    highlightText: 'Comedian Mode',
    description:
      'Add laughter to life. Host or join fun mini-sessions where users perform short comedy acts, jokes, or spontaneous reactions powered by live voice and audience engagement inside Pairly’s entertainment zone.',
    icon1: 'MicExternalOn',
    icon2: 'TheaterComedy'
  },
  {
    label: '06',
    title: 'Profile',
    highlightText: 'Search',
    description:
      'Skip randomness find exactly who you’re looking for using their unique Pairly ID or username. Designed for direct connections, private chats, and verified user interactions without public exposure.',
    icon1: 'PersonSearch',
    icon2: 'QrCode2'
  },
  {
    label: '07',
    title: 'AI',
    highlightText: 'Personalities',
    description:
      'Meet your AI companion empathetic, smart, and always available. Choose personalities that adapt to your mood: funny, romantic, serious, or deep. They learn, grow, and respond emotionally like real people.',
    icon1: 'SmartToy',
    icon2: 'PsychologyAlt'
  },
  {
    label: '08',
    title: 'Next-Generation',
    highlightText: 'Chat Engine',
    description:
      'Built with real-time architecture for seamless flow. Experience lightning-fast delivery, expressive message effects, AI-assisted responses, and typing predictions all tuned for modern chat culture.',
    icon1: 'FlashOn',
    icon2: 'Palette'
  },
  {
    label: '09',
    title: 'Privacy &',
    highlightText: 'Safety',
    description:
      'We protect what matters most you. Pairly’s multi-layered security shields your data, while smart moderation, reporting tools, and privacy-first design ensure every connection remains respectful and secure.',
    icon1: 'Shield',
    icon2: 'Security'
  },
  {
    label: '10',
    title: 'Premium',
    highlightText: 'Plans',
    description:
      'Unlock your full potential with Pairly Premium. Get unlimited chats, VIP support, early feature access, priority matching, and exclusive AI-powered personalization for a truly elite experience.',
    icon1: 'WorkspacePremium',
    icon2: 'Stars'
  }
];

export default function PairlyFeaturesTimeline() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const timelineRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      timelineRef.current,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      }
    );
  }, []);

  return (
    <Box
      sx={{
        px: { xs: 2, md: 10 },
        py: { xs: 6, md: 10 },
        position: 'relative',
        background: `linear-gradient(180deg,
      ${theme.palette.background.default}20,
      ${theme.palette.info.dark}10)`,
        borderRadius: 1
      }}
    >
      <Box
        sx={{
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '3px',
            background: theme.palette.divider,
            transform: 'translateX(-50%)',
            borderRadius: 1
          }
        }}
      >
        {features.map((f, i) => {
          const Icon1 = icons[f.icon1];
          const Icon2 = icons[f.icon2];

          return (
            <Stack
              ref={(el) => (timelineRef.current[i] = el)}
              key={f.label}
              direction={isSm ? 'column' : i % 2 === 0 ? 'row' : 'row-reverse'}
              alignItems="center"
              spacing={4}
              sx={{
                position: 'relative',
                mb: { xs: 8, md: 12 }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  mb={1}
                  sx={{ color: 'text.primary' }}
                >
                  {f.title} <span style={{ color: theme.palette.primary.main }}>{f.highlightText}</span>
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  {f.description}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Box>{Icon1 && <Icon1 color="primary" />}</Box>
                  <Box>{Icon2 && <Icon2 color="secondary" />}</Box>
                </Stack>
              </Box>

              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  position: 'relative',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: theme.palette.background.paper,
                  boxShadow: '0 0 20px rgba(0,0,0,0.15)',
                  zIndex: 2
                }}
              >
                <Typography variant="h6" fontWeight={700} color="primary">
                  {f.label}
                </Typography>
              </Stack>

              <Box sx={{ flex: 1 }} />
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
}