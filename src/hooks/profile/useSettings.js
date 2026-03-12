import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useDarkMode from '../common/useDarkMode';
import { authService } from '@/services/auth';
import { clearAuthUserId } from '@/store/auth';

export const useSettings = () => {
  const [isDarkMode, setDarkMode] = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isPrefsLoading, setIsPrefsLoading] = useState(true);
  const [prefs, setPrefs] = useState({
    marketing: false,
    security: true,
  });

  useEffect(() => {
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
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        if (mounted) setIsPrefsLoading(false);
      }
    };
    fetchPrefs();
    return () => { mounted = false; };
  }, []);

  const handleToggleDarkMode = (checked) => {
    setDarkMode(checked);
    toast.success(`Theme switched to ${checked ? 'Dark' : 'Light'}`);
  };

  const handlePrefChange = async (key, value) => {
    const oldPrefs = { ...prefs };
    setPrefs((prev) => ({ ...prev, [key]: value }));
    try {
      await authService.updatePrefs({ ...oldPrefs, [key]: value });
      toast.success('Preference saved.');
    } catch {
      setPrefs(oldPrefs);
      toast.error('Failed to save preference.');
    }
  };

  const handleDeleteSessions = async () => {
    setIsLoading(true);
    try {
      await authService.deleteAllSessions();
      dispatch(clearAuthUserId());
      navigate('/login');
      toast.success('Logged out from all devices!');
    } catch {
      toast.error('Failed to delete sessions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await authService.deleteAccount();
      dispatch(clearAuthUserId());
      navigate('/login');
      toast.success('Account deleted successfully!');
    } catch {
      toast.error('Failed to delete account.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isDarkMode,
    isLoading,
    isPrefsLoading,
    prefs,
    handleToggleDarkMode,
    handlePrefChange,
    handleDeleteSessions,
    handleDeleteAccount,
  };
};
