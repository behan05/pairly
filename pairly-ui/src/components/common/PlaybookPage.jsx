import { useEffect } from 'react';
import { Container, Typography, Box, Divider, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import StyledText from '@/components/common/StyledText';

function Section({ title, children }) {
    return (
        <Box mt={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                {title}
            </Typography>
            <Box sx={{ color: 'text.secondary' }}>{children}</Box>
        </Box>
    );
}

function PlaybookPage() {
    useEffect(() => {
        document.title = 'Pairly - Legal Playbook';
    }, []);

    return (
        <Container maxWidth="md" sx={{ pt: 10 }}>
            <Box textAlign="start" mb={4}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    <StyledText text="Legal" /> Playbook
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Overview of Pairly.chat’s global legal and policy framework.
                </Typography>
            </Box>

            <Typography paragraph>
                The Pairly Playbook serves as a transparent guide to how our platform operates, protects
                users, and ensures compliance with international laws and best practices.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Section title="🔒 Privacy & Data Protection">
                Learn how we handle your information responsibly and securely under GDPR, CCPA, and global
                standards.
                <br />
                <MuiLink component={Link} to="/privacy-policy" color="primary.main">
                    View Privacy Policy
                </MuiLink>
            </Section>

            <Section title="📜 Terms of Use">
                Understand your rights and obligations when using Pairly, including rules for chats, events,
                and coin transactions.
                <br />
                <MuiLink component={Link} to="/terms-of-use" color="primary.main">
                    View Terms of Use
                </MuiLink>
            </Section>

            <Section title="🍪 Cookies Policy">
                Learn about how cookies and similar technologies improve your experience and keep sessions
                secure.
                <br />
                <MuiLink component={Link} to="/cookies-policy" color="primary.main">
                    View Cookies Policy
                </MuiLink>
            </Section>

            <Section title="💰 Virtual Coins & Transactions">
                Details on Pairly Coins, event payouts, and broker fee deductions.
                <br />
                <MuiLink component={Link} to="/coins-policy" color="primary.main">
                    View Coins Policy (coming soon)
                </MuiLink>
            </Section>

            <Section title="🛡️ Safety & Community Guidelines">
                We encourage respectful and safe interactions. Read about reporting, moderation, and content
                standards.
                <br />
                <MuiLink component={Link} to="/community-guidelines" color="primary.main">
                    View Community Guidelines (coming soon)
                </MuiLink>
            </Section>

            <Divider sx={{ my: 4 }} />

            <Typography textAlign="center" variant="body2" color="text.secondary">
                Last updated: November 2025 · © Pairly.chat All rights reserved.
            </Typography>
        </Container>
    );
}

export default PlaybookPage;
