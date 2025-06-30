import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { Card, Button } from '../../../../components';
import { useShipStore } from '../../../../store/shipStore';
import type { JobFiltersProps } from '../../types';

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const { ships } = useShipStore();

  return (
    <Card>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterList sx={{ mr: 2, color: '#3b82f6' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
          Filter Jobs
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Ship</InputLabel>
          <Select
            value={filters.shipId}
            label="Ship"
            onChange={onFilterChange('shipId')}
            sx={{ borderRadius: 1.5 }}
          >
            <MenuItem value="">All Ships</MenuItem>
            {ships.map((ship) => (
              <MenuItem key={ship.id} value={ship.id}>
                {ship.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={onFilterChange('status')}
            sx={{ borderRadius: 1.5 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority}
            label="Priority"
            onChange={onFilterChange('priority')}
            sx={{ borderRadius: 1.5 }}
          >
            <MenuItem value="">All Priority</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
          </Select>
        </FormControl>
        <Button 
          onClick={onClearFilters} 
          variant="outlined"
          sx={{
            px: 3,
            py: 1.5,
          }}
        >
          Clear Filters
        </Button>
      </Box>
    </Card>
  );
};

export default JobFilters;
