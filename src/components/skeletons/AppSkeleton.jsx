import { Skeleton } from '@/components/ui/skeleton';

const AppSkeleton = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-4">
             <Skeleton className="h-9 w-20 hidden sm:block" />
             <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="container py-10">
        {/* Hero / Header area */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
           <Skeleton className="h-12 w-3/4 sm:w-1/2" />
           <Skeleton className="h-6 w-2/3 sm:w-1/3" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="flex flex-col space-y-3">
               <Skeleton className="h-[200px] w-full rounded-xl" />
               <div className="space-y-2">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-4/5" />
               </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
};

export default AppSkeleton;
