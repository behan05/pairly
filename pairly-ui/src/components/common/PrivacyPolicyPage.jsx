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

function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Pairly - Privacy Policy';
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 10 }}>
      <Box textAlign="start" mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          <StyledText text="Privacy" /> Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          How Pairly.chat collects, uses, and protects your personal information globally.
        </Typography>
      </Box>

      <Typography paragraph>
        Pairly.chat (“Pairly”, “we”, “us”, or “our”) values your privacy. This policy explains how we
        handle your data in compliance with the General Data Protection Regulation (GDPR), California
        Consumer Privacy Act (CCPA), and other applicable privacy laws.
      </Typography>

      <Section title="1. Information We Collect">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li><strong>Account Info:</strong> Name, username, email, password, gender, profile photo, and preferences.</li>
          <li><strong>Usage Data:</strong> Device details, IP address, location (approximate), and in-app activity.</li>
          <li><strong>Communications:</strong> Support messages, chat logs (if flagged or reported), and call metadata (not recordings).</li>
          <li><strong>Financial Data:</strong> Limited payment or coin transaction information handled via secure gateways.</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Data">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>To enable matching, chatting, and event participation features.</li>
          <li>To ensure safety, moderation, and detect fraudulent activity.</li>
          <li>To manage coins, payouts, and rewards.</li>
          <li>To improve features and send updates or alerts.</li>
        </ul>
      </Section>

      <Section title="3. Legal Basis for Processing">
        We process your data under lawful bases including consent, legitimate interest, contractual necessity,
        and compliance with legal obligations.
      </Section>

      <Section title="4. Sharing & Third Parties">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>We do <strong>not</strong> sell personal data.</li>
          <li>We share limited information only with trusted providers (e.g., hosting, payments, analytics, AI services).</li>
          <li>All partners comply with data protection standards (GDPR, ISO, or equivalent).</li>
        </ul>
      </Section>

      <Section title="5. International Data Transfers">
        Your data may be stored and processed in data centers worldwide. We use secure transfer mechanisms
        such as Standard Contractual Clauses to ensure protection across borders.
      </Section>

      <Section title="6. Your Rights">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Access, correct, or delete your personal data.</li>
          <li>Withdraw consent at any time (where applicable).</li>
          <li>Request data portability or object to processing.</li>
          <li>Contact your local privacy authority if you believe your rights are violated.</li>
        </ul>
      </Section>

      <Section title="7. Security & Data Retention">
        We use encryption (TLS/SSL), secure authentication, and restricted access. Data is retained only
        as long as necessary for legal, operational, or safety reasons.
      </Section>

      <Section title="8. Children’s Privacy">
        Pairly is not intended for users under 18. We do not knowingly collect or store data from minors.
      </Section>

      <Section title="9. Policy Updates">
        We may update this Privacy Policy periodically. Substantial changes will be announced via app
        notifications or email.
      </Section>

      <Section title="10. Contact Us">
        If you have privacy-related questions or data requests, contact us at{' '}
        <Box component="span" color="primary.main">privacy@pairly.chat</Box>.
      </Section>

      <Divider sx={{ my: 4 }} />
      <Typography textAlign="center" variant="body2" color="text.secondary">
        By using Pairly, you acknowledge and accept this Privacy Policy.
      </Typography>
    </Container>
  );
}

export default PrivacyPolicyPage;
