import type { ReactNode } from 'react';

export interface TableColumn {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  minWidth?: number;
}

export interface TableProps {
  columns: TableColumn[];
  rows: ReactNode[][];
  stickyHeader?: boolean;
  maxHeight?: number | string;
}
