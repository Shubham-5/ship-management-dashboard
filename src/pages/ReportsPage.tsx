import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Alert,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  Add,
  Assignment,
  TrendingUp,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useShipStore } from '../store/shipStore';

interface ReportFormData {
  type: 'fleet_status' | 'maintenance_summary' | 'performance_analysis' | 'cost_analysis';
  startDate: string;
  endDate: string;
  shipIds: string[];
  includeDetails: boolean;
}

interface ReportData {
  title: string;
  generatedAt: string;
  period: string;
  summary: Record<string, unknown>;
  details?: unknown[];
  jobsByType?: Record<string, number>;
  recommendations?: string[];
}

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ships, components, jobs, initializeData } = useShipStore();
  const [selectedTab, setSelectedTab] = useState(0);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<ReportData | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ReportFormData>();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const generateFleetStatusReport = (data: ReportFormData) => {
    const filteredShips = data.shipIds.length > 0 
      ? ships.filter(ship => data.shipIds.includes(ship.id))
      : ships;

    const report = {
      title: 'Fleet Status Report',
      generatedAt: new Date().toISOString(),
      period: `${data.startDate} to ${data.endDate}`,
      summary: {
        totalShips: filteredShips.length,
        activeShips: filteredShips.filter(s => s.status === 'Active').length,
        underMaintenance: filteredShips.filter(s => s.status === 'Under Maintenance').length,
        inactiveShips: filteredShips.filter(s => s.status === 'Inactive').length,
        totalComponents: components.filter(c => filteredShips.some(s => s.id === c.shipId)).length,
        criticalComponents: components.filter(c => 
          c.status === 'Critical' && filteredShips.some(s => s.id === c.shipId)
        ).length
      },
      details: data.includeDetails ? filteredShips.map(ship => ({
        ...ship,
        componentCount: components.filter(c => c.shipId === ship.id).length,
        activeJobs: jobs.filter(j => j.shipId === ship.id && j.status !== 'Completed').length,
        criticalComponents: components.filter(c => c.shipId === ship.id && c.status === 'Critical').length
      })) : undefined
    };

    return report;
  };

  const generateMaintenanceSummary = (data: ReportFormData) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    const filteredJobs = jobs.filter(job => {
      const jobDate = new Date(job.scheduledDate);
      const matchesDate = jobDate >= startDate && jobDate <= endDate;
      const matchesShip = data.shipIds.length === 0 || data.shipIds.includes(job.shipId);
      return matchesDate && matchesShip;
    });

    return {
      title: 'Maintenance Summary Report',
      generatedAt: new Date().toISOString(),
      period: `${data.startDate} to ${data.endDate}`,
      summary: {
        totalJobs: filteredJobs.length,
        completedJobs: filteredJobs.filter(j => j.status === 'Completed').length,
        inProgressJobs: filteredJobs.filter(j => j.status === 'In Progress').length,
        openJobs: filteredJobs.filter(j => j.status === 'Open').length,
        criticalPriority: filteredJobs.filter(j => j.priority === 'Critical').length,
        highPriority: filteredJobs.filter(j => j.priority === 'High').length,
        completionRate: filteredJobs.length > 0 
          ? Math.round((filteredJobs.filter(j => j.status === 'Completed').length / filteredJobs.length) * 100)
          : 0
      },
      jobsByType: {
        inspection: filteredJobs.filter(j => j.type === 'Inspection').length,
        repair: filteredJobs.filter(j => j.type === 'Repair').length,
        replacement: filteredJobs.filter(j => j.type === 'Replacement').length,
        preventive: filteredJobs.filter(j => j.type === 'Preventive').length
      },
      details: data.includeDetails ? filteredJobs : undefined
    };
  };

  const onSubmit = (data: ReportFormData) => {
    let report;
    
    switch (data.type) {
      case 'fleet_status':
        report = generateFleetStatusReport(data);
        break;
      case 'maintenance_summary':
        report = generateMaintenanceSummary(data);
        break;
      case 'performance_analysis':
        // Simplified performance analysis
        report = {
          title: 'Performance Analysis Report',
          generatedAt: new Date().toISOString(),
          period: `${data.startDate} to ${data.endDate}`,
          summary: {
            message: 'Performance analysis shows overall fleet efficiency at 87%',
            recommendations: [
              'Increase preventive maintenance frequency',
              'Replace critical components on MSC Oscar',
              'Schedule crew training for new equipment'
            ]
          }
        };
        break;
      case 'cost_analysis':
        // Simplified cost analysis
        report = {
          title: 'Cost Analysis Report',
          generatedAt: new Date().toISOString(),
          period: `${data.startDate} to ${data.endDate}`,
          summary: {
            estimatedCosts: {
              maintenance: '$125,000',
              operations: '$450,000',
              repairs: '$75,000',
              total: '$650,000'
            },
            comparison: 'Costs reduced by 12% compared to previous period'
          }
        };
        break;
      default:
        report = { 
          title: 'Unknown Report Type', 
          generatedAt: new Date().toISOString(),
          period: `${data.startDate} to ${data.endDate}`,
          summary: { message: 'Report type not recognized' } 
        };
    }

    setGeneratedReport(report);
    setGenerateDialogOpen(false);
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    if (!generatedReport) return;
    
    // Simulate export functionality
    const reportData = JSON.stringify(generatedReport, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedReport.title.toLowerCase().replace(/\s+/g, '_')}.${format === 'pdf' ? 'json' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabLabels = ['Generated Reports', 'Scheduled Reports', 'Templates'];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Reports & Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setGenerateDialogOpen(true)}
          >
            Generate Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            onClick={() => navigate('/dashboard')}
          >
            View Dashboard
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" color="primary.main">
              87%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fleet Efficiency
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" color="success.main">
              {Math.round((jobs.filter(j => j.status === 'Completed').length / jobs.length) * 100)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completion Rate
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Warning sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" color="warning.main">
              {components.filter(c => c.status === 'Critical').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Critical Components
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4" color="info.main">
              {jobs.filter(j => j.status === 'Open' || j.status === 'In Progress').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Jobs
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ mb: 3 }}>
            {tabLabels.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>

          {selectedTab === 0 && (
            <Box>
              {generatedReport ? (
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">{generatedReport.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" onClick={() => exportReport('pdf')}>Export PDF</Button>
                      <Button size="small" onClick={() => exportReport('excel')}>Export Excel</Button>
                      <Button size="small" onClick={() => exportReport('csv')}>Export CSV</Button>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generated: {new Date(generatedReport.generatedAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Period: {generatedReport.period}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>Summary</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    {Object.entries(generatedReport.summary).map(([key, value]) => (
                      <Paper key={key} sx={{ p: 2, minWidth: 120 }} variant="outlined">
                        <Typography variant="caption" color="text.secondary">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Typography>
                        <Typography variant="h6">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>

                  {generatedReport.jobsByType && (
                    <>
                      <Typography variant="h6" gutterBottom>Jobs by Type</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                        {Object.entries(generatedReport.jobsByType).map(([type, count]) => (
                          <Chip
                            key={type}
                            label={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </>
                  )}

                  {generatedReport.recommendations && (
                    <>
                      <Typography variant="h6" gutterBottom>Recommendations</Typography>
                      <Box component="ul" sx={{ pl: 3 }}>
                        {generatedReport.recommendations.map((rec: string, index: number) => (
                          <li key={index}>
                            <Typography variant="body2">{rec}</Typography>
                          </li>
                        ))}
                      </Box>
                    </>
                  )}
                </Paper>
              ) : (
                <Alert severity="info">
                  No reports generated yet. Click "Generate Report" to create your first report.
                </Alert>
              )}
            </Box>
          )}

          {selectedTab === 1 && (
            <Alert severity="info">
              Scheduled reports feature coming soon. You'll be able to set up automatic report generation.
            </Alert>
          )}

          {selectedTab === 2 && (
            <Alert severity="info">
              Report templates feature coming soon. You'll be able to create and save custom report templates.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Generate Report Dialog */}
      <Dialog open={generateDialogOpen} onClose={() => setGenerateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate New Report</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Report Type"
              margin="normal"
              {...register('type', { required: 'Report type is required' })}
              error={!!errors.type}
              helperText={errors.type?.message}
            >
              <MenuItem value="fleet_status">Fleet Status</MenuItem>
              <MenuItem value="maintenance_summary">Maintenance Summary</MenuItem>
              <MenuItem value="performance_analysis">Performance Analysis</MenuItem>
              <MenuItem value="cost_analysis">Cost Analysis</MenuItem>
            </TextField>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register('startDate', { required: 'Start date is required' })}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
              />
              <TextField
                fullWidth
                label="End Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register('endDate', { required: 'End date is required' })}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
              />
            </Box>

            <FormControl fullWidth margin="normal">
              <InputLabel>Ships (Leave empty for all)</InputLabel>
              <Select
                multiple
                {...register('shipIds')}
                renderValue={(selected) => 
                  ships.filter(ship => (selected as string[]).includes(ship.id))
                    .map(ship => ship.name).join(', ')
                }
              >
                {ships.map((ship) => (
                  <MenuItem key={ship.id} value={ship.id}>
                    {ship.name} ({ship.imo})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <label>
                <input
                  type="checkbox"
                  {...register('includeDetails')}
                  style={{ marginRight: 8 }}
                />
                Include detailed data in report
              </label>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsPage;
