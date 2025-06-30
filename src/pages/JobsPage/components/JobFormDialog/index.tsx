import React from 'react';
import { Box, MenuItem, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Dialog, Button } from '../../../../components';
import { useShipStore } from '../../../../store/shipStore';
import type { JobFormDialogProps, JobFormData } from '../../types';

const JobFormDialog: React.FC<JobFormDialogProps> = ({
  open,
  editingJob,
  onClose,
  onSubmit
}) => {
  const { ships, components } = useShipStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JobFormData>();

  React.useEffect(() => {
    if (editingJob) {
      reset({
        componentId: editingJob.componentId,
        type: editingJob.type,
        priority: editingJob.priority,
        status: editingJob.status,
        assignedEngineerId: editingJob.assignedEngineerId,
        scheduledDate: editingJob.scheduledDate,
        description: editingJob.description || '',
        notes: editingJob.notes || ''
      });
    } else {
      reset({
        componentId: '',
        type: 'Inspection',
        priority: 'Medium',
        status: 'Open',
        assignedEngineerId: '3',
        scheduledDate: new Date().toISOString().split('T')[0],
        description: '',
        notes: ''
      });
    }
  }, [editingJob, reset, open]);

  const handleFormSubmit = (data: JobFormData) => {
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
      title={editingJob ? 'Edit Maintenance Job' : 'Create New Maintenance Job'}
      maxWidth="md"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">
            {editingJob ? 'Update' : 'Create'} Job
          </Button>
        </Box>
      }
    >
      <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          select
          label="Component"
          margin="normal"
          {...register('componentId', { required: 'Component is required' })}
          error={!!errors.componentId}
          helperText={errors.componentId?.message}
        >
          {components.map((component) => {
            const ship = ships.find(s => s.id === component.shipId);
            return (
              <MenuItem key={component.id} value={component.id}>
                {component.name} ({ship?.name})
              </MenuItem>
            );
          })}
        </TextField>
        
        <TextField
          fullWidth
          select
          label="Job Type"
          margin="normal"
          {...register('type', { required: 'Job type is required' })}
          error={!!errors.type}
          helperText={errors.type?.message}
        >
          <MenuItem value="Inspection">Inspection</MenuItem>
          <MenuItem value="Repair">Repair</MenuItem>
          <MenuItem value="Replacement">Replacement</MenuItem>
          <MenuItem value="Preventive">Preventive</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Priority"
          margin="normal"
          {...register('priority', { required: 'Priority is required' })}
          error={!!errors.priority}
          helperText={errors.priority?.message}
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Critical">Critical</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Status"
          margin="normal"
          {...register('status', { required: 'Status is required' })}
          error={!!errors.status}
          helperText={errors.status?.message}
        >
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Assigned Engineer"
          margin="normal"
          {...register('assignedEngineerId', { required: 'Engineer assignment is required' })}
          error={!!errors.assignedEngineerId}
          helperText={errors.assignedEngineerId?.message}
        >
          <MenuItem value="3">Engineer User</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Scheduled Date"
          type="date"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          {...register('scheduledDate', { required: 'Scheduled date is required' })}
          error={!!errors.scheduledDate}
          helperText={errors.scheduledDate?.message}
        />

        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={3}
          {...register('description')}
        />

        <TextField
          fullWidth
          label="Notes"
          margin="normal"
          multiline
          rows={2}
          {...register('notes')}
        />
      </Box>
    </Dialog>
  );
};

export default JobFormDialog;
