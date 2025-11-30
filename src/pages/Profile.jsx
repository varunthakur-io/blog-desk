import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// Icons
import { User, Edit, Save, X, Camera } from 'lucide-react';

// Store & Services
import { setProfile } from '@/store/profileSlice';
import { setUser } from '@/store/authSlice';
import { authService } from '../services/authService';
import { postService } from '../services/postService';

// UI Components
import { Spinner } from '@/components/Loader';
import PostCard from '../components/PostCard';
import ProfileSkeleton from '@/components/ProfileSkeleton';
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
// import { tr } from 'zod/v4/locales';

// --- Utilities ---
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? '');

export default function Profile() {
  const dispatch = useDispatch();
  const { id } = useParams();

  // --- Redux Selectors ---
  const authUser = useSelector((state) => state.auth?.user);
  const authLoading = useSelector((state) => state.auth?.loading);
  const cachedProfiles = useSelector((state) => state.profile?.profiles);

  // --- Derived Identity & Refs ---
  const profileId = id || authUser?.$id;
  const isOwner = !!authUser && authUser.$id === profileId;
  const cachedData = cachedProfiles?.[profileId];

  // Refs
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null); // Tracks object URL for memory cleanup
  const prevPostsIdRef = useRef(null); // Prevents duplicate post fetches

  // --- Component State ---

  // Data State
  const [fetchedProfile, setFetchedProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  // Liked posts state (for Likes tab)
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const [likesError, setLikesError] = useState('');
  // const [hasLoadedLikesOnce, setHasLoadedLikesOnce] = useState(false);

  // Form & UI State
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileToUpload, setAvatarFileToUpload] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  // Loading & Error Flags
  const [isLoadingProfile, setIsLoadingProfile] = useState(
    () => !cachedData && !!profileId,
  );
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // --- Helper: Determine who to display ---
  const displayUser = isOwner ? authUser : fetchedProfile || cachedData;

  // --------------------------------------------------------------------------
  // Effect 1: Load Profile Data (UserInfo)
  // --------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function fetchProfileData(pid) {
      if (!pid) {
        setFetchedProfile(null);
        setAvatarPreview(null);
        setIsLoadingProfile(false);
        return;
      }

      // 1. Optimization: Use Redux cache if available
      if (cachedData) {
        if (!mounted) return;
        setFetchedProfile(cachedData);

        // Sync preview with cached data
        const currentAvatar = isOwner
          ? authUser?.profile?.avatarUrl
          : cachedData.avatarUrl;
        setAvatarPreview(currentAvatar ?? null);

        setIsLoadingProfile(false);
        return;
      }

      // 2. Fetch from API
      setIsLoadingProfile(true);
      try {
        const doc = await authService.getProfile(pid);
        if (!mounted) return;

        setFetchedProfile(doc);

        // Update Redux Cache
        dispatch(setProfile({ profileId: pid, data: doc }));

        // Sync preview
        const currentAvatar = isOwner
          ? authUser?.profile?.avatarUrl
          : doc?.avatarUrl;
        setAvatarPreview(currentAvatar ?? null);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setFetchedProfile(null);
        // Fallback to authUser image if available
        setAvatarPreview(isOwner ? authUser?.profile?.avatarUrl : null);
      } finally {
        if (mounted) setIsLoadingProfile(false);
      }
    }

    fetchProfileData(profileId);

    return () => {
      mounted = false;
    };
  }, [profileId, cachedData, isOwner, authUser, dispatch]);

  // --------------------------------------------------------------------------
  // Effect 2: Load User Posts (With Redux Caching)
  // --------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function fetchUserPosts(pid) {
      if (!pid) {
        setUserPosts([]);
        return;
      }

      // 1. Check Redux cache first
      const cachedPosts = cachedProfiles?.[pid]?.posts;

      if (Array.isArray(cachedPosts)) {
        setUserPosts(cachedPosts);
        setIsLoadingPosts(false);

        // Prevent background re-fetch if ID hasn't changed
        if (prevPostsIdRef.current === pid) return;
      }

      prevPostsIdRef.current = pid;

      try {
        if (!Array.isArray(cachedPosts)) {
          setIsLoadingPosts(true);
        }

        // Fetch Logic
        let docs = [];
        if (postService.getPostsByAuthor) {
          const res = await postService.getPostsByAuthor(pid);
          if (!mounted) return;
          docs = Array.isArray(res) ? res : (res.documents ?? []);
        } else {
          // Fallback logic
          const res = await postService.getAllPosts(1, 100);
          if (!mounted) return;
          const allDocs = Array.isArray(res) ? res : (res.documents ?? []);
          docs = allDocs.filter((p) => String(p.authorId) === String(pid));
        }

        setUserPosts(docs);

        // 2. Update Redux Cache with new posts
        const currentCache = cachedProfiles?.[pid] || {};
        if (pid) {
          dispatch(
            setProfile({
              profileId: pid,
              data: { ...currentCache, posts: docs },
            }),
          );
        }
      } catch (err) {
        console.error('Post fetch error:', err);
      } finally {
        if (mounted) setIsLoadingPosts(false);
      }
    }

    fetchUserPosts(profileId);
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, cachedProfiles]);

  // --------------------------------------------------------------------------
  // Effect 3: Load Liked Posts (Owner's Likes Tab)
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Effect 3: Load Liked Posts (Owner's Likes Tab) — with comments
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Only run if:
    // 1. The user is the profile owner
    // 2. The active tab is "likes"
    // 3. A valid profileId exists
    if (!isOwner) return;
    if (activeTab !== 'likes') return;
    if (!profileId) return;

    // Track component mount state to prevent state updates after unmount
    let mounted = true;

    // Main function to load liked posts
    async function fetchLikedPosts(pid) {
      try {
        // Start loading and clear any old errors
        setIsLoadingLikes(true);
        setLikesError('');

        // Check Redux cache first
        const likedCachePost = cachedProfiles?.[pid]?.likedPosts;

        // If cached data exists, use it immediately
        if (likedCachePost) {
          setLikedPosts(likedCachePost);
          setIsLoadingLikes(false);
          return;
        }

        // If not cached, request from API
        const posts = await postService.getLikedPostsByUser(pid);

        // Component might have unmounted during the fetch
        if (!mounted) return;

        // Normalize posts and store in local state
        setLikedPosts(Array.isArray(posts) ? posts : (posts?.documents ?? []));

        // Build new cache entry for Redux
        const currentCache = cachedProfiles?.[pid] || {};

        // Save fetched posts to Redux cache
        dispatch(
          setProfile({
            profileId: pid,
            data: { ...currentCache, likedPosts: posts },
          }),
        );
      } catch (err) {
        console.error('Liked posts fetch error:', err);

        // Only update error state if component is still mounted
        if (mounted) {
          setLikesError('Failed to load liked posts. Please try again.');
        }
      } finally {
        // Ensure loading state resets only if still mounted
        if (mounted) setIsLoadingLikes(false);
      }
    }

    // Call the function with the correct profileId
    fetchLikedPosts(profileId);

    // Cleanup: runs when tab changes, profile changes, or component unmounts
    return () => {
      mounted = false;
    };
  }, [activeTab, isOwner, profileId, cachedProfiles, dispatch]);

  // --------------------------------------------------------------------------
  // Effect 4: Memory Cleanup for Image Previews
  // --------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------

  const handleInputChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStartEditing = () => {
    if (!isOwner) {
      toast.error('You can only edit your own profile.');
      return;
    }

    // Initialize form with fresh data ONLY when editing starts
    setEditForm({
      name: displayUser?.name || '',
      email: authUser?.email || '',
      password: '',
      bio: displayUser?.profile?.bio || displayUser?.bio || '',
    });

    // Ensure preview is consistent with current real data
    setAvatarPreview(
      displayUser?.profile?.avatarUrl || displayUser?.avatarUrl || null,
    );

    setIsEditing(true);
    setErrorMessage('');
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setErrorMessage('');
    setAvatarFileToUpload(null);
    setEditForm((prev) => ({ ...prev, password: '' })); // Clear password for security

    // Revert preview to the actual saved image
    const savedUrl = authUser?.profile?.avatarUrl || fetchedProfile?.avatarUrl;
    setAvatarPreview(savedUrl ?? null);

    // Clean up local blob
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
      // 3MB Limit
      toast.error('Image must be smaller than 3 MB.');
      return;
    }

    // Cleanup previous blob
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    // Create new blob for instant feedback
    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setAvatarPreview(objectUrl);
    setAvatarFileToUpload(file);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isOwner) return;

    // Validation
    if (!editForm.name || editForm.name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters.');
      return;
    }
    if (!isValidEmail(editForm.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (editForm.email !== authUser.email && !editForm.password) {
      setErrorMessage('Current password is required to change email.');
      return;
    }

    setIsSaving(true);

    try {
      // 1. Update Name
      if (editForm.name !== authUser.name) {
        await authService.updateName(editForm.name);
        dispatch(
          setUser({
            ...authUser,
            name: editForm.name,
            profile: { ...(authUser?.profile || {}), name: editForm.name },
          }),
        );
      }

      // 2. Update Email
      if (editForm.email !== authUser.email) {
        await authService.updateEmail(editForm.email, editForm.password);
        dispatch(setUser({ ...authUser, email: editForm.email }));
      }

      // 3. Update Bio
      if (editForm.bio !== authUser?.profile?.bio) {
        await authService.updateBio(authUser.$id, editForm.bio);
        dispatch(
          setUser({
            ...authUser,
            profile: { ...(authUser?.profile || {}), bio: editForm.bio },
          }),
        );
      }

      // 4. Update Avatar
      if (avatarFileToUpload) {
        setIsUploadingAvatar(true);
        const updatedProfile =
          await authService.updateAvatar(avatarFileToUpload);

        if (updatedProfile) {
          setAvatarPreview(updatedProfile.avatarUrl);

          // FIX: Dispatch new avatar URL to Redux so it persists on navigation
          dispatch(
            setUser({
              ...authUser,
              profile: {
                ...(authUser?.profile || {}),
                avatarUrl: updatedProfile.avatarUrl,
              },
            }),
          );
        }

        setAvatarFileToUpload(null);
        setIsUploadingAvatar(false);
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setEditForm((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      console.error('Save failed:', err);
      const msg = err?.message || 'Failed to update profile. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
      setIsUploadingAvatar(false);
    }
  };

  // --- Render Helpers ---
  const postsCount = userPosts.length ?? authUser?.prefs?.postsCount ?? 0;
  const followersCount = authUser?.prefs?.followers ?? 0;
  const followingCount = authUser?.prefs?.following ?? 0;

  if (authLoading || isLoadingProfile || !profileId) return <ProfileSkeleton />;

  return (
    <main className="min-h-screen">
      <div>
        <Card className="border-0">
          <CardHeader className="text-center">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* --- Avatar Section --- */}
              <div className="relative">
                <Avatar className="w-28 h-28">
                  <AvatarImage
                    src={avatarPreview ?? undefined}
                    alt={displayUser?.name || 'User'}
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

              {/* --- Header Info Section --- */}
              <div className="flex-1 min-w-0 text-left md:text-left">
                <CardTitle className="text-2xl leading-tight">
                  {displayUser?.name}
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

              {/* --- Action Buttons --- */}
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

              {/* --- Name Input --- */}
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  // If editing, show form state. If viewing, show derived display user.
                  value={isEditing ? editForm.name : displayUser?.name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              {/* --- Email Input (Owner Only) --- */}
              {isOwner && (
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={isEditing ? editForm.email : authUser?.email || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              )}

              {/* --- Bio Input --- */}
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  type="text"
                  placeholder="A short bio"
                  value={
                    isEditing
                      ? editForm.bio
                      : displayUser?.profile?.bio || displayUser?.bio || ''
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              {/* --- Password Input (Only when editing) --- */}
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

              {/* --- Save / Cancel Buttons --- */}
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

              {/* --- Tabs Section --- */}
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
                      {isLoadingPosts ? (
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
                        About {displayUser?.name}
                      </h3>
                      <p>
                        {displayUser?.profile?.bio ||
                          displayUser?.bio ||
                          'No bio provided.'}
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
