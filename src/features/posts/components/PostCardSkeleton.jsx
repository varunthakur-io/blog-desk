// PostCardSkeleton: placeholder for article card loading state
import { Skeleton } from '@/components/ui/skeleton';

export const PostCardSkeleton = () => {
  return (
    <article className="group border-border/40 hover:bg-muted/5 relative border-b py-8 transition-colors duration-500 last:border-0">
      <div className="flex min-h-[140px] items-start justify-between gap-8 sm:gap-12">
        {/* Content */}
        <div className="min-w-0 flex-1 space-y-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-3 w-32 rounded-full" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4 rounded-lg sm:w-2/3" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-5/6 rounded-md" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-full" />
            </div>

            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-12 rounded-md" />
              <div className="bg-border/20 mx-1 h-4 w-px" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="order-1 shrink-0 sm:order-2">
          <Skeleton className="bg-muted aspect-square w-24 rounded-md sm:w-32 md:w-40" />
        </div>
      </div>
    </article>
  );
};

export default PostCardSkeleton;
