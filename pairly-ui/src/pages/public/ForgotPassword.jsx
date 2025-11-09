import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Typography,
    Button,
    Stack,
    useMediaQuery,
    useTheme,
    MuiLink,
} from '@/MUI/MuiComponents';
import { SendIcon } from '@/MUI/MuiIcons';
import StyledText from '@/components/common/StyledText';
import { toast } from 'react-toastify';

// Redux & api
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_API } from '@/api/config';

function ForgotPassword() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const loading = useSelector((state) => state.auth.loading);

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        document.title = 'Pairly - Forgot Password';
    }, []);

    const validate = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email.trim())) {
            setError('Enter a valid email');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setDisabled(true);
        try {
            const res = await axios.post(`${AUTH_API}/forgot-password`, { email });
            if (res?.data?.success) {
                toast.success(res.data.message || 'OTP sent to your email!');
                localStorage.setItem('pendingResetEmail', email);
                navigate('/verify-forgot-otp');
            } else {
                toast.error(res.data.error || 'Failed to send OTP.');
            }
        } catch (err) {
            toast.error(
                err.response?.data?.error || 'Something went wrong. Please try again later.'
            );
        } finally {
            setDisabled(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '90vh',
                px: isSm ? 2 : 4,
                background: 'inherit'
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    background: theme.palette.background.paper,
                    p: isSm ? 3 : 5,
                    borderRadius: 3,
                    boxShadow:
                        theme.palette.mode === 'dark'
                            ? '0 4px 24px rgba(255,255,255,0.05)'
                            : '0 4px 24px rgba(0,0,0,0.08)',
                    width: '100%',
                    maxWidth: 450,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Box textAlign="center">
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ mb: 1, color: 'text.primary' }}
                    >
                        Forgot Your <StyledText text="Password?" />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Enter your registered email address and we’ll send you an OTP to
                        reset your password.
                    </Typography>
                </Box>

                <TextField
                    variant="outlined"
                    size="medium"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    error={Boolean(error)}
                    helperText={error}
                />

                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                    disabled={disabled || loading}
                    sx={{
                        py: 1.3,
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
                        },
                    }}
                >
                    {disabled ? 'Sending...' : 'Send OTP'}
                </Button>

                <Stack direction="row" justifyContent="center" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                        Remembered your password?
                    </Typography>
                    <MuiLink
                        component={Link}
                        to="/login"
                        sx={{
                            ml: 1,
                            fontWeight: 600,
                            textDecoration: 'none',
                            color: theme.palette.primary.main,
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        Back to Login
                    </MuiLink>
                </Stack>
            </Box>
        </Box>
    );
}

export default ForgotPassword;
