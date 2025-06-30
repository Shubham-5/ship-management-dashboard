import React from 'react';
import { Box, Typography, CardContent } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { Card, Button, StatusChip } from '../../../../components';
import type { ShipInfoCardProps } from '../../types';

const ShipInfoCard: React.FC<ShipInfoCardProps> = ({
  ship,
  onEditShip
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Under Maintenance': return 'warning';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography 
            variant="h6"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            Ship Information
          </Typography>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={onEditShip}
            size="small"
          >
            Edit Ship
          </Button>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 4,
        }}>
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: 600,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              IMO Number
            </Typography>
            <Typography 
              variant="body1"
              sx={{
                color: '#1e293b',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              {ship.imo}
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: 600,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Flag
            </Typography>
            <Typography 
              variant="body1"
              sx={{
                color: '#1e293b',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              {ship.flag}
            </Typography>
          </Box>

          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: 600,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Status
            </Typography>
            <StatusChip 
              label={ship.status}
              status={getStatusColor(ship.status)}
            />
          </Box>

          {ship.yearBuilt && (
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Year Built
              </Typography>
              <Typography 
                variant="body1"
                sx={{
                  color: '#1e293b',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {ship.yearBuilt}
              </Typography>
            </Box>
          )}

          {ship.owner && (
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Owner
              </Typography>
              <Typography 
                variant="body1"
                sx={{
                  color: '#1e293b',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {ship.owner}
              </Typography>
            </Box>
          )}
        </Box>

        {ship.description && (
          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #e2e8f0' }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: 600,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Description
            </Typography>
            <Typography 
              variant="body1"
              sx={{
                color: '#475569',
                fontSize: '1rem',
                lineHeight: 1.7,
              }}
            >
              {ship.description}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ShipInfoCard;
