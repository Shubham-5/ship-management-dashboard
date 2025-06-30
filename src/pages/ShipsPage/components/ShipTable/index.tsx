import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import {  StatusChip, Table } from '../../../../components';
import type { ShipTableProps } from '../../types';
import type { Ship } from '../../../../store/shipStore';

const ShipTable: React.FC<ShipTableProps> = ({
  ships,
  onView,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: Ship['status']) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Under Maintenance': return 'warning';
      case 'Inactive': return 'default';
      default: return 'default';
    }
  };

  const columns = [
    { id: 'name', label: 'Ship Name' },
    { id: 'imo', label: 'IMO Number' },
    { id: 'flag', label: 'Flag' },
    { id: 'status', label: 'Status' },
    { id: 'yearBuilt', label: 'Year Built' },
    { id: 'owner', label: 'Owner' },
    { id: 'actions', label: 'Actions', align: 'center' as const },
  ];

  const rows = ships.map((ship) => [
    <Box>
      <Typography variant="body1" fontWeight="600" sx={{ color: '#0f172a' }}>
        {ship.name}
      </Typography>
      {ship.description && (
        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
          {ship.description}
        </Typography>
      )}
    </Box>,
    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#374151' }}>
      {ship.imo}
    </Typography>,
    <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
      {ship.flag}
    </Typography>,
    <StatusChip
      label={ship.status}
      status={getStatusColor(ship.status)}
    />,
    <Typography variant="body2" sx={{ color: '#374151' }}>
      {ship.yearBuilt || 'N/A'}
    </Typography>,
    <Typography variant="body2" sx={{ color: '#374151' }}>
      {ship.owner || 'N/A'}
    </Typography>,
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
      <IconButton
        onClick={() => onView(ship)}
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
        onClick={() => onEdit(ship)}
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
        onClick={() => onDelete(ship)}
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
  ]);

  return (
  
      <Table
        columns={columns}
        rows={rows}
        stickyHeader
      />
  );
};

export default ShipTable;
