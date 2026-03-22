import { Skeleton } from '@/components/ui/skeleton';

const PostDetailsSkeleton = () => {
  return (
    <div className="page-root">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-0 lg:gap-8 xl:gap-12">
        {/* left sidebar */}
        <div className="hidden lg:flex flex-col gap-6">
          {/* back button */}
          <Skeleton className="h-9 w-full rounded-md" />
          {/* author */}
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
          {/* post info */}
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
          {/* actions */}
          <div>
            <Skeleton className="h-3 w-14 mb-2" />
            <div className="space-y-1">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* center article */}
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

        {/* right column removed */}
      </div>
    </div>
  );
};

export default PostDetailsSkeleton;
