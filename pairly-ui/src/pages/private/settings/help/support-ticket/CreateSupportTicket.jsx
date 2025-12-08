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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SETTINGS_API } from '@/api/config';
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';

function CreateSupportTicket() {
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
    document.title = 'Pairly - Create Support Ticket';
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
      const headers = getAuthHeaders();
      const response = await axios.post(`${SETTINGS_API}/contact-support`, formData, { headers });
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
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Stack mb={2}>
        <NavigateWithArrow redirectTo="/pairly/settings/help" text="Create Support Ticket" />
      </Stack>

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
        {/* === Heading === */}
        <Stack direction="column" textAlign="center">
          <Typography variant="h5" fontWeight={600} mb={1} color="text.primary">
            Create a <StyledText text="Support Ticket" />
          </Typography>

          <Typography variant="body2" fontWeight={400} mb={4} color="text.secondary">
            If you’re facing an issue or need help, create a support ticket below.
            Our team will get back to you as soon as possible.
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
            size={'small'}
            value={formData.fullName}
            onChange={handleChange}
            error={Boolean(error.fullName)}
            helperText={error.fullName}
          />

          <TextField
            label="Email Address"
            name="email"
            size={'small'}
            placeholder="connect@support.com"
            fullWidth
            autoComplete="on"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(error.email)}
            helperText={error.email}
          />

          <FormControl size={'small'} fullWidth error={Boolean(error.category)}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="bug">Bug / Technical Issue</MenuItem>
              <MenuItem value="billing">Billing & Payments</MenuItem>
              <MenuItem value="account">Account Issue</MenuItem>
              <MenuItem value="feature">Feature Request</MenuItem>
              <MenuItem value="general">General Question</MenuItem>
            </Select>
            {error.category && <FormHelperText>{error.category}</FormHelperText>}
          </FormControl>

          <TextField
            label="Subject"
            name="subject"
            size={'small'}
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
            size={'small'}
            placeholder="Please describe your issue or question in detail..."
            fullWidth
            multiline
            minRows={4}
            autoComplete="on"
            value={formData.message}
            onChange={handleChange}
            error={Boolean(error.message)}
            helperText={error.message}
          />

          <StyledActionButton
            type="submit"
            onClick={handleSubmit}
            disabled={isDisabled}
            endIcon={<SendIcon />}
            text={isDisabled ? 'Submitting...' : 'Submit Ticket'}
            sx={{
              alignSelf: 'flex-end',
              textShadow: '0 0 2px #000'
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
}

export default CreateSupportTicket;
