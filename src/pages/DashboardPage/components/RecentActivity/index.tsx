import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Card } from '../../../../components';
import type { RecentActivityProps } from '../../types';

const RecentActivity: React.FC<RecentActivityProps> = ({ jobs, ships, components }) => (
  <Card 
    title="Recent Activity"
    action={
      <Chip 
        label={`${jobs.length} Total`} 
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {jobs.slice(0, 6).map((job) => {
        const ship = ships.find(s => s.id === job.shipId);
        const component = components.find(c => c.id === job.componentId);
        
        return (
          <Paper 
            key={job.id} 
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
              <Box sx={{ flex: 1, pr: 2 }}>
                <Typography variant="body1" fontWeight="600" sx={{ mb: 1, color: '#0f172a' }}>
                  {job.type} - {component?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Ship: {ship?.name} • Scheduled: {new Date(job.scheduledDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={job.status} 
                    size="small" 
                    color={job.status === 'Completed' ? 'success' : job.status === 'In Progress' ? 'warning' : 'default'}
                    sx={{ fontWeight: 500 }}
                  />
                  <Chip 
                    label={job.priority} 
                    size="small" 
                    color={job.priority === 'Critical' ? 'error' : job.priority === 'High' ? 'warning' : 'default'}
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              </Box>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                backgroundColor: job.priority === 'Critical' ? '#ef4444' : job.priority === 'High' ? '#f59e0b' : '#10b981',
                mt: 1,
              }} />
            </Box>
          </Paper>
        );
      })}
    </Box>
  </Card>
);

export default RecentActivity;
