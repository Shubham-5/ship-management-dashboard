import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { Dialog, Button } from '../../../../components';
import type { ShipDeleteDialogProps } from '../../types';

const ShipDeleteDialog: React.FC<ShipDeleteDialogProps> = ({
  open,
  shipToDelete,
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
          This action cannot be undone. All associated components and maintenance jobs will also be deleted.
        </Alert>
        <Typography>
          Are you sure you want to delete the ship "{shipToDelete?.name}"?
        </Typography>
      </Box>
    </Dialog>
  );
};

export default ShipDeleteDialog;
