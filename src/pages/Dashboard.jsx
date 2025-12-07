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
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
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
  setPostsLoading,
  setPostsError,
  setPosts,
  appendPosts,
  removePost,
} from '@/store/postSlice';
import { selectAuthUserId } from '@/store/authSlice';

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

  // Post Store Selectors
  const globalPosts = useSelector(selectAllPosts);
  const postsLoading = useSelector(selectPostsLoading);
  const postsError = useSelector(selectPostsError);

  // Auth Store Selector
  const authUserId = useSelector(selectAuthUserId);

  // Only posts of the current user
  const userPosts = useSelector((state) =>
    selectPostsByAuthor(state, authUserId),
  );

  // Local states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToDeleteTitle, setPostToDeleteTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtering by search
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return userPosts;

    const lowerQuery = searchQuery.toLowerCase();
    return userPosts.filter((p) =>
      (p.title || '').toLowerCase().includes(lowerQuery),
    );
  }, [userPosts, searchQuery]);

  useEffect(() => {
    if (!authUserId) return;

    const fetchUserPosts = async () => {
      try {
        dispatch(setPostsLoading(true));
        dispatch(setPostsError(null));

        const data = await postService.getPostsByUserId(authUserId);
        const docs = Array.isArray(data.documents) ? data.documents : [];

        dispatch(appendPosts(docs));
      } catch (err) {
        console.error('Fetch error:', err);
        dispatch(setPostsError(err?.message || 'Failed to fetch posts'));
      } finally {
        dispatch(setPostsLoading(false));
      }
    };

    fetchUserPosts();
  }, [dispatch, authUserId]);

  // Event handers
  const handleEdit = (postId) => navigate(`/edit/${postId}`);

  const handleDeleteClick = (post) => {
    setPostToDelete(post.$id);
    setPostToDeleteTitle(post.title);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);

    // Keep full list for rollback
    const previousPosts = [...globalPosts];

    try {
      // remove from store
      dispatch(removePost(postToDelete));

      await postService.deletePostById(postToDelete);
      toast.success('Post deleted successfully!');
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
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your posts and track performance.
            </p>
          </div>

          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button onClick={() => navigate('/create')} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>
        </div>

        {postsError && (
          <Alert variant="destructive">
            <AlertDescription>{postsError}</AlertDescription>
          </Alert>
        )}

        {postsLoading && filteredPosts.length === 0 ? (
          <DashboardSkeleton />
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            onCreate={() => navigate('/create')}
            hasQuery={!!searchQuery}
          />
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.$id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-0.5">
                        <span>{post.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1 font-normal">
                          {post.excerpt || 'No description'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        Published
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-muted-foreground">
                        {new Date(post.$createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
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
                          <DropdownMenuItem
                            onClick={() => handleEdit(post.$id)}
                          >
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(post)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => !isDeleting && setIsDeleteDialogOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "
              <span className="font-medium text-foreground">
                {postToDeleteTitle}
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
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
