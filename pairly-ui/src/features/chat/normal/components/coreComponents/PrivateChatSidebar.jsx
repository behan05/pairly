import { useEffect, useMemo, useState } from 'react';
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
    Button
} from '@/MUI/MuiComponents';
import {
    SearchIcon,
    defaultAvatar,
    LocationOnIcon,
} from '@/MUI/MuiIcons';
import BoltIcon from '@mui/icons-material/Bolt';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

// Components
import ChatSidebarHeader from '@/features/chat/common/ChatSidebarHeader';
import textFormater from '@/utils/textFormatting';
import formatMessageTime from '@/utils/formatMessageTime';
import SettingsAction from '@/components/private/SettingsAction';
import Loading from '@/components/common/Loading';

// redux and Socket
import { setActivePartnerId, setUnreadCount } from '@/redux/slices/privateChat/privateChatSlice';
import { fetchAllUser, fetchUnreadCounts, fetchConversationMessages } from '@/redux/slices/privateChat/privateChatAction';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useOutletContext } from 'react-router-dom';
import { socket } from '@/services/socket';
import StyledActionButton from '../../../../../components/common/StyledActionButton';

function PrivateChatSidebar() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { setSelectedUserId, activeUserId, setActiveUserId } = useOutletContext();
    const { allUsers, chatUsers, loading, unreadCount } = useSelector(state => state.privateChat);

    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        dispatch(fetchAllUser());
        dispatch(fetchUnreadCounts());
    }, [dispatch]);

    useEffect(() => {
        const handlePartnerJoined = ({ partnerId, conversationId }) => {
            // Only fetch if this conversation is not already loaded
            const userConversation = chatUsers.find(u => u.partnerId === partnerId);
            if (!userConversation?.conversationId) {
                dispatch(fetchConversationMessages(conversationId));
            }
        };

        socket.on('privateChat:partner-joined', handlePartnerJoined);

        return () => {
            socket.off('privateChat:partner-joined', handlePartnerJoined);
        };

    }, [dispatch]);

    const handleUserClick = (userId) => {
        if (!userId) return;

        setActiveUserId(userId);
        setSelectedUserId(userId);
        dispatch(setActivePartnerId(userId));

        socket.emit('privateChat:join', { partnerUserId: userId });

        const userConversation = chatUsers.find(u => u.partnerId === userId);

        if (userConversation?.conversationId) {
            // Tell server to mark messages as read
            socket.emit('privateChat:readMessage', {
                conversationId: userConversation.conversationId
            });

            // Clear local badge immediately
            dispatch(setUnreadCount({
                conversationId: userConversation.conversationId,
                partnerId: userId,
                count: 0
            }));
        }

        if (userConversation?.conversationId && userConversation.partnerId !== activeUserId) {
            dispatch(fetchConversationMessages(userConversation.conversationId));
        }
    };

    // filter users by search
    const filteredUsers = useMemo(() => {
        return allUsers
            .map(u => ({
                ...u,
                lastMessage: u.lastMessage || {},
            }))
            .filter(user =>
                user?.profile?.fullName
                    ?.toLowerCase()
                    .includes(searchValue.toLowerCase())
            )
            .sort((a, b) => {
                const aTime = new Date(a?.lastMessage?.createdAt || 0).getTime();
                const bTime = new Date(b?.lastMessage?.createdAt || 0).getTime();
                return bTime - aTime; // most recent first
            });
    }, [allUsers, searchValue]);

    return (
        <Box
            position="relative"
            display="flex"
            flexDirection="column"
            bgcolor="background.paper"
            minWidth={isSm ? '100%' : 300}
            px={1.5}
            sx={{
                minHeight: 'calc(var(--vh, 1vh) * 100)',
                maxHeight: 'calc(var(--vh, 1vh) * 100)',
                overflowY: 'auto'
            }}
        >
            {/* === Sidebar header with Search Bar === */}
            <ChatSidebarHeader>
                <Box
                    mt={1}
                    sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center"
                    }}
                >
                    <Stack flex={1}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Search user..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 0.5,
                                },
                            }}
                        />
                    </Stack>
                        <StyledActionButton
                            icon={<BoltIcon sx={{ color: 'info.dark' }} />}
                            text='Random Chat'
                            redirectUrl={'/pairly'}
                            sx={{
                                background: `linear-gradient(180deg,
                                ${theme.palette.background.paper},
                                ${theme.palette.info.dark}10)`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: `linear-gradient(180deg,
                                ${theme.palette.info.dark}10,
                                ${theme.palette.background.paper}15)`,
                                }
                            }}
                        />
                </Box>
            </ChatSidebarHeader>

            {loading ? (
                <Loading sx={{
                    background: theme.palette.background.paper,
                    maxHeight: 300
                }} />
            ) : (
                <>
                    {filteredUsers.length === 0 ?
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 3, textAlign: 'center' }}
                        >
                            No friends yet — start random chat!
                        </Typography> :
                        <Box sx={{
                            ':hover': {
                                cursor: 'pointer'
                            }
                        }}>
                            {filteredUsers.map((user, index) => {
                                const isActive = activeUserId === user.userId;

                                // get the user's settings
                                const userSettings = user?.settings || {};
                                const showOnlineStatus = userSettings.showOnlineStatus;

                                // determine online indicator
                                const isOnline = chatUsers.find(u => u.partnerId === user.userId)?.isOnline;

                                // color logic
                                const dotColor = showOnlineStatus
                                    ? (isOnline ? 'green' : 'gray')
                                    : 'gray';

                                // tooltip text
                                const tooltipText = showOnlineStatus
                                    ? (isOnline ? 'Online' : 'Offline')
                                    : 'Activity status hidden';

                                const unseenCount = unreadCount[user.conversationId]?.count || 0;

                                return (
                                    <Stack
                                        key={index}
                                        sx={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 0.5,
                                            p: 0.5,
                                            my: 0.5,
                                            bgcolor: isActive ? theme.palette.action.selected : 'transparent',
                                            transition: 'background-color 0.3s ease',
                                            ':hover': {
                                                background: theme.palette.action.hover
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
                                            <Tooltip title={tooltipText}>
                                                <Badge
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    variant="dot"
                                                    sx={{
                                                        '& .MuiBadge-dot': {
                                                            backgroundColor: dotColor,
                                                            animation: (isOnline && showOnlineStatus) ? 'blink 2s infinite' : 'none',
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%'
                                                        },
                                                        '@keyframes blink': {
                                                            '0%, 50%, 100%': { opacity: 1 },
                                                            '25%, 75%': { opacity: 0 },
                                                        },
                                                    }}
                                                >
                                                    <Avatar
                                                        src={userSettings?.showProfilePic ? (user?.profile?.profileImage || defaultAvatar) : defaultAvatar}
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
                                                                            user?.lastMessage?.messageType === 'location' ?
                                                                                <Stack flexDirection='row' alignItems='center' gap={0.5}>
                                                                                    <LocationOnIcon fontSize="small" sx={{ color: 'error.main' }} />
                                                                                    <Typography variant={'body2'}>location</Typography>
                                                                                </Stack>
                                                                                :
                                                                                user?.lastMessage?.messageType === 'text'
                                                                                    ? user.lastMessage.content.length > 36
                                                                                        ? user.lastMessage.content.slice(0, 36) + '...'
                                                                                        : user.lastMessage.content
                                                                                    : 'No chat message yet'
                                                        }
                                                    </Typography>

                                                    {unseenCount > 0 && (
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
                                                    )}
                                                </Stack>

                                            </Stack>
                                        </Stack>
                                    </Stack>
                                );
                            })}
                        </Box>
                    }
                </>
            )}

            {/* Floating Settings icon at bottom of sidebar */}
            <SettingsAction />
        </Box>
    )
};

export default PrivateChatSidebar;