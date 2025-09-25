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
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading)
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword
      })
    );

    // Toaster notifications
    if (response.success) {
      toast.success('Account created successfully!', {
        style: {
          backdropFilter: 'blur(14px)',
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }
      });
      setTimeout(() => navigate('/login'), 1000);
    } else {
      toast.error(response.message || 'Signup failed!', {
        style: {
          backdropFilter: 'blur(14px)',
          background: theme.palette.warning.main,
          color: theme.palette.text.primary,
        }
      });
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
        py: isLg ? theme.spacing(3) : theme.spacing(10)
      }}
    >
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
            Join <StyledText text={'Pairly'} /> and experience genuine, interest-based connections.
          </Typography>

          <ReusableVideo />
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1
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
            Join {' '}<StyledText text={'Pairly'} />!
          </Typography>

          <Typography
            variant="subtitle1"
            textAlign={'center'}
            maxWidth={400}
            color={'text.secondary'}
            gutterBottom
          >
            Sign up and start making meaningful conversations.
          </Typography>

          {/* Full Name Input */}
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

          {/* Email or Username Input */}
          <TextField
            variant="outlined"
            label="Username or Email"
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
            label="Password"
            name="password"
            onChange={handleChange}
            value={form.password}
            fullWidth
            error={Boolean(error.password)}
            helperText={error.password || 'Minimum 6 characters required'}
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
            name={'check box'}
            autoComplete="on"
            control={<Checkbox />}
            label="Remember me"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="outlined"
            endIcon={<SendIcon sx={{ color: 'success.main' }} />}
            size="large"
            disabled={loading || buttonDisabled}
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
              '&:hover': {
                transform: loading ? 'none' : 'translateY(-5px)'
              }
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
                sx={{ color: 'warning.main' }}
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
                <GithubIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Signup;
