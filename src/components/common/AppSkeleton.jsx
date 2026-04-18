import { Skeleton } from '@/components/ui/skeleton';

const AppSkeleton = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="border-border/50 bg-background/85 sticky top-0 z-50 flex h-16 w-full shrink-0 items-center border-b backdrop-blur-xl">
        <div className="flex w-full items-center justify-between gap-4 px-page-px">
          <div className="flex items-center gap-4">
            <Skeleton className="hidden h-9 w-9 rounded-full md:block" />
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="hidden h-5 w-24 sm:block" />
            </div>
          </div>
          <div className="mx-4 hidden max-w-sm flex-1 md:flex">
            <Skeleton className="h-9 w-full rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Global SideNav Skeleton */}
        <div className="border-border/50 hidden w-64 space-y-8 border-r p-6 md:block">
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
        <main className="mx-auto max-w-screen-2xl flex-1 px-page-px py-8">
          <div className="space-y-10">
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/3 rounded-xl" />
              <Skeleton className="h-6 w-1/2 rounded-md" />
            </div>

            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-border/40 flex items-start gap-8 border-b py-10">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-3 w-32 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                  </div>
                  <Skeleton className="hidden aspect-video w-32 rounded-xl sm:block md:w-44 lg:w-52" />
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
