import { logger } from '../utils/logger';

const NOTIFICATIONS_URL = process.env.REACT_APP_NOTIFICATIONS_ENDPOINT || 'http://4.224.186.213/evaluation-service/notifications';

function buildQueryString(params) {
  const query = new URLSearchParams();

  if (params.limit) query.set('limit', String(params.limit));
  if (params.page) query.set('page', String(params.page));
  if (params.notification_type) query.set('notification_type', params.notification_type);

  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

function extractNotifications(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.notifications)) return payload.notifications;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export async function fetchNotifications(params = {}) {
  await logger('frontend', 'debug', 'api', 'Starting notifications fetch');

  const token = process.env.REACT_APP_ACCESS_TOKEN;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const url = `${NOTIFICATIONS_URL}${buildQueryString(params)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const notifications = extractNotifications(payload);
    await logger('frontend', 'info', 'api', `Fetched ${notifications.length} notifications`);
    return notifications;
  } catch (err) {
    await logger('frontend', 'error', 'api', `Notifications fetch failed: ${err.message}`);
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
