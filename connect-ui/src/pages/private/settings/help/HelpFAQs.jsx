import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  useTheme
} from '@/MUI/MuiComponents';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import StyledText from '@/components/common/StyledText';
import { ExpandMoreIcon } from '@/MUI/MuiIcons';

function FAQHelp() {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  React.useEffect(() => {
    document.title = 'Pairly - Help with FAQs ❓';
  }, []);

  const faqsHelpData = [
    {
      question: 'How does random chat matching work?',
      answer:
        "Our algorithm pairs you with available users based on your preferences like age, gender interest, and language. Just click 'Start Chat' to get matched instantly."
    },
    {
      question: 'Why am I not getting matched with anyone?',
      answer:
        'This can happen if your match preferences are too narrow or if no one is currently online. Try adjusting your filters or try again later.'
    },
    {
      question: 'Can I skip or next a user?',
      answer:
        "Yes, during a chat session, click the 'Next' button to leave the current chat and get matched with a new user immediately."
    },
    {
      question: 'Is my chat history saved?',
      answer:
        'Only recent chats are temporarily stored for moderation purposes if flagged. Otherwise, we do not store your chat messages permanently.'
    },
    {
      question: 'How can I change my gender interest or language preference?',
      answer:
        'Go to Settings → Match Preferences. From there, you can update your gender interest, age range, and language filters at any time.'
    },
    {
      question: 'How do I report someone for inappropriate behavior?',
      answer:
        "During a chat, click the 'Report' icon. Select a reason and submit. Reports are anonymous, and our moderation team takes action when necessary."
    },
    {
      question: 'Can I disable location-based matching?',
      answer:
        "Yes. In your settings under Match Preferences, toggle 'Global Matching' to ignore nearby-only matches and connect with users worldwide."
    },
    {
      question: 'How do I delete my account?',
      answer:
        'Go to Settings → Account → Delete Account. You’ll be asked to confirm, and your data will be removed according to our retention policy.'
    },
    {
      question: 'Why was I suddenly disconnected from a chat?',
      answer:
        "This may happen if the other user ended the chat or if there was a temporary network issue. You can click 'Next' to reconnect with a new user."
    },
    {
      question: 'Is this platform safe and moderated?',
      answer:
        'Yes. Our system flags abusive messages, and all reports are reviewed. We’re committed to creating a respectful and anonymous space for everyone.'
    }
  ];

  return (
    <Box
      sx={{
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}
    >
      {/* Header with arrow back icon */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly/settings/help'} text={'FAQs'} />
      </Stack>

      {/* === FAQs heading === */}
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Frequently <StyledText text="Asked Questions" />
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Get quick answers to the most common questions about Pairly.
      </Typography>

      {/* === FAQs === */}
      {faqsHelpData.map((faq, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={handleChange(index)}
          disableGutters
          sx={{
            backdropFilter: `blur(14px)`,
            background: 'transparent',
            boxShadow: `inset 0 1px 0.1rem ${theme.palette.text.secondary}`,
            borderRadius: 0.5
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color: expanded === index ? 'success.main' : 'text.secondary',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: 'secondary.main'
                  },
                  '&:active': {
                    color: 'warning.main'
                  }
                }}
              />
            }
          >
            <Typography variant="subtitle1" letterSpacing={1} fontWeight={600} color={'text.primary'}>
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              color="text.secondary"
              variant="body2"
              sx={{
                textAlign: 'left',
                lineHeight: 1.6
              }}
            >
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
export default FAQHelp;
