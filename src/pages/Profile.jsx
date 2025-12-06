// src/pages/Profile.jsx
import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Edit, Save, Loader2, CalendarDays, Mail } from 'lucide-react';

// UI Components
import PostCard from '@/components/PostCard';
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton';
import PostCardSkeleton from '@/components/skeletons/PostCardSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
  const authLoading = useSelector(selectAuthLoading);

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

  // Dialog & Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFileToUpload, setAvatarFileToUpload] = useState(null);

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
    ? new Date(profile.$createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '—';

  // Keep local preview in sync when not editing (dialog closed)
  useEffect(() => {
    if (!isDialogOpen) {
      setAvatarPreview(avatarUrl);
    }
  }, [avatarUrl, isDialogOpen]);

  // Effect: Load profile data
  useEffect(() => {
    if (!profileId) return;

    // If it's the owner's profile and auth is still loading, wait.
    if (isOwner && authLoading) return;

    if (profile && !profileError) return;

    let cancelled = false;

    const loadProfile = async () => {
      dispatch(setProfileLoading({ userId: profileId, loading: true }));
      dispatch(setProfileError({ userId: profileId, error: null }));

      try {
        const profileObj = await authService.getProfile(profileId);
        if (cancelled) return;
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
  }, [dispatch, profileId, profile, profileError, isOwner, authLoading]);

  // Effect: Load posts once (global feed)
  useEffect(() => {
    if (initialPostsLoaded) return;

    let cancelled = false;

    const fetchPostsOnce = async () => {
      dispatch(setPostsLoading(true));
      dispatch(setPostsError(null));

      try {
        const data = await postService.getAllPosts();
        if (cancelled) return;
        const posts = Array.isArray(data) ? data : (data?.documents ?? []);
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

  // Effect: Load liked posts when tab is active
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
        setLikedPosts(Array.isArray(likedPostsArray) ? likedPostsArray : []);
      } catch (err) {
        if (!cancelled) {
          setLikesError(err?.message || 'Failed to load liked posts.');
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

  // --- Handlers ---

  const handleOpenDialog = () => {
    if (!isOwner) return;
    setEditForm({
      name: displayName || '',
      email: displayEmail || '',
      password: '',
      bio: displayBio || '',
    });
    setAvatarPreview(avatarUrl || null);
    setErrorMessage('');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (open) => {
    if (!open) {
      setIsDialogOpen(false);
      setAvatarFileToUpload(null);
      setErrorMessage('');
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    }
  };

  const handleInputChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setAvatarPreview(objectUrl);
    setAvatarFileToUpload(file);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isOwner) {
      toast.error('You are not authorized to edit this profile.');
      return;
    }

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
        await authService.updateName(editForm.name);
        dispatch(upsertProfile({ ...profile, name: editForm.name }));
      }

      // 2. Update Email
      if (editForm.email !== displayEmail) {
        await authService.updateEmail(editForm.email, editForm.password);
        dispatch(upsertProfile({ ...profile, email: editForm.email }));
      }

      // 3. Update Bio
      if (editForm.bio !== displayBio) {
        await authService.updateBio(profileId, editForm.bio);
        dispatch(upsertProfile({ ...profile, bio: editForm.bio }));
      }

      // 4. Update Avatar
      if (avatarFileToUpload) {
        setIsUploadingAvatar(true);
        const updatedProfile =
          await authService.updateAvatar(avatarFileToUpload);
        if (updatedProfile) {
          dispatch(upsertProfile(updatedProfile));
        }
        setIsUploadingAvatar(false);
      }

      toast.success('Profile updated!');
      setIsDialogOpen(false);
    } catch (err) {
      const msg = err?.message || 'Failed to update profile.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
      setIsUploadingAvatar(false);
    }
  };

  // --- Render Guards ---
  if (!profileId)
    return <div className="p-8 text-center">Profile not found.</div>;
  if (authLoading || profileLoading) return <ProfileSkeleton />;
  if (!profile && profileError)
    return <div className="p-8 text-center text-red-500">{profileError}</div>;

  return (
    <div className="py-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-background shadow-xl">
          <AvatarImage
            src={avatarUrl}
            alt={displayName}
            className="object-cover"
          />
          <AvatarFallback className="text-4xl bg-muted">
            {displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {displayName}
              </h1>
              <div className="flex items-center text-muted-foreground mt-1 text-sm gap-4">
                {isOwner && <span>{displayEmail}</span>}
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Joined {joinedDate}
                </span>
              </div>
            </div>

            <div className="flex gap-3 ">
              {isOwner ? (
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
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      onSubmit={handleSaveChanges}
                      className="space-y-6 py-4"
                    >
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
                          <Input
                            id="name"
                            name="name"
                            value={editForm.name}
                            onChange={handleInputChange}
                          />
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

                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                          />
                        </div>

                        {editForm.email !== displayEmail && (
                          <div className="grid gap-2">
                            <Label htmlFor="password">
                              Current Password (Required to change email)
                            </Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={editForm.password}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                      </div>

                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={isSaving || isUploadingAvatar}
                        >
                          {isSaving || isUploadingAvatar ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button>Follow</Button>
              )}
            </div>
          </div>

          {displayBio && (
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              {displayBio}
            </p>
          )}

          <div className="flex gap-6 pt-2">
            <div className="text-sm">
              <span className="font-bold text-foreground">{postsCount}</span>{' '}
              <span className="text-muted-foreground">posts</span>
            </div>
            <div className="text-sm">
              <span className="font-bold text-foreground">
                {followersCount}
              </span>{' '}
              <span className="text-muted-foreground">followers</span>
            </div>
            <div className="text-sm">
              <span className="font-bold text-foreground">
                {followingCount}
              </span>{' '}
              <span className="text-muted-foreground">following</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Content Tabs */}
      <Tabs
        defaultValue="posts"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mx-auto sm:mx-0 mb-8">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="likes">Liked</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {postsLoading && !initialPostsLoaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : userPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <PostCard key={post.$id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <Edit className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No posts yet</h3>
              <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                {isOwner
                  ? 'Share your thoughts with the world. Create your first post now.'
                  : "This user hasn't posted anything yet."}
              </p>
              {isOwner && (
                <Button asChild>
                  <a href="/create">Create Post</a>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="likes">
          {!isOwner ? (
            <div className="py-12 text-center text-muted-foreground">
              <p>Liked posts are private.</p>
            </div>
          ) : isLoadingLikes ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : likesError ? (
            <Alert variant="destructive">
              <AlertDescription>{likesError}</AlertDescription>
            </Alert>
          ) : likedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedPosts.map((post) => (
                <PostCard key={post.$id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
              <p className="text-muted-foreground">No liked posts yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="about">
          <div className="border rounded-lg p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Bio</h3>
              <p className="text-muted-foreground">
                {displayBio || 'No bio available.'}
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Contact
                </h4>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{displayEmail}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Joined
                </h4>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>{joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
