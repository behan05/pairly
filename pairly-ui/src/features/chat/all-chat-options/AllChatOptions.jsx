import { useEffect, useState } from 'react';
import {
    Box,
    Stack,
    Typography,
    useTheme,
    useMediaQuery,
    Button,
} from '@/MUI/MuiComponents';
import {
    GroupIcon,
    PersonIcon,
    LocationPinIcon
} from '@/MUI/MuiIcons';
import { keyframes } from '@emotion/react'
import ChatSidebarHeader from '@/features/chat/common/ChatSidebarHeader';
import SettingsAction from '@/components/private/SettingsAction';

// Lotties
import RandomLandingLottie from '@/features/chat/random/components/supportComponents/RandomLandingPageLottie';
import GroupChatLottie from '../group-chat/components/supportComponents/GroupChatLottiePage';
import AnonymousChatLottie from '../anonymous-chat/components/supportComponents/AnonymousChatLottiePage';
import InviteChatLottie from '../invite-chat/components/supportComponents/InviteChatLottiePage';
import TopicBasedChatLottie from '../topic-based-chat/components/supportComponents/TopicBasedChatLottiePage';
import NearMeChatLottie from '../nearme-chat/components/supportComponents/NearMeChatLottiePage';

import { useSelector } from 'react-redux';
import { socket } from '@/services/socket';
import { Link } from 'react-router-dom';
import OnboardingFeedback from '@/pages/feedback/OnboardingFeedback'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PeopleIcon from '@mui/icons-material/People';

