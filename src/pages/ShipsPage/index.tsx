import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../components';
import { useShipStore, type Ship } from '../../store/shipStore';
import ShipTable from './components/ShipTable';
import ShipFormDialog from './components/ShipFormDialog';
import ShipDeleteDialog from './components/ShipDeleteDialog';
import type { ShipFormData } from './types';

const ShipsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ships, addShip, updateShip, deleteShip, initializeData } = useShipStore();
  const [open, setOpen] = useState(false);
  const [editingShip, setEditingShip] = useState<Ship | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [shipToDelete, setShipToDelete] = useState<Ship | null>(null);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleOpenDialog = (ship?: Ship) => {
    setEditingShip(ship || null);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingShip(null);
  };

  const handleSubmit = (data: ShipFormData) => {
    if (editingShip) {
      updateShip(editingShip.id, data);
    } else {
      addShip(data);
    }
    handleCloseDialog();
  };

  const handleView = (ship: Ship) => {
    navigate(`/ships/${ship.id}`);
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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Fleet Management"
        subtitle="Manage your vessel fleet and operational status"
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add New Ship
          </Button>
        }
      />

      <ShipTable
        ships={ships}
        onView={handleView}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteClick}
      />

      <ShipFormDialog
        open={open}
        editingShip={editingShip}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />

      <ShipDeleteDialog
        open={deleteConfirmOpen}
        shipToDelete={shipToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default ShipsPage;
