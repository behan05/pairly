import { Box } from "@mui/material";

const GlowingHeart = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      position: "relative",
      width: "32px",
      "&::before": {
        content: '""',
        width: "26px",
        height: "26px",
        backgroundColor: "#fc0065",
        maskImage:
          "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"white\" d=\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\"/></svg>')",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        maskPosition: "center",
        animation: "heartbeat 1.2s ease-in-out infinite",
        transformOrigin: "center",
        boxShadow: "0 0 8px rgba(252,0,101,0.6)",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        background: "rgba(252,0,101,0.3)",
        animation: "glowPulse 1.2s ease-in-out infinite",
      },
      "@keyframes heartbeat": {
        "0%, 100%": { transform: "scale(1)" },
        "15%": { transform: "scale(1.15)" }, // fast initial beat
        "30%": { transform: "scale(0.95)" }, // slight recoil
        "45%": { transform: "scale(1.1)" },  // secondary soft beat
        "60%": { transform: "scale(1)" },
      },
      "@keyframes glowPulse": {
        "0%, 100%": { transform: "scale(1)", opacity: 0.3 },
        "15%": { transform: "scale(1.3)", opacity: 0.6 },
        "30%": { transform: "scale(1.1)", opacity: 0.4 },
        "45%": { transform: "scale(1.2)", opacity: 0.5 },
        "60%": { transform: "scale(1)", opacity: 0.3 },
      },
    }}
  />
);

export default GlowingHeart;
