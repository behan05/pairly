import { Box, useTheme, useMediaQuery } from '@/MUI/MuiComponents';
import { useSelector } from 'react-redux'
import img1 from '@/assets/erotic_chat_bg/img1.jpg';
import img2 from '@/assets/erotic_chat_bg/img2.jpg';
import img3 from '@/assets/erotic_chat_bg/img3.jpg';
import img4 from '@/assets/erotic_chat_bg/img4.jpg';
import img5 from '@/assets/erotic_chat_bg/img5.jpg';
import img6 from '@/assets/erotic_chat_bg/img6.jpg';
import img7 from '@/assets/erotic_chat_bg/img7.jpg';
import smallScreenImg1 from '@/assets/erotic_chat_bg/smallScreenImg1.jpg'
import smallScreenImg2 from '@/assets/erotic_chat_bg/smallScreenImg2.jpg'
import smallScreenImg3 from '@/assets/erotic_chat_bg/smallScreenImg3.jpg'
import smallScreenImg4 from '@/assets/erotic_chat_bg/smallScreenImg4.jpg'
import smallScreenImg5 from '@/assets/erotic_chat_bg/smallScreenImg5.jpg'
import smallScreenImg6 from '@/assets/erotic_chat_bg/smallScreenImg6.jpg'
import smallScreenImg7 from '@/assets/erotic_chat_bg/smallScreenImg7.jpg'
import darkBgImg from '@/assets/images/ChatBoxBgImg/darkTheme.png';
import lightBgImg from '@/assets/images/ChatBoxBgImg/lightTheme.png';

const ChatBgStyle = ({ mode = 'dark' }) => {
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down('sm'));

    // Work active tab only "Erotic mode"
    const isEroticActive = useSelector(state => state.theme.eroticMode);
    const eroticCollectionBigScreen = [img1, img2, img3, img4, img5, img6, img7,]
    const eroticCollectionSmallScreen = [
        smallScreenImg1,
        smallScreenImg2,
        smallScreenImg3,
        smallScreenImg4,
        smallScreenImg5,
        smallScreenImg6,
        smallScreenImg7
    ]

    const themeMode = mode === 'dark'
        ? darkBgImg
        : lightBgImg

    return (
        <Box
            sx={{
                zIndex: -2,
                position: "absolute",
                overflow: "hidden",
                backgroundImage: isEroticActive
                    ? `url("${isSM ? eroticCollectionSmallScreen[Math.floor(Math.random() * eroticCollectionSmallScreen.length)]
                        : eroticCollectionBigScreen[Math.floor(Math.random() * eroticCollectionBigScreen.length)]}")`
                    : `url("${themeMode}")`,
                objectFit: 'cover',
                backgroundPosition: '50% 50%',
                backgroundSize: 'cover',
                height: '100%',
                width: '100%',
            }}
        >
            <Box sx={{
                zIndex: -1,
                position: "absolute",
                overflow: "hidden",
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(6px)',
                opacity: 0.9,
                height: '100%',
                width: '100%',
            }} />
        </Box>
    );
};

export default ChatBgStyle