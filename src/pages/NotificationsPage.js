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

  const handleMarkViewed = (notifId) => {
    if (viewedSet.has(notifId)) return;
    setViewedIds((prev) => [...prev, notifId]);
    logger('frontend', 'info', 'component', `Notification marked viewed: ${notifId}`);
  };

  const handleFilterChange = (event) => {
    const selected = event.target.value;
    updateTypeFilter(selected);
    logger('frontend', 'debug', 'component', `Filter changed to ${selected}`);
  };

  const deriveId = (notification) => {
    return notification.id
      || notification.notification_id
      || `${notification.message || notification.title || 'n'}-${notification.timestamp || notification.createdAt || notification.created_at}`;
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">All Notifications</Typography>

      <Box sx={{ width: { xs: '100%', sm: 240 } }}>
        <FormControl fullWidth size="small">
          <InputLabel id="notif-filter-label">Filter by Type</InputLabel>
          <Select
            labelId="notif-filter-label"
            value={typeFilter}
            label="Filter by Type"
            onChange={handleFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 4 }}>
          <CircularProgress size={28} />
          <Typography>Loading notifications...</Typography>
        </Stack>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found for this filter.</Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5}>
          {notifications.map((notif) => {
            const nid = deriveId(notif);
            return (
              <NotificationCard
                key={nid}
                notification={notif}
                isViewed={viewedSet.has(nid)}
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
