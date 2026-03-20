import { Skeleton } from '@/components/ui/skeleton';

const AppSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur">
        <div className="page-wrapper flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-5 w-24 hidden sm:block" />
            </div>
            <div className="hidden md:flex items-center gap-1">
              {[60, 72, 44, 52].map((w, i) => (
                <Skeleton key={i} className={`h-7 w-${w === 60 ? '16' : w === 72 ? '20' : w === 44 ? '12' : '14'} rounded-md`} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="page-wrapper py-12">
        <div className="flex flex-col items-center text-center gap-4 mb-14 max-w-2xl mx-auto">
          <Skeleton className="h-5 w-52 rounded-full" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-12 w-3/5" />
          <Skeleton className="h-5 w-3/4 mt-1" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-11 w-64 rounded-xl mt-2" />
        </div>

        {/* Featured */}
        <Skeleton className="w-full h-96 rounded-2xl mb-10" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-xl border border-border/40 p-4">
              <Skeleton className="h-44 w-full rounded-lg" />
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AppSkeleton;
