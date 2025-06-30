import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import {
  DirectionsBoat,
  Build,
  Assignment,
  Warning
} from '@mui/icons-material';
import { PageHeader } from '../../components';
import { useShipStore } from '../../store/shipStore';
import StatCard from './components/StatCard';
import RecentActivity from './components/RecentActivity';
import ShipStatusOverview from './components/ShipStatusOverview';

const DashboardPage: React.FC = () => {
  const { ships, components, jobs, initializeData } = useShipStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Fleet Overview"
        subtitle="Monitor your entire fleet performance and maintenance status"
      />
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          lg: 'repeat(4, 1fr)' 
        },
        gap: 3, 
        mb: 4 
      }}>
        <StatCard
          title="Active Fleet"
          value={totalShips}
          subtitle={`${activeShips} vessels operational`}
          icon={<DirectionsBoat />}
          color="primary"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Critical Issues"
          value={overdueComponents}
          subtitle="Components need attention"
          icon={<Warning />}
          color="error"
          trend="-8%"
          trendUp={false}
        />
        <StatCard
          title="Active Jobs"
          value={jobsInProgress}
          subtitle={`${openJobs} pending, ${criticalJobs} urgent`}
          icon={<Build />}
          color="warning"
          trend="+5%"
          trendUp={true}
        />
        <StatCard
          title="Completed"
          value={completedJobs}
          subtitle="Jobs finished this month"
          icon={<Assignment />}
          color="success"
          trend="+18%"
          trendUp={true}
        />
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 4,
        flex: 1,
        alignItems: 'start'
      }}>
        <RecentActivity 
          jobs={jobs}
          ships={ships}
          components={components}
        />
        <ShipStatusOverview 
          ships={ships}
          components={components}
          jobs={jobs}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;
