import Lottie from 'lottie-react';
import PageNotFoundError from '../../assets/lottie/PageNotFound.json';
import { Box } from '@/MUI/MuiComponents';
import StyledActionButton from './StyledActionButton';

function PageNotFound() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Lottie
        animationData={PageNotFoundError}
        loop
        style={{ width: '100%', maxWidth: 600 }}
      />
      <StyledActionButton
        text={'Back To Home'}
        redirectUrl={'/pairly'}
      />
    </Box>
  );
}

export default PageNotFound;