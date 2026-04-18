import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPagination = ({ page, totalPages, totalPosts, currentCount, onPrev, onNext }) => (
  <div className="flex items-center justify-between px-0 py-10">
    <p className="text-muted-foreground text-[13px] font-medium">
      Showing <span className="text-foreground font-bold tabular-nums">{currentCount}</span> of{' '}
      <span className="text-foreground font-bold tabular-nums">{totalPosts}</span> stories
    </p>
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={page === 1}
        className="hover:bg-muted h-9 gap-2 rounded-md px-4 text-xs font-bold transition-all"
      >
        <ChevronLeft className="h-4 w-4" /> Newer
      </Button>
      <span className="text-muted-foreground px-2 text-xs font-bold tabular-nums">
        {page} / {totalPages || 1}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={page >= totalPages}
        className="hover:bg-muted h-9 gap-2 rounded-md px-4 text-xs font-bold transition-all"
      >
        Older <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default DashboardPagination;
