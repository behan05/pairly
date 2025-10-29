import { useEffect, useState } from 'react';
import ChatSidebarHeader from '../features/chat/common/ChatSidebarHeader';
import {
  Box,
  Stack,
  FormControl,
  Select,
  MenuItem,
} from '../MUI/MuiComponents';
import CurrentSubscription from './CurrentSubscription';
import PaymentHistory from './PaymentHistory';

function SubscriptionManager() {
  const [selectedTab, setSelectedTab] = useState("current_subscription");

  return (
    <Box px={1}>
      {/* Header */}
      <ChatSidebarHeader />

      <Stack
        sx={{
          borderRadius: 1,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.background.paper}E6 0%, ${theme.palette.background.default}BF 100%)`,
          backdropFilter: "blur(10px)",
          boxShadow: (theme) =>
            `0 4px 20px ${theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.1)"}`,
        }}>
        {/* Sub header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 2,
            borderRadius: 2,
          }}
        >
          {/* Select Section */}
          <FormControl
            size="small"
            sx={{
              minWidth: 220,
              "& .MuiInputLabel-root": { color: (theme) => theme.palette.text.secondary },
              "& .MuiOutlinedInput-root": {
                color: (theme) => theme.palette.text.primary,
                borderRadius: 2,
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                "& fieldset": { borderColor: (theme) => theme.palette.divider },
                "&:hover fieldset": { borderColor: (theme) => theme.palette.primary.main },
                "&.Mui-focused fieldset": { borderColor: (theme) => theme.palette.info.main },
              },
              "& .MuiSvgIcon-root": { color: (theme) => theme.palette.info.main },
            }}
          >
            <Select
              labelId="select-info-label"
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value)}
              sx={{
                fontWeight: 600,
                "& .MuiSelect-select": {
                  py: 1,
                },
              }}
            >
              <MenuItem value="current_subscription">Current Subscription</MenuItem>
              <MenuItem value="payment_history">Payment History</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Main Content */}
        {selectedTab === 'current_subscription' ? <CurrentSubscription /> : <PaymentHistory />}
      </Stack>
    </Box>
  );
}

export default SubscriptionManager;
