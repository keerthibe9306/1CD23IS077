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
  const {
    prioritized,
    loading,
    error,
    topCount,
    updateTopCount,
    typeFilter,
    updateTypeFilter
  } = usePriorityNotifications();

  const [viewedIds, setViewedIds] = useState([]);
  const viewedSet = useMemo(() => new Set(viewedIds), [viewedIds]);

  const handleTopCountChange = (event) => {
    const val = Number(event.target.value);
    updateTopCount(val);
    logger('frontend', 'debug', 'component', `Priority count set to ${val}`);
  };

  const handleFilterChange = (event) => {
    const selected = event.target.value;
    updateTypeFilter(selected);
    logger('frontend', 'debug', 'component', `Priority filter changed to ${selected}`);
  };

  const handleMarkViewed = (notifId) => {
    if (viewedSet.has(notifId)) return;
    setViewedIds((prev) => [...prev, notifId]);
    logger('frontend', 'info', 'component', `Priority notification viewed: ${notifId}`);
  };

  const deriveId = (notification) => {
    return notification.id
      || notification.notification_id
      || `${notification.message || notification.title || 'n'}-${notification.timestamp || notification.createdAt || notification.created_at}`;
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Priority Inbox</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ width: { xs: '100%', sm: 200 } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="priority-count-label">Top N</InputLabel>
            <Select
              labelId="priority-count-label"
              value={String(topCount)}
              label="Top N"
              onChange={handleTopCountChange}
            >
              <MenuItem value="10">Top 10</MenuItem>
              <MenuItem value="15">Top 15</MenuItem>
              <MenuItem value="20">Top 20</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 200 } }}>
          <FormControl fullWidth size="small">
            <InputLabel id="priority-filter-label">Filter by Type</InputLabel>
            <Select
              labelId="priority-filter-label"
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
      </Stack>

      {loading && (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 4 }}>
          <CircularProgress size={28} />
          <Typography>Building priority inbox...</Typography>
        </Stack>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && prioritized.length === 0 && (
        <Alert severity="info">No priority notifications match this criteria.</Alert>
      )}

      {!loading && !error && prioritized.length > 0 && (
        <Stack spacing={1.5}>
          {prioritized.map((notif, idx) => {
            const nid = deriveId(notif);
            return (
              <NotificationCard
                key={nid}
                notification={notif}
                isViewed={viewedSet.has(nid)}
                onMarkViewed={handleMarkViewed}
                rank={idx + 1}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

export default PriorityPage;
