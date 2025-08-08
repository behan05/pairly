import React from 'react';
import { Box, useTheme, Stack, Typography, Button } from '@/MUI/MuiComponents';
import { DownloadIcon, CheckCircleIcon } from '@/MUI/MuiIcons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import StyledText from '@/components/common/StyledText';
import BlurWrapper from '@/components/common/BlurWrapper';
import { SETTINGS_API } from '@/api/config';
import axios from 'axios';

function RequestAccountInfo() {
  const theme = useTheme();
  const [requested, setRequested] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`${SETTINGS_API}/request-info`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/gzip' });
      const url = window.URL.createObjectURL(blob);

      // Creating anchor to force download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'your-info.json.gz';
      document.body.appendChild(a);

      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      toast.success('Your data is ready for download.');
      setRequested(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <Box component={'section'}>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      {/* Back Button */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/connect/settings/account'} text={'Request account info'} />
      </Stack>

      {/* Form Box */}
      <BlurWrapper component={'form'} onSubmit={handleRequest}>
        <Stack spacing={3} alignItems="center">
          <Typography textAlign="center" variant="h5" fontWeight={600}>
            Account <StyledText text="Information" />
          </Typography>

          <Typography variant="body2" fontWeight={400} color="text.secondary" textAlign="center">
            View and manage the details associated with your account. You can request a summary of
            your account activity and information.
          </Typography>

          <Button
            variant="outlined"
            type="submit"
            startIcon={requested ? <CheckCircleIcon /> : <DownloadIcon />}
            disabled={isLoading || requested}
            sx={{
              px: 4,
              color: 'text.primary',
              background: 'transparent',
              boxShadow: `inset 0 1px 1px ${theme.palette.success.main}`,
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: `inset 0 -1px 1px ${theme.palette.success.main}`,
                transform: 'translateY(-5px)',
                background: 'transparent'
              }
            }}
          >
            {requested ? 'Requested' : isLoading ? 'Requesting...' : 'Request Info'}
          </Button>
        </Stack>
      </BlurWrapper>
    </Box>
  );
}

export default RequestAccountInfo;
