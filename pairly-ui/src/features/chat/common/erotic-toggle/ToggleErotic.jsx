import { useState } from 'react';
import {
    Stack,
    Box,
    FormControlLabel,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    useTheme,
    useMediaQuery,
    Divider,
    Button,
} from '@/MUI/MuiComponents';
import { useDispatch } from 'react-redux'

// Work active tab only "Erotic mode"
import { toggleEroticMode } from '@/redux/slices/theme/themeSlice';
function ToggleErotic() {
    const theme = useTheme();
    const isSm = useMediaQuery('(max-width:416px)');
    const dispatch = useDispatch();

    // Erotic mode state from localStorage
    const [isEroticModeEnabled, setIsEroticModeEnabled] = useState(false);
    const [openModel, setOpenModel] = useState(false);

    // This work temporary until tab is open
    const activeEroticMode = () => {
        setIsEroticModeEnabled((prev) => !prev);
        dispatch(toggleEroticMode());
    };

    const handleAction = () => {
        if (!isEroticModeEnabled) {
            setOpenModel(true);
        } else {
            activeEroticMode();
        }
    };

    return (
        <>
            <Stack
                sx={{
                    px: 0.5,
                    py: 0.2,
                    backdropFilter: "blur(4px)",
                    background: "rgba(20,20,40,0.18)",
                    borderRadius: "6px",
                    border: "1px solid rgba(0,255,255,0.08)",
                    height: 24,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <FormControlLabel
                    label="18+"
                    sx={{
                        m: 0,
                        gap: 0.4,
                        "& .MuiFormControlLabel-label": {
                            fontSize: "9px",
                            fontWeight: 600,
                            letterSpacing: "0.3px",
                            background: "linear-gradient(90deg,#00f0ff,#ff00cc)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        },
                    }}
                    control={
                        <Switch
                            size="small"
                            checked={isEroticModeEnabled}
                            onClick={handleAction}
                            sx={{
                                width: 32,
                                height: 16,
                                padding: 0,
                                "& .MuiSwitch-switchBase": {
                                    padding: "1.5px",
                                    "&.Mui-checked": {
                                        transform: "translateX(15px)",
                                        "& + .MuiSwitch-track": {
                                            background:
                                                "linear-gradient(90deg,#ff00cc,#3333ff)",
                                            boxShadow:
                                                "0 0 4px #ff00cc, 0 0 6px #3333ff",
                                        },
                                    },
                                },
                                "& .MuiSwitch-thumb": {
                                    width: 13,
                                    height: 13,
                                    background:
                                        "radial-gradient(circle at 30% 30%, #ffffff, #dddddd)",
                                    boxShadow: "0 0 4px #00f0ff",
                                },
                                "& .MuiSwitch-track": {
                                    borderRadius: 20,
                                    backgroundColor: "#1a1a2e",
                                    opacity: 1,
                                },
                            }}
                        />
                    }
                />
            </Stack>

            {/* Agree model */}
            <Dialog
                open={openModel}
                onClose={() => setOpenModel(false)}
                PaperProps={{
                    sx: {
                        position: 'relative',
                        borderRadius: 0.2,
                        p: '15px 15px 0 15px',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        background: theme.palette.background.paper,

                        // Bottom accent line
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: 2,
                            background: `linear-gradient(90deg, transparent, ${theme.palette.success.main}, transparent)`,
                            opacity: 0.6,
                            transition: 'all 0.25s ease',
                        },

                        // Top accent line
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: 2,
                            background: `linear-gradient(90deg, transparent, ${theme.palette.success.main}, transparent)`,
                            opacity: 0.6,
                            transition: 'all 0.25s ease',
                        },

                        // Hover effect
                        '&:hover::after': {
                            background: `linear-gradient(90deg, transparent, ${theme.palette.success.main}, transparent)`,
                            opacity: 0.9,
                        },

                        '&:hover::before': {
                            background: `linear-gradient(90deg, transparent, ${theme.palette.success.main}, transparent)`,
                            opacity: 0.9,
                        },
                    },
                }}
            >
                <DialogTitle
                    variant='h6'
                    sx={{
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        fontWeight: 600,
                        letterSpacing: "0.3px",
                        background: "linear-gradient(90deg,#00f0ff,#ff00cc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                    Temporary 18+ Mode
                </DialogTitle>

                <DialogContent>
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 2,
                            fontSize: "14px",
                            fontWeight: 600,
                            textAlign: 'center'
                        }}
                    >
                        By enabling <strong>Mature (18+) Mode</strong>, you confirm that:
                    </Typography>

                    <Divider
                        sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            my: 2
                        }} />

                    <Box
                        component="ul"
                        sx={{
                            pl: 3,
                            mb: 2,
                            listStyleType: 'circle',
                        }}
                    >
                        <Typography
                            component="li"
                            variant="body2"
                            sx={{
                                mb: 1,
                                fontSize: "13px",
                                fontWeight: 500,
                                letterSpacing: "0.25px",
                            }}
                        >
                            You are <strong>18 years of age or older</strong>.
                        </Typography>
                        <Typography
                            component="li"
                            variant="body2"
                            sx={{
                                mb: 1,
                                fontSize: "13px",
                                fontWeight: 500,
                                letterSpacing: "0.25px",
                            }}
                        >
                            You are comfortable viewing mature-themed backgrounds.
                        </Typography>
                        <Typography
                            component="li"
                            variant="body2"
                            sx={{
                                mb: 1,
                                fontSize: "13px",
                                fontWeight: 500,
                                letterSpacing: "0.25px",
                            }}
                        >
                            You understand this may include suggestive or adult visuals.
                        </Typography>
                        <Typography
                            component="li"
                            variant="body2"
                            sx={{
                                fontSize: "13px",
                                fontWeight: 500,
                                letterSpacing: "0.25px",
                            }}
                        >
                            This mode is temporary and will automatically reset to the normal theme once the chat ends.
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2, border: `1px solid ${theme.palette.divider}` }} />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            mt: 1,
                            fontSize: "13px",
                            fontStyle: "italic",
                            textAlign: 'center'
                        }}
                    >
                        This feature is optional and only changes your chat background temporarily
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: isSm ? 'column' : 'row',
                        gap: 1,
                        mt: 1,
                    }}
                >
                    {/* Cancel Button */}
                    <Button
                        variant="outlined"
                        onClick={() => setOpenModel(false)}
                        sx={{
                            flex: 1,
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#aaa",
                            backdropFilter: "blur(6px)",
                            background: "rgba(255,255,255,0.05)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                background: "rgba(255,255,255,0.08)",
                                borderColor: "#00f0ff",
                                color: "#00f0ff",
                                boxShadow: "0 0 8px rgba(0,240,255,0.4)",
                            },
                        }}
                    >
                        Cancel
                    </Button>

                    {/* Confirm Button */}
                    <Button
                        variant="contained"
                        onClick={() => {
                            activeEroticMode();
                            setOpenModel(false);
                        }}
                        sx={{
                            flex: 1,
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 700,
                            letterSpacing: "0.6px",
                            background: "linear-gradient(90deg,#ff00cc,#3333ff)",
                            boxShadow: "0 0 8px #ff00cc, 0 0 12px #3333ff",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 0 12px #ff00cc, 0 0 18px #3333ff",
                                background: "linear-gradient(90deg,#ff33dd,#5555ff)",
                            },
                            "&:active": {
                                transform: "scale(0.98)",
                            },
                        }}
                    >
                        I Confirm (18+)
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ToggleErotic