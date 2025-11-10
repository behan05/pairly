import * as React from 'react';
import { Box, Stack,Button,useTheme, Typography, TextField, InputAdornment, IconButton } from '@/MUI/MuiComponents';

import { SendIcon, VisibilityIcon, VisibilityOffIcon } from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import StyledText from '@/components/common/StyledText';
import BlurWrapper from '@/components/common/BlurWrapper';
import { SETTINGS_API } from '@/api/config';
import axios from 'axios';

// toast prompt
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ChangeCredentials() {
  const theme = useTheme();
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [formData, setFormData] = React.useState({
    currentPassword: '',
    newEmail: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [newErrors, setNewErrors] = React.useState({});

  const handleClick = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    const updatedErrors = {};

    // Current password is always required
    if (!formData.currentPassword.trim()) {
      updatedErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    // Validate newEmail if entered
    if (formData.newEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.newEmail.trim())) {
        updatedErrors.newEmail = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Validate newPassword & confirmPassword
    if (formData.newPassword.trim() === '') {
      updatedErrors.newPassword = 'New password is required';
      isValid = false;
    }
    if (formData.confirmPassword.trim() === '') {
      updatedErrors.confirmPassword = 'confirm password is required';
      isValid = false;
    }
    if (formData.newPassword.trim() !== formData.confirmPassword.trim()) {
      updatedErrors.confirmPassword = 'Password do not match';
      isValid = false;
    }

    setNewErrors(updatedErrors);

    if (!isValid) return;

    setIsDisabled(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.patch(`${SETTINGS_API}/change-credentials`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTimeout(() => {
        toast.success(response.data.message);
        setFormData({
          currentPassword: '',
          newEmail: '',
          newPassword: '',
          confirmPassword: ''
        });
        setNewErrors({});
        setIsDisabled(false);
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong.');
      setFormData({
        currentPassword: '',
        newEmail: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsDisabled(false);
    }
  };

  return (
    <Box component={'section'}>
      {/* ToastContainer */}
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      {/* Navigate Back */}
      <Stack mb={2}>
        <NavigateWithArrow
          redirectTo={'/pairly/settings/account'}
          text={'Change Email / Password'}
        />
      </Stack>

      {/* Form */}
      <BlurWrapper component={'form'} onSubmit={handleSubmit}>
        <Stack direction="column" textAlign="center">
          <Typography variant="h5" fontWeight={600} mb={1}>
            Manage <StyledText text="Credentials" />
          </Typography>

          <Typography variant="body2" fontWeight={400} color="text.secondary" mb={4}>
            Keep your account secure by updating your email address or password. Make sure to use a
            strong password to protect your account.
          </Typography>
        </Stack>

        <Stack gap={2}>
          <TextField
            label="Current Password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleClick}
            type={showCurrentPassword ? 'text' : 'password'}
            fullWidth
            error={Boolean(newErrors.currentPassword)}
            helperText={newErrors.currentPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowCurrentPassword((prev) => !prev)} edge="end">
                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="New Email (optional)"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleClick}
            fullWidth
            error={Boolean(newErrors.newEmail)}
            helperText={newErrors.newEmail}
          />

          <TextField
            label="New Password"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleClick}
            fullWidth
            error={Boolean(newErrors.newPassword)}
            helperText={newErrors.newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword((prev) => !prev)} edge="end">
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleClick}
            fullWidth
            error={Boolean(newErrors.confirmPassword)}
            helperText={newErrors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            endIcon={<SendIcon sx={{ color: 'text.primary' }} />}
            disabled={isDisabled}
            sx={{
              maxWidth: 'fit-content',
              alignSelf: 'flex-end',
              borderRadius: 0.8,
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              py: 0.8,
              fontSize: "1rem",
              color: theme.palette.common.white,
              background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 6px 20px ${theme.palette.secondary.main}66`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 5px 15px ${theme.palette.primary.main}66`,
              },
            }}
          >
            {isDisabled ? 'Updating...' : 'Update Credentials'}
          </Button>
        </Stack>
      </BlurWrapper>
    </Box>
  );
}

export default ChangeCredentials;
