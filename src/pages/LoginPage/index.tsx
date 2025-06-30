import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CardContent, Container } from '@mui/material';
import { DirectionsBoat } from '@mui/icons-material';
import { Card } from '../../components';
import { useAuthStore } from '../../store/authStore';
import LoginForm from './components/LoginForm';
import DemoCredentials from './components/DemoCredentials';
import type { LoginFormData } from './types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setLoginError('Invalid email or password');
      }
    } catch {
      setLoginError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ 
          width: '100%', 
          maxWidth: 480, 
          mx: 'auto',
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}>
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Box 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  backgroundColor: '#3b82f6',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <DirectionsBoat sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Typography 
                component="h1" 
                variant="h4" 
                sx={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  mb: 1,
                  textAlign: 'center',
                }}
              >
                FleetSync
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: '#64748b',
                  fontSize: '1rem',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                Sign in to manage your fleet
              </Typography>
            </Box>

            <LoginForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={loginError}
            />

            <DemoCredentials />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
