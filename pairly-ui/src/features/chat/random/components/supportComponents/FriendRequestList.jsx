import { useEffect } from 'react';
import {
    Box,
    Stack,
    Typography,
    useTheme,
    useMediaQuery,
    Tooltip,
    IconButton,
    Divider,
    Avatar
} from '@/MUI/MuiComponents';
import {
    CloseIcon,
    CheckCircleIcon,
    defaultAvatar,
} from '@/MUI/MuiIcons';
// components
import ChatSidebarHeader from '../../../common/ChatSidebarHeader';
import StyledText from '@/components/common/StyledText';
import textFormater from '@/utils/textFormatting';
import { acceptFriendRequest, declineFriendRequest } from '@/redux/slices/randomChat/friendRequestAction'
import { fetchFriendRequests } from '@/redux/slices/randomChat/friendRequestAction';
import { useSelector, useDispatch } from 'react-redux';

function FriendRequestList() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { requests, loading, error } = useSelector(state => state.friendRequest);

    useEffect(() => {
        document.title = 'Pairly - Friend Requests';
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchFriendRequests());
    }, []);

    const split = (gender) => gender?.[0]?.toUpperCase() ?? '';

    const handleAcceptRequest = async (userId) => {
        if (!userId) return;

        await dispatch(acceptFriendRequest({ sender: userId }));
    };

    const handleRejectRequest = async (userId) => {
        if (!userId) return;

        await dispatch(declineFriendRequest({ sender: userId }))
    };

    return (
        <Box sx={{ px: 1.5, pb: 2, overflowY: 'auto' }}>
            <ChatSidebarHeader />

            {requests.length === 0 ? (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 3, textAlign: 'center' }}
                >
                    No friend requests yet — start connecting!
                </Typography>
            ) : (
                <Box>
                    {requests.map((request, index) => (
                        <Stack key={index} spacing={1.2} py={1.2}>
                            <Stack
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
                                {/* Left: Avatar + Info */}
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                    sx={{
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Avatar
                                        src={request?.profileImage || defaultAvatar}
                                        alt={request?.fullName}
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
                                            {textFormater(request.fullName)}{' '}
                                            <StyledText text={split(request?.gender ?? ' ')} />
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
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
                                            sent you a friend request
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {/* Right: Actions */}
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                >
                                    <Tooltip title="Accept">
                                        <IconButton
                                            onClick={() => handleAcceptRequest(request.sender)}
                                            sx={{
                                                borderRadius: 0.2,
                                                backgroundColor: theme.palette.background.paper,
                                                color: theme.palette.success.main,

                                                position: "relative",
                                                overflow: "hidden",

                                                transition: "all .25s cubic-bezier(.4,.0,.2,1)",

                                                boxShadow: `
                                                    0 0 0 1px ${theme.palette.action.hover}
                                                `,

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
                                            <CheckCircleIcon
                                                className='search-icon'
                                                sx={{
                                                    fontSize: "medium",
                                                    color: 'text.primary',
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Reject">
                                        <IconButton
                                            onClick={() => handleRejectRequest(request.sender)}
                                            sx={{
                                                borderRadius: 0.2,
                                                backgroundColor: theme.palette.background.paper,
                                                color: theme.palette.error.main,

                                                position: "relative",
                                                overflow: "hidden",

                                                transition: "all .25s cubic-bezier(.4,.0,.2,1)",

                                                boxShadow: `
                                                    0 0 0 1px ${theme.palette.action.hover}
                                                `,

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
                                                    ${theme.palette.error.main},
                                                    transparent
                                                )`,
                                                    opacity: 0.6,
                                                },
                                            }}
                                        >
                                            <CloseIcon
                                                className="icon-red"
                                                sx={{
                                                    fontSize: "medium",
                                                    color: 'error.main',
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>

                            {/* Divider between requests */}
                            {index < requests.length - 1 && (
                                <Divider sx={{ mt: 1, opacity: 0.6 }} />
                            )}
                        </Stack>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default FriendRequestList