import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useDarkMode from '../common/useDarkMode';
import { authService } from '@/services/auth';
import { clearAuthUser } from '@/store/auth';

export const useSettings = () => {
  const [isDarkMode, setDarkMode] = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local UI state
  const [loadingState, setLoadingState] = useState({
    isBusy: false,
    isPrefsLoading: true,
  });
  const [prefs, setPrefs] = useState({
    marketing: false,
    security: true,
  });

  useEffect(() => {
    // Keep local theme state aligned with any external class changes on <html>.
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDarkNow = document.documentElement.classList.contains('dark');
          if (isDarkNow !== isDarkMode) setDarkMode(isDarkNow);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [isDarkMode, setDarkMode]);

  useEffect(() => {
    let mounted = true;

    const fetchPrefs = async () => {
      try {
        const user = await authService.getAccount();
        if (mounted && user) {
          setPrefs({
            marketing: user.prefs?.marketing ?? false,
            security: user.prefs?.security ?? true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        if (mounted) {
          setLoadingState((prev) => ({ ...prev, isPrefsLoading: false }));
        }
      }
    };
    fetchPrefs();
    return () => {
      mounted = false;
    };
  }, []);

  // Theme updates are local-only; no server round trip required.
  const handleToggleDarkMode = useCallback(
    (checked) => {
      setDarkMode(checked);
      toast.success(`Theme switched to ${checked ? 'Dark' : 'Light'}`);
    },
    [setDarkMode],
  );

  const handlePrefChange = useCallback(
    async (key, value) => {
      const oldPrefs = { ...prefs };
      setPrefs((prev) => ({ ...prev, [key]: value }));
      try {
        // Optimistically update the toggle and roll back if Appwrite rejects the change.
        await authService.updatePrefs({ ...oldPrefs, [key]: value });
        toast.success('Preference saved.');
      } catch {
        setPrefs(oldPrefs);
        toast.error('Failed to save preference.');
      }
    },
    [prefs],
  );

  const handleDeleteSessions = useCallback(async () => {
    if (loadingState.isBusy) return;
    setLoadingState((prev) => ({ ...prev, isBusy: true }));
    try {
      // Force all sessions invalid, then clear local auth state to avoid stale UI.
      await authService.deleteAllSessions();
      dispatch(clearAuthUser());
      navigate('/login');
      toast.success('Logged out from all devices!');
    } catch {
      toast.error('Failed to delete sessions.');
    } finally {
      setLoadingState((prev) => ({ ...prev, isBusy: false }));
    }
  }, [dispatch, navigate, loadingState.isBusy]);

  const handleDeleteAccount = useCallback(async () => {
    if (loadingState.isBusy) return;
    setLoadingState((prev) => ({ ...prev, isBusy: true }));
    try {
      // The backend function performs the real deletion; frontend just clears local state after success.
      await authService.deleteAccount();
      dispatch(clearAuthUser());
      navigate('/login');
      toast.success('Account deleted successfully!');
    } catch (error) {
      toast.error(error?.message || 'Failed to delete account.');
    } finally {
      setLoadingState((prev) => ({ ...prev, isBusy: false }));
    }
  }, [dispatch, navigate, loadingState.isBusy]);

  return {
    // appearance and loading state
    isDarkMode,
    isLoading: loadingState.isBusy,
    isPrefsLoading: loadingState.isPrefsLoading,

    // preference data
    prefs,

    // actions
    handleToggleDarkMode,
    handlePrefChange,
    handleDeleteSessions,
    handleDeleteAccount,
  };
};
