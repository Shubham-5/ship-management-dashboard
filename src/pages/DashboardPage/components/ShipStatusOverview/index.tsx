import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Card } from '../../../../components';
import type { ShipStatusOverviewProps } from '../../types';

const ShipStatusOverview: React.FC<ShipStatusOverviewProps> = ({ ships, components, jobs }) => (
  <Card 
    title="Fleet Status"
    action={
      <Chip 
        label={`${ships.length} Ships`} 
        size="small" 
        sx={{ 
          backgroundColor: '#f1f5f9',
          color: '#475569',
          fontWeight: 600,
        }}
      />
    }
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column'
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {ships.slice(0, 4).map((ship) => {
        const shipComponents = components.filter(c => c.shipId === ship.id);
        const shipJobs = jobs.filter(j => j.shipId === ship.id);
        const criticalComponents = shipComponents.filter(c => c.status === 'Critical').length;
        
        return (
          <Paper 
            key={ship.id} 
            sx={{ 
              p: 3,
              borderRadius: 2,
              border: '1px solid #f1f5f9',
              transition: 'all 0.2s ease-in-out',
              backgroundColor: '#fafbfc',
              '&:hover': {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                backgroundColor: '#ffffff',
                transform: 'translateY(-1px)',
              }
            }} 
            elevation={0}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: ship.status === 'Active' ? '#10b981' : ship.status === 'Under Maintenance' ? '#f59e0b' : '#6b7280',
                  }} />
                  <Typography variant="body1" fontWeight="600" sx={{ color: '#0f172a' }}>
                    {ship.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  IMO: {ship.imo} • Flag: {ship.flag}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  {shipComponents.length} components • {shipJobs.length} active jobs
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                <Chip 
                  label={ship.status} 
                  size="small" 
                  color={ship.status === 'Active' ? 'success' : ship.status === 'Under Maintenance' ? 'warning' : 'default'}
                  sx={{ fontWeight: 500 }}
                />
                {criticalComponents > 0 && (
                  <Chip 
                    label={`${criticalComponents} Critical`} 
                    size="small" 
                    color="error"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        );
      })}
    </Box>
  </Card>
);

export default ShipStatusOverview;
