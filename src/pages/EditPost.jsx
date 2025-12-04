import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

// UI Components
import FormSkeleton from '@/components/skeletons/FormSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PostForm from '@/components/PostForm';

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
  const [formData, setFormData] = useState(null);
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
  const handleUpdate = async (data) => {
    if (!id) return;

    if (!data.title.trim() || !data.content.trim()) {
      toast.error('Title and content are required.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const updatedPost = await postService.updatePost(id, data);

      if (updatedPost && updatedPost.$id) {
        // Update global posts state
        dispatch(upsertPost(updatedPost));
        toast.success('Post updated successfully!');
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
    return <FormSkeleton />;
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PostForm
        mode="edit"
        initialData={formData}
        onSubmit={handleUpdate}
        isSubmitting={isSaving}
        onBackClick={() => navigate('/dashboard')}
      />
    </div>
  );
}
