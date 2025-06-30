import React, { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { Button } from '../../../../components';
import type { LoginFormProps, LoginFormData } from '../../types';

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
      {error && (
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
          {error}
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
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '&:hover': {
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
      </Box>
    </Box>
  );
};

export default LoginForm;
