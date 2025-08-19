import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack, useTheme } from '@/MUI/MuiComponents';
import { SendIcon } from '@/MUI/MuiIcons';
import StyledText from '@/components/common/StyledText';
import { toast, ToastContainer } from 'react-toastify';

function Contact() {
  const theme = useTheme();

  React.useEffect(() => {
    document.title = 'Connect - Contact';
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 6,
        px: { xs: 2, sm: 4, md: 6 },
        py: 4,
        borderRadius: 1,
        backdropFilter: 'blur(14px)',
        backgroundColor: 'transparent',
        maxWidth: 800,
        mx: 'auto'
      }}
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
          label="Full Name"
          variant="outlined"
          name="name"
          placeholder="Behan Kumar"
          value={formData.name}
          onChange={handleChange}
          error={!!error.name}
          helperText={error.name}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            name="email"
            placeholder="connect@connect.com"
            value={formData.email}
            onChange={handleChange}
            error={!!error.email}
            helperText={error.email}
          />

          <TextField
            fullWidth
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
          label="Your Message"
          variant="outlined"
          name="message"
          multiline
          minRows={4}
          placeholder="Type your message here..."
          value={formData.message}
          onChange={handleChange}
          error={!!error.message}
          helperText={error.message}
        />

        <Button
          type="submit"
          variant="outlined"
          endIcon={<SendIcon sx={{ color: 'success.main' }} />}
          size="large"
          disabled={isSubmitting}
          sx={{
            alignSelf: 'flex-end',
            px: { xs: 2, sm: 3 },
            py: { xs: 0.5, sm: 1 },
            background: `transparent`,
            backdropFilter: 'blur(14px)',
            border: 'none',
            borderTopRightRadius: '6px',
            borderBottomRightRadius: '6px',
            borderBottom: `1px dotted ${theme.palette.success.main}`,
            textTransform: 'none',
            color: 'primary.contrastText',
            letterSpacing: 0.2,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}
        >
          {isSubmitting ? 'Sending...' : 'Drop a Line'}
        </Button>
      </Stack>
    </Box>
  );
}

export default Contact;
