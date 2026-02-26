import { useEffect, useState } from 'react';
import {
    Box,
    Stack,
    Typography,
    useTheme,
    useMediaQuery,
} from '@/MUI/MuiComponents';
import {
    GroupIcon,
    PersonIcon,
    LocationPinIcon
} from '@/MUI/MuiIcons';
import { keyframes } from '@emotion/react'
import ChatSidebarHeader from '@/features/chat/common/ChatSidebarHeader';
import SettingsAction from '@/components/private/SettingsAction';
import StyledActionButton from '../../../components/common/StyledActionButton';
import FloatShape from '../common/backgroud-effect/FloatShape';

// Lotties
import RandomLandingLottie from '@/features/chat/random/components/supportComponents/RandomLandingPageLottie';
import AnonymousChatLottie from '../anonymous-chat/components/supportComponents/AnonymousChatLottiePage';
import GroupChatLottie from '../group-chat/components/supportComponents/GroupChatLottiePage';
import InviteChatLottie from '../invite-chat/components/supportComponents/InviteChatLottiePage';
import TopicBasedChatLottie from '../topic-based-chat/components/supportComponents/TopicBasedChatLottiePage';
import NearMeChatLottie from '../nearme-chat/components/supportComponents/NearMeChatLottiePage';

import { useSelector } from 'react-redux';
import { socket } from '@/services/socket';
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
    const isFreeUser = !hasPremiumAccess; // use for ads

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

    const chatOptions = [
        {
            title: "Random Chat",
            titleIcon: (
                <AddCircleOutlineIcon
                    fontSize='small'
                    sx={{ color: '#4F8CFF' }}
                />
            ),
            subTitle: `${numberOfActiveUsers} people online`,
            subTitleIcon: (
                <PeopleIcon
                    fontSize='small'
                    sx={{ color: '#4F8CFF' }}
                />
            ),
            lottie: <RandomLandingLottie />,
            buttonText: "Start Chat",
            redirectTo: "/pairly/random-chat",
            buttonTextIcon: <PersonIcon sx={{ color: '#fff' }} />,
        },
        {
            title: "Anonymous Chat",
            titleIcon: (
                <GroupIcon
                    fontSize='small'
                    sx={{ color: '#00C896' }}
                />
            ),
            subTitle: "No name. No profile.",
            subTitleIcon: (
                <GroupIcon
                    fontSize='small'
                    sx={{ color: '#00C896' }}
                />
            ),
            lottie: <AnonymousChatLottie />,
            buttonText: "Chat Anonymously",
            redirectTo: "/pairly/anonymous-chat",
            buttonTextIcon: <GroupIcon sx={{ color: '#fff' }} />,
        },

        // Other chat modes can be added here in the future
        // {
        //     title: "Group Chat",
        //     titleIcon: (
        //         <GroupIcon
        //             fontSize='small'
        //             sx={{ color: '#7B61FF' }}
        //         />
        //     ),
        //     subTitle: "Talk with many people",
        //     subTitleIcon: (
        //         <PeopleIcon
        //             fontSize='small'
        //             sx={{ color: '#7B61FF' }}
        //         />
        //     ),
        //     lottie: <GroupChatLottie />,
        //     buttonText: "Join Group",
        //     redirectTo: "/pairly/group-chat",
        //     buttonTextIcon: <GroupIcon sx={{ color: '#fff' }} />,
        // },
        // {
        //     title: "Invite Chat",
        //     titleIcon: (
        //         <GroupIcon
        //             fontSize='small'
        //             sx={{ color: '#FF8C42' }}
        //         />
        //     ),
        //     subTitle: "Chat with your friends",
        //     subTitleIcon: (
        //         <GroupIcon
        //             fontSize='small'
        //             sx={{ color: '#FF8C42' }}
        //         />
        //     ),
        //     lottie: <InviteChatLottie />,
        //     buttonText: "Send Invite",
        //     redirectTo: "/pairly/invite-chat",
        //     buttonTextIcon: <GroupIcon sx={{ color: '#fff' }} />,
        // },
        // {
        //     title: "Topic Chat",
        //     titleIcon: (
        //         <GroupIcon
        //             fontSize='small'
        //             sx={{ color: '#FF4D6D' }}
        //         />
        //     ),
        //     subTitle: "Chat by interests",
        //     subTitleIcon: (
        //         <GroupIcon
        //             fontSize='small'
        //             sx={{ color: '#FF4D6D' }}
        //         />
        //     ),
        //     lottie: <TopicBasedChatLottie />,
        //     buttonText: "Explore Topics",
        //     redirectTo: "/pairly/topic-based-chat",
        //     buttonTextIcon: <GroupIcon sx={{ color: '#fff' }} />,
        // },
        // {
        //     title: "Nearby Chat",
        //     titleIcon: (
        //         <LocationPinIcon
        //             fontSize='small'
        //             sx={{ color: '#FFD93D' }}
        //         />
        //     ),
        //     subTitle: "Find people near you",
        //     subTitleIcon: (
        //         <LocationPinIcon
        //             fontSize='small'
        //             sx={{ color: '#FFD93D' }}
        //         />
        //     ),
        //     lottie: <NearMeChatLottie />,
        //     buttonText: "Find Nearby",
        //     redirectTo: "/pairly/nearby-chat",
        //     buttonTextIcon: <LocationPinIcon sx={{ color: '#fff' }} />,
        // }
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
                sx={{
                    position: 'relative',
                    borderRadius: 0,
                    padding: '15px 15px 0 15px',
                    transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                    boxShadow: `inset 0 0 0.5rem ${theme.palette.success.dark}`,
                    backdropFilter: "blur(40px)",
                    background: `linear-gradient(
                    135deg,
                    ${theme.palette.background.paper}cc,
                    ${theme.palette.background.default}aa
                )`,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack gap={0.4}>
                        <Typography
                            variant="h5"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontWeight: 600,
                                letterSpacing: 0.5,
                                textTransform: 'uppercase',
                                fontSize: 14,
                                whiteSpace: 'nowrap',
                            }}
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
                                whiteSpace: 'nowrap',
                            })}
                        >
                            {subTitleIcon}
                            {subTitle}
                        </Typography>
                    </Stack>

                    {/* Temporary  */}
                    {title.includes('Anonymous Chat') && (
                        <Stack
                            sx={{
                                position: 'absolute',
                                top: -28,
                                right: 0,
                                px: 2,
                                py: 0.5,
                                fontSize: 12,
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                textTransform: 'uppercase',
                                letterSpacing: 0.8,
                                borderRadius: 1,
                                background: theme.palette.info.main,
                                boxShadow: `0 0 8px ${theme.palette.info.main}, 0 0 16px ${theme.palette.info.light}`,
                                animation: 'glowPulse 1.8s infinite alternate',
                            }}
                        >
                            Coming Soon
                            <style>
                                {`
        @keyframes glowPulse {
          0% {
            box-shadow: 0 0 15px ${theme.palette.info.main}, 0 0 2px ${theme.palette.info.light};
          }
          50% {
            box-shadow: 0 0 3px ${theme.palette.info.main}, 0 0 3px ${theme.palette.info.light};
          }
          100% {
            box-shadow: 0 0 5px ${theme.palette.info.main}, 0 0 4px ${theme.palette.info.light};
          }
        }
      `}
                            </style>
                        </Stack>
                    )}

                    {!isSm && (
                        <Stack
                            className="lottie-advanced"
                            sx={{
                                height: 45,
                                width: 45,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                        >
                            {lottie}
                        </Stack>
                    )}
                </Stack>

                <StyledActionButton
                    text={buttonText}
                    redirectUrl={redirectTo}
                    icon={buttonTextIcon}
                    sx={{
                        m: '26px 0 8px 0',
                        p: '6px 0px',
                        borderRadius: 0.2,
                        minWidth: '100%'
                    }}
                />
            </Stack>
        )
    }

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
            {/* Float Shap Background */}
            <FloatShape />

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
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <Stack
                    spacing={0.5}
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Typography
                        sx={{
                            fontSize: 18,
                            fontWeight: 600,
                            letterSpacing: 0.3
                        }}
                    >
                        Select a Chat Mode | (Beta)
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: 13
                        }}
                    >
                        {/* More modes coming soon! */}
                        Choose how you'd like to connect.
                    </Typography>
                </Stack>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 250px))',
                        gap: 1,
                        rowGap: 5,
                        p: '40px 0',
                        width: '100%',
                        overflowX: 'hidden',
                        justifyContent: 'center',
                        justifyItems: 'center',
                    }}
                >
                    {chatOptions.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: '100%',
                                maxWidth: 260,
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
            </Box>

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
