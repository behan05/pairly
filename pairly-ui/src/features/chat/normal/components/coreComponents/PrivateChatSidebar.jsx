import { useEffect } from 'react';
import {
    Box,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
    Tooltip,
    TextField,
    Avatar,
    Badge,
} from '@/MUI/MuiComponents';
import {
    SearchIcon,
    defaultAvatar,
} from '@/MUI/MuiIcons';

// Components
import ChatSidebarHeader from '@/features/chat/common/ChatSidebarHeader';
import textFormater from '@/utils/textFormatting';
import formatMessageTime from '@/utils/formatMessageTime';
import SettingsAction from '@/components/private/SettingsAction';

// redux and Socket
import { fetchAllUser, fetchConversationMessages } from '@/redux/slices/privateChat/privateChatAction';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { socket } from '@/services/socket';

function PrivateChatSidebar() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { setSelectedUserId, activeUserId, setActiveUserId } = useOutletContext();
    const { allUsers, chatUsers, loading } = useSelector(state => state.privateChat);

    useEffect(() => {
        dispatch(fetchAllUser());
    }, [dispatch]);

    const handleUserClick = (userId) => {
        setActiveUserId(userId);
        setSelectedUserId(userId);

        if (!userId) return;

        // Emit to socket to join
        socket.emit('privateChat:join', { partnerUserId: userId });

        // Checking if this user already has a conversation in chatUsers
        const userConversation = chatUsers.find(u => u.partnerId === userId);

        if (userConversation?.conversationId) {
            dispatch(fetchConversationMessages(userConversation.conversationId));
        };
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
                        const unseenCount = 1;
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
                                    bgcolor: isActive ? theme.palette.action.selected : 'transparent',
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
                                        gap: 1.5,
                                        width: '100%',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Tooltip title={user?.profile?.shortBio}>
                                        <Avatar
                                            src={user?.profile?.profileImage || defaultAvatar}
                                            alt={user?.profile?.fullName + 'profile Image'}
                                            maxWidth={35}
                                            sx={{
                                                objectFit: 'cover',
                                                borderRadius: '50%'
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
                                                {formatMessageTime(user?.lastMessageTime)}
                                            </Typography>
                                        </Stack>

                                        {/* Text area with Badge count */}
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            sx={{ width: '100%' }}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    maxWidth: '100%',
                                                    fontSize: isSm ? '14px' : 'initial',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    wordBreak: 'break-all'
                                                }}
                                            >
                                                {user?.lastMessage
                                                    ? user.lastMessage.content.length > 36
                                                        ? user.lastMessage.content.slice(0, 36) + '...'
                                                        : user.lastMessage.content
                                                    : 'No chat message yet'}
                                            </Typography>

                                            {/* {unseenCount > 0 && (
                                                <Badge
                                                    badgeContent={unseenCount}
                                                    color={'success'}
                                                    sx={{
                                                        '& .MuiBadge-badge': {
                                                            right: 10,
                                                            top: 0,
                                                            fontSize: '0.7rem',
                                                            minWidth: 20,
                                                            height: 20,
                                                            borderRadius: 50,
                                                            color: 'text.primary'
                                                        }
                                                    }}
                                                />
                                            )} */}
                                        </Stack>

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