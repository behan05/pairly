import {
    Box,
    Typography,
    useTheme
} from '@/MUI/MuiComponents';

function NotConnectedWindow({ title, subTitle, description, findingUserCountDown, disconnectButton }) {
    const theme = useTheme();
    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "calc(var(--vh, 1vh) * 100)",
                width: "100%",
                overflow: "hidden",
                background: theme.palette.background.paper,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Animated Grid Background */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
              linear-gradient(${theme.palette.divider}, transparent 1px),
              linear-gradient(90deg,${theme.palette.divider}, transparent 1px)
            `,
                    backgroundSize: "40px 40px",
                    animation: "moveGrid 20s linear infinite",
                    "@keyframes moveGrid": {
                        "0%": { backgroundPosition: "0 0" },
                        "100%": { backgroundPosition: "40px 40px" },
                    },
                }}
            />

            {/* Pulsing System Core */}
            <Box
                sx={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background:
                        `radial-gradient(circle, ${theme.palette.success.dark}, transparent 70%)`,
                    filter: "blur(100px)",
                    animation: "pulseCore 6s ease-in-out infinite",
                    "@keyframes pulseCore": {
                        "0%": { transform: "scale(0.95)", opacity: 0.7 },
                        "50%": { transform: "scale(1.05)", opacity: 1 },
                        "100%": { transform: "scale(0.95)", opacity: 0.7 },
                    },
                }}
            />

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
                <Box
                    key={i}
                    sx={{
                        position: "absolute",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: `${theme.palette.success.main}`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `float${i} ${10 + i}s linear infinite`,
                        "@keyframes float0": {
                            "0%": { transform: "translateY(0px)" },
                            "100%": { transform: "translateY(-200px)" },
                        },
                    }}
                />
            ))}

            {/* Glass System Panel */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 2,
                    px: 5,
                    py: 4,
                    borderRadius: 1,
                    background: theme.palette.background.paper,
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 0 50px rgba(0,245,255,0.08)",
                    textAlign: "center",
                    maxWidth: 420,
                }}
            >
                <Typography
                    variant="overline"
                    sx={{
                        color: "#00F5FF",
                        letterSpacing: 3,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        color: `${theme.palette.text.primary}`,
                        fontWeight: 700,
                        mt: 1,
                    }}
                >
                    {findingUserCountDown ? findingUserCountDown : subTitle}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: `${theme.palette.text.secondary}`,
                        mt: 2,
                    }}
                >
                    {disconnectButton ? disconnectButton : description}
                </Typography>
            </Box>
        </Box>
    )
}

export default NotConnectedWindow