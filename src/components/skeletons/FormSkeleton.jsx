import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const FormSkeleton = () => {
  return (
    <div className="container max-w-3xl py-8">
      <Skeleton className="h-10 w-32 mb-4" /> {/* Back button */}

      <Card className="border-none shadow-none">
        <CardHeader className="px-0 space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-64" />
        </CardHeader>

        <CardContent className="px-0 space-y-6">
          <div className="space-y-2">
             <Skeleton className="h-5 w-16" /> {/* Label */}
             <Skeleton className="h-12 w-full" /> {/* Input */}
          </div>

          <div className="space-y-2">
             <Skeleton className="h-5 w-20" /> {/* Label */}
             <Skeleton className="h-[400px] w-full" /> {/* Textarea */}
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
             <Skeleton className="h-10 w-24" />
             <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormSkeleton;
