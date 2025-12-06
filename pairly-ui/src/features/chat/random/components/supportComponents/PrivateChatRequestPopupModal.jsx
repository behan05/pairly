import {
    Modal,
    Stack,
    Button,
    Typography,
    useTheme,
    useMediaQuery,
    Tooltip,
    Divider,
    Card,
    Box,
    IconButton
} from '@/MUI/MuiComponents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { toast } from 'react-toastify';

// components
import StyledText from '@/components/common/StyledText';

// Default Profile Image
import defaultAvatar from '@/assets/placeholders/defaultAvatar.png'

// Redux
import { fetchFriendRequests } from '@/redux/slices/randomChat/friendRequestAction';
import { useSelector, useDispatch } from 'react-redux';
import { setIncomingRequest, setFriendRequestAcceptedMessage } from '@/redux/slices/randomChat/friendRequestSlice';;
import { socket } from '@/services/socket';

// utils
import toCapitalCase from '@/utils/textFormatting';

function PrivateChatRequestPopupModal() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    // Get incoming request from Redux
    const { partnerProfile, partnerId } = useSelector((state) => state.randomChat);
    const myId = useSelector((state) => state.auth?.user?.id);

    const { incomingRequest, friendRequestAcceptedMessage } = useSelector((state) => state.friendRequest);

    if (friendRequestAcceptedMessage.from === myId) {
        toast.success(`${partnerProfile?.fullName} accepted your friend request`, {
            style: {
                backdropFilter: 'blur(14px)',
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }
        });

        // Refresh friend Request Accepted Message
        dispatch(setFriendRequestAcceptedMessage(''));
    }

    const handleClose = () => {
        dispatch(setIncomingRequest(null));
    };

    if (!incomingRequest) return null;

    const handleAccept = () => {
        socket.emit('privateChat:accept', { partnerId });
        dispatch(setIncomingRequest(null));
    };

    const handleReject = () => {
        socket.emit('privateChat:reject', { partnerId });
        dispatch(setIncomingRequest(null));
    };

    const handleCancel = () => {
        socket.emit('privateChat:cancel', { partnerId });
        dispatch(setIncomingRequest(null));
        dispatch(fetchFriendRequests());
    };

    return (
        <Modal
            open={Boolean(incomingRequest)}
            onClose={handleClose}
            aria-labelledby="private-chat-request-modal"
            aria-describedby="private-chat-request"
            sx={{ mt: 10 }}
        >
            <Card
                elevation={6}
                sx={{
                    maxWidth: isSm ? '70%' : 400,
                    width: '100%',
                    margin: '0 auto',
                    p: 1,
                    borderRadius: 1,
                    background: theme.palette.background.default,
                    border: `2px solid ${theme.palette.divider}`
                }}
            >
                {/* TOP TEXT */}
                <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{ mb: 2 }}
                    color="text.secondary"
                >
                    {partnerProfile?.fullName ?? 'Unknown'} wants to start a private chat with you.
                </Typography>

                {/* USER INFO SECTION */}
                <Stack
                    direction="row"
                    gap={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mb: 3 }}
                >
                    <Box
                        component="img"
                        src={partnerProfile?.profileImage || defaultAvatar}
                        alt={partnerProfile?.fullName}
                        sx={{
                            width: isSm ? 90 : 130,
                            height: isSm ? 90 : 130,
                            p: 0.5,
                            borderRadius: "50%",
                            border: `2px solid ${theme.palette.divider}`,
                            objectFit: "cover",
                            transition: "0.2s",
                            '&:hover': {
                                boxShadow:
                                    theme.palette.mode === "dark"
                                        ? `0 4px 15px ${theme.palette.info.dark}90`
                                        : `0 4px 15px ${theme.palette.info.light}90`,
                                borderColor: theme.palette.info.main,
                                transform: "translateY(-3px)",
                            }
                        }}
                    />

                    <Stack gap={0.4}>
                        <Typography variant="subtitle1" fontWeight={700}>
                            {partnerProfile?.fullName?.toUpperCase()}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            {partnerProfile?.age ?? 18} • {toCapitalCase(partnerProfile?.gender)}
                        </Typography>
                    </Stack>
                </Stack>

                {/* BUTTONS SECTION */}
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    justifyContent="center"
                >

                    {/* Divider with 'Action button icon' text and text on hover */}
                    <Divider sx={{ width: '100%', my: 2 }}>
                        <Stack direction="row" gap={4} justifyContent="center">

                            {/* ACCEPT */}
                            <Stack alignItems="center" spacing={0.5}>
                                <Tooltip title="Accept Request">
                                    <IconButton
                                        onClick={handleAccept}
                                        sx={{
                                            border: `1px solid ${theme.palette.success.main}50`,
                                            background: theme.palette.background.paper,
                                            transition: "all .2s",
                                            "&:hover": { transform: "scale(1.08)" }
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 26 }} />
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="caption" color="success.main">Accept</Typography>
                            </Stack>

                            {/* REJECT */}
                            <Stack alignItems="center" spacing={0.5}>
                                <Tooltip title="Reject Request">
                                    <IconButton
                                        onClick={handleReject}
                                        sx={{
                                            border: `1px solid ${theme.palette.error.main}50`,
                                            background: theme.palette.background.paper,
                                            transition: "all .2s",
                                            "&:hover": {
                                                transform: "scale(1.08)",
                                            }
                                        }}
                                    >
                                        <PowerSettingsNewIcon sx={{ color: theme.palette.error.main, fontSize: 26 }} />
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="caption" color="error.main">Reject</Typography>
                            </Stack>

                            {/* MAYBE LATER */}
                            <Stack alignItems="center" spacing={0.5}>
                                <Tooltip title="Maybe Later">
                                    <IconButton
                                        onClick={handleCancel}
                                        sx={{
                                            border: `1px solid ${theme.palette.warning.main}50`,
                                            background: theme.palette.background.paper,
                                            transition: "all .2s",
                                            "&:hover": { transform: "scale(1.08)" }
                                        }}
                                    >
                                        <CancelIcon sx={{ color: theme.palette.warning.main, fontSize: 26 }} />
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="caption" color="warning.main">Later</Typography>
                            </Stack>

                        </Stack>
                    </Divider>

                </Stack>
            </Card>
        </Modal>

    );
}


export default PrivateChatRequestPopupModal;
