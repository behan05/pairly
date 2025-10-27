import { Box, Grid, Typography, useTheme, useMediaQuery, Stack, Fade } from '@/MUI/MuiComponents';
import PairlyFeaturesCard from './PairlyFeaturesCard';

const pairlyFeatures = [
  {
    label: '01',
    title: 'Smart ',
    highlightText: 'Matching',
    description:
      'Instantly connect with genuine people through intelligent random pairing — powered by AI to match interests, language, and behavior.',
    icon1: 'Psychology',
    title1: 'AI Match Engine',
    icon2: 'Tune',
    title2: 'Smart Filters',
  },
  {
    label: '02',
    title: 'Private ',
    highlightText: 'Chat System',
    description:
      'After connecting, users can send friend requests, and once accepted, they get access to secure, unlimited one-to-one chats.',
    icon1: 'Chat',
    title1: 'Secure Private Messaging',
    icon2: 'Lock',
    title2: 'End-to-End Encryption',
  },
  {
    label: '03',
    title: 'Proposal ',
    highlightText: 'System',
    description:
      'Go beyond chatting — send special proposals like friendship, love, marriage, or fun directly within private chat.',
    icon1: 'Favorite',
    title1: 'Proposal Types',
    icon2: 'Diversity2',
    title2: 'Relationship Modes',
  },
  {
    label: '04',
    title: 'Silent ',
    highlightText: 'Feel Mode',
    description:
      'A deep emotional mode where users can silently express feelings using gestures, emojis, or music without typing or speaking.',
    icon1: 'SelfImprovement',
    title1: 'Emotion-Based Chat',
    icon2: 'MusicNote',
    title2: 'Mood Sync System',
  },
  {
    label: '05',
    title: 'Stand-Up ',
    highlightText: 'Comedian Mode',
    description:
      'A unique entertainment zone where users can perform, join, or enjoy live comic interactions with others in real time.',
    icon1: 'MicExternalOn',
    title1: 'Live Comic Shows',
    icon2: 'TheaterComedy',
    title2: 'Audience Chat Rooms',
  },
  {
    label: '06',
    title: 'Profile ',
    highlightText: 'Search',
    description:
      'Connect directly using a unique Pairly ID — skip the random queue and chat privately with someone you already know.',
    icon1: 'PersonSearch',
    title1: 'Unique Pairly ID',
    icon2: 'QrCode2',
    title2: 'Direct Connect',
  },
  {
    label: '07',
    title: 'AI ',
    highlightText: 'Personalities',
    description:
      'Choose or chat with AI companions who adapt to your emotions — from fun and flirty to deep and supportive modes.',
    icon1: 'SmartToy',
    title1: 'Dynamic AI Avatars',
    icon2: 'PsychologyAlt',
    title2: 'Adaptive Conversations',
  },
  {
    label: '08',
    title: 'Next-Generation ',
    highlightText: 'Chat Engine',
    description:
      'Built for smooth real-time interactions with adaptive typing indicators, instant media sharing, and mood-based themes.',
    icon1: 'FlashOn',
    title1: 'Real-Time Engine',
    icon2: 'Palette',
    title2: 'Dynamic UI Themes',
  },
  {
    label: '09',
    title: 'Privacy & ',
    highlightText: 'Safety',
    description:
      'Pairly ensures user trust with advanced security layers, report tools, and active moderation for a safe environment.',
    icon1: 'Shield',
    title1: 'Report & Block',
    icon2: 'Security',
    title2: 'Active Moderation',
  },
  {
    label: '10',
    title: 'Premium ',
    highlightText: 'Plans',
    description:
      'Upgrade to premium or pro plans to enjoy unlimited chats, priority matching, and exclusive AI-driven features.',
    icon1: 'WorkspacePremium',
    title1: 'Premium Access',
    icon2: 'Stars',
    title2: 'Unlimited Chat Experience',
  },
];


function PairlyFeatures() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        px: { xs: 2, md: 8 },
        background: 'transparent',
      }}
    >

      {/* Features Grid */}
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {pairlyFeatures.map((card, i) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={i}
          >
            <Fade in timeout={500 + i * 150}>
              <Box
                sx={{
                  borderRadius: 3,
                  p: 3,
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid rgba(255,255,255,0.08)`,
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  transition: 'all 0.35s ease',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 8px 25px rgba(0,114,255,0.25)',
                    background: 'linear-gradient(120deg, rgba(0,114,255,0.15), rgba(0,198,255,0.1))',
                  },
                }}
              >
                <PairlyFeaturesCard {...card} />
              </Box>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PairlyFeatures;
