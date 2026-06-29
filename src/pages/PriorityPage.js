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
import { usePriorityNotifications } from '../hooks/usePriorityNotifications';
import { logger } from '../utils/logger';

function PriorityPage() {
  const { prioritizedNotifications, loading, error, topCount, updateTopCount, typeFilter, updateTypeFilter } =
    usePriorityNotifications();
  const [viewedIds, setViewedIds] = useState([]);

  const viewedSet = useMemo(() => new Set(viewedIds), [viewedIds]);

  const handleTopCountChange = (event) => {
    const selectedTopCount = Number(event.target.value);
    updateTopCount(selectedTopCount);
    logger('frontend', 'debug', 'component', `Priority top count changed to ${selectedTopCount}`);
  };

  const handleFilterChange = (event) => {
    const selectedType = event.target.value;
    updateTypeFilter(selectedType);
    logger('frontend', 'debug', 'component', `Priority filter changed to ${selectedType}`);
  };

  const handleMarkViewed = (id) => {
    if (viewedSet.has(id)) {
      return;
    }

    setViewedIds((currentViewedIds) => [...currentViewedIds, id]);
    logger('frontend', 'info', 'component', `Priority notification viewed: ${id}`);
  };

  return (
    <Stack spacing={2.5}>
      <Typography variant="h5">Priority Inbox</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ width: { xs: '100%', sm: 220 } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="priority-count-label">Top N</InputLabel>
            <Select labelId="priority-count-label" value={String(topCount)} label="Top N" onChange={handleTopCountChange}>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="15">15</MenuItem>
              <MenuItem value="20">20</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 220 } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="priority-filter-label">Filter</InputLabel>
            <Select labelId="priority-filter-label" value={typeFilter} label="Filter" onChange={handleFilterChange}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>

      {loading && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CircularProgress size={26} />
          <Typography>Building your priority inbox...</Typography>
        </Stack>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && prioritizedNotifications.length === 0 && (
        <Alert severity="info">No priority notifications found for this setup.</Alert>
      )}

      {!loading && !error && prioritizedNotifications.length > 0 && (
        <Stack spacing={1.5}>
          {prioritizedNotifications.map((notification, index) => {
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
                rank={index + 1}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

export default PriorityPage;
