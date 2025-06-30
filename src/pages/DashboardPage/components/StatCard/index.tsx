import React from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { Card } from '../../../../components';
import type { StatCardProps } from '../../types';

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle, 
  trend, 
  trendUp 
}) => (
  <Card 
    sx={{ 
      height: '100%',
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    }}
  >
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: 3,
            bgcolor: `${color}.light`,
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trendUp ? (
              <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 600,
                color: trendUp ? '#10b981' : '#ef4444',
                fontSize: '0.75rem',
              }}
            >
              {trend}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            fontWeight: 800,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            lineHeight: 1,
            mb: 1,
            color: '#0f172a',
            letterSpacing: '-0.025em',
          }}
        >
          {value.toLocaleString()}
        </Typography>
        <Typography 
          color="text.primary" 
          variant="body1"
          sx={{ 
            fontWeight: 600,
            mb: 0.5,
            color: '#374151',
            fontSize: '0.875rem',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            color="text.secondary" 
            variant="caption"
            sx={{ 
              display: 'block', 
              color: '#6b7280',
              fontSize: '0.75rem',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  </Card>
);

export default StatCard;
