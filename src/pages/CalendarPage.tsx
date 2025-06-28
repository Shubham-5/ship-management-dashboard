import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Build
} from '@mui/icons-material';
import { useShipStore, type MaintenanceJob } from '../store/shipStore';

const CalendarPage: React.FC = () => {
  const { jobs, ships, components, initializeData } = useShipStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<MaintenanceJob[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = formatDate(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
    const jobsForDate = getJobsForDate(dateString);
    
    setSelectedDate(clickedDate);
    setSelectedJobs(jobsForDate);
    setDialogOpen(true);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
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
          <Paper sx={{ height: 120, p: 1 }} variant="outlined" />
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
              height: 120,
              p: 1,
              cursor: 'pointer',
              border: isToday ? '2px solid' : '1px solid',
              borderColor: isToday ? 'primary.main' : 'divider',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
            onClick={() => handleDateClick(day)}
          >
            <Typography variant="body2" fontWeight={isToday ? 'bold' : 'normal'}>
              {day}
            </Typography>
            <Box sx={{ mt: 1 }}>
              {dayJobs.slice(0, 2).map((job, index) => (
                <Chip
                  key={index}
                  label={job.type}
                  size="small"
                  color={getPriorityColor(job.priority)}
                  sx={{ mb: 0.5, mr: 0.5, fontSize: '0.7rem' }}
                />
              ))}
              {dayJobs.length > 2 && (
                <Typography variant="caption" color="text.secondary">
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Maintenance Calendar</Typography>
        <Button
          variant="outlined"
          startIcon={<Today />}
          onClick={goToToday}
        >
          Today
        </Button>
      </Box>

      <Card>
        <CardContent>
          {/* Calendar Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigateMonth(-1)}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <IconButton onClick={() => navigateMonth(1)}>
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Day Names Header */}
          <Box sx={{ display: 'flex', mb: 1 }}>
            {dayNames.map((dayName) => (
              <Box key={dayName} sx={{ width: '14.28%', p: 0.5 }}>
                <Typography
                  variant="subtitle2"
                  align="center"
                  sx={{ fontWeight: 'bold', py: 1 }}
                >
                  {dayName}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Calendar Grid */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {renderCalendarDays()}
          </Box>
        </CardContent>
      </Card>

      {/* Job Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Build sx={{ mr: 1 }} />
            Scheduled Jobs for {selectedDate?.toLocaleDateString()}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedJobs.length === 0 ? (
            <Typography color="text.secondary">
              No maintenance jobs scheduled for this date.
            </Typography>
          ) : (
            <List>
              {selectedJobs.map((job) => (
                <ListItem key={job.id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {job.type} - {getComponentName(job.componentId)}
                        </Typography>
                        <Chip
                          label={job.priority}
                          color={getPriorityColor(job.priority)}
                          size="small"
                        />
                        <Chip
                          label={job.status}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ship: {getShipName(job.shipId)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Assigned Engineer: Engineer #{job.assignedEngineerId}
                        </Typography>
                        {job.description && (
                          <Typography variant="body2" color="text.secondary">
                            Description: {job.description}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;
