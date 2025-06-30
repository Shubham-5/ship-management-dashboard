import React from 'react';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Dialog, Button } from '../../../../components';
import { useShipStore } from '../../../../store/shipStore';
import type { ReportGeneratorDialogProps, ReportFormData } from '../../types';

const ReportGeneratorDialog: React.FC<ReportGeneratorDialogProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const { ships } = useShipStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReportFormData>({
    defaultValues: {
      type: 'fleet_status',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      shipIds: [],
      includeDetails: false
    }
  });

  const handleFormSubmit = (data: ReportFormData) => {
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
      title="Generate New Report"
      maxWidth="md"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">
            Generate Report
          </Button>
        </Box>
      }
    >
      <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          select
          label="Report Type"
          margin="normal"
          {...register('type', { required: 'Report type is required' })}
          error={!!errors.type}
          helperText={errors.type?.message}
        >
          <MenuItem value="fleet_status">Fleet Status</MenuItem>
          <MenuItem value="maintenance_summary">Maintenance Summary</MenuItem>
          <MenuItem value="performance_analysis">Performance Analysis</MenuItem>
          <MenuItem value="cost_analysis">Cost Analysis</MenuItem>
        </TextField>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register('startDate', { required: 'Start date is required' })}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register('endDate', { required: 'End date is required' })}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
          />
        </Box>

        <FormControl fullWidth margin="normal">
          <InputLabel>Ships (Leave empty for all)</InputLabel>
          <Select
            multiple
            {...register('shipIds')}
            renderValue={(selected) => 
              ships.filter(ship => (selected as string[]).includes(ship.id))
                .map(ship => ship.name).join(', ')
            }
          >
            {ships.map((ship) => (
              <MenuItem key={ship.id} value={ship.id}>
                {ship.name} ({ship.imo})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ 
          mt: 2, 
          p: 2,
          backgroundColor: '#f8fafc',
          borderRadius: 1,
          border: '1px solid #e2e8f0',
        }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
          }}>
            <input
              type="checkbox"
              {...register('includeDetails')}
              style={{ 
                marginRight: 12,
                width: 16,
                height: 16,
                accentColor: '#3b82f6',
              }}
            />
            Include detailed data in report
          </label>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ReportGeneratorDialog;
