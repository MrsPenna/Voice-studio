import { useEffect, useCallback } from 'react';

export interface UseOnlineStatusReturn {
  isOnline: boolean;
}

export const useOnlineStatus = (): UseOnlineStatusReturn => {
  const getOnlineStatus = useCallback(() => {
    return navigator.onLine;
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      window.dispatchEvent(new CustomEvent('online-status-change', { detail: true }));
    };

    const handleOffline = () => {
      window.dispatchEvent(new CustomEvent('online-status-change', { detail: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline: getOnlineStatus()
  };
};

export default useOnlineStatus;
