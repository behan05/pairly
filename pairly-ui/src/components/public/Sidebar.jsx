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
  LoginOutlinedIcon,
  PersonAddAltOutlinedIcon
} from '@/MUI/MuiIcons';

import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

const drawerWidth = 80;

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const sidebarList = [
    { path: "/", text: "Home", icon: HomeOutlinedIcon, defaultColor: "primary" },
    { path: "/features", text: "Features", icon: BuildCircleOutlinedIcon, defaultColor: "secondary" },
    { path: "/about", text: "About", icon: InfoOutlinedIcon, defaultColor: "info" },
    { path: "/contact", text: "Contact", icon: ContactMailOutlinedIcon, defaultColor: "success" },
    { path: "/login", text: "Login", icon: LoginOutlinedIcon, defaultColor: "warning" },
    { path: "/register", text: "Create Account", icon: PersonAddAltOutlinedIcon, defaultColor: "error" }
  ];


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
          bgcolor: theme.palette.background.paper + '100',
          borderRadius: `0 10px 10px 0`,
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
          },
          ":hover": {
            borderRadius: `0 30px 30px 0`,
            borderRightColor: theme.palette.primary.main,
            borderRightStyle: 'solid',
            transition: 'all 0.3s ease-in-out',
            boxShadow: `0 0 15px ${theme.palette.primary.main}50`,
            '&::after': { animation: 'none' }
          }
        }
      }}
    >
      <List>
        {sidebarList.map((item, i) => {
          if (!isMobile && ['Login', 'Create Account'].includes(item.text)) return null;

          return (
            <ListItem key={i} disablePadding onClick={isMobile ? toggleSidebar : undefined}>
              <Tooltip title={item.text} placement="right">
                <NavLink
                  to={item.path}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {({ isActive }) => (
                    <IconButton
                      sx={{
                        width: "100%",
                        justifyContent: "center",
                        my: 1,
                        backdropFilter: isActive ? "blur(14px)" : "none",
                        transform: isActive ? "scale(1.3)" : "scale(1)",
                        transition: "all 0.3s ease",
                        color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
                        bgcolor: isActive ? theme.palette.action.selected : "transparent",
                        "&:hover": { bgcolor: "transparent" }
                      }}
                    >
                      <item.icon color={isActive ? "text.primary" : item.defaultColor} />
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
