import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Build } from '@mui/icons-material';
import { Dialog, Button } from '../../../../components';
import type { JobDetailsDialogProps } from '../../types';
import type { MaintenanceJob, Ship, Component } from '../../../../store/shipStore';

interface ExtendedJobDetailsDialogProps extends JobDetailsDialogProps {
  ships: Ship[];
  components: Component[];
}

const JobDetailsDialog: React.FC<ExtendedJobDetailsDialogProps> = ({
  open,
  selectedDate,
  selectedJobs,
  ships,
  components,
  onClose
}) => {
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Scheduled Jobs"
      maxWidth="md"
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              width: 48, 
              height: 48, 
              backgroundColor: '#eff6ff',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 3,
            }}
          >
            <Build sx={{ color: '#3b82f6', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: '#0f172a',
                fontSize: '1.25rem',
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              Jobs for {selectedDate?.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
        </Box>
      </Box>

      {selectedJobs.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          backgroundColor: '#f8fafc',
          borderRadius: 2,
          border: '1px solid #e2e8f0',
        }}>
          <Box 
            sx={{ 
              width: 64, 
              height: 64, 
              backgroundColor: '#f1f5f9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Build sx={{ color: '#9ca3af', fontSize: 32 }} />
          </Box>
          <Typography 
            variant="h6"
            sx={{ 
              color: '#374151',
              fontSize: '1.125rem',
              fontWeight: 600,
              mb: 1,
            }}
          >
            No Jobs Scheduled
          </Typography>
          <Typography 
            variant="body2"
            sx={{ 
              color: '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            No maintenance jobs are scheduled for this date.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: '400px', overflow: 'auto' }}>
          {selectedJobs.map((job) => (
            <Paper
              key={job.id}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-1px)',
                },
              }}
              elevation={0}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      color: '#0f172a',
                      fontSize: '1.125rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {job.type} - {getComponentName(job.componentId)}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      <strong>Ship:</strong> {getShipName(job.shipId)}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      <strong>Engineer:</strong> #{job.assignedEngineerId}
                    </Typography>
                  </Box>
                  {job.description && (
                    <Box sx={{ 
                      p: 2,
                      backgroundColor: '#f8fafc',
                      borderRadius: 1,
                      border: '1px solid #f1f5f9',
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#475569',
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {job.description}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 3 }}>
                  <Chip
                    label={job.priority}
                    color={getPriorityColor(job.priority)}
                    sx={{ 
                      fontWeight: 600,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      height: '28px',
                    }}
                  />
                  <Chip
                    label={job.status}
                    variant="outlined"
                    sx={{ 
                      fontWeight: 600,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      height: '28px',
                      borderColor: '#d1d5db',
                      color: '#374151',
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default JobDetailsDialog;
