import { Box } from "@mui/material";

const WaitingForPartnerIndicator = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12px",
      color: "text.secondary",
    }}
  >
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: "text.secondary",
        animation: "pulse 2.5s ease-in-out infinite",
        "@keyframes pulse": {
          "0% , 100%": { opacity: 0.5 },
          "50%": { opacity: 0.2 },
        },
      }}
    />
    Waiting
  </Box>

);

export default WaitingForPartnerIndicator;
