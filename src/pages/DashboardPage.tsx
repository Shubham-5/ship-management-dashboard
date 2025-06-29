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
  Warning,
  TrendingUp,
  TrendingDown
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
    trend?: string;
    trendUp?: boolean;
  }> = ({ title, value, icon, color, subtitle, trend, trendUp }) => (
    <Card 
      sx={{ 
        height: '100%',
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          borderColor: `${color}.light`,
        }
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: `${color}.light`,
              color: `${color}.main`,
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trendUp ? (
                <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
              )}
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 600,
                  color: trendUp ? '#10b981' : '#ef4444',
                  fontSize: '0.75rem',
                }}
              >
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h3" 
            component="div" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              lineHeight: 1,
              mb: 1,
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            {value.toLocaleString()}
          </Typography>
          <Typography 
            color="text.primary" 
            variant="body1"
            sx={{ 
              fontWeight: 600,
              mb: 0.5,
              color: '#374151',
              fontSize: '0.875rem',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              color="text.secondary" 
              variant="caption"
              sx={{ 
                display: 'block', 
                color: '#6b7280',
                fontSize: '0.75rem',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const RecentActivity = () => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    }}>
      <CardContent sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: '#0f172a',
            fontSize: '1.25rem',
          }}>
            Recent Activity
          </Typography>
          <Chip 
            label={`${jobs.length} Total`} 
            size="small" 
            sx={{ 
              backgroundColor: '#f1f5f9',
              color: '#475569',
              fontWeight: 600,
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {jobs.slice(0, 6).map((job) => {
            const ship = ships.find(s => s.id === job.shipId);
            const component = components.find(c => c.id === job.componentId);
            
            return (
              <Paper 
                key={job.id} 
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: '#fafbfc',
                  '&:hover': {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    backgroundColor: '#ffffff',
                    transform: 'translateY(-1px)',
                  }
                }} 
                elevation={0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, pr: 2 }}>
                    <Typography variant="body1" fontWeight="600" sx={{ mb: 1, color: '#0f172a' }}>
                      {job.type} - {component?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Ship: {ship?.name} • Scheduled: {new Date(job.scheduledDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={job.status} 
                        size="small" 
                        color={job.status === 'Completed' ? 'success' : job.status === 'In Progress' ? 'warning' : 'default'}
                        sx={{ fontWeight: 500 }}
                      />
                      <Chip 
                        label={job.priority} 
                        size="small" 
                        color={job.priority === 'Critical' ? 'error' : job.priority === 'High' ? 'warning' : 'default'}
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: job.priority === 'Critical' ? '#ef4444' : job.priority === 'High' ? '#f59e0b' : '#10b981',
                    mt: 1,
                  }} />
                </Box>
              </Paper>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );

  const ShipStatusOverview = () => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    }}>
      <CardContent sx={{ flex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: '#0f172a',
            fontSize: '1.25rem',
          }}>
            Fleet Status
          </Typography>
          <Chip 
            label={`${ships.length} Ships`} 
            size="small" 
            sx={{ 
              backgroundColor: '#f1f5f9',
              color: '#475569',
              fontWeight: 600,
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {ships.slice(0, 4).map((ship) => {
            const shipComponents = components.filter(c => c.shipId === ship.id);
            const shipJobs = jobs.filter(j => j.shipId === ship.id);
            const criticalComponents = shipComponents.filter(c => c.status === 'Critical').length;
            
            return (
              <Paper 
                key={ship.id} 
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: '#fafbfc',
                  '&:hover': {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    backgroundColor: '#ffffff',
                    transform: 'translateY(-1px)',
                  }
                }} 
                elevation={0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: ship.status === 'Active' ? '#10b981' : ship.status === 'Under Maintenance' ? '#f59e0b' : '#6b7280',
                      }} />
                      <Typography variant="body1" fontWeight="600" sx={{ color: '#0f172a' }}>
                        {ship.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      IMO: {ship.imo} • Flag: {ship.flag}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      {shipComponents.length} components • {shipJobs.length} active jobs
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                    <Chip 
                      label={ship.status} 
                      size="small" 
                      color={ship.status === 'Active' ? 'success' : ship.status === 'Under Maintenance' ? 'warning' : 'default'}
                      sx={{ fontWeight: 500 }}
                    />
                    {criticalComponents > 0 && (
                      <Chip 
                        label={`${criticalComponents} Critical`} 
                        size="small" 
                        color="error"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
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
          Fleet Overview
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#64748b',
            fontWeight: 400,
            fontSize: '1.125rem',
          }}
        >
          Monitor your entire fleet performance and maintenance status
        </Typography>
      </Box>
      
      {/* KPI Cards */}
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

      {/* Content Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 4,
        flex: 1,
        alignItems: 'start'
      }}>
        <RecentActivity />
        <ShipStatusOverview />
      </Box>
    </Box>
  );
};

export default DashboardPage;
