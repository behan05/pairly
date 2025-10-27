import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Divider,
  useTheme
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventIcon from '@mui/icons-material/Event';
import { Link } from 'react-router-dom';

const VirtualComedyHall = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`
      }}
    >
      {/* Header Section */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <EventIcon sx={{ fontSize: 34, color: theme.palette.secondary.main }} />
        <Typography variant="h5" fontWeight={700}>
          Virtual Comedy Hall 🎭
        </Typography>
      </Stack>

      {/* Event Creation Section */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: theme.palette.background.paper,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Create Your Comedy Event
        </Typography>
        <Divider />
        <TextField
          fullWidth
          label="Event Title"
          placeholder="Enter a fun title for your show"
          variant="outlined"
        />
        <TextField
          fullWidth
          type="datetime-local"
          label="Date & Time"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          placeholder="Describe your event, jokes, or theme..."
        />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<EventIcon />}
          sx={{
            alignSelf: 'flex-end',
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          Create Event
        </Button>
      </Paper>

      {/* Earnings Info */}
      <Paper
        elevation={2}
        sx={{
          p: 2.5,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.success.main}22, ${theme.palette.success.light}33)`
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <MonetizationOnIcon sx={{ color: theme.palette.success.main, fontSize: 30 }} />
          <Box>
            <Typography variant="body1" fontWeight={600}>
              Earn Real Money
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can monetize your comedy events. View our{' '}
              <Link
                to="/pairly/terms-of-use"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: 'underline'
                }}
              >
                Terms & Conditions
              </Link>{' '}
              for payout policies.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default VirtualComedyHall;
