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
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useShipStore, type Ship } from '../store/shipStore';

interface ShipFormData {
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  description?: string;
  yearBuilt?: number;
  owner?: string;
}

const ShipsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ships, addShip, updateShip, deleteShip, initializeData } = useShipStore();
  const [open, setOpen] = useState(false);
  const [editingShip, setEditingShip] = useState<Ship | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [shipToDelete, setShipToDelete] = useState<Ship | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ShipFormData>();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleOpenDialog = (ship?: Ship) => {
    if (ship) {
      setEditingShip(ship);
      reset({
        name: ship.name,
        imo: ship.imo,
        flag: ship.flag,
        status: ship.status,
        description: ship.description || '',
        yearBuilt: ship.yearBuilt || undefined,
        owner: ship.owner || ''
      });
    } else {
      setEditingShip(null);
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
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingShip(null);
    reset();
  };

  const onSubmit = (data: ShipFormData) => {
    if (editingShip) {
      updateShip(editingShip.id, data);
    } else {
      addShip(data);
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (ship: Ship) => {
    setShipToDelete(ship);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (shipToDelete) {
      deleteShip(shipToDelete.id);
      setDeleteConfirmOpen(false);
      setShipToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setShipToDelete(null);
  };

  const getStatusColor = (status: Ship['status']) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Under Maintenance': return 'warning';
      case 'Inactive': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
              Fleet Management
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b',
                fontWeight: 400,
                fontSize: '1.125rem',
              }}
            >
              Manage your vessel fleet and operational status
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
            Add New Ship
          </Button>
        </Box>
      </Box>

      <Card sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: 2,
      }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
          <TableContainer sx={{ 
            flex: 1,
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
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                  }}>
                    Ship Name
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                  }}>
                    IMO Number
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                  }}>
                    Flag
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                  }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                  }}>
                    Year Built
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                  }}>
                    Owner
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e2e8f0',
                    py: 2,
                    textAlign: 'center',
                  }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ships.map((ship, index) => (
                  <TableRow 
                    key={ship.id} 
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                      },
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc',
                    }}
                  >
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography variant="body1" fontWeight="600" sx={{ color: '#0f172a' }}>
                        {ship.name}
                      </Typography>
                      {ship.description && (
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          {ship.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#374151' }}>
                        {ship.imo}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
                        {ship.flag}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Chip
                        label={ship.status}
                        color={getStatusColor(ship.status)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        {ship.yearBuilt || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        {ship.owner || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2.5 }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          onClick={() => navigate(`/ships/${ship.id}`)}
                          color="primary"
                          size="small"
                          sx={{
                            backgroundColor: '#eff6ff',
                            '&:hover': {
                              backgroundColor: '#dbeafe',
                            },
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenDialog(ship)}
                          color="primary"
                          size="small"
                          sx={{
                            backgroundColor: '#fef3c7',
                            '&:hover': {
                              backgroundColor: '#fde68a',
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(ship)}
                          color="error"
                          size="small"
                          sx={{
                            backgroundColor: '#fef2f2',
                            '&:hover': {
                              backgroundColor: '#fecaca',
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
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
          {editingShip ? 'Edit Ship' : 'Add New Ship'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            {editingShip ? 'Update' : 'Add'} Ship
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All associated components and maintenance jobs will also be deleted.
          </Alert>
          <Typography>
            Are you sure you want to delete the ship "{shipToDelete?.name}"?
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

export default ShipsPage;
