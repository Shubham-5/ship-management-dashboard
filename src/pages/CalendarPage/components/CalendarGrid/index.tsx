import React from 'react';
import { Box, Paper, Typography, Chip, CardContent } from '@mui/material';
import type { CalendarProps } from '../../types';
import type { MaintenanceJob } from '../../../../store/shipStore';

const CalendarGrid: React.FC<CalendarProps> = ({
  jobs,
  currentDate,
  viewType,
  onDateClick
}) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getJobsForDate = (date: string) => {
    return jobs.filter(job => job.scheduledDate === date);
  };

  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  };

  const getWeekDates = () => {
    const weekStart = getWeekStart(currentDate);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const getPriorityColor = (priority: MaintenanceJob['priority']) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <Box key={`empty-${i}`} sx={{ width: '14.28%', p: 0.5 }}>
          <Paper 
            sx={{ 
              height: 140, 
              p: 2,
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
            }} 
            elevation={0}
          />
        </Box>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayJobs = getJobsForDate(dateString);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <Box key={day} sx={{ width: '14.28%', p: 0.5 }}>
          <Paper
            sx={{
              height: 140,
              p: 2,
              cursor: 'pointer',
              border: isToday ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              borderRadius: 2,
              backgroundColor: isToday ? '#eff6ff' : '#ffffff',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8fafc',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
              }
            }}
            elevation={0}
            onClick={() => onDateClick(day)}
          >
            <Typography 
              variant="body1" 
              fontWeight={isToday ? 700 : 600}
              sx={{ 
                mb: 1,
                color: isToday ? '#1e40af' : '#374151',
                fontSize: '0.875rem',
              }}
            >
              {day}
            </Typography>
            <Box>
              {dayJobs.slice(0, 2).map((job, index) => (
                <Chip
                  key={index}
                  label={job.type.length > 8 ? job.type.substring(0, 8) + '...' : job.type}
                  size="small"
                  color={getPriorityColor(job.priority)}
                  sx={{ 
                    mb: 0.5, 
                    mr: 0.5, 
                    fontSize: '0.65rem',
                    height: '20px',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              ))}
              {dayJobs.length > 2 && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    display: 'block',
                    mt: 0.5,
                  }}
                >
                  +{dayJobs.length - 2} more
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      );
    }

    return days;
  };

  const renderWeeklyCalendar = () => {
    const weekDates = getWeekDates();    
    return (
      <Box>
        <Box sx={{ display: 'flex', mb: 2 }}>
          {dayNames.map((dayName) => (
            <Box key={dayName} sx={{ width: '14.28%', p: 1 }}>
              <Typography 
                variant="subtitle2" 
                textAlign="center" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#64748b',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {dayName}
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ display: 'flex' }}>
          {weekDates.map((date, index) => {
            const dateString = formatDate(date.getFullYear(), date.getMonth(), date.getDate());
            const dayJobs = getJobsForDate(dateString);
            const isToday = new Date().toDateString() === date.toDateString();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            
            return (
              <Box key={index} sx={{ width: '14.28%', p: 0.5 }}>
                <Paper
                  sx={{
                    height: 240,
                    p: 2,
                    cursor: 'pointer',
                    border: isToday ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    borderRadius: 2,
                    backgroundColor: isToday ? '#eff6ff' : isCurrentMonth ? '#ffffff' : '#f8fafc',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: isCurrentMonth ? '#f8fafc' : '#f1f5f9',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                  elevation={0}
                  onClick={() => onDateClick(date.getDate(), date.getMonth())}
                >
                  <Typography 
                    variant="body1" 
                    fontWeight={isToday ? 700 : 600}
                    sx={{
                      mb: 1,
                      color: isToday ? '#1e40af' : isCurrentMonth ? '#374151' : '#9ca3af',
                      fontSize: '0.875rem',
                    }}
                  >
                    {date.getDate()}
                  </Typography>
                  <Box>
                    {dayJobs.map((job, jobIndex) => (
                      <Chip
                        key={jobIndex}
                        label={job.type.length > 6 ? job.type.substring(0, 6) + '...' : job.type}
                        size="small"
                        color={getPriorityColor(job.priority)}
                        sx={{ 
                          mb: 0.5, 
                          mr: 0.5, 
                          fontSize: '0.6rem',
                          height: '18px',
                          display: 'block',
                          width: 'fit-content',
                          '& .MuiChip-label': {
                            px: 0.75,
                          },
                        }}
                      />
                    ))}
                    {dayJobs.length > 4 && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: '0.65rem',
                          fontWeight: 500,
                          display: 'block',
                          mt: 0.5,
                        }}
                      >
                        +{dayJobs.length - 4} more
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: '#0f172a',
            fontSize: '1.5rem',
            letterSpacing: '-0.025em',
          }}
        >
          {viewType === 'month' 
            ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            : `Week of ${getWeekStart(currentDate).toLocaleDateString()}`
          }
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {viewType === 'month' ? (
          <>
            <Box sx={{ display: 'flex', mb: 2 }}>
              {dayNames.map((dayName) => (
                <Box key={dayName} sx={{ width: '14.28%', p: 1 }}>
                  <Typography
                    variant="subtitle2"
                    align="center"
                    sx={{ 
                      fontWeight: 600, 
                      color: '#64748b',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {dayName}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
              {renderCalendarDays()}
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1 }}>
            {renderWeeklyCalendar()}
          </Box>
        )}
      </Box>
    </CardContent>
  );
};

export default CalendarGrid;
