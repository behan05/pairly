import { Box, Stack, Typography, useTheme } from '@/MUI/MuiComponents';

import StyledText from '@/components/common/StyledText';
import SignupBtn from '../common/StyledButton';
import LoginIcon from '@mui/icons-material/Login';

import {
  Psychology,
  Tune,
  AccountBox,
  Interests,
  Chat,
  Sms,
  Shield,
  ReportProblem,
  Person,
  Brush,
  FilterAlt,
  TravelExplore
} from '@mui/icons-material';

const iconMap = {
  Psychology: <Psychology sx={{ fontSize: 40, color: 'text.primary' }} />,
  Tune: <Tune sx={{ fontSize: 40, color: 'primary.main' }} />,
  AccountBox: <AccountBox sx={{ fontSize: 40, color: 'text.primary' }} />,
  Interests: <Interests sx={{ fontSize: 40, color: 'primary.main' }} />,
  Chat: <Chat sx={{ fontSize: 40, color: 'text.primary' }} />,
  Sms: <Sms sx={{ fontSize: 40, color: 'primary.main' }} />,
  Shield: <Shield sx={{ fontSize: 40, color: 'text.primary' }} />,
  ReportProblem: <ReportProblem sx={{ fontSize: 40, color: 'primary.main' }} />,
  Person: <Person sx={{ fontSize: 40, color: 'text.primary' }} />,
  Brush: <Brush sx={{ fontSize: 40, color: 'primary.main' }} />,
  FilterAlt: <FilterAlt sx={{ fontSize: 40, color: 'text.primary' }} />,
  TravelExplore: <TravelExplore sx={{ fontSize: 40, color: 'primary.main' }} />
};

// Common style constants
const cardContainerSx = (theme) => ({
  minWidth: 300,
  maxWidth: 600,
  backgroundColor: 'transparent',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  p: theme.spacing(3),
  flexGrow: 1,
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 1
});

const circleLabelSx = {
  bgcolor: 'rgba(10, 86, 109, 0.09)',
  backdropFilter: 'blur(4px)',
  boxShadow: `0 0 4px rgba(240, 235, 243, 0.1)`
};

const glowBoxSx = (theme) => ({
  minWidth: 200,
  maxWidth: 250,
  borderRadius: 1,
  backdropFilter: 'blur(4px)',
  p: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  boxShadow: 'inset 0px 0px 20px rgba(112, 103, 103, 0.2)',
  transition: 'transform 0.3s ease',
});

const connectorLineSx = {
  width: 2,
  height: 20,
  bgcolor: 'grey.500',
  opacity: 0.5,
  borderRadius: 1
};

const arrowBoxSx = {
  width: 20,
  height: 20,
  borderTop: '2px solid',
  borderRight: '2px solid',
  borderColor: 'primary.main',
  transform: 'rotate(45deg)',
  mt: 1
};

function PairlyFeaturesCard({
  label,
  title,
  highlightText,
  icon1,
  title1,
  icon2,
  title2,
  description
}) {
  const theme = useTheme();

  return (
    <Box sx={cardContainerSx(theme)}>
      {/* Top Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Stack
          borderRadius={'50%'}
          width={40}
          height={40}
          justifyContent={'center'}
          alignItems={'center'}
          fontWeight="bold"
          fontSize="1.2rem"
          sx={circleLabelSx}
        >
          {label}
        </Stack>

        <Typography variant="h5" fontWeight="bold">
          {title} <StyledText text={highlightText} />
        </Typography>
      </Box>

      {/* Middle Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* First Box */}
        <Box
          sx={{
            ...glowBoxSx(theme),
            '&:hover': {
              transform: 'translateX(20px)'
            }
          }}
        >
          {iconMap[icon1] || '❔'}
          <Typography variant="subtitle1" fontWeight="bold" color={'text.secondary'}>
            {title1}
          </Typography>
        </Box>

        {/* Connector */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Box sx={connectorLineSx} />
          <Typography color="primary">⚡</Typography>
          <Box sx={connectorLineSx} />
          <Box sx={arrowBoxSx} />
        </Box>

        {/* Second Box */}
        <Box
          sx={{
            ...glowBoxSx(theme),
            alignSelf: 'flex-end',
            '&:hover': {
              transform: 'translateX(-20px)'
            }
          }}
        >
          {iconMap[icon2] || '❔'}
          <Typography variant="subtitle1" fontWeight="bold" color={'text.secondary'}>
            {title2}
          </Typography>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box mt={3}>
        <Typography variant="body1" letterSpacing={0.2}>
          {description}
        </Typography>
        <Box my={2}>
          <SignupBtn icon={<LoginIcon />} text={'Start Connecting'} redirectUrl={'/register'} />
        </Box>
      </Box>
    </Box>
  );
}

export default PairlyFeaturesCard;
