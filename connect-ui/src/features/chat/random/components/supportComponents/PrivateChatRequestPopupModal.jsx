import {
    Modal,
    Stack,
    Button,
    Typography,
    useTheme,
    useMediaQuery,
    Tooltip
} from '@/MUI/MuiComponents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// components
import BlurWrapper from '@/components/common/BlurWrapper';
import StyledText from '@/components/common/StyledText';

// Default Profile Image
import defaultAvatar from '@/assets/placeholders/defaultAvatar.png'

// Redux
import { fetchFriendRequests } from '@/redux/slices/randomChat/friendRequestAction';
import { useSelector, useDispatch } from 'react-redux';
import { setIncomingRequest } from '@/redux/slices/randomChat/friendRequestSlice';;
import { socket } from '@/services/socket';

// utils
import toCapitalCase from '@/utils/textFormatting';

function PrivateChatRequestPopupModal() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    // Get incoming request from Redux
    const { partnerProfile, partnerId } = useSelector((state) => state.randomChat);
    const { incomingRequest } = useSelector((state) => state.friendRequest);

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

    const commonBtnStyle = {
        width: 'fit-content',
        alignSelf: 'flex-start',
        transition: 'all 0.3s ease-in-out',
        color: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
        },
        '&:hover': {
            transform: 'translateY(-5px)',
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary
        }
    }

    return (
        <Modal
            open={Boolean(incomingRequest)}
            onClose={handleClose}
            aria-labelledby="private-chat-request-modal"
            aria-describedby="private-chat-request"
            sx={{ mt: 10, px: isSm ? 2 : 4 }}
        >
            <BlurWrapper sx={{
                maxWidth: isSm ? '90%' : 400,
                width: '100%',
                backgroundColor: theme.palette.background.paper
            }}>
                <Typography variant="body2" textAlign='center' color="textSecondary">
                    {<StyledText text={partnerProfile?.fullName ?? 'unknown'} />}{' '}wants to start a private chat with you.
                </Typography>
                <Stack sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                }}>
                    <Stack
                        component={'img'}
                        src={partnerProfile?.profileImage || defaultAvatar}
                        alt={partnerProfile?.fullName}
                        sx={{
                            maxWidth: isSm ? 120 : 170,
                            maxHeight: isSm ? 120 : 170,
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            filter: `drop-shadow(10px 0 0.2rem ${theme.palette.divider})`,
                            transition: 'all 0.2s linear',
                            objectFit: 'cover',
                            '&:hover': {
                                transform: 'scale(1.04)',
                                filter: `drop-shadow(-10px 0 0.2rem ${theme.palette.divider})`,
                            }
                        }}
                    />
                    <Stack>
                        <Typography variant='body1' gutterBottom>
                            {partnerProfile?.fullName}
                        </Typography>
                        <Typography variant='body1' gutterBottom>
                            {partnerProfile?.age ?? 18} {toCapitalCase(partnerProfile?.gender)}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 1,
                    justifyContent: 'center'
                }}>
                    <Button
                        onClick={handleAccept}
                        sx={commonBtnStyle}
                        variant='outlined'
                        startIcon={<CheckCircleIcon sx={{ color: theme.palette.success.main }} />}
                    >Accept
                    </Button>
                    <Button
                        onClick={handleReject}
                        sx={commonBtnStyle}
                        variant='outlined'
                        startIcon={<AccessTimeIcon sx={{ color: theme.palette.error.main }} />}
                    >Reject
                    </Button>
                    <Tooltip title='You can accept later.'>
                        <Button
                            onClick={handleCancel}
                            sx={commonBtnStyle}
                            variant='outlined'
                            startIcon={<CancelIcon sx={{ color: theme.palette.warning.main }} />}
                        >Not Now
                        </Button>
                    </Tooltip>
                </Stack>
            </BlurWrapper>
        </Modal>
    );
}


export default PrivateChatRequestPopupModal;
