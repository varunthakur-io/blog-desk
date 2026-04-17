import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPagination = ({
  page,
  totalPages,
  totalPosts,
  currentCount,
  onPrev,
  onNext,
}) => (
  <div className="flex items-center justify-between py-10 px-0">
    <p className="text-[13px] font-medium text-muted-foreground">
      Showing <span className="font-bold text-foreground tabular-nums">{currentCount}</span> of{' '}
      <span className="font-bold text-foreground tabular-nums">{totalPosts}</span> stories
    </p>
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={page === 1}
        className="h-9 rounded-md px-4 gap-2 text-xs font-bold hover:bg-muted transition-all"
      >
        <ChevronLeft className="h-4 w-4" /> Newer
      </Button>
      <span className="text-xs font-bold text-muted-foreground px-2 tabular-nums">
        {page} / {totalPages || 1}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={page >= totalPages}
        className="h-9 rounded-md px-4 gap-2 text-xs font-bold hover:bg-muted transition-all"
      >
        Older <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default DashboardPagination;
