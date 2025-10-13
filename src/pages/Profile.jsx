import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Edit, Save, X, Camera } from 'lucide-react';
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

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? '');

export default function Profile() {
  const dispatch = useDispatch(); // update redux user after edits
  const authUser = useSelector((state) => state.auth?.user);
  const authLoading = useSelector((state) => state.auth?.loading);

  // local UI state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts'); // posts | likes | about
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const fileRef = useRef(null);

  // hydrate form with authUser
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || '',
        email: authUser.email || '',
        password: '',
        bio: authUser.prefs?.bio || '',
      });
    }
  }, [authUser]);

  // fetch user's posts (best-effort: uses postService.getAllPosts and filters by author id)
  useEffect(() => {
    let mounted = true;
    async function loadPosts() {
      try {
        setPostsLoading(true);
        // try user-specific API first (if you have one)
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
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
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

    try {
      setSaving(true);

      // Update name/bio/email depending on your authService API
      // You may have separate methods: updateName, updateEmail, updateProfile - adapt accordingly.
      // Example: call a single updateProfile that accepts partial fields:
      if (authService.updateProfile) {
        // preferred: single call
        const payload = {
          name: formData.name,
          bio: formData.bio,
          email: formData.email !== authUser.email ? formData.email : undefined,
          currentPassword:
            formData.email !== authUser.email ? formData.password : undefined,
        };
        const updated = await authService.updateProfile(payload);
        // if backend returns updated user, update redux
        if (updated?.user && dispatch) {
          dispatch({ type: 'auth/setUser', payload: updated.user }); // adapt action name
        } else if (dispatch) {
          // if not returned, you might want to re-fetch current user
          // const refreshed = await authService.getCurrentUser();
          // dispatch({ type: 'auth/setUser', payload: refreshed });
        }
      } else {
        // fallback: call individual methods
        if (formData.name !== authUser.name)
          await authService.updateName(formData.name);
        if (formData.bio !== authUser.prefs?.bio) {
          if (authService.updatePrefs)
            await authService.updatePrefs({ bio: formData.bio });
        }
        if (formData.email !== authUser.email) {
          await authService.updateEmail(formData.email, formData.password);
        }
        // optionally refresh user
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setFormData((p) => ({ ...p, password: '' }));
    } catch (err) {
      console.error('Profile update failed', err);
      setError(err?.message || 'Update failed. Please try again.');
      toast.error(err?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  // avatar upload
  const handleAvatarClick = () => fileRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Please use an image smaller than 3 MB.');
      return;
    }

    try {
      setAvatarUploading(true);
      // adapt: authService.updateAvatar(file) should return updated user or avatar url
      const result = await authService.updateAvatar(file);
      if (result?.user && dispatch) {
        dispatch({ type: 'auth/setUser', payload: result.user }); // adapt to your action
      } else if (result?.avatarUrl && dispatch) {
        // you could patch local user in redux manually
        dispatch({ type: 'auth/patchAvatar', payload: result.avatarUrl }); // adapt action
      } else {
        // fallback: re-fetch current user if available
        try {
          const refreshed = authService.getCurrentUser
            ? await authService.getCurrentUser()
            : null;
          if (refreshed && dispatch)
            dispatch({ type: 'auth/setUser', payload: refreshed });
        } catch (err) {
          console.error('Failed to refresh user after avatar update', err);
        }
      }
      toast.success('Avatar updated!');
    } catch (err) {
      console.error('Avatar upload error', err);
      toast.error(err?.message || 'Failed to upload avatar.');
    } finally {
      setAvatarUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
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
                  <AvatarImage
                    src={authUser?.prefs?.avatar}
                    alt={authUser?.name}
                  />
                  <AvatarFallback className="text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={avatarUploading}
                  className="absolute bottom-0 right-0 -translate-y-2 translate-x-2 bg-card/80 border border-border/40 rounded-full p-2 shadow-sm hover:scale-105 transition-transform"
                  aria-label="Change avatar"
                >
                  {avatarUploading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>

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

                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin inline-block"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
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
