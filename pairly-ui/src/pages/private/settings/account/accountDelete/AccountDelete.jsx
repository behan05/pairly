import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme
} from '@/MUI/MuiComponents';

import { DeleteIcon } from '@/MUI/MuiIcons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import BlurWrapper from '@/components/common/BlurWrapper';

import { SETTINGS_API } from '@/api/config';
import axios from 'axios';
import { logout } from '@/redux/slices/auth/authAction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AccountDelete() {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${SETTINGS_API}/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(response.data.message);
      setTimeout(() => {
        setIsDeleting(false);
        setOpenDialog(false);
        dispatch(logout());
        navigator('/login', { replace: true });
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <Box component={'section'}>

      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/pairly/settings/account'} text={'Delete Account'} />
      </Stack>

      <Box
        component='section'
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 2
        })}
      >
        <Typography textAlign="center" variant="h5" fontWeight={600} mb={1}>
          Delete <span style={{ color: theme.palette.error.main }}>Account</span>
        </Typography>

        <Typography variant="body2" textAlign="center" color="text.secondary" mb={4}>
          This action is permanent and cannot be undone. All your data including chats and profile
          will be removed.
        </Typography>

        <Stack alignItems="center">
          <Button
            variant="contained"
            color="error"
            endIcon={<DeleteIcon />}
            onClick={() => setOpenDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete My Account'}
          </Button>
        </Stack>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            disabled={isDeleting}
            sx={{ color: 'text.primary' }}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={isDeleting}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AccountDelete;
