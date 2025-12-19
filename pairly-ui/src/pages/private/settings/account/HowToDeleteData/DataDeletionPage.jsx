import { Stack, Typography, Box, Link, List, ListItem } from "@mui/material";
import NavigateWithArrow from '@/components/private/NavigateWithArrow';

export default function DataDeletionPage() {
    return (
        <Box component="section">
            {/* Back Navigation */}
            <Stack mb={3}>
                <NavigateWithArrow
                    redirectTo="/pairly/settings/account"
                    text="Back to Account Settings"
                />
            </Stack>

            {/* Policy Container */}
            <Box
                maxWidth="md"
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    p: 2
                })}
            >
                <Stack spacing={4} p={{ xs: 3, sm: 4 }}>
                    {/* Header */}
                    <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Data Deletion Policy
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            This policy explains how you can request deletion of your data and how Pairly handles data removal.
                        </Typography>
                    </Box>

                    {/* Introduction */}
                    <Box>
                        <Typography variant="body1" paragraph>
                            At <strong>Pairly</strong>, we respect your privacy and are committed to giving you full control over
                            your personal data. This Data Deletion Policy outlines the methods available to delete your account
                            and the data associated with it.
                        </Typography>
                    </Box>

                    {/* Section: Automatic Deletion */}
                    <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            1. Account Deletion from the App
                        </Typography>

                        <Typography variant="body1" paragraph>
                            You can permanently delete your Pairly account at any time directly from the application:
                        </Typography>

                        <List sx={{ listStyleType: 'disc', pl: 4 }}>
                            <ListItem sx={{ display: 'list-item' }}>
                                Navigate to <strong>Settings → Account</strong>.
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                Click on the <strong>“Delete Account”</strong> option.
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                Confirm your request to initiate account deletion.
                            </ListItem>
                        </List>

                        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                            Once the deletion request is confirmed:
                        </Typography>

                        <List sx={{ listStyleType: 'disc', pl: 4 }}>
                            <ListItem sx={{ display: 'list-item' }}>
                                Your account will be immediately deactivated.
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                All personal data linked to your account will be permanently deleted from our servers within
                                <strong> 90 days</strong>.
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                This action is irreversible and your account cannot be restored.
                            </ListItem>
                        </List>
                    </Box>

                    {/* Section: Alternative Request */}
                    <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            2. Deletion Request via Email
                        </Typography>

                        <Typography variant="body1" paragraph>
                            If you are unable to access your Pairly account, you may request data deletion by contacting us via email.
                        </Typography>

                        <Typography variant="body1">
                            Send an email to{' '}
                            <Link href="mailto:support@pairly.chat">
                                support@pairly.chat
                            </Link>{' '}
                            with the subject line <em>“Data Deletion Request”</em>.
                        </Typography>

                        <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                            For security reasons, we may ask you to verify ownership of the account before processing your request.
                        </Typography>
                    </Box>

                    {/* Section: Data Scope */}
                    <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            3. Data Covered by This Policy
                        </Typography>

                        <Typography variant="body1" paragraph>
                            The data deletion process includes, but is not limited to:
                        </Typography>

                        <List sx={{ listStyleType: 'disc', pl: 4 }}>
                            <ListItem sx={{ display: 'list-item' }}>
                                Profile information and account credentials
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                Messages, notes, and content you created
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                Usage logs associated with your account
                            </ListItem>
                        </List>
                    </Box>

                    {/* Footer */}
                    <Box
                        sx={(theme) => ({
                            pt: 3,
                            borderTop: `1px solid ${theme.palette.divider}`,
                        })}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Last updated: December 2025
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
