import { useCallback, useMemo, useState } from 'react';
import { useNotifications } from './useNotifications';
import { prioritySort } from '../utils/prioritySort';
import { logger } from '../utils/logger';

export function usePriorityNotifications() {
  const [topCount, setTopCount] = useState(10);
  const { notifications, loading, error, typeFilter, updateTypeFilter, loadNotifications } = useNotifications('All');

  const prioritized = useMemo(() => {
    if (notifications.length === 0) return [];
    logger('frontend', 'debug', 'utils', `Running priority sort for top ${topCount}`);
    return prioritySort(notifications, topCount);
  }, [notifications, topCount]);

  const updateTopCount = useCallback((newCount) => {
    setTopCount(newCount);
  }, []);

  return {
    notifications,
    prioritized,
    loading,
    error,
    topCount,
    updateTopCount,
    typeFilter,
    updateTypeFilter,
    loadNotifications
  };
}
