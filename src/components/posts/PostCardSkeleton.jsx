import { Skeleton } from '@/components/ui/skeleton';

const PostCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-pulse">
      {/* Cover image placeholder */}
      <Skeleton className="aspect-[16/9] w-full rounded-none" />

      <div className="pt-4 px-5 pb-5 flex flex-col gap-3">
        {/* Badge + meta row */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 rounded-md" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-3.5 w-8 rounded" />
            <Skeleton className="h-3.5 w-8 rounded" />
            <Skeleton className="h-3.5 w-8 rounded" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-3/4 rounded" />
        </div>

        {/* Footer */}
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

export default PostCardSkeleton;
