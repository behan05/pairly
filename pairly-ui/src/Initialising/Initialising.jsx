import { Box } from '@/MUI/MuiComponents';

function Initialising() {
  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#000'
    }}>
      <Box
        sx={{
          display: 'inline-block',
          width: 48,
          height: 48,
          borderWidth: '3px 2px 3px 2px',
          borderStyle: 'solid dotted solid dotted',
          borderColor: '#de3500 rgba(255,255,255,0.3) #fff rgba(151,107,93,0.3)',
          borderRadius: '50%',
          animation: 'rotate 1s linear infinite',
          position: 'relative',
          '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            border: '10px solid transparent',
            borderBottomColor: '#fff',
          },
          '&:before': {
            transform: 'translate(-10px,19px) rotate(-35deg)',
          },
          '&:after': {
            borderColor: '#de3500 transparent transparent transparent',
            transform: 'translate(32px,3px) rotate(-35deg)',
          },
        }}
      >
        <style>
          {`
          @keyframes rotate {
            100% { transform: rotate(360deg); }
          }
        `}
        </style>
      </Box>
    </Box>
  );
}

export default Initialising;
