import * as React from 'react';
import { Avatar, Box, Stack, TextField, Tooltip, Typography, useTheme } from '@/MUI/MuiComponents';

import { SendIcon, EditIcon } from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import BlurWrapper from '@/components/common/BlurWrapper';
import StyledText from '@/components/common/StyledText';
import StyledActionButton from '@/components/common/StyledActionButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { updateGeneralInfo } from '@/redux/slices/profile/profileAction';
import { useDispatch, useSelector } from 'react-redux';

function GeneralInfo() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.profile);

  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isHover, setIsHover] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  const [formData, setFormData] = React.useState({
    fullName: '',
    age: '',
    gender: '',
    pronouns: '',
    profileImage: null,
    shortBio: ''
  });

  const [error, setError] = React.useState({
    fullName: '',
    age: '',
    gender: '',
    pronouns: '',
    shortBio: '',
    profileImage: ''
  });

  // Pre-fill data when profileData is loaded
  React.useEffect(() => {
    if (profileData) {
      setFormData({
        fullName: profileData.fullName || '',
        age: profileData.age || '',
        gender: profileData.gender || '',
        pronouns: profileData.pronouns || '',
        profileImage: profileData.profileImage || null,
        shortBio: profileData.shortBio || ''
      });
    }
  }, [profileData]);

  const inputField = [
    {
      label: 'Your Full Name',
      placeholder: 'e.g. Behan Kumar',
      name: 'fullName',
      value: formData.fullName,
      fullWidth: true,
      error: Boolean(error.fullName),
      helperText: error.fullName || ''
    },
    {
      label: 'Your Age',
      placeholder: 'e.g. 19',
      name: 'age',
      value: formData.age,
      fullWidth: true,
      error: Boolean(error.age),
      helperText: error.age || 'You must be at least 18 years old to use this platform.'
    },
    {
      label: 'Gender',
      placeholder: 'e.g. Male',
      name: 'gender',
      value: formData.gender,
      fullWidth: true,
      error: Boolean(error.gender),
      helperText: error.gender || ''
    },
    {
      label: 'Pronouns',
      placeholder: 'e.g. He/Him, She/Her, They/Them',
      name: 'pronouns',
      value: formData.pronouns,
      fullWidth: true,
      error: Boolean(error.pronouns),
      helperText: error.pronouns || ''
    },
    {
      label: 'Short Bio',
      placeholder: 'Write a short introduction...',
      name: 'shortBio',
      value: formData.shortBio,
      multiline: true,
      rows: 3,
      fullWidth: true,
      error: Boolean(error.shortBio),
      helperText: error.shortBio || 'Maximum 200 characters. This will be shown on your profile.'
    }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return setError((prev) => ({
        ...prev,
        profileImage: 'Only JPG, PNG, or WEBP formats are allowed.'
      }));
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return setError((prev) => ({
        ...prev,
        profileImage: 'File size must be less than 2MB.'
      }));
    }

    setError((prev) => ({ ...prev, profileImage: '' }));
    setFormData((prev) => ({ ...prev, profileImage: file }));

    const preview = URL.createObjectURL(file); // ✅
    setPreviewUrl(preview);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
      hasError = true;
    }

    if (!formData.age || isNaN(formData.age) || Number(formData.age) < 18) {
      newErrors.age = 'You must be 18 or older.';
      hasError = true;
    }

    if (!formData.gender.trim()) {
      newErrors.gender = 'Gender is required.';
      hasError = true;
    }

    if (!formData.pronouns.trim()) {
      newErrors.pronouns = 'Pronouns are required.';
      hasError = true;
    }

    if (!formData.shortBio.trim()) {
      newErrors.shortBio = 'Short bio cannot be empty.';
      hasError = true;
    }

    if (formData.shortBio.trim().length > 200) {
      newErrors.shortBio = 'Bio should be under 200 characters.';
      hasError = true;
    }

    setError(newErrors);
    if (hasError) return;

    const payload = new FormData();
    payload.append('fullName', formData.fullName);
    payload.append('age', formData.age);
    payload.append('gender', formData.gender);
    payload.append('pronouns', formData.pronouns);
    payload.append('shortBio', formData.shortBio);

    if (formData.profileImage instanceof File) {
      payload.append('profileImage', formData.profileImage); // not base64
    }

    setIsDisabled(true);

    try {
      const response = await dispatch(updateGeneralInfo(payload));
      toast.success(response.message || 'Profile updated successfully!');
      setIsDisabled(false);
    } catch (error) {
      toast.error(response?.error || 'Failed to update profile.');
      setIsDisabled(false);
    }
  };

  return (
    <Box component={'section'}>
      <ToastContainer position="top-right" autoClose={1000} theme="colored" />

      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/connect/profile'} text={'General Info'} />
      </Stack>

      <BlurWrapper component="form" onSubmit={handleSubmit}>
        <Stack>
          <Typography textAlign="center" variant="h5" fontWeight={600} gutterBottom>
            General <StyledText text={'Information'} />
          </Typography>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Fill your personal details to help others know you better.
          </Typography>
        </Stack>

        {/* Profile Picture */}
        <Tooltip title="Edit Profile Picture" arrow>
          <Box sx={{ width: 100, mx: 'auto' }}>
            <Box
              sx={{ position: 'relative', width: 100, height: 100 }}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              <label htmlFor="upload-avatar">
                <input
                  accept="image/*"
                  id="upload-avatar"
                  type="file"
                  hidden
                  onChange={handleImageChange}
                />
                <Avatar
                  src={previewUrl || formData.profileImage}
                  alt="profile image"
                  aria-label="profile image"
                  sx={{
                    width: 100,
                    height: 100,
                    cursor: 'pointer',
                    boxShadow: theme.shadows[2]
                  }}
                />
                {isHover && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      bgcolor: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%'
                    }}
                  >
                    <EditIcon sx={{ color: '#fff' }} />
                  </Box>
                )}
              </label>
            </Box>

            {error.profileImage && (
              <Typography variant="caption" color="error" textAlign="center" sx={{ mt: 1 }}>
                {error.profileImage}
              </Typography>
            )}
          </Box>
        </Tooltip>

        {/* Input Fields */}
        <Stack gap={1.5}>
          {inputField.map((input, index) => (
            <Stack key={index}>
              <TextField {...input} onChange={handleChange} />
            </Stack>
          ))}
        </Stack>

        {/* Submit Button */}
        <StyledActionButton endIcon={<SendIcon />} type="submit" disabled={isDisabled}>
          {isDisabled ? 'Saving...' : 'Save Changes'}
        </StyledActionButton>
      </BlurWrapper>
    </Box>
  );
}

export default GeneralInfo;
