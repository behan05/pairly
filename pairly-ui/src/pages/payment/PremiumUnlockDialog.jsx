import { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Divider,
    useTheme
} from "../../MUI/MuiComponents";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PremiumUnlockDialog({ open, planTitle, transactionId }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const [counter, setCounter] = useState(30);

    useEffect(() => {
        if (!open) return;
        setCounter(30);

        const interval = setInterval(() => {
            setCounter((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    navigate("/transactions");
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [open, navigate]);

    return (
        <Dialog
            open={open}
            onClose={() => navigate("/transactions")}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 3,
                    maxWidth: 420,
                    backdropFilter: "blur(20px)",
                    background: `linear-gradient(135deg, ${theme.palette.background.paper}DD 0%, ${theme.palette.background.default}CC 100%)`,
                    boxShadow: `0 8px 40px ${theme.palette.primary.dark}4D`,
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary,
                    transition: "all 0.4s ease",
                    "&:hover": {
                        transform: "translateY(-3px)",
                    },
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    pb: 0,
                }}
            >
                <Box
                    sx={{
                        width: 75,
                        height: 75,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 0 20px ${theme.palette.primary.main}99`,
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                            "0%,100%": { boxShadow: `0 0 20px ${theme.palette.primary.main}99` },
                            "50%": { boxShadow: `0 0 35px ${theme.palette.secondary.main}B3` },
                        },
                    }}
                >
                    <StarIcon sx={{ color: theme.palette.common.white, fontSize: 42 }} />
                </Box>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mt: 1,
                        background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Premium Unlocked 🎉
                </Typography>
            </DialogTitle>

            {/* Content */}
            <DialogContent sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    You’ve successfully activated the{" "}
                    <strong style={{ color: theme.palette.text.primary }}>{planTitle}</strong>{" "}
                    plan.
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        mt: 1.5,
                        color: theme.palette.text.disabled,
                        lineHeight: 1.6,
                    }}
                >
                    Enjoy unlimited chats, premium matches, and all exclusive perks.
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        mt: 2,
                        fontStyle: "italic",
                        color: theme.palette.text.secondary,
                    }}
                >
                    Transaction ID:&nbsp;
                    <Typography
                        component="span"
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.info.main,
                            wordBreak: "break-all",
                        }}
                    >
                        {transactionId || "—"}
                    </Typography>
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        mt: 2,
                        display: "block",
                        color: theme.palette.text.disabled,
                    }}
                >
                    Redirecting to your Transactions page in {counter} seconds...
                </Typography>
            </DialogContent>

            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

            {/* Actions */}
            <DialogActions
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    px: 3,
                    pb: 2,
                }}
            >
                <Button
                    onClick={() => navigate("/transactions")}
                    fullWidth
                    sx={{
                        borderRadius: 3,
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
                    Go Now
                </Button>
            </DialogActions>
        </Dialog>
    );
}
