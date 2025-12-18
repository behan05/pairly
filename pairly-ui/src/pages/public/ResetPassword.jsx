import StyledText from '@/components/common/StyledText';
import {
    Box,
    TextField,
    Typography,
    useTheme,
    MuiLink,
    Button,
    IconButton,
    Stack,
    Divider
} from '@/MUI/MuiComponents';
import * as React from 'react';
import {
    SendIcon,
    VisibilityIcon,
    VisibilityOffIcon
} from '@/MUI/MuiIcons';
import { Link, useNavigate } from 'react-router-dom';

// Redux
import { resetPassword } from '@/redux/slices/auth/authAction';
import { useDispatch, useSelector } from 'react-redux';

// Toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.auth.loading);

    const [showPassword, setShowPassword] = React.useState(false);
    const [form, setForm] = React.useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = React.useState({});
    const [disabled, setDisabled] = React.useState(false);
    const [serverRes, setServerRes] = React.useState('');

    React.useEffect(() => {
        document.title = 'Pairly - Reset Password';
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        if (error[name]) {
            setError((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        let newError = {};
        let isValid = true;

        if (!form.email.trim()) {
            newError.email = 'Email is required';
            isValid = false;
        } else {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(form.email)) {
                newError.email = 'Enter a valid email';
                isValid = false;
            }
        }

        if (!form.password.trim()) {
            newError.password = 'Password is required';
            isValid = false;
        } else if (form.password.length < 6) {
            newError.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!form.confirmPassword.trim()) {
            newError.confirmPassword = 'Confirm password is required';
            isValid = false;
        } else if (form.confirmPassword !== form.password) {
            newError.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setError(newError);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setDisabled(true);
        const response = await dispatch(resetPassword(form));

        if (response.success) {
            toast.success(response.message || 'Password reset successfully!', {
                style: {
                    backdropFilter: 'blur(14px)',
                    background: theme.palette.divider,
                    color: theme.palette.text.primary,
                }
            });
            setTimeout(() => navigate('/login'), 1200);
        } else {
            setServerRes(response.message || 'Reset failed');
            setDisabled(false);
        }
    };

    return (
        <Box
            sx={{
                borderRadius: 1,
                maxWidth: 450,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                my: '6dvh',
                mx: 'auto',
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
                p: 2
            }}
        >
            {/* Right side form */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    background: 'inherit',
                    borderRadius: 0.5,
                    py: 4
                }}
            >
                <Box
                    component={'form'}
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', px: 1, flexDirection: 'column', gap: 2 }}
                >
                    <Typography variant="h4" fontWeight={700} textAlign="center">
                        Reset Your <StyledText text="Password" />
                    </Typography>

                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ maxWidth: 380 }}
                    >
                        Enter your details to reset your account password and get back to your conversations.
                    </Typography>

                    {/* Email */}
                    <TextField
                        variant="outlined"
                        size="small"
                        label="Email"
                        name="email"
                        onChange={handleChange}
                        value={form.email}
                        autoComplete="email"
                        fullWidth
                        error={Boolean(error.email)}
                        helperText={error.email}
                    />

                    {/* Password */}
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        size="small"
                        label="New Password"
                        name="password"
                        onChange={handleChange}
                        value={form.password}
                        fullWidth
                        error={Boolean(error.password)}
                        helperText={error.password}
                        InputProps={{
                            endAdornment: (
                                <IconButton position="end" onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            )
                        }}
                    />

                    {/* Confirm Password */}
                    <TextField
                        type="password"
                        variant="outlined"
                        size="small"
                        label="Confirm Password"
                        name="confirmPassword"
                        onChange={handleChange}
                        value={form.confirmPassword}
                        fullWidth
                        error={Boolean(error.confirmPassword)}
                        helperText={error.confirmPassword}
                    />

                    {/* Error display */}
                    {serverRes && (
                        <Typography
                            variant="subtitle2"
                            sx={{
                                alignSelf: 'flex-end',
                                mr: 2,
                                mt: 1,
                                px: 1.5,
                                py: 0.5,
                                fontSize: '0.95em',
                                fontWeight: 600,
                                color: '#b00020',
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'dark' ? 'rgba(255, 82, 82, 0.1)' : 'rgba(255, 0, 0, 0.08)',
                                border: '1px solid rgba(255, 0, 0, 0.2)',
                                borderRadius: '8px',
                                backdropFilter: 'blur(6px)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            ⚠️ {serverRes}
                        </Typography>
                    )}

                    {/* Reset Button */}
                    <Button
                        type="submit"
                        variant="outlined"
                        endIcon={<SendIcon sx={{ color: '#fff' }} />}
                        size="large"
                        disabled={loading || disabled}
                        sx={{
                            maxWidth: 'fit-content',
                            alignSelf: 'flex-end',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 0.5,
                            fontWeight: 700,
                            px: 3,
                            py: 0.8,
                            fontSize: "1rem",
                            color: theme.palette.common.white,
                            textShadow: `0 0 2px #212121`,
                            background: theme.palette.background.paper,
                            "&:hover": {
                                background: theme.palette.background.default,
                            },
                        }}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>

                    <Divider sx={{ my: 2 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}
                        >
                            <StyledText text={'or'} />
                        </Typography>
                    </Divider>

                    {/* Back to login */}
                    <Stack justifyContent="center" alignItems="center">
                        <MuiLink
                            component={Link}
                            to="/login"
                            sx={{ color: theme.palette.text.secondary, textDecoration: 'underline' }}
                        >
                            Back to Login
                        </MuiLink>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

export default ResetPassword;
