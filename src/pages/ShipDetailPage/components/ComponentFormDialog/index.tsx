import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Dialog, Button, FormField } from '../../../../components';
import type { ComponentFormDialogProps, ComponentFormData } from '../../types';

const ComponentFormDialog: React.FC<ComponentFormDialogProps> = ({
  open,
  editingComponent,
  onClose,
  onSubmit
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ComponentFormData>();

  useEffect(() => {
    if (editingComponent) {
      reset({
        name: editingComponent.name,
        serialNumber: editingComponent.serialNumber,
        installDate: editingComponent.installDate,
        lastMaintenanceDate: editingComponent.lastMaintenanceDate,
        status: editingComponent.status,
        description: editingComponent.description || ''
      });
    } else {
      reset({
        name: '',
        serialNumber: '',
        installDate: new Date().toISOString().split('T')[0],
        lastMaintenanceDate: new Date().toISOString().split('T')[0],
        status: 'Good',
        description: ''
      });
    }
  }, [editingComponent, reset]);

  const handleFormSubmit = (data: ComponentFormData) => {
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
      title={editingComponent ? 'Edit Component' : 'Add New Component'}
      maxWidth="md"
    >
      <Box component="form" sx={{ mt: 2 }}>
        <FormField
          label="Component Name"
          error={errors.name?.message}
          required
        >
          <input
            {...register('name', { required: 'Component name is required' })}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.name ? '#dc2626' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </FormField>

        <FormField
          label="Serial Number"
          error={errors.serialNumber?.message}
          required
        >
          <input
            {...register('serialNumber', { required: 'Serial number is required' })}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.serialNumber ? '#dc2626' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </FormField>

        <FormField
          label="Install Date"
          error={errors.installDate?.message}
          required
        >
          <input
            type="date"
            {...register('installDate', { required: 'Install date is required' })}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.installDate ? '#dc2626' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </FormField>

        <FormField
          label="Last Maintenance Date"
          error={errors.lastMaintenanceDate?.message}
          required
        >
          <input
            type="date"
            {...register('lastMaintenanceDate', { required: 'Last maintenance date is required' })}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.lastMaintenanceDate ? '#dc2626' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </FormField>

        <FormField
          label="Status"
          error={errors.status?.message}
          required
        >
          <select
            {...register('status', { required: 'Status is required' })}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.status ? '#dc2626' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
            }}
          >
            <option value="Good">Good</option>
            <option value="Needs Maintenance">Needs Maintenance</option>
            <option value="Critical">Critical</option>
          </select>
        </FormField>

        <FormField
          label="Description"
          error={errors.description?.message}
        >
          <textarea
            {...register('description')}
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.description ? '#dc2626' : '#d1d5db'}`,
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </FormField>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">
          {editingComponent ? 'Update' : 'Add'} Component
        </Button>
      </Box>
    </Dialog>
  );
};

export default ComponentFormDialog;
