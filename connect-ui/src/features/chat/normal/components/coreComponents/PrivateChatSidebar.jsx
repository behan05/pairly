import { useEffect } from 'react';
import {
    Box,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
    CircularProgress,
    Tooltip,
    TextField,
} from '@/MUI/MuiComponents';
import {
    SearchIcon,
    defaultAvatar,
} from '@/MUI/MuiIcons';

// Components
import ChatSidebarHeader from '@/features/chat/common/ChatSidebarHeader';
import textFormater from '@/utils/textFormatting';
import SettingsAction from '@/components/private/SettingsAction';

// redux and Socket
import { fetchAllUser } from '@/redux/slices/privateChat/privateChatAction';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import { addMessage } from '@/redux/slices/privateChat/privateChatSlice';
import { socket } from '@/services/socket';

function PrivateChatSidebar() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { setSelectedUserId, activeUserId, setActiveUserId } = useOutletContext();
    const { allUsers, loading } = useSelector(state => state.privateChat);

    useEffect(() => {
        dispatch(fetchAllUser());
    }, [dispatch]);

    const handleUserClick = (userId) => {
        setActiveUserId(userId);
        setSelectedUserId(userId);

        if (userId) {
            socket.emit('privateChat:join', { partnerUserId: userId });
        }
    };

    return (
        <Box
            position="relative"
            display="flex"
            flexDirection="column"
            bgcolor="background.paper"
            minWidth={300}
            px={2}
            sx={{
                minHeight: '100vh',
                maxHeight: '100vh',
                overflowY: 'auto'
            }}
        >
            {/* === Sidebar header with Search Bar === */}
            <ChatSidebarHeader>
                <Box mt={1}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Search user..."
                        // value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
                        }}
                    />
                </Box>
            </ChatSidebarHeader>

            {/* User List */}
            {loading && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">
                        Loading friend list...
                    </Typography>
                </Stack>
            )}

            {allUsers.length === 0 ?
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 3, textAlign: 'center' }}
                >
                    No friends yet — start connecting!
                </Typography> :
                <Box sx={{
                    ':hover': {
                        cursor: 'pointer'
                    }
                }}>
                    {allUsers.map((user, index) => {
                        const isActive = activeUserId === user.userId;
                        return (
                            <Stack
                                key={index}
                                sx={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: `0.1px solid ${theme.palette.divider}`,
                                    borderRadius: 0.4,
                                    p: 1,
                                    mt: 0.5,
                                    bgcolor: isActive ? theme.palette.action.selected : 'transparent', // highlight
                                    transition: 'background-color 0.3s ease',
                                    ':hover': {
                                        backgroundColor: theme.palette.action.hover
                                    }
                                }}
                                onClick={() => handleUserClick(user.userId)}
                            >
                                <Stack
                                    sx={{
                                        flexDirection: 'row',
                                        gap: 2,
                                        width: '100%',
                                    }}
                                >
                                    <Tooltip title={user?.profile?.shortBio}>
                                        <Stack
                                            component={'img'}
                                            src={user?.profile?.profileImage || defaultAvatar}
                                            alt={user?.profile?.fullName + 'profile Image'}
                                            maxWidth={35}
                                            sx={{
                                                objectFit: 'cover',
                                                borderRadius: 0.5
                                            }}
                                        />
                                    </Tooltip>

                                    <Stack flex={1}>
                                        <Stack
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Typography
                                                variant={isSm ? 'body2' : 'body1'}
                                                sx={{
                                                    fontSize: isSm ? '14px' : 'initial'
                                                }}
                                            >
                                                {textFormater(user.profile?.fullName)}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.disabled"
                                                sx={{ fontSize: '12px' }}
                                            >
                                                {user?.lastMessage?.createdAt
                                                    ? new Date(user.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : ' '}
                                            </Typography>
                                        </Stack>

                                        <Typography
                                            variant='body2'
                                            color={'text.secondary'}
                                            sx={{
                                                fontSize: isSm ? '14px' : 'initial'
                                            }}
                                        >
                                            {user?.lastMessage
                                                ? textFormater(user?.lastMessage?.text)
                                                : 'No chat message yet'}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        );
                    })}
                </Box>
            }
            {/* Floating Settings icon at bottom of sidebar */}
            <Box sx={{
                position: 'absolute',
                bottom: 20,
                right: 60
            }}>
                <SettingsAction />
            </Box>
        </Box>
    )
}

export default PrivateChatSidebar;