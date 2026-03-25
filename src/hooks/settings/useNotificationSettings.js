import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';

export const useNotificationSettings = () => {
  const [isPrefsLoading, setIsPrefsLoading] = useState(true);
  const [prefs, setPrefs] = useState({ marketing: false, security: true });

  useEffect(() => {
    let cancelled = false;
    const fetchPrefs = async () => {
      setIsPrefsLoading(true);
      try {
        const user = await authService.getAccount();
        if (!cancelled && user) {
          setPrefs({
            marketing: user.prefs?.marketing ?? false,
            security: user.prefs?.security ?? true,
          });
        }
      } catch (err) {
        console.error('useNotificationSettings :: fetchPrefs', err);
      } finally {
        if (!cancelled) setIsPrefsLoading(false);
      }
    };
    fetchPrefs();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePrefChange = useCallback(
    async (key, value) => {
      const prev = { ...prefs };
      setPrefs((p) => ({ ...p, [key]: value }));
      try {
        await authService.updatePrefs({ ...prev, [key]: value });
        toast.success('Preference saved.');
      } catch {
        setPrefs(prev);
        toast.error('Failed to save preference.');
      }
    },
    [prefs],
  );

  return {
    prefs,
    isPrefsLoading,
    handlePrefChange,
  };
};
