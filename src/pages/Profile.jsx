import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { User, Edit, Save, X, Camera } from 'lucide-react';
import { Spinner } from '@/components/Loader';
import toast from 'react-hot-toast';
import PostCard from '../components/PostCard';
import ProfileSkeleton from '@/components/ProfileSkeleton';
import { setProfile } from '@/store/profileSlice';

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

  // auth from redux
  const authUser = useSelector((state) => state.auth?.user);
  const authLoading = useSelector((state) => state.auth?.loading);
  const cachedProfiles = useSelector((state) => state.profile?.profiles);

  // route param
  const { id } = useParams();

  // local refs and state
  const fileRef = useRef(null);
  const previewUrlRef = useRef(null);
  const prevProfileIdRef = useRef(null);
  const prevPostsProfileIdRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  });

  const [profileDoc, setProfileDoc] = useState(null); // public profile doc from "profiles" collection
  const [profileLoading, setProfileLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts'); // posts | likes | about
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // pending local preview and file
  const [preview, setPreview] = useState(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);

  // computed profileId: explicit URL id or fallback to logged in user
  const profileId = id || authUser?.$id;
  const isOwner = !!authUser && authUser.$id === profileId;
  const cachedProfile = cachedProfiles?.[profileId];

  // ----------------------------------------
  // Load profile document for profileId
  // ----------------------------------------
  useEffect(() => {
    let mounted = true;

    async function loadProfileDoc(pid) {
      if (!pid) {
        setProfileDoc(null);
        setPreview(null);
        prevProfileIdRef.current = null;
        return;
      }

      // Check if we have cached data
      if (cachedProfile && prevProfileIdRef.current === pid) {
        setProfileDoc(cachedProfile);

        // Initialize form fields from cached profile
        if (isOwner && authUser) {
          setFormData({
            name: authUser.name || '',
            email: authUser.email || '',
            password: '',
            bio: cachedProfile?.bio ?? '',
          });
        } else {
          setFormData({
            name: cachedProfile?.name ?? '',
            email: '',
            password: '',
            bio: cachedProfile?.bio ?? '',
          });
        }

        // Set avatar preview from cached data
        const avatarUrl = isOwner
          ? authUser?.profile?.avatarUrl
          : cachedProfile?.avatarUrl;
        setPreview(avatarUrl ?? null);

        setProfileLoading(false);
        return;
      }

      prevProfileIdRef.current = pid;
      setProfileLoading(true);

      try {
        // Fetch profile
        const doc = await authService.getProfile(pid);
        if (!mounted) return;

        setProfileDoc(doc);
        // Cache in Redux
        dispatch(setProfile({ profileId: pid, data: doc }));

        // Initialize form fields using fresh profile doc
        if (isOwner && authUser) {
          setFormData({
            name: authUser.name || '',
            email: authUser.email || '',
            password: '',
            bio: doc?.bio ?? '',
          });
        } else {
          setFormData({
            name: doc?.name ?? '',
            email: '',
            password: '',
            bio: doc?.bio ?? '',
          });
        }

        // Set avatar preview (safe optional chaining)
        const avatarUrl = isOwner
          ? authUser?.profile?.avatarUrl
          : doc?.avatarUrl;

        setPreview(avatarUrl ?? null);
      } catch (err) {
        console.error('Failed to load profile doc:', err);
        setProfileDoc(null);

        // Fallback avatar if owner has cached image
        setPreview(isOwner ? authUser?.profile?.avatarUrl : null);
      } finally {
        if (mounted) setProfileLoading(false);
      }
    }

    loadProfileDoc(profileId);

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, cachedProfile]);

  // cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch {
          // ignore
        }
        previewUrlRef.current = null;
      }
    };
  }, []);

  // ----------------------------------------
  // Load posts for profileId
  // ----------------------------------------
  useEffect(() => {
    let mounted = true;
    async function loadUserPosts(pid) {
      if (!pid) {
        setUserPosts([]);
        prevPostsProfileIdRef.current = null;
        return;
      }

      // Skip if profileId hasn't actually changed and we already have posts
      if (prevPostsProfileIdRef.current === pid && userPosts.length > 0) {
        return;
      }

      prevPostsProfileIdRef.current = pid;

      try {
        setPostsLoading(true);
        if (postService.getPostsByAuthor) {
          const res = await postService.getPostsByAuthor(pid);
          if (!mounted) return;
          setUserPosts(Array.isArray(res) ? res : (res.documents ?? []));
        } else {
          // fallback: fetch some posts and filter client-side (not ideal for production)
          const res = await postService.getAllPosts(1, 100);
          if (!mounted) return;
          const docs = Array.isArray(res) ? res : (res.documents ?? []);
          const filtered = docs.filter(
            (p) => p.authorId === pid || p.authorId === pid.toString(),
          );
          setUserPosts(filtered);
        }
      } catch (err) {
        console.error('Failed to load user posts', err);
        setUserPosts([]);
      } finally {
        if (mounted) setPostsLoading(false);
      }
    }

    loadUserPosts(profileId);
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  // ----------------------------------------
  // Handlers
  // ----------------------------------------
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = () => {
    if (!isOwner) {
      toast.error('You can only edit your own profile.');
      return;
    }
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    // revert to loaded profile/doc values
    if (isOwner && authUser) {
      setFormData({
        name: authUser.name || '',
        email: authUser.email || '',
        password: '',
        bio: authUser?.profile?.bio ?? '',
      });
      setPreview(authUser?.profile?.avatarUrl ?? '');
    } else {
      setFormData({
        name: profileDoc?.name ?? '',
        email: '',
        password: '',
        bio: profileDoc?.bio ?? '',
      });
      setPreview(profileDoc?.avatarUrl ?? null);
    }

    setIsEditing(false);
    setError('');
    setPendingAvatarFile(null);

    // clear local object url
    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch {
        // ignore
      }
      previewUrlRef.current = null;
    }

    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!isOwner) {
      toast.error('You can only update your own profile.');
      return;
    }

    // validation
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

    try {
      // Update name in auth and profile document
      if (formData.name !== authUser.name) {
        try {
          await authService.updateName(formData.name);
          const newUser = {
            ...authUser,
            profile: {
              ...(authUser?.profile || {}),
              name: formData.name,
            },
          };

          dispatch(setUser(newUser));
        } catch (error) {
          toast.error(error);
        }
      }

      // Update email in auth if changed
      if (formData.email !== authUser.email && formData.password) {
        await authService.updateEmail(formData.email, formData.password);

        const newUser = {
          ...authUser,
          email: formData.email,
        };

        dispatch(setUser(newUser));
      }

      // Update bio in profile document
      if (formData.bio !== authUser?.profile?.bio) {
        await authService.updateBio(authUser.$id, formData.bio);

        const newUser = {
          ...authUser,
          profile: {
            ...(authUser?.profile || {}),
            bio: formData.bio,
          },
        };

        dispatch(setUser(newUser));
      }

      // Avatar upload (deferred upload on Save)
      if (pendingAvatarFile) {
        setAvatarUploading(true);
        const updatedProfile =
          await authService.updateAvatar(pendingAvatarFile);
        // If updateAvatar returns user or updated prefs, handle it:
        // const newUser = res?.user ?? res ?? null;
        if (updatedProfile) {
          setPreview(updatedProfile.avatarUrl);
        }
        setProfileDoc(updatedProfile);
        setPendingAvatarFile(null);
        if (fileRef.current) fileRef.current.value = '';
        setAvatarUploading(false);
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      // remove password from password field
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      console.error('Update failed:', err);
      const msg = err?.message || 'Update failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
      setAvatarUploading(false);
    }
  };

  const handleAvatarClick = () => {
    if (!isOwner) return;
    fileRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    if (!isOwner) {
      toast.error('You can only change your own avatar.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

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

    // revoke previous
    if (previewUrlRef.current) {
      try {
        URL.revokeObjectURL(previewUrlRef.current);
      } catch {
        // ignore
      }
      previewUrlRef.current = null;
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setPreview(objectUrl);
    setPendingAvatarFile(file);
  };

  // derived stats (fallback to prefs/counts if available)
  const postsCount = userPosts.length ?? authUser?.prefs?.postsCount ?? 0;
  const followers = authUser?.prefs?.followers ?? 0;
  const following = authUser?.prefs?.following ?? 0;

  // Loading / skeleton conditions:
  if (authLoading || profileLoading || !profileId) return <ProfileSkeleton />;

  return (
    <main className="min-h-screen">
      <div>
        <Card className="border-0">
          <CardHeader className="text-center">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* avatar + camera */}
              <div className="relative">
                <Avatar className="w-28 h-28">
                  <AvatarImage
                    src={preview ?? null}
                    alt={formData.name || 'User avatar'}
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
                  {isOwner ? authUser?.name : profileDoc?.name}
                </CardTitle>
                {isOwner && (
                  <CardDescription className="text-muted-foreground mt-1">
                    {authUser?.email}
                  </CardDescription>
                )}

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
                {!isOwner ? (
                  <Button onClick={null} variant="default">
                    Follow
                  </Button>
                ) : !isEditing ? (
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
            {/* Edit form (if owner) or public read-only info */}
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
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {isOwner && (
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={'Your Email'}
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  type="text"
                  placeholder="A short bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
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
                      className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === tab ? 'bg-card/60 border border-border/40' : 'text-muted-foreground'}`}
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
                            {isOwner
                              ? "You haven't published any posts yet."
                              : "This user hasn't published any posts yet."}
                          </p>
                          {isOwner && (
                            <Button asChild>
                              <a href="/create">Create your first post</a>
                            </Button>
                          )}
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
                        Liked posts will show up here. (Implement likes API.)
                      </p>
                    </div>
                  )}

                  {activeTab === 'about' && (
                    <div className="prose max-w-none text-muted-foreground">
                      <h3 className="text-lg font-semibold mb-2">
                        About {profileDoc?.name ?? formData.name}
                      </h3>
                      <p>
                        {profileDoc?.bio ?? formData.bio ?? 'No bio provided.'}
                      </p>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Joined
                          </p>
                          <p>
                            {new Date(
                              authUser?.$createdAt ?? Date.now(),
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            User ID
                          </p>
                          <p className="font-mono text-sm break-all">
                            {profileId}
                          </p>
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
