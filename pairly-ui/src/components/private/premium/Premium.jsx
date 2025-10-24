import { Box, Typography, Stack, Paper, useTheme } from '@/MUI/MuiComponents';
import { CheckIcon, ClearIcon } from '@/MUI/MuiIcons';
import ChatSidebarHeader from '@/features/chat/common/ChatSidebarHeader';
import { styled } from '@mui/system';
import { alpha } from '@mui/material/styles';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function Premium() {
    const theme = useTheme();
    const { plan, status } = useSelector((state) => state.auth.user.subscription);
    const isFreeUser = plan === 'free' && status === 'active';

    useEffect(() => {
        document.title = 'Pairly - Plans'
    }, []);

    const plans = [
        {
            title: isFreeUser ? 'Current Plan: Free' : 'Free',
            price: 0,
            label: 'Basic features for individual use',
            limits: { matches: '25/day', messages: '100/day', media: '5/day' },
            features: ['Basic AI personality'],
            notAvailable: [
                'Unlimited messages', 'Send media beyond limit', 'Propose to partner',
                'Priority support', 'No ads', 'Multi-device sync', 'Extra personalization'
            ],
        },
        {
            title: 'Premium',
            price: 299,
            label: 'Enhanced features for active users',
            limits: { matches: '∞', messages: '∞', media: 50 },
            features: [
                'Unlimited messages', 'Send media & location', 'Propose to partner',
                'Faster responses', 'No ads', 'Multi-device sync'
            ],
            notAvailable: ['Priority support', 'Extra personalization'],
            promoCode: 'WELCOME100',
            discountAmount: 100,
            featured: true
        },
        {
            title: 'Super Premium',
            price: 399,
            label: 'Full access with priority support',
            limits: { matches: '∞', messages: '∞', media: '∞' },
            features: [
                'Everything in Premium', 'Priority support', 'Extra personalization', 'Early access to new features'
            ],
            notAvailable: [],
            promoCode: 'WELCOME100',
            discountAmount: 100,
        },
    ];

    // Main card
    const Card = styled(Paper)(({ theme, featured }) => ({
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        padding: '1rem',
        background: alpha(theme.palette.background.paper, 0.95),
        border: featured
            ? `2px solid ${theme.palette.warning.main}`
            : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        boxShadow: featured
            ? '0 15px 25px rgba(0,0,0,0.1)'
            : '0 5px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow:
                '0 20px 30px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.05)',
            borderColor: alpha(theme.palette.warning.main, 0.4),
        },
        '&:hover .shine': { opacity: 1, animation: 'shine 3s infinite' },
        '&:hover .glow': { opacity: 1 },
        '&:hover .cardButton': {
            transform: 'scale(1)',
            boxShadow: `0 0 0 4px ${alpha(theme.palette.warning.main, 0.2)}`
        }
    }));

    const Shine = styled('div')({
        position: 'absolute',
        inset: 0,
        background:
            'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        '@keyframes shine': {
            '0%': { backgroundPosition: '-100% 0' },
            '100%': { backgroundPosition: '200% 0' },
        },
    });

    const Glow = styled('div')(({ theme }) => ({
        position: 'absolute',
        inset: '-10px',
        background: `radial-gradient(circle at 50% 0%, ${alpha(
            theme.palette.warning.main,
            0.3
        )} 0%, transparent 70%)`,
        opacity: 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
    }));

    const CardButton = styled('div')(({ theme }) => ({
        width: 30,
        height: 30,
        background: theme.palette.warning.main,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: 'scale(0.9)',
        '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: `0 0 10px ${alpha(theme.palette.warning.main, 0.4)}`
        }
    }));

    return (
        <Box px={2}>
            <ChatSidebarHeader />
            <Typography textAlign="center" variant="body1" color="text.secondary" my={4}>
                Start free or upgrade to enjoy unlimited chats and premium features
            </Typography>

            <Stack spacing={2}>
                {plans.map((plan, i) => (
                    <Card key={i} featured={plan.featured}>
                        <Shine className="shine" />
                        <Glow className="glow" />

                        <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                            {plan.title} {plan.featured && '★'}
                        </Typography>
                        <Typography variant="h6" color="success.main">
                            ₹{plan.price}/mo
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {plan.label}
                        </Typography>

                        <Stack direction="row" spacing={1} justifyContent="space-between" mt={1} mb={1}>
                            <Typography variant="caption">Matches: {plan.limits.matches}</Typography>
                            <Typography variant="caption">Messages: {plan.limits.messages}</Typography>
                            <Typography variant="caption">Media: {plan.limits.media}</Typography>
                        </Stack>

                        <Stack spacing={0.5} mb={1}>
                            {plan.features.map((f, idx) => (
                                <Stack key={idx} direction="row" spacing={0.5} alignItems="center">
                                    <CheckIcon fontSize="small" color="success" />
                                    <Typography variant="body2">{f}</Typography>
                                </Stack>
                            ))}
                            {plan.notAvailable.map((f, idx) => (
                                <Stack key={idx} direction="row" spacing={0.5} alignItems="center" opacity={0.5}>
                                    <ClearIcon fontSize="small" color="error" />
                                    <Typography variant="body2">{f}</Typography>
                                </Stack>
                            ))}
                        </Stack>

                        <Box
                            className="card__footer"
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 1
                            }}
                        >
                            {plan.promoCode ? (
                                <Box
                                    sx={{
                                        bgcolor: alpha(theme.palette.warning.light, 0.7),
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontSize: 10,
                                        fontWeight: 600
                                    }}
                                >
                                    {plan.promoCode} - ₹{plan.discountAmount} off
                                </Box>
                            ) : (
                                <Typography sx={{
                                    bgcolor: alpha(theme.palette.warning.light, 0.7),
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: 10,
                                    fontWeight: 600
                                }}>
                                    <s>WELCOME100 - ₹100 off</s>
                                </Typography>
                            )}

                            <CardButton
                                className="cardButton"
                                style={{
                                    cursor: plan.price === 0 ? 'not-allowed' : 'pointer',
                                    opacity: plan.price === 0 ? 0.5 : 1
                                }}
                                onClick={() => plan.price !== 0 && handleUpgrade(plan.title)}
                            >
                                <svg height="16" width="16" viewBox="0 0 24 24">
                                    <path
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        d="M4 12H20M12 4V20"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </CardButton>

                        </Box>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
}

export default Premium;
