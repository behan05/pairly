import React from 'react';
import { Button } from '@/MUI/MuiComponents';
import BoltIcon from '@mui/icons-material/Bolt';

function ConnectButton({ onClick, disabled = false }) {
    return (
        <Button
            variant="outlined"
            fullWidth
            startIcon={<BoltIcon sx={{ color: 'success.main' }} />}
            onClick={onClick}
            disabled={disabled}
            sx={{ width: 'fit-content', color: 'text.primary' }}
        >
            Connect
        </Button>
    );
}

export default ConnectButton;
