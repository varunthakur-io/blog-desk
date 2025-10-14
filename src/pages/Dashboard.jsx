import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MoreHorizontal, Edit2, Trash2, Plus } from 'lucide-react';

import { postService } from '../services/postService';
import { setError, setLoading, setPosts } from '../store/postSlice';
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

const Spinner = () => (
  <div className="flex items-center justify-center py-8">
    <svg
      className="animate-spin h-8 w-8"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  </div>
);

const EmptyState = ({ onCreate }) => (
  <div className="flex flex-col items-center gap-4 py-12 text-center">
    <svg
      width="120"
      height="96"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
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
      <Plus className="mr-2 h-4 w-4" /> Create post
    </Button>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, fetched } = useSelector(
    (state) => state.posts,
  );
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [query, setQuery] = useState('');

  // keep the original logic: posts authored by current user
  const userPosts = useMemo(
    () => posts.filter((post) => post.authorId === user?.$id),
    [posts, user],
  );

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

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setIsDeleteDialogOpen(true);
  };

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

  const filtered = useMemo(() => {
    if (!query.trim()) return userPosts;
    const q = query.toLowerCase();
    return userPosts.filter((p) => (p.title || '').toLowerCase().includes(q));
  }, [userPosts, query]);

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="border-0">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="  ">
            <CardTitle className="text-xl">Your Posts</CardTitle>
            <CardDescription>
              Manage and edit posts you've created.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-muted border rounded-md px-3 py-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-48 placeholder:text-muted-foreground"
                placeholder="Search title..."
                aria-label="Search posts by title"
              />
            </div>

            <Button onClick={() => navigate('/create')}>
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="text-center">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <EmptyState onCreate={() => navigate('/create')} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((post) => (
                    <TableRow
                      key={post.$id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="flex items-center gap-3">
                        {/* <div className="h-8 w-8 flex items-center justify-center rounded-md bg-gray-100 text-sm font-semibold">
                          {(post.title || '—')[0].toUpperCase()}
                        </div> */}
                        <div className="truncate">
                          <div className="font-medium truncate max-w-[28rem]">
                            {post.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[28rem]">
                            {post.excerpt || ''}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
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
                            aria-label={`Edit ${post.title}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                aria-label="Open actions"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEdit(post.$id)}
                              >
                                <span className="flex items-center gap-2">
                                  <Edit2 className="h-4 w-4" /> Edit
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(post.$id)}
                                className="text-destructive"
                              >
                                <span className="flex items-center gap-2">
                                  <Trash2 className="h-4 w-4" /> Delete
                                </span>
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
