import { Skeleton } from '@/components/ui/skeleton';

const AppSkeleton = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl h-16 flex items-center shrink-0">
        <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full hidden md:block" />
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-5 w-24 hidden sm:block" />
            </div>
          </div>
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <Skeleton className="h-9 w-full rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Global SideNav Skeleton */}
        <div className="hidden md:block w-64 border-r border-border/50 p-6 space-y-8">
          <Skeleton className="h-11 w-full rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-3 w-20 rounded-full" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-3 w-24 rounded-full" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <div className="space-y-10">
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/3 rounded-xl" />
              <Skeleton className="h-6 w-1/2 rounded-md" />
            </div>

            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-8 items-start py-10 border-b border-border/40">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-3 w-32 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                  </div>
                  <Skeleton className="w-32 md:w-44 lg:w-52 aspect-video rounded-xl hidden sm:block" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppSkeleton;
