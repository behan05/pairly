import { Button, useMediaQuery, useTheme, Tooltip, IconButton } from '@/MUI/MuiComponents';
import { useSelector } from 'react-redux';
import SkipNextIcon from '@mui/icons-material/SkipNext';

function NextButton({ onClick, disabled = false }) {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));

  const {
    connected: isConnected,
  } = useSelector((state) => state.randomChat);

  return (
    <>
      {isLg && isConnected ? (
        <Tooltip title='Next Chat'>
          <IconButton
            onClick={onClick}
            disabled={disabled}
            sx={theme => ({
              bgcolor: theme.palette.background.paper,
            })}
          >
            <SkipNextIcon sx={{ color: 'info.main', fontSize: '0.8em' }} />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          variant="outlined"
          onClick={onClick}
          disabled={disabled}
          startIcon={<SkipNextIcon sx={{ color: 'info.main' }} />}
          sx={(theme) => ({
            fontSize: '0.95rem',
            borderRadius: 0.5,
            padding: '6px 16px',
            textTransform: 'none',
            fontWeight: 600,

            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.info.main,

            transition: 'all 0.3s ease',

            background:
              theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : theme.palette.background.default,

            '&:hover': {
              transform: 'translateY(-2px)',
            },

            '&:active': {
              transform: 'scale(0.95)',
            },

            '&.Mui-disabled': {
              opacity: 0.6,
            },
          })}
        >
          Next
        </Button>
      )}
    </>
  );
}

export default NextButton;
