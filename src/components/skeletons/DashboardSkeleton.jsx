import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <Card className="border-none shadow-none bg-transparent">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>

          <div className="flex w-full md:w-auto items-center gap-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <Card className="border shadow-sm overflow-hidden">
          <div className="p-4">
            {/* Table Header */}
            <div className="flex items-center justify-between mb-4 px-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>

            {/* Table Rows */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-4 px-4 border-t"
              >
                <div className="flex flex-col gap-2 w-1/3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;
