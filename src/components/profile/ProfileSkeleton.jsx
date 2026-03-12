import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          {/* Avatar */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="flex-1 min-w-0 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>

          {/* Stats & Action Button */}
          <div className="ml-auto flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
            <div className="hidden md:flex items-center gap-4">
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>

        {/* Mobile Stats (if any, usually redundant in skeleton if hidden above but good for consistency) */}

        {/* Bio */}
        <div className="max-w-2xl mb-8 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b pb-4">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border/50 bg-card/50 p-4"
              >
                <div className="space-y-3 mb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
