import React from 'react';
import { Box, Typography, Paper, Divider, Chip, Alert } from '@mui/material';
import { Card, Button } from '../../../../components';
import type { ReportDisplayProps } from '../../types';

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, onExport }) => {
  if (!report) {
    return (
      <Card>
        <Alert 
          severity="info"
          sx={{
            backgroundColor: '#eff6ff',
            color: '#1e40af',
            border: '1px solid #bfdbfe',
            '& .MuiAlert-icon': {
              color: '#3b82f6',
            },
          }}
        >
          No reports generated yet. Click "Generate Report" to create your first report.
        </Alert>
      </Card>
    );
  }

  return (
    <Card>
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
            {report.title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              fontSize: '0.875rem',
              mb: 1,
            }}
          >
            Generated: {new Date(report.generatedAt).toLocaleString()}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748b',
              fontSize: '0.875rem',
            }}
          >
            Period: {report.period}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => onExport('pdf')}
          >
            Export PDF
          </Button>
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => onExport('excel')}
          >
            Export Excel
          </Button>
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => onExport('csv')}
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
        {Object.entries(report.summary).map(([key, value]) => (
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

      {report.jobsByType && (
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
            {Object.entries(report.jobsByType).map(([type, count]) => (
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

      {report.recommendations && (
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
            {report.recommendations.map((rec: string, index: number) => (
              <li key={index}>
                <Typography variant="body2">{rec}</Typography>
              </li>
            ))}
          </Box>
        </>
      )}
    </Card>
  );
};

export default ReportDisplay;
