import { useCallback, useMemo, useState } from 'react';
import { useNotifications } from './useNotifications';
import { prioritySort } from '../utils/prioritySort';
import { logger } from '../utils/logger';

export function usePriorityNotifications() {
  const [topCount, setTopCount] = useState(10);
  const { notifications, loading, error, typeFilter, updateTypeFilter, reloadNotifications } = useNotifications('All');

  const prioritizedNotifications = useMemo(() => {
    logger('frontend', 'debug', 'utils', `Running priority sort for top ${topCount}`);
    return prioritySort(notifications, topCount);
  }, [notifications, topCount]);

  const updateTopCount = useCallback((newCount) => {
    setTopCount(newCount);
  }, []);

  return {
    notifications,
    prioritizedNotifications,
    loading,
    error,
    topCount,
    updateTopCount,
    typeFilter,
    updateTypeFilter,
    reloadNotifications
  };
}
