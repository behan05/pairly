import React from 'react';
import { Box, Typography, Stack, Paper, Button } from '../../../MUI/MuiComponents';

function SubscriptionManager() {
  return (
    <Box px={2} py={3}>
      <Typography variant="h5" mb={3}>
        Payments & Subscriptions
      </Typography>

      {/* Current subscription card */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack spacing={1}>
          <Typography variant="h6">Current Plan: Free</Typography>
          <Typography variant="body2">Upgrade anytime to enjoy premium features</Typography>
          <Button variant="contained" sx={{ mt: 1 }}>Upgrade</Button>
        </Stack>
      </Paper>

      {/* Payment history / invoices section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" mb={2}>Payment History</Typography>
        <Typography variant="body2">No transactions yet</Typography>
      </Paper>
    </Box>
  );
}

export default SubscriptionManager;
