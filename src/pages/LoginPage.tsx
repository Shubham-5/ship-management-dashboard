import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, DirectionsBoat } from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          backgroundColor: '#ffffff',
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
        }}>
          <CardContent sx={{ p: 6 }}>
            {/* Header */}
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

            {loginError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  backgroundColor: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#dc2626',
                  },
                }}
              >
                {loginError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                autoFocus
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
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
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{
                          color: '#64748b',
                          '&:hover': {
                            backgroundColor: '#f1f5f9',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ 
                  mt: 4, 
                  mb: 3,
                  py: 1.5,
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  },
                  '&:disabled': {
                    backgroundColor: '#9ca3af',
                    boxShadow: 'none',
                  },
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Box sx={{ 
                mt: 3, 
                p: 3, 
                backgroundColor: '#f8fafc', 
                borderRadius: 2,
                border: '1px solid #e2e8f0',
              }}>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Demo Credentials
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: '#64748b',
                      fontSize: '0.8125rem',
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                    }}
                  >
                    <strong>Admin:</strong> admin@entnt.in / admin123
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: '#64748b',
                      fontSize: '0.8125rem',
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                    }}
                  >
                    <strong>Inspector:</strong> inspector@entnt.in / inspect123
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: '#64748b',
                      fontSize: '0.8125rem',
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                    }}
                  >
                    <strong>Engineer:</strong> engineer@entnt.in / engine123
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
