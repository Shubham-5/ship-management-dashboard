import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Today, CalendarViewMonth, CalendarViewWeek } from '@mui/icons-material';
import { PageHeader, Button } from '../../../../components';
import type { CalendarHeaderProps } from '../../types';

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewType,
  onViewChange,
  onGoToToday
}) => {
  return (
    <PageHeader
      title="Maintenance Calendar"
      subtitle="Schedule and track maintenance activities across your fleet"
      action={
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(_, newView) => newView && onViewChange(newView)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: '1px solid #e2e8f0',
                borderRadius: 1.5,
                px: 2,
                py: 1,
                color: '#64748b',
                fontWeight: 500,
                '&.Mui-selected': {
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                },
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
              },
            }}
          >
            <ToggleButton value="month">
              <CalendarViewMonth sx={{ mr: 1, fontSize: 18 }} />
              Monthly
            </ToggleButton>
            <ToggleButton value="week">
              <CalendarViewWeek sx={{ mr: 1, fontSize: 18 }} />
              Weekly
            </ToggleButton>
          </ToggleButtonGroup>
          
          <Button
            variant="outlined"
            startIcon={<Today />}
            onClick={onGoToToday}
          >
            Today
          </Button>
        </Box>
      }
    />
  );
};

export default CalendarHeader;
