import { Box, Typography, useTheme, useMediaQuery, Stack } from '../../MUI/MuiComponents';
import {
  WorkspacePremiumOutlinedIcon,
  SecurityIcon,
  PsychologyIcon,
  FlashOnIcon,
  EmojiPeopleIcon
} from '@/MUI/MuiIcons';
import StyledText from '@/components/common/StyledText';
import welcome from '@/assets/videos/welcome.mp4';

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
      content: 'No waiting or room codes jump straight into video chats instantly.'
    },
    {
      icon: <EmojiPeopleIcon sx={{ fontSize: 30, color: theme.palette.success.main }} />,
      title: 'Real People, Real Talk',
      content: 'Meet genuine users from around the world not bots or fake profiles.'
    }
  ];

  return (
    <Box my={6}>
      <Stack my={3}>
        <Typography
          variant="h5"
          fontWeight={600}
          textTransform={'uppercase'}
          display="flex"
          alignItems="center"
          gap={1}
          justifyContent="center"
          gutterBottom
        >
          <WorkspacePremiumOutlinedIcon
            fontSize={'medium'}
            sx={{ color: theme.palette.success.main }}
          />
          Why {<StyledText text={'Choose Us?'} />}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          maxWidth={700}
          mx="auto"
        >
          We’re committed to providing a safe, smart, and seamless connection experience. With
          real-time communication, intelligent matching, and privacy-first design, Pairly helps you
          make meaningful interactions with confidence.
        </Typography>
      </Stack>

      {/* Content Grid */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSm || isLg ? 'column' : 'row',
          gap: 3,
          alignItems: 'stretch'
        }}
      >
        {/* Cards Grid */}
        <Box
          flex={1}
          sx={{
            display: 'grid',
            gridTemplateColumns: isSm ? '1fr' : 'repeat(2, 1fr)',
            gap: 2,
            order: isLg ? 2 : 1
          }}
        >
          {cardData.map((card, index) => (
            <Stack
              key={index}
              p={3}
              borderRadius={1}
              spacing={2}
              boxShadow={3}
              sx={{
                background: 'transparent',
                backdropFilter: 'blur(14px)',
                transition: 'transform 0.3s ease',
                borderBottom: `1px dotted ${theme.palette.text.secondary}`,
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-10px)' }
              }}
            >
              <Box>{card.icon}</Box>
              <Typography
                variant="subtitle1"
                letterSpacing={1}
                fontWeight={600}
                color="text.primary"
              >
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.content}
              </Typography>
            </Stack>
          ))}
        </Box>

        {/* Video */}
        <Box
          flex={1}
          order={isLg ? 1 : 2}
          sx={{
            p: isSm ? 1 : 3,
            backdropFilter: 'blur(14px)',
            background: 'inherit',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <Box
            component="video"
            src={welcome}
            loading="lazy"
            aria-label="why choose us video"
            autoPlay
            loop
            muted
            playsInline
            sx={{
              width: '100%',
              height: '100%',
              maxHeight: 500,
              objectFit: 'contain',
              borderRadius: 1,
              borderBottom: `1px dotted ${theme.palette.text.secondary}`,
              filter: 'brightness(0.85) saturate(120%)',
              transition: `transform 0.3s`,
              '&:hover': {
                transform: `scale(1.1)`
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default WhyChooseUs;
