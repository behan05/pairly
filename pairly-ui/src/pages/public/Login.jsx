import StyledText from '@/components/common/StyledText';
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
  Tooltip,
  Divider
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
import { login } from '@/redux/slices/auth/authAction';
import { useDispatch, useSelector } from 'react-redux';

// toast prompt
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Social Auth API
import { GOOGLE_API, GITHUB_API } from '@/api/config';

function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading)
  const [disabled, setDisabled] = React.useState(false);
  const [serverRes, setServerRes] = React.useState('');

  React.useEffect(() => {
    document.title = 'Pairly - Login';
  }, []);

  // Form state to handle user input
  const [form, setForm] = React.useState({
    email: '',
    password: ''
  });

  // Error state to show validation errors
  const [error, setError] = React.useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = React.useState(false);

  // Handle input change and update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    let newError = {};

    if (form.email.trim() === '') {
      newError.email = 'user name is required!';
      isValid = false;
    }

    if (form.password.trim() === '') {
      newError.password = 'password is required!';
      isValid = false;
    }

    setError(newError);
    if (!isValid) return;
    setDisabled(true);

    const response = await dispatch(login(form));

    if (response.success && response.redirectToVerify) {
      toast.info('Your account is not verified yet. Please verify your email.');
      navigate('/verify-email');
    } else if (response.success) {
      toast.success('Login successful!');
      navigate('/pairly/');
    } else {
      setServerRes(response?.error)
      // toast.error(response?.error);
      setDisabled(false);
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Social media login simulation
  const handleSocialLogin = (platform) => {
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

      {/* Right side login form */}
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
            Welcome Back to <StyledText text="Pairly" />
          </Typography>

          <Typography
            variant="subtitle2"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 380 }}
          >
            Sign in and start meaningful conversations, real connections and no noise.
          </Typography>

          {/* Username Input */}
          <TextField
            variant="outlined"
            size='small'
            label="Email"
            name="email"
            onChange={handleChange}
            value={form.email}
            autoComplete="email"
            fullWidth
            error={Boolean(error.email)}
            helperText={error.email}
          />

          {/* Password Input */}
          <TextField
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            size='small'
            label="Password"
            name="password"
            autoComplete="current-password"
            onChange={handleChange}
            value={form.password}
            fullWidth
            error={Boolean(error.password)}
            helperText={error.password}
            InputProps={{
              endAdornment: (
                <IconButton position="end" onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}{' '}
                  {/* Eye icon toggle */}
                </IconButton>
              )
            }}
          />

          {/* Link to signup page */}
          <Stack gap={1}>
            <Typography>
              New to <StyledText text={'Pairly'} /> ?
              <MuiLink
                component={Link}
                to="/register"
                sx={{ color: theme.palette.text.secondary, textDecoration: 'underline', ml: 0.5 }}
              >
                Create an Account
              </MuiLink>
            </Typography>
          </Stack>

          {/* Remember me checkbox and forgot password link */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <FormControlLabel control={<Checkbox />} name="check box" label="Remember me" />
            <MuiLink
              component={Link}
              to="/forgot-password"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: 'underline',
                fontSize: '0.875rem'
              }}
            >
              Forgot your password?
            </MuiLink>
          </Stack>

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

          {/* Login button */}
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
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          {/* TEMPORARY COMMENT DUE TO SECURITY CONCERN */}
          {/* Divider with 'or' text */}
          {/* <Divider sx={{ my: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}
            >
              <StyledText text={'or'} />
            </Typography>
          </Divider> */}

          {/* Social login icons */}
          {/* <Stack direction={'row'} alignItems={'center'} m={'auto'} gap={2}> */}

          {/* Login With Google */}
          {/* <Tooltip title="Login with Google">
              <IconButton
                edge="start"
                onClick={() => handleSocialLogin('google')}
                sx={{ color: theme.palette.warning.main }}
              >
                <GoogleIcon />
              </IconButton>
            </Tooltip> */}

          {/* Login With GitHub */}
          {/* <Tooltip title="Login with GitHub">
              <IconButton
                edge="start"
                onClick={() => handleSocialLogin('github')}
                sx={{ color: '#2F2F2F' }}
              >
                <GithubIcon sx={{ color: theme.palette.text.primary }} />
              </IconButton>
            </Tooltip>
          </Stack> */}
        </Box>
      </Box>
    </Box >
  );
}

export default Login;
