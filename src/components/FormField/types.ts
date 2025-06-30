import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

export interface FormFieldProps {
  children: ReactNode;
  label?: string;
  error?: string;
  required?: boolean;
  sx?: SxProps<Theme>;
}
