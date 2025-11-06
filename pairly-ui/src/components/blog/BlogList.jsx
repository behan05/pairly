import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

// Dummy blog data (you can later fetch this from your backend or CMS)
const blogs = [
    {
        id: 1,
        slug: 'how-pairly-is-changing-online-connections',
        title: 'How Pairly.chat is Changing Online Connections',
        image: '/assets/blogs/pairly-connections.jpg',
        date: 'November 2025',
        description:
            'Discover how Pairly.chat is redefining how people connect online — from authentic friendships to meaningful proposals. Learn how real-time AI and genuine interaction make Pairly different from other chat apps.',
    },
    {
        id: 2,
        slug: 'the-future-of-social-connection-ai',
        title: 'The Future of Social Connection with AI',
        image: '/assets/blogs/ai-social.jpg',
        date: 'October 2025',
        description:
            'Artificial Intelligence is changing how we meet and interact online. Pairly.chat’s next-gen matching engine is leading the way with personality-based pairing and emotional insight.',
    },
    {
        id: 3,
        slug: 'why-pairly-is-built-for-real-people',
        title: 'Why Pairly.chat is Built for Real People, Not Just Profiles',
        image: '/assets/blogs/real-people.jpg',
        date: 'September 2025',
        description:
            'Unlike traditional dating and chat apps, Pairly focuses on building real human bonds, encouraging empathy and understanding instead of endless swipes.',
    },
];

export default function BlogList() {
    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography
                variant="h3"
                align="center"
                sx={{ fontWeight: 700, mb: 6 }}
            >
                Pairly Blog
            </Typography>

            <Grid container spacing={4}>
                {blogs.map((blog) => (
                    <Grid item xs={12} sm={6} md={4} key={blog.id}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={blog.image}
                                alt={blog.title}
                                sx={{ height: 200, objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    {blog.date}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {blog.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {blog.description.substring(0, 120)}...
                                </Typography>
                            </CardContent>

                            <Box sx={{ p: 2 }}>
                                <Button
                                    component={Link}
                                    to={`/blog/${blog.slug}`}
                                    variant="contained"
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3,
                                    }}
                                >
                                    Read More
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
