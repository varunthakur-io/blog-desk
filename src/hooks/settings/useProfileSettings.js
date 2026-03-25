import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
import { profileService } from '@/services/profile';
import { setAuthUser, selectAuthUser } from '@/store/auth';
import { setUserProfile, selectProfileById } from '@/store/profile';

export const useProfileSettings = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const profile = useSelector((state) => selectProfileById(state, authUser?.$id));

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', bio: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileError, setProfileError] = useState('');

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      setProfileForm((prev) => ({
        name: prev.name || authUser.name || '',
        bio: prev.bio || profile?.bio || '',
      }));
      setAvatarPreview(profile?.avatarUrl || null);
    }
  }, [authUser, profile]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

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

  return {
    authUser,
    profileForm,
    setProfileForm,
    avatarPreview,
    avatarFile,
    fileInputRef,
    handleAvatarSelect,
    handleSaveProfile,
    isSavingProfile,
    profileError,
  };
};
