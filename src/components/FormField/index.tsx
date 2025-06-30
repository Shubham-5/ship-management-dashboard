import React from 'react';
import { Box, Typography } from '@mui/material';
import type { FormFieldProps } from './types';

const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  error,
  required = false,
  sx = {}
}) => {
  return (
    <Box sx={{ mb: 2, ...sx }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: '#374151',
            mb: 1,
            fontSize: '0.875rem',
          }}
        >
          {label}
          {required && (
            <Typography
              component="span"
              sx={{ color: '#dc2626', ml: 0.5 }}
            >
              *
            </Typography>
          )}
        </Typography>
      )}
      <Box
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#ffffff',
            fontSize: '0.875rem',
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#64748b',
            '&.Mui-focused': {
              color: '#3b82f6',
            },
          },
        }}
      >
        {children}
      </Box>
      {error && (
        <Typography
          variant="caption"
          sx={{
            color: '#dc2626',
            fontSize: '0.75rem',
            mt: 0.5,
            display: 'block',
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FormField;
