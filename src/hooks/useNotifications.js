import { useCallback, useEffect, useState } from 'react';
import { fetchNotifications } from '../api/notifications';
import { logger } from '../utils/logger';

export function useNotifications(initialTypeFilter = 'All') {
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reloadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        limit: 100,
        page: 1
      };

      if (typeFilter !== 'All') {
        params.notification_type = typeFilter;
      }

      const response = await fetchNotifications(params);
      setNotifications(Array.isArray(response) ? response : []);
    } catch (requestError) {
      setNotifications([]);
      setError(requestError?.name === 'AbortError' ? 'Request timed out. Try again.' : 'Unable to fetch notifications right now.');
      logger('frontend', 'error', 'hook', `useNotifications failed: ${requestError.message}`);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    reloadNotifications();
  }, [reloadNotifications]);

  const updateTypeFilter = useCallback((newType) => {
    setTypeFilter(newType);
  }, []);

  return {
    notifications,
    loading,
    error,
    typeFilter,
    updateTypeFilter,
    reloadNotifications
  };
}
