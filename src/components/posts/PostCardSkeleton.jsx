import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, User, Calendar } from 'lucide-react';

const PostCardSkeleton = () => {
  return (
    <Card className="group h-full flex flex-col overflow-hidden border-border/50 bg-card/50 animate-pulse">
      <CardHeader className="pb-3 pt-6 px-6">
        {/* Top badge + read time */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3 text-muted-foreground/40" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3 mb-4">
          <Skeleton className="h-7 w-full rounded-lg" />
          <Skeleton className="h-7 w-5/6 rounded-lg" />
        </div>

        {/* Author + Date */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground/40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="h-1 w-1 rounded-full bg-border/30" />
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground/40" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </CardHeader>

      {/* Excerpt */}
      <CardContent className="flex-1 px-6 pb-3">
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
        </div>
      </CardContent>

      {/* Button */}
      <CardFooter className="px-6 pb-6 pt-4">
        <Skeleton className="h-11 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
};

export default PostCardSkeleton;
