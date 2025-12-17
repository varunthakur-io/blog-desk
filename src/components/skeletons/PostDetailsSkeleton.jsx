import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PostDetailsSkeleton = () => {
  return (
    <div className="py-2">
      <Card className="p-0 border-none">
        <CardHeader className="border-0 pb-4 px-0">
          <div className="flex justify-between items-start px-4 sm:px-6 lg:px-8">
            <div className="flex-1 space-y-4">
              {/* Title */}
              <Skeleton className="h-10 w-3/4 sm:w-5/6" />
              <Skeleton className="h-10 w-2/3 hidden sm:block" />

              {/* Meta badges */}
              <div className="flex items-center gap-3 mt-3">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Back Button */}
            <div className="shrink-0 ml-4">
               <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* Content */}
        <CardContent className="pt-6 px-0">
           <div className="px-4 sm:px-6 lg:px-8 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-64 w-full rounded-xl my-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetailsSkeleton;
