import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useShipStore, type Ship, type Component, type MaintenanceJob } from '../../store/shipStore';
import ShipInfoCard from './components/ShipInfoCard';
import ComponentsTable from './components/ComponentsTable';
import MaintenanceJobsTable from './components/MaintenanceJobsTable';
import ComponentFormDialog from './components/ComponentFormDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import type { ComponentFormData } from './types';

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

  const handleEditShip = () => {
    navigate(`/ships/${ship.id}/edit`);
  };

  const handleAddComponent = () => {
    setEditingComponent(null);
    setOpenComponentDialog(true);
  };

  const handleEditComponent = (component: Component) => {
    setEditingComponent(component);
    setOpenComponentDialog(true);
  };

  const handleDeleteComponent = (component: Component) => {
    setComponentToDelete(component);
    setDeleteConfirmOpen(true);
  };

  const handleComponentSubmit = (data: ComponentFormData) => {
    if (editingComponent) {
      updateComponent(editingComponent.id, data);
    } else {
      addComponent({ ...data, shipId: ship.id });
    }
    setOpenComponentDialog(false);
    setEditingComponent(null);
    setComponents(getComponentsByShipId(ship.id));
  };

  const handleDeleteConfirm = () => {
    if (componentToDelete) {
      deleteComponent(componentToDelete.id);
      setDeleteConfirmOpen(false);
      setComponentToDelete(null);
      setComponents(getComponentsByShipId(ship.id));
      setJobs(getJobsByShipId(ship.id));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setComponentToDelete(null);
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleCloseComponentDialog = () => {
    setOpenComponentDialog(false);
    setEditingComponent(null);
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 0,
      overflow: 'hidden',
    }}>
      <Box sx={{ 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e2e8f0',
        p: 3,
        flexShrink: 0,
      }}>
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
      </Box>

      <Box sx={{ 
        p: 3, 
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>
        <ShipInfoCard
          ship={ship}
          onEditShip={handleEditShip}
        />

        <ComponentsTable
          components={components}
          onEditComponent={handleEditComponent}
          onDeleteComponent={handleDeleteComponent}
          onAddComponent={handleAddComponent}
        />

        <MaintenanceJobsTable
          jobs={jobs}
          components={components}
          onViewJob={handleViewJob}
        />
      </Box>

      <ComponentFormDialog
        open={openComponentDialog}
        editingComponent={editingComponent}
        onClose={handleCloseComponentDialog}
        onSubmit={handleComponentSubmit}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        componentToDelete={componentToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default ShipDetailPage;
