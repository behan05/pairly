import { useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  Typography,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@/MUI/MuiComponents';
import {
  LockOpenIcon,
  defaultAvatar,
} from '@/MUI/MuiIcons';

// components
import ChatSidebarHeader from './ChatSidebarHeader';

// redux
import { fetchBlockedUsers, unblockUser, privateUnblockUser } from '@/redux/slices/moderation/blockUserAction';
import { useDispatch, useSelector } from 'react-redux';

function BlockedList() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { blockedUsers, isBlocking } = useSelector((state) => state.moderation);

  useEffect(() => {
    document.title = 'Pairly - Blocked Users';
  }, []);

  useEffect(() => {
    dispatch(fetchBlockedUsers());
  }, [dispatch]);

  const handleUnblock = async (user) => {
    const confirmed = window.confirm('Are you sure you want to unblock this user?');
    if (!confirmed) return;

    try {
      let result;
      if (user.isRandomChat) {
        result = await dispatch(unblockUser(user.blockedUserId));
      } else {
        result = await dispatch(privateUnblockUser(user.blockedUserId));
      }

      if (result?.success) {
        dispatch(fetchBlockedUsers());
      } else {
        alert('Failed to unblock user. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Box sx={{ px: 1.5, pb: 2, overflowY: 'auto' }}>
      <ChatSidebarHeader />

      {blockedUsers.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          You have not blocked any users yet.
        </Typography>
      ) : (
        <Box>
          {blockedUsers.map((user, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 0.9,
                borderRadius: 0.5,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `
                    0 0 0 1px ${theme.palette.action.hover},
                    0 8px 24px ${theme.palette.mode === "dark"
                    ? theme.palette.common.black + "66"
                    : theme.palette.common.black + "14"}
                    `,

                position: "relative",
                overflow: "hidden",

                transition: "all .25s cubic-bezier(.4,.0,.2,1)",

                // thin top accent line (theme driven)
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  background: `linear-gradient(
                  90deg,
                  transparent,
                  ${theme.palette.success.main},
                  transparent
                  )`,
                  opacity: 0.6,
                },

                "&:hover .search-icon": {
                  color: 'success.main'
                },

                "&:hover .icon-red": {
                  color: 'error.dark'
                }
              }}
            >
              {/* Avatar + Info */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={user?.profileImage || defaultAvatar}
                  alt={`${user?.fullName} profile`}
                  sx={{
                    width: 40,
                    height: 40,

                    borderRadius: '50%',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
                <Stack>
                  <Typography
                    variant={isSm ? 'body2' : 'body1'}
                    sx={{
                      fontWeight: 600,
                      letterSpacing: 0.3,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {user?.fullName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.68rem",
                      letterSpacing: 0.6,
                      whileSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}
                  >
                    Blocked on{' '}
                    {new Date(user.blockedAt).toLocaleDateString([], {
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit',
                    })}
                  </Typography>
                </Stack>
              </Stack>

              {/* Actions */}
              <Tooltip title="Unblock User">
                <IconButton
                  onClick={() => handleUnblock(user)}
                  sx={{
                    borderRadius: 0.2,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.success.main,

                    position: "relative",
                    overflow: "hidden",

                    transition: "all .25s cubic-bezier(.4,.0,.2,1)",

                    boxShadow: `0 0 0 1px ${theme.palette.action.hover}`,

                    "&:hover": {
                      transform: "translateY(-1px)",
                    },

                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      background: `linear-gradient(
                        90deg,
                        transparent,
                        ${theme.palette.success.main},
                        transparent
                        )`,
                      opacity: 0.6,
                    },
                  }}
                >
                  <LockOpenIcon
                    className='search-icon'
                    sx={{
                      fontSize: "medium",
                      color: 'text.primary',
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default BlockedList;
