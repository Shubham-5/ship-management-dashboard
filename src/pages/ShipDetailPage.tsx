import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Add,
  Delete,
  Build
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useShipStore, type Ship, type Component, type MaintenanceJob } from '../store/shipStore';

interface ComponentFormData {
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  status: 'Good' | 'Needs Maintenance' | 'Critical';
  description?: string;
}

const ShipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getShipById, 
    getComponentsByShipId, 
    getJobsByShipId,
    addComponent,
    updateComponent,
    deleteComponent,
    initializeData
  } = useShipStore();

  const [ship, setShip] = useState<Ship | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [jobs, setJobs] = useState<MaintenanceJob[]>([]);
  const [openComponentDialog, setOpenComponentDialog] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState<Component | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ComponentFormData>();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (id) {
      const foundShip = getShipById(id);
      setShip(foundShip || null);
      
      if (foundShip) {
        setComponents(getComponentsByShipId(id));
        setJobs(getJobsByShipId(id));
      }
    }
  }, [id, getShipById, getComponentsByShipId, getJobsByShipId]);

  if (!ship) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Ship not found</Alert>
      </Box>
    );
  }

  const handleOpenComponentDialog = (component?: Component) => {
    if (component) {
      setEditingComponent(component);
      reset({
        name: component.name,
        serialNumber: component.serialNumber,
        installDate: component.installDate,
        lastMaintenanceDate: component.lastMaintenanceDate,
        status: component.status,
        description: component.description || ''
      });
    } else {
      setEditingComponent(null);
      reset({
        name: '',
        serialNumber: '',
        installDate: new Date().toISOString().split('T')[0],
        lastMaintenanceDate: new Date().toISOString().split('T')[0],
        status: 'Good',
        description: ''
      });
    }
    setOpenComponentDialog(true);
  };

  const handleCloseComponentDialog = () => {
    setOpenComponentDialog(false);
    setEditingComponent(null);
    reset();
  };

  const onSubmitComponent = (data: ComponentFormData) => {
    if (editingComponent) {
      updateComponent(editingComponent.id, data);
    } else {
      addComponent({ ...data, shipId: ship.id });
    }
    handleCloseComponentDialog();
    // Refresh components
    setComponents(getComponentsByShipId(ship.id));
  };

  const handleDeleteClick = (component: Component) => {
    setComponentToDelete(component);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (componentToDelete) {
      deleteComponent(componentToDelete.id);
      setDeleteConfirmOpen(false);
      setComponentToDelete(null);
      // Refresh data
      setComponents(getComponentsByShipId(ship.id));
      setJobs(getJobsByShipId(ship.id));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setComponentToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Good': return 'success';
      case 'Under Maintenance':
      case 'Needs Maintenance': return 'warning';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  const getJobStatusColor = (status: MaintenanceJob['status']) => {
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/ships')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {ship.name}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={() => navigate(`/ships/${ship.id}/edit`)}
        >
          Edit Ship
        </Button>
      </Box>

      {/* Ship Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ship Information
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                IMO Number
              </Typography>
              <Typography variant="body1">{ship.imo}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Flag
              </Typography>
              <Typography variant="body1">{ship.flag}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip 
                label={ship.status} 
                color={getStatusColor(ship.status)} 
                size="small" 
              />
            </Box>
            {ship.yearBuilt && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Year Built
                </Typography>
                <Typography variant="body1">{ship.yearBuilt}</Typography>
              </Box>
            )}
            {ship.owner && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Owner
                </Typography>
                <Typography variant="body1">{ship.owner}</Typography>
              </Box>
            )}
          </Box>
          {ship.description && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">{ship.description}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Components Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Components ({components.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenComponentDialog()}
            >
              Add Component
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Install Date</TableCell>
                  <TableCell>Last Maintenance</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {components.map((component) => (
                  <TableRow key={component.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {component.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{component.serialNumber}</TableCell>
                    <TableCell>{new Date(component.installDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(component.lastMaintenanceDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={component.status}
                        color={getStatusColor(component.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleOpenComponentDialog(component)}
                        color="primary"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(component)}
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

      {/* Maintenance Jobs Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Maintenance Jobs ({jobs.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Component</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Scheduled Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => {
                  const component = components.find(c => c.id === job.componentId);
                  return (
                    <TableRow key={job.id} hover>
                      <TableCell>{component?.name || 'Unknown'}</TableCell>
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
                          color={getJobStatusColor(job.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(job.scheduledDate).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          color="primary"
                          size="small"
                        >
                          <Build />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Component Dialog */}
      <Dialog open={openComponentDialog} onClose={handleCloseComponentDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingComponent ? 'Edit Component' : 'Add New Component'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Component Name"
              margin="normal"
              {...register('name', { required: 'Component name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              label="Serial Number"
              margin="normal"
              {...register('serialNumber', { required: 'Serial number is required' })}
              error={!!errors.serialNumber}
              helperText={errors.serialNumber?.message}
            />
            <TextField
              fullWidth
              label="Install Date"
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              {...register('installDate', { required: 'Install date is required' })}
              error={!!errors.installDate}
              helperText={errors.installDate?.message}
            />
            <TextField
              fullWidth
              label="Last Maintenance Date"
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              {...register('lastMaintenanceDate', { required: 'Last maintenance date is required' })}
              error={!!errors.lastMaintenanceDate}
              helperText={errors.lastMaintenanceDate?.message}
            />
            <TextField
              fullWidth
              select
              label="Status"
              margin="normal"
              defaultValue="Good"
              {...register('status', { required: 'Status is required' })}
              error={!!errors.status}
              helperText={errors.status?.message}
            >
              <MenuItem value="Good">Good</MenuItem>
              <MenuItem value="Needs Maintenance">Needs Maintenance</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              {...register('description')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComponentDialog}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmitComponent)} variant="contained">
            {editingComponent ? 'Update' : 'Add'} Component
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All associated maintenance jobs will also be deleted.
          </Alert>
          <Typography>
            Are you sure you want to delete the component "{componentToDelete?.name}"?
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

export default ShipDetailPage;
