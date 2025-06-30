import React from 'react';
import { Box, Typography } from '@mui/material';
import type { PageHeaderProps } from './types';

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action
}) => {
  return (
    <Box sx={{ 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #e2e8f0',
      p: 3,
      mb: 0,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: '2rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.2,
              mb: subtitle ? 0.5 : 0,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#64748b',
                fontSize: '1rem',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {action}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
