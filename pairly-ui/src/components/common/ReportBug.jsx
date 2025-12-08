import * as React from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@/MUI/MuiComponents';
import { SendIcon, UploadIcon } from '@/MUI/MuiIcons';
import StyledText from '../common/StyledText';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StyledActionButton from '../common/StyledActionButton';
import { SETTINGS_API } from '@/api/config';
import axios from 'axios';

function ReportBug() {
  // Set document title and prefill device info on mount
  React.useEffect(() => {
    document.title = 'Pairly - Report Bug';

    // Get platform and user agent for device info
    const platform = navigator.platform;
    const userAgent = navigator.userAgent;
    setFormData((prev) => ({
      ...prev,
      deviceInfo: `${platform}, ${userAgent}`
    }));
  }, []);

  // State for disabling submit button during request
  const [isDisabled, setIsDisabled] = React.useState(false);

  // State for form data
  const [formData, setFormData] = React.useState({
    issueType: '',
    title: '',
    description: '',
    expectedBehavior: '',
    actualBehavior: '',
    deviceInfo: '',
    screenshot: null,
    email: ''
  });

  // State for form validation errors
  const [error, setError] = React.useState({
    issueType: '',
    title: '',
    description: '',
    email: ''
  });

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle screenshot file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      toast.error('Only image files are allowed for screenshots.');
      return;
    }
    setFormData((prev) => ({ ...prev, screenshot: file || null }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    let newErrors = {};

    // Validate required fields
    if (formData.issueType.trim() === '') {
      newErrors.issueType = 'Please select an issue type.';
      isValid = false;
    }
    if (formData.title.trim() === '') {
      newErrors.title = 'Issue title is required.';
      isValid = false;
    }
    if (formData.description.trim() === '') {
      newErrors.description = 'Please provide a detailed description.';
      isValid = false;
    }
    if (formData.email.trim() === '') {
      newErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    setError(newErrors);
    if (!isValid) return;

    setIsDisabled(true);

    // Submit bug report to API
    try {
      const response = await axios.post(`${SETTINGS_API}/report-problem`, formData);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong.');
    }

    // Reset form after submission
    setFormData({
      issueType: '',
      title: '',
      description: '',
      expectedBehavior: '',
      actualBehavior: '',
      deviceInfo: '',
      screenshot: null,
      email: ''
    });
    setError({});
    setIsDisabled(false);
  };

  // Render bug report form UI
  return (
    <Box flexDirection="column" mt={8} maxWidth={600} mx={'auto'}>
      {/* Form wrapper with blur effect */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={(theme) => ({
          mt: 4,
          border: `1px dashed ${theme.palette.divider}`,
          p: 1,
          borderRadius: 1,
          maxWidth: 600,
          mx: 'auto'
        })}
      >
        {/* Header section */}
        <Stack direction={'column'} textAlign="center">
          <Typography variant="h4" fontWeight={600} mb={1}>
            Report a <StyledText text="Problem" />
          </Typography>

          <Typography variant="body2" fontWeight={400} gutterBottom mb={4} color="text.secondary">
            Encountered a bug or issue? Help us improve Pairly by reporting it below. The more
            details you provide, the faster we can fix it.
          </Typography>
        </Stack>

        {/* Form fields */}
        <Stack direction={'column'} gap={1}>
          {/* Issue type dropdown */}
          <FormControl size={'small'} fullWidth error={Boolean(error.issueType)}>
            <InputLabel id="issueType-label">Issue Type</InputLabel>
            <Select
              labelId="issueType-label"
              id="issueType"
              name="issueType"
              value={formData.issueType}
              label="Issue Type"
              onChange={handleChange}
            >
              <MenuItem value="bug">Bug</MenuItem>
              <MenuItem value="crash">Crash</MenuItem>
              <MenuItem value="ui-problem">UI Problem</MenuItem>
              <MenuItem value="performance">Performance</MenuItem>
              <MenuItem value="chat-error">Chat Error</MenuItem>
              <MenuItem value="matching-problem">Matching Problem</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            {error.issueType && <FormHelperText>{error.issueType}</FormHelperText>}
          </FormControl>

          {/* Bug title input */}
          <TextField
            label="Bug Title"
            size={'small'}
            placeholder="e.g., Chat freezes after sending image"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={Boolean(error.title)}
            helperText={error.title}
            fullWidth
          />

          {/* Description input */}
          <TextField
            label="Description"
            size={'small'}
            placeholder="e.g., The chat screen freezes when I send an image over mobile data."
            name="description"
            value={formData.description}
            multiline
            minRows={3}
            onChange={handleChange}
            error={Boolean(error.description)}
            helperText={error.description}
            fullWidth
          />

          {/* Expected behavior input (optional) */}
          <TextField
            label="Expected Behavior (Optional)"
            placeholder="e.g., The message should appear instantly after hitting send."
            name="expectedBehavior"
            value={formData.expectedBehavior}
            multiline
            minRows={3}
            onChange={handleChange}
            fullWidth
          />

          {/* Actual behavior input (optional) */}
          <TextField
            label="Actual Behavior (Optional)"
            placeholder="e.g., The message stays stuck on 'Sending...' and never delivers."
            name="actualBehavior"
            value={formData.actualBehavior}
            multiline
            minRows={3}
            onChange={handleChange}
            fullWidth
          />

          {/* Device info input (optional) */}
          <TextField
            label="Device Info (Optional)"
            size='small'
            placeholder="e.g., Android 13, Chrome 114, Samsung Galaxy S21"
            name="deviceInfo"
            value={formData.deviceInfo}
            onChange={handleChange}
            fullWidth
          />

          {/* Email input */}
          <TextField
            label="Email"
            size='small'
            placeholder="Pairly@support.chat"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(error.email)}
            helperText={error.email}
            fullWidth
          />

          {/* Screenshot upload button */}
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<UploadIcon />}
            sx={{
              color: 'text.primary',
              borderColor: 'divider',
              textTransform: 'none',
              justifyContent: 'flex-start',
              px: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 500,
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
          >
            Upload screenshot (Optional)
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {/* Submit button */}

          <StyledActionButton
            onClick={handleSubmit}
            variant="outlined"
            endIcon={<SendIcon />}
            size="large"
            disabled={isDisabled}
            text={isDisabled ? 'Sending...' : 'Report Issue'}
            sx={{
              textShadow: '0 0 2px #000',
              alignSelf: 'flex-end'
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
}

export default ReportBug;
