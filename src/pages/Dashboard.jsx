// Dashboard.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Plus,
  Search,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

// UI Components
import { Spinner } from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Card } from '@/components/ui/card';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Services & Store
import { postService } from '@/services/postService';
import {
  selectAllPosts,
  selectPostsByAuthor,
  selectPostsLoading,
  selectPostsError,
  selectInitialLoaded,
  setPostsLoading,
  setPostsError,
  setPosts,
  setInitialLoaded,
  removePost,
} from '@/store/postSlice';

// Empty state component
const EmptyState = ({ onCreate, hasQuery }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-muted/10">
    <div className="bg-muted/30 p-4 rounded-full mb-4">
      {hasQuery ? (
        <Search className="h-8 w-8 text-muted-foreground/50" />
      ) : (
        <FileText className="h-8 w-8 text-muted-foreground/50" />
      )}
    </div>
    <h3 className="text-lg font-semibold tracking-tight">
      {hasQuery ? 'No matching posts found' : 'No posts created yet'}
    </h3>
    <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
      {hasQuery
        ? "We couldn't find any posts matching your search. Try different keywords."
        : 'Get started by creating your first post. Share your thoughts and ideas with the world.'}
    </p>
    {!hasQuery && (
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" /> Create First Post
      </Button>
    )}
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const allPosts = useSelector(selectAllPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const initialLoaded = useSelector(selectInitialLoaded);
  const { user } = useSelector((state) => state.auth);

  // Only posts of the current user
  const myPosts = useSelector((state) => selectPostsByAuthor(state, user?.$id));

  // Local states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtering by search
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return myPosts;

    const lowerQuery = searchQuery.toLowerCase();
    return myPosts.filter((p) =>
      (p.title || '').toLowerCase().includes(lowerQuery),
    );
  }, [myPosts, searchQuery]);

  useEffect(() => {
    // Fetch all posts if not initially loaded
    if (initialLoaded) return;

    const fetchPosts = async () => {
      try {
        dispatch(setPostsLoading(true));
        dispatch(setPostsError(null));

        const data = await postService.getAllPosts();
        const docs = Array.isArray(data) ? data : (data?.documents ?? []);

        dispatch(setPosts(docs));
        dispatch(setInitialLoaded(true));
      } catch (err) {
        console.error('Fetch error:', err);
        dispatch(setPostsError(err?.message || 'Failed to fetch posts'));
      } finally {
        dispatch(setPostsLoading(false));
      }
    };

    fetchPosts();
  }, [dispatch, initialLoaded]);

  // Event handers
  const handleEdit = (postId) => navigate(`/edit/${postId}`);

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);

    // Keep full list for rollback
    const previousPosts = [...allPosts];

    try {
      // remove from store
      dispatch(removePost(postToDelete));

      await postService.deletePost(postToDelete);
      toast.success('Post deleted successfully');
    } catch (err) {
      toast.error(err.message);
      // Rollback
      dispatch(setPosts(previousPosts));
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-6xl min-h-[80vh]">
      <Card className="border-none shadow-none bg-transparent">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your posts and track performance
            </p>
          </div>

          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-9 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              onClick={() => navigate('/create')}
              className="shrink-0 shadow-sm"
            >
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && !initialLoaded ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Spinner size={32} />
            <p className="text-muted-foreground animate-pulse">
              Loading your dashboard...
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            onCreate={() => navigate('/create')}
            hasQuery={!!searchQuery}
          />
        ) : (
          <Card className="border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[45%] pl-6">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow
                      key={post.$id}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-semibold text-base leading-none text-foreground/90 group-hover:text-primary transition-colors">
                            {post.title}
                          </span>
                          <span className="text-sm text-muted-foreground/80 line-clamp-1 font-normal">
                            {post.excerpt || 'No description provided'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-transparent font-medium"
                        >
                          Published
                        </Badge>
                      </TableCell>

                      <TableCell className="py-4">
                        <span className="text-sm text-muted-foreground font-medium">
                          {new Date(post.$createdAt).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            },
                          )}
                        </span>
                      </TableCell>

                      <TableCell className="text-right pr-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(post.$id)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuLabel>Manage Post</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleEdit(post.$id)}
                                className="cursor-pointer"
                              >
                                <Edit2 className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(post.$id)}
                                className="text-destructive focus:text-destructive cursor-pointer"
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
          </Card>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => !isDeleting && setIsDeleteDialogOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "
              <span className="font-medium text-foreground">
                {allPosts.find((p) => p.$id === postToDelete)?.title}
              </span>
              " and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? 'Deleting...' : 'Delete Post'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
