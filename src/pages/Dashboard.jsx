
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MoreHorizontal, Edit2, Trash2, Plus } from 'lucide-react';
import Loader from '@/components/Loader';

// Redux actions and services
import { postService } from '../services/postService';
import { setError, setLoading, setPosts } from '../store/postSlice';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

// Empty state
const EmptyState = ({ onCreate }) => (
  <div className="flex flex-col items-center gap-4 py-16 text-center">
    <svg
      width="120"
      height="96"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="20"
        width="104"
        height="64"
        rx="6"
        stroke="#CBD5E1"
        strokeWidth="2"
      />
      <path d="M20 36h80" stroke="#E2E8F0" strokeWidth="2" />
      <path d="M20 52h50" stroke="#E2E8F0" strokeWidth="2" />
    </svg>
    <h3 className="text-lg font-medium">No posts yet</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      Write your first post and share your ideas with the world.
    </p>
    <Button onClick={onCreate} className="mt-2">
      <Plus className="mr-2 h-4 w-4" /> Create Post
    </Button>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, loading, error, fetched } = useSelector(
    (state) => state.posts,
  );
  const { user } = useSelector((state) => state.auth);

  // Local dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [query, setQuery] = useState('');

  // Filtered posts
  const userPosts = useMemo(
    () => posts.filter((post) => post.authorId === user?.$id),
    [posts, user],
  );

  // Fetch posts on mount if not already fetched
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


  const handleEdit = (postId) => navigate(`/edit/${postId}`);

  // Handle delete button click
  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setIsDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await postService.deletePost(postToDelete);
      dispatch(setPosts(posts.filter((post) => post.$id !== postToDelete)));
    } catch (err) {
      dispatch(setError(err.message || 'Failed to delete post'));
    } finally {
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  // Search filter posts
  const filtered = useMemo(() => {
    if (!query.trim()) return userPosts;
    const q = query.toLowerCase();
    return userPosts.filter((p) => (p.title || '').toLowerCase().includes(q));
  }, [userPosts, query]);

  return (
    <div className="container mx-auto py-12 px-12">
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div>
            <CardTitle className="text-2xl font-semibold">Your Posts</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Manage and edit posts you’ve created.
            </CardDescription>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-muted border rounded-md px-4 py-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-60 placeholder:text-muted-foreground"
                placeholder="Search title..."
              />
            </div>

            <Button onClick={() => navigate('/create')} className="px-5">
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription className="text-center">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <Loader text="Fetching your posts..." size={28} />
          ) : filtered.length === 0 ? (
            <EmptyState onCreate={() => navigate('/create')} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((post) => (
                    <TableRow key={post.$id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[30rem]">
                          {post.excerpt || ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(post.$createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(post.$id)}
                            className="mr-2"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEdit(post.$id)}
                              >
                                <Edit2 className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(post.$id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
