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

function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Pairly - Privacy Policy';
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 10, pb: 10 }}>
      <Box textAlign="start" mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          <StyledText text="Privacy" /> Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          This Privacy Policy explains in detail how Pairly.chat (“Pairly”, “we”, “us”, or “our”) collects, uses, shares, and protects your data for free and paid features across its platform globally.
        </Typography>
      </Box>

      <Typography paragraph>
        By accessing or using Pairly.chat, including chat, random chat, private chat, video/audio calls, virtual events, coins, and gifts, you agree to this Privacy Policy and consent to the collection, storage, and processing of your information as described herein.
      </Typography>

      {/* Section 1 */}
      <Section title="1. Information We Collect">
        <SubSection subtitle="1.1 Account Information">
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li>Full name, username, email, password, gender, pronouns, profile image, profile bio, and preferences.</li>
            <li>Account creation date, last login date, account status, and subscription history.</li>
            <li>Optional information like short bio, social links, and profile visibility settings.</li>
          </ul>
        </SubSection>

        <SubSection subtitle="1.2 Usage & Device Data">
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li>IP address, approximate geolocation (country, state, city), timezone, and network provider.</li>
            <li>Device type, operating system, browser information, app version.</li>
            <li>Login timestamps, in-app activity, chat metadata, random chat sessions, and virtual event participation logs.</li>
            <li>Crash reports, error logs, and performance metrics for app improvement.</li>
          </ul>
        </SubSection>

        <SubSection subtitle="1.3 Paid Features & Transactions">
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li>Virtual currency (coins), gifts, subscription purchases, billing details, transaction IDs, payment confirmations via Razorpay.</li>
            <li>Promotions, bonus coins, refunds, and account balances.</li>
            <li>Payment processor interactions for audit and legal compliance purposes.</li>
          </ul>
        </SubSection>

        <SubSection subtitle="1.4 Communications & Chat Data">
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li>Support messages, chat logs flagged for moderation, call metadata (duration, timestamps, participants).</li>
            <li>Content you share publicly or with other users may be temporarily stored for matching and moderation.</li>
            <li>Audio/video streams are generally not recorded unless reported or flagged.</li>
          </ul>
        </SubSection>

        <SubSection subtitle="1.5 Third-party Services">
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li>Analytics providers (Google Analytics, Mixpanel, Sentry) for app usage and performance tracking.</li>
            <li>Cloud storage and server providers (AWS, GCP, Vercel, etc.) for operational support.</li>
            <li>AI/ML service providers for moderation and matching algorithms.</li>
          </ul>
        </SubSection>
      </Section>

      {/* Section 2 */}
      <Section title="2. How We Use Your Information">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>To create and manage accounts, verify identity, and enable free and paid features.</li>
          <li>To provide AI-based matching, recommendations, random chat, and virtual events.</li>
          <li>To detect fraud, prevent multiple-account abuse, and monitor suspicious activity.</li>
          <li>To process payments, coins, and gifts, including refunds and adjustments.</li>
          <li>To communicate updates, alerts, and customer support responses.</li>
          <li>To analyze app usage for product improvement and personalized experiences.</li>
        </ul>
      </Section>

      {/* Section 3 */}
      <Section title="3. Cookies and Tracking Technologies">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>We use cookies, local storage, and analytics tracking for session management, preferences, feature improvement, and performance monitoring.</li>
          <li>Essential cookies are required for login and transactions; non-essential cookies help with analytics and optional personalization.</li>
          <li>Users can disable non-essential cookies via device or browser settings without affecting core functionality.</li>
        </ul>
      </Section>

      {/* Section 4 */}
      <Section title="4. AI & Automated Processing">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>AI models are used for matching users based on preferences, behavior, and interactions.</li>
          <li>Content moderation uses AI to detect abusive, offensive, or spam messages automatically.</li>
          <li>No user chat data is used to train external AI models without consent.</li>
          <li>Automated recommendations are monitored to avoid biases and ensure fairness.</li>
        </ul>
      </Section>

      {/* Section 5 */}
      <Section title="5. Sharing Your Information">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>We <strong>do not sell your personal information</strong>.</li>
          <li>Limited data may be shared with trusted third parties for operational purposes: payment processors, analytics providers, cloud servers, and AI moderation services.</li>
          <li>Legal compliance: we may disclose data to law enforcement or regulatory bodies under applicable laws.</li>
          <li>Aggregated or anonymized data may be shared for research or analytical purposes.</li>
        </ul>
      </Section>

      {/* Section 6 */}
      <Section title="6. Data Retention & Deletion">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Account and profile data are retained until deletion by the user or deactivation.</li>
          <li>Deleted data may persist in backups for fraud prevention or legal compliance (typically 90–180 days).</li>
          <li>Chat messages flagged for abuse are retained for investigation and safety purposes.</li>
          <li>Virtual currency transactions are logged for financial compliance.</li>
        </ul>
      </Section>

      {/* Section 7 */}
      <Section title="7. Your Rights">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Right to access, correct, delete, or export personal data.</li>
          <li>Right to withdraw consent for specific processing activities.</li>
          <li>Right to opt-out of non-essential cookies or tracking.</li>
          <li>Right to object to automated profiling (AI matching and moderation).</li>
          <li>Right to lodge complaints with privacy authorities in your jurisdiction.</li>
        </ul>
      </Section>

      {/* Section 8 */}
      <Section title="8. Security Measures">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Encryption in transit (TLS/SSL) and at rest for sensitive data.</li>
          <li>Password security with bcrypt or equivalent hashing.</li>
          <li>Restricted internal access based on role and necessity.</li>
          <li>Regular security audits, penetration tests, and monitoring of suspicious activity.</li>
          <li>Incident response plans for data breaches or unauthorized access.</li>
        </ul>
      </Section>

      {/* Section 9 */}
      <Section title="9. Children’s Privacy">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Pairly.chat is intended strictly for users aged 18 and above.</li>
          <li>We do not knowingly collect information from minors, and accounts found underage may be terminated.</li>
        </ul>
      </Section>

      {/* Section 10 */}
      <Section title="10. International Data Transfers">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Your data may be stored or processed in countries outside your residence.</li>
          <li>Transfers comply with GDPR and equivalent standards using Standard Contractual Clauses and encryption.</li>
          <li>Data may be accessed by authorized personnel globally for operational purposes.</li>
        </ul>
      </Section>

      {/* Section 11 */}
      <Section title="11. Changes to this Privacy Policy">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>We may update this Privacy Policy periodically to reflect changes in features, regulations, or legal obligations.</li>
          <li>Significant updates will be communicated via in-app notifications, emails, or both.</li>
          <li>Continued use after changes constitutes acceptance of the revised policy.</li>
        </ul>
      </Section>

      {/* Section 12 */}
      <Section title="12. Contact Information">
        <Typography>
          For any privacy concerns, requests, or inquiries, contact us at{' '}
          <Box component="span" color="primary.main">privacy@pairly.chat</Box>.
        </Typography>
      </Section>

      <Divider sx={{ my: 4 }} />
      <Typography textAlign="center" variant="body2" color="text.secondary">
        By using Pairly.chat, you acknowledge that you have read and agreed to this Privacy Policy.
      </Typography>
    </Container>
  );
}

export default PrivacyPolicyPage;
