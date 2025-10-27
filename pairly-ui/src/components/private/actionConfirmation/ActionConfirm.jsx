import { Modal, Box, Typography, Button, Stack, useTheme } from '@/MUI/MuiComponents';
import { deleteConversationMessage, clearConversationMessage, fetchAllUser } from '@/redux/slices/privateChat/privateChatAction';
import { useDispatch } from 'react-redux';
import { useCallback, useState } from 'react';

function ActionConfirm({
    open,
    onClose,
    activeChat,
    onCloseChatWindow,
    clearActiveChat,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    actionType // "delete" | "clear"
}) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleClose = useCallback(() => {
        setIsProcessing(false);
        onClose?.();
    }, [onClose]);

    const handleConfirm = useCallback(async () => {
        if (!activeChat) return;
        setIsProcessing(true);

        let res;
        if (actionType === 'delete') {
            res = await dispatch(deleteConversationMessage(activeChat));
            dispatch(fetchAllUser());

        } else if (actionType === 'clear') {
            res = await dispatch(clearConversationMessage(activeChat));
        }

        if (res?.success) {
            clearActiveChat?.(null);
            onCloseChatWindow?.(null);
            handleClose();
        } else {
            setIsProcessing(false);
        }
    }, [dispatch, activeChat, actionType, clearActiveChat, onCloseChatWindow, handleClose]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="action-confirm-modal"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 24,
                    p: 4,
                    maxWidth: 420,
                    width: '90%',
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                <Typography
                    id="action-confirm-modal"
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                        color: theme.palette.warning.main,
                        letterSpacing: 0.3,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.6 }}
                >
                    {description}
                </Typography>

                <Stack direction="row" justifyContent="center" spacing={2}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={isProcessing}
                        sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            borderColor: theme.palette.divider,
                            '&:hover': {
                                background: theme.palette.action.hover,
                            },
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="warning"
                        disabled={isProcessing}
                        onClick={handleConfirm}
                        sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            py: 1.2,
                            background: `linear-gradient(135deg, ${theme.palette.warning.main}aa, ${theme.palette.warning.main})`,
                            color: '#000',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #FFB300, #FFD700)',
                                boxShadow: '0 5px 15px rgba(255,193,7,0.4)',
                            },
                        }}
                    >
                        {isProcessing ? 'Processing...' : 'Confirm'}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}

export default ActionConfirm;
