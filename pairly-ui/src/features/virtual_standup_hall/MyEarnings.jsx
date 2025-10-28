import { Box, Typography, Card, CardContent } from '@mui/material';

function MyEarnings() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
                My Earnings
            </Typography>

            <Card sx={{ maxWidth: 400, borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6">Total Balance</Typography>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                        ₹0.00
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        Your total earnings will appear here once you start earning.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default MyEarnings;
