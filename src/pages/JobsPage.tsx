import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  FilterList
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useShipStore, type MaintenanceJob } from '../store/shipStore';

interface JobFormData {
  componentId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Preventive';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedEngineerId: string;
  scheduledDate: string;
  description?: string;
  notes?: string;
}

interface FilterState {
  shipId: string;
  status: string;
  priority: string;
}

const JobsPage: React.FC = () => {
  const { 
    jobs, 
    ships, 
    components, 
    addJob, 
    updateJob, 
    deleteJob, 
    initializeData 
  } = useShipStore();
  
  const [open, setOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<MaintenanceJob | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<MaintenanceJob | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    shipId: '',
    status: '',
    priority: ''
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<JobFormData>();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Filter jobs based on current filters
  const filteredJobs = jobs.filter(job => {
    if (filters.shipId && job.shipId !== filters.shipId) return false;
    if (filters.status && job.status !== filters.status) return false;
    if (filters.priority && job.priority !== filters.priority) return false;
    return true;
  });

  const handleOpenDialog = (job?: MaintenanceJob) => {
    if (job) {
      setEditingJob(job);
      reset({
        componentId: job.componentId,
        type: job.type,
        priority: job.priority,
        status: job.status,
        assignedEngineerId: job.assignedEngineerId,
        scheduledDate: job.scheduledDate,
        description: job.description || '',
        notes: job.notes || ''
      });
    } else {
      setEditingJob(null);
      reset({
        componentId: '',
        type: 'Inspection',
        priority: 'Medium',
        status: 'Open',
        assignedEngineerId: '3', // Default to engineer
        scheduledDate: new Date().toISOString().split('T')[0],
        description: '',
        notes: ''
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingJob(null);
    reset();
  };

  const onSubmit = (data: JobFormData) => {
    const component = components.find(c => c.id === data.componentId);
    if (component) {
      const jobData = {
        ...data,
        shipId: component.shipId
      };
      
      if (editingJob) {
        updateJob(editingJob.id, jobData);
      } else {
        addJob(jobData);
      }
      handleCloseDialog();
    }
  };

  const handleDeleteClick = (job: MaintenanceJob) => {
    setJobToDelete(job);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete.id);
      setDeleteConfirmOpen(false);
      setJobToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setJobToDelete(null);
  };

  const getStatusColor = (status: MaintenanceJob['status']) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Open': return 'warning';
      case 'Cancelled': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: MaintenanceJob['priority']) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  const getShipName = (shipId: string) => {
    const ship = ships.find(s => s.id === shipId);
    return ship?.name || 'Unknown Ship';
  };

  const getComponentName = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    return component?.name || 'Unknown Component';
  };

  const handleFilterChange = (field: keyof FilterState) => (event: { target: { value: string } }) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      shipId: '',
      status: '',
      priority: ''
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Maintenance Jobs</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create Job
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Ship</InputLabel>
              <Select
                value={filters.shipId}
                label="Ship"
                onChange={handleFilterChange('shipId')}
              >
                <MenuItem value="">All Ships</MenuItem>
                {ships.map((ship) => (
                  <MenuItem key={ship.id} value={ship.id}>
                    {ship.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={handleFilterChange('status')}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                label="Priority"
                onChange={handleFilterChange('priority')}
              >
                <MenuItem value="">All Priority</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={clearFilters} variant="outlined">
              Clear Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Jobs ({filteredJobs.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ship</TableCell>
                  <TableCell>Component</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Scheduled Date</TableCell>
                  <TableCell>Assigned Engineer</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {getShipName(job.shipId)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getComponentName(job.componentId)}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={job.priority}
                        color={getPriorityColor(job.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        color={getStatusColor(job.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(job.scheduledDate).toLocaleDateString()}</TableCell>
                    <TableCell>Engineer #{job.assignedEngineerId}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleOpenDialog(job)}
                        color="primary"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(job)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingJob ? 'Edit Maintenance Job' : 'Create New Maintenance Job'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            {editingJob ? 'Update' : 'Create'} Job
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography>
            Are you sure you want to delete this maintenance job?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobsPage;
