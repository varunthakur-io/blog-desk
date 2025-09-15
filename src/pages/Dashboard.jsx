import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MoreHorizontal } from 'lucide-react';

import { postService } from '../services/postService';
import { setError, setLoading, setPosts } from '../store/postSlice';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, fetched } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const userPosts = posts.filter((post) => post.authorId === user?.$id);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(setLoading(true));
        const data = await postService.getAllPosts();
        dispatch(setPosts(data));
      } catch (err) {
        dispatch(setError(err.message || 'Failed to fetch posts'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (!fetched) fetchPosts();
  }, [dispatch, fetched]);

  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(postId);
        dispatch(setPosts(posts.filter((post) => post.$id !== postId)));
      } catch (error) {
        dispatch(setError(error.message || 'Failed to delete post'));
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Posts</CardTitle>
            <CardDescription>Manage your blog posts here.</CardDescription>
          </div>
          <Button onClick={() => navigate('/create')}>+ New Post</Button>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-destructive text-center mb-4">{error}</p>
          )}
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : userPosts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                You haven&apos;t written any posts yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPosts.map((post) => (
                  <TableRow key={post.$id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(post.$id)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(post.$id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
