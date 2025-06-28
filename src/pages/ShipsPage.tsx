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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Ships Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Ship
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>IMO Number</TableCell>
                  <TableCell>Flag</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Year Built</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ships.map((ship) => (
                  <TableRow key={ship.id} hover>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {ship.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{ship.imo}</TableCell>
                    <TableCell>{ship.flag}</TableCell>
                    <TableCell>
                      <Chip
                        label={ship.status}
                        color={getStatusColor(ship.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{ship.yearBuilt || 'N/A'}</TableCell>
                    <TableCell>{ship.owner || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => navigate(`/ships/${ship.id}`)}
                        color="primary"
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenDialog(ship)}
                        color="primary"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(ship)}
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
