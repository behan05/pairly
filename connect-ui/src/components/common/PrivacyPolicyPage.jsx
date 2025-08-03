import React, { useEffect } from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import StyledText from './StyledText';

// === Reusable Section Component ===
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
    document.title = 'Connect - Privacy Policy';
  }, []);

  return (
    <Container maxWidth="md" sx={{ pb: 6 }}>
      {/* Page Title */}
      <Box textAlign="start" mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          <StyledText text="Privacy" /> Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          How Connect collects, uses, and protects your information.
        </Typography>
      </Box>

      {/* Intro */}
      <Typography paragraph>
        This Privacy Policy outlines how Connect handles your data. By using our platform, you agree
        to the practices described below.
      </Typography>

      {/* Sections */}
      <Section title="1. What We Collect">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>
            <strong>Account Info:</strong> Name, email, password, and profile details.
          </li>
          <li>
            <strong>Usage Info:</strong> Device, IP, location, and activity logs.
          </li>
          <li>
            <strong>Communication:</strong> Support requests and limited chat logs (if flagged).
          </li>
        </ul>
      </Section>

      <Section title="2. Why We Collect">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>To personalize matches and improve user experience.</li>
          <li>To detect fraud, spam, or abuse.</li>
          <li>To notify you about security or account updates.</li>
        </ul>
      </Section>

      <Section title="3. Third-Party Sharing">
        We never sell your data. We only share limited information with trusted partners (e.g.,
        analytics, legal compliance) when absolutely necessary.
      </Section>

      <Section title="4. Your Rights">
        You have full control over your data. You may request to view, update, or delete your
        information by contacting our support team.
      </Section>

      <Section title="5. Security">
        We use encryption, secure storage, and account protections. While no system is 100% immune,
        we strive to keep your data safe.
      </Section>

      <Section title="6. Policy Updates">
        This policy may change as Connect evolves. Significant changes will be communicated via app
        banners or emails.
      </Section>

      <Section title="7. Contact Us">
        If you have any questions or concerns, feel free to contact us at{' '}
        <Box component="span" color="primary.main">
          support@connectapp.com
        </Box>
        .
      </Section>

      <Divider sx={{ my: 4 }} />

      <Typography textAlign="center" variant="body2" color="text.secondary">
        By continuing to use Connect, you accept this Privacy Policy.
      </Typography>
    </Container>
  );
}

export default PrivacyPolicyPage;
