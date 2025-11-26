import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Send } from 'lucide-react';

// Services and Store
import { postService } from '../services/postService';
import { markStale } from '../store/postSlice';
import { setProfile } from '@/store/profileSlice';
import { getRandomPostData } from '../utils/fakePostData';

// UI Components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- Redux State ---
  const { user } = useSelector((state) => state.auth);
  // We need access to the cache to update it immediately after posting
  const cachedProfiles = useSelector((state) => state.profile?.profiles);

  // --- Local State ---
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const fillRandomData = () => {
    const data = getRandomPostData();
    setFormData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create a post.');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create Post via API
      const newPost = await postService.createPost({
        title: formData.title,
        content: formData.content,
      });

      // 2. Mark Global Feed as Stale (forces refresh on dashboard)
      dispatch(markStale());

      // 3. Update Profile Cache (Optimistic UI)
      // If we have visited the profile, update the cached posts list immediately
      // so the user sees their new post without a re-fetch when they visit "My Profile".
      const userProfileCache = cachedProfiles?.[user.$id];

      if (userProfileCache) {
        // Ensure we have a valid posts array to append to
        const currentPosts = Array.isArray(userProfileCache.posts)
          ? userProfileCache.posts
          : [];

        dispatch(
          setProfile({
            profileId: user.$id,
            data: {
              ...userProfileCache,
              posts: [newPost, ...currentPosts], // Prepend new post
            },
          }),
        );
      }

      toast.success('Post published successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Create post error:', error);
      toast.error(error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>
            Share your thoughts with the community.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Give your post a catchy title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="font-medium"
              />
            </div>

            {/* Content Input */}
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your masterpiece here..."
                className="min-h-[400px] resize-none leading-relaxed"
                value={formData.content}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Create Post
                  </>
                )}
              </Button>

              {/* Dev Helper: Random Data */}
              {import.meta.env.DEV && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={fillRandomData}
                  disabled={isSubmitting}
                  className="text-muted-foreground hover:text-foreground"
                >
                  🎲 Auto-Fill
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
