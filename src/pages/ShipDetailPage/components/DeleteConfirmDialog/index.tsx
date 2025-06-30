import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { Dialog, Button } from '../../../../components';
import type { DeleteConfirmDialogProps } from '../../types';

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  componentToDelete,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Confirm Delete"
      maxWidth="sm"
    >
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone. All associated maintenance jobs will also be deleted.
        </Alert>
        <Typography>
          Are you sure you want to delete the component "{componentToDelete?.name}"?
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
