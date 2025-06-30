import React from 'react';
import { Box, Typography, CardContent, IconButton } from '@mui/material';
import { Build } from '@mui/icons-material';
import { Card, Table, StatusChip } from '../../../../components';
import type { MaintenanceJobsTableProps } from '../../types';
import type { MaintenanceJob } from '../../../../store/shipStore';

const MaintenanceJobsTable: React.FC<MaintenanceJobsTableProps> = ({
  jobs,
  components,
  onViewJob
}) => {
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

  const columns = [
    { id: 'component', label: 'Component' },
    { id: 'type', label: 'Type' },
    { id: 'priority', label: 'Priority' },
    { id: 'status', label: 'Status' },
    { id: 'scheduledDate', label: 'Scheduled Date' },
    { id: 'actions', label: 'Actions', align: 'center' as const },
  ];

  const formatJobRows = (jobs: MaintenanceJob[]) => {
    return jobs.map(job => {
      const component = components.find(c => c.id === job.componentId);
      return [
        component?.name || 'Unknown',
        job.type,
        <StatusChip
          key={`priority-${job.id}`}
          label={job.priority}
          status={getPriorityColor(job.priority)}
          size="small"
        />,
        <StatusChip
          key={`status-${job.id}`}
          label={job.status}
          status={getJobStatusColor(job.status)}
          size="small"
        />,
        new Date(job.scheduledDate).toLocaleDateString(),
        <Box key={`actions-${job.id}`} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={() => onViewJob(job.id)}
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
        </Box>
      ];
    });
  };

  return (
    <Card>
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

        <Table
          columns={columns}
          rows={formatJobRows(jobs)}
        />
      </CardContent>
    </Card>
  );
};

export default MaintenanceJobsTable;
