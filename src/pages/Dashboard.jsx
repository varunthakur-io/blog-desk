// Dashboard.jsx
import { Link, useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Plus,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// UI Components
import { DashboardSkeleton } from '@/components/posts';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Hooks
import { useDashboard } from '@/hooks/posts';

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
  const navigate = useNavigate();
  const {
    posts, postsLoading, postsError, page, setPage, searchQuery, handleSearchChange,
    statusFilter, setStatusFilter, sortBy, setSortBy, totalPages, totalPosts,
    isDeleting, postToDelete, isDeleteDialogOpen, setIsDeleteDialogOpen,
    handleDeleteClick, confirmDelete
  } = useDashboard();

  return (
    <div className="py-2">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your posts and track performance.
            </p>
          </div>

          <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-2">
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="likes">Popular</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full md:w-[250px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
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

        {postsLoading && posts.length === 0 ? (
          <DashboardSkeleton />
        ) : posts.length === 0 ? (
          <EmptyState
            onCreate={() => navigate('/create')}
            hasQuery={!!searchQuery}
          />
        ) : (
          <div className={`flex flex-col gap-4 transition-opacity duration-200 ${postsLoading ? 'opacity-50 pointer-events-none' : ''}`}>
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
                  {posts.map((post) => (
                    <TableRow key={post.$id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-0.5">
                          <Link to={`/posts/${post.$id}`} className="hover:underline">
                            <span>{post.title}</span>
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.published ? 'default' : 'outline'} className="font-normal">
                          {post.published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {new Date(post.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/edit/${post.$id}`)}>
                              <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteClick(post)} className="text-destructive focus:text-destructive">
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

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Showing {posts.length} of {totalPosts} posts</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <div className="text-sm font-medium">Page {page} of {totalPages || 1}</div>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => !isDeleting && setIsDeleteDialogOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "<span className="font-medium text-foreground">{postToDelete?.title}</span>" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmDelete(); }} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
