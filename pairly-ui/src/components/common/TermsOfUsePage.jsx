import { useEffect } from 'react';
import { Container, Typography, Box, Divider } from '@/MUI/MuiComponents';
import StyledText from '@/components/common/StyledText';

function Section({ title, children }) {

  return (
    <Box mt={5}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Box sx={{ color: 'text.secondary' }}>{children}</Box>
    </Box>
  );
}

function TermsOfUsePage() {
  useEffect(() => {
    document.title = 'Pairly - Terms of Use';
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 10 }}>
      <Box textAlign="start" mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          <StyledText text="Terms" /> of Use
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Global terms and conditions governing the use of Pairly.chat and its related services.
        </Typography>
      </Box>

      <Typography paragraph>
        Welcome to Pairly.chat (“Pairly”, “we”, “us”, or “our”). By creating an account, accessing, or using
        our platform—including random chat, private chat, video/audio calls, proposals, and virtual
        event halls—you agree to comply with and be legally bound by these Terms of Use.
      </Typography>

      <Section title="1. Eligibility">
        You must be at least 18 years old to use Pairly. By registering, you confirm that you have the
        legal capacity to enter into this agreement in your country of residence.
      </Section>

      <Section title="2. Use of the Platform">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Pairly is intended for social and entertainment purposes only.</li>
          <li>You are responsible for all activities under your account.</li>
          <li>Do not share or post content that is explicit, harassing, defamatory, or illegal.</li>
          <li>Respect local laws and cultural norms when using live or recorded features.</li>
        </ul>
      </Section>

      <Section title="3. Virtual Events & Coins">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Users may host or participate in live virtual performances (“Events”).</li>
          <li>Audience members may send virtual gifts or “Pairly Coins” to event hosts.</li>
          <li>Coins have no monetary value outside the platform but may be exchanged internally
            according to our payout and broker-fee policies.</li>
          <li>Pairly reserves the right to tax, deduct, or hold payments as per applicable financial regulations.</li>
        </ul>
      </Section>

      <Section title="4. User Content & Licensing">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>You retain ownership of the content you create.</li>
          <li>By uploading or streaming on Pairly, you grant us a global, non-exclusive, royalty-free license
            to use, display, and distribute your content solely for operational and promotional purposes.</li>
          <li>We may remove or restrict content violating our community standards.</li>
        </ul>
      </Section>

      <Section title="5. Prohibited Activities">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Spamming, impersonation, or use of bots/automation tools is prohibited.</li>
          <li>Do not use Pairly for any illegal financial activity, solicitation, or exploitation.</li>
          <li>Reverse-engineering, hacking, or accessing data without authorization is forbidden.</li>
        </ul>
      </Section>

      <Section title="6. Account Suspension & Termination">
        Pairly reserves the right to suspend or permanently terminate accounts that violate these terms
        or local regulations. We may also remove any content deemed harmful or inappropriate.
      </Section>

      <Section title="7. Disclaimers & Limitation of Liability">
        Pairly is provided “as is.” We do not guarantee uninterrupted access, accuracy of content, or
        success of matches or events. To the fullest extent permitted by law, Pairly shall not be held
        liable for any damages, loss, or harm resulting from user actions, technical failures, or third-party
        services.
      </Section>

      <Section title="8. Compliance & Governing Law">
        These terms comply with global standards including GDPR (EU), CCPA (California), and applicable
        Indian IT regulations. Disputes shall be governed by neutral jurisdiction (e.g., Singapore or Delaware, USA)
        unless local law requires otherwise.
      </Section>

      <Section title="9. Modifications">
        Pairly may update these terms as features evolve. Material changes will be communicated via
        in-app notices or email. Continued use after updates means you accept the revised terms.
      </Section>

      <Section title="10. Contact Us">
        For legal or compliance inquiries, contact us at{' '}
        <Box component="span" color="primary.main">legal@pairly.chat</Box>.
      </Section>

      <Divider sx={{ my: 4 }} />
      <Typography textAlign="center" variant="body2" color="text.secondary">
        By using Pairly, you acknowledge that you have read and agreed to these Terms of Use.
      </Typography>
    </Container>
  );
}

export default TermsOfUsePage;
