import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { Dialog, Button } from '../../../../components';
import type { ClearConfirmDialogProps } from '../../types';

const ClearConfirmDialog: React.FC<ClearConfirmDialogProps> = ({
  open,
  notificationCount,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Clear All Notifications"
      maxWidth="sm"
    >
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        <Typography>
          Are you sure you want to delete all notifications? This will permanently remove all {notificationCount} notifications.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Clear All
        </Button>
      </Box>
    </Dialog>
  );
};

export default ClearConfirmDialog;
