import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from '@/MUI/MuiComponents';
import { ExpandMoreIcon } from '@/MUI/MuiIcons';

const faqs = [
  {
    question: 'What is Pairly?',
    answer:
      'Pairly is a real-time video chat platform that helps you instantly meet and talk to new people across the globe. Whether you’re looking for meaningful conversations, language exchange, or just a quick chat, Pairly provides a safe and smooth experience.'
  },
  {
    question: 'Is Pairly free to use?',
    answer:
      'Yes, Pairly is 100% free to use. You can sign up, set your preferences, and begin chatting with people around the world — all without paying anything. Premium features may be introduced in the future, but the core experience will remain free.'
  },
  {
    question: 'Is signup required to use Pairly?',
    answer:
      'Yes. A quick signup is required to help protect users and ensure better matching. It takes less than a minute and allows us to personalize your experience based on your preferences.'
  },
  {
    question: 'What kind of profile information is needed?',
    answer:
      "When signing up, you'll be asked to enter basic information like your name, age, gender, pronouns, preferred language, and interests. This helps us match you with the right people and maintain a respectful, inclusive community."
  },
  {
    question: 'Can I filter who I Pairly with?',
    answer:
      'Absolutely! You can apply filters like gender interest, preferred language, age range, and even choose between nearby or global matches — giving you control over who you talk to.'
  },
  {
    question: 'Is Pairly safe for everyone?',
    answer:
      'Yes. Pairly is built with safety in mind. All users go through account verification, and we have real-time moderation tools, a reporting system, and strict community guidelines to ensure a safe and respectful environment for everyone.'
  },
  {
    question: 'Can I control my video and audio?',
    answer:
      'Definitely. You can mute your microphone, disable your camera, or even apply video filters and virtual backgrounds during a call. You’re always in control of your visibility and privacy.'
  },
  {
    question: 'How is Pairly different from other chat apps?',
    answer:
      'Unlike generic random chat apps, Pairly offers smart matching based on user preferences, a clean and modern UI, and strong safety tools. It’s designed to make conversations feel more personal, respectful, and purposeful.'
  },
  {
    question: 'Can I report or block users?',
    answer:
      'Yes. If you ever feel uncomfortable or notice inappropriate behavior, you can instantly report or block the user. We take all reports seriously and act promptly to ensure community safety.'
  },
  {
    question: 'Can I use Pairly on mobile devices?',
    answer:
      'Yes! Pairly is fully responsive and works smoothly on all modern mobile browsers. You don’t need to install an app — just visit the website on your phone or tablet and start chatting.'
  }
];

function FAQ() {
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <Box
      sx={{
        mt: 8,
        mb: 6,
        px: { xs: 2, md: 6 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        textAlign="center"
        mb={3}
        letterSpacing={1}
        sx={{
          background: 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Frequently Asked Questions
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 800 }}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === index}
            onChange={handleChange(index)}
            disableGutters
            elevation={0}
            sx={{
              mb: 1.5,
              borderRadius: 3,
              background: expanded === index
                ? 'linear-gradient(120deg, rgba(0,114,255,0.12), rgba(0,198,255,0.08))'
                : 'rgba(255,255,255,0.03)',
              boxShadow: expanded === index
                ? '0px 4px 14px rgba(0,114,255,0.15)'
                : '0px 2px 6px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(0,114,255,0.10)',
                transform: 'translateY(-2px)',
              },
              '&:before': { display: 'none' } // removes the default divider line
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: expanded === index ? 'primary.main' : 'text.secondary',
                    transition: 'all 0.3s ease',
                    '&:hover': { color: 'success.main' },
                  }}
                />
              }
            >
              <Typography
                variant="subtitle1"
                color="text.primary"
                fontWeight={600}
                letterSpacing={0.5}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.7,
                  px: 1,
                  pb: 1,
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}

export default FAQ;
