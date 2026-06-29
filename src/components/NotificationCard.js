import React from 'react';
import { Card, CardActionArea, Chip, Stack, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { formatDistanceToNow } from 'date-fns';

const TYPE_STYLES = {
  Placement: { bg: '#dbeafe', color: '#1d4ed8' },
  Result: { bg: '#dcfce7', color: '#15803d' },
  Event: { bg: '#ffedd5', color: '#c2410c' }
};

function getTimestamp(notification) {
  return notification.timestamp || notification.createdAt || notification.created_at;
}

function getMessage(notification) {
  return notification.message || notification.title || 'Untitled notification';
}

function getNotificationId(notification) {
  return notification.id || notification.notification_id || `${getMessage(notification)}-${getTimestamp(notification)}`;
}

function NotificationCard({ notification, isViewed, onMarkViewed, rank }) {
  const notifType = notification.notification_type || notification.type || 'Event';
  const timestamp = getTimestamp(notification);
  const chipStyle = TYPE_STYLES[notifType] || TYPE_STYLES.Event;
  const message = getMessage(notification);
  const cardId = getNotificationId(notification);

  let relativeTime = 'Unknown time';
  if (timestamp) {
    try {
      relativeTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (_e) {
      relativeTime = 'Unknown time';
    }
  }

  return (
    <Card
      sx={{
        border: isViewed ? '1px solid #d1d5db' : '2px solid #93c5fd',
        backgroundColor: isViewed ? '#fafafa' : '#eff6ff',
        opacity: isViewed ? 0.75 : 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-1px)'
        }
      }}
    >
      <CardActionArea onClick={() => onMarkViewed(cardId)} sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              {typeof rank === 'number' && (
                <Chip
                  label={`#${rank}`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 700, minWidth: 40 }}
                />
              )}
              <Chip
                label={notifType}
                size="small"
                sx={{
                  backgroundColor: chipStyle.bg,
                  color: chipStyle.color,
                  fontWeight: 600
                }}
              />
              {isViewed ? (
                <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 20 }} />
              ) : (
                <FiberNewIcon sx={{ color: '#dc2626', fontSize: 20 }} />
              )}
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {relativeTime}
            </Typography>
          </Stack>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: isViewed ? 400 : 600 }}>
              {message}
            </Typography>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

export default NotificationCard;
