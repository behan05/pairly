import {
  AppBar,
  Box,
  Toolbar,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
  Tooltip
} from '@/MUI/MuiComponents';
import { MenuIcon, LockOpenIcon, LockIcon } from '@/MUI/MuiIcons';
import StyledButton from '../common/StyledButton';
import { useSidebar } from '@/context/SidebarContext';
import { Link } from 'react-router-dom';
import BgToggle from './BgToggle';

const navListBtn = [
  { path: '/login', text: 'Login', icon: <LockOpenIcon sx={{ color: 'success.main' }} /> },
  { path: '/register', text: 'Create Account', icon: <LockIcon sx={{ color: 'success.main' }} /> }
];

function Navbar() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { toggleSidebar } = useSidebar();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        userSelect: 'none'
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          py: 1,
          flexWrap: 'wrap',
          bgcolor: 'transparent',
          backdropFilter: 'blur(4px)'
        }}
      >
        <Stack component={Link} to={'/'}>
          <Stack
            component={'img'}
            src={'/logo.png'}
            alt="Pairly logo"
            aria-label="Pairly logo"
            maxWidth={isSm ? 48 : 55}
            sx={{
              filter: 'brightness(120%) drop-shadow(0 4px 2px',
            }}
          />
        </Stack>

        {isSm ? (
          <Stack flexDirection={'row'} gap={1}>
            {/* === Bg Toggle Component === */}
            <BgToggle />
            <Tooltip title="Open Menu">
              <IconButton onClick={toggleSidebar}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* === Bg Toggle Component === */}
            <BgToggle />

            {navListBtn.map((cta, i) => (
              <StyledButton key={i} text={cta.text} redirectUrl={cta.path} icon={cta.icon} />
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
