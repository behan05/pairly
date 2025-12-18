import { useLayoutEffect, useRef } from "react";
import { Box, Stack, Typography, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import {
  LoginOutlinedIcon,
  PeopleAltOutlinedIcon,
  ChatOutlinedIcon,
  SwipeRightAltOutlinedIcon,
  SecurityOutlinedIcon,
} from '@/MUI/MuiIcons';
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

function HowItWorks() {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const steps = [
    {
      title: 'Enter the Platform',
      description:
        "Getting started on Pairly takes seconds — no lengthy forms or endless clicks. Simply open the app, tap 'Start Connecting', and you're instantly part of a vibrant community. Whether you're here to find friendship, love, or genuine conversation, Pairly welcomes you with simplicity and ease.",
      icon: <LoginOutlinedIcon sx={{ fontSize: 34, color: theme.palette.primary.main }} />,
    },
    {
      title: 'Smart Matchmaking',
      description:
        "Behind every connection is Pairly’s smart matchmaking engine — quietly learning from your preferences, chat style, and mood. It connects you with people who truly fit your vibe, so every chat feels natural, relevant, and emotionally in sync. It’s not random — it’s meaningful discovery.",
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 34, color: theme.palette.info.main }} />,
    },
    {
      title: 'Start Chatting',
      description:
        "Once matched, dive straight into a real-time conversation — text or video, your choice. There’s no waiting room, no lag, no pressure — just authentic talk that flows. Share stories, laughter, or quiet thoughts — Pairly’s fluid experience makes every chat feel like you’re right there.",
      icon: <ChatOutlinedIcon sx={{ fontSize: 34, color: theme.palette.success.main }} />,
    },
    {
      title: 'Keep or Skip',
      description:
        "Every interaction is your choice. If the vibe isn’t right, hit ‘Next’ and instantly meet someone new — no awkward exits, no judgment. It’s freedom to explore and connect at your own pace, with each new chat bringing a fresh opportunity to discover someone amazing.",
      icon: <SwipeRightAltOutlinedIcon sx={{ fontSize: 34, color: theme.palette.warning.main }} />,
    },
    {
      title: 'Safe & Anonymous',
      description:
        "Pairly puts privacy first. Your identity is never revealed unless you choose to share it, and no chat is saved without reason. Advanced moderation tools and respectful community guidelines ensure that every conversation remains kind, safe, and genuine — always.",
      icon: <SecurityOutlinedIcon sx={{ fontSize: 34, color: theme.palette.error.main }} />,
    },
  ];

  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 1, ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "bottom 10%",
          scrub: true,
        },
      });

      // Animate section title
      tl.from("h4", {
        y: 80,
        opacity: 0,
      })
        .from("p", {
          y: 50,
          opacity: 0,
          stagger: 0.2,
        }, "-=0.6");

      // Animate each step card (staggered)
      gsap.utils.toArray(sectionRef.current.querySelectorAll("div[role='group']")).forEach((step, i) => {
        gsap.from(step, {
          opacity: 0,
          y: 120,
          duration: 1.2,
          delay: i * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 90%",
            end: "top 50%",
            scrub: true,
          },
        });
      });

      // Subtle floating animation for the SVG timeline line
      gsap.to("path", {
        y: 15,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut",
      });

      // Pulse effect for connector dots
      gsap.utils.toArray(sectionRef.current.querySelectorAll("div[style*='border-radius: 50%']")).forEach((dot) => {
        gsap.to(dot, {
          scale: 1.3,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box ref={sectionRef} sx={{ position: 'relative', my: 12, px: { xs: 2, md: 6 } }}>

      {/* === Background dots === */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          opacity: 0.1,
          mt: 1,
          justifyContent: 'center',
          alignContent: 'center',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        {Array.from({ length: isMd ? 800 : 1900 }).map((_, i) => (
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

      {/* Timeline Path (SVG curved line) */}
      <Box
        component="svg"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        sx={{
          position: 'absolute',
          left: '50%',
          top: 0,
          transform: 'translateX(-50%)',
          width: '3px',
          height: '100%',
          zIndex: 0,
        }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={theme.palette.error.main} stopOpacity="0.8" />
            <stop offset="50%" stopColor={theme.palette.warning.main} stopOpacity="0.7" />
            <stop offset="100%" stopColor={theme.palette.background.default} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M50 0 Q60 100, 50 200 T50 400 T50 600 T50 800 T50 1000"
          stroke="url(#lineGradient)"
          strokeWidth="2.5"
          fill="none"
          style={{
            filter: `drop-shadow(0 0 6px ${theme.palette.warning.main})`,
            strokeDasharray: '10 6',
            animation: 'flow 4s linear infinite',
          }}
        />
        <style>
          {`
            @keyframes flow {
              to { stroke-dashoffset: -100; }
            }
          `}
        </style>
      </Box>

      {/* Steps (alternating sides) */}
      <Stack spacing={10} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Title */}
        <Stack>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: `${theme.palette.warning.main}90`
            }}
          >
            How It Works
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth={600}
          >
            Follow the flow from joining to connecting. Pairly keeps everything simple,
            intuitive, and genuinely fun.
          </Typography>
        </Stack>

        {steps.map((step, i) => (
          <Stack
            key={i}
            direction={i % 2 === 0 ? 'row' : 'row-reverse'}
            alignItems="center"
            spacing={4}
            sx={{
              position: 'relative',
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}
          >
            {/* Content box */}
            <Box
              sx={{
                width: { xs: '100%', md: '45%' },
                background: `linear-gradient(180deg,
      ${theme.palette.background.default}30,
      ${theme.palette.info.dark}10)`,
                borderRadius:1,
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                textAlign: 'left',
              }}
            >
              {step.icon}
              <Typography variant="h6" fontWeight={700} mt={1} mb={1}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Box>

            {/* Connector dot */}
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: theme.palette.error.main,
                boxShadow: '0 0 12px rgba(255,0,0,0.5)',
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export default HowItWorks;
