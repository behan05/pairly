import { Box, Typography, CircularProgress } from '@/MUI/MuiComponents';
import SearchIcon from '@mui/icons-material/Search';

const WaitingAnimation = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      textAlign="center"
      sx={{
        animation: 'fadeIn 1s ease-in-out',
        color: 'text.secondary',
        p: 3
      }}
    >
      <Box
        sx={{
          mb: 2,
          position: 'relative'
        }}
      >
        <CircularProgress size={80} thickness={4} />
        <SearchIcon
          fontSize="large"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'primary.main'
          }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Looking for a match...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Hang tight! We're connecting you to someone new.
      </Typography>
    </Box>
  );
};

export default WaitingAnimation;
