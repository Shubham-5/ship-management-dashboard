import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { Dialog, Button } from '../../../../components';
import type { DeleteConfirmDialogProps } from '../../types';

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  jobToDelete,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Confirm Delete"
      maxWidth="sm"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Delete
          </Button>
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Alert severity="warning">
          This action cannot be undone.
        </Alert>
        <Typography>
          Are you sure you want to delete this maintenance job?
        </Typography>
        {jobToDelete && (
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Job: {jobToDelete.type} - {jobToDelete.priority} priority
          </Typography>
        )}
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
