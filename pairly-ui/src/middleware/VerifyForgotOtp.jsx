import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    CircularProgress,
    useTheme,
    useMediaQuery
} from '../MUI/MuiComponents';
import { SendIcon } from '../MUI/MuiIcons';
import StyleActionButton from '../components/common/StyledActionButton';
import StyleButton from '../components/common/StyledButton';
import { AUTH_API } from '../api/config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// toast prompt
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VerifyForgotOtp() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const navigate = useNavigate();
    const verificationEmail = localStorage.getItem('pendingResetEmail');

    const handleVerify = async () => {
        if (!otp) return setMessage('Please enter the OTP');
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post(`${AUTH_API}/verify-forgot-otp`, {
                otp,
                email: localStorage.getItem('pendingResetEmail')
            });

            if (res?.data?.success) {
                toast.success(res?.data?.message || 'Email verified successfully!', {
                    style: {
                        backdropFilter: 'blur(14px)',
                        background: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                    }
                });

                localStorage.removeItem('pendingResetEmail');
                navigate('/reset-password', { replace: true });
            } else {
                setMessage(res?.data?.error || 'Invalid or expired OTP');
            }
        } catch (err) {
            setMessage(err.response?.data?.error || 'Something went wrong, try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setCooldown(60);
        setMessage('');

        try {
            const res = await axios.post(`${AUTH_API}/resend-email-otp`, {
                email: localStorage.getItem('pendingResetEmail'),
            });

            if (res?.data?.success) {
                toast.success(res?.data?.message || 'OTP resent to your email!', {
                    style: {
                        backdropFilter: 'blur(14px)',
                        background: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                    }
                });
                setMessage('OTP resent to your email!');
            } else {
                setMessage(res?.data?.error || 'Unable to resend OTP.');
            }
        } catch (err) {
            setMessage(err.response?.data?.error || 'Something went wrong while resending OTP.');
        }
    };

    // Countdown logic
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    return (
        <Box
            sx={{
                minHeight: '90vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'inherit',
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    backgroundColor: theme.palette.background.default,
                    p: 4,
                    borderRadius: 3,
                    boxShadow: `inset 0 2px 4px ${theme.palette.info.dark}`,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" fontWeight={700} mb={1.5} textAlign="center">
                    Verify Your Email
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={3}
                    textAlign="center"
                    sx={{ lineHeight: 1.6 }}
                >
                    We’ve sent a 6-digit verification code to <br />
                    <Typography
                        component="span"
                        sx={{
                            color: (theme) => theme.palette.primary.main,
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            display: 'inline-block',
                            mt: 0.5,
                        }}
                    >
                        {verificationEmail}
                    </Typography>
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mb: 3 }}
                >
                    Please enter the code below to verify your identity.
                </Typography>

                <TextField
                    fullWidth
                    label="Enter OTP"
                    variant="outlined"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputProps={{
                        maxLength: 6,
                        style: { textAlign: 'center', fontSize: 18, letterSpacing: 4 },
                    }}
                />

                {message && (
                    <Typography
                        variant="body2"
                        sx={{ mt: 2, color: message.startsWith(' ') ? 'green' : 'error.main' }}
                    >
                        {message}
                    </Typography>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        gap: isSm ? 0 : 0.5,
                        justifyContent: 'center',
                        flexDirection: isSm ? 'column' : 'row',
                    }}
                >
                    {/* Verify Button */}
                    <StyleActionButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, py: 1.2, flex: 1 }}
                        endIcon={!loading && <SendIcon />}
                        onClick={handleVerify}
                        disabled={loading}
                        text={loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
                    />

                    {/* Resend OTP */}
                    <StyleButton
                        text={cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend OTP'}
                        disabled={cooldown > 0}
                        onClick={handleResend}
                        sx={{ mt: 3, py: 1.2, flex: 1 }}
                    />
                </Box>

                {cooldown > 0 && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                    >
                        You can resend OTP after {cooldown}s
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default VerifyForgotOtp;
