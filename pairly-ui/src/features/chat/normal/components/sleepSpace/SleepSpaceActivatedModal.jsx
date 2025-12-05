import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    IconButton,
    Modal,
    Stack,
    Tooltip,
    Typography,
    useTheme,
    Switch,
    FormControlLabel,
} from '../../../../../MUI/MuiComponents';
import { CloseIcon } from '@/MUI/MuiIcons';
import toCapitalCase from '@/utils/textFormatting';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { useSelector } from 'react-redux';
import { Player } from '@lottiefiles/react-lottie-player';
import tree1 from '@/assets/lottie/tree1.json';
import tree2 from '@/assets/lottie/tree2.json';
import sleep from '@/assets/lottie/sleep.json';

/**
 * SleepSpaceModal — MERGED (Option C)
 * - Restores the original layout and behavior
 * - Adds robust audio handling (lazy HTMLAudioElements, play only after user gesture)
 * - Keeps feature locked until 8 PM for main UI, but enforces continuous rain+thunder from 1 AM to morning
 * - Clouds & rain only render when feature available (after 8 PM) and rain period active
 * - Intervals cleaned up properly
 * - Designed to be easy to tweak
 */

function useNow(updateEveryMs = 60000) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), updateEveryMs);
        return () => clearInterval(id);
    }, [updateEveryMs]);
    return now;
}

