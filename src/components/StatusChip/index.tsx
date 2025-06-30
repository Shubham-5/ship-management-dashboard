import React from 'react';
import { Chip } from '@mui/material';
import type { StatusChipProps } from './types';

const StatusChip: React.FC<StatusChipProps> = ({
  label,
  status,
  size = 'small'
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534',
          border: '1px solid #bbf7d0',
        };
      case 'warning':
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e',
          border: '1px solid #fde68a',
        };
      case 'error':
        return {
          backgroundColor: '#fecaca',
          color: '#991b1b',
          border: '1px solid #fca5a5',
        };
      case 'info':
        return {
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          border: '1px solid #93c5fd',
        };
      default:
        return {
          backgroundColor: '#f1f5f9',
          color: '#475569',
          border: '1px solid #cbd5e1',
        };
    }
  };

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        ...getStatusColor(),
        fontWeight: 600,
        borderRadius: 2,
        fontSize: '0.75rem',
        height: size === 'small' ? '28px' : '32px',
      }}
    />
  );
};

export default StatusChip;
