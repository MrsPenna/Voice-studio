import React, { useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoadingSpinnerProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}
    >
      <CircularProgress size={60} />
      {message && (
        <Box sx={{ mt: 2, textAlign: 'center', fontSize: '1rem', color: 'text.secondary' }}>
          {message}
        </Box>
      )}
    </Box>
  );
};

export default LoadingSpinner;
