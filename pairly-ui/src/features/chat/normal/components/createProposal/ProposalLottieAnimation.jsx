import { Player } from '@lottiefiles/react-lottie-player';
import proposalLottie from '@/assets/lottie/heartbeatForProposal.json';
import { useTheme, useMediaQuery } from '@/MUI/MuiComponents';

function ProposalLottieAnimation() {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const maxSize = isXs ? '80vw' : isMd ? '60vw' : '50vw';
    const maxHeight = isXs ? '50vh' : isMd ? '55vh' : '60vh';

    return (
        <Player
            autoplay
            loop
            src={proposalLottie}
            style={{ width: '100%', height: '100%', maxHeight , maxSize}}
        />

    )
}

export default ProposalLottieAnimation;