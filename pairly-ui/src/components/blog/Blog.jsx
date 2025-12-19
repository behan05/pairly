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
                minHeight: 'calc(var(--vh, 1vh) * 100)',
                py: { xs: 4, md: 8 },
                mt: 5
            }}
        >
            <Container maxWidth="md">
                {/* Blog Header / Hero */}
                <Box sx={{ mb: 6, textAlign: "center" }}>
                    <Typography
                        variant="h2"
                        fontWeight={700}
                        gutterBottom
                        sx={{
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        How Pairly.chat is Changing Online Connections
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{ maxWidth: 700, mx: "auto" }}
                    >
                        Discover how Pairly.chat is redefining online interaction — bringing
                        genuine conversations, AI-powered experiences, and trust back to
                        digital relationships.
                    </Typography>
                </Box>
                <Divider />
                {/* Blog Content */}
                <Card
                    elevation={0}
                    sx={{
                        background: theme.palette.background.default,
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, sm: 5, md: 6 } }}>
                        <Typography variant="body1" paragraph>
                            In an age dominated by fast swipes and surface-level engagement,
                            most online platforms have lost the essence of connection.
                            <strong> Pairly.chat</strong> was born out of the belief that
                            people crave more — real conversations, authentic bonds, and a
                            sense of belonging that goes beyond algorithms. It’s not just
                            another chat app. It’s a platform built for people who value
                            meaningful interaction over momentary attention.
                        </Typography>

                        <Typography variant="h4" fontWeight={700} sx={{ mt: 5, mb: 2 }}>
                            💬 Beyond Swipes: Real Conversations First
                        </Typography>
                        <Typography variant="body1" paragraph>
                            The modern internet is filled with platforms where you “match”
                            based on appearances or one-line bios. But Pairly.chat does things
                            differently — it puts <strong>conversation first</strong>. When you
                            join, you’re not asked to swipe left or right. Instead, you connect
                            with real people randomly and let the chat unfold naturally. No
                            filters, no forced speed — just human connection.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Every chat begins as an opportunity — to make a friend, find a
                            partner, or simply share thoughts. Users can then decide whether
                            they want to keep in touch or move on. The result? More organic,
                            genuine conversations that feel closer to how we connect in the
                            real world.
                        </Typography>

                        <Typography variant="h4" fontWeight={700} sx={{ mt: 5, mb: 2 }}>
                            🔒 Privacy That Empowers You
                        </Typography>
                        <Typography variant="body1" paragraph>
                            In Pairly.chat, your privacy is never an afterthought. Each user
                            has a <strong>unique ID</strong> — allowing direct, secure
                            connections without revealing personal information. Once a friend
                            request is accepted, users gain access to a private chat room
                            where they can share messages, photos, voice notes, and even
                            <strong> proposals</strong> — from love to fun or long-term
                            friendship.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            This gives users control over their social circle and makes online
                            connection safer and more intentional. Pairly.chat believes that
                            every relationship — whether digital or real — should begin with
                            trust.
                        </Typography>

                        <Typography variant="h4" fontWeight={700} sx={{ mt: 5, mb: 2 }}>
                            🤖 The Role of AI in Human Connection
                        </Typography>
                        <Typography variant="body1" paragraph>
                            One of Pairly.chat’s most exciting innovations is the integration
                            of <strong>AI personalities</strong>. These AI-driven profiles act
                            as companions that help users start conversations, share ideas, or
                            practice communication skills. Whether you’re introverted or just
                            testing the app, the AI ensures that you never feel left out.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            But unlike traditional chatbots, Pairly’s AI is designed to
                            complement — not replace — real human interactions. It encourages
                            users to explore, express, and connect more deeply with others on
                            the platform.
                        </Typography>

                        <Typography variant="h4" fontWeight={700} sx={{ mt: 5, mb: 2 }}>
                            🌍 Building a Global Community
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Pairly.chat isn’t bound by borders. It’s a global network where
                            people from different countries, cultures, and backgrounds can
                            meet and build new stories together. The app is intentionally
                            designed to make interaction inclusive — accessible to anyone who
                            seeks genuine connection, whether for friendship, collaboration,
                            or love.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            With features like random match, private chat, and advanced
                            proposals, Pairly.chat is transforming how people perceive online
                            relationships — shifting the focus from quantity to quality.
                        </Typography>

                        <Typography variant="h4" fontWeight={700} sx={{ mt: 5, mb: 2 }}>
                            🚀 The Vision Ahead
                        </Typography>
                        <Typography variant="body1" paragraph>
                            The Pairly.chat team is constantly working to make the platform
                            smarter, safer, and more personal. Upcoming updates will include
                            enhanced AI personalities, improved matching algorithms, and
                            community-driven events that encourage real-time engagement.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Pairly.chat’s long-term goal is simple yet powerful — to become
                            the most trusted space for people to find meaningful relationships
                            online. It’s not about chasing trends. It’s about bringing
                            humanity back into technology.
                        </Typography>

                        <Divider sx={{ my: 5 }} />

                        <Typography
                            variant="h5"
                            fontWeight={700}
                            textAlign="center"
                            color="primary"
                            sx={{ mb: 2 }}
                        >
                            💡 Final Thoughts
                        </Typography>
                        <Typography variant="body1" paragraph textAlign="center">
                            Pairly.chat stands for something larger than digital messaging — it
                            stands for human connection in its purest form. In a time when
                            attention spans are short and distractions are endless, Pairly.chat
                            offers something refreshingly real: time, empathy, and genuine
                            communication.
                        </Typography>

                        <Typography
                            variant="h6"
                            color="secondary"
                            fontWeight={700}
                            textAlign="center"
                            sx={{ mt: 4 }}
                        >
                            Start a real conversation today — join Pairly.chat.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Blog;
