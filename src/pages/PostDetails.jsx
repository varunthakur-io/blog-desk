import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';

import { postService } from '../services/postService';
import { setError, setLoading } from '../store/postSlice';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { posts, loading, error } = useSelector((state) => state.posts);

  // Find the current post in Redux state
  const currentPostFromRedux = posts.find((post) => {
    return post && post.$id !== undefined && String(post.$id) === String(id);
  });

  // Initialize local 'post' state based on Redux, or null if not found yet
  const [post, setPost] = useState(currentPostFromRedux || null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        dispatch(setError('No post ID provided.')); // Dispatch Redux action
        // No need to dispatch setLoading(false) here, as no fetch attempt is made
        return;
      }

      // If the post is already in Redux state, use it and avoid re-fetching
      if (currentPostFromRedux) {
        setPost(currentPostFromRedux);
        dispatch(setLoading(false));
        return;
      }

      // If not in Redux, proceed with fetching
      dispatch(setLoading(true));
      try {
        const fetchedPost = await postService.getPostById(id);

        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          dispatch(setError('Post not found.'));
          console.log('Post not found for ID:', id);
        }
      } catch (err) {
        dispatch(
          setError(err.message || 'Failed to load post. Please try again.'),
        );
        console.error('Error details:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPost();
  }, [id, dispatch, currentPostFromRedux]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center ">
        <Card className="border-0">
          <CardContent className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-6"></div>
            <p className="text-zinc-400 text-lg">Loading article...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  // Handle error or no post found
  if (error || !post) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Alert>
                <AlertDescription>
                  {error || 'The article you are looking for does not exist.'}
                </AlertDescription>
              </Alert>
              <Button onClick={() => navigate('/')} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Main Post Details UI ---
  return (
    <div className="container">
      <Card className="max-w-4xl mx-auto border-0">
        <CardHeader className="border-0">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
                {post.title}
              </CardTitle>

              <CardDescription className="flex items-center space-x-2 text-base">
                <Badge variant="secondary">By {post.authorName}</Badge>
                <span className="text-muted-foreground">•</span>
                <span className="text-foreground">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </CardDescription>
            </div>

            {/* Back Button */}
            <div className="align">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-justify">
              {post.content}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetails;
