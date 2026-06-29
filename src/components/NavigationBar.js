import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Link, useLocation } from 'react-router-dom';

function NavigationBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={3} sx={{ backgroundColor: '#124170' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsActiveIcon />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            Campus Notifications
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/notifications"
            variant={isActive('/notifications') ? 'outlined' : 'text'}
            sx={{
              borderColor: isActive('/notifications') ? 'rgba(255,255,255,0.6)' : 'transparent',
              fontWeight: isActive('/notifications') ? 700 : 400
            }}
          >
            All Notifications
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/priority"
            variant={isActive('/priority') ? 'outlined' : 'text'}
            sx={{
              borderColor: isActive('/priority') ? 'rgba(255,255,255,0.6)' : 'transparent',
              fontWeight: isActive('/priority') ? 700 : 400
            }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
