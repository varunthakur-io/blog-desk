import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { postService } from '../services/postService';
import { markStale, setError, setLoading, setPosts } from '../store/postSlice';
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

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { posts, loading, error } = useSelector((state) => state.posts);

  const [formData, setFormData] = useState({ title: '', content: '' });

  // Find the current post in Redux state
  const currentPostFromRedux = posts.find((post) => post.$id == id);

  // Fetch the post data when component mounts or id changes
  useEffect(() => {
    const fetchAndSetPost = async () => {
      if (!id) {
        dispatch(setError('No post ID provided for editing.'));
        console.error('No post ID provided for editing.');
        return;
      }

      // If the post is already in Redux, use it to populate form
      if (currentPostFromRedux) {
        setFormData({
          title: currentPostFromRedux.title,
          content: currentPostFromRedux.content,
        });
        return; // Don't fetch if already available
      }

      // If not in Redux, fetch it from the service
      try {
        dispatch(setLoading(true));
        const data = await postService.getPostById(id);

        if (data) {
          setFormData({
            title: data.title,
            content: data.content,
          });
        } else {
          dispatch(setError('Post not found.'));
          console.error('Post not found for ID:', id);
        }
      } catch (err) {
        dispatch(setError(err.message || 'Failed to fetch post.'));
        console.error('Error fetching post:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchAndSetPost();
  }, [id, dispatch, currentPostFromRedux]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission to update the post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      dispatch(setError('Cannot update: No post ID.'));
      return;
    }
    try {
      const responseData = await postService.updatePost(id, formData);
      console.log('Post update response:', responseData);

      if (responseData && responseData.$id) {
        // Create a new array with the updated post
        const updatedPostsArray = posts.map((post) =>
          String(post.$id) === String(responseData.$id) ? responseData : post,
        );
        // Dispatch setPosts with the new array
        dispatch(setPosts(updatedPostsArray));
        dispatch(markStale());
      }

      navigate('/dashboard');
    } catch (err) {
      dispatch(setError(err.message || 'Failed to update post'));
      console.error('Error updating post:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading post...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display error if fetching failed AND there's no data to show
  if (error && !formData.title && !formData.content) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <Alert>
              <AlertDescription>Error: {error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If we are here and formData is empty, it means post wasn't found or still loading
  if (!formData.title && !formData.content && !loading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <Alert>
              <AlertDescription>Post not found or invalid ID.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>Make changes to your post below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Post title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Post content"
                className="min-h-[400px] resize-none"
                required
              />
            </div>

            <div className="flex justify-between">
              <Button type="submit">Update Post</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPost;
