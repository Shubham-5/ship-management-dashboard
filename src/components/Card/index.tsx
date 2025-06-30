import React from 'react';
import { Card as MuiCard, CardContent, CardHeader } from '@mui/material';
import type { CardProps } from './types';

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  action, 
  sx = {}, 
  elevation = 0,
  variant = 'outlined' 
}) => {
  const defaultSx = {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    borderRadius: 3,
    ...sx
  };

  return (
    <MuiCard 
      elevation={elevation} 
      variant={variant}
      sx={defaultSx}
    >
      {title && (
        <CardHeader
          title={title}
          action={action}
          sx={{
            pb: title ? 2 : 0,
            '& .MuiCardHeader-title': {
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#0f172a',
            },
          }}
        />
      )}
      <CardContent sx={{ p: 4, pt: title ? 0 : 4 }}>
        {children}
      </CardContent>
    </MuiCard>
  );
};

export default Card;
