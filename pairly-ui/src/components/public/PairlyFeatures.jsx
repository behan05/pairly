import { Box, Grid, useTheme } from '@/MUI/MuiComponents';
import PairlyFeaturesCard from './PairlyFeaturesCard';

// Steps data for How It Works section
const pairlyFeatures = [
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
    title: 'Interactive ',
    highlightText: 'Profiles',
    description:
      'Get to know people before starting a chat. Explore detailed profiles, mutual interests, and compatibility tags.',
    icon1: 'AccountBox',
    title1: 'Explore Profiles',
    icon2: 'Interests',
    title2: 'Discover Mutual Interests'
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
      'Your safety matters. Manage who connects with you, report issues, and enjoy end-to-end encrypted video calls.',
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

function PairlyFeatures() {
  const theme = useTheme();

  return (
    <Grid container justifyContent="center">
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={4}
        p={theme.spacing(2)}
        my={2}
        sx={{ borderRadius: 1 }}
      >
        {pairlyFeatures.map((card, i) => (
          <Box key={i}>
            <PairlyFeaturesCard
              label={card.label}
              title={card.title}
              highlightText={card.highlightText}
              description={card.description}
              icon1={card.icon1}
              title1={card.title1}
              icon2={card.icon2}
              title2={card.title2}
            />
          </Box>
        ))}
      </Box>
    </Grid>
  );
}
export default PairlyFeatures;
