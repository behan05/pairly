import { Box, Typography, Button, Stack, useTheme, useMediaQuery, Divider, Paper } from '../../../MUI/MuiComponents';
import { CheckIcon, ClearIcon, StarIcon } from '../../../MUI/MuiIcons';
import ChatSidebarHeader from '../../../features/chat/common/ChatSidebarHeader';
import { styled } from '@mui/system';

function Premium() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const plans = [
        {
            title: 'Starter',
            price: '₹0',
            label: 'Basic features for individual use',
            features: [
                '25 matches/day',
                '100 messages/day',
                'Basic AI personality',
            ],
            notAvailable: [
                'Unlimited messages',
                'Send media & location',
                'Propose To Partner',
                'Priority support',
                'No ads',
                'Multi-device sync',
                'Extra personalization',
            ],
        },
        {
            title: 'Premium',
            price: '₹399',
            label: 'Enhanced features for active users',
            features: [
                'Unlimited messages',
                'Send media & location',
                'Propose To Partner',
                'Faster responses',
                'No ads',
                'Multi-device sync',
            ],
            notAvailable: [
                'Priority support',
                'Extra personalization',
            ],
        },
        {
            title: 'Super Premium',
            price: '₹699',
            label: 'Full access with priority support',
            features: [
                'Everything in Pro',
                'Priority support',
                'Extra personalization',
                'Early access to new features',
            ],
            notAvailable: [],
        },
    ];

    const CustomButton = styled(Button)(({ theme }) => ({
        width: '140px',
        height: '40px',
        border: 'none',
        borderRadius: '20px',
        background: 'linear-gradient(to right,#77530a,#ffd277,#77530a,#77530a,#ffd277,#77530a)',
        backgroundSize: '250%',
        backgroundPosition: 'left',
        color: theme.palette.warning.main,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'all 1s ease',

        '&::before': {
            content: '"Go Premium"',
            position: 'absolute',
            width: '97%',
            height: '90%',
            borderRadius: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.842)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.warning.main,
            backgroundSize: '200%',
            transition: 'all 1s ease',
        },

        '&:hover': {
            backgroundPosition: 'right',
            '&::before': {
                backgroundPosition: 'right',
            },
        },

        '&:active': {
            transform: 'scale(0.95)',
        },
    }));

    return (
        <Box
            position="relative"
            minWidth={isSm ? '100%' : 380}
            px={1.5}
        >
            {/* Navbar */}
            <ChatSidebarHeader />

            {/* Pricing Card */}

            <Stack alignItems="center" sx={{ mb: 4 }}>

                {/* Title */}

                <Typography variant="body1" mb={2} color="text.secondary" textAlign="center">
                    Start free or upgrade to enjoy unlimited chats and premium features
                </Typography>

                {/* Card */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    alignItems: 'center',
                    minWidth: isSm ? '100%' : 380,
                    px: 2
                }}>
                    {plans.map((plan, i) => (
                        <Paper
                            elevation={4}
                            key={i}
                            sx={{
                                borderRadius: 4,
                                p: isSm ? 3 : 4,
                                width: '100%',
                                maxWidth: 360,
                                backdropFilter: 'blur(10px)',
                                background:
                                    theme.palette.mode === 'dark'
                                        ? theme.palette.background.paper + '99'
                                        : theme.palette.background.default + '99',
                                border: `1px solid ${theme.palette.divider}`,
                                gap: 3,
                                transition: 'all 0.5s ease',
                                position: 'relative',
                                overflow: 'hidden',

                                // sunlight from top
                                ':before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-50%',
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: `linear-gradient(
                                    to bottom, 
                                    ${theme.palette.mode === 'dark'
                                            ? theme.palette.primary.light + '33'
                                            : theme.palette.primary.main + '55'},
                                    transparent 60%)`,
                                    opacity: 0,
                                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                    transform: 'translateY(0%)',
                                },
                                ':hover:before': {
                                    opacity: 1,
                                    transform: 'translateY(50%)',
                                },

                                // Make inner content above the pseudo-element
                                '& > *': {
                                    position: 'relative',
                                    zIndex: 2,
                                },
                            }}
                        >

                            {/* Title with icon */}
                            <Stack direction="row" spacing={1} alignItems="center">
                                <StarIcon sx={{ color: 'warning.main' }} fontSize="small" />
                                <Typography variant="h6" fontWeight="bold" color="text.primary">
                                    {plan.title}
                                </Typography>
                            </Stack>

                            {/* Price */}
                            <Typography
                                variant="body1"
                                fontWeight="bold"
                                color="success.main"
                                pt={1}
                            >
                                {plan.price}/month
                            </Typography>

                            {/* Label / subtitle */}
                            <Typography variant="body2" gutterBottom color="text.secondary">
                                {plan.label}
                            </Typography>
                            <Divider />
                            {/* Features */}
                            <Stack spacing={1} alignItems="flex-start" mt={1.5}>
                                {plan.features.map((feat, i) => (
                                    <Stack key={i} direction="row" spacing={1} alignItems="center">
                                        <CheckIcon color="success" fontSize="small" />
                                        <Typography variant="body2">{feat}</Typography>
                                    </Stack>
                                ))}
                                {plan.notAvailable?.map((feat, i) => (
                                    <Stack key={i} direction="row" spacing={1} alignItems="center" opacity={0.5}>
                                        <ClearIcon color="error" fontSize="small" />
                                        <Typography variant="body2">{feat}</Typography>
                                    </Stack>
                                ))}
                            </Stack>
                            <CustomButton sx={{ mt: 2.5, mx: 'auto', width: '80%' }} />
                        </Paper>
                    ))}
                </Box>
            </Stack>

        </Box>
    );
}

export default Premium;
