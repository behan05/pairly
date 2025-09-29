import { useEffect, useMemo } from 'react';
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
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

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
    const { allUsers, chatUsers } = useSelector(state => state.privateChat);

    const onlineUserIds = useMemo(() => {
        return chatUsers.filter(u => u.isOnline).map(u => u.partnerId);
    }, [chatUsers]);

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
            // Dispatch immediately if conversationId is already available
            dispatch(fetchConversationMessages(userConversation.conversationId));
        } else {
            // Wait for the socket event to provide the conversationId
            socket.on('privateChat:partner-joined', ({ partnerId, conversationId }) => {
                if (partnerId === userId) {
                    dispatch(fetchConversationMessages(conversationId));
                }
            });
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
                                    my: 0.5,
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
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            variant="dot"
                                            sx={{
                                                '& .MuiBadge-dot': {
                                                    backgroundColor: onlineUserIds.includes(user.userId) ? 'green' : 'gray',
                                                    animation: onlineUserIds.includes(user.userId) ? 'blink 1.5s infinite' : 'none',
                                                },
                                                '@keyframes blink': {
                                                    '0%, 50%, 100%': { opacity: 1 },
                                                    '25%, 75%': { opacity: 0 },
                                                },
                                            }}
                                        >
                                            <Avatar
                                                src={user?.profile?.profileImage || defaultAvatar}
                                                alt={user?.profile?.fullName + ' profile Image'}
                                                sx={{ width: 35, height: 35, objectFit: 'cover' }}
                                            />
                                        </Badge>

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
                                                    fontSize: isSm ? '12px' : '14',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    wordBreak: 'break-all'
                                                }}
                                            >
                                                {
                                                    user?.lastMessage?.messageType === 'image' ?
                                                        <Stack flexDirection='row' alignItems='center' gap={0.5}>
                                                            <ImageIcon fontSize='small' sx={{ color: 'success.main' }} />
                                                            <Typography variant={'body2'}>image</Typography>
                                                        </Stack>
                                                        : user?.lastMessage?.messageType === 'video' ?
                                                            <Stack flexDirection='row' alignItems='center' gap={0.5}>
                                                                <VideoLibraryIcon fontSize='small' sx={{ color: 'primary.main' }} />
                                                                <Typography variant={'body2'}>video</Typography>
                                                            </Stack>
                                                            : user?.lastMessage?.messageType === 'file' ?
                                                                <Stack flexDirection='row' alignItems='center' gap={0.5}>
                                                                    <InsertDriveFileIcon fontSize='small' sx={{ color: 'secondary.main' }} />
                                                                    <Typography variant={'body2'}>file</Typography>
                                                                </Stack>
                                                                :
                                                                user?.lastMessage?.messageType === 'audio' ?
                                                                    <Stack flexDirection='row' alignItems='center' gap={0.5}>
                                                                        <AudiotrackIcon fontSize="small" sx={{ color: 'warning.main' }} />
                                                                        <Typography variant={'body2'}>audio</Typography>
                                                                    </Stack>
                                                                    :
                                                                    user?.lastMessage?.messageType === 'text'
                                                                        ? user.lastMessage.content.length > 36
                                                                            ? user.lastMessage.content.slice(0, 36) + '...'
                                                                            : user.lastMessage.content
                                                                        : 'No chat message yet'
                                                }
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