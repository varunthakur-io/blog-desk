import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PostCardSkeleton = () => {
  return (
    <Card className="flex flex-col overflow-hidden border-border/40 bg-card animate-pulse">
      {/* Cover image placeholder */}
      <Skeleton className="aspect-[16/9] w-full rounded-none" />

      <CardHeader className="pb-2 px-5 pt-5">
        {/* Badge + meta */}
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-16 rounded-sm" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-4/5 rounded" />
        </div>
      </CardHeader>

      <CardContent className="flex-grow px-5 pb-3">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-3/4 rounded" />
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-3 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-4 w-10 rounded" />
      </CardFooter>
    </Card>
  );
};

export default PostCardSkeleton;
