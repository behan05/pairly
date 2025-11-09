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
  Checkbox,
  FormControlLabel,
  Divider,
  Tooltip
} from '@/MUI/MuiComponents';
import * as React from 'react';
import {
  VisibilityIcon,
  VisibilityOffIcon,
  SendIcon,
  GoogleIcon,
} from '@/MUI/MuiIcons';
import GithubIcon from '@mui/icons-material/GitHub';
import { Link, useNavigate } from 'react-router-dom';

// Redux Action
import { register } from '@/redux/slices/auth/authAction';
import { useDispatch, useSelector } from 'react-redux';

// toast prompt
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Social Auth API
import { GOOGLE_API, GITHUB_API, } from '@/api/config';

function Signup() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isXl = useMediaQuery(theme.breakpoints.down('xl'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading)
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [serverRes, setServerRes] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = 'Pairly - Create an Account';
  }, []);

  const [form, setForm] = React.useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = React.useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Handles input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handles form submit with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Full Name validation
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = 'Email or username is required';
      isValid = false;
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(form.email.trim().toLowerCase())) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Confirm password match
    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setError(newErrors);

    if (!isValid) return;
    setButtonDisabled(!buttonDisabled);

    // Dispatch register action
    const response = await dispatch(
      register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword
      })
    );

    // Toaster notifications
    if (response?.success) {
      navigate('/verify-email', { replace: true })
    } else {
      setServerRes(response?.error || 'Signup failed!')
      setButtonDisabled(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSocialSignup = (platform) => {
    switch (platform) {
      case 'google':
        window.location.href = GOOGLE_API;
        break;

      case 'github':
        window.location.href = GITHUB_API;
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        m: '0 auto',
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: { xs: 'column', md: 'row' },
        flexGrow: 1,
        gap: 2,
        pt: theme.spacing(1),
        mt: isSm ? '12dvh' : isMd ? '10dvh' : '12dvh',
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '20%',
      }}
    >
      {!isLg && (
        <Box flex={1.2} textAlign="left">
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              color: 'text.primary',
              mb: 2,
              textShadow:
                theme.palette.mode === 'dark'
                  ? '0 2px 10px rgba(255,255,255,0.05)'
                  : '0 2px 10px rgba(0,0,0,0.08)',
            }}
          >
            <StyledText text="Pairly" />{' '} Chat that Feels Human
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              maxWidth: 480,
              mb: 3,
            }}
          >
            Join Pairly and experience genuine, interest-based connections.
          </Typography>

          {/* === Reusable Video Component === */}
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow:
                `inset 0 0 0.5rem ${theme.palette.divider}`
            }}
          >
            <ReusableVideo />
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          boxShadow: `inset 0 0 20px ${theme.palette.divider}`,
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
            Create Your <StyledText text="Pairly" /> Account
          </Typography>

          <Typography
            variant="subtitle2"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 380 }}
          >
            Join now to meet new people, share real moments, and make meaningful connections — instantly.
          </Typography>

          {/* Full Name Input */}
          <TextField
            variant="outlined"
            size='small'
            label="Full Name"
            name="fullName"
            onChange={handleChange}
            value={form.fullName}
            fullWidth
            error={Boolean(error.fullName)}
            helperText={error.fullName}
          />

          {/* Email or Username Input */}
          <TextField
            variant="outlined"
            size='small'
            label="Email"
            name="email"
            aria-label="user email"
            autoComplete="email"
            onChange={handleChange}
            value={form.email}
            fullWidth
            error={Boolean(error.email)}
            helperText={error.email}
          />

          {/* Password */}
          <TextField
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            size='small'
            label="Password"
            name="password"
            onChange={handleChange}
            value={form.password}
            fullWidth
            error={Boolean(error.password)}
            helperText={error.password || 'Minimum 8 characters required'}
            InputProps={{
              endAdornment: (
                <IconButton position="end" onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )
            }}
          />

          {/* Confirm Password */}
          <TextField
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            size='small'
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            value={form.confirmPassword}
            fullWidth
            error={Boolean(error.confirmPassword)}
            helperText={error.confirmPassword}
            InputProps={{
              endAdornment: (
                <IconButton position="end" onClick={handleClickShowConfirmPassword}>
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )
            }}
          />

          {/* Already have account */}
          <Stack>
            <Typography>
              Already have an account?{' '}
              <MuiLink
                component={Link}
                to="/login"
                sx={{ color: theme.palette.text.secondary, textDecoration: 'underline', ml: 0.5 }}
              >
                Login
              </MuiLink>
            </Typography>
          </Stack>

          <FormControlLabel
            name="check_box"
            required
            control={<Checkbox />}
            sx={{
              'a': {
                color: 'info.main'
              },
              'a:hover': {
                textDecoration: 'underline',
              }
            }}
            label={
              <span style={{ fontSize: '0.785rem' }}>
                I agree to the{' '}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link
                  to="/terms-of-use"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  Terms & Conditions
                </Link>
              </span>
            }
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

          {/* Submit Button */}
          <Button
            type="submit"
            variant="outlined"
            endIcon={<SendIcon sx={{ color: '#fff' }} />}
            disabled={loading || buttonDisabled}
            sx={{
              maxWidth: 'fit-content',
              alignSelf: 'flex-end',
              borderRadius: 0.8,
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              py: 0.8,
              fontSize: "1rem",
              color: theme.palette.common.white,
              background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 6px 20px ${theme.palette.secondary.main}66`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 5px 15px ${theme.palette.primary.main}66`,
              },
            }}
          >
            {loading || buttonDisabled ? 'Creating Account…' : 'Create Account'}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}
            >
              <StyledText text={'or'} />
            </Typography>
          </Divider>

          {/* Social Signup */}
          <Stack direction={'row'} alignItems={'center'} m={'auto'} gap={2}>

            {/* Signup With Google */}
            <Tooltip title="Signup with Google">
              <IconButton
                edge="start"
                onClick={() => handleSocialSignup('google')}
                sx={{ color: theme.palette.warning.main }}
              >
                <GoogleIcon />
              </IconButton>
            </Tooltip>

            {/* Signup With GitHub */}
            <Tooltip title="Signup with GitHub">
              <IconButton
                edge="start"
                onClick={() => handleSocialSignup('github')}
                sx={{ color: '#2F2F2F' }}
              >
                <GithubIcon sx={{ color: theme.palette.text.primary }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Signup;
