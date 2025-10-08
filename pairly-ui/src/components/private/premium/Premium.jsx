import { Box, Typography, Button, Stack, useTheme, useMediaQuery, Divider } from '../../../MUI/MuiComponents';
import { CheckIcon, ClearIcon, StarIcon } from '../../../MUI/MuiIcons';
import ChatSidebarHeader from '../../../features/chat/common/ChatSidebarHeader';
import BoltIcon from '@mui/icons-material/Bolt';
import { styled } from '@mui/system';

function Premium() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const plans = [
        {
            title: 'Starter',
            price: '₹0',
            label: 'Basic features for individual use (100% Ad-Free)',
            features: [
                '25 new matches/day',
                '100 messages/day',
                'Basic AI personality',
                'Standard response speed',
                'No ads — forever',
            ],
            notAvailable: [
                'Unlimited messages',
                'Send media',
                'Send location',
                'All AI personalities',
                'Propose to partner',
                'Multi-device sync',
                'Chat export',
                'Verified match filter',
                'Block notifications',
                'Matching preferences',
                'Global match toggle',
                'Strict interest match',
                'Private friend requests',
                'Couple mode',
            ],
        },
        {
            title: 'Pro',
            price: '₹399',
            label: 'Enhanced features for active users (100% Ad-Free)',
            features: [
                'Everything in Starter',
                'Unlimited messages',
                'Send media',
                'Send location',
                'All AI personalities',
                'Faster responses',
                'Custom themes',
                'Multi-device sync',
                'Chat export',
                'Propose to partner',
                'Verified match filter',
                'Block notifications',
                'Matching preferences',
                'Global match toggle',
                'Strict interest match',
                'Private friend requests',
                'Couple mode',
                'No ads — forever',
            ],
            notAvailable: [],
        },
        {
            title: 'Premium',
            price: '₹699',
            label: 'Full access with priority support (100% Ad-Free)',
            features: [
                'Everything in Pro',
                'Priority responses',
                'Extra personalization',
                'Early access to new features',
                'No ads — forever',
            ],
            notAvailable: [],
        },
    ];

    // Styled button with zanina-yassine CSS
    const CustomButton = styled(Button)(({ theme }) => ({
        minWidth: '120px',
        position: 'relative',
        cursor: 'pointer',
        padding: '12px 17px',
        border: 0,
        borderRadius: '7px',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        background: 'radial-gradient(ellipse at bottom, rgba(71, 81, 92, 1) 0%, rgba(11, 21, 30, 1) 45%)',
        color: 'rgba(255, 255, 255, 0.66)',
        transition: 'all 1s cubic-bezier(0.15, 0.83, 0.66, 1)',
        '&::before': {
            content: '""',
            width: '70%',
            height: '1px',
            position: 'absolute',
            bottom: 0,
            left: '15%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)',
            opacity: 0.2,
            transition: 'all 1s cubic-bezier(0.15, 0.83, 0.66, 1)',
        },
        '&:hover': {
            color: 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.1) translateY(-3px)',
            '&::before': {
                opacity: 1,
            },
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
                        <Box
                            key={i}
                            sx={{
                                width: isSm ? '70dvw' : '100%',
                                maxWidth: 380,
                                boxShadow: `inset 0 0 2px ${theme.palette.action.hover}`,
                                borderRadius: 1,
                                pt: 1,
                                px: 2,
                                background: `radial-gradient(
                        circle at 0% 0%,
                        ${theme.palette.divider} 15%,
                        ${theme.palette.background.default} 55%)`,
                            }}>

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
                            <CustomButton
                                variant="outlined"
                                startIcon={<BoltIcon sx={{ color: 'success.main' }} fontSize="medium" />}
                                sx={{ my: 1, width: '100%' }}
                            >
                                Upgrade Now
                            </CustomButton>
                        </Box>
                    ))}
                </Box>
            </Stack>

        </Box>
    );
}

export default Premium;
