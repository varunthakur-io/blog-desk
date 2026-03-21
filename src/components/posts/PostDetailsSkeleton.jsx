import { Skeleton } from '@/components/ui/skeleton';

const PostDetailsSkeleton = () => {
  return (
    <div className="page-root max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-10">
          {/* Category + title */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-4/5" />
          </div>

          {/* Cover image */}
          <Skeleton className="w-full aspect-[2/1] rounded-2xl" />

          {/* Body paragraphs */}
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
          <div className="sticky top-24 space-y-3">
            {/* Author card */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-px w-full" />
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
            {/* Like + share card */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-8 rounded-lg" />
                <Skeleton className="h-8 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PostDetailsSkeleton;
