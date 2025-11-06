import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from 'react-router-dom';

const pressArticles = [
  {
    title: "Pairly.chat is Changing Online Connections",
    date: "November 2025",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60",
    description:
      "Pairly.chat introduces a new way to connect online — through genuine conversations, privacy-first design, and AI-powered interaction.",
    link: "/blog/pairly-changing-online-connections",
  },
  {
    title: "Pairly.chat Launches Premium & Pro Plans",
    date: "October 2025",
    image:
      "https://images.unsplash.com/photo-1581093588401-22e8c1f1c1ce?auto=format&fit=crop&w=1200&q=60",
    description:
      "With the introduction of new subscription tiers, Pairly.chat users can now enjoy unlimited chats, enhanced proposals, and priority matchmaking.",
    link: "#",
  },
  {
    title: "Pairly.chat Expands to 20+ Countries",
    date: "September 2025",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=60",
    description:
      "Pairly.chat continues its global growth, now available in more than 20 countries with local language support and improved matchmaking performance.",
    link: "#",
  },
];

const Press = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        py: { xs: 5, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Pairly Press & Media
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Official news, product announcements, and media highlights from the
            Pairly.chat team.
          </Typography>
        </Box>

        {/* Featured Article */}
        <Card
          elevation={4}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: 4,
            mb: 6,
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={pressArticles[0].image}
            alt={pressArticles[0].title}
            sx={{ width: { md: "50%" }, height: { xs: 240, md: "auto" } }}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: { xs: 3, md: 5 },
            }}
          >
            <Typography variant="overline" color="text.secondary">
              {pressArticles[0].date}
            </Typography>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {pressArticles[0].title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {pressArticles[0].description}
            </Typography>
            <Button
              component={Link}
              to={pressArticles[0].link}
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ alignSelf: "flex-start", borderRadius: 2, mt: 1 }}
            >
              Read More
            </Button>
          </CardContent>
        </Card>

        {/* Remaining Press Articles */}
        <Grid container spacing={4}>
          {pressArticles.slice(1).map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={article.image}
                  alt={article.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    {article.date}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {article.description}
                  </Typography>
                  <Button
                    size="small"
                    href={article.link}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ textTransform: "none", mt: "auto" }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Press;
