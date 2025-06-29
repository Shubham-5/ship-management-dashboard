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
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Professional Header */}
      <Box sx={{ 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e2e8f0',
        p: 3,
        mb: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate('/ships')} 
              sx={{ 
                backgroundColor: '#f8fafc',
                '&:hover': { backgroundColor: '#f1f5f9' },
                border: '1px solid #e2e8f0',
              }}
            >
              <ArrowBack sx={{ color: '#64748b' }} />
            </IconButton>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                {ship.name}
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: '#64748b',
                  fontSize: '1rem',
                }}
              >
                IMO: {ship.imo} • Flag: {ship.flag}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/ships/${ship.id}/edit`)}
            sx={{
              backgroundColor: '#3b82f6',
              color: 'white',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#2563eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Edit Ship
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        p: 3, 
        height: 'calc(100% - 120px)',
        overflow: 'auto',
        backgroundColor: '#f8fafc',
        '&::-webkit-scrollbar': {
          width: '6px',
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

        {/* Ship Information */}
        <Card sx={{ 
          mb: 3,
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          borderRadius: 3,
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#0f172a',
                mb: 3,
              }}
            >
              Ship Information
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 4,
            }}>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  IMO Number
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{
                    color: '#1e293b',
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                >
                  {ship.imo}
                </Typography>
              </Box>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Flag
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{
                    color: '#1e293b',
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                >
                  {ship.flag}
                </Typography>
              </Box>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Status
                </Typography>
                <Chip 
                  label={ship.status} 
                  color={getStatusColor(ship.status)} 
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                />
              </Box>
              {ship.yearBuilt && (
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      mb: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Year Built
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{
                      color: '#1e293b',
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  >
                    {ship.yearBuilt}
                  </Typography>
                </Box>
              )}
              {ship.owner && (
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: '#64748b',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      mb: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Owner
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{
                      color: '#1e293b',
                      fontSize: '1rem',
                      fontWeight: 500,
                    }}
                  >
                    {ship.owner}
                  </Typography>
                </Box>
              )}
            </Box>
            {ship.description && (
              <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #e2e8f0' }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Description
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{
                    color: '#475569',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                  }}
                >
                  {ship.description}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Components Section */}
        <Card sx={{ 
          mb: 3,
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          borderRadius: 3,
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h6"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                Components ({components.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenComponentDialog()}
                sx={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                Add Component
              </Button>
            </Box>
            <TableContainer sx={{ 
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      Serial Number
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      Install Date
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      Last Maintenance
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      Status
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{ 
                        fontWeight: 600, 
                        color: '#374151',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {components.map((component) => (
                    <TableRow 
                      key={component.id} 
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                        },
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Typography 
                          variant="body2" 
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: '0.875rem',
                          }}
                        >
                          {component.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ 
                        color: '#64748b',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid #f1f5f9',
                      }}>
                        {component.serialNumber}
                      </TableCell>
                      <TableCell sx={{ 
                        color: '#64748b',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid #f1f5f9',
                      }}>
                        {new Date(component.installDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ 
                        color: '#64748b',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid #f1f5f9',
                      }}>
                        {new Date(component.lastMaintenanceDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <Chip
                          label={component.status}
                          color={getStatusColor(component.status)}
                          sx={{
                            fontWeight: 600,
                            borderRadius: 2,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                        <IconButton
                          onClick={() => handleOpenComponentDialog(component)}
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
                          onClick={() => handleDeleteClick(component)}
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        {/* Maintenance Jobs Section */}
        <Card sx={{ 
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          borderRadius: 3,
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#0f172a',
                mb: 3,
              }}
            >
              Maintenance Jobs ({jobs.length})
            </Typography>
            <TableContainer sx={{ 
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      Component
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      Type
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      Priority
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#374151',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      Scheduled Date
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{ 
                        fontWeight: 600, 
                        color: '#374151',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => {
                    const component = components.find(c => c.id === job.componentId);
                    return (
                      <TableRow 
                        key={job.id} 
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f8fafc',
                          },
                          borderBottom: '1px solid #f1f5f9',
                        }}
                      >
                        <TableCell sx={{ 
                          color: '#1e293b',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          borderBottom: '1px solid #f1f5f9',
                        }}>
                          {component?.name || 'Unknown'}
                        </TableCell>
                        <TableCell sx={{ 
                          color: '#64748b',
                          fontSize: '0.875rem',
                          borderBottom: '1px solid #f1f5f9',
                        }}>
                          {job.type}
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                          <Chip
                            label={job.priority}
                            color={getPriorityColor(job.priority)}
                            sx={{
                              fontWeight: 600,
                              borderRadius: 2,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                          <Chip
                            label={job.status}
                            color={getJobStatusColor(job.status)}
                            sx={{
                              fontWeight: 600,
                              borderRadius: 2,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ 
                          color: '#64748b',
                          fontSize: '0.875rem',
                          borderBottom: '1px solid #f1f5f9',
                        }}>
                          {new Date(job.scheduledDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: '1px solid #f1f5f9' }}>
                          <IconButton
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            sx={{
                              color: '#3b82f6',
                              '&:hover': {
                                backgroundColor: '#eff6ff',
                              },
                            }}
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
      </Box>

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
