import { Skeleton } from '@/components/ui/skeleton';

/**
 * High-fidelity skeleton for the Profile page to prevent layout shift.
 */
export const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-page-gap">
    <div className="flex flex-col items-start gap-16 lg:flex-row">
      
      {/* ── Main Content Skeleton (Left) ── */}
      <div className="order-2 w-full min-w-0 flex-1 space-y-12 lg:order-1">
        <div className="flex items-end justify-between border-b border-border/40 pb-4">
          <Skeleton className="h-12 w-64 rounded-xl" />
        </div>
        <div className="space-y-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-start gap-8 border-b border-border/40 py-10">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-3 w-32 rounded-full" />
                </div>
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
              <Skeleton className="aspect-video w-32 rounded-xl bg-muted sm:block md:w-44 lg:w-52 hidden" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Sidebar Skeleton (Right) ── */}
      <aside className="sticky top-16 order-2 hidden h-fit w-[320px] flex-col gap-8 border-l border-border/40 pl-10 lg:flex">
        <Skeleton className="size-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="w-full space-y-3 border-t border-border/40 pt-4">
          <Skeleton className="h-10 w-full rounded-full" />
          <Skeleton className="h-8 w-1/2 rounded-full" />
        </div>
      </aside>
    </div>
  </div>
);
