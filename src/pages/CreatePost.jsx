import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Services and Utilities
import { postService } from '../services/postService';
import { markStale } from '../store/postSlice';
import { getRandomPostData } from '../utils/fakePostData';
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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await postService.createPost({
        title,
        content,
      });
      dispatch(markStale());
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create post:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fill random data in the form
  const fillRandomData = () => {
    const { title, content } = getRandomPostData();
    setTitle(title);
    setContent(content);
  };

  return (
    <div className="">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
          <CardDescription>
            Fill out the form below to publish a new article.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Your post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                className="min-h-[400px] resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Post'}
              </Button>

              {/* devMode */}
              {import.meta.env.DEV && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={fillRandomData}
                  disabled={loading}
                >
                  Fill Random Data
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
