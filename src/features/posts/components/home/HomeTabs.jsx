import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const HomeTabs = ({ activeMode, onModeChange, isAuthenticated, searchTerm, onSearchChange }) => {
  return (
    <div className="border-border/20 bg-background/95 sticky top-16 z-30 -mx-4 mb-2 border-b px-4 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-4">
        {/* Tabs - Align to the bottom of the container */}
        <div className="flex h-full items-end gap-8">
          {['explore', 'following']
            .filter((mode) => mode !== 'following' || isAuthenticated)
            .map((mode) => (
              <button
                key={mode}
                onClick={() => onModeChange(mode)}
                className={cn(
                  'relative pb-4 text-[14px] font-bold tracking-tight transition-all duration-300',
                  activeMode === mode
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground/70',
                )}
              >
                {mode === 'explore' ? 'For you' : 'Following'}
                {activeMode === mode && (
                  <span className="bg-foreground absolute -bottom-px left-0 h-[2px] w-full transition-all" />
                )}
              </button>
            ))}
        </div>

        {/* Search - Vertically centered in the height */}
        <div className="hidden items-center sm:flex">
          <div className="group relative w-64">
            <Search className="text-muted-foreground/50 group-focus-within:text-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 transition-colors" />
            <Input
              type="search"
              placeholder="Search stories..."
              className="bg-muted/20 border-border/10 focus:bg-muted/40 ring-foreground/10 focus:ring-ring h-8 w-full rounded-md pl-9 text-[13px] shadow-none transition-all"
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTabs;
