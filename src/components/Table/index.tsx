import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import type { TableProps } from './types';

const Table: React.FC<TableProps> = ({
  columns,
  rows,
  stickyHeader = false,
  maxHeight = 400
}) => {
  return (
    <TableContainer 
      component={Paper}
      sx={{ 
        minHeight: maxHeight,
        maxHeight: maxHeight,
        backgroundColor: '#ffffff',
        border: '1px solid #f1f5f9',
        borderRadius: 2,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f5f9',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#cbd5e1',
          borderRadius: '3px',
          '&:hover': {
            backgroundColor: '#94a3b8',
          },
        },
      }}
    >
      <MuiTable stickyHeader={stickyHeader}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8fafc' }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  minWidth: column.minWidth,
                  fontWeight: 600,
                  color: '#374151',
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                  fontSize: '0.875rem',
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow 
              key={index}
              sx={{
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
                '&:last-child td': {
                  borderBottom: 0,
                },
              }}
            >
              {row.map((cell, cellIndex) => (
                <TableCell 
                  key={cellIndex}
                  align={columns[cellIndex]?.align || 'left'}
                  sx={{ 
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.875rem',
                  }}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
