function getWeight(notificationType) {
  if (notificationType === 'Placement') {
    return 3;
  }

  if (notificationType === 'Result') {
    return 2;
  }

  if (notificationType === 'Event') {
    return 1;
  }

  return 0;
}

function getRecencyScore(timestamp) {
  const currentSeconds = Date.now() / 1000;
  const notificationSeconds = new Date(timestamp).getTime() / 1000;

  if (!Number.isFinite(notificationSeconds)) {
    return 0;
  }

  const ageInSeconds = Math.max(0, currentSeconds - notificationSeconds);
  return 1 / (1 + ageInSeconds / 3600);
}

export function prioritySort(notifications, n) {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return [];
  }

  const requestedCount = Number.isFinite(n) && n > 0 ? n : notifications.length;

  return [...notifications]
    .map((notification) => {
      const type = notification.notification_type || notification.type || '';
      const timestamp = notification.timestamp || notification.createdAt || notification.created_at;
      const weight = getWeight(type);
      const recencyScore = getRecencyScore(timestamp);
      const priorityScore = weight + recencyScore;

      return {
        ...notification,
        priorityScore
      };
    })
    .sort((left, right) => {
      if (right.priorityScore !== left.priorityScore) {
        return right.priorityScore - left.priorityScore;
      }

      const leftTime = new Date(left.timestamp || left.createdAt || left.created_at).getTime();
      const rightTime = new Date(right.timestamp || right.createdAt || right.created_at).getTime();
      return rightTime - leftTime;
    })
    .slice(0, requestedCount);
}
