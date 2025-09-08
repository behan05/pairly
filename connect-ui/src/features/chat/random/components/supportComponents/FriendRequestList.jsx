import { useEffect } from 'react';
import {
    Box,
    Stack,
    Typography,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Button,
    Tooltip,
    IconButton,
    Divider
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
import { fetchFriendRequests, acceptFriendRequest, declineFriendRequest } from '@/redux/slices/randomChat/friendRequestAction'
import { useSelector, useDispatch } from 'react-redux';

function FriendRequestList() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { requests, loading, error } = useSelector(state => state.friendRequest);

    useEffect(() => {
        document.title = 'Pairly - Friend Requests';

        dispatch(fetchFriendRequests())
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
        <Box
            sx={{
                px: 2,
                pb: 2,
                overflowY: 'auto'
            }}
        >
            <ChatSidebarHeader />

            {loading && (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">
                        Loading friend requests...
                    </Typography>
                </Stack>
            )}

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
                                mt: 1
                            }}
                        >
                            <Stack sx={{
                                flexDirection: 'row',
                                gap: 2
                            }}>
                                <Tooltip title={request?.bio}>
                                    <Stack
                                        component={'img'}
                                        src={request?.profileImage || defaultAvatar}
                                        alt={request?.fullName + 'profile Image'}
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
                                        sx={{
                                            fontSize: isSm ? '14px' : 'inital'
                                        }}
                                    >
                                        {textFormater(request.fullName)} {<StyledText text={split(request?.gender ?? ' ')} />}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        color={'text.secondary'}
                                        sx={{
                                            fontSize: isSm ? '14px' : 'inital'
                                        }}
                                    >
                                        sent a friend request
                                    </Typography>
                                </Stack>
                            </Stack>
                            {isSm ? (
                                <Stack direction="row" sx={{ gap: 1.2, mt: 0.5 }}>
                                    <Tooltip title="Accept Friend Request">
                                        <IconButton onClick={() => handleAcceptRequest(request.sender)} >
                                            <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Reject Friend Request">
                                        <IconButton onClick={() => handleRejectRequest(request.sender)}>
                                            <CloseIcon sx={{ color: theme.palette.error.main }} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            ) : (
                                <Stack
                                    gap={0.5}
                                    sx={{
                                        flexDirection: 'row',
                                    }}>
                                    <Button
                                        variant='outlined'
                                        color='success'
                                        onClick={() => handleAcceptRequest(request.sender)}
                                        sx={{
                                            fontSize: isSm ? '14px' : 'inital',
                                        }}>
                                        Accept
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        color='error'
                                        onClick={() => handleRejectRequest(request.sender)}
                                        sx={{
                                            fontSize: isSm ? '14px' : 'inital'
                                        }}>
                                        Ignore
                                    </Button>
                                </Stack>
                            )}
                            <Divider />
                        </Stack>
                    ))}
                </Box>
            )}
        </Box>
    )
}

export default FriendRequestList