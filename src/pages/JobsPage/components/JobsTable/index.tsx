import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Card, StatusChip, Table } from '../../../../components';
import { useShipStore } from '../../../../store/shipStore';
import type { JobsTableProps } from '../../types';
import type { MaintenanceJob } from '../../../../store/shipStore';

const JobsTable: React.FC<JobsTableProps> = ({
  jobs,
  onEdit,
  onDelete
}) => {
  const { ships, components } = useShipStore();
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

  const columns = [
    { id: 'ship', label: 'Ship' },
    { id: 'component', label: 'Component' },
    { id: 'type', label: 'Type' },
    { id: 'priority', label: 'Priority' },
    { id: 'status', label: 'Status' },
    { id: 'scheduledDate', label: 'Scheduled Date' },
    { id: 'engineer', label: 'Engineer' },
    { id: 'actions', label: 'Actions', align: 'center' as const },
  ];

  const rows = jobs.map((job) => [
    <Typography variant="body2" fontWeight="600" sx={{ color: '#0f172a' }}>
      {getShipName(job.shipId)}
    </Typography>,
    <Typography variant="body2" sx={{ color: '#374151' }}>
      {getComponentName(job.componentId)}
    </Typography>,
    <Typography variant="body2" sx={{ color: '#374151' }}>
      {job.type}
    </Typography>,
    <StatusChip
      label={job.priority}
      status={getPriorityColor(job.priority)}
    />,
    <StatusChip
      label={job.status}
      status={getStatusColor(job.status)}
    />,
    <Typography variant="body2" sx={{ color: '#374151' }}>
      {new Date(job.scheduledDate).toLocaleDateString()}
    </Typography>,
    <Typography variant="body2" sx={{ color: '#374151' }}>
      Engineer #{job.assignedEngineerId}
    </Typography>,
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
      <IconButton
        onClick={() => onEdit(job)}
        sx={{
          color: '#3b82f6',
          '&:hover': {
            backgroundColor: '#eff6ff',
          },
        }}
        size="small"
      >
        <Edit />
      </IconButton>
      <IconButton
        onClick={() => onDelete(job)}
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
    </Box>
  ]);

  return (
    <Card
      title={`Maintenance Jobs (${jobs.length})`}
      sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 1 }}>
            No maintenance jobs found
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            Create your first maintenance job using the "Create New Job" button above.
          </Typography>
        </Box>
      ) : (
        <Table
          columns={columns}
          rows={rows}
          stickyHeader
          maxHeight="calc(100vh - 400px)"
        />
      )}
    </Card>
  );
};

export default JobsTable;
