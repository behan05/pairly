import { Box } from '@/MUI/MuiComponents';

import { useSelector } from 'react-redux'
import img1 from '@/assets/erotic_chat_bg/img1.jpg';
import img2 from '@/assets/erotic_chat_bg/img2.jpg';
import img3 from '@/assets/erotic_chat_bg/img3.jpg';
import img4 from '@/assets/erotic_chat_bg/img4.jpg';
import img5 from '@/assets/erotic_chat_bg/img5.jpg';
import img6 from '@/assets/erotic_chat_bg/img6.jpg';
import img7 from '@/assets/erotic_chat_bg/img7.jpg';
import darkBgImg from '../../../../assets/images/ChatBoxBgImg/darkTheme.png';
import lightBgImg from '../../../../assets/images/ChatBoxBgImg/lightTheme.png';


const ChatBgStyle = ({ mode = 'dark' }) => {
    // mode === "dark"
    //? theme.palette.text.primary
    //: theme.palette.text.secondary,

    // Work active tab only "Erotic mode"
    const isEroticActive = useSelector(state => state.theme.eroticMode);
    const eroticCollection = [img1, img2, img3, img4, img5, img6, img7,]

    const theme = mode === 'dark'
        ? darkBgImg
        : lightBgImg

    return (
        <Box
            sx={{
                zIndex: -2,
                position: "absolute",
                overflow: "hidden",
                backgroundImage: isEroticActive
                    ? `url("${eroticCollection[Math.floor(Math.random() * eroticCollection.length)]}")`
                    : `url("${theme}")`,
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
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(6px)',
                height: '100%',
                width: '100%',
            }}>

            </Box>
        </Box>
    );
};

export default ChatBgStyle