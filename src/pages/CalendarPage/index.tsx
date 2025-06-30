import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Card } from '../../components';
import { useShipStore, type MaintenanceJob } from '../../store/shipStore';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import JobDetailsDialog from './components/JobDetailsDialog';
import type { CalendarView } from './types';

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

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getJobsForDate = (date: string) => {
    return jobs.filter(job => job.scheduledDate === date);
  };

  const handleDateClick = (day: number, month?: number) => {
    const clickMonth = month !== undefined ? month : currentDate.getMonth();
    const clickedDate = new Date(currentDate.getFullYear(), clickMonth, day);
    const dateString = formatDate(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
    const jobsForDate = getJobsForDate(dateString);
    
    setSelectedDate(clickedDate);
    setSelectedJobs(jobsForDate);
    setDialogOpen(true);
  };

  const handleViewChange = (view: CalendarView) => {
    setViewType(view);
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
    setSelectedJobs([]);
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 0,
      overflow: 'auto',
      gap: 2,
    }}>
      <CalendarHeader
        viewType={viewType}
        onViewChange={handleViewChange}
        onGoToToday={handleGoToToday}
      />

      <Card sx={{ 
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}>
        <CalendarGrid
          jobs={jobs}
          ships={ships}
          components={components}
          currentDate={currentDate}
          selectedDate={selectedDate}
          viewType={viewType}
          onDateClick={handleDateClick}
        />
      </Card>

      <JobDetailsDialog
        open={dialogOpen}
        selectedDate={selectedDate}
        selectedJobs={selectedJobs}
        ships={ships}
        components={components}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default CalendarPage;