function computeTimePeriod(date = new Date()) {
    const hour = date.getHours();
    if (hour >= 5 && hour < 8) return 'nearMorning';
    if (hour >= 8 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    if (hour >= 20 && hour < 22) return 'beforeMidnight';
    if (hour >= 22 || hour < 1) return 'midnight';
    return 'night';
}

export default function SleepSpaceModal({ open, onClose, partnerId }) {
    const theme = useTheme();
    const now = useNow(60 * 1000);
    const timePeriod = useMemo(() => computeTimePeriod(now), [now]);

    // Redux data
    const { profileData } = useSelector((s) => s.profile || {});
    const { allUsers } = useSelector((s) => s.privateChat || {});

    const myProfile = useMemo(() => ({
        profileImage: profileData?.profileImage || '',
        fullName: toCapitalCase((profileData?.fullName || 'You').split(' ')[0]),
    }), [profileData]);

    const partnerProfileData = useMemo(() => allUsers?.find((p) => p.userId === partnerId)?.profile || null, [allUsers, partnerId]);
    const showProfilePic = useMemo(() => allUsers?.find((p) => p.userId === partnerId)?.settings?.showProfilePic || false, [allUsers, partnerId]);
    const partnerProfile = useMemo(() => ({
        profileImage: partnerProfileData?.profileImage || '',
        fullName: toCapitalCase((partnerProfileData?.fullName || 'Partner').split(' ')[0]),
    }), [partnerProfileData]);

    // paragraphs and conversation
    const sleepParagraphs = useMemo(() => [
        `Close your eyes, ${myProfile.fullName}, and feel ${partnerProfile.fullName}’s presence in your thoughts, calming your mind.`,
        `Take a deep breath, ${myProfile.fullName}, imagining ${partnerProfile.fullName} beside you, bringing warmth and peace.`,
        `Picture the two of you floating gently on clouds, ${myProfile.fullName} and ${partnerProfile.fullName}, free and serene.`,
        `Feel a soft breeze wrapping around both of you, ${myProfile.fullName} and ${partnerProfile.fullName}, carrying away stress.`,
        `Imagine the stars shining brighter tonight, just for ${myProfile.fullName} and ${partnerProfile.fullName}.`,
        `With every exhale, ${myProfile.fullName}, release your worries and let ${partnerProfile.fullName}’s energy soothe you.`,
        `Visualize a golden light connecting ${myProfile.fullName} and ${partnerProfile.fullName}, surrounding you with warmth.`,
        `${myProfile.fullName}, hear the gentle whispers of comfort from ${partnerProfile.fullName}, easing your mind.`,
        `Feel your heartbeat sync with ${partnerProfile.fullName}’s presence, ${myProfile.fullName}, steady and calm.`,
        `Let your thoughts drift like leaves on a river, carrying ${myProfile.fullName} and ${partnerProfile.fullName} together.`,
        `${myProfile.fullName}, imagine ${partnerProfile.fullName} smiling softly, filling your heart with serenity.`,
        `Let go of tension, ${myProfile.fullName}, and let ${partnerProfile.fullName}’s calmness guide you into rest.`,
        `Feel your muscles relaxing, ${myProfile.fullName}, as if ${partnerProfile.fullName} is gently easing them away.`,
        `Picture yourself and ${partnerProfile.fullName} in a peaceful forest, ${myProfile.fullName}, surrounded by quiet stillness.`,
        `The sound of gentle rain soothes ${myProfile.fullName}, reminding you of ${partnerProfile.fullName}’s comforting presence.`,
        `Feel a sense of gratitude for ${partnerProfile.fullName}, ${myProfile.fullName}, as the day drifts peacefully away.`,
        `Imagine ${myProfile.fullName} and ${partnerProfile.fullName} lying under a soft starlit sky, hearts at ease.`,
        `Focus on the calmness surrounding you, ${myProfile.fullName}, knowing ${partnerProfile.fullName} is near in spirit.`,
        `Drift into dreams, ${myProfile.fullName}, carrying the warmth and love of ${partnerProfile.fullName} with you.`,
        `Sleep peacefully, ${myProfile.fullName}, with thoughts of ${partnerProfile.fullName} filling your heart with calm.`,
    ], [myProfile.fullName, partnerProfile.fullName]);

    const conversationMessages = useMemo(() => [
        `${myProfile.fullName}: Hey, are you ready to sleep?`,
        `${partnerProfile.fullName}: Almost… thinking of you keeps me awake 😅`,
        `${myProfile.fullName}: Don’t worry, I’ll help you relax.`,
        `${partnerProfile.fullName}: Mhm… I like that.`,
        `${myProfile.fullName}: Close your eyes… imagine we’re under the stars.`,
        `${partnerProfile.fullName}: I can see them… you’re there too.`,
        `${myProfile.fullName}: Just breathe, feel calm… I’m right here.`,
        `${partnerProfile.fullName}: It feels so peaceful with you.`,
        `${myProfile.fullName}: Good night… dream of me 😴`,
        `${partnerProfile.fullName}: Good night… see you in dreams 🌙`,
        `Pairly Chat: Oops, rain is coming… let’s enjoy it and drift off to sleep.`,
    ], [myProfile.fullName, partnerProfile.fullName]);

    // UI state
    const [conversationIndex, setConversationIndex] = useState(0);
    const [currentParaIndex, setCurrentParaIndex] = useState(0);
    const [rainAlarm, setRainAlarm] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [electricBolt, setElectricBolt] = useState(false);

    // refs for intervals
    const convIntervalRef = useRef(null);
    const paraIntervalRef = useRef(null);
    const thunderIntervalRef = useRef(null);

    // audio refs (lazy-created)
    const rainAudioRef = useRef(null);
    const thunderAudioRef = useRef(null);

    // precompute particles & clouds
    const cloudPositions = useMemo(() => Array.from({ length: 5 }).map((_, i) => ({ left: 8 + i * 18 + Math.random() * 6, top: 6 + Math.random() * 10 })), []);
    const rainParticles = useMemo(() => Array.from({ length: 120 }).map(() => ({ left: Math.random() * 100, delay: Math.random() * 2 })), []);

    // Determine feature availability
    const isFeatureAvailable = useMemo(() => {
        const hour = now.getHours();
        return hour >= 20 || hour < 3;
    }, [now]);

    // Determine forced continuous rain window (user requested): 01:00 - 06:00
    const isContinuousRainWindow = useMemo(() => {
        const hour = now.getHours();
        return hour >= 1 && hour < 6;
    }, [now]);

    // Auto-advance conversation
    useEffect(() => {
        if (convIntervalRef.current) clearInterval(convIntervalRef.current);
        convIntervalRef.current = setInterval(() => {
            setConversationIndex((p) => {
                const next = (p + 1) % conversationMessages.length;
                if (next === conversationMessages.length - 1) {
                    // when conversation reaches last message trigger rain alarm
                    setRainAlarm((prev) => !prev);
                }
                return next;
            });
        }, 5000);

        return () => clearInterval(convIntervalRef.current);
    }, [conversationMessages.length]);

    // Auto-advance guided paragraphs
    useEffect(() => {
        if (paraIntervalRef.current) clearInterval(paraIntervalRef.current);
        paraIntervalRef.current = setInterval(() => {
            setCurrentParaIndex((p) => (p + 1) % sleepParagraphs.length);
        }, 5000);
        return () => clearInterval(paraIntervalRef.current);
    }, [sleepParagraphs.length]);

    // Thunder plays ONLY when electricBolt becomes true
    useEffect(() => {
        if (!audioEnabled) return;
        if (!electricBolt) return;

        try {
            if (!thunderAudioRef.current) {
                thunderAudioRef.current = new Audio('/sounds/lightning.mp3');
            }

            thunderAudioRef.current.currentTime = 0;
            thunderAudioRef.current.volume = 0.85;
            thunderAudioRef.current.play().catch(() => { });
        } catch (e) { }
    }, [electricBolt, audioEnabled]);

    useEffect(() => {
        if (!isContinuousRainWindow) return;

        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                setElectricBolt(true);
                setTimeout(() => setElectricBolt(false), 200 + Math.random() * 300);
            }
        }, 5000 + Math.random() * 5000);

        return () => clearInterval(interval);
    }, [isContinuousRainWindow]);

    // Create rain audio lazily and play/pause based on audioEnabled and window
    useEffect(() => {
        if (!audioEnabled) {
            rainAudioRef.current && rainAudioRef.current.pause();
            if (thunderAudioRef.current) thunderAudioRef.current.pause();
            return;
        }

        if (!rainAudioRef.current) {
            rainAudioRef.current = new Audio('/sounds/rainSound.mp3');
            rainAudioRef.current.loop = true;
            rainAudioRef.current.volume = 0.45;
        }

        // If continuous rain window or rainAlarm then play rain sound
        if (isContinuousRainWindow || rainAlarm) {
            rainAudioRef.current.play().catch(() => { });
        } else {
            rainAudioRef.current.pause();
            rainAudioRef.current.currentTime = 0;
        }

        return () => {
            // leave audio element for reuse but pause
            rainAudioRef.current && rainAudioRef.current.pause();
        };
    }, [audioEnabled, rainAlarm, isContinuousRainWindow]);

    // Clean up on unmount
    useEffect(() => () => {
        clearInterval(convIntervalRef.current);
        clearInterval(paraIntervalRef.current);
        clearInterval(thunderIntervalRef.current);
        if (rainAudioRef.current) {
            rainAudioRef.current.pause();
            rainAudioRef.current = null;
        }
        if (thunderAudioRef.current) {
            thunderAudioRef.current.pause();
            thunderAudioRef.current = null;
        }
    }, []);

    const handleClose = useCallback(() => {
        // stop audio on close
        if (rainAudioRef.current) {
            rainAudioRef.current.pause();
            rainAudioRef.current.currentTime = 0;
        }
        if (thunderAudioRef.current) {
            thunderAudioRef.current.pause();
            thunderAudioRef.current.currentTime = 0;
        }
        setAudioEnabled(false);
        onClose && onClose();
    }, [onClose]);

    const toggleAudio = useCallback(async (e) => {
        const enabled = !!e.target.checked;
        setAudioEnabled(enabled);
        // create audio elements immediately on user gesture to satisfy autoplay
        if (enabled) {
            if (!rainAudioRef.current) rainAudioRef.current = new Audio('/sounds/rainSound.mp3');
            if (!thunderAudioRef.current) thunderAudioRef.current = new Audio('/sounds/lightning.mp3');
            rainAudioRef.current.loop = true;
            rainAudioRef.current.volume = 0.45;
            // play rain immediately if in window
            if (isContinuousRainWindow || rainAlarm) {
                try { await rainAudioRef.current.play(); } catch { }
            }
        } else {
            rainAudioRef.current && rainAudioRef.current.pause();
            thunderAudioRef.current && thunderAudioRef.current.pause();
        }
    }, [isContinuousRainWindow, rainAlarm]);

    // Sky gradient selection (keep original look)
    const getSkyGradient = useCallback(() => {
        switch (timePeriod) {
            case 'nearMorning': return 'linear-gradient(to top, #2e1a47 0%, #cf9039 60%, #cda429 100%)';
            case 'morning': return 'linear-gradient(to right, #008a8c, #a9a9a9)';
            case 'afternoon': return 'linear-gradient(to top, #87cefa, #fdf497, #ffffff)';
            case 'evening': return 'linear-gradient(to top, #ff7e5f, #feb47b, #6a3093)';
            default: return 'linear-gradient(to bottom, #0a0a0aff, #202021ff)';
        }
    }, [timePeriod]);

    // Background renderer (restored original structure)
    const BackgroundRenderer = () => {
        // If feature not available — show plain dark BG and message
        if (!isFeatureAvailable) {
            return <Box sx={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' }} />;
        }

        // If feature available, show full time-based backgrounds and rain/cloud when active
        if (isContinuousRainWindow || rainAlarm) {
            // during rain periods show dynamic sky
            const rainDensity = isContinuousRainWindow ? 100 : 60;
            const cloudColor = isContinuousRainWindow ? 'linear-gradient(to bottom, #2e3b4e, #1d2631)' : 'linear-gradient(to bottom, #5a6b7d, #3d4b5a)';

            return (
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    background: getSkyGradient(),
                    overflow: 'hidden'
                }}>
                    {/* Clouds */}
                    {cloudPositions.map((pos, i) => (
                        <Box
                            key={i}
                            sx={{
                                position: 'absolute',
                                left: `${pos.left}%`,
                                top: `${pos.top}%`,
                                width: 180,
                                height: 65,
                                borderRadius: '50px',
                                background: cloudColor,
                                boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                                opacity: isContinuousRainWindow ? 0.9 : 1,
                                animation: `floatCloud 6s ${i * 0.6}s ease-in-out infinite alternate`
                            }} />
                    ))}

                    {/* Rain */}
                    {rainParticles.slice(0, rainDensity).map((r, i) => (
                        <Box
                            key={`r-${i}`}
                            sx={{
                                position: 'absolute',
                                left: `${r.left}%`,
                                top: '-10%',
                                width: '2px',
                                height: '20px',
                                background: 'rgba(210,230,255,0.7)',
                                borderRadius: '2px',
                                animation: `rainFall ${isContinuousRainWindow ? '0.6s' : '1.2s'} ${r.delay}s linear infinite`, '@keyframes rainFall': {
                                    '0%': { transform: 'translateY(0)', opacity: 0.7 },
                                    '100%': { transform: 'translateY(110vh)', opacity: 0 }
                                }
                            }} />
                    ))}

                    {/* Lightning flash overlay during thunder bursts (visual) */}
                    {electricBolt && <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.12)', pointerEvents: 'none', mixBlendMode: 'screen', transition: 'opacity 120ms' }} />}
                </Box>
            );
        }

        // default night sky (no rain)
        return (
            <Box sx={{ position: 'absolute', inset: 0, background: getSkyGradient(), overflow: 'hidden' }}>
                {/* stars */}
                {Array.from({ length: 120 }).map((_, i) => (
                    <Box key={i} sx={{ position: 'absolute', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: 4, height: 4, background: '#fff', opacity: 0.4, borderRadius: '50%' }} />
                ))}
            </Box>
        );
    };

    // Not available card (shown when isFeatureAvailable=false)
    const NotAvailableCard = () => (
        <Stack spacing={2} sx={{ maxWidth: 700, p: 4, borderRadius: 2, background: 'linear-gradient(to right,#280748,#1b1a1a)', backdropFilter: 'blur(6px)' }}>
            <Typography variant="h5" sx={{ color: '#fff', textAlign: 'center' }}>Not Available Right Now</Typography>
            <Typography variant="body1" sx={{ color: '#e6eef8', textAlign: 'center' }}>
                Sleep Space is available after <strong>8 PM</strong> local time so couples can use it during intended nighttime hours.
            </Typography>
        </Stack>
    );

    // Main content when available (restore original layout with Lottie trees + sleep animation)
    const AvailableContent = () => (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Stack sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
                {[tree2, tree1, tree2].map((tree, i) => (
                    <Player key={i} autoplay loop src={tree} style={{ width: '12vw', height: '24vh', maxWidth: 160 }} />
                ))}
            </Stack>

            <Stack sx={{ maxWidth: 900, width: '100%', alignItems: 'center', textAlign: 'center', color: '#E0E6F8' }}>
                <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', md: '1.6rem' } }}>{sleepParagraphs[currentParaIndex]}</Typography>

                <Player autoplay loop src={sleep} style={{ width: '30vw', height: '30vh', maxWidth: 420, marginTop: 16 }} />

                <Typography sx={{ mt: 2 }}>{conversationMessages[conversationIndex]}</Typography>

                <FormControlLabel control={<Switch checked={audioEnabled} onChange={toggleAudio} />} label="Enable ambient sounds" sx={{ mt: 2, color: '#fff' }} />
            </Stack>

            <Stack sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
                {[tree2, tree1, tree2].map((tree, i) => (
                    <Player key={i} autoplay loop src={tree} style={{ width: '12vw', height: '24vh', maxWidth: 160 }} />
                ))}
            </Stack>
        </Stack>
    );

    return (
        <Modal open={open} onClose={handleClose} closeAfterTransition BackdropProps={{ timeout: 500, sx: { backgroundColor: theme.palette.background.paper } }}>
            <Box sx={{ position: 'relative', width: '100%', height: '100%', p: 2 }}>
                <BackgroundRenderer />

                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1200 }}>
                    <Stack sx={{ background: 'linear-gradient(to left,#0f2241,#233851)', px: 2, pt: 1, borderRadius: 1.5, minWidth: 220 }}>
                        <NightsStayIcon sx={{ color: '#ccc', alignSelf: 'flex-end' }} />
                        <Typography variant="h5" sx={{ color: '#E0E6F8', fontWeight: 700 }}>
                            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#A9B8CF' }}>
                            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mt: 1, justifyContent: 'center' }}>
                            <Avatar src={myProfile.profileImage} alt={myProfile.fullName} />
                            <Avatar src={showProfilePic ? partnerProfile.profileImage : ''} alt={partnerProfile.fullName} />
                        </Stack>
                    </Stack>

                    <Tooltip title="Deactivate Sleep Space">
                        <IconButton onClick={handleClose} sx={{ boxShadow: `0 0 4px ${theme.palette.info.dark}` }} aria-label="Close sleep space">
                            <CloseIcon sx={{ color: theme.palette.text.primary }} />
                        </IconButton>
                    </Tooltip>
                </Stack>

                {/* Main area: either not available message or full content */}
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    {!isFeatureAvailable ? <NotAvailableCard /> : <AvailableContent />}
                </Box>

            </Box>
        </Modal>
    );
}

SleepSpaceModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    partnerId: PropTypes.string,
};

SleepSpaceModal.defaultProps = { partnerId: null };
