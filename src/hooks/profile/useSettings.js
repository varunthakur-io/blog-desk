import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useDarkMode from '../common/useDarkMode';
import { authService } from '@/services/auth';
import { profileService } from '@/services/profile';
import { clearAuthUser, setAuthUser, selectAuthUser } from '@/store/auth';
import { setUserProfile, selectProfileById } from '@/store/profile';

export const useSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDarkMode, setDarkMode] = useDarkMode();

  const authUser = useSelector(selectAuthUser);
  const profile = useSelector((state) =>
    selectProfileById(state, authUser?.$id),
  );

  // ─── Loading flags ───────────────────────────────────────────────
  const [isPrefsLoading, setIsPrefsLoading]     = useState(true);
  const [isSavingProfile, setIsSavingProfile]   = useState(false);
  const [isSavingEmail, setIsSavingEmail]       = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUpdatingSession, setIsUpdatingSession] = useState(false);

  // ─── Notification prefs ──────────────────────────────────────────
  const [prefs, setPrefs] = useState({ marketing: false, security: true });

  // ─── Profile form ────────────────────────────────────────────────
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);
  const [profileForm, setProfileForm] = useState({ name: '', bio: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileError, setProfileError] = useState('');

  // ─── Account form ────────────────────────────────────────────────
  const [emailForm, setEmailForm] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // ─── Danger zone dialogs ─────────────────────────────────────────
  const [isSessionsDialogOpen, setIsSessionsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen]     = useState(false);

  // Seed forms from live Redux state whenever it changes
  useEffect(() => {
    if (authUser) {
      setProfileForm((prev) => ({
        name: prev.name || authUser.name || '',
        bio:  prev.bio  || profile?.bio   || '',
      }));
      setEmailForm((prev) => ({ ...prev, email: prev.email || authUser.email || '' }));
      setAvatarPreview(profile?.avatarUrl || null);
    }
  }, [authUser, profile]);

  // Fetch notification prefs on mount
  useEffect(() => {
    let cancelled = false;
    const fetchPrefs = async () => {
      setIsPrefsLoading(true);
      try {
        const user = await authService.getAccount();
        if (!cancelled && user) {
          setPrefs({
            marketing: user.prefs?.marketing ?? false,
            security:  user.prefs?.security  ?? true,
          });
        }
      } catch (err) {
        console.error('useSettings :: fetchPrefs', err);
      } finally {
        if (!cancelled) setIsPrefsLoading(false);
      }
    };
    fetchPrefs();
    return () => { cancelled = true; };
  }, []);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  // ─── Appearance ──────────────────────────────────────────────────
  const handleToggleDarkMode = useCallback((checked) => {
    setDarkMode(checked);
    toast.success(`Switched to ${checked ? 'dark' : 'light'} mode`);
  }, [setDarkMode]);

  // ─── Notifications ───────────────────────────────────────────────
  const handlePrefChange = useCallback(async (key, value) => {
    const prev = { ...prefs };
    setPrefs((p) => ({ ...p, [key]: value }));
    try {
      await authService.updatePrefs({ ...prev, [key]: value });
      toast.success('Preference saved.');
    } catch {
      setPrefs(prev);
      toast.error('Failed to save preference.');
    }
  }, [prefs]);

  // ─── Profile ─────────────────────────────────────────────────────
  const handleAvatarSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be under 3 MB.');
      return;
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setAvatarPreview(url);
    setAvatarFile(file);
  }, []);

  const handleSaveProfile = useCallback(async () => {
    setProfileError('');
    if (!profileForm.name.trim() || profileForm.name.trim().length < 2) {
      setProfileError('Name must be at least 2 characters.');
      return;
    }
    if (isSavingProfile) return;
    setIsSavingProfile(true);
    try {
      const updates = {};

      if (profileForm.name.trim() !== authUser?.name) {
        await authService.updateName(profileForm.name.trim());
        updates.name = profileForm.name.trim();
      }

      if (profileForm.bio.trim() !== (profile?.bio || '')) {
        await profileService.updateBio(authUser.$id, profileForm.bio.trim());
        updates.bio = profileForm.bio.trim();
      }

      if (avatarFile) {
        const updated = await profileService.updateAvatar(
          authUser.$id,
          profile?.avatarId,
          avatarFile,
        );
        if (updated) {
          dispatch(setUserProfile(updated));
          setAvatarFile(null);
        }
      }

      if (Object.keys(updates).length > 0) {
        dispatch(setUserProfile({ ...profile, ...updates }));
        // Keep auth store in sync with the new name
        if (updates.name) dispatch(setAuthUser({ ...authUser, name: updates.name }));
      }

      toast.success('Profile saved!');
    } catch (err) {
      const msg = err?.message || 'Failed to save profile.';
      setProfileError(msg);
      toast.error(msg);
    } finally {
      setIsSavingProfile(false);
    }
  }, [profileForm, avatarFile, authUser, profile, isSavingProfile, dispatch]);

  // ─── Email ───────────────────────────────────────────────────────
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

  // ─── Password ────────────────────────────────────────────────────
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
      // Appwrite's updatePassword takes (newPassword, oldPassword)
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

  // ─── Sessions / Delete ───────────────────────────────────────────
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
      toast.error(err?.message || 'Failed to delete account.');
    } finally {
      setIsUpdatingSession(false);
    }
  }, [dispatch, navigate, isUpdatingSession]);

  return {
    // auth data
    authUser,
    profile,

    // appearance
    isDarkMode,
    handleToggleDarkMode,

    // notifications
    prefs,
    isPrefsLoading,
    handlePrefChange,

    // profile section
    profileForm,
    setProfileForm,
    avatarPreview,
    avatarFile,
    fileInputRef,
    handleAvatarSelect,
    handleSaveProfile,
    isSavingProfile,
    profileError,

    // email section
    emailForm,
    setEmailForm,
    emailError,
    handleSaveEmail,
    isSavingEmail,

    // password section
    passwordForm,
    setPasswordForm,
    passwordError,
    handleSavePassword,
    isSavingPassword,

    // sessions / danger
    isUpdatingSession,
    isSessionsDialogOpen,
    setIsSessionsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteSessions,
    handleDeleteAccount,
  };
};