function AllChatOptions() {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(0);
    const { subscription, hasGivenOnboardingFeedback } = useSelector((state) => state?.auth?.user);
    const { plan, status } = subscription;
    const hasPremiumAccess = plan !== 'free' && status === 'active';
    const isFreeUser = !hasPremiumAccess;

    const [openOnboardingFeedback, setOpenOnboardingFeedback] = useState(false);

    useEffect(() => {
        if (!hasGivenOnboardingFeedback) {
            const lastSkipped = localStorage.getItem("onboardingFeedbackSkippedAt");
            const completed = localStorage.getItem("onboardingFeedbackDoneAt");

            const oneWeek = 7 * 24 * 60 * 60 * 1000;      // 7 days
            const twoMonths = 60 * 24 * 60 * 60 * 1000;   // ~60 days

            // If user skipped — show again after a week
            if (lastSkipped && Date.now() - lastSkipped > oneWeek) {
                setOpenOnboardingFeedback(true);
            }

            // If user has given feedback — show again after 2 months
            if (completed && Date.now() - completed > twoMonths) {
                setOpenOnboardingFeedback(true);
            }

            // If user never skipped or gave feedback before — show immediately
            if (!lastSkipped && !completed) {
                setOpenOnboardingFeedback(true);
            }
        }
    }, []);

    useEffect(() => {
        socket.emit('getOnlineCount');
        socket.on('onlineCount', (count) => setNumberOfActiveUsers(count));
        return () => socket.off('onlineCount');
    }, []);

    // Ads push on mount
    useEffect(() => {
        if (isFreeUser && window.adsbygoogle) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense push error", e);
            }
        }
    }, [isFreeUser]);

    const chatOptions = [
        {
            title: "Random Chat",
            titleIcon: <AddCircleOutlineIcon fontSize='small' />,
            subTitle: `${numberOfActiveUsers} online`,
            subTitleIcon: <PeopleIcon fontSize='small' />,
            lottie: <RandomLandingLottie />,
            buttonText: "Chat randomly",
            redirectTo: "/pairly/random-chat",
            buttonTextIcon: <PersonIcon />,
        },
        {
            title: "Group Chat",
            titleIcon: <GroupIcon fontSize='small' />,
            subTitle: "Group conversations",
            subTitleIcon: <PeopleIcon fontSize='small' />,
            lottie: <GroupChatLottie />,
            buttonText: "Chat with people",
            redirectTo: "/pairly/group-chat",
            buttonTextIcon: <GroupIcon />,
        },
        {
            title: "Anonymous Chat",
            titleIcon: <GroupIcon fontSize='small' />,
            subTitle: "Stay anonymous",
            subTitleIcon: <GroupIcon fontSize='small' />,
            lottie: <AnonymousChatLottie />,
            buttonText: "Chat anonymously",
            redirectTo: "/pairly/anonymous-chat",
            buttonTextIcon: <GroupIcon />,
        },
        {
            title: "Invite Only Chat",
            titleIcon: <GroupIcon fontSize='small' />,
            subTitle: "Chat with friends",
            subTitleIcon: <GroupIcon fontSize='small' />,
            lottie: < InviteChatLottie />,
            buttonText: "Invite friend",
            redirectTo: "/pairly/invite-chat",
            buttonTextIcon: <GroupIcon />,
        },
        {
            title: "Topic Based Chat",
            titleIcon: <GroupIcon fontSize='small' />,
            subTitle: "Interest based chat",
            subTitleIcon: <GroupIcon fontSize='small' />,
            lottie: < TopicBasedChatLottie />,
            buttonText: "Shared Interests",
            redirectTo: "/pairly/topic-based-chat",
            buttonTextIcon: <GroupIcon />,
        },
        {
            title: "Near Me Chat",
            titleIcon: <LocationPinIcon fontSize='small' />,
            subTitle: "Chat with people nearby",
            subTitleIcon: <LocationPinIcon fontSize='small' />,
            lottie: < NearMeChatLottie />,
            buttonText: "Find Nearby",
            redirectTo: "/pairly/near-me-chat",
            buttonTextIcon: <LocationPinIcon />,
        }

    ]

    // Chat options
    const getOptionsCard = (
        key,
        title,
        titleIcon,
        subTitle,
        subTitleIcon,
        lottie,
        buttonText,
        redirectTo,
        buttonTextIcon,
    ) => {
        return (
            <Stack
                key={key}
                sx={(theme) => ({
                    position: 'relative',
                    borderRadius: 1,
                    padding: '10px 10px 0 10px',
                    background: `
                    linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}) padding-box,
                    linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}) border-box`,
                    border: '1px solid transparent',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                    cursor: 'pointer',

                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(circle at 20% 30%, ${theme.palette.primary.main}25, transparent 60%)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                    },

                    '&:hover': {
                        boxShadow: `0 20px 50px ${theme.palette.primary.main}40`,
                    },

                    '&:hover::before': {
                        opacity: 1,
                    },

                    '&:hover .lottie-advanced': {
                        transform: 'scale(1.15) rotate(8deg)',
                        boxShadow: `0 0 3rem ${theme.palette.secondary.main}80`,
                    },
                })}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack spacing={0.7}>
                        <Typography
                            variant="body1"
                            sx={(theme) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontWeight: 600,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            })}
                        >
                            {titleIcon}
                            {title}
                        </Typography>

                        <Typography
                            variant="subtitle2"
                            sx={(theme) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: '0.75rem',
                                color: theme.palette.text.secondary,
                                letterSpacing: 0.5,
                            })}
                        >
                            {subTitleIcon}
                            {subTitle}
                        </Typography>
                    </Stack>

                    <Stack
                        className="lottie-advanced"
                        sx={{
                            position: 'absolute',
                            top: -25,
                            right: -22,
                            height: 55,
                            width: 55,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                    >
                        {lottie}
                    </Stack>
                </Stack>

                <Button
                    variant="contained"
                    component={Link}
                    to={redirectTo}
                    startIcon={buttonTextIcon}
                    fullWidth
                    sx={(theme) => ({
                        m: '2em 0 0.2em 0',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 1.5,
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        letterSpacing: 1.2,
                        paddingY: 0.8,
                        color: theme.palette.common.white,
                        background: `linear-gradient(120deg, 
            ${theme.palette.primary.main}, 
            ${theme.palette.secondary.main}
        )`,
                        boxShadow: `
            0 6px 20px ${theme.palette.primary.main}40,
            inset 0 1px 0 rgba(255,255,255,0.2)
        `,
                        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',

                        // animated shine layer
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-75%',
                            width: '50%',
                            height: '100%',
                            background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent)',
                            transform: 'skewX(-20deg)',
                            transition: 'all 0.7s ease',
                        },

                        // animated border glow
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            borderRadius: 3,
                            padding: '1px',
                            background: `linear-gradient(120deg, 
                ${theme.palette.primary.light}, 
                ${theme.palette.secondary.light}
            )`,
                            WebkitMask:
                                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                            opacity: 0,
                            transition: 'opacity 0.4s ease',
                        },

                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: `
                0 12px 35px ${theme.palette.primary.main}55,
                inset 0 1px 0 rgba(255,255,255,0.3)
            `,
                        },

                        '&:hover::before': {
                            left: '130%',
                        },

                        '&:hover::after': {
                            opacity: 1,
                        },

                        '&:active': {
                            transform: 'translateY(0px) scale(0.98)',
                            boxShadow: `
                0 4px 15px ${theme.palette.primary.main}35,
                inset 0 2px 4px rgba(0,0,0,0.2)
            `,
                        },
                    })}
                >{buttonText}
                </Button>

            </Stack>
        )
    }

    const twinkle = keyframes`
    0% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0.2; transform: scale(0.8); }`

    return (
        <Box
            display="flex"
            flexDirection="column"
            minWidth={isSm ? '100%' : 380}
            position="relative"
            sx={{
                height: 'calc(var(--vh, 1vh) * 100)',
                background: theme.palette.background.paper,
                overflow: 'hidden',
            }}
        >
            {/* Stars Background */}
            {Array.from({ length: 100 }).map((_, i) => {
                const size = Math.random() * 3 + 1
                const duration = Math.random() * 5 + 3
                const delay = Math.random() * 5

                return (
                    <Stack
                        key={i}
                        sx={{
                            position: 'absolute',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            background: `${theme.palette.secondary.dark}`,
                            boxShadow: `0 20px 50px ${theme.palette.primary.main}40`,
                            opacity: Math.random(),
                            animation: `${twinkle} ${duration}s ease-in-out ${delay}s infinite`,
                            pointerEvents: 'none',
                        }}
                    />
                )
            })}

            {/* Header */}
            <Stack sx={{ px: 1.5 }}>
                <ChatSidebarHeader />
            </Stack>

            {/* Main content */}
            <Box
                mt={3}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                }}
            >
                <Stack
                    spacing={0.5}
                    alignItems="center"
                    sx={{ mb: 4 }}
                >
                    <Typography
                        sx={{
                            fontSize: 18,
                            fontWeight: 600,
                            letterSpacing: 0.3
                        }}
                    >
                        Select a Chat Mode
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: 13
                        }}
                    >
                        Choose how you'd like to connect.
                    </Typography>
                </Stack>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                        gap: 4,
                        p: '40px 20px',
                        overflowX: 'hidden',
                    }}
                >
                    {chatOptions.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: '100%',
                                maxWidth: 280,
                                mx: 'auto',
                            }}
                        >
                            {getOptionsCard(
                                index,
                                item.title,
                                item.titleIcon,
                                item.subTitle,
                                item.subTitleIcon,
                                item.lottie,
                                item.buttonText,
                                item.redirectTo,
                                item.buttonTextIcon,
                            )}
                        </Box>
                    ))}
                </Box>

                {/* All created groups or Topic Room goes below to join news users */}
            </Box>

            {/* Ads for Free User */}
            {isFreeUser && (
                <Box sx={{ width: '100%', mt: 2, textAlign: 'center', position: 'absolute', bottom: 0 }}>
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client="ca-pub-8711176865382424"
                        data-ad-slot="9308698789"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    ></ins>
                </Box>
            )}

            {/* Settings */}
            <SettingsAction />

            {/* Onboarding Feedback */}
            <OnboardingFeedback
                open={openOnboardingFeedback}
                onClose={() => setOpenOnboardingFeedback(false)}
            />
        </Box>
    );
}

export default AllChatOptions;
