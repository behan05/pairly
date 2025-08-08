/**
 * @file BlockedList.jsx
 * @description
 * A visually enhanced BlockedList component for displaying and managing blocked users.
 * Users can view blocked profiles with details and easily unblock them.
 */

import { useEffect } from 'react';
import {
    Box,
    Stack,
    Button,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    useTheme,
    useMediaQuery,
    Paper
} from '@/MUI/MuiComponents';
import { BlockIcon, LockOpenIcon } from '@/MUI/MuiIcons';

// components
import ChatSidebarHeader from '../common/ChatSidebarHeader';

// redux
import { fetchBlockedUsers, unblockUser } from '@/redux/slices/moderation/blockUserAction';
import { useDispatch, useSelector } from 'react-redux';

// Toast notifications
import { toast } from 'react-toastify';

function BlockedList() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { blockedUsers } = useSelector(state => state.moderation);

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
            toast.success('User unblocked successfully');
            dispatch(fetchBlockedUsers());
        }
    };

    return (
        <Box sx={{ px: 2, pb: 2 }}>
            <ChatSidebarHeader />

            {blockedUsers.length === 0 ? (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 3, textAlign: 'center' }}
                >
                    You have not blocked any users yet.
                </Typography>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                        background: theme.palette.background.paper
                    }}
                >
                    <List disablePadding>
                        {blockedUsers.map((blockUser, index) => (
                            <Box key={index}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={blockUser?.profileImage}
                                            alt={blockUser?.fullName}
                                            sx={{
                                                border: `2px solid ${theme.palette.error.main}`
                                            }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight={600}
                                            >
                                                {blockUser?.fullName}
                                            </Typography>
                                        }
                                        secondary={
                                            <Stack spacing={0.5}>
                                                {blockUser.reason && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Reason: {blockUser.reason}
                                                    </Typography>
                                                )}
                                                <Typography
                                                    variant="caption"
                                                    color="text.disabled"
                                                    gutterBottom
                                                >
                                                    Blocked on{' '}
                                                    {new Date(blockUser.blockedAt).toLocaleDateString([], {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: '2-digit'
                                                    })}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<LockOpenIcon />}
                                                    color="success"
                                                    onClick={() => handleUnblock(blockUser.blockedUserId)}
                                                    sx={{ maxWidth: 'fit-content' }}
                                                >
                                                    Unblock
                                                </Button>
                                            </Stack>
                                        }
                                    />
                                </ListItem>
                                {index < blockedUsers.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}

export default BlockedList;
