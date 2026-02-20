import { useEffect } from 'react';
import {
    Box,
    Typography,
    Stack,
    Paper,
    useTheme,
    Button,
} from '@/MUI/MuiComponents';

import { CheckIcon, ClearIcon } from '@/MUI/MuiIcons';
import { fontSize, styled } from '@mui/system';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import StyledActionButton from '../common/StyledActionButton';

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
        borderRadius: 16,
        overflow: 'hidden',
        padding: '1.5rem',

        backdropFilter: 'blur(16px)',
        background: alpha(theme.palette.background.paper, 0.75),

        border: `1px solid ${featured
            ? alpha(theme.palette.success.dark, 0.8)
            : alpha(theme.palette.divider, 0.2)
            }`,

        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',

        '&:hover': {
            borderColor: alpha(theme.palette.success.dark, 0.8),
        },

        // animated
        '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(
      120deg,
      transparent 40%,
      ${alpha(theme.palette.success.dark, 0.08)} 50%,
      transparent 60%
    )`,
            transform: 'translateX(-100%)',
            transition: 'transform 0.8s ease',
        },

        '&:hover::before': {
            transform: 'translateX(100%)',
        },
    }));

    const Shine = styled('div')(({ theme }) => ({
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(
    90deg,
    transparent,
    ${alpha(theme.palette.success.light, 0.25)},
    transparent
  )`,
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease',
    }));

    const Glow = styled('div')(({ theme }) => ({
        position: 'absolute',
        inset: '-20px',
        background: `radial-gradient(
    circle at 50% 0%,
    ${alpha(theme.palette.success.dark, 0.3)} 0%,
    transparent 70%
  )`,
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.4s ease',
    }));

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
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                    maxWidth: 1100,
                    mx: 'auto',
                }}
            >
                {plans.map((plan, i) => (
                    <Card
                        key={i}
                        featured={plan.featured}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Shine className="shine" />
                        <Glow className="glow" />

                        <Typography
                            variant="overline"
                            sx={{
                                color: 'success.main',
                                letterSpacing: 2,
                                fontSize: 14,
                            }}
                        >
                            {plan.title} {plan.featured && '★'}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mt: 1,
                            }}
                        >
                            ₹{plan.price}/mo
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary">
                            {plan.label}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="space-between"
                            mt={2}
                            mb={2}
                        >
                            <Typography variant="caption">
                                Matches: {plan.limits.matches}
                            </Typography>
                            <Typography variant="caption">
                                Messages: {plan.limits.messages}
                            </Typography>
                            <Typography variant="caption">
                                Media: {plan.limits.media}
                            </Typography>
                        </Stack>

                        <Stack spacing={1} mb={2}>
                            {plan.features.map((f, idx) => (
                                <Stack key={idx} direction="row" spacing={1} alignItems="center">
                                    <CheckIcon fontSize="small" color="success" />
                                    <Typography variant="body2">{f}</Typography>
                                </Stack>
                            ))}

                            {plan.notAvailable.map((f, idx) => (
                                <Stack
                                    key={idx}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ opacity: 0.5 }}
                                >
                                    <ClearIcon fontSize="small" color="error" />
                                    <Typography variant="body2">{f}</Typography>
                                </Stack>
                            ))}
                        </Stack>

                        {/* Push button to bottom */}
                        <Box sx={{ mt: 'auto' }}>
                            <StyledActionButton
                                onClick={() => navigate('/pairly/settings/premium')}
                                variant="outlined"
                                text={plan.price === 0 ? 'Get Started Free' : 'Login to Upgrade'}
                                sx={{
                                    minWidth: '100%',
                                }}
                            />
                        </Box>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}

export default Pricing;
