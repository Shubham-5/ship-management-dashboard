import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Add, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button } from '../../components';
import { useShipStore } from '../../store/shipStore';
import QuickStats from './components/QuickStats';
import ReportGeneratorDialog from './components/ReportGeneratorDialog';
import ReportDisplay from './components/ReportDisplay';
import type { ReportFormData, ReportData } from './types';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ships, components, jobs, initializeData } = useShipStore();
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<ReportData | null>(null);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const generateFleetStatusReport = (data: ReportFormData) => {
    const filteredShips = data.shipIds.length > 0 
      ? ships.filter(ship => data.shipIds.includes(ship.id))
      : ships;

    return {
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

  const handleSubmit = (data: ReportFormData) => {
    try {
      let report;
      
      switch (data.type) {
        case 'fleet_status':
          report = generateFleetStatusReport(data);
          break;
        case 'maintenance_summary':
          report = generateMaintenanceSummary(data);
          break;
        case 'performance_analysis':
          report = {
            title: 'Performance Analysis Report',
            generatedAt: new Date().toISOString(),
            period: `${data.startDate} to ${data.endDate}`,
            summary: {
              message: 'Performance analysis shows overall fleet efficiency at 87%',
            },
            recommendations: [
              'Increase preventive maintenance frequency',
              'Replace critical components on MSC Oscar',
              'Schedule crew training for new equipment'
            ]
          };
          break;
        case 'cost_analysis':
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
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    if (!generatedReport) return;
    
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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate insights and reports for fleet management"
        action={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Assignment />}
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setGenerateDialogOpen(true)}
            >
              Generate Report
            </Button>
          </Box>
        }
      />

      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#f8fafc',
        p: 3,
      }}>
        <QuickStats
          ships={ships}
          jobs={jobs}
          components={components}
        />

        <ReportDisplay
          report={generatedReport}
          onExport={exportReport}
        />
      </Box>

      <ReportGeneratorDialog
        open={generateDialogOpen}
        onClose={() => setGenerateDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default ReportsPage;
