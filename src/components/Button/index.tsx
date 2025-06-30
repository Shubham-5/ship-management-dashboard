import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import type { ButtonProps } from './types';

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  disabled = false,
  loading = false,
  fullWidth = false,
  sx = {},
  onClick,
  type = 'button',
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      startIcon={loading ? <CircularProgress size={16} /> : startIcon}
      endIcon={endIcon}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        px: 3,
        py: 1.5,
        ...sx
      }}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
