import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton = () => {
  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <div className="flex items-center gap-4">
        <Skeleton className="size-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-64 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full sm:ml-auto" />
      </div>

      <div className="border-border/40 bg-background overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-border/40 bg-muted/30 flex items-center border-b px-6 py-4">
          <Skeleton className="h-3 w-1/3 rounded-full" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="border-border/40 flex items-center justify-between border-b px-6 py-5 last:border-0"
          >
            <div className="w-[420px]">
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
