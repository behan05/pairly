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

const Press = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        // minHeight: 'calc(var(--vh, 1vh) * 100)',
        py: { xs: 5, md: 8 },
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{ fontWeight: 700, mb: 6 }}
      >
        Pairly Press Coming Soon..
      </Typography>
    </Box>
  );
};

export default Press;
