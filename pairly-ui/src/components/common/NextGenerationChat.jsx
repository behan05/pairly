import { Typography, Container } from '@/MUI/MuiComponents';

function NextGenerationChat() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        fontWeight={700}
        textAlign="center"
        gutterBottom
        sx={{
          background: 'linear-gradient(90deg, #1976D2, #42A5F5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        What is Next-Generation Chat?
      </Typography>

      <Typography
        variant="h6"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 5 }}
      >
        A smarter, more meaningful way to connect — powered by AI, designed for real people.
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
        The internet has countless chat apps. But most are noisy, impersonal, or focused only on
        messages — not meaning. <strong>Pairly.chat</strong> redefines what chat can be. It's built
        around <strong>real connections</strong>, not just random conversations.
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
        Our <strong>Next-Generation Chat</strong> experience combines AI-powered pairing, private
        and secure messaging, emotion-aware proposals, and a personalized interaction layer that
        helps you find exactly the type of connection you want — whether friendship, love, or fun.
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
        Every chat session is backed by <strong>intelligent matchmaking</strong> that adapts to your
        preferences and mood. You can chat instantly with a random person, or use your unique Pairly
        ID to connect privately with someone special. Unlike typical apps, Pairly.chat focuses on
        <strong> emotional context, comfort, and safety</strong>.
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.8 }}>
        With features like <strong>AI personality filters</strong>, <strong>proposal modes</strong>,
        and <strong>smart moderation</strong>, it creates an environment where conversations feel
        authentic — not forced. It’s more than messaging — it’s about helping people
        <strong> discover genuine bonds</strong> in a digital world.
      </Typography>

      <Typography
        variant="h6"
        textAlign="center"
        fontWeight={600}
        color="primary"
        sx={{ mt: 5 }}
      >
        Pairly.chat isn’t just another chat app.<br />
        It’s the next generation of human connection.
      </Typography>
    </Container>
  );
}

export default NextGenerationChat;
