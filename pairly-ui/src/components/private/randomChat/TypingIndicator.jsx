import { Box } from "@mui/material";

const TypingIndicator = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: "4px",
    }}
  >
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "#fc0065",
          animation: "bounce 1.4s infinite ease-in-out",
          animationDelay: `${i * 0.2}s`,
          "@keyframes bounce": {
            "0%, 80%, 100%": { transform: "scale(0)" },
            "40%": { transform: "scale(1)" },
          },
        }}
      />
    ))}
  </Box>
);

export default TypingIndicator;