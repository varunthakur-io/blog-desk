// src/pages/Profile.jsx
import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Edit, Save, X, Camera } from 'lucide-react';

// UI Components
import { Spinner } from '@/components/Loader';
import PostCard from '@/components/PostCard';
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton';
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

// Services
import { authService } from '@/services/authService';
import { postService } from '@/services/postService';

// Auth slice
import { selectAuthUserId, selectAuthLoading } from '@/store/authSlice';

// Profile slice
import {
  upsertProfile,
  setProfileLoading,
  setProfileError,
  selectProfileById,
  selectProfileLoading,
  selectProfileError,
} from '@/store/profileSlice';

// Posts slice
import {
  selectPostsByAuthor,
  selectPostsLoading,
  selectInitialLoaded,
  setPostsLoading,
  setPostsError,
  setPosts,
  setInitialLoaded,
} from '@/store/postSlice';

// --- Utilities ---
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? '');

export default function Profile() {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Auth selectors
  const authUserId = useSelector(selectAuthUserId);
  const authLoading = useSelector(selectAuthLoading); // true if auth state is loading

  const profileId = id || authUserId;
  const isOwner = !!authUserId && authUserId === profileId;

  // Profile selectors
  const profile = useSelector((state) => selectProfileById(state, profileId));
  const profileLoading = useSelector((state) =>
    selectProfileLoading(state, profileId),
  );
  const profileError = useSelector((state) =>
    selectProfileError(state, profileId),
  );

  // Posts selectors
  const initialPostsLoaded = useSelector(selectInitialLoaded);
  const postsLoading = useSelector(selectPostsLoading);
  const userPosts = useSelector((state) =>
    selectPostsByAuthor(state, profileId),
  );

  // ---------- Local state ----------
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);

  // Likes tab local state
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const [likesError, setLikesError] = useState('');

  // Form & UI state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileToUpload, setAvatarFileToUpload] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ---------- Derived display values ----------
  const displayName = profile?.name || 'Unnamed User';
  const displayEmail = profile?.email || '';
  const displayBio = profile?.bio || '';

  const avatarUrl = profile?.avatarUrl || null;

  const postsCount = userPosts.length ?? 0;
  const followersCount = profile?.followersCount ?? 0;
  const followingCount = profile?.followingCount ?? 0;

  const joinedDate = profile?.$createdAt
    ? new Date(profile.$createdAt).toLocaleDateString()
    : '—';

  // Keep local preview in sync with profile avatar when not editing
  useEffect(() => {
    if (!isEditing) {
      setAvatarPreview(avatarUrl);
    }
  }, [avatarUrl, isEditing]);

  // Effect: Load profile data
  useEffect(() => {
    if (!profileId) return;

    // If we already have a profile and no error, don't refetch
    if (profile && !profileError) return;

    let cancelled = false;

    const loadProfile = async () => {
      dispatch(setProfileLoading({ userId: profileId, loading: true }));
      dispatch(setProfileError({ userId: profileId, error: null }));

      try {
        const profileObj = await authService.getProfile(profileId);
        if (cancelled) return;
        // doc should contain: { $id, name, bio, avatarUrl, ... }
        dispatch(upsertProfile(profileObj));
      } catch (err) {
        if (cancelled) return;
        dispatch(
          setProfileError({
            userId: profileId,
            error: err?.message || 'Failed to load profile.',
          }),
        );
      } finally {
        if (!cancelled) {
          dispatch(setProfileLoading({ userId: profileId, loading: false }));
        }
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [dispatch, profileId, profile, profileError]);

  // Effect: Load posts once (global feed)
  useEffect(() => {
    if (initialPostsLoaded) return;

    let cancelled = false;

    const fetchPostsOnce = async () => {
      dispatch(setPostsLoading(true));
      dispatch(setPostsError(null));

      try {
        const postsArray = await postService.getAllPosts();
        if (cancelled) return;

        const posts = Array.isArray(postsArray) ? postsArray : [];

        dispatch(setPosts(posts));
        dispatch(setInitialLoaded(true));
      } catch (err) {
        if (cancelled) return;
        dispatch(
          setPostsError(err?.message || 'Failed to fetch posts for profile.'),
        );
      } finally {
        if (!cancelled) {
          dispatch(setPostsLoading(false));
        }
      }
    };

    fetchPostsOnce();
    return () => {
      cancelled = true;
    };
  }, [dispatch, initialPostsLoaded]);

  // Effect: Load liked posts (local only)
  useEffect(() => {
    if (!isOwner) return;
    if (activeTab !== 'likes') return;
    if (!profileId) return;

    let cancelled = false;

    const fetchLikedPosts = async () => {
      try {
        setIsLoadingLikes(true);
        setLikesError('');

        const likedPostsArray =
          await postService.getLikedPostsByUser(profileId);

        if (cancelled) return;

        const likedPosts = Array.isArray(likedPostsArray)
          ? likedPostsArray
          : [];

        setLikedPosts(likedPosts);
      } catch (err) {
        if (!cancelled) {
          const errorMessage =
            err?.message || 'Failed to load liked posts. Please try again.';
          setLikesError(errorMessage);
        }
      } finally {
        if (!cancelled) setIsLoadingLikes(false);
      }
    };

    fetchLikedPosts();
    return () => {
      cancelled = true;
    };
  }, [activeTab, isOwner, profileId]);

  // Effect: Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  // Event Handlers
  const handleInputChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStartEditing = () => {
    if (!isOwner) {
      toast.error('You can only edit your own profile.');
      return;
    }

    setEditForm({
      name: displayName || '',
      email: displayEmail || '',
      password: '',
      bio: displayBio || '',
    });

    setAvatarPreview(avatarUrl || null);
    setIsEditing(true);
    setErrorMessage('');
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setErrorMessage('');
    setAvatarFileToUpload(null);
    setEditForm((prev) => ({ ...prev, password: '' }));

    setAvatarPreview(avatarUrl || null);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAvatarSelect = (e) => {
    if (!isOwner) return;

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

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setAvatarPreview(objectUrl);
    setAvatarFileToUpload(file);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isOwner || !authUserId) return;

    if (!editForm.name || editForm.name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters.');
      return;
    }
    if (!isValidEmail(editForm.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (editForm.email !== profile?.email && !editForm.password) {
      setErrorMessage('Current password is required to change email.');
      return;
    }

    setIsSaving(true);

    try {
      // 1. Update Name
      if (editForm.name !== displayName) {
        try {
          await authService.updateName(editForm.name);
          dispatch(
            upsertProfile({
              ...(profile || { $id: profileId }),
              name: editForm.name,
            }),
          );
        } catch (error) {
          toast.error(error?.message || 'Failed to update name.');
        }
      }

      // 2. Update Email
      if (editForm.email !== displayEmail) {
        try {
          await authService.updateEmail(editForm.email, editForm.password);
          dispatch(
            upsertProfile({
              ...(profile || { $id: profileId }),
              email: editForm.email,
            }),
          );
        } catch (error) {
          toast.error(error?.message || 'Failed to update email.');
        }
      }

      // 3. Update Bio
      if (editForm.bio !== displayBio) {
        try {
          await authService.updateBio(profileId, editForm.bio);
          dispatch(
            upsertProfile({
              ...(profile || { $id: profileId }),
              bio: editForm.bio,
            }),
          );
        } catch (error) {
          toast.error(error?.message || 'Failed to update bio.');
        }
      }

      // 4. Update Avatar
      if (avatarFileToUpload) {
        setIsUploadingAvatar(true);
        const updatedProfile =
          await authService.updateAvatar(avatarFileToUpload);

        if (updatedProfile) {
          setAvatarPreview(updatedProfile.avatarUrl || null);
          dispatch(upsertProfile(updatedProfile));
        }

        setAvatarFileToUpload(null);
        setIsUploadingAvatar(false);
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setEditForm((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      const msg = err?.message || 'Failed to update profile.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- Render guards ----------
  if (!profileId) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-muted-foreground">
          Profile not found or you are not logged in.
        </p>
      </div>
    );
  }

  if (authLoading || profileLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile && profileError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <AlertDescription>{profileError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <Card className="border-0">
          <CardHeader className="text-center">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="w-28 h-28">
                  <AvatarImage
                    src={avatarPreview ?? undefined}
                    alt={displayName || 'User'}
                  />
                  <AvatarFallback className="text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar || isSaving}
                    className="absolute bottom-0 right-0 -translate-y-2 translate-x-2 bg-card/80 border border-border/40 rounded-full p-2 shadow-sm hover:scale-105 transition-transform"
                    aria-label="Change avatar"
                  >
                    {isUploadingAvatar ? (
                      <Spinner size={16} className="text-primary" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
              </div>

              {/* Header Info Section */}
              <div className="flex-1 min-w-0 text-left md:text-left">
                <CardTitle className="text-2xl leading-tight">
                  {displayName}
                </CardTitle>

                {isOwner && (
                  <CardDescription className="text-muted-foreground mt-1">
                    {displayEmail}
                  </CardDescription>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      Posts{' '}
                      <span className="ml-2 font-semibold">{postsCount}</span>
                    </div>
                    <div className="px-3 py-2 rounded-full bg-muted/10 text-muted-foreground text-sm">
                      Followers{' '}
                      <span className="ml-2 font-semibold">
                        {followersCount}
                      </span>
                    </div>
                    <div className="px-3 py-2 rounded-full bg-muted/10 text-muted-foreground text-sm">
                      Following{' '}
                      <span className="ml-2 font-semibold">
                        {followingCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="ml-auto">
                {!isOwner ? (
                  <Button variant="default">Follow</Button>
                ) : !isEditing ? (
                  <Button onClick={handleStartEditing} variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    onClick={handleCancelEditing}
                    variant="ghost"
                    className="border"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <form onSubmit={handleSaveChanges} className="space-y-6">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={isEditing ? editForm.name : displayName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              {/* Email (owner only) */}
              {isOwner && (
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={isEditing ? editForm.email : displayEmail || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              )}

              {/* Bio */}
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  type="text"
                  placeholder="A short bio"
                  value={isEditing ? editForm.bio : displayBio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              {/* Password (only when editing + changing email) */}
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
                    value={editForm.password}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                </div>
              )}

              {/* Save / Cancel */}
              {isEditing && (
                <div className="flex gap-4 justify-end pt-2">
                  <Button
                    type="button"
                    onClick={handleCancelEditing}
                    variant="outline"
                    disabled={isSaving}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSaving || isUploadingAvatar}
                  >
                    {isSaving || isUploadingAvatar ? (
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
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  {/* Posts Tab */}
                  {activeTab === 'posts' && (
                    <>
                      {postsLoading && !initialPostsLoaded ? (
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

                  {/* Likes Tab */}
                  {activeTab === 'likes' && (
                    <>
                      {!isOwner ? (
                        <p className="text-muted-foreground">
                          Liked posts are visible only to the profile owner.
                        </p>
                      ) : isLoadingLikes ? (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
                          <Spinner size={16} className="text-current" />
                          <span>Loading liked posts...</span>
                        </div>
                      ) : likesError ? (
                        <p className="text-sm text-red-500">{likesError}</p>
                      ) : likedPosts.length === 0 ? (
                        <p className="text-muted-foreground">
                          You haven&apos;t liked any posts yet.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {likedPosts.map((post) => (
                            <PostCard key={post.$id} post={post} />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* About Tab */}
                  {activeTab === 'about' && (
                    <div className="prose max-w-none text-muted-foreground">
                      <h3 className="text-lg font-semibold mb-2">
                        About {displayName}
                      </h3>
                      <p>{displayBio || 'No bio provided.'}</p>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Joined
                          </p>
                          <p>{joinedDate}</p>
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
