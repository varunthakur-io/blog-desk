import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

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
import { Alert, AlertDescription } from '@/components/ui/alert';

// Services & Store
import { postService } from '../services/postService';
import { selectPostById, upsertPost } from '../store/postSlice';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors
  const post = useSelector((state) => selectPostById(state, id));

  // Local States
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Effect: Load Post Data
  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      if (!id) {
        setError('Invalid post ID.');
        setIsLoading(false);
        return;
      }

      // If post already in Redux, use it
      if (post) {
        setFormData({
          title: post.title || '',
          content: post.content || '',
        });
        setIsLoading(false);
        return;
      }

      // Fallback: fetch from API
      try {
        const data = await postService.getPostById(id);

        if (!mounted) return;

        if (data && data.$id) {
          setFormData({
            title: data.title || '',
            content: data.content || '',
          });

          // keep Redux posts cache in sync
          dispatch(upsertPost(data));
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load post.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadPost();

    return () => {
      mounted = false;
    };
  }, [id, post, dispatch]);

  // Event Handlers
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const updatedPost = await postService.updatePost(id, formData);

      if (updatedPost && updatedPost.$id) {
        // Update global posts state
        dispatch(upsertPost(updatedPost));
        toast.success('Post updated successfully');
        navigate('/dashboard');
      } else {
        toast.error('Failed to update post.');
      }
    } catch (err) {
      console.error('Update failed:', err);
      const msg = err.message || 'Failed to update post';
      toast.error(msg);
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Render States
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] p-4">
        <Card className="w-full max-w-lg border-destructive/50">
          <CardContent className="pt-6">
            <Alert variant="destructive" className="border-none">
              <AlertDescription className="text-center font-medium">
                {error}
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:pl-2 transition-all"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="text-2xl">Edit Post</CardTitle>
          <CardDescription>Make changes to your existing post.</CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Post title"
                disabled={isSaving}
                className="text-lg font-medium"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content here..."
                className="min-h-[400px] resize-none leading-relaxed"
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
