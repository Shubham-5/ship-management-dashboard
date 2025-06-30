import React from 'react';
import { Box, Typography, CardContent, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Card, Button, Table, StatusChip } from '../../../../components';
import type { ComponentsTableProps } from '../../types';
import type { Component } from '../../../../store/shipStore';

const ComponentsTable: React.FC<ComponentsTableProps> = ({
  components,
  onEditComponent,
  onDeleteComponent,
  onAddComponent
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'success';
      case 'Needs Maintenance': return 'warning';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'serialNumber', label: 'Serial Number' },
    { id: 'installDate', label: 'Install Date' },
    { id: 'lastMaintenanceDate', label: 'Last Maintenance' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions', align: 'center' as const },
  ];

  const formatComponentRows = (components: Component[]) => {
    return components.map(component => [
      component.name,
      component.serialNumber,
      new Date(component.installDate).toLocaleDateString(),
      new Date(component.lastMaintenanceDate).toLocaleDateString(),
      <StatusChip
        key={`status-${component.id}`}
        label={component.status}
        status={getStatusColor(component.status)}
        size="small"
      />,
      <Box key={`actions-${component.id}`} sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <IconButton
          onClick={() => onEditComponent(component)}
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
          onClick={() => onDeleteComponent(component)}
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
  };

  return (
    <Card>
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
            onClick={onAddComponent}
          >
            Add Component
          </Button>
        </Box>

        <Table
          columns={columns}
          rows={formatComponentRows(components)}
        />
      </CardContent>
    </Card>
  );
};

export default ComponentsTable;
