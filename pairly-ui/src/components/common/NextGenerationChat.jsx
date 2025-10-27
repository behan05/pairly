import { Box, Typography, Container } from '@mui/material';

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
        The future of connection — emotional, intelligent, and real.
      </Typography>

      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        In a world filled with ordinary chat apps, <strong>Pairly.chat</strong> stands for something
        deeper. We believe conversations should not just connect people — they should
        <strong> understand</strong> them. Our <strong>Next-Generation Chat</strong> is built on
        emotional intelligence, privacy, and genuine human warmth.
      </Typography>

      <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 2 }}>
        💫 Emotionally Intelligent Random Chat
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        Forget the old idea of random chat. Pairly.chat introduces an
        <strong> emotionally intelligent matching experience</strong> that helps you connect with
        people who share your current mood or vibe.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        Choose from spaces like <strong>“Chill Vibe”</strong> for relaxed talks,
        <strong> “Deep Talk”</strong> for meaningful conversations,
        <strong> “Just Laugh”</strong> for lighthearted fun — and more. Each space is designed to
        make you feel safe, heard, and emotionally in sync with your chat partner.
      </Typography>

      <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 2 }}>
        🔒 Private Chat with Real Connections
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        Sometimes you meet someone special. With Pairly’s <strong>Private Chat</strong>, you can
        bypass the randomness and connect directly using a unique <strong>User ID</strong>. This
        lets you keep the intimacy of your connection while enjoying the comfort and privacy you
        deserve.
      </Typography>

      <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 2 }}>
        💍 Proposals: Express What You Feel
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        Love. Fun. Long-distance bonding. Marriage. Friendship. Pairly.chat lets you create and send
        <strong> personalized proposals</strong> that fit your emotions and intentions. Whether
        you’re expressing affection, planning a virtual date, or just sending a kind gesture — every
        proposal becomes a moment of connection.
      </Typography>

      <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 2 }}>
        🌙 Silent Feel Mode — Together, Quietly
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        Not every connection needs constant words. With <strong>Silent Feel Mode</strong>, you can
        stay connected with your partner even in silence — sharing presence without pressure.
        Sometimes, the strongest bond is simply <i>being there</i>.
      </Typography>

      <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 2 }}>
        🎤 Virtual Stand-Up Comedy Spaces
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        One of Pairly.chat’s most delightful innovations is the
        <strong> Virtual Stand-Up Comedy Zone</strong> — a digital stage where real users perform
        live, but instead of showing their real faces, they appear as animated avatars or cartoon
        characters.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        It’s perfect for people who are shy or anxious about public speaking. Here, laughter brings
        people together — safely, playfully, and creatively. Real audience, real reactions,
        <strong> real joy</strong> — just with a touch of virtual magic.
      </Typography>

      <Typography variant="h5" fontWeight={600} sx={{ mt: 5, mb: 2 }}>
        💡 Why It Matters
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        Pairly.chat redefines what online connection feels like. We’re combining
        <strong> AI intelligence</strong>, <strong> emotional design</strong>, and
        <strong> human understanding</strong> to create a digital space that feels alive.
        It’s not just chatting — it’s <strong>feeling connected</strong>.
      </Typography>

      <Typography
        variant="h6"
        textAlign="center"
        fontWeight={600}
        color="primary"
        sx={{ mt: 6, mb: 2 }}
      >
        Pairly.chat is not another chat app —<br />
        It’s a new chapter in human connection.
      </Typography>

      <Typography
        variant="body2"
        textAlign="center"
        color="text.secondary"
        sx={{ fontStyle: 'italic' }}
      >
        Built with love. Driven by emotion. Designed for everyone.
      </Typography>
    </Container>
  );
}

export default NextGenerationChat;
