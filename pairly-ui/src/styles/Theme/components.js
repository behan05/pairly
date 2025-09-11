export const components = {
  MuiTooltip: {
    defaultProps: {
      arrow: true,
      placement: 'top'
    },
    styleOverrides: {
      tooltip: {
        backgroundColor: 'rgba(5,18,34,0.85)', // slightly tinted background
        color: '#f5f5f5',
        fontSize: '0.85rem',
        fontWeight: 500,
        borderRadius: 6,
        padding: '6px 12px',
        boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        maxWidth: 220,
        transition: 'all 0.2s ease-in-out'
      },
      arrow: {
        color: 'rgba(5,18,34,0.85)'
      }
    }
  },

  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: '8px',
        fontWeight: 600,
        padding: '8px 20px',
        boxShadow: 'none'
      },
      containedPrimary: {
        backgroundColor: '#1e88e5',
        '&:hover': {
          backgroundColor: '#1565c0'
        }
      }
    },
    defaultProps: {
      disableElevation: true
    }
  },

  MuiSlider: {
    styleOverrides: {
      root: {
        height: 8
      },
      thumb: {
        width: 20,
        height: 20,
        backgroundColor: '#fff',
        border: '2px dotted currentColor',
        '&:hover': {
          boxShadow: 'inset 0px 0px 0px 8px rgba(25, 118, 210, 0.16)'
        },
        '&.Mui-active': {
          boxShadow: ' inset 0px 0px 0px 14px rgba(25, 118, 210, 0.16)'
        }
      },
      track: {
        height: 8,
        borderRadius: 4
      },
      rail: {
        height: 8,
        borderRadius: 4,
        opacity: 0.3
      },
      valueLabel: {
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: '#0b5163ff',
        borderRadius: '4px',
        padding: '2px 6px',
        transform: 'translateY(-100%)',
        transition: 'opacity 0.2s ease',
        opacity: 0, // hide by default
        '&.MuiSlider-valueLabelOpen': {
          opacity: 1 // show when active (hover or drag)
        },
        '& *': {
          background: 'transparent',
          color: '#fff'
        }
      }
    }
  }
};
