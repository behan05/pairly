import { useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  Typography,
  Tooltip,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Avatar
} from '@/MUI/MuiComponents';
import {
  LockOpenIcon,
  defaultAvatar,
} from '@/MUI/MuiIcons';

// components
import ChatSidebarHeader from './ChatSidebarHeader';

// redux
import { fetchBlockedUsers, unblockUser } from '@/redux/slices/moderation/blockUserAction';
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

  const handleUnblock = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to unblock this user?');
    if (!confirmed) return;

    const result = await dispatch(unblockUser(userId));
    if (result?.success) {
      dispatch(fetchBlockedUsers());
    }
  };

  return (
    <Box sx={{ px: 2, pb: 2, overflowY: 'auto' }}>
      <ChatSidebarHeader />

      {isBlocking && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CircularProgress size={18} />
          <Typography variant="body2" color="text.secondary">
            Loading blocked users...
          </Typography>
        </Stack>
      )}

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
                mb: 1.5,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.warning.light}`,
                boxShadow: `0 2px 6px ${theme.palette.divider}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.01)',
                  boxShadow: `0 4px 10px ${theme.palette.divider}`,
                },
              }}
            >
              {/* Avatar + Info */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack
                  component="img"
                  src={user?.profileImage || defaultAvatar}
                  alt={`${user?.fullName} profile`}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
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
                  <IconButton color="success" onClick={() => handleUnblock(user.blockedUserId)}>
                    <LockOpenIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<LockOpenIcon />}
                  onClick={() => handleUnblock(user.blockedUserId)}
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
