import { Box, Stack, Typography, useTheme } from '@/MUI/MuiComponents';
import StyledButton from '@/components/common/StyledButton';
import StyledActionButton from '@/components/common/StyledActionButton';

function HomeFeatures({ selectedFeature, description }) {
    const theme = useTheme();

    const titles = [
        'Pairly | Your Space to Connect, Truly',
        'Private Chat | Talk Freely, Privately',
        'Proposals | Express Love, Fun, or Friendship',
        'Standup Hall | Speak Up, Get Heard',
        'Silent Mode | Stay Online, Stay Focused',
    ];

    const subtitles = [
        'Instantly connect with real people around the world and experience genuine conversations in a welcoming community.',
        'Enjoy a private and secure chat space built for honest conversations, without interruptions or noise.',
        'Send personalized proposals that reflect your emotions. Whether it is for love, friendship, or fun, say it your way.',
        'Join live public conversations that matter. Discuss, share, and listen with respect and curiosity.',
        'Activate focus mode and remain online quietly. Stay connected without being disturbed while you work or relax.',
    ];

    const extraDetails = [
        'Pairly is designed for authenticity and comfort. Every connection feels natural, every chat feels real.',
        'Your privacy always comes first. Pairly never shares your messages or data with anyone.',
        'Make every connection special with creative proposal cards and meaningful gestures that help you express yourself better.',
        'Discover trending topics and inspiring speakers inside the Standup Hall community zone.',
        'Silent Mode keeps your presence active while giving you complete peace of mind and focus time.',
    ];

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {/* === Background dots === */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    opacity: 0.1,
                    mt: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    pointerEvents: 'none',
                }}
            >
                {Array.from({ length: 2000 }).map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 2,
                            height: 2,
                            borderRadius: 0.2,
                            background: `${theme.palette.text.primary}`,
                        }}
                    />
                ))}
            </Box>

            {/* === Computer mockup === */}
            <Box
                sx={{
                    width: '100%',
                    borderRadius: 1.5,
                    mt: 1,
                    overflow: 'hidden',
                    boxShadow: '0 18px 40px rgba(0,0,0,0.12)',
                    border: `1px solid ${theme.palette.divider}`,
                    background: theme.palette.background.paper,
                }}
            >
                {/* Top bar */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        px: 2,
                        py: 1,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        background: theme.palette.background.default,
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#FF605C' }} />
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD44' }} />
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#00CA4E' }} />
                    </Stack>

                    <Typography
                        variant="caption"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 600,
                            letterSpacing: 0.4,
                        }}
                    >
                        Preview
                    </Typography>

                    <Box sx={{ width: 30 }} />
                </Stack>

                {/* Screen area */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: { xs: 2, md: 4 },
                        minHeight: { xs: 240, md: 360 },
                        background:
                            theme.palette.mode === 'dark'
                                ? 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))'
                                : 'linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            maxWidth: 820,
                            borderRadius: 1,
                            p: 4,
                            bgcolor: theme.palette.background.default,
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.04)',
                        }}
                    >
                        {/* === Main Screen Content === */}
                        <Stack spacing={2.5} alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    textAlign: 'center',
                                }}
                            >
                                {titles[selectedFeature] || titles[0]}
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    textAlign: 'center',
                                    maxWidth: 680,
                                }}
                            >
                                {subtitles[selectedFeature]}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    textAlign: 'center',
                                    maxWidth: 640,
                                }}
                            >
                                {extraDetails[selectedFeature]}
                            </Typography>

                            {/* CTA Buttons */}
                            <Stack
                                direction="row"
                                gap={2}
                                justifyContent={'center'}
                                flexWrap={'wrap'}
                                sx={{
                                    mt: 3,
                                }}
                            >
                                <StyledActionButton text="Try Now" redirectUrl="/register" />
                                <StyledButton text="Learn More" redirectUrl="/features" />
                            </Stack>
                        </Stack>
                    </Box>
                </Box>

                {/* Bottom stand */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        background: theme.palette.background.default,
                    }}
                >
                    <Box
                        sx={{
                            width: 140,
                            height: 10,
                            borderRadius: 2,
                            bgcolor: theme.palette.divider,
                            opacity: 0.12,
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default HomeFeatures;
