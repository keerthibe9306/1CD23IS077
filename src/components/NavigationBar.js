import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

function NavigationBar() {
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Campus Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/notifications"
            variant={location.pathname === '/notifications' ? 'outlined' : 'text'}
          >
            All Notifications
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/priority"
            variant={location.pathname === '/priority' ? 'outlined' : 'text'}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
