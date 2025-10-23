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
import { alpha } from '@mui/material/styles';

function FAQHelp() {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  React.useEffect(() => {
    document.title = 'Pairly - Help with FAQs';
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
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {/* Header */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly/settings/help'} text={'FAQs'} />
      </Stack>

      <Typography variant="h5" fontWeight={600} gutterBottom>
        Frequently <StyledText text="Asked Questions" />
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" mb={3}>
        Get quick answers to the most common questions about Pairly.
      </Typography>

      {/* FAQ Items */}
      {faqsHelpData.map((faq, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={handleChange(index)}
          disableGutters
          sx={{
            background: 'transparent',
            boxShadow: 'none',
            borderBottom: `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
            borderRadius: 0,
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.03),
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color: expanded === index ? 'success.main' : 'text.secondary',
                  transition: 'color 0.25s ease',
                }}
              />
            }
            sx={{ px: 1, py: 0 }}
          >
            <Typography
              variant="body1"
              fontWeight={500}
              color="text.primary"
              sx={{ lineHeight: 1.4 }}
            >
              {faq.question}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 2, pb: 1, pt: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.5, fontSize: '0.875rem' }}
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
