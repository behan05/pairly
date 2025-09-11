import React from 'react';
import { Typography } from '@mui/material';
import StyledText from '../common/StyledText';

const rotatingPhrases = [
  'Start Chatting Instantly',
  'Find New People Fast',
  'Match & Talk Freely',
  'Real-Time, Real People',
  'Smarter Conversations'
];

const Tagline = () => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Typography
      variant="h6"
      gutterBottom
      sx={{
        my: 2,
        pr: 2,
        py: 0.5,
        fontWeight: 500,
        color: 'text.secondary',
        width: 'fit-content',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      Sign Up in Seconds • <StyledText text={rotatingPhrases[index]} />
    </Typography>
  );
};

export default Tagline;
