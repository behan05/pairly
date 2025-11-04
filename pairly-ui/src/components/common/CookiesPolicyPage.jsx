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

function CookiesPolicyPage() {
    useEffect(() => {
        document.title = 'Pairly - Cookies Policy';
    }, []);

    return (
        <Container maxWidth="md" sx={{ pt: 10 }}>
            <Box textAlign="start" mb={4}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    <StyledText text="Cookies" /> Policy
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    How Pairly.chat uses cookies and similar technologies to enhance your experience.
                </Typography>
            </Box>

            <Typography paragraph>
                This Cookies Policy explains how Pairly.chat (“Pairly”, “we”, “us”, or “our”) uses cookies
                and similar tracking technologies when you use our website or mobile applications.
            </Typography>

            <Section title="1. What Are Cookies?">
                Cookies are small text files stored on your device when you visit a website or use an app.
                They help remember your preferences, login sessions, and usage activity.
            </Section>

            <Section title="2. Types of Cookies We Use">
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>
                        <strong>Essential Cookies:</strong> Required for app functionality (e.g., login sessions,
                        chat security, and payment processing).
                    </li>
                    <li>
                        <strong>Performance & Analytics Cookies:</strong> Help us understand usage patterns,
                        fix bugs, and improve performance using tools like Google Analytics or Firebase.
                    </li>
                    <li>
                        <strong>Personalization Cookies:</strong> Store your theme, match preferences, and app settings
                        to enhance your experience.
                    </li>
                    <li>
                        <strong>Advertising Cookies (if applicable):</strong> Used for relevant ad delivery and tracking
                        performance of campaigns (if ads are enabled).
                    </li>
                </ul>
            </Section>

            <Section title="3. How We Use Cookies">
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>Authenticate your account and keep you logged in securely.</li>
                    <li>Remember language, location, and app preferences.</li>
                    <li>Analyze app performance, user behavior, and error reports.</li>
                    <li>Support coins, events, and in-app purchase tracking.</li>
                </ul>
            </Section>

            <Section title="4. Third-Party Cookies">
                Pairly may use cookies from trusted third-party providers such as:
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>Google Analytics or Firebase for metrics and crash reports.</li>
                    <li>Payment gateways for secure transaction verification.</li>
                    <li>Video or call services (e.g., Agora, Twilio, WebRTC) for connection optimization.</li>
                </ul>
                All such providers comply with privacy standards (GDPR, CCPA, or equivalent).
            </Section>

            <Section title="5. Managing Cookies">
                You can manage or disable cookies in your browser or device settings. However, disabling
                essential cookies may limit your ability to use some features of Pairly.
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>Visit browser settings to block or delete cookies.</li>
                    <li>Use “Do Not Track” options if supported by your browser.</li>
                    <li>App users may manage permissions under device app settings.</li>
                </ul>
            </Section>

            <Section title="6. Your Consent">
                By using Pairly, you consent to the use of cookies as described in this policy. When required
                by law (e.g., EU/EEA), users will see a cookie consent banner on first visit.
            </Section>

            <Section title="7. Policy Updates">
                We may update this Cookies Policy periodically to reflect changes in technology or regulation.
                The “Last Updated” date will be revised accordingly.
            </Section>

            <Section title="8. Contact Us">
                For questions about this Cookies Policy, contact our privacy team at{' '}
                <Box component="span" color="primary.main">privacy@pairly.chat</Box>.
            </Section>

            <Divider sx={{ my: 4 }} />
            <Typography textAlign="center" variant="body2" color="text.secondary">
                By continuing to use Pairly, you agree to our use of cookies as outlined here.
            </Typography>
        </Container>
    );
}

export default CookiesPolicyPage;
