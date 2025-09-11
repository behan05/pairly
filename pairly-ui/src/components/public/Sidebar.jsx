import {
  Drawer,
  List,
  ListItem,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@/MUI/MuiComponents';
import {
  HomeOutlinedIcon,
  BuildCircleOutlinedIcon,
  InfoOutlinedIcon,
  ContactMailOutlinedIcon,
  LockOpenIcon,
  LockIcon
} from '@/MUI/MuiIcons';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

const drawerWidth = 80;

const sidebarList = [
  { path: '/', text: 'Home', icon: <HomeOutlinedIcon /> },
  { path: '/features', text: 'Features', icon: <BuildCircleOutlinedIcon /> },
  { path: '/about', text: 'About', icon: <InfoOutlinedIcon /> },
  { path: '/contact', text: 'Contact', icon: <ContactMailOutlinedIcon /> },
  { path: '/login', text: 'Login', icon: <LockOpenIcon /> },
  { path: '/register', text: 'Unlock Access', icon: <LockIcon /> }
];

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile && isSidebarOpen}
      onClose={isMobile && toggleSidebar}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          bgcolor: 'inherit',
          backdropFilter: isMobile ? `blur(14px)` : `blur(4px)`,
          borderRadius: 1,
          p: 2,
          position: 'fixed',
          top: '50%',
          transform: 'translateY(-50%)',
          height: 'fit-content',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            width: '2px',
            height: '100%',
            background: `linear-gradient(to bottom, transparent 50%, ${theme.palette.success.main} 10%, ${theme.palette.warning.main}, transparent 100%)`,
            backgroundSize: '100% 200%',
            animation: 'glowFlow 4s ease-in-out infinite'
          }
        }
      }}
    >
      <List>
        {sidebarList.map((item, i) => {
          if (!isMobile && ['Login', 'Unlock Access'].includes(item.text)) return null;

          return (
            <ListItem key={i} disablePadding onClick={isMobile ? toggleSidebar : undefined}>
              <Tooltip
                title={item.text}
                placement="right"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'transparent',
                      boxShadow: `inset 0 0 2px ${theme.palette.secondary.dark}`,
                      color: theme.palette.text.primary,
                      px: 1.5,
                      py: 0.8,
                      fontSize: '0.85rem',
                      backdropFilter: 'blur(4px)'
                    }
                  },
                  arrow: {
                    sx: {
                      color: theme.palette.secondary.main
                    }
                  }
                }}
              >
                <NavLink
                  to={item.path}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {({ isActive }) => (
                    <IconButton
                      sx={{
                        color: isActive ? 'success.main' : theme.palette.text.secondary,
                        width: '100%',
                        justifyContent: 'center',
                        my: 1,
                        backdropFilter: isActive ? 'blur(14px)' : 'none',
                        transform: isActive ? 'scale(1.3)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'transparent'
                        }
                      }}
                    >
                      {item.icon}
                    </IconButton>
                  )}
                </NavLink>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
