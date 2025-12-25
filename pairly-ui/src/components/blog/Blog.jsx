import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Divider,
    useTheme,
} from "@mui/material";

const Blog = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                background: theme.palette.background.default,
                // minHeight: 'calc(var(--vh, 1vh) * 100)',
                py: { xs: 4, md: 8 },
                mt: 5
            }}
        >
            <Container maxWidth="md">
                <Typography variant="h5">Coming Soon...</Typography>
            </Container>
        </Box>
    );
};

export default Blog;
