import StyledText from '@/components/common/StyledText';
import ReusableVideo from '@/components/public/ReusableVideo';
import {
    Box,
    TextField,
    Typography,
    useMediaQuery,
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
import { forgotPassword } from '@/redux/slices/auth/authAction';
import { useDispatch, useSelector } from 'react-redux';

// Toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
    const theme = useTheme();
    const isLg = useMediaQuery(theme.breakpoints.down('lg'));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.auth.loading);

    const [showPassword, setShowPassword] = React.useState(false);
    const [form, setForm] = React.useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = React.useState({});
    const [disabled, setDisabled] = React.useState(false);

    React.useEffect(() => {
        document.title = 'Connect - Forgot Password';
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

        if (!form.fullName.trim()) {
            newError.fullName = 'Full name is required';
            isValid = false;
        }

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
        const response = await dispatch(forgotPassword(form));

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
            toast.error(response.message || 'Reset failed');
            setDisabled(false);
        }
    };

    return (
        <Box
            sx={{
                m: '1.5rem auto',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: { xs: 'column', md: 'row' },
                flexGrow: 1,
                gap: 2,
                py: isLg ? theme.spacing(3) : theme.spacing(10)
            }}
        >
            {/* Left side content */}
            {!isLg && (
                <Box flex={1}>
                    <Typography
                        variant="h5"
                        fontSize={'3rem'}
                        letterSpacing={1}
                        color={theme.palette.text.primary}
                    >
                        <StyledText text={'Connect'} />
                    </Typography>

                    <Typography variant="subtitle1" color={theme.palette.text.secondary} mb={3}>
                        Reset your password and continue enjoying{' '}
                        <StyledText text={'real-time'} /> chats with <StyledText text={'Connect'} />.
                    </Typography>

                    {/* Video */}
                    <ReusableVideo />
                </Box>
            )}

            {/* Right side form */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    py: 1
                }}
            >
                <Box
                    component={'form'}
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <Typography
                        variant="h3"
                        textTransform={'uppercase'}
                        letterSpacing={1}
                        fontWeight={600}
                        textAlign={'center'}
                        color={theme.palette.text.primary}
                    >
                        Reset <StyledText text={'Password'} />
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        textAlign={'center'}
                        maxWidth={400}
                        color={'text.secondary'}
                        gutterBottom
                    >
                        Enter your details below to reset your account password.
                    </Typography>

                    {/* Full Name */}
                    <TextField
                        variant="outlined"
                        label="Full Name"
                        name="fullName"
                        onChange={handleChange}
                        value={form.fullName}
                        fullWidth
                        error={Boolean(error.fullName)}
                        helperText={error.fullName}
                    />

                    {/* Email */}
                    <TextField
                        variant="outlined"
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
                        label="Confirm Password"
                        name="confirmPassword"
                        onChange={handleChange}
                        value={form.confirmPassword}
                        fullWidth
                        error={Boolean(error.confirmPassword)}
                        helperText={error.confirmPassword}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="outlined"
                        endIcon={<SendIcon sx={{ color: 'success.main' }} />}
                        size="large"
                        disabled={loading || disabled}
                        sx={{
                            alignSelf: 'flex-end',
                            px: { xs: 2, sm: 3 },
                            py: { xs: 0.5, sm: 1 },
                            background: `transparent`,
                            backdropFilter: 'blur(14px)',
                            borderTopRightRadius: '6px',
                            borderBottomRightRadius: '6px',
                            border: `1px dotted ${theme.palette.success.main}`,
                            textTransform: 'none',
                            color: 'primary.contrastText',
                            letterSpacing: 0.2,
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.5 : 1,
                            '&:hover': {
                                transform: loading ? 'none' : 'translateY(-5px)'
                            }
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

export default ForgotPassword;
