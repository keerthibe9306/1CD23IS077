import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import NavigationBar from './components/NavigationBar';
import NotificationsPage from './pages/NotificationsPage';
import PriorityPage from './pages/PriorityPage';
import { logger } from './utils/logger';

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#124170'
    },
    secondary: {
      main: '#f18701'
    },
    background: {
      default: '#f5f7fa'
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h5: {
      fontWeight: 700,
      color: '#1a1a2e'
    }
  }
});

function App() {
  useEffect(() => {
    logger('frontend', 'info', 'page', 'Application mounted and ready');
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <NavigationBar />
        <Box sx={{ px: { xs: 2, md: 4 }, py: 3, maxWidth: 1100, mx: 'auto' }}>
          <Routes>
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/priority" element={<PriorityPage />} />
            <Route path="*" element={<Navigate to="/notifications" replace />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
