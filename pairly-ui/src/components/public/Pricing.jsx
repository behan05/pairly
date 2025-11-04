import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Stack,
    Paper,
    useTheme,
    Button,
} from '@/MUI/MuiComponents';

// Import Table parts directly from MUI
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { CheckIcon, ClearIcon } from '@/MUI/MuiIcons';
import { styled } from '@mui/system';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

function Pricing() {
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Pairly - Pricing Plans';
    }, []);

    const plans = [
        {
            title: 'Free',
            price: 0,
            label: 'Basic features for individual use',
            limits: { matches: '25/day', messages: '100/day', media: '5/day' },
            features: ['Basic AI personality'],
            notAvailable: [
                'Unlimited messages',
                'Send media beyond limit',
                'Propose to partner',
                'Priority support',
                'No ads',
                'Multi-device sync',
                'Extra personalization',
            ],
        },
        {
            title: 'Premium',
            price: 299,
            label: 'Enhanced features for active users',
            limits: { matches: '∞', messages: '∞', media: 50 },
            features: [
                'Unlimited messages',
                'Send media & location',
                'Propose to partner',
                'Faster responses',
                'No ads',
                'Multi-device sync',
            ],
            notAvailable: ['Priority support', 'Extra personalization'],
            promoCode: 'WELCOME100',
            discountAmount: 100,
            featured: true,
        },
        {
            title: 'Super Premium',
            price: 399,
            label: 'Full access with priority support',
            limits: { matches: '∞', messages: '∞', media: '∞' },
            features: [
                'Everything in Premium',
                'Priority support',
                'Extra personalization',
                'Early access to new features',
            ],
            notAvailable: [],
            promoCode: 'WELCOME100',
            discountAmount: 100,
        },
    ];

    // ==== Styled Components ====
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

    // === Helper ===
    const allFeatures = [
        'Basic AI personality',
        'Unlimited messages',
        'Send media & location',
        'Propose to partner',
        'Priority support',
        'No ads',
        'Multi-device sync',
        'Extra personalization',
    ];

    return (
        <Box
            sx={{
                py: 10,
                minHeight: '90dvh',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mx: 'auto',
            }}
        >
            <Typography
                textAlign="center"
                variant="h5"
                fontWeight={700}
                color="text.primary"
                mb={1}
            >
                Choose the Plan That Fits You
            </Typography>

            <Typography
                textAlign="center"
                variant="body1"
                color="text.secondary"
                mb={4}
            >
                Start for free or upgrade anytime to unlock unlimited chats and exclusive perks.
            </Typography>

            {/* === Plan Cards === */}
            <Stack
                spacing={3}
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="center"
                alignItems="stretch"
                sx={{ flexWrap: 'wrap', gap: 2 }}
            >
                {plans.map((plan, i) => (
                    <Card key={i} featured={plan.featured} sx={{ flex: '1 1 280px', maxWidth: 340 }}>
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

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 1,
                                borderRadius: 2,
                                backgroundColor: theme.palette.warning.main,
                                '&:hover': { backgroundColor: theme.palette.warning.dark },
                            }}
                            onClick={() => navigate('/login')}
                        >
                            {plan.price === 0 ? 'Get Started Free' : 'Login to Upgrade'}
                        </Button>
                    </Card>
                ))}
            </Stack>

            {/* === Comparison Table === */}
            <Box
                mt={8}
                width="100%"
                maxWidth={800}
            >
                <Typography variant="h6" textAlign="center" mb={2}>
                    Compare All Features
                </Typography>
                <TableContainer component={Paper} sx={{ borderRadius: 1, overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Feature</TableCell>
                                {plans.map((p) => (
                                    <TableCell key={p.title} align="center">
                                        {p.title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{background:theme.palette.background.default}}>
                            {allFeatures.map((feature) => (
                                <TableRow key={feature}>
                                    <TableCell>{feature}</TableCell>
                                    {plans.map((plan) => (
                                        <TableCell key={plan.title + feature} align="center">
                                            {plan.features.includes(feature) ||
                                                (feature === 'Basic AI personality' && plan.title === 'Free') ? (
                                                <CheckIcon color="success" />
                                            ) : (
                                                <ClearIcon color="error" />
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default Pricing;
