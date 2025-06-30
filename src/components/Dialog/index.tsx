import React from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { DialogProps } from './types';

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'md',
  fullWidth = true,
  sx = {}
}) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
        },
        ...sx,
      }}
    >
      {title && (
        <DialogTitle sx={{ 
          p: 4, 
          pb: 2,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          position: 'relative',
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: '#0f172a',
              fontSize: '1.5rem',
              lineHeight: 1.2,
              pr: 6,
            }}
          >
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#64748b',
              '&:hover': {
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent sx={{ 
        p: 4,
        backgroundColor: '#f8fafc',
      }}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ 
          p: 4, 
          pt: 3,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #f1f5f9',
          gap: 2,
        }}>
          {actions}
        </DialogActions>
      )}
    </MuiDialog>
  );
};

export default Dialog;
