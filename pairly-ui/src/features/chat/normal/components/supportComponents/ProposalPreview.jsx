import React, { useEffect, useRef } from 'react';
import { Box, Typography, Stack, useTheme } from '../../../../../MUI/MuiComponents';
import { useSelector } from 'react-redux';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { defaultAvatar } from '../../../../../MUI/MuiIcons';

gsap.registerPlugin(useGSAP);

function ProposalPreview({ partnerProfile, showProfilePic, myProfile }) {
  const theme = useTheme();
  const { proposalData, proposalSelectedMusic } = useSelector((state) => state.privateChat);
  const myProfileImage = useRef(null);
  const partnerProfileImage = useRef(null);

  const {
    proposalType,
    proposalMessage,
    proposalThemes,
    proposalBackground,
    proposalAnimationStyle,
    proposalGiftToken,
  } = proposalData;
  const backgroundMusic = proposalSelectedMusic;

  // Smooth profile entry animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { duration: 1.2, ease: 'power3.out' } });

    tl.fromTo(
      myProfileImage.current,
      { x: -120, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1.2 }
    )
      .fromTo(
        partnerProfileImage.current,
        { x: 120, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1.2 },
        '-=0.8'
      );

    // Gentle pulse glow loop
    gsap.to([myProfileImage.current, partnerProfileImage.current], {
      boxShadow: `0 0 25px ${theme.palette.primary.main}66`,
      scale: 1.2,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }, []);

  function getProposeType(type) {
    switch (type) {
      case 'life_partner': return 'propose';
      case 'forever_marry': return 'marry';
      case 'home_forever': return 'confess love';
      case 'two_souls': return 'connect';
      case 'sunrise': return 'admire';
      case 'steal_fries': return 'flirt';
      case 'grow_old': return 'commit';
      case 'together_place': return 'bond';
      default: return 'express feelings';
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: 400,
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
        py: 4,
      }}
    >
      <Typography mb={5} variant='h4' color='gray'>Work in progress</Typography>
      {/* Profile Images */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        {myProfile.profileImage && (
          <Box
            ref={myProfileImage}
            component="img"
            src={myProfile?.profileImage || defaultAvatar}
            alt="My Profile"
            sx={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `3px solid ${theme.palette.success.main}55`,
              boxShadow: `0 0 25px ${theme.palette.success.main}55`,
            }}
          />
        )}

        {partnerProfile && (
          <Box
            ref={partnerProfileImage}
            component="img"
            src={showProfilePic ? partnerProfile?.profileImage : defaultAvatar}
            alt="Partner Profile"
            sx={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `3px solid ${theme.palette.success.main}55`,
              boxShadow: `0 0 25px ${theme.palette.success.main}55`,
            }}
          />
        )}
      </Box>

      {/* Proposal Content */}
      <Stack spacing={2} alignItems="center">
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {myProfile.fullName} wants to {getProposeType(proposalType)}
        </Typography>

        <Typography variant="body1" fontStyle="oblique" lineHeight={1.6}>
          ❝ {proposalMessage} ❞
        </Typography>
      </Stack>

      {/* Background Music */}
      {backgroundMusic && <audio src={backgroundMusic} autoPlay loop />}
    </Box>
  );
}

export default ProposalPreview;
