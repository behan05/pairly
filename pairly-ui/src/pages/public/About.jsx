import React from 'react';
import { Box, Stack, Typography, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import StyledActionButton from '@/components/common/StyledActionButton';
import StyledText from '@/components/common/StyledText';
import {
  HelpOutlineIcon,
} from '@/MUI/MuiIcons';

import FAQ from '@/components/public/FAQ';
import kashyapSiteshSingh from '../../assets/team/kashyapSiteshSingh.jpeg';

function About() {

  React.useEffect(() => {
    document.title = 'Pairly - About';
  }, []);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isXl = useMediaQuery(theme.breakpoints.down('xl'));

  const BotSVG = ({ sx = {} }) => (
    <svg viewBox="0 0 120 120" style={{ width: 160, height: 160, ...sx }}>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stopColor="#6EE7B7" />
          <stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <rect x="12" y="18" rx="18" ry="18" width="96" height="72" fill="url(#g1)" opacity="0.95" />
      <circle cx="40" cy="50" r="6" fill="#fff" />
      <circle cx="80" cy="50" r="6" fill="#fff" />
      <rect x="46" y="70" rx="4" width="28" height="6" fill="#fff" opacity="0.9" />
    </svg>
  );

  // simple animated star
  const Star = ({ left, top, size, delay }) => (
    <Box
      component="span"
      sx={{
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.15) 60%)',
        boxShadow: (theme) => `0 0 ${size * 3}px ${theme.palette.primary.main}40`,
        opacity: 0.85,
        animation: `aboutStarFloat ${6 + (delay % 3)}s ${delay}s infinite linear`,
        '@keyframes aboutStarFloat': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 0.85 },
          '50%': { transform: 'translateY(-18px) scale(1.12)', opacity: 1 },
          '100%': { transform: 'translateY(0) scale(1)', opacity: 0.85 },
        },
      }}
    />
  );

  const StarField = () => (
    <Box
      className="about-stars"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.55,
      }}
    >
      {Array.from({ length: 22 }).map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 3 + 2;
        const delay = Math.random() * 4;
        return <Star key={i} left={left} top={top} size={size} delay={delay} />;
      })}
    </Box>
  );

  return (
    <React.Fragment>
      {/* === Hero / Slogan Section === */}
      <Box
        sx={{
          display: 'flex',
          mt: '6dvh',
          px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '20%',
          gap: 4,
          py: isMd ? 4 : 8,
          alignItems: 'center',
        }}
      >
        {/* Headline & Description */}
        <Stack spacing={4}>
          <Typography
            variant={isSm ? 'h3' : isMd ? 'h3' : 'h2'}
            sx={{
              fontWeight: 700,
              fontSize: isMd ? '1.8em' : '4em',
              lineHeight: isSm ? 1.2 : 1,
              color: `${theme.palette.primary.main}`
            }}
          >
            About Pairly <br /> A calmer, kinder social universe.
          </Typography>

          {/* Short Description */}
          {isSm ? (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, lineHeight: 1.4, fontSize: isSm ? '16px' : '18px' }}
            >
              Pairly was built from the belief that online connection should be real, respectful, and emotionally thoughtful. We design features that encourage people to talk, listen, and form meaningful bonds not just collect likes.
            </Typography>

          ) : (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, lineHeight: 1.6, fontSize: '18px' }}
            >
              Pairly was built from the belief that online connection should be real, respectful, and emotionally thoughtful. We design features that encourage people to talk, listen, and form meaningful bonds — not just collect likes.
            </Typography>
          )}

          {/* CTA Buttons */}
          <Stack direction="row" gap={2} sx={{ mt: 3, flexWrap: 'wrap' }}>
            <StyledActionButton
              text={'Begin Your Journey'}
              redirectUrl={'/register'}
              sx={{ fontSize: '1em', fontWeight: 600, py: 1.2, textShadow: '0 0 2px #000' }}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Mission */}
      <Stack sx={{
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
      }}>
        <Stack
          sx={{
            position: 'relative',
            minHeight: isSm ? '60dvh' : '80dvh',
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                px: 2,
              }}
            >
              {/* Star Background Animation */}
              <StarField />

              {/* Content */}
              <Box
                sx={{
                  zIndex: 1,
                  color: 'text.primary',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: `${theme.palette.error.main}90` }}>
                  Our Mission
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                  Emotion-aware, human-first
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  To empower meaningful relationships by balancing digital innovation with emotional intelligence. We design features that protect emotional space and encourage honest conversation.
                </Typography>
              </Box>
            </Box>
          ) : (
            // Large screen
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: isMd ? 'column' : 'row',
                p: isMd ? 0 : 4,
                justifyContent: isMd ? 'center' : 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <StarField />
              <Stack sx={{
                ml: isSm ? 0 : '20%',
                display: 'flex',
                flexDirection: 'column',
                p: isSm ? 0 : 6,
                gap: 2,
              }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 700,
                    color: `${theme.palette.error.main}90`
                  }}
                >
                  Our Mission
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: '600px',
                  }}
                >
                  Emotion-aware, human-first
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: '600px',
                  }}
                >
                  To empower meaningful relationships by balancing digital innovation with emotional intelligence. We design features that protect emotional space and encourage honest conversation.
                </Typography>
              </Stack>

              {/* Bot */}
              <Box sx={{ position: 'absolute', inset: 0 }}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const left = 10 + Math.random() * 80;
                  const top = 6 + Math.random() * 80;
                  const size = 2 + Math.random() * 6;
                  const delay = Math.random() * 4;
                  return <Star key={i} left={left} top={top} size={size} delay={delay} />;
                })}
              </Box>
              <Box className="about-bot" sx={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
                <BotSVG />
              </Box>

            </Box>
          )}
        </Stack>
      </Stack>

      {/* Vision */}
      <Stack sx={{
        px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
      }}>
        <Stack
          sx={{
            position: 'relative',
            minHeight: isSm ? '60dvh' : '80dvh',
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                px: 2,
              }}
            >
              {/* Star Background Animation */}
              <StarField />

              {/* Content */}
              <Box
                sx={{
                  zIndex: 1,
                  color: 'text.primary',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: `${theme.palette.error.main}90` }}>
                  Our Vision
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                  Technology that unites hearts
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  We imagine a future where tech brings people closer to real emotion — friendships, partnerships, and communities formed by genuine dialogue and mindful design.
                </Typography>
              </Box>
            </Box>
          ) : (
            // Large screen
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: isMd ? 'column' : 'row',
                p: isMd ? 0 : 4,
                justifyContent: isMd ? 'center' : 'flex-start',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <StarField />
              <Stack sx={{
                ml: isSm ? 0 : '20%',
                display: 'flex',
                flexDirection: 'column',
                p: isSm ? 0 : 6,
                gap: 2,
              }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 700,
                    color: `${theme.palette.error.main}90`
                  }}
                >
                  Our Vision
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: '600px',
                  }}
                >
                  Technology that unites hearts
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: '600px',
                  }}
                >
                  We imagine a future where tech brings people closer to real emotion — friendships, partnerships, and communities formed by genuine dialogue and mindful design.
                </Typography>
              </Stack>

              {/* Bot */}
              <Box sx={{ position: 'absolute', inset: 0 }}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const left = 10 + Math.random() * 80;
                  const top = 6 + Math.random() * 80;
                  const size = 2 + Math.random() * 6;
                  const delay = Math.random() * 4;
                  return <Star key={i} left={left} top={top} size={size} delay={delay} />;
                })}
              </Box>
              <Box className="about-bot" sx={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
                <BotSVG />
              </Box>

            </Box>
          )}
        </Stack>
      </Stack>

      {/* Pairly Growth & Feedback Section */}
      <Stack
        sx={{
          px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
        }}
      >
        <Stack
          sx={{
            position: 'relative',
            minHeight: isSm ? '60dvh' : '80dvh',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            background: theme.palette.background.default,
            mt: 8,
            py: 2
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
              {/* Content */}
              <Box
                sx={{
                  zIndex: 1,
                  color: 'text.primary',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: `${theme.palette.error.main}90` }}>
                  Growing Through Every Connection
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
                  Pairly is more than a chat platform it’s a movement toward mindful
                  connection, kindness, and emotional awareness in the digital age.
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>
                  Every interaction helps us grow guided by your trust, feedback, and the
                  genuine bonds formed within our community.
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
                    { value: '98%', label: 'Positive Experiences' },
                    { value: '500+', label: 'Connections Formed Daily' },
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
              sx={{
                flexGrow: 1,
                ml: isSm ? 0 : isLg ? '5%' : '20%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: isSm ? 0 : 6,
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, mb: 1, color: `${theme.palette.error.main}90` }}
              >
                Growing Through Every Connection
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                }}
              >
                Pairly is redefining how people connect blending empathy and innovation to
                build relationships that truly matter.
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                }}
              >
                From friendships to love, from chats to proposals Pairly grows through
                your shared moments, evolving with every heartbeat in our community.
              </Typography>

              {/* Stats */}
              <Stack direction="row" spacing={6} mt={4}>
                {[
                  { value: '10K+', label: 'Active Members' },
                  { value: '98%', label: 'Positive Experiences' },
                  { value: '500+', label: 'Connections Formed Daily' },
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

      {/* ===  Meet Behind Pairly Section === */}
      <Stack
        sx={{
          px: isSm ? '0%' : isLg ? '2%' : isXl ? '10%' : '8%',
        }}
      >
        <Stack
          sx={{
            position: 'relative',
            minHeight: isSm ? '80dvh' : '90dvh',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            py: 2,
            background: theme.palette.background.default,
            mt: 8,
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
                height: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                px: 2,
              }}
            >
              {/* Content */}
              <Box
                sx={{
                  zIndex: 1,
                  color: 'text.primary',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: `${theme.palette.error.main}90` }}>
                  Meet behind pairly
                </Typography>
                <Typography
                  variant={isSm ? 'h5' : 'h2'}
                  sx={{
                    color: 'text.secondary',
                    maxWidth: '700px',
                    mx: 'auto',
                    lineHeight: 1.4,
                    mb: 4,
                  }}
                >
                  A small, passionate team that believes real connection still matters building Pairly with love, code, and purpose.
                </Typography>

                {/* Team Grid */}
                <Stack
                  direction="row"
                  justifyContent="center"
                  flexWrap="wrap"
                  gap={isSm ? 3 : 6}
                  sx={{ mt: 4 }}
                >
                  {[
                    {
                      name: 'Behan Kumar',
                      position: 'Founder & Application Developer',
                      image: 'https://avatars.githubusercontent.com/u/83676505?s=400&u=caa79332e167370eca386917210d81c0077ffbff&v=4',
                    },
                    {
                      name: 'Kashyap Sitesh Singh',
                      position: 'Digital Marketer',
                      image: kashyapSiteshSingh,
                    },
                  ].map((member, i) => (
                    <Stack
                      key={i}
                      alignItems="center"
                      gap={1}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={member.image}
                        alt={member.name}
                        sx={{
                          maxWidth: 200,
                          maxHeight: 200,
                          width: '100%',
                          height: '100%',
                          borderRadius: 2,
                          objectFit: 'cover',
                          border: `2px solid ${theme.palette.primary.main}`,
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {member.position}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Box>
          ) : (
            // Large screen
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                ml: isSm ? 0 : isLg ? '5%' : '20%',
                flexDirection: 'column',
                justifyContent: 'center',
                p: isSm ? 0 : 6,
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: `${theme.palette.error.main}90`
                }}
              >
                Meet the People Behind Pairly
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                }}
              >
                A small, passionate team that believes real connection still matters building Pairly with love, code, and purpose.
              </Typography>

              {/* Team Grid */}
              <Stack
                direction="row"
                justifyContent={isLg ? 'center' : 'start'}
                flexWrap="wrap"
                gap={isSm ? 3 : 6}
                sx={{ mt: 4 }}
              >
                {[
                  {
                    name: 'Behan Kumar',
                    position: 'Founder & Application Developer',
                    image: 'https://avatars.githubusercontent.com/u/83676505?s=400&u=caa79332e167370eca386917210d81c0077ffbff&v=4',
                  },
                  {
                    name: 'Kashyap Sitesh Singh',
                    position: 'Digital Marketer',
                    image: kashyapSiteshSingh,
                  },
                ].map((member, i) => (
                  <Stack
                    key={i}
                    alignItems="center"
                    gap={1}
                    borderRadius={1}
                    justifyContent={'center'}
                    sx={{
                      p: 1.5,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={member.image}
                      alt={member.name}
                      sx={{
                        maxWidth: 230,
                        maxHeight: 230,
                        width: '100%',
                        height: '100%',
                        borderRadius: 1,
                        objectFit: 'cover',
                        border: `2px solid ${theme.palette.primary.main}`,
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {member.position}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
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
    </React.Fragment>
  );
}

export default About;
