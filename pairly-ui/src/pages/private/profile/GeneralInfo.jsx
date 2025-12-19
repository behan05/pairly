import * as React from 'react';
import {
  Avatar,
  Box,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  IconButton,
} from '@/MUI/MuiComponents';
import { SendIcon, EditIcon, RefreshIcon } from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import StyledText from '@/components/common/StyledText';
import StyledActionButton from '@/components/common/StyledActionButton';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { updateGeneralInfo, getProfile } from '@/redux/slices/profile/profileAction';
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

  React.useEffect(() => {
    dispatch(getProfile());
  }, []);

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

  const diverseBios = [
    `${formData.fullName || '__'}, ${formData.age || '__'} ${formData.gender || '__'} who values real talk 🌿 Curious about ideas and people who challenge me to grow.`,
    `Passionate about music, travel, and meaningful moments 🎶 I'm ${formData.fullName || '__'}, a ${formData.age || '__'}-year-old ${formData.gender || '__'} who loves connection.`,
    `Adventure seeker with a thoughtful soul 🌟 I'm ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'}, always chasing joy in the little things.`,
    `Mindful dreamer 🎨 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} who values honesty, creativity, and spontaneous fun.`,
    `Book lover and coffee enthusiast ☕ I'm ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} always chasing growth and good stories.`,
    `Empathy-driven and curious 🔥 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} who believes in meaningful connections over small talk.`,
    `Cheerful and adventurous ✨ I'm ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} here for deep chats and shared experiences.`,
    `Creative thinker and eternal learner 🎭 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} who loves music, art, and real conversations.`,
    `Optimist who values emotional honesty 💡 I'm ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'}, let’s connect beyond the surface.`,
    `Seeking calm in the chaos 🌙 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} who’s open to meaningful talks and new perspectives.`,
    `Curious mind with a playful heart 🎈 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} who enjoys spontaneous fun and thoughtful chats.`,
    `Driven by creativity and connection 🎧 I'm ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} always chasing good energy.`,
    `Introvert with a loud imagination 🧠 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} who loves deep thoughts and quiet moments.`,
    `Explorer of ideas and emotions 🧭 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} here to learn, laugh, and grow.`,
    `Kind soul with a curious spark 🔍 I'm ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} let’s talk about life, dreams, and everything in between.`,
    `Open-hearted and open-minded 💬 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} who values honesty and shared experiences.`,
    `Lover of stories, silence, and soulful music 🎵 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} here for real connection.`,
    `Thoughtful and spontaneous 🌈 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} who enjoys meaningful moments and playful energy.`,
    `Empathetic listener and joyful explorer 🚲 I'm ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} let’s share something real.`,
    `Big heart, curious mind 🪐 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} always learning and looking for connection.`,
    `Gentle soul with bold ideas 🖌️ ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} passionate about creativity and kindness.`,
    `Here for honest chats and shared laughter 😂 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} who values depth and joy.`,
    `Quiet thinker, loud dreamer 🌌 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} let’s connect beyond the surface.`,
    `Life enthusiast with a love for connection 🫶 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} here to vibe and grow.`,
    `Soulful, curious, and always evolving 🪴 ${formData.fullName || '__'}, ${formData.age || '__'}, ${formData.gender || '__'} let’s build something meaningful.`
  ];

  // Pick a random bio
  const randomBio = diverseBios[Math.floor(Math.random() * diverseBios.length)];

  const inputField = [
    {
      label: 'Your Full Name',
      placeholder: 'e.g. Behan Kumar',
      size: 'small',
      name: 'fullName',
      value: formData.fullName,
      fullWidth: true,
      error: Boolean(error.fullName),
      helperText: error.fullName || ''
    },
    {
      label: 'Your Age',
      placeholder: 'e.g. 19',
      size: 'small',
      name: 'age',
      value: formData.age,
      fullWidth: true,
      error: Boolean(error.age),
      helperText: error.age || 'You must be at least 18 years old to use this platform.'
    },
    {
      label: 'Gender',
      placeholder: 'e.g. Male',
      size: 'small',
      name: 'gender',
      value: formData.gender,
      fullWidth: true,
      error: Boolean(error.gender),
      helperText: error.gender || ''
    },
    {
      label: 'Pronouns',
      placeholder: 'e.g. He/Him, She/Her, They/Them',
      size: 'small',
      name: 'pronouns',
      value: formData.pronouns,
      fullWidth: true,
      error: Boolean(error.pronouns),
      helperText: error.pronouns || ''
    },
    {
      label: 'Short Bio',
      placeholder: 'Write a short introduction...',
      size: 'small',
      name: 'shortBio',
      value: formData.shortBio || randomBio,
      multiline: true,
      rows: 3,
      fullWidth: true,
      error: Boolean(error.shortBio),
      helperText: error.shortBio || 'Maximum 200 characters. This will be shown on your profile.',
      InputProps: {
        endAdornment: (
          <Tooltip title="Change Bio" arrow>
            <IconButton
              size="small"
              onClick={() => {
                const newBio = diverseBios[Math.floor(Math.random() * diverseBios.length)];
                setFormData((prev) => ({ ...prev, shortBio: newBio }));
              }}
              sx={{
                p: 0.5,
                color: 'primary.main',
                backgroundColor: 'action.hover',
                '&:hover': {
                  color: 'primary.dark',
                }
              }}
            >
              <RefreshIcon
                fontSize="medium"
                sx={{
                  transition: 'transform 0.6s ease-in-out',
                  color: 'info.main',
                  '&:hover': {
                    color: 'warning.main',
                    transform: 'rotate(360deg)',
                  }
                }}
              />
            </IconButton>
          </Tooltip>
        )
      }
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

    const preview = URL.createObjectURL(file);
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
      payload.append('profileImage', formData.profileImage);
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
    <Box
      component={'section'}
      sx={{ p: 2 }}
    >

      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly/profile'} text={'General Info'} />
      </Stack>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 2
        }}
      >
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
        <Stack gap={2}>
          {inputField.map((input, index) => (
            <Stack key={index}>
              <TextField
                {...input}
                onChange={handleChange}
              />
            </Stack>
          ))}
        </Stack>

        {/* Submit Button */}
        <StyledActionButton
          onClick={handleSubmit}
          endIcon={<SendIcon />}
          type="submit"
          disabled={isDisabled}
          text={isDisabled ? 'Saving...' : 'Save Changes'}
          sx={{
            maxWidth: 300,
            alignSelf: 'flex-start'
          }}
        />
      </Box>
    </Box>
  );
}

export default GeneralInfo;
