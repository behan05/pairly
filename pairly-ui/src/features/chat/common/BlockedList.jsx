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
                p: 1.5,
                mb: 1,
                borderRadius: 0.5,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `inset 0 2px 6px ${theme.palette.divider}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.01)',
                  boxShadow: `0 4px 10px ${theme.palette.divider}`,
                },
              }}
            >
              {/* Avatar + Info */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={user?.profileImage || defaultAvatar}
                  alt={`${user?.fullName} profile`}
                  sx={{
                    objectFit: 'cover',
                  }}
                />
                <Stack>
                  <Typography
                    variant={isSm ? 'body2' : 'body1'}
                    fontWeight={600}
                    color="text.primary"
                  >
                    {user?.fullName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Blocked on{' '}
                    {new Date(user.blockedAt).toLocaleDateString([], {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </Typography>
                </Stack>
              </Stack>

              {/* Actions */}
              {isSm ? (
                <Tooltip title="Unblock User">
                  <IconButton color="success" onClick={() => handleUnblock(user)}>
                    <LockOpenIcon sx={{ color: theme.palette.success.main }} />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="outlined"
                  color='success'
                  startIcon={<LockOpenIcon sx={{ color: theme.palette.text.primary }} />}
                  onClick={() => handleUnblock(user)}
                >
                  Unblock
                </Button>
              )}
            </Stack>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default BlockedList;
