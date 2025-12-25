import React, { useState, useRef, useEffect } from 'react';
import { Box, Stack, Typography, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import StyledButton from '@/components/common/StyledButton';
import StyledActionButton from '@/components/common/StyledActionButton';
import StyledText from '@/components/common/StyledText';
import {
  HelpOutlineIcon,
} from '@/MUI/MuiIcons';

import ForumIcon from '@mui/icons-material/Forum';
import LockIcon from '@mui/icons-material/Lock';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CampaignIcon from '@mui/icons-material/Campaign';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

import HowItWorks from '@/components/public/HowItWorks';
import FAQ from '@/components/public/FAQ';
import { Link } from 'react-router-dom';
import HomeFeatures from '../../components/public/HomeFeatures';
import python from '@/assets/svg/python.svg';
import react from '@/assets/svg/react.svg';
import tensorflow from '@/assets/svg/tensorflow.svg';
import homeAi from '@/assets/images/homePageAiImage.jpg';

function Home() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  React.useEffect(() => {
    document.title = 'Pairly - Mini Social Universe';
  }, []);

  React.useEffect(() => {
    const featInterval = setInterval(() => {
      setSelectedFeature((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(featInterval);
  }, []);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isXl = useMediaQuery(theme.breakpoints.down('xl'));
  const custome = useMediaQuery('(max-width:430px)');

  // useRef props here
  const refHero = useRef(null);
  const refFeatures = useRef(null);
  const refWhyPairly = useRef(null);
  const refPairlyGrowth = useRef(null);
  const refPairlyDifferent = useRef(null);
  const refAIBehindPairly = useRef(null);

  // Animation Start here
  useEffect(() => {

    const hero = refHero.current;
    const features = refFeatures.current;
    const whyPairly = refWhyPairly.current;
    const pairlyGrowth = refPairlyGrowth.current;
    const pairlyDifferent = refPairlyDifferent.current;
    const aiBehind = refAIBehindPairly.current;

    //  Make sure all refs exist before animating
    if (!hero
      || !features
      || !whyPairly
      || !pairlyGrowth
      || !pairlyDifferent
      || !aiBehind
    ) return;

    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });
    const heroElements = refHero.current.children;
    const FeaturesElements = refFeatures.current.children;
    const WhyPairlyElements = refWhyPairly.current.children;
    const pairlyGrowthElement = refPairlyGrowth.current.children;
    const pairlyDifferentElement = refPairlyDifferent.current.children;
    const aiBehindElement = refAIBehindPairly.current.children;

    tl.from(heroElements, {
      y: 50,
      opacity: 0,
      stagger: 0.25,
    });

    tl.from(FeaturesElements, {
      y: 50,
      opacity: 0,
      stagger: 0.25,
    });

    tl.from(WhyPairlyElements, {
      x: 160,
      opacity: 0,
      stagger: 0.25,
      scrollTrigger: {
        trigger: whyPairly,
        start: 'top 90%',
        end: 'bottom 40%',
        scrub: 2,
        markers: false,
      },
    });

    tl.from(pairlyGrowthElement, {
      x: -160,
      opacity: 0,
      stagger: 0.25,
      scrollTrigger: {
        trigger: pairlyGrowth,
        start: 'top 100%',
        end: 'bottom 60%',
        scrub: 2,
        markers: false,
      },
    });

    tl.from(pairlyDifferentElement, {
      x: 160,
      opacity: 0,
      stagger: 0.25,
      scrollTrigger: {
        trigger: pairlyDifferent,
        start: 'top 90%',
        end: 'bottom 40%',
        scrub: 2,
        markers: false,
      },
    });

    tl.from(aiBehindElement, {
      x: -160,
      opacity: 0,
      stagger: 0.25,
      scrollTrigger: {
        trigger: aiBehind,
        start: 'bottom 100%',
        end: 'top 60%',
        scrub: 4,
        markers: false,
      },
    });

    return () => tl.kill();
  }, []);

  return (
    <React.Fragment>
      {/* === Hero / Slogan Section === */}
      <Box
        sx={{
          display: 'flex',
          mt: isSm ? '18dvh' : isMd ? '20dvh' : '18dvh',
          px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '20%',
          gap: 4,
          pb: isMd ? 15 : 8,
          alignItems: 'center',
        }}
      >
        {/* Headline & Description */}
        <Stack spacing={4} ref={refHero}>
          <Typography
            variant={isSm ? 'h3' : isMd ? 'h3' : 'h2'}
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              fontSize: isMd ? '1.8em' : '4em',
              lineHeight: isSm ? 1.2 : 1,
            }}
          >
            Pairly a mini social universe. <br /> Your space to connect, truly.
          </Typography>

          {/* Short Description */}
          {isSm ? (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, lineHeight: 1.4, fontSize: isSm ? '20px' : '24px' }}
            >
              Pairly connects real people with genuine conversations.
            </Typography>

          ) : (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, lineHeight: 1.6, fontSize: '24px' }}
            >
              Pairly is a{' '}
              <Link to="nextGenerationChat">
                next generation chat platform
              </Link>{' '}
              that connects real people worldwide in seconds. No bots just genuine conversations that protect emotions and create meaningful bonds.
            </Typography>
          )}

          {/* CTA Buttons */}
          <Stack direction="row" gap={2} sx={{ mt: 3, flexWrap: 'wrap' }}>
            <StyledActionButton
              text={'Begin Your Journey'}
              redirectUrl={'/register'}
            />
            {!custome && <StyledButton text={'Why Pairly?'} redirectUrl={'/about'} />}
          </Stack>
        </Stack>
      </Box>

      {/* === Features Section === */}
      <Stack
        ref={refFeatures}
        direction={'column'}
        mt={4}
        sx={{
          px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '20%',
        }}
      >
        {/* Headers */}
        <Stack
          direction="row"
          overflow="auto"
          gap={1}
          sx={{
            display: 'flex',
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {[
            { label: 'Random Chat', icon: <ForumIcon /> },
            { label: 'Private Chat', icon: <LockIcon /> },
            { label: 'Love Proposal', icon: <FavoriteIcon /> },
            { label: 'Standup Hall', icon: <CampaignIcon /> },
            { label: 'Silent Mode', icon: <VolumeOffIcon /> },
          ].map((feat, i) => {
            const isActive = selectedFeature === i;
            const accent = theme.palette.info.main;

            return (
              <Stack
                key={i}
                onClick={() => setSelectedFeature(i)}
                gap={1}
                flex={1}
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                  position: 'relative',
                  p: 1,
                  flexShrink: 0,
                  cursor: 'pointer',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: isActive ? '100%' : '0%',
                    height: '3px',
                    borderRadius: '2px',
                    background: `linear-gradient(90deg, ${accent}, ${theme.palette.info.light},${theme.palette.error.light})`,
                    transform: 'translateX(-50%)',
                    transition: 'width 0.3s ease-in-out',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: isActive ? '100%' : '0%',
                    height: '3px',
                    borderRadius: '2px',
                    background: `linear-gradient(90deg, ${theme.palette.info.light}, ${accent})`,
                    opacity: 0.3,
                    transform: 'translateX(-50%)',
                    transition: 'width 0.3s ease-in-out',
                  },
                  '&:hover::before': {
                    width: '100%',
                  },
                }}
              >
                {React.cloneElement(feat.icon, {
                  sx: {
                    fontSize: '1rem',
                    color: isActive ? accent : `${theme.palette.text.primary}80`,
                    transition: 'color 0.25s ease',
                  },
                })}
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: '0.9em',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? accent : `${theme.palette.text.primary}90`,
                    transition: 'color 0.25s ease',
                  }}
                >
                  {feat.label}
                </Typography>
              </Stack>
            );
          })}
        </Stack>

        {/* Headers Content */}
        {selectedFeature === 0
          ? (
            <HomeFeatures
              selectedFeature={selectedFeature}
            />
          )
          : selectedFeature === 1
            ? (
              <HomeFeatures
                selectedFeature={selectedFeature}
              />
            )
            : selectedFeature === 2
              ? (
                <HomeFeatures
                  selectedFeature={selectedFeature}
                />
              )
              : selectedFeature === 3
                ? (
                  <HomeFeatures
                    selectedFeature={selectedFeature}
                  />
                )
                : (
                  <HomeFeatures
                    selectedFeature={selectedFeature}
                  />
                )
        }
      </Stack>

      {/* Why Pairly and what problem it solves */}
      <Stack sx={{
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
      }}>
        <Stack
          sx={{
            position: 'relative',
            height: isSm ? '70dvh' : '85dvh',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            mt: 8,
          }}
        >
          {/* Left track */}
          {!isSm && (
            <Box
              sx={{
                position: 'absolute',
                left: '10%',
                top: 0,
                bottom: 0,
                width: '2px',
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  width: '5px',
                  top: 0,
                  bottom: 0,
                  background: `linear-gradient(180deg, 
                ${theme.palette.error.main}80, 
                ${theme.palette.background.default}, 
                ${theme.palette.warning.dark}50)`,
                  borderRadius: '2px',
                },
                '&::after': {
                  left: '10px',
                },
              }}
            />
          )}

          {/* Responsive Content */}
          {isSm ? (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                px: 2,
              }}
            >
              {/* Star Background Animation */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  zIndex: 0,
                  '@keyframes sparkle': {
                    '0%': { opacity: 0.5, transform: 'scale(0.5)' },
                    '50%': { opacity: 0.7, transform: 'scale(1.2)' },
                    '100%': { opacity: 0, transform: 'scale(0.5)' },
                  },
                }}
              >
                {Array.from({ length: 25 }).map((_, i) => {
                  const left = Math.random() * 100;
                  const top = Math.random() * 100;
                  const size = 3 + Math.random() * 2;
                  const duration = 2 + Math.random() * 3;
                  const delay = Math.random() * 3;

                  return (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        left: `${left}%`,
                        top: `${top}%`,
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        background: `${theme.palette.text.primary}70`,
                        boxShadow: `inset 0 2px 8px ${theme.palette.text.primary}70`,
                        animation: `sparkle ${duration}s ${delay}s infinite ease-in-out`,
                        opacity: 0.4,
                      }}
                    />
                  );
                })}
              </Box>

              {/* Content */}
              <Box
                ref={refWhyPairly}
                sx={{
                  zIndex: 1,
                  color: 'text.primary',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: `${theme.palette.error.main}90` }}>
                  Why Pairly?
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                  Pairly isn’t just another chat app — it’s a space where real connections
                  are built. Whether you’re here to meet new people, create meaningful
                  bonds, or simply enjoy authentic conversations, Pairly ensures every
                  interaction feels genuine and personal.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  We built Pairly to solve the problem of shallow, fast-paced social
                  interactions. Our focus is on helping users form deeper connections in a
                  calm, respectful, and fun environment — powered by unique features like
                  Random Chat, Private Rooms, and Love Proposals.
                </Typography>
              </Box>
            </Box>
          ) : (
            // Large screen
            <Box
              ref={refWhyPairly}
              sx={{
                flexGrow: 1,
                ml: isSm ? 0 : '20%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: isSm ? 0 : 6,
                gap: 2,
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  color: `${theme.palette.error.main}90`
                }}
              >
                Why Pairly?
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                }}
              >
                Build a full-featured application with an intuitive, interactive visual interface.
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                }}
              >
                We built Pairly to solve the problem of shallow, fast-paced social
                interactions. Our focus is on helping users form deeper connections in a
                calm, respectful, and fun environment — powered by unique features like
                Random Chat, Private Rooms, and Love Proposals.
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>

      {/* Pairly Growth & Feedback Section */}
      <Stack sx={{
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
        background: theme.palette.background.paper
      }}>
        <Stack
          sx={{
            position: 'relative',
            height: isSm ? '80dvh' : '90dvh',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            mt: 8,
            borderRadius: 1,
            boxShadow: `0 0 2px inherit`,
            background: `linear-gradient(180deg,
      ${theme.palette.background.default}30,
      ${theme.palette.info.dark}10)`,
          }}
        >
          {/* Left track */}
          {!isSm && (
            <Box
              sx={{
                position: 'absolute',
                right: '10%',
                top: 0,
                bottom: 0,
                width: '2px',
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  width: '5px',
                  top: 0,
                  bottom: 0,
                  background: `linear-gradient(180deg, 
            ${theme.palette.error.main}80, 
            ${theme.palette.background.default}, 
            ${theme.palette.warning.dark}50)`,
                  borderRadius: '2px',
                },
                '&::after': {
                  left: '10px',
                },
              }}
            />
          )}

          {/* Responsive Content */}
          {isSm ? (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                px: 2,
              }}
            >
              {/* star Background */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  zIndex: 0,
                  '@keyframes fly': {
                    '0%': {
                      transform: 'translateY(0) translateX(0) rotate(0deg)',
                      opacity: 0.7,
                    },
                    '50%': {
                      transform: 'translateY(-50vh) translateX(30px) rotate(15deg)',
                      opacity: 0.5,
                    },
                    '100%': {
                      transform: 'translateY(-100vh) translateX(-30px) rotate(-10deg)',
                      opacity: 0.5,
                    },
                  },
                }}
              >
                {Array.from({ length: 20 }).map((_, i) => {
                  const left = Math.random() * 100;
                  const size = 2 + Math.random() * 2;
                  const duration = 4 + Math.random() * 6;
                  const delay = Math.random() * 5;

                  return (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        left: `${left}%`,
                        bottom: '-10%',
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 60%, transparent 100%)`,
                        boxShadow: `0 0 ${size * 4}px ${theme.palette.primary.main}`,
                        opacity: 0.9,
                        animation: `fly ${duration}s ${delay}s linear infinite`,
                      }}
                    />
                  );
                })}
              </Box>

              {/* Content */}
              <Box
                ref={refPairlyGrowth}
                sx={{
                  zIndex: 1,
                  color: 'text.primary',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: `${theme.palette.error.main}90` }}>
                  A World Where Every Connection Feels Natural
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: '600px',
                    mx: 'auto',
                    lineHeight: 1.4,
                  }}
                >
                  Experience Pairly — a social space designed for comfort, authenticity, and real emotion.
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>
                  We make it simple to connect, chat, and grow meaningful bonds — powered by human warmth, not algorithms.
                </Typography>

                {/* Stats Section */}
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={3}
                  mt={4}
                  sx={{
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    { value: '10K+', label: 'Active Members' },
                    { value: '98%', label: 'Positive Feedback' },
                    { value: '500+', label: 'New Matches Daily' },
                  ].map((item, i) => (
                    <Stack key={i} alignItems="center" spacing={0.5}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {item.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            // Large screen
            <Box
              ref={refPairlyGrowth}
              sx={{
                flexGrow: 1,
                ml: isSm ? 0 : '20%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: isSm ? 0 : 6,
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 1, color: `${theme.palette.error.main}90` }}>
                A World Where Every Connection Feels Natural
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                }}
              >
                Experience Pairly — a calm, human-first social universe built for real conversations.
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                }}
              >
                Pairly empowers you to connect deeply, chat freely, and express genuinely — without the noise of typical social platforms.
              </Typography>

              {/* Stats */}
              <Stack direction="row" spacing={6} mt={4}>
                {[
                  { value: '10K+', label: 'Active Members' },
                  { value: '98%', label: 'Positive Feedback' },
                  { value: '500+', label: 'New Matches Daily' },
                ].map((item, i) => (
                  <Stack key={i} spacing={0.5}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      {item.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {item.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Stack>

      {/* What Makes Pairly Different */}
      <Stack sx={{
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
      }}>
        <Stack
          sx={{
            position: 'relative',
            height: isSm ? '80dvh' : '90dvh',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            mt: 8,
          }}
        >
          {/* Left track */}
          {!isSm && (
            <Box
              sx={{
                position: 'absolute',
                left: '10%',
                top: 0,
                bottom: 0,
                width: '2px',
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  width: '5px',
                  top: 0,
                  bottom: 0,
                  background: `linear-gradient(180deg, 
          ${theme.palette.error.main}80, 
          ${theme.palette.background.default}, 
          ${theme.palette.warning.dark}50)`,
                  borderRadius: '2px',
                },
                '&::after': {
                  left: '10px',
                },
              }}
            />
          )}

          {/* Responsive Content */}
          {isSm ? (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                px: 2,
              }}
            >
              {/* Star Background Animation */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  zIndex: 0,
                  '@keyframes sparkle': {
                    '0%': { opacity: 0, transform: 'scale(0.5)' },
                    '50%': { opacity: 1, transform: 'scale(1.2)' },
                    '100%': { opacity: 0, transform: 'scale(0.5)' },
                  },
                }}
              >
                {Array.from({ length: 25 }).map((_, i) => {
                  const left = Math.random() * 100;
                  const top = Math.random() * 100;
                  const size = 3 + Math.random() * 2;
                  const duration = 2 + Math.random() * 3;
                  const delay = Math.random() * 3;

                  return (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        left: `${left}%`,
                        top: `${top}%`,
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        background: `${theme.palette.text.primary}70`,
                        boxShadow: `inset 0 0 1rem ${theme.palette.divider}`,
                        animation: `sparkle ${duration}s ${delay}s infinite ease-in-out`,
                        opacity: 0.4,
                      }}
                    />
                  );
                })}
              </Box>

              {/* Content */}
              <Box
                ref={refPairlyDifferent}
                sx={{
                  zIndex: 1,
                  color: 'text.primary',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: `${theme.palette.error.main}90` }}>
                  What Makes Pairly Different?
                </Typography>

                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                  Pairly stands out by putting <b>genuine human connection</b> first. We’ve built
                  a space where conversations feel natural, not forced — and where every
                  feature encourages real interaction instead of endless swiping or small talk.
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  From <b>AI-powered matchmaking</b> that understands your vibe, to private chat
                  rooms and thoughtful proposal options — Pairly redefines how people meet,
                  bond, and build trust online. It’s not just chatting, it’s connecting.
                </Typography>
              </Box>
            </Box>
          ) : (
            // Large screen
            <Box
              ref={refPairlyDifferent}
              sx={{
                flexGrow: 1,
                ml: isSm ? 0 : '20%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: isSm ? 0 : 6,
                gap: 2,
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  color: `${theme.palette.error.main}90`
                }}
              >
                What Makes Pairly Different?
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                }}
              >
                Where technology meets genuine connection — not just another chat app.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                }}
              >
                Pairly brings a refreshing twist to online interaction — built for real people
                who crave authenticity. With features like <b>Random Match</b>, <b>Private Chat Rooms</b>,
                and <b>Proposals</b>, we make it easy to find your kind of connection
                whether it’s friendship, love, or just meaningful conversation.
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>

      {/* ===  How It Works Section === */}
      <Stack sx={{
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
      }}>
        <HowItWorks />
      </Stack>

      {/* ===  The AI Behind Pairly Section === */}
      <Stack sx={{
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
      }}>
        <Stack
          sx={{
            position: 'relative',
            height: isSm ? '80dvh' : '90dvh',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            mt: 8,
            background: `linear-gradient(180deg,
      ${theme.palette.background.default}30,
      ${theme.palette.info.dark}10)`,
            borderRadius: 1,
            boxShadow: `0 0 2px inherit`
          }}
        >
          {/* === Gradient Tracks (Desktop Only) === */}
          {!isSm && (
            <>
              {/* Left Track */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '10%',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  '&::before, &::after': {
                    content: '""',
                    position: 'absolute',
                    width: '6px',
                    top: 0,
                    bottom: 0,
                    background: `linear-gradient(180deg, 
              ${theme.palette.error.main}80, 
              ${theme.palette.background.default}, 
              ${theme.palette.success.dark}60
            )`,
                    borderRadius: '3px',
                  },
                  '&::after': { left: '10px' },
                }}
              />

              {/* Right Track */}
              <Box
                sx={{
                  position: 'absolute',
                  right: '10%',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  '&::before, &::after': {
                    content: '""',
                    position: 'absolute',
                    width: '6px',
                    top: 0,
                    bottom: 0,
                    background: `linear-gradient(180deg, 
              ${theme.palette.error.main}80, 
              ${theme.palette.background.default}, 
              ${theme.palette.success.dark}60
            )`,
                    borderRadius: '3px',
                  },
                  '&::after': { right: '6px' },
                }}
              />
            </>
          )}

          {/* === Responsive Content === */}
          {isSm ? (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                px: 2,
              }}
            >
              {/* Floating Stars Background */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  zIndex: 0,
                  '@keyframes fly': {
                    '0%': { transform: 'translateY(0)', opacity: 0.7 },
                    '50%': { transform: 'translateY(-50vh)', opacity: 0.5 },
                    '100%': { transform: 'translateY(-100vh)', opacity: 0.5 },
                  },
                }}
              >
                {Array.from({ length: 20 }).map((_, i) => {
                  const left = Math.random() * 100;
                  const size = 2 + Math.random() * 2;
                  const duration = 4 + Math.random() * 6;
                  const delay = Math.random() * 5;

                  return (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        left: `${left}%`,
                        bottom: '-10%',
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 60%, transparent 100%)`,
                        boxShadow: `0 0 ${size * 4}px ${theme.palette.primary.main}`,
                        opacity: 0.4,
                        animation: `fly ${duration}s ${delay}s linear infinite`,
                      }}
                    />
                  );
                })}
              </Box>

              {/* Mobile Content */}
              <Box
                ref={refAIBehindPairly}
                sx={{ zIndex: 1, color: 'text.primary', textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, mb: 1, color: `${theme.palette.success.main}90` }}
                >
                  The AI Behind Pairly
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    maxWidth: 500,
                    mb: 3,
                  }}
                >
                  Pairly’s smart matching system understands how people connect — learning from
                  real interactions to make every conversation feel easy, natural, and fun.
                </Typography>

                {/* Technology Icons */}
                <Stack
                  direction="row"
                  spacing={3}
                  justifyContent="center"
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ mb: 2 }}
                >
                  <Box component="img" src={tensorflow} alt="TensorFlow" sx={{ width: 40, height: 40 }} />
                  <Box
                    component="img"
                    src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
                    alt="AWS"
                    sx={{ width: 50, height: 40 }}
                  />
                  <Box component="img" src={react} alt="react" sx={{ width: 50, height: 40 }} />
                  <Box component="img" src={python} alt="python" sx={{ width: 50, height: 40 }} />
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: 13,
                    maxWidth: 420,
                    mx: 'auto',
                  }}
                >
                  Built with modern frameworks like <b>TensorFlow</b>, <b>React</b>, and <b>AWS</b>,
                  Pairly’s intelligent system keeps learning and improving — helping you meet
                  people who truly click with your energy and interests.
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              ref={refAIBehindPairly}
              sx={{
                flexGrow: 1,
                ml: '20%',
                mr: '20%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 6,
                gap: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h2" sx={{ fontWeight: 700, color: `${theme.palette.success.main}` }}>
                The AI Behind Pairly
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '700px',
                  mx: 'auto',
                }}
              >
                Intelligent. Intuitive. Always learning to connect better.
              </Typography>

              {/* AI Illustration */}
              <Box
                component="img"
                src={homeAi}
                alt="AI technology visualization"
                sx={{
                  width: '300px',
                  height: 'auto',
                  mx: 'auto',
                  mt: 2,
                  borderRadius: 1,
                  filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))',
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '700px',
                  mx: 'auto',
                }}
              >
                Pairly combines <b>Machine Learning</b> and <b>Conversation Understanding</b> to
                make connections feel authentic. It adapts to your vibe, mood, and energy
                matching you with people who share a similar rhythm and communication style.
              </Typography>

              {/* Modern Tech Stack Logos */}
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                flexWrap="wrap"
                spacing={3}
                mt={3}
              >
                <Box component="img" src={tensorflow} alt="TensorFlow" sx={{ width: 40, height: 40, opacity: 0.8 }} />
                <Box component="img" src={python} alt="Python" sx={{ width: 40, height: 40, opacity: 0.8 }} />
                <Box component="img" src={react} alt="React" sx={{ width: 40, height: 40, opacity: 0.8 }} />
                <Box
                  component="img"
                  src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
                  alt="AWS"
                  sx={{ width: 40, height: 40, opacity: 0.8 }}
                />
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '650px',
                  mx: 'auto',
                  mt: 2,
                  opacity: 0.8,
                }}
              >
                Pairly is constantly improving behind the scenes — using secure, anonymous
                feedback from real chats to create smoother and more genuine matches every day.
                It’s technology built to understand people, not just data.
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>

      {/* ===  Moments That Matter Section === */}
      <Stack sx={{
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
      }}>
      </Stack>

      {/* === Frequently Asked Questions FAQ Section === */}
      <Box
        mt={6}
        sx={{
          maxWidth: 1000,
          mx: 'auto'
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          textTransform={'uppercase'}
          display="flex"
          alignItems="center"
          justifyContent={'center'}
          gap={1}
          gutterBottom
        >
          <HelpOutlineIcon fontSize="medium" sx={{ color: 'success.main' }} />
          {<StyledText text={'FAQ'} />}
        </Typography>
        <Typography
          variant="body2"
          maxWidth="800px"
          color="text.secondary"
          mx="auto"
          textAlign={'center'}
          fontSize={{ xs: 14, md: 16 }}
          mb={3}
        >
          Got questions? We've answered the most common things you might wonder about from how
          Pairly works to how we keep your experience safe and smooth.
        </Typography>

        <FAQ />
      </Box>

      {/* ===  Pairly in Action Section === */}
      <Stack sx={{
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
      }}>

      </Stack>
    </React.Fragment>
  );
}

export default Home;
