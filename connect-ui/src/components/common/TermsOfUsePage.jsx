import { useEffect } from 'react';
import { Box, Container, Divider, Typography } from '@/MUI/MuiComponents';
import StyledText from '@/components/common/StyledText';

// Section component for reusable section layout
function Section({ title, children }) {
  return (
    <Box mt={5}>
      {/* Section Title */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      {/* Section Content */}
      <Typography variant="body1" color="text.secondary">
        {children}
      </Typography>
    </Box>
  );
}

function TermsOfUsePage() {
  // Set document title on mount
  useEffect(() => {
    document.title = 'Connect - Terms of Use';
  }, []);

  return (
    <Container maxWidth="md" sx={{ pb: 6 }}>
      {/* Page Title */}
      <Box textAlign="start" mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          <StyledText text="Terms" /> of Use
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          The rules and guidelines for using the Connect platform.
        </Typography>
      </Box>

      {/* Intro Paragraph */}
      <Typography paragraph>
        By accessing or using Connect, you agree to abide by these Terms of Use. If you do not agree
        with any part, please do not use our platform.
      </Typography>

      {/* Eligibility Section */}
      <Section title="1. Eligibility">
        You must be at least 18 years old to use Connect. By using the service, you represent that
        you meet this requirement.
      </Section>

      {/* User Conduct Section */}
      <Section title="2. User Conduct">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Do not harass, abuse, or threaten other users.</li>
          <li>No sharing of explicit, harmful, or illegal content.</li>
          <li>Impersonation and false information are strictly prohibited.</li>
        </ul>
      </Section>

      {/* Account Responsibility Section */}
      <Section title="3. Account Responsibility">
        You are responsible for maintaining the confidentiality of your account. Any activity under
        your account is your responsibility.
      </Section>

      {/* Prohibited Activities Section */}
      <Section title="4. Prohibited Activities">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Automated usage, bots, or scraping is not allowed.</li>
          <li>Hacking or exploiting vulnerabilities is strictly forbidden.</li>
          <li>
            Commercial use or advertisement through the platform without permission is not allowed.
          </li>
        </ul>
      </Section>

      {/* Content Ownership Section */}
      <Section title="5. Content Ownership">
        You retain rights to the content you create. However, by posting on Connect, you grant us a
        limited license to use it for functionality and moderation.
      </Section>

      {/* Termination Section */}
      <Section title="6. Termination">
        We reserve the right to suspend or terminate accounts that violate these terms without prior
        notice.
      </Section>

      {/* Disclaimers Section */}
      <Section title="7. Disclaimers">
        <ul style={{ paddingLeft: '1.2rem' }}>
          <li>Connect is provided "as is" without warranties of any kind.</li>
          <li>We are not responsible for user-generated content or interactions.</li>
        </ul>
      </Section>

      {/* Changes to Terms Section */}
      <Section title="8. Changes to Terms">
        We may modify these terms from time to time. Continued use after changes implies acceptance.
      </Section>

      {/* Contact Us Section */}
      <Section title="9. Contact Us">
        For questions or disputes, contact us at <StyledText text="legal@connectapp.com" />.
      </Section>

      {/* Divider before footer */}
      <Divider sx={{ my: 4 }} />

      {/* Footer notice */}
      <Typography textAlign="center" variant="body2" color="text.secondary">
        By continuing to use Connect, you agree to these Terms of Use.
      </Typography>
    </Container>
  );
}

export default TermsOfUsePage;
