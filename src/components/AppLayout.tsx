import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { useUIStore } from '@store/uiStore';
import { lightTheme, darkTheme } from '@theme/index';
import ErrorBoundary from '@components/ErrorBoundary';
import LoadingSpinner from '@components/LoadingSpinner';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isDarkMode, isInitializing } = useUIStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingSpinner isLoading={isInitializing} message="Initializing application..." />
        <Box
          sx={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: 'background.default'
          }}
        >
          <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
            {children}
          </Container>
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default AppLayout;
