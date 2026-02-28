import {
    Box,
    IconButton,
    TextField,
    useTheme
} from '@/MUI/MuiComponents';
import {
    SearchIcon
} from '@/MUI/MuiIcons';

function SearchInputBox({
    placeholder,
    handleChange,
    value,
    onClick,
    sx = {}
}) {
    const theme = useTheme();
    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "stretch",
                borderRadius: 0.2,
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                transition: "all .25s cubic-bezier(.4,.0,.2,1)",

                "&:focus-within": {
                    borderColor: theme.palette.success.main,
                    boxShadow: `
                0 0 0 1px ${theme.palette.success.main},
                0 8px 24px ${theme.palette.success.main}22
              `,
                },
                // thin top accent line (theme driven)
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "2px",
                    background: `linear-gradient(
                   90deg,
                   transparent,
                   ${theme.palette.success.main},
                   transparent
                  )`,
                    opacity: 0.6,
                },
                ...sx
            }}
        >
            {!onClick && (
                <IconButton
                    onClick={() => onClick()}
                    sx={{
                        width: 42,
                        borderRadius: 0,
                        color: theme.palette.text.secondary,
                    }}
                >
                    <SearchIcon sx={{ fontSize: 20 }} />
                </IconButton>
            )}

            <TextField
                size="small"
                fullWidth
                placeholder={placeholder}
                value={value}
                name="userId"
                onChange={handleChange}
                autoComplete="off"
                variant="outlined"
                sx={{
                    "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: 0,
                        backgroundColor: "transparent",

                        "& fieldset": {
                            border: "none",
                        },
                    },

                    "& input": {
                        px: 1.2,
                        letterSpacing: 0.4,
                    },
                }}
            />
            {onClick && (
                <IconButton
                    onClick={() => onClick()}
                    sx={{
                        width: 42,
                        borderRadius: 0,
                        color: theme.palette.text.secondary,
                        transition: "all .25s",

                        "&:hover": {
                            color: theme.palette.success.main,
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}
                >
                    <SearchIcon sx={{ fontSize: 20 }} />
                </IconButton>
            )}

        </Box>
    )
}

export default SearchInputBox