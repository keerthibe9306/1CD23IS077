import { useCallback, useEffect, useState } from 'react';
import { fetchNotifications } from '../api/notifications';
import { logger } from '../utils/logger';

export function useNotifications(initialFilter) {
  const [typeFilter, setTypeFilter] = useState(initialFilter || 'All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = { limit: 100, page: 1 };
      if (typeFilter !== 'All') {
        params.notification_type = typeFilter;
      }

      const result = await fetchNotifications(params);
      setNotifications(Array.isArray(result) ? result : []);
    } catch (fetchError) {
      setNotifications([]);
      if (fetchError?.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Unable to load notifications right now.');
      }
      logger('frontend', 'error', 'hook', `useNotifications failed: ${fetchError.message}`);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const updateTypeFilter = useCallback((newFilter) => {
    setTypeFilter(newFilter);
  }, []);

  return {
    notifications,
    loading,
    error,
    typeFilter,
    updateTypeFilter,
    loadNotifications
  };
}
