import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Edit, Save, X, Camera } from 'lucide-react';
import { Spinner } from '@/components/Loader';
import toast from 'react-hot-toast';
import PostCard from '../components/PostCard';
import ProfileSkeleton from '@/components/ProfileSkeleton';

// services
import { authService } from '../services/authService';
import { postService } from '../services/postService';

// UI primitives
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { setUser } from '@/store/authSlice';

// utils
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? '');

export default function Profile() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);
  const authLoading = useSelector((state) => state.auth?.loading);
  const fileRef = useRef(null);

  // keep track of local object URL so we can revoke it
  const previewUrlRef = useRef(null);

  // local UI state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  });

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts'); // posts | likes | about
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  // NEW: hold the selected file until Save is clicked
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);

  // hydrate form with authUser
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || '',
        email: authUser.email || '',
        password: '',
        bio: authUser.prefs?.bio || '',
      });

      // initialize preview from user's avatar (if any)
      // if user changes (after full save) we discard any pending local preview
      setPreview(authUser.prefs?.avatar ?? null);

      // discard any pending file when authUser changes (e.g., after upload)
      setPendingAvatarFile(null);

      // revoke previous local preview URL if any
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch (e) {
          console.error('Failed to revoke object URL on authUser change', e);
        }
        previewUrlRef.current = null;
      }
    }
  }, [authUser]);

  // cleanup on unmount: revoke any object URL
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch (e) {
          // ignore
          console.error('Failed to revoke object URL on unmount', e);
        }
        previewUrlRef.current = null;
      }
    };
  }, []);

  // fetch user's posts
  useEffect(() => {
    let mounted = true;
    async function loadPosts() {
      try {
        setPostsLoading(true);
        // try user-specific API first (future plan)
        if (postService.getPostsByAuthor) {
          const res = await postService.getPostsByAuthor(authUser.$id);
          if (!mounted) return;
          setUserPosts(Array.isArray(res) ? res : (res.documents ?? []));
        } else {
          // fallback: fetch some posts and filter client-side
          const res = await postService.getAllPosts(1, 100); // large limit for user's posts
          if (!mounted) return;
          const docs = Array.isArray(res) ? res : (res.documents ?? []);
          const filtered = docs.filter(
            (p) =>
              p.authorId === authUser.$id ||
              p.authorEmail === authUser.email ||
              p.authorName === authUser.name,
          );
          setUserPosts(filtered);
        }
      } catch (err) {
        console.error('Failed to load user posts', err);
      } finally {
        if (mounted) setPostsLoading(false);
      }
    }

    if (authUser) loadPosts();
    return () => {
      mounted = false;
    };
  }, [authUser]);

  // handlers
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };
  const handleCancel = () => {
    if (authUser) {
      setFormData({
        name: authUser.name || '',
        email: authUser.email || '',
        password: '',
        bio: authUser.prefs?.bio || '',
      });
    }
    setIsEditing(false);
    setError('');

    // discard pending avatar file and revert preview to server avatar (if any)
    setPendingAvatarFile(null);
    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch (e) {
        console.error('Failed to revoke object URL on cancel', e);
      }
      previewUrlRef.current = null;
    }
    setPreview(authUser?.prefs?.avatar ?? null);

    // clear file input
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || formData.name.trim().length < 2) {
      setError('Please enter a valid name (2+ characters).');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.email !== authUser.email && !formData.password) {
      setError('Please enter your current password to update email.');
      return;
    }

    setSaving(true);
    let profileSaved = false;
    let avatarSaved = false;
    let updatedUser = null;

    try {
      // profile update
      if (authService.updateProfile) {
        const payload = {
          name: formData.name,
          bio: formData.bio,
          email: formData.email !== authUser.email ? formData.email : undefined,
          currentPassword:
            formData.email !== authUser.email ? formData.password : undefined,
        };
        try {
          const res = await authService.updateProfile(payload);
          updatedUser = res?.user ?? null;
          if (updatedUser) dispatch(setUser(updatedUser));
          profileSaved = true;
        } catch (err) {
          console.error('updateProfile failed', err);
          setError(err?.message || 'Failed to update profile details.');
        }
      } else {
        try {
          if (formData.name !== authUser.name)
            await authService.updateName(formData.name);
          if (formData.bio !== authUser.prefs?.bio) {
            if (authService.updateBio)
              await authService.updateBio(formData.bio);
            else if (authService.updatePrefs)
              await authService.updatePrefs({ bio: formData.bio });
          }
          if (formData.email !== authUser.email) {
            await authService.updateEmail(formData.email, formData.password);
          }
          if (authService.getCurrentUser) {
            updatedUser = await authService.getCurrentUser();
            if (updatedUser) dispatch(setUser(updatedUser));
          } else {
            dispatch(
              setUser({
                ...authUser,
                name: formData.name,
                email: formData.email,
                prefs: { ...authUser.prefs, bio: formData.bio },
              }),
            );
          }
          profileSaved = true;
        } catch (err) {
          console.error('Per-field profile update failed', err);
          setError(err?.message || 'Failed to update profile details.');
        }
      }

      // avatar upload if selected
      if (pendingAvatarFile) {
        setAvatarUploading(true);
        try {
          const avatarResult =
            await authService.updateAvatar(pendingAvatarFile);
          const finalUser = avatarResult?.user ?? avatarResult ?? null;

          if (finalUser) {
            dispatch(setUser(finalUser));
            setPreview(finalUser?.prefs?.avatar ?? null);
          } else if (avatarResult?.prefs?.avatar) {
            setPreview(avatarResult.prefs.avatar);
          }

          if (previewUrlRef.current) {
            try {
              URL.revokeObjectURL(previewUrlRef.current);
            } catch (e) {}
            previewUrlRef.current = null;
          }

          setPendingAvatarFile(null);
          if (fileRef.current) fileRef.current.value = '';
          avatarSaved = true;
        } catch (err) {
          console.error('Avatar upload failed during save:', err);
          toast.error(err?.message || 'Failed to upload avatar.');
        } finally {
          setAvatarUploading(false);
        }
      }

      // final toasts
      if (profileSaved && avatarSaved) {
        toast.success('Profile and avatar updated successfully!');
      } else if (profileSaved && !avatarSaved) {
        toast.success('Profile updated. Avatar upload failed — you can retry.');
      } else if (!profileSaved && avatarSaved) {
        toast.success('Avatar uploaded. Profile update failed.');
      } else {
        if (!error) setError('No changes were saved.');
        toast.error(error || 'Update failed. Please try again.');
        return;
      }

      setIsEditing(false);
      setFormData((p) => ({ ...p, password: '' }));
    } catch (err) {
      console.error('handleSave unexpected error', err);
      setError(err?.message || 'Update failed. Please try again.');
      toast.error(err?.message || 'Update failed.');
    } finally {
      setSaving(false);
      setAvatarUploading(false);
    }
  };

  // avatar click
  const handleAvatarClick = () => fileRef.current?.click();

  // avatar selection: only preview + store file; do NOT upload here
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic client-side validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be smaller than 3 MB.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    // revoke any previous local preview URL
    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch (e) {
        // ignore
      }
      previewUrlRef.current = null;
    }

    // create local preview and store selected file for later upload
    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setPreview(objectUrl);
    setPendingAvatarFile(file);
  };

  // derived stats (fallback to prefs/counts if available)
  const postsCount = userPosts.length ?? authUser.prefs?.postsCount ?? 0;
  const followers = authUser.prefs?.followers ?? 0;
  const following = authUser.prefs?.following ?? 0;

  // show skeleton while auth loading or user not ready
  if (authLoading || !authUser) return <ProfileSkeleton />;

  return (
    <main className="min-h-screen">
      <div>
        <Card className="border-0">
          <CardHeader className="text-center">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* avatar + camera */}
              <div className="relative">
                <Avatar className="w-28 h-28">
                  {/* optimistic preview*/}
                  <AvatarImage
                    src={preview ?? authUser?.prefs?.avatars}
                    alt={authUser?.name}
                  />
                  <AvatarFallback className="text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>

                {isEditing && (
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={avatarUploading || saving}
                    className="absolute bottom-0 right-0 -translate-y-2 translate-x-2 bg-card/80 border border-border/40 rounded-full p-2 shadow-sm hover:scale-105 transition-transform"
                    aria-label="Change avatar"
                  >
                    {avatarUploading ? (
                      <Spinner size={16} className="text-primary" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </button>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* name + email + edit */}
              <div className="flex-1 min-w-0 text-left md:text-left">
                <CardTitle className="text-2xl leading-tight">
                  {authUser.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  {authUser.email}
                </CardDescription>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      Posts{' '}
                      <span className="ml-2 font-semibold text-primary">
                        {postsCount}
                      </span>
                    </div>
                    <div className="px-3 py-2 rounded-full bg-muted/10 text-muted-foreground text-sm">
                      Followers{' '}
                      <span className="ml-2 font-semibold">{followers}</span>
                    </div>
                    <div className="px-3 py-2 rounded-full bg-muted/10 text-muted-foreground text-sm">
                      Following{' '}
                      <span className="ml-2 font-semibold">{following}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-auto">
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCancel}
                      variant="ghost"
                      className="border"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {/* Edit form */}
            <form onSubmit={handleSave} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  type="text"
                  placeholder="A short bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                />
              </div>

              {isEditing && (
                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Current Password
                    <span className="text-sm text-muted-foreground ml-2">
                      (required to update email)
                    </span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your current password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              )}

              {isEditing && (
                <div className="flex gap-4 justify-end pt-2">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                    disabled={saving}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>

                  <Button type="submit" disabled={saving || avatarUploading}>
                    {saving || avatarUploading ? (
                      <>
                        <Spinner size={16} className="mr-2 text-current" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Tabs */}
              <div className="mt-8">
                <div className="flex gap-3 border-b border-gray-200/10 pb-3">
                  {['posts', 'likes', 'about'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        activeTab === tab
                          ? 'bg-card/60 border border-border/40'
                          : 'text-muted-foreground'
                      }`}
                      aria-pressed={activeTab === tab}
                    >
                      {tab === 'posts'
                        ? 'Posts'
                        : tab === 'likes'
                          ? 'Likes'
                          : 'About'}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="mt-6">
                  {activeTab === 'posts' && (
                    <>
                      {postsLoading ? (
                        <div className="text-center py-12 text-muted-foreground">
                          Loading posts...
                        </div>
                      ) : userPosts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <p className="mb-4">
                            You haven't published any posts yet.
                          </p>
                          <Button asChild>
                            <a href="/create">Create your first post</a>
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {userPosts.map((p) => (
                            <PostCard key={p.$id ?? p.id} post={p} />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'likes' && (
                    <div className="text-muted-foreground">
                      <p>
                        Liked posts will show up here. (Implement your likes API
                        or client-side list.)
                      </p>
                    </div>
                  )}

                  {activeTab === 'about' && (
                    <div className="prose max-w-none text-muted-foreground">
                      <h3 className="text-lg font-semibold mb-2">
                        About {authUser.name}
                      </h3>
                      <p>
                        {authUser.prefs?.bio ||
                          formData.bio ||
                          'No bio provided.'}
                      </p>

                      {/* optional details */}
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Joined
                          </p>
                          <p>
                            {new Date(
                              authUser.$createdAt ?? Date.now(),
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{authUser.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
