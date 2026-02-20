import React, { useState } from 'react';
import { Box, TextField, Typography, Stack, useTheme } from '@/MUI/MuiComponents';
import { SendIcon } from '@/MUI/MuiIcons';
import StyledText from '@/components/common/StyledText';
import StyledActionButton from '@/components/common/StyledActionButton';
import { toast, ToastContainer } from 'react-toastify';

function Contact() {
  const theme = useTheme();

  React.useEffect(() => {
    document.title = 'Pairly - Support';
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [error, setError] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Enter a valid email';
    }

    if (!formData.message.trim()) errors.message = 'Message cannot be empty';

    setError(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setIsSubmitting(true);
      // Simulate API Call
      await new Promise((res) => setTimeout(res, 800));

      toast.success('Message sent successfully 🎉');

      // Clear form
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack sx={{
      borderRadius: 1,
      maxWidth: 450,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      my: '6dvh',
      mx: 'auto',
      border: `1px solid ${theme.palette.divider}`,
      p: 2
    }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        {/* ToastContainer added locally */}
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />

        <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
          Get in {<StyledText text="Touch" />}
        </Typography>
        <Typography variant="body1" fontWeight={400} textAlign="center" mb={4}>
          We'd love to hear from you! Please fill out the form below.
        </Typography>

        <Stack spacing={3}>
          <TextField
            fullWidth
            size='small'
            label="Full Name"
            variant="outlined"
            name="name"
            placeholder="Pairly"
            value={formData.name}
            onChange={handleChange}
            error={!!error.name}
            helperText={error.name}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
            <TextField
              fullWidth
              size='small'
              label="Email Address"
              variant="outlined"
              name="email"
              placeholder="Pairly@gmail.com"
              value={formData.email}
              onChange={handleChange}
              error={!!error.email}
              helperText={error.email}
            />

            <TextField
              fullWidth
              size='small'
              label="Phone (Optional)"
              variant="outlined"
              name="phone"
              placeholder="+91 896 901 XXXX"
              value={formData.phone}
              onChange={handleChange}
            />
          </Stack>

          <TextField
            fullWidth
            size='small'
            label="Your Message"
            variant="outlined"
            name="message"
            multiline
            minRows={3}
            placeholder="Type your message here..."
            value={formData.message}
            onChange={handleChange}
            error={!!error.message}
            helperText={error.message}
          />

          <StyledActionButton
            onClick={handleSubmit}
            variant="outlined"
            endIcon={<SendIcon sx={{ color: 'text.primary' }} />}
            size="large"
            disabled={isSubmitting}
            text={isSubmitting ? 'Sending...' : 'Drop a Line'}
            sx={{
              alignSelf: 'end'
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
}

export default Contact;
