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

function SubSection({ subtitle, children }) {
  return (
    <Box mt={2}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {subtitle}
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
    <Container maxWidth="md" sx={{ pt: 10, pb: 10 }}>
      <Box textAlign="start" mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          <StyledText text="Terms" /> of Use
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Comprehensive Terms of Use governing your access and use of Pairly.chat, its services, and features worldwide.
        </Typography>
      </Box>

      <Typography paragraph>
        Welcome to Pairly.chat (“Pairly”, “we”, “us”, or “our”). By creating an account, accessing, or using our platform—including free and paid features such as random chat, private chat, video/audio calls, coins, virtual gifts, subscriptions, and virtual event halls—you agree to these Terms of Use. Please read carefully.
      </Typography>

      {/* Section 1 */}
      <Section title="1. Eligibility and Account Creation">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>You must be at least 18 years old to create an account or use the platform.</li>
          <li>By registering, you confirm legal capacity to enter into this agreement in your jurisdiction.</li>
          <li>Only one primary account per user is allowed; multiple accounts may lead to suspension or termination.</li>
        </ul>
      </Section>

      {/* Section 2 */}
      <Section title="2. Account Security and Responsibilities">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>You are responsible for all activity under your account, including messages, gifts, and financial transactions.</li>
          <li>Keep login credentials confidential; notify Pairly immediately if your account is compromised.</li>
          <li>Pairly may require identity verification to prevent fraud or abuse.</li>
        </ul>
      </Section>

      {/* Section 3 */}
      <Section title="3. Paid Features, Coins, and Virtual Gifts">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Coins and virtual gifts can be purchased via Razorpay or future payment processors.</li>
          <li>Coins have no monetary value outside Pairly unless explicitly exchanged under payout policies.</li>
          <li>Promotions, bonuses, or refunds are governed by internal policies and local financial regulations.</li>
          <li>Account balances are non-transferable and may be adjusted for violations of Terms of Use.</li>
        </ul>
      </Section>

      {/* Section 4 */}
      <Section title="4. User Content">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>You retain ownership of content you create, including messages, images, and profiles.</li>
          <li>By posting, streaming, or sharing, you grant Pairly a non-exclusive, worldwide, royalty-free license to operate, display, and distribute your content for platform operations and promotion.</li>
          <li>Pairly may remove content violating community standards or legal requirements.</li>
        </ul>
      </Section>

      {/* Section 5 */}
      <Section title="5. Prohibited Activities">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Illegal activities, harassment, impersonation, spamming, phishing, or fraud are strictly prohibited.</li>
          <li>Using bots, automation tools, or scraping platform data is forbidden.</li>
          <li>Reverse-engineering, hacking, or unauthorized access to Pairly services is prohibited.</li>
          <li>Financial exploitation, solicitation, or unauthorized promotion is not allowed.</li>
        </ul>
      </Section>

      {/* Section 6 */}
      <Section title="6. Random Chat, Private Chat, and AI Matching">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Random chat and AI matching may pair you with other users based on preferences and activity.</li>
          <li>Pairly does not guarantee matches, communication, or outcomes.</li>
          <li>Users are responsible for messages sent; inappropriate behavior may result in suspension.</li>
          <li>AI-based recommendations are automated and may be updated continuously for fairness and relevance.</li>
        </ul>
      </Section>

      {/* Section 7 */}
      <Section title="7. Virtual Events & Community Participation">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Users may host or participate in live events; all interactions must comply with laws and community guidelines.</li>
          <li>Coins, gifts, and other in-app interactions during events are subject to platform policies.</li>
          <li>Pairly may moderate, restrict, or remove content/events deemed harmful, offensive, or illegal.</li>
        </ul>
      </Section>

      {/* Section 8 */}
      <Section title="8. Account Suspension & Termination">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Pairly may suspend or terminate accounts for policy violations, suspected fraud, or at our discretion for safety or legal compliance.</li>
          <li>Content removal or account termination may occur without prior notice if immediate action is required.</li>
          <li>Virtual coins, gifts, or subscriptions may be forfeited upon termination.</li>
        </ul>
      </Section>

      {/* Section 9 */}
      <Section title="9. Disclaimers and Limitation of Liability">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Pairly services are provided “as is” without warranties of uninterrupted access, accuracy, or success.</li>
          <li>Pairly is not liable for damages arising from user behavior, technical issues, third-party services, or virtual event outcomes.</li>
          <li>Use of paid features (coins, gifts, subscriptions) is at your own risk within the platform’s policies.</li>
        </ul>
      </Section>

      {/* Section 10 */}
      <Section title="10. Payment Terms and Refunds">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>All payments are processed via Razorpay or approved payment processors.</li>
          <li>Refunds are subject to internal review, platform policy, and applicable laws.</li>
          <li>Coins or gifts cannot be exchanged for cash outside the platform.</li>
          <li>We reserve the right to deduct or adjust balances in case of fraud or policy violations.</li>
        </ul>
      </Section>

      {/* Section 11 */}
      <Section title="11. Privacy and Data Protection">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Use of the platform implies consent to our Privacy Policy.</li>
          <li>Data collection, storage, AI matching, chat metadata, and location tracking follow applicable laws (GDPR, CCPA, DPDP India).</li>
          <li>Users may exercise rights over their data as outlined in the Privacy Policy.</li>
        </ul>
      </Section>

      {/* Section 12 */}
      <Section title="12. Governing Law and Dispute Resolution">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>These Terms are governed by applicable laws, including Indian IT regulations and international privacy laws.</li>
          <li>Disputes may be resolved via arbitration or courts in agreed jurisdiction (e.g., Singapore/Delaware) unless local law requires otherwise.</li>
          <li>Legal notices must be sent to <Box component="span" color="primary.main">legal@pairly.chat</Box>.</li>
        </ul>
      </Section>

      {/* Section 13 */}
      <Section title="13. Updates to Terms of Use">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Pairly may update these Terms periodically to reflect new features, regulatory changes, or internal policies.</li>
          <li>Significant changes will be communicated via in-app notifications, emails, or both.</li>
          <li>Continued use after updates constitutes acceptance of the revised Terms.</li>
        </ul>
      </Section>

      {/* Section 14 */}
      <Section title="14. Contact Information">
        <Typography>
          For legal, compliance, or policy inquiries, contact us at{' '}
          <Box component="span" color="primary.main">legal@pairly.chat</Box>.
        </Typography>
      </Section>

      <Divider sx={{ my: 4 }} />
      <Typography textAlign="center" variant="body2" color="text.secondary">
        By using Pairly.chat, you acknowledge that you have read, understood, and agreed to these Terms of Use.
      </Typography>
    </Container>
  );
}

export default TermsOfUsePage;
