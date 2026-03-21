import { Skeleton } from '@/components/ui/skeleton';

const FormSkeleton = () => {
  return (
    <div className="page-root flex gap-8">
      {/* Left sidebar */}
      <div className="hidden md:flex w-48 shrink-0 flex-col gap-6">
        {/* Back + title */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* Status */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
        {/* Category */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
        {/* Cover image */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="aspect-video w-full rounded-lg" />
        </div>
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-px w-full" />
        {/* Buttons */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 min-w-0">
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="border-b border-border bg-muted/30 px-3 py-2 flex items-center gap-1">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-md" />
            ))}
          </div>
          {/* Title + content */}
          <div className="p-6 md:p-8 space-y-4">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-px w-full" />
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;
