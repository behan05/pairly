import { Player } from "@lottiefiles/react-lottie-player";
import landingLottieJson from "@/assets/lottie/RandomLandingPageMessage";
import { useMediaQuery, useTheme, Box } from "@/MUI/MuiComponents";

const RandomLandingLottie = () => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const size = isXs ? 180 : isMd ? 220 : 300;

    return (
        <Box
            sx={{
                width: `${size}px`,
                height: `${size}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                overflow: "hidden",
            }}
        >
            <Player
                autoplay
                loop
                src={landingLottieJson}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                }}
                renderer="svg"
            />
        </Box>
    );
};
export default RandomLandingLottie;