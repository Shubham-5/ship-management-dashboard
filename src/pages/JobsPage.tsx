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
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 0, // Important for proper flex behavior
      overflow: 'hidden', // Prevent main container from scrolling
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                color: '#0f172a',
                mb: 1,
                fontSize: { xs: '2rem', sm: '2.5rem' },
                letterSpacing: '-0.025em',
              }}
            >
              Maintenance Jobs
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b',
                fontWeight: 400,
                fontSize: '1.125rem',
              }}
            >
              Track and manage all maintenance activities across your fleet
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#2563eb',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Create New Job
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ 
        mb: 3,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: 2,
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterList sx={{ mr: 2, color: '#3b82f6' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
              Filter Jobs
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>Ship</InputLabel>
              <Select
                value={filters.shipId}
                label="Ship"
                onChange={handleFilterChange('shipId')}
                sx={{ borderRadius: 1.5 }}
              >
                <MenuItem value="">All Ships</MenuItem>
                {ships.map((ship) => (
                  <MenuItem key={ship.id} value={ship.id}>
                    {ship.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={handleFilterChange('status')}
                sx={{ borderRadius: 1.5 }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                label="Priority"
                onChange={handleFilterChange('priority')}
                sx={{ borderRadius: 1.5 }}
              >
                <MenuItem value="">All Priority</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
            <Button 
              onClick={clearFilters} 
              variant="outlined"
              sx={{
                borderColor: '#e2e8f0',
                color: '#475569',
                fontWeight: 500,
                px: 3,
                py: 1.5,
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  borderColor: '#cbd5e1',
                },
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: 2,
        minHeight: 0, // Important for flex container
      }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0, minHeight: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                Maintenance Jobs ({filteredJobs.length})
              </Typography>
              {filteredJobs.length === 0 && (
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  No jobs match the current filters
                </Typography>
              )}
            </Box>
          </Box>
          <TableContainer sx={{ 
            flex: 1,
            overflow: 'auto',
            minHeight: '40vh', // Minimum height to show more jobs
            maxHeight: 'calc(100vh - 400px)', // Ensure there's enough space
            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f5f9',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#cbd5e1',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: '#94a3b8',
              },
            },
          }}>
            <Table stickyHeader sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}>Ship</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}>Component</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}>Type</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}>Priority</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}>Status</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}>Scheduled Date</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}>Engineer</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                    textAlign: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="body1" sx={{ color: '#64748b', mb: 1 }}>
                        No maintenance jobs found
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        {jobs.length === 0 
                          ? 'Create your first maintenance job using the "Create New Job" button above.'
                          : 'Try adjusting your filters to see more jobs.'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job, index) => (
                    <TableRow 
                      key={job.id} 
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                        },
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc',
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography variant="body2" fontWeight="600" sx={{ color: '#0f172a' }}>
                          {getShipName(job.shipId)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          {getComponentName(job.componentId)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          {job.type}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Chip
                          label={job.priority}
                          color={getPriorityColor(job.priority)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Chip
                          label={job.status}
                          color={getStatusColor(job.status)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          {new Date(job.scheduledDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          Engineer #{job.assignedEngineerId}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.5 }}>
                        <IconButton
                          onClick={() => handleOpenDialog(job)}
                          sx={{
                            color: '#3b82f6',
                            '&:hover': {
                              backgroundColor: '#eff6ff',
                            },
                            mr: 1,
                          }}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(job)}
                          sx={{
                            color: '#dc2626',
                            '&:hover': {
                              backgroundColor: '#fef2f2',
                            },
                          }}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
