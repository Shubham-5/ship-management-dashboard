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
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Professional Header */}
      <Box sx={{ 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e2e8f0',
        p: 3,
        mb: 0,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: '2rem',
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              Reports & Analytics
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#64748b',
                fontSize: '1rem',
              }}
            >
              Generate insights and reports for fleet management
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Assignment />}
              onClick={() => navigate('/dashboard')}
              sx={{
                borderColor: '#d1d5db',
                color: '#374151',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              View Dashboard
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setGenerateDialogOpen(true)}
              sx={{
                backgroundColor: '#3b82f6',
                color: 'white',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: '#2563eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              Generate Report
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        p: 3, 
        height: 'calc(100% - 120px)',
        overflow: 'auto',
        backgroundColor: '#f8fafc',
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
        {/* Quick Stats Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
          gap: 3, 
          mb: 4,
        }}>
          <Card sx={{ 
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            borderRadius: 3,
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <TrendingUp sx={{ fontSize: 48, color: '#3b82f6', mb: 2 }} />
              <Typography 
                variant="h3" 
                sx={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#3b82f6',
                  mb: 1,
                }}
              >
                87%
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Fleet Efficiency
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            borderRadius: 3,
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <CheckCircle sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
              <Typography 
                variant="h3" 
                sx={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#10b981',
                  mb: 1,
                }}
              >
                {Math.round((jobs.filter(j => j.status === 'Completed').length / jobs.length) * 100)}%
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Completion Rate
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            borderRadius: 3,
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Warning sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
              <Typography 
                variant="h3" 
                sx={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#f59e0b',
                  mb: 1,
                }}
              >
                {components.filter(c => c.status === 'Critical').length}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Critical Components
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            borderRadius: 3,
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Assignment sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }} />
              <Typography 
                variant="h3" 
                sx={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#8b5cf6',
                  mb: 1,
                }}
              >
                {jobs.filter(j => j.status === 'Open' || j.status === 'In Progress').length}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: '#64748b',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Active Jobs
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content Card */}
        <Card sx={{ 
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          borderRadius: 3,
        }}>
          <CardContent sx={{ p: 4 }}>
            <Tabs 
              value={selectedTab} 
              onChange={(_, newValue) => setSelectedTab(newValue)} 
              sx={{ 
                mb: 4,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#64748b',
                  '&.Mui-selected': {
                    color: '#3b82f6',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#3b82f6',
                },
              }}
            >
              {tabLabels.map((label, index) => (
                <Tab key={index} label={label} />
              ))}
            </Tabs>

            {selectedTab === 0 && (
              <Box>
                {generatedReport ? (
                  <Paper sx={{ 
                    p: 4,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                      <Box>
                        <Typography 
                          variant="h5"
                          sx={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            mb: 2,
                          }}
                        >
                          {generatedReport.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontSize: '0.875rem',
                            mb: 1,
                          }}
                        >
                          Generated: {new Date(generatedReport.generatedAt).toLocaleString()}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontSize: '0.875rem',
                          }}
                        >
                          Period: {generatedReport.period}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => exportReport('pdf')}
                          sx={{
                            textTransform: 'none',
                            borderColor: '#d1d5db',
                            color: '#374151',
                            '&:hover': { borderColor: '#9ca3af' },
                          }}
                        >
                          Export PDF
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => exportReport('excel')}
                          sx={{
                            textTransform: 'none',
                            borderColor: '#d1d5db',
                            color: '#374151',
                            '&:hover': { borderColor: '#9ca3af' },
                          }}
                        >
                          Export Excel
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => exportReport('csv')}
                          sx={{
                            textTransform: 'none',
                            borderColor: '#d1d5db',
                            color: '#374151',
                            '&:hover': { borderColor: '#9ca3af' },
                          }}
                        >
                          Export CSV
                        </Button>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 3, borderColor: '#e2e8f0' }} />
                    
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        mb: 3,
                      }}
                    >
                      Summary
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                      gap: 3, 
                      mb: 4,
                    }}>
                      {Object.entries(generatedReport.summary).map(([key, value]) => (
                        <Paper 
                          key={key} 
                          sx={{ 
                            p: 3,
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: 2,
                          }} 
                          variant="outlined"
                        >
                          <Typography 
                            variant="caption" 
                            sx={{
                              color: '#64748b',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              display: 'block',
                              mb: 1,
                            }}
                          >
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Typography>
                          <Typography 
                            variant="h6"
                            sx={{
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: '#1e293b',
                            }}
                          >
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>

                    {generatedReport.jobsByType && (
                      <>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            mb: 3,
                          }}
                        >
                          Jobs by Type
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                          {Object.entries(generatedReport.jobsByType).map(([type, count]) => (
                            <Chip
                              key={type}
                              label={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`}
                              sx={{
                                backgroundColor: '#eff6ff',
                                color: '#3b82f6',
                                fontWeight: 600,
                                border: '1px solid #bfdbfe',
                                borderRadius: 2,
                              }}
                            />
                          ))}
                        </Box>
                      </>
                    )}

                    {generatedReport.recommendations && (
                      <>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            mb: 3,
                          }}
                        >
                          Recommendations
                        </Typography>
                        <Box 
                          component="ul" 
                          sx={{ 
                            pl: 3,
                            '& li': {
                              mb: 1,
                              color: '#475569',
                              fontSize: '0.875rem',
                              lineHeight: 1.6,
                            },
                          }}
                        >
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
                  <Alert 
                    severity="info"
                    sx={{
                      backgroundColor: '#eff6ff',
                      color: '#1e40af',
                      border: '1px solid #bfdbfe',
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        color: '#3b82f6',
                      },
                    }}
                  >
                    No reports generated yet. Click "Generate Report" to create your first report.
                  </Alert>
                )}
              </Box>
            )}

            {selectedTab === 1 && (
              <Alert 
                severity="info"
                sx={{
                  backgroundColor: '#eff6ff',
                  color: '#1e40af',
                  border: '1px solid #bfdbfe',
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#3b82f6',
                  },
                }}
              >
                Scheduled reports feature coming soon. You'll be able to set up automatic report generation.
              </Alert>
            )}

            {selectedTab === 2 && (
              <Alert 
                severity="info"
                sx={{
                  backgroundColor: '#eff6ff',
                  color: '#1e40af',
                  border: '1px solid #bfdbfe',
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#3b82f6',
                  },
                }}
              >
                Report templates feature coming soon. You'll be able to create and save custom report templates.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Generate Report Dialog */}
      <Dialog 
        open={generateDialogOpen} 
        onClose={() => setGenerateDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
          },
        }}
      >
        <DialogTitle sx={{ 
          p: 4, 
          pb: 2,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: '#0f172a',
              fontSize: '1.5rem',
              lineHeight: 1.2,
            }}
          >
            Generate New Report
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ 
          p: 4,
          backgroundColor: '#f8fafc',
        }}>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Report Type"
              margin="normal"
              {...register('type', { required: 'Report type is required' })}
              error={!!errors.type}
              helperText={errors.type?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  fontSize: '0.875rem',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: '#3b82f6',
                  },
                },
              }}
            >
              <MenuItem value="fleet_status">Fleet Status</MenuItem>
              <MenuItem value="maintenance_summary">Maintenance Summary</MenuItem>
              <MenuItem value="performance_analysis">Performance Analysis</MenuItem>
              <MenuItem value="cost_analysis">Cost Analysis</MenuItem>
            </TextField>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register('startDate', { required: 'Start date is required' })}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    fontSize: '0.875rem',
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#cbd5e1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#64748b',
                    '&.Mui-focused': {
                      color: '#3b82f6',
                    },
                  },
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    fontSize: '0.875rem',
                    '& fieldset': {
                      borderColor: '#e2e8f0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#cbd5e1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#64748b',
                    '&.Mui-focused': {
                      color: '#3b82f6',
                    },
                  },
                }}
              />
            </Box>

            <FormControl 
              fullWidth 
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  fontSize: '0.875rem',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: '#3b82f6',
                  },
                },
              }}
            >
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

            <Box sx={{ 
              mt: 3, 
              p: 3,
              backgroundColor: '#ffffff',
              borderRadius: 2,
              border: '1px solid #e2e8f0',
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
              }}>
                <input
                  type="checkbox"
                  {...register('includeDetails')}
                  style={{ 
                    marginRight: 12,
                    width: 16,
                    height: 16,
                    accentColor: '#3b82f6',
                  }}
                />
                Include detailed data in report
              </label>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 4, 
          pt: 3,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #f1f5f9',
          gap: 2,
        }}>
          <Button 
            onClick={() => setGenerateDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: '#d1d5db',
              color: '#374151',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            variant="contained"
            sx={{
              backgroundColor: '#3b82f6',
              color: 'white',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#2563eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsPage;
