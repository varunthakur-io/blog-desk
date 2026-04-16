import { Skeleton } from '@/components/ui/skeleton';

export const PostCardSkeleton = () => {
  return (
    <article className="group relative border-b border-border/40 py-10 transition-colors duration-500 hover:bg-muted/5 last:border-0">
      <div className="flex min-h-[140px] items-start justify-between gap-8 sm:gap-12">
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

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-5">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-md" />
              <div className="hidden h-3 w-px bg-border/40 xs:block" aria-hidden="true" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-10 rounded-md" />
                <Skeleton className="h-4 w-10 rounded-md" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="size-8 rounded-full" />
            </div>
          </div>
        </div>

        <div className="ml-4 hidden shrink-0 sm:block">
          <Skeleton className="aspect-video w-32 rounded-xl bg-muted md:w-44 lg:w-52" />
        </div>
      </div>
    </article>
  );
};

export default PostCardSkeleton;
