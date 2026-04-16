import { useNavigate } from 'react-router-dom';
import { FileText, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DashboardSkeleton,
  DashboardHeader,
  DashboardFilters,
  DashboardTable,
  DashboardPagination,
} from '@/features/posts';
import { ConfirmationDialog, EmptyState } from '@/components/common';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { useDashboard } from '@/features/posts';

/**
 * Dashboard page for users to manage their stories.
 */
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
    <article className="animate-in fade-in duration-500">
      {/* Dashboard Top Header & Filtering */}
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
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
      </header>

      {/* Dynamic Error Messaging */}
      {postsError && (
        <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5 shadow-sm">
          <AlertDescription className="font-medium">{postsError}</AlertDescription>
        </Alert>
      )}

      {/* Main Content Area */}
      <section className="min-h-[50vh]">
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
                <Button
                  onClick={handleNewPost}
                  className="mt-2 gap-2 rounded-full px-6 font-bold text-xs shadow-md transition-all active:scale-95 hover:shadow-xl"
                  aria-label="Create your first post"
                >
                  <Plus className="size-4" /> Create First Post
                </Button>
              )
            }
          />
        ) : (
          <div
            className={cn(
              'flex flex-col gap-6 transition-all duration-300',
              postsLoading && 'pointer-events-none opacity-50 grayscale-[20%]',
            )}
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
      </section>

      {/* Contextual Confirmation for Dangerous Actions */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => !isDeleting && setIsDeleteDialogOpen(open)}
        onConfirm={confirmDelete}
        title="Delete this post?"
        description={
          <span className="text-muted-foreground">
            This will permanently delete{' '}
            <strong className="font-bold text-foreground underline decoration-primary/20">
              &ldquo;{postToDelete?.title}&rdquo;
            </strong>{' '}
            and all its comments and likes. This action is irreversible.
          </span>
        }
        confirmText={isDeleting ? 'Deleting…' : 'Delete'}
        variant="destructive"
        isLoading={isDeleting}
      />
    </article>
  );
}
