import { useState, useEffect } from 'react';
import { Button, Tooltip, useTheme } from '../MUI/MuiComponents';
import { GetAppIcon } from '@/MUI/MuiIcons';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        function handleBeforeInstallPrompt(e) {
            e.preventDefault();
            setDeferredPrompt(e);
            setVisible(true);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            setDeferredPrompt(null);
            setVisible(false);
        });
    };

    if (!visible) return null;

    return (
        <Tooltip title={'Add Connect to your device for a faster, app-like experience'}>
            <Button
                variant='outlined'
                startIcon={<GetAppIcon sx={{ color: 'success.main' }} />}
                sx={{
                    position: 'fixed',
                    bottom: 110,
                    right: 10,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1 },
                    background: 'transparent',
                    backdropFilter: 'blur(14px)',
                    border: 'none',
                    borderRadius: 10,
                    border: `1px solid ${theme.palette.divider}`,
                    textTransform: 'none',
                    color: 'primary.contrastText',
                    letterSpacing: 0.2,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)'
                    },
                    zIndex: 1000,
                }}
                onClick={handleInstallClick}
                aria-label="Install Connect App"
            >
                Install App
            </Button>
        </Tooltip>
    );
}
