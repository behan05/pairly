import { Box, useTheme } from '@/MUI/MuiComponents';

function Loading({ sx = {} }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                height: '100dvh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: '#000',
                ...sx
            }}
        >
            {/* Loader bar */}
            <Box
                sx={{
                    width: 100,
                    height: 3,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: `linear-gradient(90deg,
                     ${theme.palette.primary.dark} 20%,
                      ${theme.palette.success.light},
                      ${theme.palette.secondary.dark}) 100%`
                    ,
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        width: 60,
                        height: 3,
                        backgroundColor: 'rgb(107, 27, 255)',
                        borderRadius: '20px',
                        position: 'absolute',
                        marginLeft: '-60px',
                        animation: 'go 1s linear infinite',
                    }}
                />
                <style>
                    {`
            @keyframes go {
              from { margin-left: -100px; width: 80px; }
              to { margin-left: 110px; width: 30px; }
            }
          `}
                </style>
            </Box>

            {/* Loading text */}
            <Box
                sx={{
                    width: 100,
                    height: 30,
                    textAlign: 'center',
                    marginTop: 2,
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 500,
                    position: 'relative',
                }}
            >
                <Box className="loading-text"></Box>
                <style>
                    {`
            @keyframes text {
              0% { content: "Loading chat"; }
              30% { content: "Loading chat."; }
              60% { content: "Loading chat.."; }
              100% { content: "Loading chat..."; }
            }
            .loading-text::before {
              content: "Loading chat";
              animation: text 1s infinite;
              color: white;
            }
          `}
                </style>
            </Box>
        </Box>
    );
}

export default Loading;
