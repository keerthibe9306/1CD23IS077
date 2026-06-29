function getWeight(notificationType) {
  const weights = { Placement: 3, Result: 2, Event: 1 };
  return weights[notificationType] || 0;
}

function getRecencyScore(timestamp) {
  const nowInSeconds = Date.now() / 1000;
  const notifSeconds = new Date(timestamp).getTime() / 1000;

  if (!Number.isFinite(notifSeconds)) return 0;

  const ageInSeconds = Math.max(0, nowInSeconds - notifSeconds);
  return 1 / (1 + ageInSeconds / 3600);
}

export function prioritySort(notifications, n) {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return [];
  }

  const count = Number.isFinite(n) && n > 0 ? n : notifications.length;

  const scored = notifications.map((item) => {
    const type = item.notification_type || item.type || '';
    const ts = item.timestamp || item.createdAt || item.created_at;
    const weight = getWeight(type);
    const recency = getRecencyScore(ts);
    const priorityScore = weight + recency;

    return { ...item, priorityScore };
  });

  scored.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    const timeA = new Date(a.timestamp || a.createdAt || a.created_at).getTime();
    const timeB = new Date(b.timestamp || b.createdAt || b.created_at).getTime();
    return timeB - timeA;
  });

  return scored.slice(0, count);
}
