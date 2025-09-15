import { Stack, Typography, Box, Link, List, ListItem } from "@mui/material";
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import BlurWrapper from '@/components/common/BlurWrapper';

export default function DataDeletionPage() {
    return (
        <Box Box component={'section'}>
            {/* Navigate Back */}
            <Stack mb={2}>
                <NavigateWithArrow
                    redirectTo={'/pairly/settings/account'}
                    text={'Data Deletion Policy'}
                />
            </Stack>

            <BlurWrapper maxWidth="md" sx={{ py: 2 }}>
                <Stack elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Data Deletion Policy
                    </Typography>
                    <Typography variant="body1" paragraph>
                        At <strong>Pairly</strong>, we respect your privacy and give you full control over your data.
                    </Typography>

                    <Typography variant="h6" gutterBottom>
                        Automatic Account & Data Deletion
                    </Typography>
                    <Typography variant="body1" paragraph>
                        If you wish to delete your Pairly account, you can do so directly from within the app by clicking
                        the <strong>"Delete Account"</strong> button in your account settings.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Once you delete your account:
                    </Typography>
                    <List sx={{ listStyleType: "disc", pl: 4 }}>
                        <ListItem sx={{ display: "list-item" }}>
                            Your account will be marked for deletion immediately.
                        </ListItem>
                        <ListItem sx={{ display: "list-item" }}>
                            All personal data associated with your account will be permanently deleted from our servers within <strong>90 days</strong>.
                        </ListItem>
                        <ListItem sx={{ display: "list-item" }}>
                            You will not be able to recover your account after deletion.
                        </ListItem>
                    </List>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Alternative Method
                    </Typography>
                    <Typography variant="body1" paragraph>
                        If you are unable to access your account, you can request deletion by emailing us at{" "}
                        <Link href="mailto:support@pairly.chat">support@pairly.chat</Link> with the subject line
                        <em> "Data Deletion Request"</em>.
                    </Typography>

                    <Box mt={4}>
                        <Typography variant="body2" color="text.secondary">
                            Last updated: September 2025
                        </Typography>
                    </Box>
                </Stack>
            </BlurWrapper>
        </Box>

    );
}
