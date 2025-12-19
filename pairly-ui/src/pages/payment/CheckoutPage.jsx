import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Typography,
    Button,
    Stack,
    useTheme,
} from '../../MUI/MuiComponents';
import { StarIcon } from '../../MUI/MuiIcons';
import { RAZORPAY_PAYMENT_API } from '@/api/config';
import { toast } from "react-toastify";
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders'
import PremiumUnlockDialog from './PremiumUnlockDialog';
import { updateUser } from '@/redux/slices/auth/authSlice';
import { useDispatch } from 'react-redux';

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

function CheckoutPage() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state: plan } = useLocation();
    const {
        planTitle,
        price = 0,
        promoCode,
        userId,
    } = plan || {};

    const [userCode, setUserCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [error, setError] = useState('');
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const GST_RATE = 0.10;

    const gstAmount = +(price * GST_RATE).toFixed(2);
    const totalDiscount = appliedDiscount || 0;
    const totalPayable = +(price - (totalDiscount + gstAmount)).toFixed(2);

    useEffect(() => {
        document.title = 'Pairly - Checkout';
    }, []);

    const handleCancel = () => navigate('/pairly/settings/premium', { replace: true });

    const handlePayment = async () => {
        try {
            const payload = {
                userId,
                plan: planTitle.toLowerCase() === "super premium" ? "superPremium" : planTitle.toLowerCase(),
                amount: totalPayable,
                promoCode,
                discountAmount: totalDiscount,
            };

            const header = getAuthHeaders();
            const res = await axios.post(`${RAZORPAY_PAYMENT_API}/create-order`, payload, { headers: header });
            const { order } = res.data;

            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: "Pairly",
                description: `Payment for ${planTitle} plan`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            `${RAZORPAY_PAYMENT_API}/verify-payment`,
                            { ...response, userId },
                            { headers: header }
                        );

                        if (verifyRes.data.success) {
                            setTransactionId(response.razorpay_payment_id);
                            setShowSuccessDialog(true);
                            dispatch(updateUser(verifyRes.data.subscription));
                        } else {
                            toast.error("Payment verification failed", {
                                position: "top-right",
                                autoClose: 4000,
                                theme: "colored",
                            });
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        toast.error("Something went wrong verifying your payment.", {
                            position: "top-right",
                            autoClose: 4000,
                            theme: "colored",
                        });
                    }
                },
                theme: { color: theme.palette.warning.main },
            };

            const rzp = new window.Razorpay(options);

            // Handle payment failure events (user closes, insufficient balance, etc.)
            rzp.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                toast.error(`Payment failed: ${response.error.description || "Please try again."}`, {
                    position: "top-right",
                    autoClose: 4000,
                    theme: "colored",
                });
            });

            rzp.open();
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Payment could not be initiated. Please try again later ⚠️", {
                position: "top-right",
                autoClose: 4000,
                theme: "colored",
            });
        }
    };

    const handlePromoCode = () => {
        if (!userCode.trim()) {
            setError("Please enter a promo code");
            setAppliedDiscount(0);
            return;
        }

        if (userCode === 'WELCOME100') {
            setAppliedDiscount(100);
            setError('');
        } else {
            setError("Invalid promo code");
            setAppliedDiscount(0);
        }
    };

    return (
        <Stack
            sx={{
                minHeight: 'calc(var(--vh, 1vh) * 100)',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: `radial-gradient(circle at top left, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Animated background glow */}
            <Box
                sx={{
                    position: "absolute",
                    width: "250px",
                    height: "250px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
                    filter: "blur(120px)",
                    opacity: 0.3,
                    top: "15%",
                    left: "10%",
                    animation: "float 10s infinite ease-in-out alternate",
                    "@keyframes float": {
                        "0%": { transform: "translateY(0px)" },
                        "100%": { transform: "translateY(-40px)" },
                    },
                }}
            />

            {/* Main Checkout Card */}
            <Box
                sx={{
                    borderRadius: 3,
                    p: 4,
                    maxWidth: 440,
                    width: "90%",
                    backdropFilter: "blur(20px)",
                    background: `linear-gradient(135deg, ${theme.palette.background.paper}CC 0%, ${theme.palette.background.default}99 100%)`,
                    boxShadow: `0 10px 40px ${theme.palette.primary.dark}80`,
                    border: `1px solid ${theme.palette.divider}`,
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    "&:hover": {
                        transform: "translateY(-5px) scale(1.01)",
                        boxShadow: `0 20px 60px ${theme.palette.secondary.main}40`,
                    },
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-60%",
                        width: "50%",
                        height: "100%",
                        background: `linear-gradient(120deg, transparent, ${theme.palette.common.white}33, transparent)`,
                        transform: "skewX(-20deg)",
                        animation: "shine 6s infinite ease-in-out",
                    },
                    "@keyframes shine": {
                        "0%": { left: "-60%" },
                        "60%": { left: "130%" },
                        "100%": { left: "130%" },
                    },
                }}
            >
                {/* Header Stars */}
                <Stack direction="row" justifyContent="center" gap={1.5} mb={3}>
                    {[1, 2].map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: `0 0 25px ${theme.palette.primary.main}99`,
                                animation: "pulse 2s infinite",
                                "@keyframes pulse": {
                                    "0%,100%": {
                                        boxShadow: `0 0 25px ${theme.palette.primary.main}99`,
                                    },
                                    "50%": {
                                        boxShadow: `0 0 45px ${theme.palette.secondary.main}CC`,
                                    },
                                },
                            }}
                        >
                            <StarIcon sx={{ color: theme.palette.common.white, fontSize: 36 }} />
                        </Box>
                    ))}
                </Stack>

                {/* Plan Label */}
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                    sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        px: 1.8,
                        py: 0.8,
                        mb: 2.5,
                        background: `linear-gradient(90deg, ${theme.palette.common.white}0D, ${theme.palette.common.white}1A)`,
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                            letterSpacing: 0.8,
                            background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        {planTitle?.toUpperCase()}
                    </Typography>
                    <StarIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                </Stack>

                {/* Promo Input */}
                <Stack mb={1.5}>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Use your promo code if you have one
                    </Typography>
                    <Stack direction="row" gap={0.8}>
                        <TextField
                            variant="outlined"
                            placeholder="Enter promo code"
                            size="small"
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            sx={{
                                input: { color: theme.palette.text.primary, fontSize: "0.85rem" },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1,
                                    background: `${theme.palette.common.white}0D`,
                                    "& fieldset": { borderColor: theme.palette.divider },
                                    "&:hover fieldset": { borderColor: theme.palette.primary.main },
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={handlePromoCode}
                            sx={{
                                textTransform: "none",
                                borderRadius: 1,
                                fontWeight: 700,
                            }}
                        >
                            Apply
                        </Button>
                    </Stack>
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 0.5,
                            color: error
                                ? theme.palette.error.main
                                : appliedDiscount
                                    ? theme.palette.success.main
                                    : theme.palette.text.secondary,
                        }}
                    >
                        {error
                            ? error
                            : appliedDiscount
                                ? `Discount applied: ₹${appliedDiscount}`
                                : ""}
                    </Typography>
                </Stack>

                {/* Summary */}
                <Stack
                    spacing={0.8}
                    sx={{
                        mt: 2,
                        borderTop: `1px dashed ${theme.palette.divider}`,
                        pt: 1.5,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: theme.palette.text.primary,
                        }}
                    >
                        <span>Base Price</span>
                        <b>₹{price.toFixed(2)}</b>
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: theme.palette.text.secondary,
                        }}
                    >
                        <span>Additional discount (10%)</span>
                        <b>
                            - ₹{gstAmount}
                        </b>
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: theme.palette.text.disabled,
                        }}
                    >
                        <span>Platform fee</span>
                        <b>₹0</b>
                    </Typography>
                    {totalDiscount > 0 && (
                        <Typography
                            variant="body2"
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                color: theme.palette.success.main,
                            }}
                        >
                            <span>Promo Discount</span>
                            <b>- ₹{totalDiscount}</b>
                        </Typography>
                    )}
                    <Typography
                        variant="subtitle1"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 1,
                            pt: 1,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                        }}
                    >
                        <span>Total Payable</span>
                        <b>₹{totalPayable}</b>
                    </Typography>
                </Stack>

                {/* Actions */}
                <Stack direction="row" gap={1.2} justifyContent="space-between" mt={3}>
                    <Button
                        onClick={handleCancel}
                        variant="outlined"
                        sx={{
                            flex: 1,
                            textTransform: "none",
                            borderRadius: 1,
                            fontWeight: 600,
                            borderColor: theme.palette.divider,
                            color: theme.palette.text.secondary,
                            "&:hover": {
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.text.primary,
                            },
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handlePayment}
                        variant="contained"
                        sx={{
                            flex: 1,
                            textTransform: "none",
                            borderRadius: 1,
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                            color: theme.palette.text.contrastText,
                            position: "relative",
                            overflow: "hidden",
                            "&:hover": {
                                background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                                color: theme.palette.common.white,
                                boxShadow: `0 0 20px ${theme.palette.primary.light}80`,
                            },
                        }}
                    >
                        Process to Pay
                    </Button>
                </Stack>

                {/* Success Dialog */}
                <PremiumUnlockDialog
                    open={showSuccessDialog}
                    planTitle={planTitle}
                    transactionId={transactionId}
                />
            </Box>
        </Stack>

    );
}

export default CheckoutPage;
