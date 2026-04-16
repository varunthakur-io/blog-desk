import { Skeleton } from '@/components/ui/skeleton';

export const PostDetailsSkeleton = () => {
  return (
    <article className="animate-in fade-in space-y-page-gap duration-700">
      <div className="w-full">
        {/* Header Skeleton */}
        <header className="w-full pb-12">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <div className="h-4 w-px bg-border/60" aria-hidden="true" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-12 w-4/5 rounded-xl md:w-2/3 lg:w-1/2" />
              <Skeleton className="h-12 w-3/5 rounded-xl md:w-1/2 lg:w-1/3" />
            </div>

            <div className="flex items-center justify-between border-y border-border/40 py-6">
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-48 rounded-md" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="size-10 rounded-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="mx-auto max-w-[800px] space-y-12 pb-20">
          <Skeleton className="aspect-video w-full rounded-3xl" />
          
          <div className="space-y-4">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostDetailsSkeleton;
