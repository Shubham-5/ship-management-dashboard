import React from 'react';
import { Box, Typography } from '@mui/material';

const DemoCredentials: React.FC = () => {
  return (
    <Box sx={{ 
      mt: 3, 
      p: 3, 
      backgroundColor: '#f8fafc', 
      borderRadius: 2,
      border: '1px solid #e2e8f0',
    }}>
      <Typography 
        variant="body2" 
        sx={{
          color: '#374151',
          fontSize: '0.875rem',
          fontWeight: 600,
          mb: 2,
        }}
      >
        Demo Credentials
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography 
          variant="body2" 
          sx={{
            color: '#64748b',
            fontSize: '0.8125rem',
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          }}
        >
          <strong>Admin:</strong> admin@entnt.in / admin123
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#64748b',
            fontSize: '0.8125rem',
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          }}
        >
          <strong>Inspector:</strong> inspector@entnt.in / inspect123
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: '#64748b',
            fontSize: '0.8125rem',
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          }}
        >
          <strong>Engineer:</strong> engineer@entnt.in / engine123
        </Typography>
      </Box>
    </Box>
  );
};

export default DemoCredentials;
