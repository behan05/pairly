import { Box } from '@/MUI/MuiComponents';

const ChatBgStyle = ({ mode = 'dark' }) => {
    // mode === "dark"
    //                     ? theme.palette.text.primary
    //                     : theme.palette.text.secondary,

    return (
        <Box
            sx={{
                zIndex: -2,
                position: "absolute",
                overflow: "hidden",
                backgroundImage: `url("https://cdn.pixabay.com/photo/2018/08/23/07/35/new-year-background-3625405_1280.jpg")`,
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