import {
  Stack,
  Typography,
  Box,
  Divider,
  useTheme,
  Button
} from "../MUI/MuiComponents";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StyledActionButton from "../components/common/StyledActionButton";

function CurrentSubscription() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { subscription, fullName, id: userAccountId, publicId } =
    useSelector((state) => state?.auth?.user) || {};

  const { plan, status, startDate, endDate, promoCode, discountAmount } =
    subscription || {};

  const isActive = status === "active";
  const isFreeUser = isActive && plan === "free";

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stack spacing={3} p={3}>
        {/* Header */}
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Subscription
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your current plan and billing details
          </Typography>
        </Box>

        {isFreeUser ? (
          <Typography variant="body2" color="text.secondary">
            You are currently on the <strong>Free plan</strong>. Upgrade to unlock
            premium features.
          </Typography>
        ) : (
          <>
            {/* User */}
            <Typography variant="body2" color="text.secondary">
              Account holder: <strong>{fullName}</strong>
            </Typography>

            <Divider />

            {/* Details */}
            <Stack spacing={2}>
              <InfoRow label="Plan" value={plan === "superPremium" ? "Super Premium" : plan} />
              <InfoRow
                label="Status"
                value={status}
                valueColor={isActive ? "success.main" : "text.secondary"}
              />
              <InfoRow
                label="Start date"
                value={startDate ? new Date(startDate).toLocaleDateString() : "—"}
              />
              <InfoRow
                label="End date"
                value={endDate ? new Date(endDate).toLocaleDateString() : "—"}
              />
            </Stack>

            {/* Discount */}
            {discountAmount > 0 && (
              <>
                <Divider />
                <Typography variant="body2" color="success.main">
                  Coupon <strong>{promoCode}</strong> applied — you saved ₹{discountAmount}
                </Typography>
              </>
            )}

            <Divider />

            {/* IDs */}
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Account ID: {userAccountId}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Public ID: {publicId}
              </Typography>
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={1.5} mt={2}>
              <StyledActionButton
                variant="outlined"
                fullWidth
                onClick={() => navigate("/pairly/settings/help")}
                text={'Get support'}
              />
              <StyledActionButton
                variant="outlined"
                fullWidth
                onClick={() => navigate("/pairly/settings/premium")}
                text={'Manage plan'}
                sx={{
                  background: theme.palette.info.dark,
                  color: theme.palette.common.white
                }}
              />

            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
}

/* Small reusable row */
function InfoRow({ label, value, valueColor }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: valueColor || "text.primary", fontWeight: 500 }}
      >
        {value || "—"}
      </Typography>
    </Stack>
  );
}


export default CurrentSubscription;
