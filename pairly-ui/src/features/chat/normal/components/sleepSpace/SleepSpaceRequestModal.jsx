import {
    Modal,
    Stack,
    Button,
    Typography,
    useTheme,
    useMediaQuery,
} from '@/MUI/MuiComponents';
import {
    defaultAvatar
} from '@/MUI/MuiIcons';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// components
import StyledText from '@/components/common/StyledText';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setIncomingRequest } from '@/redux/slices/sleepSpace/sleepSpaceRequest';
import { socket } from '@/services/socket';

// utils
import toCapitalCase from '@/utils/textFormatting';
import { useMemo } from 'react';

function SleepSpacePopupModal() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    // Get incoming request from Redux
    const { activePartnerId: partnerId, allUsers, chatUsers } = useSelector((state) => state.privateChat);
    const { incomingRequest } = useSelector((state) => state.sleepSpace);

    const partnerProfile = useMemo(() => {
        return allUsers.find((u) => u.userId === partnerId)?.profile || null
    }, [chatUsers]);

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
            aria-labelledby="sleep-space-request-modal"
            aria-describedby="sleep-space-request"
            sx={{ mt: 10, px: isSm ? 2 : 4 }}
        >
            <Stack
                sx={{
                    maxWidth: isSm ? '90%' : 400,
                    width: '100%',
                    backgroundColor: theme.palette.background.paper,
                    p: 2,
                    borderRadius: 1
                }}>
                <Typography variant="body2" textAlign='center' color="textSecondary">
                    <StyledText text={partnerProfile?.fullName ?? 'Unknown'} />{" "}
                    is inviting you to share a sleep space.
                    This feature allows both of you to feel close,
                    stay connected, and enjoy a calm space together.
                    If you feel comfortable,
                    you can accept the request and join them.
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
                            maxWidth: isSm ? 80 : 100,
                            maxHeight: isSm ? 80 : 100,
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
                    justifyContent: 'center',
                    mt: 1
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
                </Stack>
            </Stack>
        </Modal>
    );
}


export default SleepSpacePopupModal;
