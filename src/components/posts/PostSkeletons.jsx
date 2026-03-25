import { Skeleton } from '@/components/ui/skeleton';

// ─── Post Card Skeleton ──────────────────────────────────────────────

export const PostCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-pulse">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="pt-4 px-5 pb-5 flex flex-col gap-3 text-left">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 rounded-md" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-3.5 w-8 rounded" />
            <Skeleton className="h-3.5 w-8 rounded" />
            <Skeleton className="h-3.5 w-8 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-3/4 rounded" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-7 w-7 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <Skeleton className="h-3.5 w-10 rounded" />
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard Skeleton ─────────────────────────────────────────────

export const DashboardSkeleton = () => {
  return (
    <div className="page-content text-left">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-48 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm mt-6">
        <div className="flex items-center gap-4 px-4 py-3 bg-muted/40 border-b border-border/50">
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-8 ml-auto" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5 border-b border-border/30 last:border-0"
          >
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-full ml-auto" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between py-1 mt-4">
        <Skeleton className="h-4 w-36" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// ─── Form Skeleton ──────────────────────────────────────────────────

export const FormSkeleton = () => {
  return (
    <div className="page-root flex gap-8 text-left">
      <div className="hidden md:flex w-48 shrink-0 flex-col gap-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="aspect-video w-full rounded-lg" />
        </div>
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-px w-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="border-b border-border bg-muted/30 px-3 py-2 flex items-center gap-1">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-md" />
            ))}
          </div>
          <div className="p-6 md:p-8 space-y-4">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-px w-full" />
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Post Details Skeleton ───────────────────────────────────────────

export const PostDetailsSkeleton = () => {
  return (
    <div className="page-root text-left">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-0 lg:gap-8 xl:gap-12">
        <div className="hidden lg:flex flex-col gap-6">
          <Skeleton className="h-9 w-full rounded-md" />
          <div>
            <Skeleton className="h-3 w-12 mb-3" />
            <div className="px-3 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
          <div>
            <Skeleton className="h-3 w-16 mb-2" />
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between px-3 py-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-3 w-14 mb-2" />
            <div className="space-y-1">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-6 pb-10">
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-4/5" />
          </div>
          <Skeleton className="w-full rounded-xl" style={{ height: '360px' }} />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
};
