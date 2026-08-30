import { useCallback, useEffect, useRef } from 'react';

interface NotificationOptions {
  title: string;
  options?: NotificationOptions;
}

export const useNotification = () => {
  const permissionRef = useRef<NotificationPermission | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      permissionRef.current = Notification.permission;
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    permissionRef.current = permission;
    return permission === 'granted';
  }, []);

  const notify = useCallback(
    (title: string, options?: Partial<NotificationOptions>) => {
      if (!('Notification' in window)) return;

      if (Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          ...options
        });
      }
    },
    []
  );

  const scheduleNotification = useCallback(
    (title: string, delay: number, options?: Partial<NotificationOptions>) => {
      const timeout = setTimeout(() => {
        notify(title, options);
      }, delay);

      return () => clearTimeout(timeout);
    },
    [notify]
  );

  return {
    hasPermission: permissionRef.current === 'granted',
    requestPermission,
    notify,
    scheduleNotification
  };
};

export default useNotification;
