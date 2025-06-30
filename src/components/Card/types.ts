import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

export interface CardProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  sx?: SxProps<Theme>;
  elevation?: number;
  variant?: 'elevation' | 'outlined';
}
