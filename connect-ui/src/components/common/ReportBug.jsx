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
import BlurWrapper from '../common/BlurWrapper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StyledActionButton from '../common/StyledActionButton';
import { SETTINGS_API } from '@/api/config';
import axios from 'axios';

function ReportBug() {
  React.useEffect(() => {
    document.title = 'Connect - Report Bug';

    // Prefill device info
    const platform = navigator.platform;
    const userAgent = navigator.userAgent;
    setFormData((prev) => ({
      ...prev,
      deviceInfo: `${platform}, ${userAgent}`
    }));
  }, []);

  const [isDisabled, setIsDisabled] = React.useState(false);
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

  const [error, setError] = React.useState({
    issueType: '',
    title: '',
    description: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      toast.error('Only image files are allowed for screenshots.');
      return;
    }
    setFormData((prev) => ({ ...prev, screenshot: file || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    let newErrors = {};

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

    try {
      const response = await axios.post(`${SETTINGS_API}/report-problem`, formData);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong.');
    }

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

  return (
    <Box flexDirection="column">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <BlurWrapper component="form" onSubmit={handleSubmit}>
        <Stack direction={'column'} textAlign="center">
          <Typography variant="h4" fontWeight={600} mb={1}>
            Report a <StyledText text="Problem" />
          </Typography>

          <Typography variant="body2" fontWeight={400} gutterBottom mb={4} color="text.secondary">
            Encountered a bug or issue? Help us improve Connect by reporting it below. The more
            details you provide, the faster we can fix it.
          </Typography>
        </Stack>

        <Stack direction={'column'} gap={1}>
          <FormControl fullWidth error={Boolean(error.issueType)}>
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

          <TextField
            label="Bug Title"
            placeholder="e.g., Chat freezes after sending image"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={Boolean(error.title)}
            helperText={error.title}
            fullWidth
          />

          <TextField
            label="Description"
            placeholder="e.g., The chat screen freezes when I send an image over mobile data."
            name="description"
            value={formData.description}
            multiline
            minRows={10}
            onChange={handleChange}
            error={Boolean(error.description)}
            helperText={error.description}
            fullWidth
          />

          <TextField
            label="Expected Behavior (Optional)"
            placeholder="e.g., The message should appear instantly after hitting send."
            name="expectedBehavior"
            value={formData.expectedBehavior}
            multiline
            minRows={4}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Actual Behavior (Optional)"
            placeholder="e.g., The message stays stuck on 'Sending...' and never delivers."
            name="actualBehavior"
            value={formData.actualBehavior}
            multiline
            minRows={6}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Device Info (Optional)"
            placeholder="e.g., Android 13, Chrome 114, Samsung Galaxy S21"
            name="deviceInfo"
            value={formData.deviceInfo}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Email"
            placeholder="connect@support.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(error.email)}
            helperText={error.email}
            fullWidth
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<UploadIcon />} // optional icon
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

          <StyledActionButton
            type="submit"
            disabled={isDisabled}
            endIcon={<SendIcon sx={{ color: 'success.main' }} />}
          >
            {isDisabled ? 'Sending...' : 'Report Issue'}
          </StyledActionButton>
        </Stack>
      </BlurWrapper>
    </Box>
  );
}

export default ReportBug;
