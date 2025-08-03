import * as React from 'react';
import {
  Box,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@/MUI/MuiComponents';

import { SendIcon } from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import StyledText from '@/components/common/StyledText';
import StyledActionButton from '@/components/common/StyledActionButton';
import BlurWrapper from '@/components/common/BlurWrapper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SETTINGS_API } from '@/api/config';
import axios from 'axios';

function HelpContact() {
  const [isDisabled, setIsDisabled] = React.useState(false);

  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });

  const [error, setError] = React.useState({});

  React.useEffect(() => {
    document.title = 'Connect - Contact Support';
  }, []);

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newError = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newError.fullName = 'Name is required.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newError.email = 'Email is required.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newError.email = 'Enter a valid email address.';
      isValid = false;
    }

    if (!formData.category.trim()) {
      newError.category = 'Please select a category.';
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newError.subject = 'Subject is required.';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newError.message = 'Message is required.';
      isValid = false;
    }

    setError(newError);

    if (!isValid) return;
    setIsDisabled(true);

    try {
      const response = await axios.post(`${SETTINGS_API}/contact-support`, formData);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong.');
    }

    setFormData({
      fullName: '',
      email: '',
      category: '',
      subject: '',
      message: ''
    });

    setError({});
    setIsDisabled(false);
  };

  return (
    <Box flexDirection="column">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <Stack mb={2}>
        <NavigateWithArrow redirectTo="/connect/settings/help" text="Contact Support" />
      </Stack>

      <BlurWrapper component="form" onSubmit={handleSubmit}>
        {/* === Heading === */}
        <Stack direction="column" textAlign="center">
          <Typography variant="h5" fontWeight={600} mb={1} color="text.primary">
            Need <StyledText text="Assistance?" />
          </Typography>

          <Typography variant="body2" fontWeight={400} mb={4} color="text.secondary">
            We're here to help. If you're facing issues or have questions, please fill out the form
            below and our support team will get back to you shortly.
          </Typography>
        </Stack>

        {/* === Form Fields === */}
        <Stack gap={1}>
          <TextField
            label="Full Name"
            name="fullName"
            placeholder="Behan Kumar"
            fullWidth
            autoComplete="on"
            value={formData.fullName}
            onChange={handleChange}
            error={Boolean(error.fullName)}
            helperText={error.fullName}
          />

          <TextField
            label="Email Address"
            name="email"
            placeholder="connect@support.com"
            fullWidth
            autoComplete="on"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(error.email)}
            helperText={error.email}
          />

          <FormControl fullWidth error={Boolean(error.category)}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="general">General Question</MenuItem>
              <MenuItem value="account">Account Issue</MenuItem>
              <MenuItem value="feedback">Feedback</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            {error.category && <FormHelperText>{error.category}</FormHelperText>}
          </FormControl>

          <TextField
            label="Subject"
            name="subject"
            placeholder="Unable to find FAQ for my issue"
            fullWidth
            autoComplete="on"
            value={formData.subject}
            onChange={handleChange}
            error={Boolean(error.subject)}
            helperText={error.subject}
          />

          <TextField
            label="Message"
            name="message"
            placeholder="Please describe your issue or question in detail..."
            fullWidth
            multiline
            minRows={8}
            autoComplete="on"
            value={formData.message}
            onChange={handleChange}
            error={Boolean(error.message)}
            helperText={error.message}
          />

          <StyledActionButton
            type="submit"
            disabled={isDisabled}
            endIcon={<SendIcon sx={{ color: 'success.main' }} />}
          >
            {isDisabled ? 'Sending Request...' : 'Request'}
          </StyledActionButton>
        </Stack>
      </BlurWrapper>
    </Box>
  );
}

export default HelpContact;
