import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Chip
} from '@mui/material';
import {
  DirectionsBoat,
  Build,
  Assignment,
  Warning
} from '@mui/icons-material';
import { useShipStore } from '../store/shipStore';

const DashboardPage: React.FC = () => {
  const { ships, components, jobs, initializeData } = useShipStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Calculate KPIs
  const totalShips = ships.length;
  const activeShips = ships.filter(ship => ship.status === 'Active').length;
  const overdueComponents = components.filter(component => {
    const lastMaintenance = new Date(component.lastMaintenanceDate);
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - 6);
    return lastMaintenance < monthsAgo;
  }).length;
  
  const jobsInProgress = jobs.filter(job => job.status === 'In Progress').length;
  const completedJobs = jobs.filter(job => job.status === 'Completed').length;
  const openJobs = jobs.filter(job => job.status === 'Open').length;
  const criticalJobs = jobs.filter(job => job.priority === 'Critical').length;

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            {subtitle && (
              <Typography color="text.secondary" variant="caption">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const RecentActivity = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {jobs.slice(0, 5).map((job) => {
            const ship = ships.find(s => s.id === job.shipId);
            const component = components.find(c => c.id === job.componentId);
            
            return (
              <Paper key={job.id} sx={{ p: 2 }} variant="outlined">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {job.type} - {component?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ship: {ship?.name} | Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={job.status} 
                      size="small" 
                      color={job.status === 'Completed' ? 'success' : job.status === 'In Progress' ? 'warning' : 'default'}
                    />
                    <Chip 
                      label={job.priority} 
                      size="small" 
                      color={job.priority === 'Critical' ? 'error' : job.priority === 'High' ? 'warning' : 'default'}
                    />
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );

  const ShipStatusOverview = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Fleet Status
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ships.slice(0, 4).map((ship) => {
            const shipComponents = components.filter(c => c.shipId === ship.id);
            const shipJobs = jobs.filter(j => j.shipId === ship.id);
            const criticalComponents = shipComponents.filter(c => c.status === 'Critical').length;
            
            return (
              <Paper key={ship.id} sx={{ p: 2 }} variant="outlined">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {ship.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      IMO: {ship.imo} | Flag: {ship.flag}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      label={ship.status} 
                      size="small" 
                      color={ship.status === 'Active' ? 'success' : ship.status === 'Under Maintenance' ? 'warning' : 'default'}
                    />
                    <Typography variant="caption">
                      {shipComponents.length} components, {shipJobs.length} jobs
                    </Typography>
                    {criticalComponents > 0 && (
                      <Chip 
                        label={`${criticalComponents} critical`} 
                        size="small" 
                        color="error"
                      />
                    )}
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      {/* KPI Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
          <StatCard
            title="Total Ships"
            value={totalShips}
            subtitle={`${activeShips} active`}
            icon={<DirectionsBoat />}
            color="primary"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
          <StatCard
            title="Overdue Maintenance"
            value={overdueComponents}
            subtitle="Components"
            icon={<Warning />}
            color="warning"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
          <StatCard
            title="Jobs in Progress"
            value={jobsInProgress}
            subtitle={`${openJobs} open, ${criticalJobs} critical`}
            icon={<Build />}
            color="info"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
          <StatCard
            title="Completed Jobs"
            value={completedJobs}
            subtitle="This month"
            icon={<Assignment />}
            color="success"
          />
        </Box>
      </Box>

      {/* Content Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <RecentActivity />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <ShipStatusOverview />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
