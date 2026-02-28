import { useState } from 'react';
import {
    Stack,
    FormControlLabel,
    Switch,
} from '@/MUI/MuiComponents';

import { useDispatch } from 'react-redux'

// Work active tab only "Erotic mode"
import { toggleEroticMode } from '@/redux/slices/theme/themeSlice';
function ToggleErotic() {
    const dispatch = useDispatch();

    // Erotic mode state from localStorage
    const [isEroticModeEnabled, setIsEroticModeEnabled] = useState(false);

    // This work temporary until tab is open
    const activeEroticMode = () => {
        setIsEroticModeEnabled((prev) => !prev)
        dispatch(toggleEroticMode())
    }

    return (

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
                        onClick={activeEroticMode}
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
    )
}

export default ToggleErotic