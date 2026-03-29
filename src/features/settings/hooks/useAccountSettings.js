import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { authService, setAuthUser, selectAuthUser } from '@/features/auth';

export const useAccountSettings = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);

  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [emailForm, setEmailForm] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (authUser) {
      setEmailForm((prev) => ({ ...prev, email: prev.email || authUser.email || '' }));
    }
  }, [authUser]);

  const handleSaveEmail = useCallback(async () => {
    setEmailError('');
    if (!emailForm.email.trim()) {
      setEmailError('Email is required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(emailForm.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (!emailForm.password) {
      setEmailError('Current password is required to change your email.');
      return;
    }
    if (emailForm.email === authUser?.email) {
      setEmailError('This is already your current email address.');
      return;
    }
    if (isSavingEmail) return;
    setIsSavingEmail(true);
    try {
      await authService.updateEmail(emailForm.email.trim(), emailForm.password);
      dispatch(setAuthUser({ ...authUser, email: emailForm.email.trim() }));
      setEmailForm((p) => ({ ...p, password: '' }));
      toast.success('Email updated successfully!');
    } catch (err) {
      const msg = err?.message || 'Failed to update email.';
      setEmailError(msg);
      toast.error(msg);
    } finally {
      setIsSavingEmail(false);
    }
  }, [emailForm, authUser, isSavingEmail, dispatch]);

  const handleSavePassword = useCallback(async () => {
    setPasswordError('');
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (isSavingPassword) return;
    setIsSavingPassword(true);
    try {
      await authService.updatePassword(newPassword, currentPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully!');
    } catch (err) {
      const msg = err?.message || 'Failed to update password.';
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setIsSavingPassword(false);
    }
  }, [passwordForm, isSavingPassword]);

  return {
    authUser,
    emailForm,
    setEmailForm,
    emailError,
    handleSaveEmail,
    isSavingEmail,
    passwordForm,
    setPasswordForm,
    passwordError,
    handleSavePassword,
    isSavingPassword,
  };
};
