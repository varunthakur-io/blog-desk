import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService, clearAuthUser } from '@/features/auth';

export const usePrivacySettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isUpdatingSession, setIsUpdatingSession] = useState(false);
  const [isSessionsDialogOpen, setIsSessionsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteSessions = useCallback(async () => {
    if (isUpdatingSession) return;
    setIsUpdatingSession(true);
    try {
      await authService.deleteAllSessions();
      dispatch(clearAuthUser());
      navigate('/login');
      toast.success('Logged out from all devices!');
    } catch {
      toast.error('Failed to delete sessions.');
    } finally {
      setIsUpdatingSession(false);
    }
  }, [dispatch, navigate, isUpdatingSession]);

  const handleDeleteAccount = useCallback(async () => {
    if (isUpdatingSession) return;
    setIsUpdatingSession(true);
    try {
      await authService.deleteAccount();
      dispatch(clearAuthUser());
      navigate('/login');
      toast.success('Account deleted.');
    } catch (err) {
      console.error('handleDeleteAccount error:', err);
      toast.error(err?.message || 'Failed to delete account.');
    } finally {
      setIsUpdatingSession(false);
    }
  }, [dispatch, navigate, isUpdatingSession]);

  return {
    isUpdatingSession,
    isSessionsDialogOpen,
    setIsSessionsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteSessions,
    handleDeleteAccount,
  };
};
