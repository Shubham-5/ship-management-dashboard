import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}
