import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Build,
  CalendarViewMonth,
  CalendarViewWeek
} from '@mui/icons-material';
import { useShipStore, type MaintenanceJob } from '../store/shipStore';

type CalendarView = 'month' | 'week';

const CalendarPage: React.FC = () => {
  const { jobs, ships, components, initializeData } = useShipStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<MaintenanceJob[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewType, setViewType] = useState<CalendarView>('month');

  useEffect(() => {
    initializeData();
  }, [initializeData]);

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

  const handleDateClick = (day: number, month?: number) => {
    // Handle both monthly and weekly view clicks
    const clickMonth = month !== undefined ? month : currentDate.getMonth();
    const clickedDate = new Date(currentDate.getFullYear(), clickMonth, day);
    const dateString = formatDate(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
    const jobsForDate = getJobsForDate(dateString);
    
    setSelectedDate(clickedDate);
    setSelectedJobs(jobsForDate);
    setDialogOpen(true);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigate = (direction: number) => {
    if (viewType === 'month') {
      navigateMonth(direction);
    } else {
      navigateWeek(direction);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get the start of the week (Sunday) for a given date
  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  };

  // Get array of dates for the current week
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

  const getShipName = (shipId: string) => {
    const ship = ships.find(s => s.id === shipId);
    return ship?.name || 'Unknown Ship';
  };

  const getComponentName = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    return component?.name || 'Unknown Component';
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
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

    // Add days of the month
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
            onClick={() => handleDateClick(day)}
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
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderWeeklyCalendar = () => {
    const weekDates = getWeekDates();    
    return (
      <Box>
        {/* Week header */}
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
        
        {/* Week days */}
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
                  onClick={() => handleDateClick(date.getDate(), date.getMonth())}
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              color: '#0f172a',
              mb: 1,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              letterSpacing: '-0.025em',
            }}
          >
            Maintenance Calendar
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#64748b',
              fontWeight: 400,
              fontSize: '1.125rem',
            }}
          >
            Schedule and track maintenance activities across your fleet
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* View Toggle */}
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(_, newView) => newView && setViewType(newView)}
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
            onClick={goToToday}
            sx={{
              borderColor: '#e2e8f0',
              color: '#475569',
              fontWeight: 500,
              px: 3,
              py: 1,
              borderRadius: 1.5,
              '&:hover': {
                backgroundColor: '#f8fafc',
                borderColor: '#cbd5e1',
              },
            }}
          >
            Today
          </Button>
        </Box>
      </Box>

      <Card sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: 2,
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
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
      }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
          {/* Calendar Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <IconButton 
              onClick={() => navigate(-1)} 
              size="large"
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
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
            <IconButton 
              onClick={() => navigate(1)} 
              size="large"
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Calendar Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {viewType === 'month' ? (
              <>
                {/* Day Names Header */}
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

                {/* Monthly Calendar Grid */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
                  {renderCalendarDays()}
                </Box>
              </>
            ) : (
              /* Weekly Calendar */
              <Box sx={{ flex: 1 }}>
                {renderWeeklyCalendar()}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Job Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ 
          p: 4, 
          pb: 2,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 48, 
                height: 48, 
                backgroundColor: '#eff6ff',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
              }}
            >
              <Build sx={{ color: '#3b82f6', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#0f172a',
                  fontSize: '1.5rem',
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                Scheduled Jobs
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#64748b',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ 
          p: 4,
          backgroundColor: '#f8fafc',
          maxHeight: '500px',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
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
        }}>
          {selectedJobs.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6,
              backgroundColor: '#ffffff',
              borderRadius: 3,
              border: '1px solid #e2e8f0',
            }}>
              <Box 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  backgroundColor: '#f1f5f9',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Build sx={{ color: '#9ca3af', fontSize: 32 }} />
              </Box>
              <Typography 
                variant="h6"
                sx={{ 
                  color: '#374151',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                No Jobs Scheduled
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  color: '#6b7280',
                  fontSize: '0.875rem',
                }}
              >
                No maintenance jobs are scheduled for this date.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {selectedJobs.map((job) => (
                <Paper
                  key={job.id}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                  elevation={0}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 2, 
                          color: '#0f172a',
                          fontSize: '1.125rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {job.type} - {getComponentName(job.componentId)}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          <strong>Ship:</strong> {getShipName(job.shipId)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          <strong>Engineer:</strong> #{job.assignedEngineerId}
                        </Typography>
                      </Box>
                      {job.description && (
                        <Box sx={{ 
                          p: 3,
                          backgroundColor: '#f8fafc',
                          borderRadius: 2,
                          border: '1px solid #f1f5f9',
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#475569',
                              fontSize: '0.875rem',
                              lineHeight: 1.6,
                            }}
                          >
                            {job.description}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, ml: 3 }}>
                      <Chip
                        label={job.priority}
                        color={getPriorityColor(job.priority)}
                        sx={{ 
                          fontWeight: 600,
                          borderRadius: 2,
                          fontSize: '0.75rem',
                          height: '28px',
                        }}
                      />
                      <Chip
                        label={job.status}
                        variant="outlined"
                        sx={{ 
                          fontWeight: 600,
                          borderRadius: 2,
                          fontSize: '0.75rem',
                          height: '28px',
                          borderColor: '#d1d5db',
                          color: '#374151',
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: 4, 
          pt: 3,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #f1f5f9',
        }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#2563eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;
