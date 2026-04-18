import { Skeleton } from '@/components/ui/skeleton';

export const FormSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[40vh] w-full" />
      </div>
      <div className="flex justify-end gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};
