import React from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingUp, Warning, CheckCircle, Assignment } from '@mui/icons-material';
import { Card } from '../../../../components';
import type { QuickStatsProps } from '../../types';

const QuickStats: React.FC<QuickStatsProps> = ({ jobs, components }) => {
  const completionRate = jobs.length > 0 
    ? Math.round((jobs.filter(j => j.status === 'Completed').length / jobs.length) * 100)
    : 0;

  const criticalComponents = components.filter(c => c.status === 'Critical').length;
  const activeJobs = jobs.filter(j => j.status === 'Open' || j.status === 'In Progress').length;

  const stats = [
    {
      value: '87%',
      label: 'Fleet Efficiency',
      icon: <TrendingUp sx={{ fontSize: 48, color: '#3b82f6' }} />,
      color: '#3b82f6'
    },
    {
      value: `${completionRate}%`,
      label: 'Completion Rate',
      icon: <CheckCircle sx={{ fontSize: 48, color: '#10b981' }} />,
      color: '#10b981'
    },
    {
      value: criticalComponents.toString(),
      label: 'Critical Components',
      icon: <Warning sx={{ fontSize: 48, color: '#f59e0b' }} />,
      color: '#f59e0b'
    },
    {
      value: activeJobs.toString(),
      label: 'Active Jobs',
      icon: <Assignment sx={{ fontSize: 48, color: '#8b5cf6' }} />,
      color: '#8b5cf6'
    }
  ];

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
      gap: 3, 
      mb: 4,
    }}>
      {stats.map((stat, index) => (
        <Card 
          key={index}
          sx={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ textAlign: 'center', p: 4 }}>
            {stat.icon}
            <Typography 
              variant="h3" 
              sx={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: stat.color,
                mb: 1,
                mt: 2,
              }}
            >
              {stat.value}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {stat.label}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default QuickStats;
