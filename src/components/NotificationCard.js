import React from 'react';
import { Card, CardActionArea, Chip, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { formatDistanceToNow } from 'date-fns';

function getTypeColor(type) {
  if (type === 'Placement') {
    return { bg: '#dbeafe', text: '#1d4ed8' };
  }

  if (type === 'Result') {
    return { bg: '#dcfce7', text: '#15803d' };
  }

  return { bg: '#ffedd5', text: '#c2410c' };
}

function getTimestampValue(notification) {
  return notification.timestamp || notification.createdAt || notification.created_at;
}

function getMessageValue(notification) {
  return notification.message || notification.title || 'Untitled notification';
}

function getIdValue(notification) {
  return notification.id || notification.notification_id || `${getMessageValue(notification)}-${getTimestampValue(notification)}`;
}

function NotificationCard({ notification, isViewed, onMarkViewed, rank }) {
  const notificationType = notification.notification_type || notification.type || 'Event';
  const timestamp = getTimestampValue(notification);
  const chipColors = getTypeColor(notificationType);
  const relativeTime = timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : 'Unknown time';
  const message = getMessageValue(notification);
  const id = getIdValue(notification);

  return (
    <Card
      sx={{
        border: isViewed ? '1px solid #d1d5db' : '1px solid #bfdbfe',
        backgroundColor: isViewed ? '#f9fafb' : '#eff6ff',
        opacity: isViewed ? 0.78 : 1
      }}
    >
      <CardActionArea onClick={() => onMarkViewed(id)}>
        <Stack spacing={1} sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              {typeof rank === 'number' && <Chip label={`Rank #${rank}`} color="primary" size="small" />}
              <Chip
                label={notificationType}
                size="small"
                sx={{
                  backgroundColor: chipColors.bg,
                  color: chipColors.text,
                  fontWeight: 700
                }}
              />
              {isViewed ? <CheckCircleIcon color="success" fontSize="small" /> : <FiberNewIcon color="error" fontSize="small" />}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {relativeTime}
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ fontWeight: isViewed ? 500 : 700 }}>
            {message}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

export default NotificationCard;
