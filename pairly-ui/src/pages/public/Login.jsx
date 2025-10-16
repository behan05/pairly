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
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading)
  const [disabled, setDisabled] = React.useState(false);

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

    // Toaster notifications
    if (response.success) {
      toast.success('Login successfully!', {
        style: {
          backdropFilter: 'blur(14px)',
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }
      });
      setTimeout(() => navigate('/pairly/'), 500);
    } else {
      toast.error(response.message, {
        style: {
          backdropFilter: 'blur(14px)',
          background: theme.palette.warning.main,
          color: theme.palette.text.primary,
        }
      });
      setDisabled(false)
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
      {/* Left side content for larger screens */}
      {!isLg && (
        <Box flex={1}>
          <Typography
            variant="h5"
            fontSize={'3rem'}
            letterSpacing={1}
            color={theme.palette.text.primary}
          >
            <StyledText text={'Pairly'} />
          </Typography>

          <Typography variant="subtitle1" color={theme.palette.text.secondary} mb={3}>
            Pairly is a real-time random chatting webapp, powered by{' '}
            <StyledText text={'interest-based'} /> matching. 100% <StyledText text={'India'} />{' '}
            platform designed for genuine conversations anytime, anywhere.
          </Typography>

          {/* === Reusable Video Component === */}
          <ReusableVideo />
        </Box>
      )}

      {/* Right side login form */}
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
            Login to <StyledText text={'Pairly'} />!
          </Typography>

          <Typography
            variant="subtitle1"
            textAlign={'center'}
            maxWidth={400}
            color={'text.secondary'}
            gutterBottom
          >
            Sign in to connect with people and make meaningful conversations.
          </Typography>

          {/* Username Input */}
          <TextField
            variant="outlined"
            label="Username or Email"
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

          {/* Login button */}
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
              color: 'text.primary',
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
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          {/* Divider with 'or' text */}
          <Divider sx={{ my: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}
            >
              <StyledText text={'or'} />
            </Typography>
          </Divider>

          {/* Social login icons */}
          <Stack direction={'row'} alignItems={'center'} m={'auto'} gap={2}>

            {/* Login With Google */}
            <Tooltip title="Login with Google">
              <IconButton
                edge="start"
                onClick={() => handleSocialLogin('google')}
                sx={{color: theme.palette.warning.main}}
              >
                <GoogleIcon />
              </IconButton>
            </Tooltip>

            {/* Login With GitHub */}
            <Tooltip title="Login with GitHub">
              <IconButton
                edge="start"
                onClick={() => handleSocialLogin('github')}
                sx={{ color: '#2F2F2F' }}
              >
                <GithubIcon sx={{color: theme.palette.text.primary}} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    </Box >
  );
}

export default Login;
