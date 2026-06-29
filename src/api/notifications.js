import { logger } from '../utils/logger';

const notificationsEndpoint = process.env.REACT_APP_NOTIFICATIONS_ENDPOINT || 'http://4.224.186.213/evaluation-service/notifications';

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  if (params.limit) {
    query.set('limit', String(params.limit));
  }

  if (params.page) {
    query.set('page', String(params.page));
  }

  if (params.notification_type) {
    query.set('notification_type', params.notification_type);
  }

  const queryText = query.toString();
  return queryText ? `?${queryText}` : '';
}

function parseNotifications(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.notifications)) {
    return payload.notifications;
  }

  return [];
}

export async function fetchNotifications(params = {}) {
  await logger('frontend', 'debug', 'api', 'Starting notifications fetch');

  const token = process.env.REACT_APP_ACCESS_TOKEN;
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 12000);

  try {
    const response = await fetch(`${notificationsEndpoint}${buildQuery(params)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      signal: abortController.signal
    });

    if (!response.ok) {
      throw new Error(`Failed notifications request with status ${response.status}`);
    }

    const payload = await response.json();
    const notifications = parseNotifications(payload);
    await logger('frontend', 'info', 'api', `Notifications fetch succeeded with ${notifications.length} items`);
    return notifications;
  } catch (error) {
    await logger('frontend', 'error', 'api', `Notifications fetch failed: ${error.message}`);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
