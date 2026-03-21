import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { User, Edit, Save, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { authService } from '@/services/auth';
import { profileService } from '@/services/profile';
import { setUserProfile } from '@/store/profile';

const EditProfileDialog = ({ profile, profileId, isOwner }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileToUpload, setAvatarFileToUpload] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'saving' | 'uploading'
  const [errorMessage, setErrorMessage] = useState('');

  const displayName = profile?.name || 'Unnamed User';
  const displayBio = profile?.bio || '';
  const avatarUrl = profile?.avatarUrl || null;

  useEffect(() => {
    if (!isDialogOpen) {
      setAvatarPreview(avatarUrl);
    }
  }, [avatarUrl, isDialogOpen]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleOpenDialog = useCallback(() => {
    setEditForm({
      name: displayName || '',
      bio: displayBio || '',
    });
    setAvatarPreview(avatarUrl || null);
    setErrorMessage('');
    setIsDialogOpen(true);
  }, [displayName, displayBio, avatarUrl]);

  const handleCloseDialog = useCallback((open) => {
    if (!open) {
      setIsDialogOpen(false);
      setAvatarFileToUpload(null);
      setErrorMessage('');
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be smaller than 3 MB.');
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    // Keep a local blob preview so the dialog updates immediately before upload completes.
    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setAvatarPreview(objectUrl);
    setAvatarFileToUpload(file);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!editForm.name || editForm.name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters.');
      return;
    }

    if (submitStatus !== 'idle') return;

    setSubmitStatus('saving');

    try {
      if (editForm.name !== displayName) {
        await authService.updateName(editForm.name);
        dispatch(setUserProfile({ ...profile, name: editForm.name }));
      }

      if (editForm.bio !== displayBio) {
        await profileService.updateBio(profileId, editForm.bio);
        dispatch(setUserProfile({ ...profile, bio: editForm.bio }));
      }

      if (avatarFileToUpload) {
        setSubmitStatus('uploading');
        const updatedProfile = await profileService.updateAvatar(
          profileId,
          profile?.avatarId,
          avatarFileToUpload,
        );
        if (updatedProfile) {
          // Avatar updates return the full profile document, so replace the cached record.
          dispatch(setUserProfile(updatedProfile));
        }
      }

      toast.success('Profile updated!');
      setIsDialogOpen(false);
    } catch (error) {
      const msg = error?.message || 'Failed to update profile.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitStatus('idle');
    }
  };

  if (!isOwner) return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpenDialog}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveChanges} className="space-y-6 py-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="w-24 h-24 border-2 border-border">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit className="w-6 h-6 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={editForm.name} onChange={handleInputChange} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us a little bit about yourself"
                className="resize-none"
                value={editForm.bio}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitStatus !== 'idle'}>
              {submitStatus !== 'idle' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {submitStatus === 'uploading' ? 'Uploading Avatar...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
