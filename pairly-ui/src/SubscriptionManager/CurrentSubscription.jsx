import {
  Stack,
  Typography,
  Box,
  Divider,
  useTheme,
  Button
} from "../MUI/MuiComponents";
import {
  EmojiEvents,
  CalendarMonth,
  CheckCircle,
  LocalOffer,
  FiberManualRecord,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CurrentSubscription() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { subscription, fullName, id: userAccountId, publicId } = useSelector((state) => state?.auth?.user) || {};
  const { plan, status, startDate, endDate, promoCode, discountAmount } =
    subscription || {};
  const isFreeUser = status === 'active' && plan === 'free';
  const isActive = status === "active";

  return (
    <Stack
      sx={{
        p: 3,
        maxWidth: 460,
        height: 'auto',
        mx: "auto",
        backdropFilter: "blur(25px)",
        background: `linear-gradient(135deg,
          ${theme.palette.background.paper}DD 0%,
          ${theme.palette.background.default}CC 100%)`,
        boxShadow: `0 10px 40px ${theme.palette.primary.main}26`,
        filter: `drop-shadow(0 0 1rem ${theme.palette.divider}33)`,
        WebkitFilter: `drop-shadow(0 0 1rem ${theme.palette.divider}33)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -50,
          left: -50,
          width: "150%",
          height: "150%",
          background: `radial-gradient(circle at top left,
            ${theme.palette.primary.main}22,
            transparent 70%)`,
          zIndex: 0,
        },
      }}
    >
      {isFreeUser ? (
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: theme.palette.text.secondary,
            py: 4,
            fontStyle: "italic",
          }}
        >
          You’re currently on the <b>Free Plan</b>. Upgrade to unlock premium features 🚀
        </Typography>
      ) : (
        <>
          {/* Header */}
          <Stack spacing={0.5} sx={{ textAlign: "center", mb: 3, zIndex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(90deg,
              ${theme.palette.primary.main},
              ${theme.palette.info.main})`,
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Hey {fullName}! 👋
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.7)",
                fontStyle: "italic",
                borderBottom: `1px dashed ${theme.palette.divider}`,
                py: 2,
              }}
            >
              Thanks for being one of our amazing Pairly members 💖
              Enjoy your premium access!
            </Typography>
          </Stack>

          {/* Subscription Summary */}
          <Stack spacing={2} sx={{ zIndex: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 1,
                background: `linear-gradient(90deg, ${theme.palette.warning.main}22, transparent)`,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `inset 0 0 10px ${theme.palette.warning.main}11`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmojiEvents sx={{ color: theme.palette.warning.main }} />
                <Typography fontWeight={600}>Plan</Typography>
              </Stack>
              <Typography
                sx={{
                  textTransform: "capitalize",
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  letterSpacing: 0.3,
                }}
              >
                {plan === 'superPremium' ? 'Super Premium' : plan || "—"}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 1,
                background: `linear-gradient(90deg, ${isActive ? theme.palette.success.main : theme.palette.error.main
                  }22, transparent)`,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `inset 0 0 10px ${isActive ? theme.palette.success.main : theme.palette.error.main
                  }11`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircle
                  sx={{
                    color: isActive
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  }}
                />
                <Typography fontWeight={600}>Status</Typography>
              </Stack>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 500,
                    color: isActive
                      ? theme.palette.success.light
                      : theme.palette.text.secondary,
                    letterSpacing: 0.3,
                  }}
                >
                  {status || "—"}
                </Typography>

                {isActive && (
                  <FiberManualRecord
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: 10,
                      animation: "blink 1.4s infinite ease-in-out",
                      "@keyframes blink": {
                        "0%, 100%": { opacity: 0.2 },
                        "50%": { opacity: 1 },
                      },
                      filter: "drop-shadow(0 0 4px rgba(0,255,0,0.6))",
                    }}
                  />
                )}
              </Box>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 1,
                background: `linear-gradient(90deg, ${theme.palette.info.main}22, transparent)`,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `inset 0 0 10px ${theme.palette.info.main}11`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarMonth sx={{ color: theme.palette.info.main }} />
                <Typography fontWeight={600}>Start Date</Typography>
              </Stack>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  letterSpacing: 0.3,
                }}
              >
                {startDate ? new Date(startDate).toLocaleDateString() : "—"}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 1,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}22, transparent)`,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `inset 0 0 10px ${theme.palette.primary.main}11`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarMonth sx={{ color: theme.palette.primary.main }} />
                <Typography fontWeight={600}>End Date</Typography>
              </Stack>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  letterSpacing: 0.3,
                }}
              >
                {endDate ? new Date(endDate).toLocaleDateString() : "—"}
              </Typography>
            </Stack>
          </Stack>

          {/* User Info */}
          <Stack
            spacing={1.2}
            sx={{
              mt: 4,
              pt: 2,
              borderTop: `1px dashed ${theme.palette.divider}`,
              textAlign: "center",
              color:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(0,0,0,0.6)",
            }}
          >
            {/* User Details */}
            <Typography variant="body2" sx={{ letterSpacing: 0.3 }}>
              <strong>Account ID:</strong> {userAccountId || "—"}
            </Typography>
            <Typography variant="body2" sx={{ letterSpacing: 0.3 }}>
              <strong>Public ID:</strong> {publicId || "—"}
            </Typography>
          </Stack>

          {/* Actions */}
          <Stack
            direction="row"
            gap={1.2}
            justifyContent="space-between"
            flexWrap={'wrap'}
            textAlign={'center'}
            mt={3}>
            <Button
              onClick={() => navigate("/pairly/settings/help")}
              variant="outlined"
              sx={{
                flex: 1,
                minWidth: 'fit-content',
                textTransform: "none",
                borderRadius: 0.5,
                fontWeight: 600,
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.text.primary,
                },
              }}
            >
              Need Help
            </Button>

            <Button
              onClick={() => navigate("/pairly/settings/premium")}
              sx={{
                flex: 1,
                minWidth: 'fit-content',
                borderRadius: 0.5,
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                py: 1.2,
                fontSize: "1rem",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main}, ${theme.palette.secondary.main})`,
                color: theme.palette.common.white,
                boxShadow: `0 5px 15px ${theme.palette.primary.main}66`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 6px 20px ${theme.palette.secondary.main}66`,
                },
              }}
            >
              Stay Premium
            </Button>
          </Stack>

          {/* discountAmount  msg */}
          <Stack>
            {discountAmount > 0 && (
              <Stack
                spacing={0.5}
                sx={{
                  mt: 2,
                  borderTop: `1px dashed ${theme.palette.divider}`,
                  pt: 2,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocalOffer fontSize="small" sx={{ color: theme.palette.secondary.main }} />
                  <Typography fontWeight={600}>{promoCode}</Typography>
                  <Typography sx={{ color: theme.palette.success.main }}>
                    ₹{discountAmount}
                  </Typography>
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(0,0,0,0.7)",
                    fontStyle: "italic",
                  }}
                >
                  You saved <strong>₹{discountAmount}</strong> with your last renewal.
                  As a{" "}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    valued Pairly member
                  </Box>
                  , you can use this coupon again next time — our way of saying *thank you for being with us!* 💖
                </Typography>
              </Stack>
            )}
          </Stack>

          <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

          {/* Footer Note */}
          <Typography
            variant="caption"
            sx={{
              textAlign: "center",
              display: "block",
              opacity: 0.7,
            }}
          >
            Manage or upgrade your plan anytime from the <b>Subscription Manager</b>.
          </Typography>
        </>
      )}

    </Stack>
  );
}

export default CurrentSubscription;
