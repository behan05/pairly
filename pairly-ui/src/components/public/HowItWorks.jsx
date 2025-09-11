import { Box, Stack, Typography, useTheme } from '@/MUI/MuiComponents';
import { PsychologyOutlinedIcon } from '@/MUI/MuiIcons';
import StyledText from '@/components/common/StyledText';

import {
  LoginOutlinedIcon,
  PeopleAltOutlinedIcon,
  ChatOutlinedIcon,
  SwipeRightAltOutlinedIcon,
  SecurityOutlinedIcon
} from '@/MUI/MuiIcons';

function HowItWorks() {
  const theme = useTheme();

  const howItWorksSteps = [
    {
      title: 'Enter the Platform',
      description:
        "No complex forms or lengthy signups. Just open the app, click 'Start Connecting', and you’re ready to dive into the world of conversations. It's fast, easy, and friction-free.",
      icon: 'LoginOutlinedIcon'
    },
    {
      title: 'Smart Matchmaking',
      description:
        'Our intelligent matching algorithm pairs you with people based on preferences and behavior patterns, ensuring every chat is fresh, interesting, and aligned with your vibe.',
      icon: 'PeopleAltOutlinedIcon'
    },
    {
      title: 'Start Chatting',
      description:
        'Once connected, you can instantly begin a seamless video or text conversation in real-time. No delays, no confusion — just smooth and spontaneous communication.',
      icon: 'ChatOutlinedIcon'
    },
    {
      title: 'Keep or Skip',
      description:
        "Not vibing with the current chat? Simply hit 'Next' to meet someone new — instantly. You're always in control, and every new match brings a fresh connection.",
      icon: 'SwipeRightAltOutlinedIcon'
    },
    {
      title: 'Safe & Anonymous',
      description:
        'Your identity remains private, and chats are not stored unless reported. We prioritize your safety with moderation tools and respectful community guidelines.',
      icon: 'SecurityOutlinedIcon'
    }
  ];

  const iconsMap = {
    LoginOutlinedIcon: <LoginOutlinedIcon sx={{ color: 'primary.main' }} />,
    PeopleAltOutlinedIcon: <PeopleAltOutlinedIcon sx={{ color: 'info.main' }} />,
    ChatOutlinedIcon: <ChatOutlinedIcon sx={{ color: 'success.main' }} />,
    SwipeRightAltOutlinedIcon: <SwipeRightAltOutlinedIcon sx={{ color: 'warning.main' }} />,
    SecurityOutlinedIcon: <SecurityOutlinedIcon sx={{ color: 'error.main' }} />
  };
  return (
    <Box display="flex" flexDirection="column" my={6} mx={'auto'} maxWidth={1200}>
      <Typography
        variant="h5"
        fontWeight={600}
        textTransform="uppercase"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
        gutterBottom
      >
        <PsychologyOutlinedIcon fontSize="medium" sx={{ color: 'primary.main' }} />
        How it <StyledText text="works" />
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        maxWidth={700}
        mx="auto"
        mb={4}
        fontSize={{ xs: 14, md: 16 }}
      >
        Understand the simple steps to start connecting. From setting up your profile to jumping
        into real-time conversations, we make it effortless.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
          mt: 3
        }}
      >
        {howItWorksSteps.map((step, index) => (
          <Stack
            key={index}
            flexBasis={350}
            p={3}
            sx={{
              bgcolor: theme.palette.background.paper,
              backdropFilter: 'blur(14px)',
              borderRadius: theme.spacing(1),
              borderBottom: `1px dotted ${theme.palette.text.secondary}`,
              cursor: 'pointer',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-10px)'
              }
            }}
          >
            <Stack mb={5}>{iconsMap[step.icon]}</Stack>
            <Box>
              <Typography gutterBottom variant="h6" fontWeight="600" letterSpacing={1}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}

export default HowItWorks;
