import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import NotificationCard from '../components/NotificationCard';
import { useNotifications } from '../hooks/useNotifications';
import { logger } from '../utils/logger';

function NotificationsPage() {
  const { notifications, loading, error, typeFilter, updateTypeFilter } = useNotifications('All');
  const [viewedIds, setViewedIds] = useState([]);

  const viewedSet = useMemo(() => new Set(viewedIds), [viewedIds]);

  const handleMarkViewed = (id) => {
    if (viewedSet.has(id)) {
      return;
    }

    setViewedIds((currentViewedIds) => [...currentViewedIds, id]);
    logger('frontend', 'info', 'component', `Notification viewed: ${id}`);
  };

  const handleFilterChange = (event) => {
    const selectedType = event.target.value;
    updateTypeFilter(selectedType);
    logger('frontend', 'debug', 'component', `All notifications filter changed to ${selectedType}`);
  };

  return (
    <Stack spacing={2.5}>
      <Typography variant="h5">All Notifications</Typography>

      <Box sx={{ width: { xs: '100%', sm: 240 } }}>
        <FormControl fullWidth size="small">
          <InputLabel id="notifications-filter-label">Filter</InputLabel>
          <Select labelId="notifications-filter-label" value={typeFilter} label="Filter" onChange={handleFilterChange}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CircularProgress size={26} />
          <Typography>Loading notifications...</Typography>
        </Stack>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && notifications.length === 0 && <Alert severity="info">No notifications found for this filter.</Alert>}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5}>
          {notifications.map((notification) => {
            const notificationId =
              notification.id ||
              notification.notification_id ||
              `${notification.message || notification.title || 'notification'}-${notification.timestamp || notification.createdAt || notification.created_at}`;

            return (
              <NotificationCard
                key={notificationId}
                notification={notification}
                isViewed={viewedSet.has(notificationId)}
                onMarkViewed={handleMarkViewed}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

export default NotificationsPage;
