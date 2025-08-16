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
  useMediaQuery
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
    document.title = 'Connect - Blocked Users';
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
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `inset 0 0 0.2rem ${theme.palette.divider}`,
                borderRadius: 0.5,
                p: 1,
                mb: index !== blockedUsers.length - 1 ? 1 : 0
              }}
            >
              <Stack sx={{ flexDirection: 'row', gap: 2 }}>
                <Tooltip title={user?.fullName}>
                  <Stack
                    component={'img'}
                    src={user?.profileImage || defaultAvatar}
                    alt={user?.fullName + ' profile image'}
                    maxWidth={35}
                    sx={{
                      objectFit: 'cover',
                      borderRadius: 0.5
                    }}
                  />
                </Tooltip>

                <Stack>
                  <Typography
                    variant={isSm ? 'body2' : 'body1'}
                    sx={{ fontSize: isSm ? '14px' : 'initial' }}
                  >
                    {user?.fullName}
                  </Typography>
                  <Typography
                    variant='body2'
                    color={'text.secondary'}
                    sx={{
                      fontSize: isSm ? '14px' : 'inital'
                    }}
                  >
                    Blocked on{' '}
                    {new Date(user.blockedAt).toLocaleDateString([], {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    })}
                  </Typography>
                </Stack>
              </Stack>

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
                  sx={{ fontSize: isSm ? '14px' : 'initial' }}
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
