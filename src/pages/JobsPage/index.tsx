import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { PageHeader, Button } from '../../components';
import { useShipStore, type MaintenanceJob } from '../../store/shipStore';
import JobFilters from './components/JobFilters';
import JobsTable from './components/JobsTable';
import JobFormDialog from './components/JobFormDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import type { FilterState, JobFormData } from './types';

const JobsPage: React.FC = () => {
  const { 
    jobs, 
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

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const filteredJobs = jobs.filter(job => {
    if (filters.shipId && job.shipId !== filters.shipId) return false;
    if (filters.status && job.status !== filters.status) return false;
    if (filters.priority && job.priority !== filters.priority) return false;
    return true;
  });

  const handleOpenDialog = (job?: MaintenanceJob) => {
    setEditingJob(job || null);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = (data: JobFormData) => {
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
      minHeight: 0,
      overflow: 'hidden',
      gap: 2
    }}>
      <PageHeader
        title="Maintenance Jobs"
        subtitle="Track and manage all maintenance activities across your fleet"
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Create New Job
          </Button>
        }
      />

        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        <JobsTable
          jobs={filteredJobs}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteClick}
        />

      <JobFormDialog
        open={open}
        editingJob={editingJob}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        jobToDelete={jobToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default JobsPage;
