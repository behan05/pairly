import { Box, Typography, useTheme, useMediaQuery, Stack } from '../../MUI/MuiComponents';
import {
  WorkspacePremiumOutlinedIcon,
  SecurityIcon,
  PsychologyIcon,
  FlashOnIcon,
  EmojiPeopleIcon
} from '@/MUI/MuiIcons';
import StyledText from '@/components/common/StyledText';
import ReusableVideo from '@/components/public/ReusableVideo';

function WhyChooseUs() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));

  const cardData = [
    {
      icon: <SecurityIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />,
      title: 'Secure & Private',
      content: 'Your conversations are protected with end-to-end encryption and privacy controls.'
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 30, color: theme.palette.warning.main }} />,
      title: 'Smart Matching',
      content: 'Pairly pairs you with like-minded users based on preferences and behavior.'
    },
    {
      icon: <FlashOnIcon sx={{ fontSize: 30, color: theme.palette.secondary.main }} />,
      title: 'Instant Connections',
      content: 'No waiting or room codes — jump straight into video chats instantly.'
    },
    {
      icon: <EmojiPeopleIcon sx={{ fontSize: 30, color: theme.palette.success.main }} />,
      title: 'Real People, Real Talk',
      content: 'Meet genuine users from around the world — not bots or fake profiles.'
    }
  ];

  return (
    <Box my={8}>
      {/* === Section Heading === */}
      <Stack mb={4} alignItems="center" textAlign="center" spacing={1}>
        <Typography
          variant="h5"
          fontWeight={700}
          textTransform="uppercase"
          display="flex"
          alignItems="center"
          gap={1}
          justifyContent="center"
        >
          <WorkspacePremiumOutlinedIcon fontSize="medium" sx={{ color: theme.palette.success.main }} />
          Why <StyledText text="Choose Us?" />
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          maxWidth={700}
          mx="auto"
          sx={{ lineHeight: 1.6 }}
        >
          We’re committed to providing a safe, smart, and seamless connection experience.
          With real-time communication, intelligent matching, and privacy-first design,
          Pairly helps you make meaningful interactions with confidence.
        </Typography>
      </Stack>

      {/* === Content Grid === */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isLg ? 'column' : 'row',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {/* Cards Grid */}
        <Box
          flex={1}
          sx={{
            display: 'grid',
            gridTemplateColumns: isSm ? '1fr' : 'repeat(2, 1fr)',
            gap: 2,
            order: isLg ? 2 : 1,
          }}
        >
          {cardData.map((card, index) => (
            <Stack
              key={index}
              p={3}
              borderRadius={2}
              spacing={1.5}
              boxShadow={3}
              sx={{
                background:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(0,0,0,0.03)',
                backdropFilter: 'blur(12px)',
                borderBottom: `1px dotted ${theme.palette.text.secondary}`,
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 6px 24px rgba(255,255,255,0.1)'
                      : '0 6px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box>{card.icon}</Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.5}>
                {card.content}
              </Typography>
            </Stack>
          ))}
        </Box>

        {/*  Animation Side */}
        <Box
          flex={1}
          order={isLg ? 1 : 2}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: `inset 0 0 20px ${theme.palette.divider}`,
          }}
        >
          {/* responsive lottie */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 2,
            }}
          >
            <ReusableVideo />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default WhyChooseUs;
