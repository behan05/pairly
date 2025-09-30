import { useEffect } from 'react';
import {
    Box,
    Stack,
    Typography,
    useTheme,
    useMediaQuery,
    Button,
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
import { useSelector, useDispatch } from 'react-redux';

function FriendRequestList() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { requests, loading, error } = useSelector(state => state.friendRequest);

    useEffect(() => {
        document.title = 'Pairly - Friend Requests';
    }, [dispatch]);

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
                    No friends yet — start connecting!
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
                                {/* Left: Avatar + Info */}
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Avatar
                                        src={request?.profileImage || defaultAvatar}
                                        alt={request?.fullName}
                                        sx={{ width: 44, height: 44 }}
                                    />
                                    <Stack>
                                        <Typography
                                            variant={isSm ? 'body2' : 'body1'}
                                            fontWeight={500}
                                        >
                                            {textFormater(request.fullName)}{' '}
                                            <StyledText text={split(request?.gender ?? ' ')} />
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            noWrap
                                            sx={{ maxWidth: 180 }}
                                        >
                                            sent you a friend request
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {/* Right: Actions */}
                                {isSm ? (
                                    <Stack direction="row" spacing={0.5}>
                                        <Tooltip title="Accept">
                                            <IconButton
                                                onClick={() => handleAcceptRequest(request.sender)}
                                            >
                                                <CheckCircleIcon
                                                    sx={{ color: theme.palette.success.main }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                            <IconButton
                                                onClick={() => handleRejectRequest(request.sender)}
                                            >
                                                <CloseIcon sx={{ color: theme.palette.error.main }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                ) : (
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="success"
                                            onClick={() => handleAcceptRequest(request.sender)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="error"
                                            onClick={() => handleRejectRequest(request.sender)}
                                        >
                                            Ignore
                                        </Button>
                                    </Stack>
                                )}
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