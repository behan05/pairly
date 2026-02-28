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
import SearchInputBox from '@/features/chat/common/SearchInputBox';
import textFormater from '@/utils/textFormatting';
import formatMessageTime from '@/utils/formatMessageTime';
import SettingsAction from '@/components/private/SettingsAction';
import Loading from '@/components/common/Loading';

// redux and Socket
import { setActivePartnerId, setUnreadCount } from '@/redux/slices/privateChat/privateChatSlice';
import { fetchAllUser, fetchUnreadCounts, fetchConversationMessages } from '@/redux/slices/privateChat/privateChatAction';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { socket } from '@/services/socket';
import StyledActionButton from '@/components/common/StyledActionButton';

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
                    }}
                >
                    <SearchInputBox
                        placeholder={'Search user...'}
                        value={searchValue}
                        handleChange={(e) => setSearchValue(e.target.value)}
                        sx={{ flex: 1 }}
                    />

                    <StyledActionButton
                        icon={<BoltIcon sx={{ color: 'success.main' }} />}
                        text='Choose Chat'
                        redirectUrl={'/pairly'}
                        sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 0.2,
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

                                // tooltip text
                                const tooltipText = showOnlineStatus
                                    ? (isOnline ? 'Online' : 'Offline')
                                    : 'Activity status hidden';

                                const unseenCount = unreadCount[user.conversationId]?.count || 0;

                                return (
                                    <Stack
                                        key={index}
                                        onClick={() => handleUserClick(user.userId)}
                                        sx={(theme) => ({
                                            position: "relative",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",

                                            px: 1,
                                            py: 1,
                                            my: 0.3,

                                            cursor: "pointer",

                                            backgroundColor: isActive
                                                ? theme.palette.action.selected
                                                : "transparent",

                                            transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",

                                            // LEFT ACTIVE BAR
                                            "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                bottom: 0,
                                                width: isActive ? 3 : 0,
                                                backgroundColor: theme.palette.primary.main,
                                                transition: "all 0.25s ease",
                                            },

                                            "&:hover": {
                                                backgroundColor: theme.palette.action.hover,
                                                transform: "translateX(3px)",
                                            },
                                        })}
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
                                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                    variant="dot"
                                                    sx={(theme) => ({
                                                        "& .MuiBadge-dot": {
                                                            backgroundColor: showOnlineStatus
                                                                ? isOnline
                                                                    ? theme.palette.success.main
                                                                    : theme.palette.grey[500]
                                                                : theme.palette.grey[400],
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: "50%",
                                                            border: `2px solid ${theme.palette.background.paper}`,
                                                            boxShadow: isOnline
                                                                ? `0 0 8px ${theme.palette.success.main}`
                                                                : "none",
                                                            transition: "all 0.3s ease",
                                                        },
                                                    })}
                                                >
                                                    <Avatar
                                                        src={
                                                            userSettings?.showProfilePic
                                                                ? user?.profile?.profileImage || defaultAvatar
                                                                : defaultAvatar
                                                        }
                                                        alt={user?.profile?.fullName + " profile Image"}
                                                        sx={(theme) => ({
                                                            width: 44,
                                                            height: 44,
                                                            objectFit: "cover",
                                                            transition: "all 0.3s ease",
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            boxShadow: `
                                                              0 4px 10px ${theme.palette.common.black}15
                                                            `,
                                                            "&:hover": {
                                                                transform: "scale(1.05)",
                                                                boxShadow: `
                                                               0 6px 16px ${theme.palette.common.black}25
                                                             `,
                                                            },
                                                        })}
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