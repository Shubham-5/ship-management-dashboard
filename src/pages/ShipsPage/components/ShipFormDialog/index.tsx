import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Dialog, Button } from '../../../../components';
import type { ShipFormDialogProps, ShipFormData } from '../../types';

const ShipFormDialog: React.FC<ShipFormDialogProps> = ({
  open,
  editingShip,
  onClose,
  onSubmit
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ShipFormData>();

  React.useEffect(() => {
    if (editingShip) {
      reset({
        name: editingShip.name,
        imo: editingShip.imo,
        flag: editingShip.flag,
        status: editingShip.status,
        description: editingShip.description || '',
        yearBuilt: editingShip.yearBuilt || undefined,
        owner: editingShip.owner || ''
      });
    } else {
      reset({
        name: '',
        imo: '',
        flag: '',
        status: 'Active',
        description: '',
        yearBuilt: undefined,
        owner: ''
      });
    }
  }, [editingShip, reset, open]);

  const handleFormSubmit = (data: ShipFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={editingShip ? 'Edit Ship' : 'Add New Ship'}
      maxWidth="md"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">
            {editingShip ? 'Update' : 'Add'} Ship
          </Button>
        </Box>
      }
    >
      <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Ship Name"
          margin="normal"
          {...register('name', { required: 'Ship name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          fullWidth
          label="IMO Number"
          margin="normal"
          {...register('imo', { required: 'IMO number is required' })}
          error={!!errors.imo}
          helperText={errors.imo?.message}
        />
        <TextField
          fullWidth
          label="Flag"
          margin="normal"
          {...register('flag', { required: 'Flag is required' })}
          error={!!errors.flag}
          helperText={errors.flag?.message}
        />
        <TextField
          fullWidth
          select
          label="Status"
          margin="normal"
          defaultValue="Active"
          {...register('status', { required: 'Status is required' })}
          error={!!errors.status}
          helperText={errors.status?.message}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Year Built"
          type="number"
          margin="normal"
          {...register('yearBuilt', { 
            min: { value: 1900, message: 'Year must be after 1900' },
            max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
          })}
          error={!!errors.yearBuilt}
          helperText={errors.yearBuilt?.message}
        />
        <TextField
          fullWidth
          label="Owner"
          margin="normal"
          {...register('owner')}
        />
        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={3}
          {...register('description')}
        />
      </Box>
    </Dialog>
  );
};

export default ShipFormDialog;
