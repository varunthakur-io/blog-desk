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
  LayoutDashboard,
} from 'lucide-react';

import { DashboardSkeleton } from '@/components/posts';
import { ConfirmationDialog } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

import { useDashboard } from '@/hooks/posts';
import { formatDate } from '@/utils/formatters';

const EmptyState = ({ onCreate, hasQuery }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border bg-muted/20">
    <div className="bg-muted/60 p-4 rounded-full mb-4">
      {hasQuery ? (
        <Search className="h-7 w-7 text-muted-foreground/50" />
      ) : (
        <FileText className="h-7 w-7 text-muted-foreground/50" />
      )}
    </div>
    <h3 className="text-base font-semibold tracking-tight">
      {hasQuery ? 'No matching posts' : 'No posts yet'}
    </h3>
    <p className="text-sm text-muted-foreground max-w-xs mt-1.5 mb-6 leading-relaxed">
      {hasQuery
        ? 'Try different keywords or clear the search.'
        : 'Start writing and share your first post with the world.'}
    </p>
    {!hasQuery && (
      <Button onClick={onCreate} className="rounded-full px-5 gap-2">
        <Plus className="h-4 w-4" /> Create First Post
      </Button>
    )}
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    posts,
    postsLoading,
    postsError,
    page,
    setPage,
    searchQuery,
    handleSearchChange,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    totalPages,
    totalPosts,
    isDeleting,
    postToDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteClick,
    confirmDelete,
  } = useDashboard();

  return (
    <div className="page-root">
      <div className="page-content">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="page-header-title">Dashboard</h1>
              <p className="page-header-subtitle">Manage and track your posts.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-2">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="likes">Popular</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full sm:w-[220px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts…"
                className="pl-8 h-9 text-sm w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <Button onClick={() => navigate('/create')} size="sm" className="shrink-0 gap-2 rounded-full px-4">
              <Plus className="h-4 w-4" /> New Post
            </Button>
          </div>
        </div>

        {postsError && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{postsError}</AlertDescription>
          </Alert>
        )}

        {postsLoading && posts.length === 0 ? (
          <DashboardSkeleton />
        ) : posts.length === 0 ? (
          <EmptyState onCreate={() => navigate('/create')} hasQuery={!!searchQuery} />
        ) : (
          <div className={`flex flex-col gap-4 transition-opacity duration-200 ${postsLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[420px] font-semibold text-xs uppercase tracking-wider">Title</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Created</TableHead>
                    <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.$id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium py-3.5">
                        <Link
                          to={`/posts/${post.$id}`}
                          className="hover:text-primary transition-colors text-sm line-clamp-1"
                        >
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <Badge
                          variant={post.status === 'published' ? 'default' : 'secondary'}
                          className="font-medium capitalize text-[11px] rounded-full px-2.5"
                        >
                          {post.status || 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground py-3.5">
                        {formatDate(post.$createdAt, { month: 'short' })}
                      </TableCell>
                      <TableCell className="text-right py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="shadow-lg border-border/60">
                            <DropdownMenuItem onClick={() => navigate(`/edit/${post.$id}`)} className="gap-2 cursor-pointer">
                              <Edit2 className="h-3.5 w-3.5" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(post)}
                              className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-1">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{posts.length}</span> of{' '}
                <span className="font-semibold text-foreground">{totalPosts}</span> posts
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 rounded-full px-3 gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </Button>
                <span className="text-xs font-medium text-muted-foreground px-1">
                  {page} / {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-8 rounded-full px-3 gap-1 text-xs"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => !isDeleting && setIsDeleteDialogOpen(open)}
        onConfirm={confirmDelete}
        title="Delete this post?"
        description={
          <span>
            This will permanently delete{' '}
            <span className="font-semibold text-foreground">&ldquo;{postToDelete?.title}&rdquo;</span>{' '}
            and all its comments and likes. This cannot be undone.
          </span>
        }
        confirmText={isDeleting ? 'Deleting…' : 'Delete'}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

