import { useState, useEffect } from 'react';
import { Button, Tooltip, useTheme } from '../MUI/MuiComponents';
import { GetAppIcon } from '@/MUI/MuiIcons';
import { useSelector } from 'react-redux';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const { connected } = useSelector(state => state.randomChat);
    const activeChat = useSelector(state => state.privateChat.activeChat);
    
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
                    bottom: 115,
                    right: 40,
                    display: connected || activeChat && 'none',
                    background: 'transparent',
                    backdropFilter: 'blur(14px)',
                    color: theme.palette.text.secondary,
                    borderColor: theme.palette.divider,
                    transition: 'all 0.3s ease',
                    '&:focus': {
                        outline: 'none',
                        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
                    },
                    '&:hover': {
                        background: theme.palette.action.hover,
                        color: theme.palette.text.primary,
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
