import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

export interface ButtonProps {
  children: ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
