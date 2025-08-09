import { useState, useEffect } from 'react';
import { Button, useTheme } from '@/MUI/MuiComponents';
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
        <Button
            variant='outlined'
            startIcon={<GetAppIcon sx={{ color: 'success.main' }} />}
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                padding: '10px 20px',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                background: theme.palette.background.paper,
                zIndex: 1000,
            }}
            onClick={handleInstallClick}
            aria-label="Install Connect App"
        >
            Install App
        </Button>
    );
}
