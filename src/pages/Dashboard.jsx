import { useNavigate } from 'react-router-dom';
import { FileText, Search } from 'lucide-react';

import {
  DashboardSkeleton,
  DashboardHeader,
  DashboardFilters,
  DashboardTable,
  DashboardPagination,
} from '@/features/posts';
import { ConfirmationDialog, EmptyState } from '@/components/common';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useDashboard } from '@/features/posts';

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

  const handleNewPost = () => navigate('/create');
  const handleEditPost = (post) => navigate(`/edit/${post.$id}`);

  return (
    <div className="page-root">
      <div className="page-content">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <DashboardHeader onNewPost={handleNewPost} />
          <DashboardFilters
            statusFilter={statusFilter}
            setStatusFilter={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            sortBy={sortBy}
            setSortBy={(v) => {
              setSortBy(v);
              setPage(1);
            }}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onNewPost={handleNewPost}
          />
        </div>

        {postsError && (
          <Alert variant="destructive" className="rounded-xl mb-6">
            <AlertDescription>{postsError}</AlertDescription>
          </Alert>
        )}

        {postsLoading && posts.length === 0 ? (
          <DashboardSkeleton />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={searchQuery ? Search : FileText}
            title={searchQuery ? 'No matching posts' : 'No posts yet'}
            description={
              searchQuery
                ? 'Try different keywords or clear the search.'
                : 'Start writing and share your first post with the world.'
            }
            action={
              !searchQuery && (
                <button
                  onClick={handleNewPost}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2"
                >
                  Create First Post
                </button>
              )
            }
          />
        ) : (
          <div
            className={`flex flex-col gap-4 transition-opacity duration-200 ${postsLoading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <DashboardTable posts={posts} onEdit={handleEditPost} onDelete={handleDeleteClick} />
            <DashboardPagination
              page={page}
              totalPages={totalPages}
              totalPosts={totalPosts}
              currentCount={posts.length}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
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
            <span className="font-semibold text-foreground">
              &ldquo;{postToDelete?.title}&rdquo;
            </span>{' '}
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
