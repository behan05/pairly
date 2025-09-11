import React, { useEffect } from 'react';

// MUI Components
import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
  FormHelperText,
  Chip
} from '@/MUI/MuiComponents';
import { SendIcon } from '@/MUI/MuiIcons';

// Custom UI Components
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import StyledText from '@/components/common/StyledText';
import BlurWrapper from '@/components/common/BlurWrapper';
import StyledActionButton from '@/components/common/StyledActionButton';

// Redux + Toast
import { useDispatch, useSelector } from 'react-redux';
import { updateTagsAndInterests } from '../../../redux/slices/profile/profileAction';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Predefined interest and chat style options
const interestOptions = [
  'Movies',
  'Music',
  'Gaming',
  'Sports',
  'Art',
  'Coding',
  'Reading',
  'Traveling',
  'Fitness',
  'Cooking'
];

const chatPreferences = [
  'Deep Talks',
  'Casual Chat',
  'Learning & Knowledge',
  'Humor / Memes',
  'No Small Talk'
];

function TagsAndInterests() {
  const dispatch = useDispatch();
  const { profileData, loading } = useSelector((state) => state.profile);

  // Form data state
  const [formData, setFormData] = React.useState({
    interests: [],
    personality: '',
    chatStyles: [],
    strictInterestMatch: false
  });

  // Error state for validation messages
  const [error, setError] = React.useState({});

  // Populate formData with existing profile data when available
  useEffect(() => {
    if (profileData) {
      setFormData({
        interests: profileData?.interests || [],
        personality: profileData?.personality || '',
        chatStyles: profileData?.chatStyles || [],
        strictInterestMatch: profileData?.strictInterestMatch || false
      });
    }
  }, [profileData]);

  // Toggle interest tags (chips)
  const handleTagToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(tag)
        ? prev.interests.filter((t) => t !== tag)
        : [...prev.interests, tag]
    }));
  };

  // Toggle chat styles (checkboxes)
  const handleChatStyleToggle = (style) => {
    setFormData((prev) => ({
      ...prev,
      chatStyles: prev.chatStyles.includes(style)
        ? prev.chatStyles.filter((s) => s !== style)
        : [...prev.chatStyles, style]
    }));
  };

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({}); // Clear previous errors

    let hasErrors = false;
    const errors = {};

    // Validate interests (1-5)
    if (formData.interests.length < 1 || formData.interests.length > 5) {
      hasErrors = true;
      errors.interests = 'Please select between 1 to 5 interests.';
    }

    // Validate personality
    if (!formData.personality) {
      hasErrors = true;
      errors.personality = 'Please select your personality type.';
    }

    // Validate chat styles (1-3)
    if (!formData.chatStyles.length || formData.chatStyles.length > 3) {
      hasErrors = true;
      errors.chatStyles = 'Please select between 1 to 3 chat styles.';
    }

    if (hasErrors) {
      setError(errors);
      return;
    }

    // Dispatch update action
    try {
      const response = await dispatch(updateTagsAndInterests(formData));
      setTimeout(() => {
        toast.success(response?.message || 'Preferences updated successfully!');
      }, 500);
    } catch (error) {
      toast.error(error?.error || 'An error occurred while updating preferences.');
    }
  };

  return (
    <Box component="section">
      <ToastContainer position="top-right" autoClose={1000} theme="colored" />

      {/* Page Header with back button */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo="/pairly/profile" text="Tags And Interests" />
      </Stack>

      {/* Form wrapper with blur styling */}
      <BlurWrapper component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Section Heading */}
          <Typography textAlign="center" variant="h5" fontWeight={600}>
            Your <StyledText text="Tags & Interests" />
          </Typography>

          {/* Subheading/Instructions */}
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Select and share your top interests. Our intelligent algorithm will use them to improve
            your matching experience.
          </Typography>

          {/* Interests Chips */}
          <FormControl fullWidth error={Boolean(error?.interests)}>
            <Typography gutterBottom>Select Interests</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {interestOptions.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  clickable
                  color={formData.interests.includes(tag) ? 'primary' : 'default'}
                  onClick={() => handleTagToggle(tag)}
                />
              ))}
            </Box>
            {error?.interests && <FormHelperText>{error.interests}</FormHelperText>}
          </FormControl>

          {/* Personality Dropdown */}
          <FormControl fullWidth error={Boolean(error?.personality)}>
            <InputLabel id="personality-label">Personality Type</InputLabel>
            <Select
              labelId="personality-label"
              id="personality"
              name="personality"
              value={formData.personality}
              label="Personality Type"
              onChange={(e) => setFormData((prev) => ({ ...prev, personality: e.target.value }))}
            >
              <MenuItem value="introvert">Introvert</MenuItem>
              <MenuItem value="extrovert">Extrovert</MenuItem>
              <MenuItem value="ambivert">Ambivert</MenuItem>
            </Select>
            {error?.personality && <FormHelperText>{error.personality}</FormHelperText>}
          </FormControl>

          {/* Chat Style Checkboxes */}
          <FormControl component="fieldset" error={Boolean(error?.chatStyles)}>
            <Typography gutterBottom>Preferred Chat Style</Typography>
            <FormGroup>
              {chatPreferences.map((style) => (
                <FormControlLabel
                  key={style}
                  control={
                    <Checkbox
                      checked={formData.chatStyles.includes(style)}
                      onChange={() => handleChatStyleToggle(style)}
                    />
                  }
                  label={style}
                />
              ))}
            </FormGroup>
            {error?.chatStyles && <FormHelperText>{error.chatStyles}</FormHelperText>}
          </FormControl>

          {/* Strict Matching Toggle */}
          <FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.strictInterestMatch}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      strictInterestMatch: e.target.checked
                    }))
                  }
                />
              }
              label={
                formData.strictInterestMatch
                  ? 'Strict Interest Match: ON'
                  : 'Strict Interest Match: OFF'
              }
            />
          </FormControl>

          {/* Submit Button */}
          <StyledActionButton endIcon={<SendIcon />} type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </StyledActionButton>
        </Stack>
      </BlurWrapper>
    </Box>
  );
}

export default TagsAndInterests;
